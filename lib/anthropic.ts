import Anthropic from "@anthropic-ai/sdk";
import type { EmailPreview } from "@/types/gmail";

const MODEL = "claude-sonnet-4-0";
const MAX_EMAILS = 5;

export type EmailSummaryResult = {
  summary: string;
  actionItems: string | null;
};

function buildPrompt(emails: EmailPreview[]): string {
  const items = emails.slice(0, MAX_EMAILS).map(
    (email, index) =>
      `${index + 1}. From: ${email.sender}
   Subject: ${email.subject}
   Date: ${email.date || "unknown"}
   Snippet: ${email.snippet}`,
  );

  return `Review these recent inbox emails and respond in plain text only (no JSON).

Use exactly these two section headers:

Summary:
Write 2-4 concise sentences focused on important updates, requests, meetings, and deadlines.

Action items:
List important action items as short bullet lines starting with "-".
If there are no clear action items, write exactly: None

Do not invent details.

${items.join("\n\n")}`;
}

function parseEmailSummaryResponse(text: string): EmailSummaryResult {
  const match = text.match(/\nAction items:\s*\n/i);

  if (!match || match.index === undefined) {
    return { summary: text.trim(), actionItems: null };
  }

  const summaryPart = text.slice(0, match.index).replace(/^Summary:\s*/i, "").trim();
  const actionPart = text.slice(match.index + match[0].length).trim();

  const actionItems =
    !actionPart || /^none\.?$/i.test(actionPart) ? null : actionPart;

  return {
    summary: summaryPart || text.trim(),
    actionItems,
  };
}

export function formatEmailSummaryForStorage(
  result: EmailSummaryResult,
): string {
  if (!result.actionItems) {
    return result.summary;
  }
  return `${result.summary}\n\nAction items:\n${result.actionItems}`;
}

export async function generateEmailSummary(
  emails: EmailPreview[],
): Promise<EmailSummaryResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || emails.length === 0) {
    return null;
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      temperature: 0.3,
      messages: [{ role: "user", content: buildPrompt(emails) }],
    });

    const text = response.content.find((block) => block.type === "text");
    if (text?.type !== "text") {
      return null;
    }

    const trimmed = text.text.trim();
    return trimmed ? parseEmailSummaryResponse(trimmed) : null;
  } catch (error) {
    console.error(
      "[Anthropic] generateEmailSummary failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
