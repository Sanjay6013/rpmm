"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteInquiry } from "@/actions/inquiries";
import { INQUIRY_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type Inquiry = { id: string; name: string; email: string; subject: string; status: string; createdAt: string };

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  NEW: "default",
  READ: "secondary",
  REPLIED: "outline",
  ARCHIVED: "secondary",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    fetch("/api/admin/inquiries").then((r) => r.json()).then((data) => setInquiries(data.inquiries ?? []));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await deleteInquiry(id);
      setInquiries(inquiries.filter((i) => i.id !== id));
      toast.success("Inquiry deleted");
    } catch { toast.error("Failed"); }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contact Inquiries</h1>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inq) => (
              <TableRow key={inq.id}>
                <TableCell className="font-medium">{inq.name}</TableCell>
                <TableCell>{inq.email}</TableCell>
                <TableCell>{inq.subject}</TableCell>
                <TableCell>
                  <Badge variant={statusColors[inq.status] ?? "secondary"}>
                    {INQUIRY_STATUSES.find((s) => s.value === inq.status)?.label ?? inq.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(inq.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/inquiries/${inq.id}`}>
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(inq.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
