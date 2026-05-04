"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";

interface ContactFormContentProps {
  id: string;
  heading?: string | null;
  subtitle?: string | null;
  nameLabel?: string | null;
  emailLabel?: string | null;
  phoneLabel?: string | null;
  subjectLabel?: string | null;
  messageLabel?: string | null;
  namePlaceholder?: string | null;
  emailPlaceholder?: string | null;
  phonePlaceholder?: string | null;
  subjectPlaceholder?: string | null;
  messagePlaceholder?: string | null;
  submitButtonText?: string | null;
  sendingButtonText?: string | null;
}

interface ContactFormProps {
  content?: ContactFormContentProps | null;
}

export function ContactForm({ content }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Message sent successfully!");
        reset();
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 gradient-border p-6 bg-card rounded-lg">
      <h3 className="font-semibold text-lg mb-4">{content?.heading ?? "Send us a Message"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{content?.nameLabel ?? "Name *"}</Label>
          <Input id="name" placeholder={content?.namePlaceholder ?? "Your name"} {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{content?.emailLabel ?? "Email *"}</Label>
          <Input id="email" type="email" placeholder={content?.emailPlaceholder ?? "your@email.com"} {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">{content?.phoneLabel ?? "Phone"}</Label>
          <Input id="phone" placeholder={content?.phonePlaceholder ?? "+91 12345 67890"} {...register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">{content?.subjectLabel ?? "Subject *"}</Label>
          <Input id="subject" placeholder={content?.subjectPlaceholder ?? "Subject"} {...register("subject")} />
          {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{content?.messageLabel ?? "Message *"}</Label>
        <Textarea id="message" placeholder={content?.messagePlaceholder ?? "Your message..."} rows={5} {...register("message")} />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <Button type="submit" className="w-full gradient-primary text-white hover:opacity-90" disabled={loading}>
        {loading ? (content?.sendingButtonText ?? "Sending...") : (content?.submitButtonText ?? "Send Message")}
      </Button>
    </form>
  );
}
