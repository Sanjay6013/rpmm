"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { createNews } from "@/actions/news";
import { slugify } from "@/lib/slugify";

export default function NewNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().slice(0, 16));
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  async function handleSave() {
    if (!title || !slug || !publishedAt) { toast.error("Title, slug, and date are required"); return; }
    setLoading(true);
    try {
      const result = await createNews({ title, slug, author: author || undefined, publishedAt, excerpt: excerpt || undefined, content: content || undefined, coverImage: coverImage || undefined, isPublished });
      if (result.success) { toast.success("Article created"); router.push("/admin/content/news"); }
      else { toast.error(result.error ?? "Failed"); }
    } catch { toast.error("Failed"); } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New Article</h1>
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
            <div className="space-y-2"><Label>Author</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
            <div className="space-y-2"><Label>Published Date *</Label><Input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Excerpt</Label><Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} /></div>
          <div className="space-y-2"><Label>Content (HTML)</Label><Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} /></div>
          <div className="space-y-2"><Label>Cover Image</Label><ImageUpload value={coverImage} onChange={setCoverImage} category="news" /></div>
          <div className="flex items-center gap-2"><Switch checked={isPublished} onCheckedChange={setIsPublished} /><Label>Published</Label></div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>{loading ? "Creating..." : "Create Article"}</Button>
            <Button variant="outline" onClick={() => router.push("/admin/content/news")}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
