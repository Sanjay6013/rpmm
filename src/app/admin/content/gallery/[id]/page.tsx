"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateAlbum, uploadAlbumImages, deleteImage, updateImageCaption } from "@/actions/gallery";
import { GALLERY_CATEGORIES } from "@/lib/constants";

type GalleryImage = { id: string; url: string; caption: string | null; sortOrder: number };
type Album = { id: string; title: string; slug: string; description: string | null; category: string; isPublished: boolean; images: GalleryImage[] };

export default function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [isPublished, setIsPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [id, setId] = useState("");
  const router = useRouter();

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      fetch(`/api/admin/gallery/${p.id}`).then((r) => r.json()).then((data) => {
        if (data.album) {
          setAlbum(data.album);
          setTitle(data.album.title);
          setDescription(data.album.description ?? "");
          setCategory(data.album.category);
          setIsPublished(data.album.isPublished);
        }
      });
    });
  }, [params]);

  async function handleSave() {
    if (!album) return;
    try {
      await updateAlbum(album.id, { title, description, category, isPublished });
      toast.success("Album updated");
    } catch {
      toast.error("Failed to update album");
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !album) return;

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "gallery");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) urls.push(data.url);
      }
      if (urls.length > 0) {
        await uploadAlbumImages(album.id, urls);
        // Refresh album data
        const res = await fetch(`/api/admin/gallery/${album.id}`);
        const data = await res.json();
        if (data.album) setAlbum(data.album);
        toast.success(`${urls.length} images uploaded`);
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage(imageId: string) {
    try {
      await deleteImage(imageId);
      if (album) {
        setAlbum({ ...album, images: album.images.filter((img) => img.id !== imageId) });
        toast.success("Image deleted");
      }
    } catch {
      toast.error("Failed to delete image");
    }
  }

  if (!album) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/admin/content/gallery")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Gallery
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Album</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GALLERY_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            <Label>Published</Label>
          </div>
          <Button onClick={handleSave}>Save Album</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Images ({album.images.length})</CardTitle>
          <label className="cursor-pointer">
            <Button variant="outline" disabled={uploading} onClick={() => document.getElementById("gallery-upload")?.click()}>
              <Upload className="h-4 w-4 mr-1" />
              {uploading ? "Uploading..." : "Upload Images"}
            </Button>
            <input
              id="gallery-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </CardHeader>
        <CardContent>
          {album.images.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No images yet. Upload some above.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {album.images.filter((img) => img.url).map((img) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border aspect-[4/3]">
                  <Image src={img.url} alt={img.caption ?? ""} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(img.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
