export interface TemplateData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  occasion: "wedding" | "birthday" | "debut" | "baptism" | "anniversary" | "other";
  occasionLabel: string;
  description: string;
  features: string[];
  samplePricePHP: number;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  sampleEvent: {
    title: string;
    hosts: string;
    date: string;
    displayDate: string;
    time: string;
    venue: string;
    address: string;
    story: string;
    dressCode: string;
    schedule: Array<{ time: string; activity: string }>;
  };
  thumbnailStyle: "arch-editorial" | "midnight-celestial" | "soft-botanical";
}

export const TEMPLATES: TemplateData[] = [
  {
    id: "serenade-wedding",
    slug: "serenade-wedding",
    name: "Serenade",
    tagline: "Timeless Parisian Romance with Editorial Elegance",
    occasion: "wedding",
    occasionLabel: "Wedding",
    description: "Designed for romantic, heartfelt weddings. Features soft warm ivory tones, classic editorial serif typography, graceful arched imagery, an interactive love story timeline, ceremony schedule, and seamless RSVP.",
    features: [
      "Custom Monogram Header",
      "Interactive Countdown",
      "Editorial Story Timeline",
      "Entourage & Schedule Details",
      "Dietary & Guest RSVP",
      "Google Maps Integration",
      "Optional Acoustic Background Music",
    ],
    samplePricePHP: 1899,
    palette: {
      primary: "#292824",
      secondary: "#8B8278",
      accent: "#D9B7B0",
      background: "#FAF8F3",
      text: "#292824",
    },
    sampleEvent: {
      title: "The Wedding of Mateo & Sofia",
      hosts: "Mateo Valenzuela & Sofia Ramirez",
      date: "2027-02-14",
      displayDate: "Sunday, February 14, 2027",
      time: "3:30 PM PHT",
      venue: "Villa San Lorenzo Pavilion",
      address: "Ridgeview Heights, Tagaytay City, Cavite",
      story: "Mateo and Sofia met during a rainy afternoon in Intramuros six years ago. After countless shared coffees, travel adventures, and quiet sunsets, they invite you to celebrate the start of their forever.",
      dressCode: "Formal Garden Attire in Soft Neutrals, Earthy Greens, and Dusty Rose",
      schedule: [
        { time: "3:30 PM", activity: "Guest Arrival & Welcome Refreshments" },
        { time: "4:00 PM", activity: "Garden Wedding Ceremony" },
        { time: "5:30 PM", activity: "Sunset Cocktails & Hor D'oeuvres" },
        { time: "6:30 PM", activity: "Dinner & Toasts" },
        { time: "8:30 PM", activity: "First Dance & Celebratory Party" },
      ],
    },
    thumbnailStyle: "arch-editorial",
  },
  {
    id: "celestial-debut",
    slug: "celestial-debut",
    name: "Celestial Bloom",
    tagline: "Constellation Glamour for Debuts & Grand Milestones",
    occasion: "debut",
    occasionLabel: "Debut & 18th Milestone",
    description: "An enchanting, starry celebration aesthetic. Midnight navy and celestial champagne tones paired with delicate shimmering accents, 18 Roses / 18 Candles program, and a modern guest wish wall.",
    features: [
      "Starry Constellation Accents",
      "Traditional 18s Ceremony Tracker",
      "Celebrant Portrait Gallery",
      "Live RSVP with Song Requests",
      "Dress Code & Color Palette Guide",
      "Gift Preference & Attire Notes",
    ],
    samplePricePHP: 2199,
    palette: {
      primary: "#F8F6F0",
      secondary: "#C5A880",
      accent: "#8FA382",
      background: "#161B26",
      text: "#ECEBE4",
    },
    sampleEvent: {
      title: "Cassandra's 18th Celestial Night",
      hosts: "Cassandra Denise Alcantara",
      date: "2027-03-20",
      displayDate: "Saturday, March 20, 2027",
      time: "6:00 PM PHT",
      venue: "Grand Ballroom, The Glasshouse at BGC",
      address: "Bonifacio Global City, Taguig City, Metro Manila",
      story: "As Cassandra turns eighteen, she steps gracefully into young adulthood. Join her family and dearest friends under a canopy of stars for an unforgettable night of music, memories, and celebration.",
      dressCode: "Black Tie & Evening Gowns in Midnight Blue, Silver, or Champagne",
      schedule: [
        { time: "6:00 PM", activity: "Red Carpet Arrival & Photo Vignette" },
        { time: "6:45 PM", activity: "Grand Entrance & Welcome Toast" },
        { time: "7:15 PM", activity: "Formal Dinner Banquet" },
        { time: "8:00 PM", activity: "The 18 Roses & 18 Candles Ceremony" },
        { time: "9:30 PM", activity: "Celebration Dance & Afterparty" },
      ],
    },
    thumbnailStyle: "midnight-celestial",
  },
  {
    id: "botanica-christening",
    slug: "botanica-christening",
    name: "Botanica",
    tagline: "Gentle Sage & Wildflower Charm for Baptisms & Children",
    occasion: "baptism",
    occasionLabel: "Baptism & Christening",
    description: "Warm, pure, and serene. Muted sage, oat milk, and gentle olive branch motifs celebrate welcoming a sweet little one into the community of faith and family.",
    features: [
      "Handcrafted Leaf & Floral Frames",
      "Godparents / Ninong & Ninang Section",
      "Reception & Ceremony Guide",
      "Baby Milestones Vignette",
      "Direct Guest Well-Wishes",
      "Printable Keepsake PDF Link",
    ],
    samplePricePHP: 1699,
    palette: {
      primary: "#2C3527",
      secondary: "#6B7D60",
      accent: "#AAB5A0",
      background: "#F4F6F2",
      text: "#2C3527",
    },
    sampleEvent: {
      title: "The Holy Baptism of Lucas Gabriel",
      hosts: "Lucas Gabriel Santos (with parents Andres & Mia)",
      date: "2027-04-11",
      displayDate: "Sunday, April 11, 2027",
      time: "10:30 AM PHT",
      venue: "Santuario de San Antonio Parish",
      address: "Forbes Park, Makati City, Metro Manila",
      story: "We gratefully celebrate the gift of baby Lucas Gabriel as he receives the sacrament of Holy Baptism. Your prayers, love, and presence in his life mean the world to our family.",
      dressCode: "Sunday Best / Smart Casual in Soft Pastels, Whites, and Sage",
      schedule: [
        { time: "10:30 AM", activity: "Sacrament of Baptism at the Main Altar" },
        { time: "11:45 AM", activity: "Group Photos & Ninong / Ninang Blessings" },
        { time: "12:30 PM", activity: "Lunch Reception at Antonio's Garden Hall" },
        { time: "2:00 PM", activity: "Cake Cutting & Thank-You Remarks" },
      ],
    },
    thumbnailStyle: "soft-botanical",
  },
];
