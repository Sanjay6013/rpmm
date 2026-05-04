"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createAnnouncement, updateAnnouncement, deleteAnnouncement, toggleAnnouncementActive } from "@/actions/announcements";
import { ANNOUNCEMENT_TYPES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type Announcement = { id: string; title: string; content: string; type: string; isActive: boolean; startDate: string; endDate: string | null };

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("INFO");
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/announcements").then((r) => r.json()).then((data) => setAnnouncements(data.announcements ?? []));
  }, []);

  function openCreate() {
    setEditing(null);
    setTitle(""); setContent(""); setType("INFO"); setIsActive(true);
    setStartDate(new Date().toISOString().slice(0, 16)); setEndDate("");
    setDialogOpen(true);
  }

  function openEdit(ann: Announcement) {
    setEditing(ann);
    setTitle(ann.title); setContent(ann.content); setType(ann.type); setIsActive(ann.isActive);
    setStartDate(ann.startDate ? new Date(ann.startDate).toISOString().slice(0, 16) : "");
    setEndDate(ann.endDate ? new Date(ann.endDate).toISOString().slice(0, 16) : "");
    setDialogOpen(true);
  }

  async function handleSave() {
    setLoading(true);
    try {
      if (editing) {
        await updateAnnouncement(editing.id, { title, content, type, isActive, startDate, endDate: endDate || undefined });
        toast.success("Announcement updated");
      } else {
        await createAnnouncement({ title, content, type, isActive, startDate, endDate: endDate || undefined });
        toast.success("Announcement created");
      }
      setDialogOpen(false);
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      setAnnouncements(data.announcements ?? []);
    } catch { toast.error("Failed"); } finally { setLoading(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    try {
      await deleteAnnouncement(id);
      setAnnouncements(announcements.filter((a) => a.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  }

  async function handleToggle(id: string) {
    try {
      await toggleAnnouncementActive(id);
      setAnnouncements(announcements.map((a) => a.id === id ? { ...a, isActive: !a.isActive } : a));
      toast.success("Status updated");
    } catch { toast.error("Failed"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> New</Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Start</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((ann) => (
              <TableRow key={ann.id}>
                <TableCell className="font-medium">{ann.title}</TableCell>
                <TableCell><Badge variant="outline">{ANNOUNCEMENT_TYPES.find((t) => t.value === ann.type)?.label ?? ann.type}</Badge></TableCell>
                <TableCell>
                  <Badge variant={ann.isActive ? "default" : "secondary"} className="cursor-pointer" onClick={() => handleToggle(ann.id)}>
                    {ann.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(ann.startDate)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(ann)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(ann.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Announcement</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="space-y-2"><Label>Content</Label><Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => v && setType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ANNOUNCEMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6"><Switch checked={isActive} onCheckedChange={setIsActive} /><Label>Active</Label></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Date</Label><Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
              <div className="space-y-2"><Label>End Date</Label><Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
            </div>
            <Button onClick={handleSave} disabled={loading} className="w-full">{loading ? "Saving..." : editing ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
