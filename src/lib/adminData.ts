export interface GalleryImage {
  id: number;
  src: string;
  category: string;
  title: string;
  location: string;
  tags: string[];
}

export interface Tour {
  id: number;
  title: string;
  location: string;
  date: string;
  image: string;
  description: string;
  price: string;
  itinerary?: string[];
  highlights?: string[];
}

export interface Blog {
  id: number;
  date: string;
  title: string;
  description: string;
  readTime: string;
  content: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  tour: string;
  quote: string;
  rating: number;
}

export interface BackgroundConfig {
  desktop: string;
  mobile: string;
  position: string;
}

export interface Submission {
  id: number | string;
  date: string;
  status: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  destination: string;
  dateFrom: string;
  dateTo: string;
  datesFlexible: boolean;
  travellers: string;
  budgetIndia: string;
  budgetAfrica: string;
  description: string;
  contactMethod: string;
  referral: string;
  updates: boolean;
}

export interface AdminData {
  site: { name: string; tagline: string; logoText: string; logoImage: string };
  social: { instagram: string; youtube: string };
  home: { heroTitle: string; heroSubtitle: string };
  profile: { name: string; bio: string; image: string };
  about: {
    image: string; title: string; years: string; description: string;
    philosophy: string; experience: string[]; specialties: string[];
    featuredIn: string;
  };
  gallerySettings: { title: string; subtitle: string; categories: string[] };
  gallery: GalleryImage[];
  toursSettings: { title: string; subtitle: string; description: string };
  tours: Tour[];
  testimonials: Testimonial[];
  blogsSettings: { title: string; subtitle: string };
  blogs: Blog[];
  contact: { title: string; subtitle: string; successMessage: string };
  formOptions: {
    destinations: string[]; budgetIndia: string[]; budgetAfrica: string[];
    contactMethods: string[]; referralSources: string[];
  };
  backgrounds: Record<string, BackgroundConfig>;
}

