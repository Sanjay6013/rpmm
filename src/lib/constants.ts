export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Home Page", href: "/admin/content/home", icon: "Home" },
  { label: "About Page", href: "/admin/content/about", icon: "Info" },
  { label: "Gallery", href: "/admin/content/gallery", icon: "Image" },
  { label: "Events", href: "/admin/content/events", icon: "Calendar" },
  { label: "News", href: "/admin/content/news", icon: "Newspaper" },
  { label: "Announcements", href: "/admin/announcements", icon: "Megaphone" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "Mail" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
  { label: "Users", href: "/admin/users", icon: "Users" },
] as const;

export const GALLERY_CATEGORIES = [
  { value: "EVENTS", label: "Events" },
  { value: "CAMPUS", label: "Campus" },
  { value: "SPORTS", label: "Sports" },
  { value: "ACADEMICS", label: "Academics" },
  { value: "CULTURAL", label: "Cultural" },
  { value: "GENERAL", label: "General" },
] as const;

export const ANNOUNCEMENT_TYPES = [
  { value: "INFO", label: "Information" },
  { value: "WARNING", label: "Warning" },
  { value: "URGENT", label: "Urgent" },
  { value: "ADMISSION", label: "Admission" },
] as const;

export const ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "EDITOR", label: "Editor" },
] as const;

export const INQUIRY_STATUSES = [
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
  { value: "ARCHIVED", label: "Archived" },
] as const;
