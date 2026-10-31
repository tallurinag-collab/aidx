export type PlaceCategory = 'Stay' | 'Food' | 'Sightseeing' | 'Transport';
export type Visibility = 'Public' | 'Followers' | 'Private';

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  destination: string;
  area: string;
  description: string;
  price: string;
  image: string;
  tag: string;
  source: string;
  link?: string;
};

export type ItineraryItem = {
  id: string;
  placeId?: string;
  title: string;
  category: PlaceCategory | 'Note';
  date?: string;
  time?: string;
  note?: string;
};

export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  visibility: Visibility;
  notes?: string;
  image: string;
  items: ItineraryItem[];
};

export type Story = {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  destination: string;
  date: string;
  title: string;
  body: string;
  image: string;
  placeId?: string;
  visibility: Visibility;
  likes: number;
  featured?: boolean;
};

export const destinations = [
  { name: 'Lisbon, Portugal', country: 'Portugal', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1400&q=85', note: 'Sunlit lanes & slow lunches', temperature: '22°' },
  { name: 'Kyoto, Japan', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=85', note: 'Temples, tea & quiet mornings', temperature: '18°' },
  { name: 'Amalfi Coast, Italy', country: 'Italy', image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=1400&q=85', note: 'Coastal paths & lemon groves', temperature: '24°' },
  { name: 'Mexico City, Mexico', country: 'Mexico', image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1400&q=85', note: 'A city made for wandering', temperature: '21°' },
];

export const places: Place[] = [
  {
    id: 'stay-lisbon-1',
    name: 'Casa do Mercado',
    category: 'Stay',
    destination: 'Lisbon, Portugal',
    area: 'Bairro Alto',
    description: 'A small, design-minded guesthouse tucked above the old market streets.',
    price: 'From €€ · sample estimate',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85',
    tag: 'Guest favorite',
    source: 'Community guide · sample listing',
    link: 'https://www.google.com/maps/search/?api=1&query=Bairro+Alto+Lisbon',
  },
  {
    id: 'food-lisbon-1',
    name: 'Taberna da Rua',
    category: 'Food',
    destination: 'Lisbon, Portugal',
    area: 'Chiado',
    description: 'Seasonal petiscos, a short chalkboard menu, and a lively little terrace.',
    price: '€€ · sample estimate',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85',
    tag: 'Local table',
    source: 'Community guide · sample listing',
    link: 'https://www.google.com/maps/search/?api=1&query=restaurants+Chiado+Lisbon',
  },
  {
    id: 'sight-lisbon-1',
    name: 'Miradouro da Graça',
    category: 'Sightseeing',
    destination: 'Lisbon, Portugal',
    area: 'Graça',
    description: 'A hilltop lookout with wide city views. Go near golden hour and bring water.',
    price: 'Free · sample guide',
    image: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?auto=format&fit=crop&w=1000&q=85',
    tag: 'Golden hour',
    source: 'Community guide · sample listing',
    link: 'https://www.google.com/maps/search/?api=1&query=Miradouro+da+Gra%C3%A7a+Lisbon',
  },
  {
    id: 'transit-lisbon-1',
    name: 'Lisbon by tram & foot',
    category: 'Transport',
    destination: 'Lisbon, Portugal',
    area: 'City-wide',
    description: 'A relaxed way to connect the central neighborhoods. Check current routes with the operator.',
    price: 'Fares vary · check operator',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=85',
    tag: 'Getting around',
    source: 'General travel note · verify before travel',
    link: 'https://www.google.com/search?q=Lisbon+public+transport+official',
  },
  {
    id: 'stay-kyoto-1',
    name: 'The Machiya Stay',
    category: 'Stay',
    destination: 'Kyoto, Japan',
    area: 'Higashiyama',
    description: 'A traditional townhouse stay close to quiet lanes and temple paths.',
    price: 'From ¥¥ · sample estimate',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=85',
    tag: 'Slow mornings',
    source: 'Community guide · sample listing',
  },
  {
    id: 'food-kyoto-1',
    name: 'Kissa Haku',
    category: 'Food',
    destination: 'Kyoto, Japan',
    area: 'Gion',
    description: 'A neighborhood kissaten for coffee, toast, and a pause between walks.',
    price: '¥ · sample estimate',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85',
    tag: 'Coffee stop',
    source: 'Community guide · sample listing',
  },
  {
    id: 'sight-kyoto-1',
    name: 'Philosopher’s Path',
    category: 'Sightseeing',
    destination: 'Kyoto, Japan',
    area: 'Sakyo',
    description: 'A canal-side walking route linking small temples, cafes, and leafy side streets.',
    price: 'Free · sample guide',
    image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1000&q=85',
    tag: 'Walkable',
    source: 'Community guide · sample listing',
  },
  {
    id: 'transit-kyoto-1',
    name: 'Kyoto bus & rail',
    category: 'Transport',
    destination: 'Kyoto, Japan',
    area: 'City-wide',
    description: 'Combine rail for longer hops with local buses. Confirm routes and passes with official operators.',
    price: 'Fares vary · check operator',
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85',
    tag: 'Getting around',
    source: 'General travel note · verify before travel',
    link: 'https://www.google.com/search?q=Kyoto+city+bus+official',
  },
];

export const starterTrips: Trip[] = [
  {
    id: 'trip-lisbon',
    title: 'A long weekend in Lisbon',
    destination: 'Lisbon, Portugal',
    startDate: '2026-11-12',
    endDate: '2026-11-16',
    visibility: 'Private',
    notes: 'Leave room for wandering and a very long lunch.',
    image: destinations[0].image,
    items: [
      { id: 'item-lisbon-1', placeId: 'stay-lisbon-1', title: 'Casa do Mercado', category: 'Stay', date: '2026-11-12', note: 'Check current rates and availability with the property.' },
      { id: 'item-lisbon-2', placeId: 'sight-lisbon-1', title: 'Sunset at Miradouro da Graça', category: 'Sightseeing', date: '2026-11-13', time: '17:30' },
      { id: 'item-lisbon-3', placeId: 'food-lisbon-1', title: 'Dinner in Chiado', category: 'Food', date: '2026-11-13', time: '19:30' },
      { id: 'item-lisbon-4', placeId: 'transit-lisbon-1', title: 'Tram & neighborhood walk', category: 'Transport', date: '2026-11-14' },
    ],
  },
  {
    id: 'trip-kyoto',
    title: 'Kyoto, at a slower pace',
    destination: 'Kyoto, Japan',
    startDate: '2027-03-04',
    endDate: '2027-03-09',
    visibility: 'Followers',
    notes: 'Early starts, small cafes, no packed schedule.',
    image: destinations[1].image,
    items: [
      { id: 'item-kyoto-1', placeId: 'stay-kyoto-1', title: 'The Machiya Stay', category: 'Stay', date: '2027-03-04' },
      { id: 'item-kyoto-2', placeId: 'sight-kyoto-1', title: 'Walk the Philosopher’s Path', category: 'Sightseeing', date: '2027-03-05', time: '09:00' },
      { id: 'item-kyoto-3', placeId: 'food-kyoto-1', title: 'Coffee at Kissa Haku', category: 'Food', date: '2027-03-05', time: '11:30' },
    ],
  },
];

export const starterStories: Story[] = [
  {
    id: 'story-1',
    author: 'Maya Chen',
    handle: '@mayawanders',
    avatar: 'MC',
    destination: 'Lisbon, Portugal',
    date: '2 days ago',
    title: 'The best Lisbon days have no timetable',
    body: 'We took the long way up every hill, stopped whenever the light looked good, and let lunch stretch into the afternoon. Graça was my favorite pause — bring water for the climb and stay for the view.',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1400&q=85',
    placeId: 'sight-lisbon-1',
    visibility: 'Public',
    likes: 128,
    featured: true,
  },
  {
    id: 'story-2',
    author: 'Jonah Rivera',
    handle: '@jonahoutside',
    avatar: 'JR',
    destination: 'Kyoto, Japan',
    date: '5 days ago',
    title: 'A quiet morning along the canal',
    body: 'We arrived early, walked slowly, and left the afternoon open. A small coffee stop made the walk feel like a whole day rather than a checklist.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=85',
    placeId: 'sight-kyoto-1',
    visibility: 'Public',
    likes: 86,
  },
  {
    id: 'story-3',
    author: 'Aisha Patel',
    handle: '@aishasees',
    avatar: 'AP',
    destination: 'Amalfi Coast, Italy',
    date: '1 week ago',
    title: 'A little less beach, a little more walking',
    body: 'The footpaths between villages were the part I keep thinking about. Take your time, wear shoes with grip, and check local route conditions before you go.',
    image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=1400&q=85',
    visibility: 'Public',
    likes: 54,
  },
];

export const categoryMeta: Record<PlaceCategory, { icon: string; label: string }> = {
  Stay: { icon: '⌂', label: 'Stays' },
  Food: { icon: '♨', label: 'Food & drink' },
  Sightseeing: { icon: '◉', label: 'Things to do' },
  Transport: { icon: '↗', label: 'Getting around' },
};
