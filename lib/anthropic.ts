import Anthropic from "@anthropic-ai/sdk";
import type { EmailPreview } from "@/types/gmail";

const MODEL = "claude-sonnet-4-0";
const MAX_EMAILS = 5;

function buildPrompt(emails: EmailPreview[]): string {
  const items = emails.slice(0, MAX_EMAILS).map(
    (email, index) =>
      `${index + 1}. From: ${email.sender}
   Subject: ${email.subject}
   Date: ${email.date || "unknown"}
   Snippet: ${email.snippet}`,
  );

  return `Summarize these recent inbox emails in 2-4 concise sentences.
Focus on important updates, requests, meetings, deadlines, and action items.
Do not invent details.

${items.join("\n\n")}`;
}

export async function generateEmailSummary(
  emails: EmailPreview[],
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || emails.length === 0) {
    return null;
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      temperature: 0.3,
      messages: [{ role: "user", content: buildPrompt(emails) }],
    });

    const text = response.content.find((block) => block.type === "text");
    return text?.type === "text" ? text.text.trim() : null;
  } catch (error) {
    console.error(
      "[Anthropic] generateEmailSummary failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
