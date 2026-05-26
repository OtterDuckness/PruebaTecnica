export type EmailPreview = {
  id: string;
  subject: string;
  sender: string;
  snippet: string;
  date: string;
};

export type GmailFetchResult =
  | { ok: true; emails: EmailPreview[] }
  | { ok: false; error: string };
