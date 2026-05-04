"use client";

import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/slugify";

interface SlugInputProps {
  value: string;
  onChange: (value: string) => void;
  onTitleChange?: (title: string) => void;
}

export function SlugInput({ value, onChange, onTitleChange }: SlugInputProps) {
  function handleTitleChange(title: string) {
    onChange(slugify(title));
    onTitleChange?.(title);
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            value={onTitleChange ? undefined : undefined}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter title"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Slug</label>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="url-friendly-slug"
          />
        </div>
      </div>
    </div>
  );
}
