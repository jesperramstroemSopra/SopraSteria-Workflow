// Extension: workflow-skills
// Reusable workflow tools for analyze, present, grill, plan, review, implement, and test stages.

import { joinSession } from "@github/copilot-sdk/extension";
import fs from "node:fs/promises";
import path from "node:path";

const STAGES = [
    "analyze-project",
    "present-analysis",
    "grill-me",
    "create-plan",
    "review-plan",
    "implement-plan",
    "test-solution",
];

function workspaceRoot(session) {
    return session.workspacePath ?? process.cwd();
}

async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

async function writeArtifact(session, stage, content) {
    const root = workspaceRoot(session);
    const base = path.join(root, "workflow");
    const stageDir = path.join(base, stage);
    await ensureDir(stageDir);
    const file = path.join(stageDir, `${Date.now()}.md`);
    await fs.writeFile(file, content, "utf8");
    return file;
}

function buildPrompt(stage, args) {
    const projectType = args.projectType ?? "unknown";
    const analysisType = args.analysisType ?? "review";
    const subject = args.subject ?? "the current project";
    return [
        `Stage: ${stage}`,
        `Project type: ${projectType}`,
        `Analysis type: ${analysisType}`,
        `Subject: ${subject}`,
        `Focus docs: Copilot Studio, Power Automate, Dataverse, Solutions`,
        `User request: ${args.request ?? "continue the workflow"}`,
    ].join("\n");
}

const session = await joinSession({
    tools: STAGES.map((name) => ({
        name,
        description: `Run the ${name} workflow stage and save an artifact to the workspace.`,
        parameters: {
            type: "object",
            properties: {
                projectType: { type: "string", description: "copilot, power automate, dataverse, solutions, etc." },
                analysisType: { type: "string", description: "architecture, risk, quality, optimization, migration, review" },
                subject: { type: "string", description: "What to evaluate" },
                request: { type: "string", description: "The user goal or instruction" },
            },
        },
        handler: async (args) => {
            const prompt = buildPrompt(name, args);
            const artifact = await writeArtifact(session, name, `# ${name}\n\n${prompt}\n`);
            await session.log(`Saved ${name} artifact: ${artifact}`);
            return {
                textResultForLlm: `Saved ${name} artifact at ${artifact}\n\n${prompt}`,
                resultType: "success",
            };
        },
    })),
});
