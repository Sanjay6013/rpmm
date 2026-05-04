import { PrismaClient, Role, GalleryCategory, AnnouncementType, InquiryStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashSync } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ─── Default Admin User ──────────────────────────────────────
  const adminPassword = hashSync("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@rpmm.edu" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@rpmm.edu",
      password: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log("  ✓ Admin user created (admin@rpmm.edu / admin123)");

  // ─── Site Settings ───────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      schoolName: "RPMM",
      schoolFullName: "RPMM",
      tagline: "Excellence in Education",
      description:
        "RPMM is a premier secondary/high school dedicated to academic excellence, character development, and holistic growth.",
      address: "123 Education Street, City, State 123456",
      phone: "+91 12345 67890",
      email: "info@rpmm.edu",
      officeHours: "Mon - Sat: 8:00 AM - 4:00 PM",
      facebookUrl: "https://facebook.com/rpmm",
      instagramUrl: "https://instagram.com/rpmm",
      twitterUrl: "https://twitter.com/rpmm",
      youtubeUrl: "https://youtube.com/@rpmm",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019112703127!2d144.9537353!3d-37.8162791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5771c5ed85d4a6!2sMelbourne%20CBD!5e0!3m2!1sen!2sin!4v1234567890",
      seoTitle: "RPMM - Excellence in Education",
      seoDescription: "RPMM is a premier secondary/high school dedicated to academic excellence, character development, and holistic growth.",
      galleryTitle: "Photo Gallery",
      gallerySubtitle: "Explore our school life through photos",
      galleryEmptyMessage: "No albums available yet.",
      eventsTitle: "Events",
      eventsSubtitle: "Stay updated with school events",
      upcomingEventsLabel: "Upcoming Events",
      pastEventsLabel: "Past Events",
      eventsEmptyMessage: "No events available yet.",
      backToEventsLabel: "Back to Events",
      newsTitle: "News & Updates",
      newsSubtitle: "Latest news from RPMM",
      newsEmptyMessage: "No news articles available yet.",
      backToNewsLabel: "Back to News",
      backToGalleryLabel: "Back to Gallery",
      contactSubtitle: "We'd love to hear from you",
      getInTouchHeading: "Get in Touch",
      quickLinksHeading: "Quick Links",
      contactHeading: "Contact Us",
      mapTitle: "School Location",
      goHomeLabel: "Go Home",
    },
  });
  console.log("  ✓ Site settings created");

  // ─── Home Content ────────────────────────────────────────────
  await prisma.homeContent.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      stats: [
        { label: "Students", value: "500+", icon: "GraduationCap" },
        { label: "Faculty Members", value: "50+", icon: "Users" },
        { label: "Years of Excellence", value: "25+", icon: "Award" },
        { label: "Pass Rate", value: "98%", icon: "TrendingUp" },
      ],
      highlights: [
        {
          title: "Academic Excellence",
          description:
            "Our rigorous curriculum and dedicated faculty ensure students achieve their full academic potential.",
          icon: "BookOpen",
        },
        {
          title: "Sports & Athletics",
          description:
            "State-of-the-art sports facilities and expert coaching for all-round development.",
          icon: "Trophy",
        },
        {
          title: "Cultural Activities",
          description:
            "A vibrant cultural program that nurtures creativity and artistic expression.",
          icon: "Palette",
        },
        {
          title: "Technology & Innovation",
          description:
            "Modern computer labs and STEM programs preparing students for the future.",
          icon: "Cpu",
        },
      ],
      ctaTitle: "Begin Your Journey at RPMM",
      ctaDescription:
        "Join our community of learners, leaders, and achievers. Admissions are now open for the upcoming academic year.",
      ctaButtonText: "Apply Now",
      ctaButtonUrl: "/contact",
      highlightsTitle: "Why Choose RPMM?",
      highlightsSubtitle: "Discover what makes us exceptional",
      upcomingEventsSubtitle: "Stay updated with our latest events",
      latestNewsSubtitle: "News and updates from RPMM",
    },
  });
  console.log("  ✓ Home content created");

  // ─── Hero Slides ─────────────────────────────────────────────
  const heroSlides = [
    {
      title: "Welcome to RPMM",
      subtitle: "Where Excellence Meets Opportunity",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&h=600&fit=crop",
      ctaText: "Explore",
      ctaUrl: "/about",
      sortOrder: 0,
      isActive: true,
    },
    {
      title: "Admissions Open 2025-26",
      subtitle: "Shape Your Future With Us",
      imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1600&h=600&fit=crop",
      ctaText: "Apply Now",
      ctaUrl: "/contact",
      sortOrder: 1,
      isActive: true,
    },
    {
      title: "Annual Sports Day",
      subtitle: "Celebrating Sportsmanship and Team Spirit",
      imageUrl: "https://images.unsplash.com/photo-1461896836934-bd45ba7be637?w=1600&h=600&fit=crop",
      ctaText: "View Events",
      ctaUrl: "/events",
      sortOrder: 2,
      isActive: true,
    },
  ];
  for (const slide of heroSlides) {
    await prisma.heroSlide.create({ data: slide });
  }
  console.log("  ✓ Hero slides created");

  // ─── About Content ───────────────────────────────────────────
  await prisma.aboutContent.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      history:
        "<p>Founded with a vision to provide world-class education, RPMM has been a beacon of learning and character development for over 25 years. From humble beginnings, we have grown into one of the most respected educational institutions in the region.</p><p>Our journey has been marked by a relentless pursuit of excellence, innovation in teaching methodologies, and a deep commitment to nurturing the leaders of tomorrow.</p>",
      mission:
        "<p>To provide a transformative educational experience that empowers students with knowledge, skills, and values to excel in an ever-changing world.</p>",
      vision:
        "<p>To be a leading center of academic excellence that develops well-rounded individuals who contribute positively to society.</p>",
      principalName: "Dr. Sarah Johnson",
      principalMessage:
        "<p>Dear Students and Parents,</p><p>It is my great privilege to welcome you to the RPMM family. Our school is committed to providing an environment where every student can discover their potential and achieve their dreams. We believe in nurturing not just academic excellence, but also character, creativity, and compassion.</p><p>Together, let us embark on a journey of learning and growth.</p>",
      principalPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
      historyLabel: "Our History",
      missionLabel: "Our Mission",
      visionLabel: "Our Vision",
      principalHeading: "Principal's Message",
      principalTitle: "Principal",
      infrastructureTitle: "Our Infrastructure",
      valuesTitle: "Our Values",
      infrastructure: [
        {
          title: "Smart Classrooms",
          description: "Technology-enabled classrooms with interactive whiteboards and digital learning resources.",
          imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop",
        },
        {
          title: "Science Laboratories",
          description: "Fully equipped labs for Physics, Chemistry, and Biology with modern instruments.",
          imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop",
        },
        {
          title: "Library",
          description: "A vast collection of over 10,000 books, journals, and digital resources.",
          imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=300&fit=crop",
        },
        {
          title: "Sports Complex",
          description: "Multi-sport facility including basketball court, football field, and indoor games.",
          imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
        },
      ],
      values: [
        { title: "Integrity", description: "We uphold honesty and strong moral principles in everything we do." },
        { title: "Excellence", description: "We strive for the highest standards in academics and character." },
        { title: "Respect", description: "We value diversity and treat everyone with dignity and respect." },
        { title: "Innovation", description: "We embrace creative thinking and new approaches to learning." },
      ],
    },
  });
  console.log("  ✓ About content created");

  // ─── Gallery Albums ──────────────────────────────────────────
  const albums = [
    {
      title: "Annual Day Celebrations",
      slug: "annual-day-celebrations",
      description: "Highlights from our spectacular Annual Day celebrations featuring student performances.",
      category: GalleryCategory.EVENTS,
      isPublished: true,
    },
    {
      title: "Campus Tour",
      slug: "campus-tour",
      description: "A visual tour of our beautiful campus and state-of-the-art facilities.",
      category: GalleryCategory.CAMPUS,
      isPublished: true,
    },
  ];

  for (const album of albums) {
    const created = await prisma.galleryAlbum.create({ data: album });
    const images =
      album.slug === "annual-day-celebrations"
        ? [
            { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop", caption: "Students performing on stage", sortOrder: 0, albumId: created.id },
            { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop", caption: "Audience enjoying the show", sortOrder: 1, albumId: created.id },
            { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop", caption: "Award ceremony", sortOrder: 2, albumId: created.id },
          ]
        : [
            { url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop", caption: "Main building", sortOrder: 0, albumId: created.id },
            { url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop", caption: "Science lab", sortOrder: 1, albumId: created.id },
            { url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop", caption: "Library", sortOrder: 2, albumId: created.id },
          ];
    await prisma.galleryImage.createMany({ data: images });
  }
  console.log("  ✓ Gallery albums created");

  // ─── Events ──────────────────────────────────────────────────
  const events = [
    {
      title: "Annual Science Exhibition",
      slug: "annual-science-exhibition",
      startDate: new Date("2025-08-15"),
      endDate: new Date("2025-08-16"),
      location: "Main Auditorium",
      excerpt: "Students showcase innovative science projects and experiments at our annual exhibition.",
      content:
        "<p>The Annual Science Exhibition is a showcase of our students' creativity and scientific temper. Students from all grades participate with innovative projects spanning physics, chemistry, biology, and environmental science.</p><p>This year's theme is 'Sustainability and Innovation', encouraging students to develop solutions for real-world environmental challenges.</p>",
      coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop",
      isPublished: true,
    },
    {
      title: "Inter-School Sports Tournament",
      slug: "inter-school-sports-tournament",
      startDate: new Date("2025-02-10"),
      endDate: new Date("2025-02-14"),
      location: "Sports Complex",
      excerpt: "RPMM hosts the annual inter-school sports tournament with participation from 15 schools.",
      content:
        "<p>Our annual inter-school sports tournament brings together athletes from across the region for a week of competition and camaraderie.</p><p>Events include track and field, basketball, football, cricket, and more.</p>",
      coverImage: "https://images.unsplash.com/photo-1461896836934-bd45ba7be637?w=800&h=400&fit=crop",
      isPublished: true,
    },
    {
      title: "Parent-Teacher Meeting",
      slug: "parent-teacher-meeting-2025",
      startDate: new Date("2025-03-20"),
      location: "School Campus",
      excerpt: "Quarterly parent-teacher meeting to discuss student progress and development.",
      content:
        "<p>Parent-Teacher Meetings are an essential part of our communication with families. These sessions provide an opportunity to discuss student progress, address concerns, and collaborate on strategies for student success.</p>",
      coverImage: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=400&fit=crop",
      isPublished: true,
    },
  ];
  for (const event of events) {
    await prisma.event.create({ data: event });
  }
  console.log("  ✓ Events created");

  // ─── News ────────────────────────────────────────────────────
  const news = [
    {
      title: "RPMM Students Win National Science Competition",
      slug: "rpmm-students-win-national-science-competition",
      author: "Admin",
      publishedAt: new Date("2025-04-20"),
      excerpt: "Our students achieved top honors at the National Science Competition held in New Delhi.",
      content:
        "<p>We are proud to announce that our students have won the National Science Competition for the second consecutive year. The team, led by their science teacher, presented an innovative project on renewable energy solutions.</p><p>This achievement reflects our commitment to fostering scientific curiosity and innovation among our students.</p>",
      coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop",
      isPublished: true,
    },
    {
      title: "New Computer Lab Inaugurated",
      slug: "new-computer-lab-inaugurated",
      author: "Admin",
      publishedAt: new Date("2025-03-15"),
      excerpt: "State-of-the-art computer lab with 50 workstations now open for students.",
      content:
        "<p>The new computer lab features 50 modern workstations with the latest hardware and software. The lab is designed to support our expanded STEM curriculum and coding programs.</p>",
      coverImage: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=400&fit=crop",
      isPublished: true,
    },
    {
      title: "Annual Day 2025 - A Grand Celebration",
      slug: "annual-day-2025-grand-celebration",
      author: "Admin",
      publishedAt: new Date("2025-02-28"),
      excerpt: "This year's Annual Day was a spectacular showcase of talent, creativity, and achievement.",
      content:
        "<p>The Annual Day celebration was a grand success with over 500 attendees. Students performed dances, skits, and musical performances that left the audience spellbound.</p><p>The chief guest, a distinguished alumnus, inspired students with their journey from RPMM to success.</p>",
      coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
      isPublished: true,
    },
  ];
  for (const item of news) {
    await prisma.news.create({ data: item });
  }
  console.log("  ✓ News articles created");

  // ─── Announcements ───────────────────────────────────────────
  await prisma.announcement.create({
    data: {
      title: "Admissions Open for 2025-26",
      content: "Applications are now being accepted for the 2025-26 academic year. Apply early to secure your spot!",
      type: AnnouncementType.ADMISSION,
      isActive: true,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-07-31"),
    },
  });
  console.log("  ✓ Announcements created");

  // ─── Sample Contact Inquiries ────────────────────────────────
  const inquiries = [
    {
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 98765 43210",
      subject: "Admission Inquiry for Grade 9",
      message: "I would like to know about the admission process for Grade 9 for the upcoming academic year. What are the eligibility criteria and required documents?",
      status: InquiryStatus.NEW,
    },
    {
      name: "Priya Patel",
      email: "priya.patel@email.com",
      phone: "+91 87654 32109",
      subject: "Fee Structure Request",
      message: "Could you please share the fee structure for Grade 11 Science stream? Also, are there any scholarships available?",
      status: InquiryStatus.READ,
    },
  ];
  for (const inquiry of inquiries) {
    await prisma.contactInquiry.create({ data: inquiry });
  }
  console.log("  ✓ Sample inquiries created");

  // ─── Contact Form Content ────────────────────────────────────
  await prisma.contactFormContent.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      heading: "Send us a Message",
      subtitle: "Fill out the form below and we'll get back to you.",
      nameLabel: "Name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      subjectLabel: "Subject",
      messageLabel: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "your@email.com",
      phonePlaceholder: "+91 12345 67890",
      subjectPlaceholder: "Subject",
      messagePlaceholder: "Your message...",
      submitButtonText: "Send Message",
      sendingButtonText: "Sending...",
    },
  });
  console.log("  ✓ Contact form content created");

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
