"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, FileText, ArrowLeft } from "lucide-react";
import { formatPrice, STORE_NAME } from "@/lib/utils";

const KICKOFF_FEE = 2500;
const REVENUE_SHARE = 30;

export default function QuotationPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "Lorraine Beauté",
    notes: "",
    agreed: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/quotation/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          kickoffFee: KICKOFF_FEE,
          revenueShare: REVENUE_SHARE,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Submit failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center bg-card border border-border p-10 rounded-sm"
        >
          <CheckCircle className="w-14 h-14 text-sage mx-auto mb-6" />
          <h1 className="font-serif text-3xl font-semibold mb-4">Thank You</h1>
          <p className="text-muted-foreground mb-8">
            Your approval has been submitted successfully. We will be in touch shortly to
            proceed with the kick-off payment and launch.
          </p>
          <Link
            href="/"
            className="inline-block bg-accent text-white px-8 py-3 rounded-full text-sm tracking-wide uppercase"
          >
            View Store Preview
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to store preview
        </Link>

        <div className="text-center mb-12">
          <p className="font-cursive text-5xl text-accent-dark mb-2">{STORE_NAME}</p>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Project Quotation
          </p>
        </div>

        <div className="bg-card border border-border rounded-sm overflow-hidden mb-10">
          <div className="bg-accent-dark text-white px-8 py-6 flex items-center gap-3">
            <FileText className="w-5 h-5" />
            <div>
              <h1 className="font-serif text-2xl font-semibold">Online Store Proposal</h1>
              <p className="text-white/60 text-sm">Prepared by VILATECH</p>
            </div>
          </div>

          <div className="p-8 space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-xs tracking-[0.2em] uppercase font-medium text-accent mb-3">
                Overview
              </h2>
              <p className="text-muted-foreground">
                This quotation covers the launch of a fully designed, modern e-commerce store for{" "}
                <strong className="text-foreground">{STORE_NAME}</strong> — including AI skin
                analysis, product catalogue, checkout, and client-ready presentation for review.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.2em] uppercase font-medium text-accent mb-3">
                Kick-Off Fee
              </h2>
              <div className="bg-muted/50 border border-border rounded-sm p-6 flex items-center justify-between">
                <div>
                  <p className="font-medium">Store Launch & Google Listing Setup</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Deployment, domain configuration, Google Business listing, and going live
                  </p>
                </div>
                <p className="font-serif text-3xl font-semibold text-accent-dark">
                  {formatPrice(KICKOFF_FEE)}
                </p>
              </div>
              <p className="text-muted-foreground text-xs mt-3">
                This one-time kick-off payment enables us to deploy the store online and register
                the business on Google so customers can find {STORE_NAME} through search.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.2em] uppercase font-medium text-accent mb-3">
                What&apos;s Included
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>✦ Luxury e-commerce storefront with branded loading experience</li>
                <li>✦ AI-powered skin analysis & product recommendations</li>
                <li>✦ Product catalogue, cart, checkout & mobile-ready design</li>
                <li>✦ Vercel cloud hosting deployment</li>
                <li>✦ Google listing setup to improve online visibility</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.2em] uppercase font-medium text-accent mb-3">
                Ongoing Revenue Share
              </h2>
              <p className="text-muted-foreground">
                Beyond the kick-off fee, VILATECH will receive{" "}
                <strong className="text-foreground">{REVENUE_SHARE}% of all store revenue</strong>{" "}
                generated through the platform. This aligns our success with the continued growth
                and performance of {STORE_NAME}. Both parties acknowledge this arrangement as part
                of the ongoing partnership.
              </p>
            </section>

            <section className="border-t border-border pt-6">
              <div className="flex justify-between items-end">
                <p className="text-muted-foreground">Total due to commence</p>
                <p className="font-serif text-4xl font-semibold">{formatPrice(KICKOFF_FEE)}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Revenue share of {REVENUE_SHARE}% applies thereafter on all sales.
              </p>
            </section>
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm p-8">
          <h2 className="font-serif text-2xl font-semibold mb-2">Approve This Quotation</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Complete the form below to submit your approval. We will contact you to arrange the
            kick-off payment.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs tracking-wide uppercase text-muted-foreground mb-1.5 block">
                  Full Name *
                </label>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-accent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-xs tracking-wide uppercase text-muted-foreground mb-1.5 block">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-accent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs tracking-wide uppercase text-muted-foreground mb-1.5 block">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-accent"
                placeholder="+27 ..."
              />
            </div>

            <div>
              <label className="text-xs tracking-wide uppercase text-muted-foreground mb-1.5 block">
                Additional Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none"
                placeholder="Any questions or special requests..."
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={form.agreed}
                onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                className="mt-1 accent-accent"
              />
              <span className="text-sm text-muted-foreground leading-relaxed">
                I approve this quotation of {formatPrice(KICKOFF_FEE)} as the kick-off fee and
                acknowledge the ongoing {REVENUE_SHARE}% revenue share arrangement with VILATECH
                as outlined above.
              </span>
            </label>

            {status === "error" && (
              <p className="text-sm text-accent">
                Something went wrong. Please try again or contact us directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting" || !form.agreed}
              className="w-full bg-accent text-white py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {status === "submitting" ? "Submitting..." : "Submit Approval"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          VILATECH · {new Date().getFullYear()} · Quotation valid for 30 days
        </p>
      </div>
    </main>
  );
}
