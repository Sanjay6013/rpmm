"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteNews, toggleNewsPublish } from "@/actions/news";
import { formatDate } from "@/lib/utils";

type NewsItem = { id: string; title: string; author: string | null; publishedAt: string; isPublished: boolean };

export default function NewsAdminPage() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/news").then((r) => r.json()).then((data) => setNews(data.news ?? []));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    try {
      await deleteNews(id);
      setNews(news.filter((n) => n.id !== id));
      toast.success("Article deleted");
    } catch { toast.error("Failed to delete"); }
  }

  async function handleToggle(id: string) {
    try {
      await toggleNewsPublish(id);
      setNews(news.map((n) => n.id === id ? { ...n, isPublished: !n.isPublished } : n));
      toast.success("Status updated");
    } catch { toast.error("Failed to update"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">News</h1>
        <Link href="/admin/content/news/new" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-8 px-2.5 text-sm font-medium gap-1">
          <Plus className="h-4 w-4" /> New Article
        </Link>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.author ?? "-"}</TableCell>
                <TableCell>{formatDate(item.publishedAt)}</TableCell>
                <TableCell>
                  <Badge variant={item.isPublished ? "default" : "secondary"} className="cursor-pointer" onClick={() => handleToggle(item.id)}>
                    {item.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/content/news/${item.id}/edit`}>
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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
