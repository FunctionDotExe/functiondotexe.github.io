"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { SUMMIT_CONTENT } from "@/lib/summit-content";

export function ContactActions() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const { email } = SUMMIT_CONTENT.identity;
  useEffect(() => () => { generation.current += 1; if (timer.current) clearTimeout(timer.current); }, []);
  const copy = async () => {
    const run = ++generation.current;
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      if (generation.current !== run) return;
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), 3500);
    } catch { if (generation.current === run) setStatus("failed"); }
  };
  return (
    <div className="contact-actions">
      <a className="contact-email" href={`mailto:${email}`} aria-label={`Email Ruben at ${email}`}>{email}<Mail aria-hidden="true" /></a>
      <button type="button" className="copy-email" onClick={copy}>{status === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{status === "copied" ? "Email copied" : "Copy email"}</button>
      <p className="copy-status" role="status">{status === "failed" ? "Copy isn’t available here. Select the email address above, or click it to open your email app." : status === "copied" ? "Ready to paste into your email app." : ""}</p>
    </div>
  );
}
