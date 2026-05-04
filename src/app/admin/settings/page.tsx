"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSettings } from "@/actions/settings";

type SiteSettings = {
  schoolName: string;
  schoolFullName: string;
  tagline: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  officeHours: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  mapEmbedUrl: string | null;
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setForm(data.settings);
      });
  }, []);

  function updateField(key: keyof SiteSettings, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      // Convert nulls to undefined for the server action
      const cleaned = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v ?? undefined])
      );
      await updateSettings(cleaned);
      toast.success("Settings updated");
    } catch {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Site Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>School Name</Label>
              <Input value={form.schoolName ?? ""} onChange={(e) => updateField("schoolName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Full School Name</Label>
              <Input value={form.schoolFullName ?? ""} onChange={(e) => updateField("schoolFullName", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input value={form.tagline ?? ""} onChange={(e) => updateField("tagline", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description ?? ""} onChange={(e) => updateField("description", e.target.value)} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={form.address ?? ""} onChange={(e) => updateField("address", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone ?? ""} onChange={(e) => updateField("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email ?? ""} onChange={(e) => updateField("email", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Office Hours</Label>
            <Input value={form.officeHours ?? ""} onChange={(e) => updateField("officeHours", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Facebook URL</Label>
              <Input value={form.facebookUrl ?? ""} onChange={(e) => updateField("facebookUrl", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Twitter/X URL</Label>
              <Input value={form.twitterUrl ?? ""} onChange={(e) => updateField("twitterUrl", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input value={form.instagramUrl ?? ""} onChange={(e) => updateField("instagramUrl", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>YouTube URL</Label>
              <Input value={form.youtubeUrl ?? ""} onChange={(e) => updateField("youtubeUrl", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Google Maps Embed URL</Label>
            <Input value={form.mapEmbedUrl ?? ""} onChange={(e) => updateField("mapEmbedUrl", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading} size="lg">
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}
