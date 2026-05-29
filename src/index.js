import "dotenv/config";
import { Agent, CursorAgentError } from "@cursor/sdk";

const ENHANCE_PROMPT = (task) => `You are a task planning assistant. Given the task below, produce a clear, actionable step-by-step process.

Requirements:
- Break the work into ordered steps that someone can follow sequentially
- Each step should be specific and actionable
- Include prerequisites or dependencies where relevant
- Keep steps concise but complete enough to execute
- Use numbered steps with a short title and brief details

Task:
${task}`;

const REQUIRED_ENV = ["CURSOR_API_KEY"];

const checkEnv = () => {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    console.error(`Missing required environment variable(s): ${missing.join(", ")}`);
    console.error("Copy .env.example to .env and add your values.");
    process.exit(1);
  }

  return {
    apiKey: process.env.CURSOR_API_KEY,
    model: process.env.CURSOR_MODEL ?? "composer-2.5",
  };
};

const readTask = async () => {
  const arg = process.argv.slice(2).join(" ").trim();
  if (arg) return arg;

  if (process.stdin.isTTY) {
    console.error("Usage: npm run enhance -- \"Your task description\"");
    console.error("   or: echo \"Your task\" | npm run enhance");
    process.exit(1);
  }

  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const input = Buffer.concat(chunks).toString("utf8").trim();
  if (!input) {
    console.error("No task provided.");
    process.exit(1);
  }
  return input;
};

const enhanceTask = async (task, { apiKey, model }) => {
  try {
    const result = await Agent.prompt(ENHANCE_PROMPT(task), {
      apiKey,
      model: { id: model },
      local: { cwd: process.cwd() },
    });

    if (result.status === "error") {
      console.error(`Enhancement failed (run: ${result.id})`);
      process.exit(2);
    }

    console.log(result.result ?? "No result returned.");
  } catch (err) {
    if (err instanceof CursorAgentError) {
      console.error(`Startup failed: ${err.message} (retryable=${err.isRetryable})`);
      process.exit(1);
    }
    throw err;
  }
};

async function main() {
  const env = checkEnv();
  const task = await readTask();
  await enhanceTask(task, env);
}

main();
