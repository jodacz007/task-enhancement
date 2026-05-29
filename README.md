# Task Enhancement

A Node.js CLI that takes a task description and uses the [Cursor SDK](https://cursor.com/docs/sdk/typescript) to expand it into a clear, actionable step-by-step process.

## What it does

You provide a task — for example, "Implement user authentication with OAuth" — and the program sends it to a Cursor agent. The agent returns an ordered list of steps with titles and details, including prerequisites and dependencies where relevant.

The output is printed to stdout and can be used as a plan before starting work.

## Requirements

- Node.js 20+
- A [Cursor API key](https://cursor.com/dashboard/integrations)

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and set your `CURSOR_API_KEY`.

## Usage

**Pass the task as an argument:**

```bash
npm run enhance -- "Deploy the app to production"
```

**Pipe the task from stdin:**

```bash
echo "Build a login page" | npm run enhance
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `CURSOR_API_KEY` | Yes | Your Cursor API key |
| `CURSOR_MODEL` | No | Model to use (default: `composer-2.5`) |

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Success — steps printed to stdout |
| `1` | Startup failure (missing env, auth error, network) |
| `2` | Agent run started but failed |
