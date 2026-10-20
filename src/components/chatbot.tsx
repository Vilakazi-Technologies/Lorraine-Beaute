"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useCatalog } from "@/lib/catalog-context";
import { ChatProductSuggestions } from "./chat-product-suggestions";

interface Message {
  role: "user" | "assistant";
  content: string;
  productIds?: string[];
}

export function Chatbot() {
  const { products: catalog } = useCatalog();
  const [open, setOpen] = useState(false);
  const [poweredBy, setPoweredBy] = useState("ViLATECH AI");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your Lorraine Beauté assistant powered by ViLATECH AI. I can recommend K-beauty from our live catalog, explain Skin Analysis, or help you checkout. What are you looking for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: messages }),
      });

      const data = await res.json();
      if (data.poweredBy) setPoweredBy(data.poweredBy);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          productIds: Array.isArray(data.productIds) ? data.productIds : [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please try again or email hello@lorrainebeauty.com",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedProducts = useMemo(() => {
    const map = new Map(catalog.map((p) => [p.id, p]));
    return (ids: string[] | undefined) =>
      (ids ?? []).map((id) => map.get(id)).filter(Boolean) as typeof catalog;
  }, [catalog]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-24 right-4 z-50 w-[90vw] max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: "min(520px, 72vh)" }}
          >
            <div className="bg-accent-dark text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <div>
                  <p className="text-sm font-medium">Beauty Assistant</p>
                  <p className="text-[10px] text-white/60">{poweredBy}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[90%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent text-white rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "assistant" && msg.productIds && msg.productIds.length > 0 && (
                    <div className="max-w-[90%] w-full">
                      <ChatProductSuggestions products={suggestedProducts(msg.productIds)} />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border p-3 flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about products..."
                className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-accent text-white p-2.5 rounded-full hover:bg-accent-dark transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-accent-dark text-white rounded-full shadow-lg flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Open chat assistant"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
}
