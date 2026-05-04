"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { updateEvent } from "@/actions/events";

type EventData = { id: string; title: string; slug: string; startDate: string; endDate: string | null; location: string | null; excerpt: string | null; content: string | null; coverImage: string | null; isPublished: boolean };

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      fetch(`/api/admin/events/${p.id}`).then((r) => r.json()).then((data) => {
        if (data.event) {
          const ev = data.event as EventData;
          setTitle(ev.title);
          setStartDate(ev.startDate ? new Date(ev.startDate).toISOString().slice(0, 16) : "");
          setEndDate(ev.endDate ? new Date(ev.endDate).toISOString().slice(0, 16) : "");
          setLocation(ev.location ?? "");
          setExcerpt(ev.excerpt ?? "");
          setContent(ev.content ?? "");
          setCoverImage(ev.coverImage ?? "");
          setIsPublished(ev.isPublished);
        }
      });
    });
  }, [params]);

  async function handleSave() {
    setLoading(true);
    try {
      await updateEvent(id, { title, startDate, endDate: endDate || undefined, location, excerpt, content, coverImage, isPublished });
      toast.success("Event updated");
      router.push("/admin/content/events");
    } catch {
      toast.error("Failed to update event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Event</h1>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Content (HTML)</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
          </div>
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <ImageUpload value={coverImage} onChange={setCoverImage} category="events" />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            <Label>Published</Label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
            <Button variant="outline" onClick={() => router.push("/admin/content/events")}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
