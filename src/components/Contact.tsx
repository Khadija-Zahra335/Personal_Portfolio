"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, Loader2, Mail, MapPin, Send } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { useContent } from "@/components/ContentProvider";

type Status = "idle" | "sending" | "success" | "error";

function Field({
  id,
  label,
  type = "text",
  textarea = false,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const base =
    "peer w-full border-b border-text-secondary bg-transparent py-2 placeholder:text-text-secondary focus:border-transparent focus:outline-none";
  return (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} name={id} rows={5} placeholder={label} required={required} className={`${base} resize-none`} />
      ) : (
        <input id={id} name={id} type={type} placeholder={label} required={required} className={base} />
      )}
      {/* focus underline grows from the left */}
      <span
        className={`pointer-events-none absolute left-0 h-px w-0 bg-white transition-all duration-300 ease-in-out peer-focus:w-full ${
          textarea ? "bottom-1.5" : "bottom-0"
        }`}
      />
    </div>
  );
}

function SocialPill({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex items-center overflow-hidden rounded-full bg-tgc p-1.5 transition-all duration-300 md:p-2"
    >
      <span className="grid size-6 place-items-center md:size-7">{children}</span>
      <span className="max-w-0 -translate-x-2.5 overflow-hidden whitespace-nowrap text-sm opacity-0 transition-all delay-150 duration-500 ease-in-out group-hover:max-w-xs group-hover:translate-x-0 group-hover:pl-1 group-hover:pr-2 group-hover:opacity-100">
        {label}
      </span>
    </a>
  );
}

export default function Contact() {
  const { contactSection, profile } = useContent();
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: bots fill hidden fields, humans don't
    if (data.get("_honey")) return;

    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(profile.email)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: `${data.get("firstName")} ${data.get("lastName")}`.trim(),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          _subject: `Portfolio: ${data.get("subject")}`,
          _replyto: data.get("email"),
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === "false" || json.success === false) throw new Error("Failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <section id="contact" className="container-site relative scroll-mt-16 px-5 py-10 md:py-16 xl:px-0">
      <SectionHeading badge={contactSection.badge} title={contactSection.title} subtitle={contactSection.subtitle} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-6 flex flex-col gap-6 rounded-xl bg-fgc p-4 shadow-xl md:mt-12 md:flex-row md:gap-8 lg:p-10"
      >
        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-5 md:gap-7">
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className="grid grid-cols-1 gap-5 md:gap-7 lg:grid-cols-2">
            <Field id="firstName" label="First name" />
            <Field id="lastName" label="Last name" />
            <Field id="email" label="Email" type="email" />
            <Field id="subject" label="Subject" />
          </div>
          <Field id="message" label="Message" textarea />

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-tgc px-8 py-3 font-medium transition-colors duration-300 hover:bg-tgc/80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            <p aria-live="polite" className="text-sm">
              {status === "success" && <span className="text-highlight">Thanks! Your message has been sent.</span>}
              {status === "error" && (
                <span className="text-text-secondary">
                  Something went wrong — please email me directly at{" "}
                  <a href={`mailto:${profile.email}`} className="underline">
                    {profile.email}
                  </a>
                  .
                </span>
              )}
            </p>
          </div>
        </form>

        {/* Info card */}
        <div className="flex w-full flex-col justify-between gap-8 rounded-xl bg-bgc p-4 md:max-w-xs md:p-6 lg:max-w-sm">
          <div className="flex flex-col gap-6 md:gap-8">
            <h3 className="text-lg font-semibold text-text-turnery md:text-xl">{contactSection.cardHeading}</h3>

            <button
              type="button"
              onClick={copyEmail}
              className="flex w-full cursor-pointer items-center gap-3 text-left lg:gap-4"
              title="Copy email"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-tgc p-2 md:size-11 lg:size-12">
                <Mail className="size-full" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-text-turnery md:text-sm">EMAIL {copied ? "· copied!" : ""}</span>
                <span className="flex items-center gap-2 font-semibold">
                  <span className="truncate">{profile.email}</span>
                  {copied ? (
                    <Check className="size-4 shrink-0 text-highlight" />
                  ) : (
                    <Copy className="size-4 shrink-0 opacity-50" />
                  )}
                </span>
              </span>
            </button>

            <div className="flex items-center gap-3 lg:gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-tgc p-2 md:size-11 lg:size-12">
                <MapPin className="size-full" />
              </span>
              <span>
                <span className="block text-xs text-text-turnery md:text-sm">LOCATION</span>
                <span className="font-semibold">{contactSection.location}</span>
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-text-turnery">CONNECT WITH ME</p>
            <div className="flex flex-wrap gap-3">
              <SocialPill href={profile.github} label="GitHub">
                <GithubIcon className="size-5" />
              </SocialPill>
              <SocialPill href={profile.linkedin} label="LinkedIn">
                <LinkedinIcon className="size-5" />
              </SocialPill>
              <SocialPill href={`mailto:${profile.email}`} label="Email">
                <Mail className="size-5" />
              </SocialPill>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}