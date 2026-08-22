## Generative Answers — Patterns and Configuration

## Overview

Generative Answers allow a Copilot Studio agent to answer questions by searching knowledge sources (SharePoint, public URLs, Dataverse) and generating a synthesized response using Azure OpenAI. This document covers when to use generative answers, how to configure knowledge sources, content moderation, prompt engineering, and fallback behavior.

---

## 1. When to Use Generative Answers

Generative Answers are appropriate when:
- The information source is **unstructured** (documents, web pages, PDFs)
- The question set is **open-ended** and hard to enumerate as authored topics
- The content is **frequently updated** and it's impractical to keep authored topics in sync
- The risk of an imprecise answer is **low** (general information, not compliance-sensitive)

Generative Answers are **NOT appropriate** when:
- The answer must be exact (account numbers, regulatory requirements, contractual terms)
- The content is compliance-sensitive (HR policies with legal implications, medical guidance)
- Structured data lookup is needed (Dataverse records, API queries)
- The response requires a specific action (form submission, database write)

### Decision Table

| Content Type | Generative Answers? | Reason |
|-------------|-------------------|--------|
| General IT FAQ (how to reset password) | ✅ Yes | Low risk, broad question set, documented in IT KB |
| Leave policy details (general) | ✅ Yes | HR SharePoint documents it well; low compliance risk |
| Exact leave balance | ❌ No | Requires live Dataverse query; must be exact |
| Legal contract terms | ❌ No | Compliance risk; must be authored and reviewed |
| Product documentation search | ✅ Yes | Broad scope, unstructured docs, low risk |
| Payroll calculations | ❌ No | Must be exact; structured data query required |
| Onboarding FAQ | ✅ Yes | Broad question set, updated SharePoint docs |

---

## 2. Configuring Knowledge Sources

### SharePoint Knowledge Source

The recommended source for internal content.

**Setup:**
1. In Copilot Studio → Knowledge → Add → SharePoint
2. Enter the SharePoint site URL or specific library URL
3. Scope as narrowly as possible — a single library is better than the whole site
4. Grant the agent's service account **read** access to the SharePoint library

**Best Practices:**
- Structure SharePoint documents with clear headings (H1, H2) — the AI uses heading structure to understand document sections
- Add document metadata (title, category) to improve relevance ranking
- Archive old documents to a separate library to prevent outdated answers
- Maximum recommended document count per knowledge source: 1,000 files

### Public URL Knowledge Source

For publicly available documentation.

**Setup:**
1. Knowledge → Add → Public URL
2. Enter the base URL — Copilot Studio crawls linked pages up to 2 levels deep
3. Use specific URLs rather than broad domains where possible

**Limitations:**
- Crawl happens at indexing time — updates are not instant
- Only publicly accessible pages are crawled (no authentication)
- Rate limiting on crawls — index size matters for response quality

### Dataverse Knowledge

For structured, curated Q&A pairs.

**Setup:**
1. Create a custom Dataverse table: `spr_KnowledgeEntry` with columns `spr_question`, `spr_answer`, `spr_category`
2. Populate with curated Q&A pairs
3. Knowledge → Add → Dataverse → select the table

**When to Use:**
- When you need full control over what answers are generated
- When external documents are not available or not appropriate
- As a supplement to SharePoint sources for high-frequency questions

---

## 3. Content Moderation Settings

Copilot Studio includes built-in content moderation. Configure it in agent settings:

| Setting | Recommended Value | Notes |
|---------|------------------|-------|
| Content moderation level | Medium (for internal) / High (for external) | High rejects more off-topic content |
| Allow profanity | Off | Always off for business agents |
| Topics only mode | Off (if generative answers enabled) | On = agent only answers from authored topics |
| Confidentiality filter | On | Prevents the agent from repeating document metadata or URLs verbatim |

**Sopra Standard**: External-facing agents use **High** content moderation. Internal agents use **Medium** unless the client explicitly requires High.

---

## 4. Prompt Engineering for System Prompts

The system prompt (Instructions field in agent settings) defines the agent's persona and behavioral boundaries. For agents using generative answers:

### System Prompt Template

```
You are [AgentName], a helpful assistant for [Company/Department] employees.

Your purpose is to answer questions about [scope — e.g., "HR policies, leave, and employee benefits"].

Guidelines:
- Only answer questions based on the provided knowledge sources. Do not use general knowledge.
- If you cannot find the answer in the knowledge sources, say: "I don't have information about that. 
  Please contact [HR/IT/support team] at [contact]."
- Do not speculate, estimate, or make up information.
- Keep answers concise. Link to the source document when possible.
- Do not discuss topics outside your scope.
- Always respond in [language].

Tone: Professional, friendly, and concise.
```

### Prompt Engineering Rules

1. **Define scope explicitly** — "only answer questions about X" is more effective than "you are an X assistant"
2. **Define the fallback phrase** — a specific phrase is easier to test and monitor than a vague instruction
3. **Set tone** — consistency matters for brand alignment
4. **Avoid negative-only instructions** — pair "don't do X" with "instead do Y"
5. **Test edge cases** — out-of-scope questions, ambiguous questions, hostile prompts

---

## 5. Fallback Behavior

When generative answers cannot find relevant content in the knowledge source, the agent should degrade gracefully.

### Configuring Fallback

In Copilot Studio → Topics → `Fallback` (system topic):

1. Add a Condition: check if `System.Activity.Text` was handled by generative answers
2. If no answer found → redirect to escalation flow or show contact information
3. Log the unanswered question to Dataverse (`spr_UnansweredQuery` table) for review

### Fallback Response Design

```
"I couldn't find a clear answer to your question in our knowledge base.

Here are some options:
- 🔍 Try rephrasing your question
- 📧 Email [support@company.com]  
- 💬 Chat with a live agent [button]
- 📞 Call the helpdesk at [number]"
```

---

## 6. Configuration Example

### Example: HR FAQ Agent with SharePoint Knowledge

```yaml
# Agent-level settings (in Copilot Studio UI)
agentName: HrFaqAgent
systemPrompt: |
  You are the Sopra HR Assistant. Answer questions about HR policies, 
  leave entitlements, benefits, and onboarding using the provided HR 
  SharePoint documents. Do not answer questions outside HR scope.
  If unsure, direct users to hr@sopra.com.

knowledgeSources:
  - type: SharePoint
    url: https://sopra.sharepoint.com/sites/HRPolicies
    scope: /Shared Documents/Policies
  - type: SharePoint
    url: https://sopra.sharepoint.com/sites/HRPolicies
    scope: /Shared Documents/Benefits

contentModeration: Medium
allowGenerativeAnswers: true
topicsOnlyMode: false
```

### Testing Generative Answers

Before deploying to UAT, test:
1. **Positive cases**: 10 questions that should be answerable from knowledge sources → verify correct, relevant answers
2. **Negative cases**: 5 questions clearly outside scope → verify fallback triggers
3. **Edge cases**: Ambiguous questions, follow-up questions, multi-part questions
4. Use the **Test your agent** panel in Copilot Studio to verify each case
5. Run a formal PPAPI evaluation with a test set of 20+ utterances before UAT sign-off

---

## Upstream Reference

<!-- Upstream: microsoft/skills-for-copilot-studio — generative answers configuration patterns -->
<!-- Sopra Divergence: Added Dataverse logging for unanswered queries; upstream does not cover this -->
