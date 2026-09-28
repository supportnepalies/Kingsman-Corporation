```ts
import {
  CompanionProfile,
  Testimonial,
  SiteSettings,
  PaymentPlaceholder,
} from '../types';

export const INITIAL_COMPANION_PROFILES: CompanionProfile[] = [
  {
    id: 'demo-companion-1',
    displayName: 'Demo Companion 01',
    age: 29,
    city: 'Mumbai',
    photoUrl:
      '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
    gallery: [
      '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
      '/src/assets/images/story_indian_married_women_1790523969019.jpg',
    ],
    bio: 'Demo profile for testing the Kingsman Corporation website. This profile is not a real person and is not available for booking.',
    languages: ['English', 'Hindi', 'Marathi'],
    interests: [
      'Art',
      'Culture',
      'Dining',
      'Travel',
      'Literature',
    ],
    availability: 'Demo availability',
    profileType: 'Demo Companion',
    isPublished: true,
    isFeatured: true,
    isDemo: true,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'demo-companion-2',
    displayName: 'Demo Companion 02',
    age: 32,
    city: 'Delhi',
    photoUrl:
      '/src/assets/images/companion_ananya_mumbai_1790523940652.jpg',
    gallery: [
      '/src/assets/images/companion_ananya_mumbai_1790523940652.jpg',
      '/src/assets/images/hero_indian_married_woman_1790523916791.jpg',
    ],
    bio: 'Demo profile for testing the Kingsman Corporation website. This profile is not a real person and is not available for booking.',
    languages: ['English', 'Hindi', 'Bengali'],
    interests: [
      'Literature',
      'Music',
      'Dining',
      'Architecture',
      'Travel',
    ],
    availability: 'Demo availability',
    profileType: 'Demo Companion',
    isPublished: true,
    isFeatured: true,
    isDemo: true,
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'demo-companion-3',
    displayName: 'Demo Companion 03',
    age: 28,
    city: 'Bengaluru',
    photoUrl:
      '/src/assets/images/companion_meera_mumbai_1790523956059.jpg',
    gallery: [
      '/src/assets/images/companion_meera_mumbai_1790523956059.jpg',
      '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
    ],
    bio: 'Demo profile for testing the Kingsman Corporation website. This profile is not a real person and is not available for booking.',
    languages: ['English', 'Hindi', 'Gujarati'],
    interests: [
      'Music',
      'Fashion',
      'Dining',
      'Travel',
      'Art',
    ],
    availability: 'Demo availability',
    profileType: 'Demo Companion',
    isPublished: true,
    isFeatured: true,
    isDemo: true,
    createdAt: '2026-09-03T10:00:00Z',
    updatedAt: '2026-09-03T10:00:00Z',
  },
  {
    id: 'demo-companion-4',
    displayName: 'Demo Companion 04',
    age: 34,
    city: 'Pune',
    photoUrl:
      '/src/assets/images/hero_indian_married_woman_1790523916791.jpg',
    gallery: [
      '/src/assets/images/hero_indian_married_woman_1790523916791.jpg',
      '/src/assets/images/companion_ananya_mumbai_1790523940652.jpg',
    ],
    bio: 'Demo profile for testing the Kingsman Corporation website. This profile is not a real person and is not available for booking.',
    languages: ['English', 'Hindi', 'Marathi'],
    interests: [
      'Culture',
      'Theatre',
      'History',
      'Music',
      'Travel',
    ],
    availability: 'Demo availability',
    profileType: 'Demo Companion',
    isPublished: true,
    isFeatured: true,
    isDemo: true,
    createdAt: '2026-09-04T10:00:00Z',
    updatedAt: '2026-09-04T10:00:00Z',
  },
  {
    id: 'demo-companion-5',
    displayName: 'Demo Companion 05',
    age: 30,
    city: 'Goa',
    photoUrl:
      '/src/assets/images/story_indian_married_women_1790523969019.jpg',
    gallery: [
      '/src/assets/images/story_indian_married_women_1790523969019.jpg',
      '/src/assets/images/companion_meera_mumbai_1790523956059.jpg',
    ],
    bio: 'Demo profile for testing the Kingsman Corporation website. This profile is not a real person and is not available for booking.',
    languages: ['English', 'Hindi', 'Malayalam'],
    interests: [
      'Travel',
      'Yachting',
      'Literature',
      'Dining',
      'Art',
    ],
    availability: 'Demo availability',
    profileType: 'Demo Companion',
    isPublished: true,
    isFeatured: false,
    isDemo: true,
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-09-05T10:00:00Z',
  },
  {
    id: 'demo-companion-6',
    displayName: 'Demo Companion 06',
    age: 31,
    city: 'Hyderabad',
    photoUrl:
      '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
    gallery: [
      '/src/assets/images/companion_priyanka_mumbai_1790523929569.jpg',
      '/src/assets/images/hero_indian_married_woman_1790523916791.jpg',
    ],
    bio: 'Demo profile for testing the Kingsman Corporation website. This profile is not a real person and is not available for booking.',
    languages: ['English', 'Hindi', 'Telugu'],
    interests: [
      'Theatre',
      'Books',
      'Food',
      'Culture',
      'Travel',
    ],
    availability: 'Demo availability',
    profileType: 'Demo Companion',
    isPublished: true,
    isFeatured: false,
    isDemo: true,
    createdAt: '2026-09-06T10:00:00Z',
    updatedAt: '2026-09-06T10:00:00Z',
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  businessEmail: 'contact@kingsmancorporation.example',
  supportEmail: 'support@kingsmancorporation.example',
  phone: '+91 00000 00000',
  businessAddress: 'India',
  businessHours: 'By appointment',

  heroVideoUrl: '',

  heroFallbackImg:
    '/src/assets/images/hero_indian_married_woman_1790523916791.jpg',

  heroHeadline: 'Where Exceptional Connections Begin.',

  heroSubheadline:
    'A refined platform for adults seeking genuine companionship and memorable connections.',

  homepageSectionsOrder: [
    'hero',
    'howItWorks',
    'featuredProfiles',
    'companyStory',
    'whyKingsman',
    'testimonials',
    'faq',
    'contactSupport',
  ],

  hiddenSections: [],
};

export const INITIAL_PAYMENT_PLACEHOLDERS: PaymentPlaceholder[] = [];
```
