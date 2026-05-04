-- AlterTable
ALTER TABLE "AboutContent" ADD COLUMN     "historyLabel" TEXT NOT NULL DEFAULT 'Our History',
ADD COLUMN     "infrastructureTitle" TEXT NOT NULL DEFAULT 'Our Infrastructure',
ADD COLUMN     "missionLabel" TEXT NOT NULL DEFAULT 'Our Mission',
ADD COLUMN     "principalHeading" TEXT NOT NULL DEFAULT 'Principal''s Message',
ADD COLUMN     "principalTitle" TEXT NOT NULL DEFAULT 'Principal',
ADD COLUMN     "valuesTitle" TEXT NOT NULL DEFAULT 'Our Values',
ADD COLUMN     "visionLabel" TEXT NOT NULL DEFAULT 'Our Vision';

-- AlterTable
ALTER TABLE "HomeContent" ADD COLUMN     "highlightsSubtitle" TEXT NOT NULL DEFAULT 'Discover what makes us exceptional',
ADD COLUMN     "highlightsTitle" TEXT NOT NULL DEFAULT 'Why Choose RPMM?',
ADD COLUMN     "latestNewsSubtitle" TEXT NOT NULL DEFAULT 'News and updates from RPMM',
ADD COLUMN     "upcomingEventsSubtitle" TEXT NOT NULL DEFAULT 'Stay updated with our latest events';

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "backToEventsLabel" TEXT NOT NULL DEFAULT 'Back to Events',
ADD COLUMN     "backToGalleryLabel" TEXT NOT NULL DEFAULT 'Back to Gallery',
ADD COLUMN     "backToNewsLabel" TEXT NOT NULL DEFAULT 'Back to News',
ADD COLUMN     "contactHeading" TEXT NOT NULL DEFAULT 'Contact Us',
ADD COLUMN     "contactSubtitle" TEXT NOT NULL DEFAULT 'We''d love to hear from you',
ADD COLUMN     "eventsEmptyMessage" TEXT NOT NULL DEFAULT 'No events available yet.',
ADD COLUMN     "eventsSubtitle" TEXT NOT NULL DEFAULT 'Stay updated with school events',
ADD COLUMN     "eventsTitle" TEXT NOT NULL DEFAULT 'Events',
ADD COLUMN     "galleryEmptyMessage" TEXT NOT NULL DEFAULT 'No albums available yet.',
ADD COLUMN     "gallerySubtitle" TEXT NOT NULL DEFAULT 'Explore our school life through photos',
ADD COLUMN     "galleryTitle" TEXT NOT NULL DEFAULT 'Photo Gallery',
ADD COLUMN     "getInTouchHeading" TEXT NOT NULL DEFAULT 'Get in Touch',
ADD COLUMN     "goHomeLabel" TEXT NOT NULL DEFAULT 'Go Home',
ADD COLUMN     "mapTitle" TEXT NOT NULL DEFAULT 'School Location',
ADD COLUMN     "newsEmptyMessage" TEXT NOT NULL DEFAULT 'No news articles available yet.',
ADD COLUMN     "newsSubtitle" TEXT NOT NULL DEFAULT 'Latest news from RPMM',
ADD COLUMN     "newsTitle" TEXT NOT NULL DEFAULT 'News & Updates',
ADD COLUMN     "pastEventsLabel" TEXT NOT NULL DEFAULT 'Past Events',
ADD COLUMN     "quickLinksHeading" TEXT NOT NULL DEFAULT 'Quick Links',
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT NOT NULL DEFAULT 'RPMM - Excellence in Education',
ADD COLUMN     "upcomingEventsLabel" TEXT NOT NULL DEFAULT 'Upcoming Events';

-- CreateTable
CREATE TABLE "ContactFormContent" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "heading" TEXT NOT NULL DEFAULT 'Send us a Message',
    "subtitle" TEXT NOT NULL DEFAULT 'Fill out the form below and we''ll get back to you.',
    "nameLabel" TEXT NOT NULL DEFAULT 'Name',
    "emailLabel" TEXT NOT NULL DEFAULT 'Email',
    "phoneLabel" TEXT NOT NULL DEFAULT 'Phone',
    "subjectLabel" TEXT NOT NULL DEFAULT 'Subject',
    "messageLabel" TEXT NOT NULL DEFAULT 'Message',
    "namePlaceholder" TEXT NOT NULL DEFAULT 'Your name',
    "emailPlaceholder" TEXT NOT NULL DEFAULT 'your@email.com',
    "phonePlaceholder" TEXT NOT NULL DEFAULT '+91 12345 67890',
    "subjectPlaceholder" TEXT NOT NULL DEFAULT 'Subject',
    "messagePlaceholder" TEXT NOT NULL DEFAULT 'Your message...',
    "submitButtonText" TEXT NOT NULL DEFAULT 'Send Message',
    "sendingButtonText" TEXT NOT NULL DEFAULT 'Sending...',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactFormContent_pkey" PRIMARY KEY ("id")
);
