import prisma from "@/lib/prisma";
import { HeaderClient } from "./header-client";

export async function Header() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  return (
    <HeaderClient
      schoolName={settings?.schoolName ?? "RPMM"}
      schoolFullName={settings?.schoolFullName ?? "RPMM"}
      tagline={settings?.tagline ?? "Excellence in Education"}
      phone={settings?.phone ?? null}
      email={settings?.email ?? null}
      facebookUrl={settings?.facebookUrl ?? null}
      twitterUrl={settings?.twitterUrl ?? null}
      instagramUrl={settings?.instagramUrl ?? null}
      youtubeUrl={settings?.youtubeUrl ?? null}
    />
  );
}
