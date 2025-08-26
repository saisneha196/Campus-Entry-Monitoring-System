// TypeScript interfaces for backend (same as frontend for consistency)

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

import { Request } from 'express';

// Express Request extensions
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role: string;
  };
}

// Database collection names
export const COLLECTIONS = {
  USERS: 'users',
  VISITORS: 'visitors',
  VISITS: 'visits',
  HOSTS: 'hosts',
  NOTIFICATIONS: 'notifications',
} as const;
