import { CompanionProfile, Testimonial, SiteSettings, PaymentPlaceholder } from '../types';

export const INITIAL_COMPANION_PROFILES: CompanionProfile[] = [
  {
    id: 'companion-1',
    displayName: 'Priyanka Sharma',
    age: 29,
    city: 'Mumbai',
    photoUrl: '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
    gallery: [
      '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
      '/src/assets/images/story_indian_married_women_1790523969019.jpg'
    ],
    bio: 'Art curator and classical Kathak exponent. Married and socially accomplished, Priyanka offers articulate and poised accompaniment for art exhibitions at NMACC, private gallery viewings in Kala Ghoda, and high-table dining across South Mumbai.',
    languages: ['English', 'Hindi', 'Marathi'],
    interests: ['Contemporary Art', 'Classical Dance', 'Fine Dining', 'Heritage Architecture', 'Literature'],
    availability: 'Evenings & Weekends by prior concierge arrangement',
    profileType: 'Cultural & High-Society Companion (Married)',
    isPublished: true,
    isFeatured: true,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'companion-2',
    displayName: 'Ananya Sen',
    age: 32,
    city: 'Mumbai & Delhi',
    photoUrl: '/src/assets/images/companion_ananya_mumbai_1790523940652.jpg',
    gallery: [
      '/src/assets/images/companion_ananya_mumbai_1790523940652.jpg',
      '/src/assets/images/hero_indian_married_woman_1790523916791.jpg'
    ],
    bio: 'Former literary editor and corporate communications strategist. An accomplished Indian married woman known for intellectual charm, impeccable etiquette, and engaging conversation at black-tie charity galas, literature festivals, and executive dinners.',
    languages: ['English', 'Hindi', 'Bengali'],
    interests: ['Literature Festivals', 'Symphonic Music', 'Culinary Arts', 'Modern Architecture', 'Philanthropy'],
    availability: 'Flexible scheduling with 48h advance notice',
    profileType: 'Executive & Gala Companion (Married)',
    isPublished: true,
    isFeatured: true,
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-02T10:00:00Z'
  },
  {
    id: 'companion-3',
    displayName: 'Meera Singhania',
    age: 28,
    city: 'Mumbai & Bengaluru',
    photoUrl: '/src/assets/images/companion_meera_mumbai_1790523956059.jpg',
    gallery: [
      '/src/assets/images/companion_meera_mumbai_1790523956059.jpg',
      '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg'
    ],
    bio: 'Sommelier, interior stylist, and classical violinist. A gracious Indian married woman with warm poise, ideal for Michelin-grade dinners at the Taj, private tastings, and luxury soirees across Mumbai and Bengaluru.',
    languages: ['English', 'Hindi', 'Gujarati'],
    interests: ['Wine Tasting', 'Violin', 'Polo Matches', 'Haute Couture', 'Heritage Travel'],
    availability: 'Select dates monthly; international & domestic arrangements',
    profileType: 'Socialite & Fine Dining Companion (Married)',
    isPublished: true,
    isFeatured: true,
    createdAt: '2026-09-03T10:00:00Z',
    updatedAt: '2026-09-03T10:00:00Z'
  },
  {
    id: 'companion-4',
    displayName: 'Kavita Deshmukh',
    age: 34,
    city: 'Mumbai & Pune',
    photoUrl: '/src/assets/images/hero_indian_married_woman_1790523916791.jpg',
    gallery: [
      '/src/assets/images/hero_indian_married_woman_1790523916791.jpg',
      '/src/assets/images/companion_ananya_mumbai_1790523940652.jpg'
    ],
    bio: 'Architectural historian and classical vocalist. An articulate, poised married companion for cultural symposiums, theater evenings at NCPA, bespoke dinners, and high-profile social gatherings.',
    languages: ['English', 'Hindi', 'Marathi'],
    interests: ['Classical Vocals', 'Heritage Architecture', 'Horology', 'NCPA Theater', 'Philanthropy'],
    availability: 'Evenings and weekend retreats via concierge',
    profileType: 'Heritage & Symphony Companion (Married)',
    isPublished: true,
    isFeatured: true,
    createdAt: '2026-09-04T10:00:00Z',
    updatedAt: '2026-09-04T10:00:00Z'
  },
  {
    id: 'companion-5',
    displayName: 'Radhika Nair',
    age: 30,
    city: 'Mumbai & Goa',
    photoUrl: '/src/assets/images/story_indian_married_women_1790523969019.jpg',
    gallery: [
      '/src/assets/images/story_indian_married_women_1790523969019.jpg',
      '/src/assets/images/companion_meera_mumbai_1790523956059.jpg'
    ],
    bio: 'Maritime enthusiast and multilingual translator. Gracious Indian married companion for Arabian Sea yachting rendezvous, heritage club dinners, and high-level cultural gatherings.',
    languages: ['English', 'Hindi', 'Malayalam'],
    interests: ['Yachting', 'Literature', 'Fine Dining', 'Equestrian', 'Modern Art'],
    availability: 'Available for curated bookings via Mumbai concierge',
    profileType: 'Yachting & Coastal Soiree Companion (Married)',
    isPublished: true,
    isFeatured: false,
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-09-05T10:00:00Z'
  },
  {
    id: 'companion-6',
    displayName: 'Sunita Kapoor',
    age: 31,
    city: 'Mumbai',
    photoUrl: '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
    gallery: [
      '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
      '/src/assets/images/hero_indian_married_woman_1790523916791.jpg'
    ],
    bio: 'Literature graduate and connoisseur of performing arts. Impeccable Indian etiquette, witty banter, and discreet companionship for South Mumbai private clubs, film premieres, and private dining.',
    languages: ['English', 'Hindi', 'Punjabi'],
    interests: ['Theater', 'Rare Books', 'Culinary Arts', 'Fine Jewelry', 'Tennis'],
    availability: 'Thursday to Sunday evenings',
    profileType: 'Private Club & Theater Companion (Married)',
    isPublished: true,
    isFeatured: false,
    createdAt: '2026-09-06T10:00:00Z',
    updatedAt: '2026-09-06T10:00:00Z'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Rajiv M.',
    city: 'Mumbai',
    quote: 'The concierge arranged our dinner at The Taj Mahal Palace with impeccable discretion. Priyanka’s conversational elegance and cultural poise completely elevated the evening.',
    rating: 5,
    companionName: 'Priyanka S.',
    date: 'August 2026',
    isActive: true
  },
  {
    id: 'test-2',
    clientName: 'Vikramaditya S.',
    city: 'Delhi',
    quote: 'Attending an executive foundation gala required cultured, articulate accompaniment. Ananya represented the pinnacle of grace and etiquette. An unmatched experience.',
    rating: 5,
    companionName: 'Ananya S.',
    date: 'July 2026',
    isActive: true
  },
  {
    id: 'test-3',
    clientName: 'Dr. Anita K.',
    city: 'Bengaluru',
    quote: 'Discretion, mutual sovereignty, and sophistication are paramount for our circle. Kingsman Corporation sets the gold standard for refined adult companionship in India.',
    rating: 5,
    companionName: 'Meera S.',
    date: 'June 2026',
    isActive: true
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  businessEmail: 'kingsmancorporation@gmail.com',
  supportEmail: 'kingsmancorporation@gmail.com',
  phone: '+91 87239 45876 (Mumbai Concierge Desk)',
  businessAddress: 'Office No, 312, Swami Vivekanand Rd, Machi Market, Appa Pada, Malad East, Mumbai, Maharashtra 400102',
  businessHours: 'Concierge Desk: 24/7 for Registered Members (Mumbai Headquarters)',
  heroVideoUrl: '',
  heroFallbackImg: '/src/assets/images/hero_indian_married_woman_1790523916791.jpg',
  heroHeadline: 'Where Exceptional Connections Begin.',
  heroSubheadline: 'India’s premier private platform connecting distinguished individuals with cultured Indian married women for refined companionship, cultural galas, and fine dining.',
  homepageSectionsOrder: [
    'hero',
    'howItWorks',
    'featuredProfiles',
    'companyStory',
    'whyKingsman',
    'testimonials',
    'faq',
    'contactSupport'
  ],
  hiddenSections: []
};

export const INITIAL_PAYMENT_PLACEHOLDERS: PaymentPlaceholder[] = [
  {
    id: 'pay-101',
    paymentId: 'KC-MEM-8041',
    clientId: 'cli-mumbai-8041',
    clientEmail: 'r.mehra@executive.in',
    amount: 25000,
    currency: 'INR',
    status: 'completed',
    description: 'Platform Concierge & Vetting Arrangement Fee',
    date: '2026-09-15'
  },
  {
    id: 'pay-102',
    paymentId: 'KC-MEM-8042',
    clientId: 'cli-delhi-8042',
    clientEmail: 'v.sharma@investments.in',
    amount: 50000,
    currency: 'INR',
    status: 'completed',
    description: 'Bespoke Evening Coordination Service Retainer',
    date: '2026-09-20'
  }
];
