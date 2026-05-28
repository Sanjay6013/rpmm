"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { updateHomeContent, createHeroSlide, updateHeroSlide, deleteHeroSlide } from "@/actions/content";

type HeroSlide = { id: string; title: string; subtitle: string | null; imageUrl: string; ctaText: string | null; ctaUrl: string | null; sortOrder: number; isActive: boolean };
type HomeContent = { ctaTitle: string; ctaDescription: string; ctaButtonText: string; ctaButtonUrl: string; stats: unknown; highlights: unknown };

export default function HomeEditor({ }: { }) {
  const [loading, setLoading] = useState(false);
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaDescription, setCtaDescription] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("");
  const [ctaButtonUrl, setCtaButtonUrl] = useState("");
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    fetch("/api/admin/home-content")
      .then((r) => r.json())
      .then((data) => {
        if (data.homeContent) {
          const hc = data.homeContent as HomeContent;
          setCtaTitle(hc.ctaTitle);
          setCtaDescription(hc.ctaDescription);
          setCtaButtonText(hc.ctaButtonText);
          setCtaButtonUrl(hc.ctaButtonUrl);
        }
        if (data.heroSlides) {
          setHeroSlides(data.heroSlides);
        }
      });
  }, []);

  async function handleSaveCta() {
    setLoading(true);
    try {
      await updateHomeContent({ ctaTitle, ctaDescription, ctaButtonText, ctaButtonUrl });
      toast.success("CTA section updated");
    } catch {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSlide(slide: HeroSlide) {
    try {
      await updateHeroSlide(slide.id, {
        title: slide.title,
        subtitle: slide.subtitle ?? undefined,
        imageUrl: slide.imageUrl,
        ctaText: slide.ctaText ?? undefined,
        ctaUrl: slide.ctaUrl ?? undefined,
        sortOrder: slide.sortOrder,
        isActive: slide.isActive,
      });
      toast.success("Slide updated");
    } catch {
      toast.error("Failed to update slide");
    }
  }

  async function handleDeleteSlide(id: string) {
    try {
      await deleteHeroSlide(id);
      setHeroSlides(heroSlides.filter((s) => s.id !== id));
      toast.success("Slide deleted");
    } catch {
      toast.error("Failed to delete slide");
    }
  }

  async function handleAddSlide() {
    try {
      const result = await createHeroSlide({
        title: "New Slide",
        imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&h=600&fit=crop",
        sortOrder: heroSlides.length,
        isActive: true,
      });
      if (result.success) {
        toast.success("Slide created. Refresh to edit.");
      }
    } catch {
      toast.error("Failed to create slide");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Home Page</h1>
      </div>

      {/* Hero Slides */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hero Slides</CardTitle>
          <Button onClick={handleAddSlide} size="sm">Add Slide</Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {heroSlides.map((slide) => (
            <div key={slide.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{slide.title}</span>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={slide.isActive}
                    onCheckedChange={(checked) => {
                      const updated = { ...slide, isActive: checked };
                      setHeroSlides(heroSlides.map((s) => s.id === slide.id ? updated : s));
                      handleSaveSlide(updated);
                    }}
                  />
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteSlide(slide.id)}>Delete</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={slide.title} onChange={(e) => setHeroSlides(heroSlides.map((s) => s.id === slide.id ? { ...s, title: e.target.value } : s))} />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input value={slide.subtitle ?? ""} onChange={(e) => setHeroSlides(heroSlides.map((s) => s.id === slide.id ? { ...s, subtitle: e.target.value } : s))} />
                </div>
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input value={slide.ctaText ?? ""} onChange={(e) => setHeroSlides(heroSlides.map((s) => s.id === slide.id ? { ...s, ctaText: e.target.value } : s))} />
                </div>
                <div className="space-y-2">
                  <Label>CTA URL</Label>
                  <Input value={slide.ctaUrl ?? ""} onChange={(e) => setHeroSlides(heroSlides.map((s) => s.id === slide.id ? { ...s, ctaUrl: e.target.value } : s))} />
                </div>
              </div>
              <ImageUpload
                value={slide.imageUrl}
                onChange={(url) => {
                  const updated = { ...slide, imageUrl: url };
                  setHeroSlides(heroSlides.map((s) => s.id === slide.id ? updated : s));
                  handleSaveSlide(updated);
                }}
                category="general"
              />
              <Button size="sm" onClick={() => handleSaveSlide(slide)}>Save Slide</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Call-to-Action Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>CTA Title</Label>
            <Input value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>CTA Description</Label>
            <Textarea value={ctaDescription} onChange={(e) => setCtaDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input value={ctaButtonText} onChange={(e) => setCtaButtonText(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Button URL</Label>
              <Input value={ctaButtonUrl} onChange={(e) => setCtaButtonUrl(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleSaveCta} disabled={loading}>
            {loading ? "Saving..." : "Save CTA Section"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
