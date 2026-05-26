import { debugLogGmailApiResponse, isGmailDebugEnabled } from "@/lib/gmail-debug";
import type { EmailPreview, GmailFetchResult } from "@/types/gmail";

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";
const DEFAULT_MAX_RESULTS = 5;

type GmailHeader = { name: string; value: string };

type GmailMessageListResponse = {
  messages?: { id: string }[];
};

type GmailMessageResponse = {
  id: string;
  snippet?: string;
  payload?: { headers?: GmailHeader[] };
};

function getHeader(headers: GmailHeader[], name: string): string {
  return (
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ??
    ""
  );
}

function parseSender(from: string): string {
  const match = from.match(/^(.+?)\s*<[^>]+>$/);
  const name = match?.[1]?.trim().replace(/^"|"$/g, "");
  return name || from || "Unknown sender";
}

function formatDate(raw: string): string {
  if (!raw) return "";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function gmailErrorMessage(res: Response): Promise<string> {
  if (res.status === 401) {
    return "Session expired. Please sign in again.";
  }
  if (res.status === 403) {
    return "Gmail access was denied. Sign out and sign in again to grant Gmail permissions.";
  }
  return `Gmail API returned ${res.status}.`;
}

async function fetchMessagePreview(
  accessToken: string,
  messageId: string,
): Promise<EmailPreview | null> {
  const params = new URLSearchParams({
    format: "metadata",
    metadataHeaders: "Subject",
  });
  params.append("metadataHeaders", "From");
  params.append("metadataHeaders", "Date");

  const res = await fetch(
    `${GMAIL_API}/messages/${messageId}?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    await debugLogGmailApiResponse(`messages.get id=${messageId}`, res);
    return null;
  }

  const data = (await res.json()) as GmailMessageResponse;
  const headers = data.payload?.headers ?? [];

  return {
    id: data.id,
    subject: getHeader(headers, "Subject") || "(No subject)",
    sender: parseSender(getHeader(headers, "From")),
    snippet: data.snippet ?? "",
    date: formatDate(getHeader(headers, "Date")),
  };
}

export async function fetchRecentEmails(
  accessToken: string,
  maxResults = DEFAULT_MAX_RESULTS,
): Promise<GmailFetchResult> {
  try {
    const listUrl = `${GMAIL_API}/messages?maxResults=${maxResults}&labelIds=INBOX`;
    if (isGmailDebugEnabled()) {
      console.log("[GmailDebug] Gmail API: messages.list request", {
        url: listUrl,
        tokenPresent: accessToken.length > 0,
        tokenLength: accessToken.length,
      });
    }

    const listRes = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!listRes.ok) {
      await debugLogGmailApiResponse("messages.list", listRes);
      return { ok: false, error: await gmailErrorMessage(listRes) };
    }

    if (isGmailDebugEnabled()) {
      await debugLogGmailApiResponse("messages.list (success)", listRes);
    }

    const listData = (await listRes.json()) as GmailMessageListResponse;
    const ids = listData.messages?.map((m) => m.id) ?? [];

    if (ids.length === 0) {
      return { ok: true, emails: [] };
    }

    const previews = await Promise.all(
      ids.map((id) => fetchMessagePreview(accessToken, id)),
    );

    const emails = previews.filter((email): email is EmailPreview => email !== null);

    if (emails.length === 0 && ids.length > 0) {
      return { ok: false, error: "Could not load message details from Gmail." };
    }

    return { ok: true, emails };
  } catch (error) {
    if (isGmailDebugEnabled()) {
      console.log("[GmailDebug] fetchRecentEmails exception", {
        message: error instanceof Error ? error.message : String(error),
      });
    }
    return { ok: false, error: "Could not connect to Gmail. Please try again later." };
  }
}
