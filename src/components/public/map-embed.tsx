interface MapEmbedProps {
  url: string;
  title?: string;
}

export function MapEmbed({ url, title = "School Location" }: MapEmbedProps) {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border">
      <iframe
        src={url}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
    </div>
  );
}
