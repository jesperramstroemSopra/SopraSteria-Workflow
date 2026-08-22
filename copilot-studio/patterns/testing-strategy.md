# Testing Strategy for Copilot Studio Agents

## Overview

Testing Copilot Studio agents requires a layered approach: topic-level unit tests, conversation flow tests, regression suites, and CI/CD integration. This document covers all four layers and provides a framework for test case structure.

---

## 1. Test Types Overview

| Test Type | Scope | Tool | When to Run | Who Runs |
|-----------|-------|------|------------|---------|
| **Unit / Topic Evaluation** | Single topic trigger and response | PPAPI Evaluate endpoint | Per topic, before PR merge | Developer |
| **Conversation Flow Test** | Multi-turn conversation path | DirectLine / Copilot Studio Test panel | Per feature, before UAT | Developer + QA |
| **Regression Suite** | All published topics | Copilot Studio Kit (batch) | Before every environment promotion | CI/CD pipeline |
| **Adversarial / Edge Case** | Out-of-scope inputs, hostile prompts | Manual + DirectLine | Before production go-live | QA |
| **Performance Test** | Response time under load | Custom HTTP load test | Before production go-live | Platform team |

---

## 2. Unit Testing Topics (PPAPI Evaluation)

PPAPI evaluation tests whether a given utterance routes to the correct topic and receives the expected response, without requiring the agent to be published.

### Test Case Structure

```json
{
  "testCases": [
    {
      "id": "TC-001",
      "topic": "CheckLeaveBalance",
      "utterance": "How many days off do I have?",
      "expectedTopicName": "CheckLeaveBalance",
      "expectedOutputContains": "leave balance",
      "tags": ["regression", "leave"]
    },
    {
      "id": "TC-002",
      "topic": "CheckLeaveBalance",
      "utterance": "AL balance",
      "expectedTopicName": "CheckLeaveBalance",
      "tags": ["regression", "leave"]
    },
    {
      "id": "TC-003",
      "topic": "Fallback",
      "utterance": "What is the weather today?",
      "expectedTopicName": "Fallback",
      "tags": ["regression", "negative"]
    }
  ]
}
```

### Running PPAPI Evaluation

```powershell
# Using PAC CLI to run evaluations against a draft agent
pac copilot test run `
  --environment "https://sopra-dev.crm4.dynamics.com" `
  --agent-name "HrFaqAgent" `
  --test-file "tests\evaluation\hr-agent-tests.json" `
  --output-folder "tests\results"
```

### Minimum Test Coverage

| Agent Type | Minimum Test Cases |
|-----------|-------------------|
| Internal FAQ | 20 utterances across all topics |
| Transactional (form submission) | 10 per topic + 5 negative cases |
| Customer-facing | 50+ utterances including edge cases |

---

## 3. Conversation Flow Testing

Conversation flow tests verify multi-turn sequences — that the agent maintains context across turns, collects slot values correctly, and handles branching paths.

### DirectLine Testing with PowerShell

```powershell
# Start a DirectLine conversation
$token = "YOUR_DIRECTLINE_SECRET"
$baseUrl = "https://directline.botframework.com/v3/directline"

# Create conversation
$conv = Invoke-RestMethod -Uri "$baseUrl/conversations" `
  -Method Post `
  -Headers @{ Authorization = "Bearer $token" }

$conversationId = $conv.conversationId

# Send a message
Invoke-RestMethod -Uri "$baseUrl/conversations/$conversationId/activities" `
  -Method Post `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body (@{
    type = "message"
    from = @{ id = "test-user" }
    text = "Check my leave balance"
  } | ConvertTo-Json)

# Read the response
Start-Sleep -Seconds 2
$activities = Invoke-RestMethod -Uri "$baseUrl/conversations/$conversationId/activities" `
  -Headers @{ Authorization = "Bearer $token" }

$botResponse = $activities.activities | Where-Object { $_.from.role -eq "bot" } | Select-Object -Last 1
Write-Host "Bot response: $($botResponse.text)"
```

### Multi-Turn Test Script Structure

```
Turn 1: "Submit a leave request"
  → Assert: Bot asks for leave type
Turn 2: "Annual leave"
  → Assert: Bot asks for start date
Turn 3: "Next Monday"
  → Assert: Bot asks for end date
Turn 4: "Next Friday"
  → Assert: Bot shows confirmation card
Turn 5: "Yes, confirm"
  → Assert: Bot confirms submission with request ID
```

---

## 4. Regression Test Suites with the Copilot Studio Kit

The [Copilot Studio Kit](https://github.com/microsoft/copilot-studio-kit) provides a framework for running batch regression tests across all agent topics.

### Setting Up the Kit

```powershell
# Clone the kit to your project tools folder
git clone https://github.com/microsoft/copilot-studio-kit.git tools\copilot-studio-kit
cd tools\copilot-studio-kit
npm install
```

### Running a Batch Test Suite

```powershell
cd tools\copilot-studio-kit
npm run test -- `
  --config "..\..\tests\kit-config.json" `
  --output "..\..\tests\results\regression-$(Get-Date -Format 'yyyyMMdd').json"
```

**`kit-config.json` example:**
```json
{
  "agentEnvironmentUrl": "https://sopra-dev.crm4.dynamics.com",
  "agentName": "HrFaqAgent",
  "testSuites": [
    "tests/suites/leave-topics.json",
    "tests/suites/benefits-topics.json",
    "tests/suites/fallback-topics.json"
  ],
  "passThreshold": 0.90
}
```

---

## 5. CI/CD Integration of Evaluations

Integrate PPAPI evaluations into the GitHub Actions pipeline to catch regressions before each environment promotion.

### GitHub Actions Step

```yaml
- name: Run Copilot Studio Evaluation
  run: |
    pac copilot test run `
      --environment "${{ secrets.PP_DEV_URL }}" `
      --agent-name "${{ env.AGENT_NAME }}" `
      --test-file "tests/evaluation/regression.json" `
      --output-folder "tests/results"
    
    # Check pass rate from output
    $results = Get-Content "tests/results/summary.json" | ConvertFrom-Json
    if ($results.passRate -lt 0.90) {
      Write-Error "Test pass rate $($results.passRate) is below threshold 0.90"
      exit 1
    }
  shell: pwsh
```

### Test Results Artifact Upload

```yaml
- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: copilot-test-results
    path: tests/results/
    retention-days: 30
```

---

## 6. Test File Organization

```
tests/
  evaluation/
    regression.json          # Full regression suite (all topics)
    smoke.json               # Minimal smoke test (5 critical paths)
  suites/
    leave-topics.json        # Topic-specific test suite
    fallback-topics.json     # Negative / fallback tests
  results/                   # Output folder (gitignored)
  flow-tests/
    submit-leave-request.ps1 # Multi-turn conversation flow test
    check-balance.ps1
```

Add `tests/results/` to `.gitignore` — never commit raw test result files.
