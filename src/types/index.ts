// ===========================================
// ASARA - Types TypeScript
// ===========================================

// ===========================================
// User Types
// ===========================================

export type UserRole = 'ADMIN' | 'PROFESSIONAL' | 'MEMBER';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  firstName: string;
  lastName: string;
  phone?: string;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  emailVerified: boolean;
}

export interface UserWithProfile extends User {
  profile?: ProfessionalProfile;
}

// ===========================================
// Professional Profile Types
// ===========================================

export interface ProfessionalProfile {
  id: string;
  userId: string;
  companyName?: string;
  profession: string;
  category: string;
  specialty?: string;
  description?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  professionalPhone?: string;
  professionalEmail?: string;
  website?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  photoUrl?: string;
  logoUrl?: string;
  isPublished: boolean;
  publishedAt?: Date;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfessionalCardData {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  profession: string;
  category: string;
  city?: string;
  photoUrl?: string;
}

// ===========================================
// Subscription Types
// ===========================================

export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';

export interface Subscription {
  id: string;
  userId: string;
  type: UserRole;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// Payment Types
// ===========================================

export type PaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  status: PaymentStatus;
  invoiceNumber?: string;
  invoiceUrl?: string;
  description?: string;
  createdAt: Date;
  paidAt?: Date;
}

// ===========================================
// Category Types
// ===========================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

// ===========================================
// API Response Types
// ===========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// ===========================================
// Form Types
// ===========================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'PROFESSIONAL' | 'MEMBER';
}

export interface ProfessionalFormData {
  companyName?: string;
  profession: string;
  category: string;
  specialty?: string;
  description?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  professionalPhone?: string;
  professionalEmail?: string;
  website?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

// ===========================================
// Search & Filter Types
// ===========================================

export interface DirectoryFilters {
  search?: string;
  category?: string;
  city?: string;
  page?: number;
  perPage?: number;
}

// ===========================================
// Component Props Types
// ===========================================

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
