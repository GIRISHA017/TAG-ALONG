export const CATEGORIES = [
  { id: "concerts", label: "Concerts", icon: "🎵" },
  { id: "movies", label: "Movies", icon: "🎬" },
  { id: "festivals", label: "Festivals", icon: "🎉" },
  { id: "weddings", label: "Weddings", icon: "💍" },
  { id: "travel", label: "Travel", icon: "✈️" },
  { id: "food", label: "Food Event", icon: "🍴" },
  { id: "workshops", label: "Workshops", icon: "📚" },
  { id: "other", label: "Other Events", icon: "✨" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export interface InterestedUser {
  username: string;
  name: string;
  avatar: string;
  tags: string[];
}

export interface EventItem {
  id: string;
  name: string;
  date: string;
  location: string;
  image: string;
  category: CategoryId;
  peopleLooking: number;
  interestedUsers: InterestedUser[];
}

const avatars = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

export const MOCK_EVENTS: EventItem[] = [
  {
    id: "ev1",
    name: "Arijit Singh Live in Hyderabad",
    date: "Mar 15, 2026",
    location: "Hitex Exhibition Centre",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
    category: "concerts",
    peopleLooking: 24,
    interestedUsers: [
      { username: "priya", name: "Priya", avatar: avatars("Priya"), tags: ["Music lover", "First time"] },
      { username: "rahul", name: "Rahul", avatar: avatars("Rahul"), tags: ["Concert buddy"] },
      { username: "sneha", name: "Sneha", avatar: avatars("Sneha"), tags: ["Bollywood fan"] },
      { username: "vikram", name: "Vikram", avatar: avatars("Vikram"), tags: ["Solo traveller"] },
    ],
  },
  {
    id: "ev2",
    name: "Coldplay Concert",
    date: "Jan 20, 2026",
    location: "Gachibowli Stadium",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    category: "concerts",
    peopleLooking: 18,
    interestedUsers: [
      { username: "rahul", name: "Rahul", avatar: avatars("Rahul"), tags: ["Music lover"] },
      { username: "ananya", name: "Ananya", avatar: avatars("Ananya"), tags: ["First time"] },
    ],
  },
  {
    id: "ev3",
    name: "Marvel Movie Marathon",
    date: "Mar 20, 2026",
    location: "PVR IMAX, Banjara Hills",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    category: "movies",
    peopleLooking: 12,
    interestedUsers: [
      { username: "sneha", name: "Sneha", avatar: avatars("Sneha"), tags: ["Movie buff"] },
      { username: "ananya", name: "Ananya", avatar: avatars("Ananya"), tags: ["MCU fan"] },
    ],
  },
  {
    id: "ev4",
    name: "Sunburn Festival Goa",
    date: "Apr 5, 2026",
    location: "Vagator Beach, Goa",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80",
    category: "festivals",
    peopleLooking: 56,
    interestedUsers: [
      { username: "vikram", name: "Vikram", avatar: avatars("Vikram"), tags: ["EDM lover"] },
      { username: "priya", name: "Priya", avatar: avatars("Priya"), tags: ["Festival goer"] },
    ],
  },
  {
    id: "ev5",
    name: "Tech Startup Workshop",
    date: "Feb 28, 2026",
    location: "T-Hub, Hyderabad",
    image: "https://images.unsplash.com/photo-1540575467063-178bf50e2f42?w=600&q=80",
    category: "workshops",
    peopleLooking: 8,
    interestedUsers: [
      { username: "rahul", name: "Rahul", avatar: avatars("Rahul"), tags: ["Entrepreneur"] },
      { username: "ananya", name: "Ananya", avatar: avatars("Ananya"), tags: ["Developer"] },
    ],
  },
  // More Movies
  {
    id: "ev6",
    name: "Movie Night – Dune Part 2",
    date: "Feb 22, 2026",
    location: "AMB Cinemas, Gachibowli",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    category: "movies",
    peopleLooking: 9,
    interestedUsers: [
      { username: "priya", name: "Priya", avatar: avatars("Priya"), tags: ["Sci-fi fan"] },
      { username: "vikram", name: "Vikram", avatar: avatars("Vikram"), tags: ["Movie buddy"] },
    ],
  },
  {
    id: "ev7",
    name: "Oppenheimer IMAX Experience",
    date: "Mar 1, 2026",
    location: "PVR IMAX, Inorbit",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80",
    category: "movies",
    peopleLooking: 14,
    interestedUsers: [
      { username: "sneha", name: "Sneha", avatar: avatars("Sneha"), tags: ["History buff"] },
    ],
  },
  // More Festivals
  {
    id: "ev8",
    name: "Holi Colour Festival",
    date: "Mar 14, 2026",
    location: "Lumbini Park, Hyderabad",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    category: "festivals",
    peopleLooking: 32,
    interestedUsers: [
      { username: "rahul", name: "Rahul", avatar: avatars("Rahul"), tags: ["Festival lover"] },
      { username: "priya", name: "Priya", avatar: avatars("Priya"), tags: ["First time"] },
    ],
  },
  // Weddings
  {
    id: "ev9",
    name: "Destination Wedding – Udaipur",
    date: "Apr 12, 2026",
    location: "The Leela Palace, Udaipur",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    category: "weddings",
    peopleLooking: 6,
    interestedUsers: [
      { username: "sneha", name: "Sneha", avatar: avatars("Sneha"), tags: ["Plus one needed"] },
      { username: "ananya", name: "Ananya", avatar: avatars("Ananya"), tags: ["Travel buddy"] },
    ],
  },
  {
    id: "ev10",
    name: "Friend's Wedding Reception",
    date: "Mar 28, 2026",
    location: "Taj Krishna, Hyderabad",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
    category: "weddings",
    peopleLooking: 11,
    interestedUsers: [
      { username: "vikram", name: "Vikram", avatar: avatars("Vikram"), tags: ["Looking for +1"] },
      { username: "rahul", name: "Rahul", avatar: avatars("Rahul"), tags: ["Wedding guest"] },
    ],
  },
  // Travel
  {
    id: "ev11",
    name: "Weekend Trip to Coorg",
    date: "Mar 8–10, 2026",
    location: "Coorg, Karnataka",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80",
    category: "travel",
    peopleLooking: 15,
    interestedUsers: [
      { username: "priya", name: "Priya", avatar: avatars("Priya"), tags: ["Nature lover"] },
      { username: "rahul", name: "Rahul", avatar: avatars("Rahul"), tags: ["Road trip"] },
    ],
  },
  {
    id: "ev12",
    name: "Trek to Kodachadri",
    date: "Feb 15, 2026",
    location: "Kodachadri Hills, Karnataka",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    category: "travel",
    peopleLooking: 8,
    interestedUsers: [
      { username: "vikram", name: "Vikram", avatar: avatars("Vikram"), tags: ["Trekker"] },
      { username: "ananya", name: "Ananya", avatar: avatars("Ananya"), tags: ["Adventure"] },
    ],
  },
  {
    id: "ev13",
    name: "Beach Weekend – Vizag",
    date: "Apr 18–20, 2026",
    location: "Vizag Beach, Andhra Pradesh",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    category: "travel",
    peopleLooking: 12,
    interestedUsers: [
      { username: "sneha", name: "Sneha", avatar: avatars("Sneha"), tags: ["Beach lover"] },
    ],
  },
  // More Workshops
  {
    id: "ev14",
    name: "Photography & Editing Workshop",
    date: "Mar 5, 2026",
    location: "Kalakriti Art Gallery, Hyderabad",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
    category: "workshops",
    peopleLooking: 6,
    interestedUsers: [
      { username: "priya", name: "Priya", avatar: avatars("Priya"), tags: ["Beginner"] },
      { username: "sneha", name: "Sneha", avatar: avatars("Sneha"), tags: ["Creative"] },
    ],
  },
  // Other Events
  {
    id: "ev15",
    name: "IPL Match – SRH vs MI",
    date: "Apr 2, 2026",
    location: "Rajiv Gandhi Stadium, Hyderabad",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80",
    category: "other",
    peopleLooking: 28,
    interestedUsers: [
      { username: "rahul", name: "Rahul", avatar: avatars("Rahul"), tags: ["Cricket fan"] },
      { username: "vikram", name: "Vikram", avatar: avatars("Vikram"), tags: ["Match buddy"] },
    ],
  },
  {
    id: "ev16",
    name: "Stand-up Comedy Night",
    date: "Feb 25, 2026",
    location: "Laugh Factory, Jubilee Hills",
    image: "https://images.unsplash.com/photo-1585699324551-f6b2d4c95f32?w=600&q=80",
    category: "other",
    peopleLooking: 10,
    interestedUsers: [
      { username: "ananya", name: "Ananya", avatar: avatars("Ananya"), tags: ["Comedy lover"] },
      { username: "sneha", name: "Sneha", avatar: avatars("Sneha"), tags: ["Weekend plan"] },
    ],
  },
  {
    id: "ev17",
    name: "Food Festival – Street Eats",
    date: "Mar 22, 2026",
    location: "Hitex Exhibition Grounds",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    category: "other",
    peopleLooking: 22,
    interestedUsers: [
      { username: "priya", name: "Priya", avatar: avatars("Priya"), tags: ["Foodie"] },
      { username: "rahul", name: "Rahul", avatar: avatars("Rahul"), tags: ["Food lover"] },
    ],
  },
];

export function getEventsByCategory(category: CategoryId): EventItem[] {
  return MOCK_EVENTS.filter((e) => e.category === category);
}

export function getEventById(id: string): EventItem | undefined {
  return MOCK_EVENTS.find((e) => e.id === id);
}

export function getCategoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