export const DEFAULT_ADMIN: AdminData = {
  site: { name: "Naturalist Diaries", tagline: "Est. 2026", logoText: "N.D.", logoImage: "" },
  social: { instagram: "https://instagram.com/naturalistdiaries", youtube: "https://youtube.com/@naturalistdiaries" },
  home: { heroTitle: "Naturalist", heroSubtitle: "Diaries" },
  profile: { name: "Suyash Keshari", bio: "Wildlife Presenter & Conservationist", image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=800" },
  about: {
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=800",
    title: "The Explorer", years: "12+ YEARS IN THE FIELD",
    description: "I am a storyteller of the natural world. My work bridges the gap between scientific observation and artistic expression. For over a decade, I have tracked big cats across India and documented the silent shifts of glaciers in Iceland.",
    philosophy: "Every expedition is a conversation with nature. I believe in ethical wildlife observation, sustainable tourism, and sharing stories that inspire conservation action.",
    experience: ["12 Years Field Photography", "Certified Wilderness First Responder", "National Geographic Contributor", "TEDx Speaker on Conservation"],
    specialties: ["Big Cat Tracking", "High-Altitude Expeditions", "Conservation Storytelling", "Wildlife Documentary"],
    featuredIn: "National Geographic, BBC Wildlife, Discovery Channel, WWF Publications"
  },
  gallerySettings: { title: "Visual Archive", subtitle: "MOMENTS CAPTURED IN THE WILD", categories: ["Wildlife", "Landscape", "Monochrome", "Aerial"] },
  gallery: [
    { id: 1, src: "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1000", category: "Wildlife", title: "The Stare", location: "Ranthambore, India", tags: ["wildlife", "tiger", "predator"] },
    { id: 2, src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000", category: "Landscape", title: "Morning Mist", location: "Iceland", tags: ["landscape", "mist", "mountains"] },
    { id: 3, src: "https://images.unsplash.com/photo-1518182170546-0766ce6fec56?q=80&w=1000", category: "Aerial", title: "From Above", location: "Maldives", tags: ["aerial", "ocean", "blue"] },
    { id: 4, src: "https://images.unsplash.com/photo-1440557653017-b39f66cb35bc?q=80&w=1000", category: "Monochrome", title: "Noir Lion", location: "Masai Mara", tags: ["monochrome", "lion", "africa"] },
    { id: 5, src: "https://images.unsplash.com/photo-1574976778408-0126780c1039?q=80&w=1000", category: "Wildlife", title: "Elephants", location: "Amboseli, Kenya", tags: ["wildlife", "elephants", "africa"] },
    { id: 6, src: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1000", category: "Landscape", title: "Serengeti Sun", location: "Tanzania", tags: ["landscape", "sunset", "africa"] },
  ],
  toursSettings: { title: "Expeditions", subtitle: "UPCOMING DEPARTURES 2026/2027", description: "Join me on carefully curated journeys into the world's most spectacular wilderness areas." },
  tours: [
    { id: 1, title: "Kingdom of the Ice Bear", location: "Svalbard, Arctic", date: "June 15 - 25, 2026", image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=1000", description: "An exclusive expedition ship charter to find Polar Bears on pack ice.", price: "From $12,500", itinerary: ["Day 1-2: Arrival in Longyearbyen, expedition briefing", "Day 3-5: Sailing through pack ice, polar bear tracking", "Day 6-7: Glacier exploration and wildlife photography", "Day 8-9: Remote fjords and seabird colonies", "Day 10: Return to Longyearbyen, departure"], highlights: ["Expert naturalist guides", "Zodiac excursions daily", "Professional photography support", "All-inclusive luxury accommodation", "Small group (max 12 guests)"] },
    { id: 2, title: "Shadow of the Jaguar", location: "Pantanal, Brazil", date: "Sept 10 - 20, 2026", image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=1000", description: "Boat-based photography tracking the elusive jaguar.", price: "From $8,500", itinerary: ["Day 1: Arrival in Cuiabá, transfer to lodge", "Day 2-4: Morning and afternoon boat safaris", "Day 5-6: Jaguar tracking on the Three Brothers River", "Day 7-8: Giant otter and caiman observation", "Day 9-10: Final safaris and departure"], highlights: ["World's highest jaguar density", "Experienced local trackers", "Floating lodge accommodation", "Unlimited photography opportunities", "Conservation contribution included"] },
  ],
  testimonials: [
    { id: 1, name: "Sarah Mitchell", location: "London, UK", tour: "Kingdom of the Ice Bear", quote: "An absolutely life-changing experience. Seeing polar bears in their natural habitat with such an knowledgeable guide was beyond my wildest dreams.", rating: 5 },
    { id: 2, name: "James Chen", location: "Singapore", tour: "Shadow of the Jaguar", quote: "The level of expertise and attention to detail was extraordinary. We spotted 8 different jaguars in just 5 days!", rating: 5 },
    { id: 3, name: "Elena Rodriguez", location: "Madrid, Spain", tour: "Kingdom of the Ice Bear", quote: "Professional, safe, and incredibly rewarding. The photography opportunities were endless and the guides knew exactly where to find wildlife.", rating: 5 }
  ],
  blogsSettings: { title: "Field Notes", subtitle: "STORIES FROM THE WILD" },
  blogs: [
    { id: 1, date: "OCT 14, 2025", title: "The Ethics of Wildlife Photography", description: "Why we must prioritize the subject's welfare over the perfect shot.", readTime: "8 min read", content: "Wildlife photography carries immense responsibility. Every frame we capture has the potential to inspire conservation or, conversely, to disturb the very subjects we seek to celebrate.\n\nThe golden rule is simple: the welfare of the animal always comes first. No photograph is worth causing stress, altering natural behavior, or putting wildlife at risk. This means maintaining appropriate distances, never using bait or calls to attract animals, and being willing to walk away when our presence becomes intrusive.\n\nI've witnessed photographers chase animals for the 'perfect shot,' use flash in sensitive situations, and trample vegetation to get closer. These actions not only harm wildlife but also set a terrible precedent for others.\n\nAs storytellers of the natural world, we must be its guardians first and photographers second. The best wildlife images come from patience, understanding animal behavior, and respecting boundaries—not from pushing limits." },
    { id: 2, date: "SEP 02, 2025", title: "Gear Guide: Lens Choices for Jungle Safaris", description: "Analyzing the 400mm vs 600mm debate for low light conditions.", readTime: "12 min read", content: "The eternal debate among wildlife photographers: should you go for reach with a 600mm or versatility with a 400mm? After 12 years in the field, here's my perspective.\n\nIn dense jungle environments like the Indian tiger reserves, I've found the 400mm f/2.8 to be more practical. The extra stop of light is invaluable in the dark understory where tigers often rest during midday. The lighter weight also means faster reactions when a leopard suddenly appears.\n\nHowever, for open savanna work in Africa, the 600mm shines. Subjects are often further away, and the compression effect creates stunning isolation of your subject.\n\nMy recommendation: if you can only own one, get the 400mm f/2.8 with a 1.4x teleconverter. This gives you effective 560mm at f/4 when needed, while maintaining the flexibility of a faster, lighter lens for most situations.\n\nRemember, the best camera is the one you have with you—and the one you can handle effectively in the field." },
  ],
  contact: { title: "Curate Your Experience", subtitle: "Let us design your journey into the wild.", successMessage: "Thank you for your inquiry! We will contact you within 48 hours." },
  formOptions: {
    destinations: ["India (Tigers, Leopards)", "Africa (Migration, Big Cats)", "South America (Jaguars)", "Polar Regions (Bears)", "Southeast Asia (Orangutans)"],
    budgetIndia: ["USD $2,250 - 3,600 per person", "USD $3,600 - 6,000 per person", "USD $6,000 - 10,000 per person", "USD $10,000+ per person", "Not interested in India"],
    budgetAfrica: ["USD $5500 per person", "USD $5500 - 8000 per person", "USD $8000 - 11,500 per person", "USD $12,000+ per person", "Not interested in Africa"],
    contactMethods: ["Email", "Phone", "WhatsApp", "Video Call"],
    referralSources: ["Instagram", "YouTube", "Google", "Facebook", "LinkedIn", "Word of Mouth", "Other"]
  },
  backgrounds: {
    home: { desktop: "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=2670", mobile: "", position: "center center" },
    about: { desktop: "https://images.unsplash.com/photo-1534759846116-5799c33ce36a?q=80&w=2670", mobile: "", position: "center center" },
    gallery: { desktop: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=2670", mobile: "", position: "center center" },
    tours: { desktop: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?q=80&w=2670", mobile: "", position: "center center" },
    blogs: { desktop: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2670", mobile: "", position: "center center" },
    contact: { desktop: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2670", mobile: "", position: "center center" }
  }
};
