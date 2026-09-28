export type UserRole = 'client' | 'applicant' | 'admin';

export interface UserAccount {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ClientProfile {
  id?: string;
  uid: string;
  displayName: string;
  age: number;
  city: string;
  photoUrl: string;
  shortIntro: string;
  interests: string[];
  preferredAgeRange: string;
  preferredCity: string;
  languages: string[];
  availability: string;
  profileVisibility: 'registered_only' | 'private';
  savedCompanionIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CompanionApplication {
  id: string;
  uid: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  city: string;
  isAgeConfirmed: boolean;
  languages: string[];
  interests: string[];
  shortIntro: string;
  availability: string;
  experience: string;
  profilePhotos: string[];
  applicationStatement: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanionProfile {
  id: string;
  displayName: string;
  age: number;
  city: string;
  photoUrl: string;
  gallery: string[];
  bio: string;
  languages: string[];
  interests: string[];
  availability: string;
  profileType?: string;
  isPublished: boolean;
  isFeatured: boolean;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  id: string;
  referenceNumber: string;
  clientId: string;
  clientDisplayName: string;
  clientEmail: string;
  companionId: string;
  companionDisplayName: string;
  companionPhotoUrl?: string;
  preferredDate: string;
  preferredTime: string;
  city: string;
  message: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'admin';
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reportedType: 'profile' | 'message' | 'other';
  targetId: string;
  targetName?: string;
  reason: string;
  details: string;
  status: 'new' | 'under_review' | 'action_taken' | 'closed';
  resolutionNotes?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  referenceNumber?: string;
  category: string;
  message: string;
  status: 'new' | 'open' | 'resolved';
  createdAt: string;
}

export interface PaymentPlaceholder {
  id: string;
  paymentId: string;
  clientId: string;
  clientEmail: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'refunded';
  description: string;
  date: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video';
  category: string;
  uploadedBy: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  city: string;
  quote: string;
  rating: number;
  companionName?: string;
  date: string;
  isActive: boolean;
  isDemo?: boolean;
}

export interface SiteSettings {
  id?: string;
  businessEmail: string;
  supportEmail: string;
  phone: string;
  businessAddress: string;
  businessHours: string;
  heroVideoUrl: string;
  heroFallbackImg: string;
  heroHeadline: string;
  heroSubheadline: string;
  homepageSectionsOrder: string[];
  hiddenSections: string[];
}
