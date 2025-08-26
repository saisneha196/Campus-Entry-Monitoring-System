// TypeScript interfaces converted from Flutter models

export interface Visitor {
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  vehicleNumber?: string;
  purposeOfVisit: string;
  numberOfVisitors: number;
  whomToMeet: string;
  department: string;
  documentType: string;
  entryTime?: Date;
  photoUrl?: string;
  documentUrl?: string;
  cabProvider?: string;
  driverName?: string;
  driverContact?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  sendNotification: boolean;
  type: string;
  lastVisitId?: string;
  visitCount?: number;
}

export interface Host {
  email: string;
  name: string;
  department: string;
  contactNumber: string;
  role: string;
  profilePhotoUrl?: string;
  position?: string;
  numberOfVisitors: number;
  notificationSettings: Record<string, any>;
  securityLevel: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface Visit {
  id: string;
  name: string;
  contactNumber: string;
  email?: string;
  department: string;
  status: 'pending' | 'checked_in' | 'checked_out';
  type: 'registration' | 'quick_checkin' | 'cab';
  createdAt: Date;
  entryTime: Date;
  exitTime?: Date;
  whomToMeet: string;
  whomToMeetEmail: string;
  purposeOfVisit: string;
  numberOfVisitors?: number;
  vehicleNumber?: string;
  documentType?: string;
  hasDocument?: boolean;
  hasPhoto?: boolean;
  photoUrl?: string;
  documentUrl?: string;
  address?: string;
  remarks?: string;
  isApproved?: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  sendNotification?: boolean;
  notificationSent?: boolean;
  notificationSentAt?: Date;
  // Cab specific fields
  cabProvider?: string;
  driverName?: string;
  driverContact?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Auth types
export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'visitor' | 'host' | 'security' | 'admin';
  photoUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

// Form types
export interface VisitorRegistrationForm extends Omit<Visitor, 'entryTime' | 'visitCount'> {}

export interface QuickCheckInForm {
  contactNumber: string;
  purposeOfVisit?: string;
  whomToMeet?: string;
  department?: string;
}

export interface CabEntryForm {
  name: string;
  contactNumber: string;
  cabProvider: string;
  driverName: string;
  driverContact: string;
  purposeOfVisit: string;
  whomToMeet: string;
  department: string;
  vehicleNumber?: string;
}

// Dashboard types
export interface DashboardStats {
  totalVisitors: number;
  todaysVisitors: number;
  pendingApprovals: number;
  checkedInVisitors: number;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'visitor_request' | 'visitor_checkin' | 'visitor_checkout' | 'general';
  isRead: boolean;
  createdAt: Date;
  userId: string;
  relatedVisitId?: string;
}
