"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteAlbum } from "@/actions/gallery";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type Album = { id: string; title: string; slug: string; category: string; isPublished: boolean; createdAt: string; _count: { images: number } };

export default function GalleryAdminPage() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    fetch("/api/admin/gallery").then((r) => r.json()).then((data) => setAlbums(data.albums ?? []));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this album and all its images?")) return;
    try {
      await deleteAlbum(id);
      setAlbums(albums.filter((a) => a.id !== id));
      toast.success("Album deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <Link
          href="/admin/content/gallery/new"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-8 px-2.5 text-sm font-medium gap-1"
        >
          <Plus className="h-4 w-4" />
          New Album
        </Link>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {albums.map((album) => (
              <TableRow key={album.id}>
                <TableCell className="font-medium">{album.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {GALLERY_CATEGORIES.find((c) => c.value === album.category)?.label ?? album.category}
                  </Badge>
                </TableCell>
                <TableCell>{album._count.images}</TableCell>
                <TableCell>
                  <Badge variant={album.isPublished ? "default" : "secondary"}>
                    {album.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(album.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/content/gallery/${album.id}`}>
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(album.id)}>
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
