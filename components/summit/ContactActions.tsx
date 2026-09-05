"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { SUMMIT_CONTENT } from "@/lib/summit-content";

export function ContactActions() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { email } = SUMMIT_CONTENT.identity;
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copy = async () => {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), 3500);
    } catch { setStatus("failed"); }
  };
  return (
    <div className="contact-actions">
      <a className="contact-email" href={`mailto:${email}`}>{email}<ArrowUpRight aria-hidden="true" /></a>
      <button type="button" className="copy-email" onClick={copy}>{status === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{status === "copied" ? "Email copied" : "Copy email"}</button>
      <p className="copy-status" role="status">{status === "failed" ? "Copy isn’t available here. Select the email address above, or click it to open your email app." : status === "copied" ? "Ready to paste into your email app." : ""}</p>
    </div>
  );
}
