"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { deleteEvent, toggleEventPublish } from "@/actions/events";
import { formatDate } from "@/lib/utils";

type EventItem = { id: string; title: string; slug: string; startDate: string; location: string | null; isPublished: boolean };

export default function EventsAdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/events").then((r) => r.json()).then((data) => setEvents(data.events ?? []));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
      toast.success("Event deleted");
    } catch { toast.error("Failed to delete"); }
  }

  async function handleToggle(id: string) {
    try {
      await toggleEventPublish(id);
      setEvents(events.map((e) => e.id === id ? { ...e, isPublished: !e.isPublished } : e));
      toast.success("Status updated");
    } catch { toast.error("Failed to update"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        <Link
          href="/admin/content/events/new"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-8 px-2.5 text-sm font-medium gap-1"
        >
          <Plus className="h-4 w-4" /> New Event
        </Link>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{formatDate(event.startDate)}</TableCell>
                <TableCell>{event.location ?? "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={event.isPublished ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleToggle(event.id)}
                  >
                    {event.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/content/events/${event.id}/edit`}>
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
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
