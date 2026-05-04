"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { updateInquiryStatus } from "@/actions/inquiries";
import { INQUIRY_STATUSES } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

type Inquiry = { id: string; name: string; email: string; phone: string | null; subject: string; message: string; status: string; notes: string | null; createdAt: string };

export default function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params.then((p) => {
      fetch(`/api/admin/inquiries/${p.id}`).then((r) => r.json()).then((data) => {
        if (data.inquiry) {
          setInquiry(data.inquiry);
          setStatus(data.inquiry.status);
          setNotes(data.inquiry.notes ?? "");
        }
      });
    });
  }, [params]);

  async function handleSave() {
    if (!inquiry) return;
    setLoading(true);
    try {
      await updateInquiryStatus(inquiry.id, status, notes);
      toast.success("Inquiry updated");
    } catch { toast.error("Failed"); } finally { setLoading(false); }
  }

  if (!inquiry) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/admin/inquiries")}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Inquiries
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Inquiry from {inquiry.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span className="text-sm font-medium">Email:</span> <span className="text-sm">{inquiry.email}</span></div>
            <div><span className="text-sm font-medium">Phone:</span> <span className="text-sm">{inquiry.phone ?? "N/A"}</span></div>
            <div><span className="text-sm font-medium">Subject:</span> <span className="text-sm">{inquiry.subject}</span></div>
            <div><span className="text-sm font-medium">Date:</span> <span className="text-sm">{formatDateTime(inquiry.createdAt)}</span></div>
          </div>
          <div>
            <span className="text-sm font-medium">Message:</span>
            <p className="text-sm mt-1 p-3 bg-muted rounded-md">{inquiry.message}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Manage Inquiry</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => v && setStatus(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {INQUIRY_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Internal Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
          <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Update Inquiry"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
