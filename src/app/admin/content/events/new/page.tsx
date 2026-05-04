"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { createEvent } from "@/actions/events";
import { slugify } from "@/lib/slugify";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  async function handleSave() {
    if (!title || !slug || !startDate) {
      toast.error("Title, slug, and start date are required");
      return;
    }
    setLoading(true);
    try {
      const result = await createEvent({ title, slug, startDate, endDate: endDate || undefined, location: location || undefined, excerpt: excerpt || undefined, content: content || undefined, coverImage: coverImage || undefined, isPublished });
      if (result.success) {
        toast.success("Event created");
        router.push("/admin/content/events");
      } else {
        toast.error(result.error ?? "Failed to create event");
      }
    } catch {
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New Event</h1>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => { setTitle(e.target.value); setSlug(slugify(e.target.value)); }} />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
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
            <Button onClick={handleSave} disabled={loading}>{loading ? "Creating..." : "Create Event"}</Button>
            <Button variant="outline" onClick={() => router.push("/admin/content/events")}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
