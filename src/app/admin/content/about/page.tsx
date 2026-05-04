"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { updateAboutContent } from "@/actions/content";

type AboutContent = {
  history: string | null;
  mission: string | null;
  vision: string | null;
  principalName: string | null;
  principalMessage: string | null;
  principalPhoto: string | null;
  infrastructure: unknown;
  values: unknown;
};

export default function AboutEditor() {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [principalMessage, setPrincipalMessage] = useState("");
  const [principalPhoto, setPrincipalPhoto] = useState("");

  useEffect(() => {
    fetch("/api/admin/about-content")
      .then((r) => r.json())
      .then((data) => {
        if (data.aboutContent) {
          const ac = data.aboutContent as AboutContent;
          setHistory(ac.history ?? "");
          setMission(ac.mission ?? "");
          setVision(ac.vision ?? "");
          setPrincipalName(ac.principalName ?? "");
          setPrincipalMessage(ac.principalMessage ?? "");
          setPrincipalPhoto(ac.principalPhoto ?? "");
        }
      });
  }, []);

  async function handleSave() {
    setLoading(true);
    try {
      await updateAboutContent({
        history,
        mission,
        vision,
        principalName,
        principalMessage,
        principalPhoto,
      });
      toast.success("About page updated");
    } catch {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit About Page</h1>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea value={history} onChange={(e) => setHistory(e.target.value)} rows={6} placeholder="School history (HTML supported)" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={mission} onChange={(e) => setMission(e.target.value)} rows={5} placeholder="School mission (HTML supported)" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={vision} onChange={(e) => setVision(e.target.value)} rows={5} placeholder="School vision (HTML supported)" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Principal&apos;s Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Principal Name</Label>
              <Input value={principalName} onChange={(e) => setPrincipalName(e.target.value)} placeholder="Dr. Name" />
            </div>
            <div className="space-y-2">
              <Label>Photo</Label>
              <ImageUpload value={principalPhoto} onChange={setPrincipalPhoto} category="general" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea value={principalMessage} onChange={(e) => setPrincipalMessage(e.target.value)} rows={6} placeholder="Principal's message (HTML supported)" />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading} size="lg">
        {loading ? "Saving..." : "Save About Page"}
      </Button>
    </div>
  );
}
