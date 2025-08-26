import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'visitor_request' | 'visitor_approved' | 'visitor_rejected' | 'cab_entry' | 'general';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  data?: any; // Additional data like visitor info, etc.
  from?: string; // Who sent the notification
  to?: string; // Who should receive it
}

export interface VisitorRequest {
  id: string;
  visitorName: string;
  visitorPhone: string;
  visitorEmail?: string;
  department: string;
  hostId: string;
  hostName: string;
  hostEmail: string;
  purposeOfVisit: string;
  numberOfVisitors: number;
  vehicleNumber?: string;
  requestedTime: string;
  status: 'pending' | 'approved' | 'rejected';
  approvalTime?: string;
  rejectionReason?: string;
  createdBy: string; // Security officer who created the request
  securityNotes?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  visitorRequests: VisitorRequest[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  createVisitorRequest: (request: Omit<VisitorRequest, 'id' | 'requestedTime' | 'status'>) => string;
  approveVisitorRequest: (requestId: string, approvedBy: string) => void;
  rejectVisitorRequest: (requestId: string, reason: string, rejectedBy: string) => void;
  getVisitorRequest: (requestId: string) => VisitorRequest | undefined;
  getPendingRequestsForHost: (hostId: string) => VisitorRequest[];
  getApprovedRequestsForHost: (hostId: string) => VisitorRequest[];
  getAllRequestsForSecurity: () => VisitorRequest[];
  unreadCount: number;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visitorRequests, setVisitorRequests] = useState<VisitorRequest[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('rvvm_notifications');
    const savedRequests = localStorage.getItem('rvvm_visitor_requests');
    
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
    
    if (savedRequests) {
      try {
        setVisitorRequests(JSON.parse(savedRequests));
      } catch (error) {
        console.error('Error loading visitor requests:', error);
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('rvvm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('rvvm_visitor_requests', JSON.stringify(visitorRequests));
  }, [visitorRequests]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const createVisitorRequest = (request: Omit<VisitorRequest, 'id' | 'requestedTime' | 'status'>): string => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newRequest: VisitorRequest = {
      ...request,
      id: requestId,
      requestedTime: new Date().toISOString(),
      status: 'pending'
    };
    
    setVisitorRequests(prev => [newRequest, ...prev]);
    
    // Send notification to host
    addNotification({
      type: 'visitor_request',
      title: 'New Visitor Request',
      message: `${request.visitorName} wants to visit you. Purpose: ${request.purposeOfVisit}`,
      data: { requestId, visitorRequest: newRequest },
      from: request.createdBy,
      to: request.hostId
    });
    
    return requestId;
  };

  const approveVisitorRequest = (requestId: string, approvedBy: string) => {
    setVisitorRequests(prev => 
      prev.map(req => {
        if (req.id === requestId) {
          const approvedRequest = {
            ...req,
            status: 'approved' as const,
            approvalTime: new Date().toISOString()
          };
          
          // Send notification to security
          addNotification({
            type: 'visitor_approved',
            title: 'Visitor Request Approved',
            message: `${req.hostName} approved ${req.visitorName}'s visit request.`,
            data: { requestId, visitorRequest: approvedRequest },
            from: approvedBy,
            to: req.createdBy
          });
          
          return approvedRequest;
        }
        return req;
      })
    );
  };

  const rejectVisitorRequest = (requestId: string, reason: string, rejectedBy: string) => {
    setVisitorRequests(prev => 
      prev.map(req => {
        if (req.id === requestId) {
          const rejectedRequest = {
            ...req,
            status: 'rejected' as const,
            rejectionReason: reason
          };
          
          // Send notification to security
          addNotification({
            type: 'visitor_rejected',
            title: 'Visitor Request Rejected',
            message: `${req.hostName} rejected ${req.visitorName}'s visit request. Reason: ${reason}`,
            data: { requestId, visitorRequest: rejectedRequest, reason },
            from: rejectedBy,
            to: req.createdBy
          });
          
          return rejectedRequest;
        }
        return req;
      })
    );
  };

  const getVisitorRequest = (requestId: string): VisitorRequest | undefined => {
    return visitorRequests.find(req => req.id === requestId);
  };

  const getPendingRequestsForHost = (hostId: string): VisitorRequest[] => {
    return visitorRequests.filter(req => req.hostId === hostId && req.status === 'pending');
  };

  const getApprovedRequestsForHost = (hostId: string): VisitorRequest[] => {
    return visitorRequests.filter(req => req.hostId === hostId && req.status === 'approved');
  };

  const getAllRequestsForSecurity = (): VisitorRequest[] => {
    return visitorRequests;
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const value: NotificationContextType = {
    notifications,
    visitorRequests,
    addNotification,
    markAsRead,
    createVisitorRequest,
    approveVisitorRequest,
    rejectVisitorRequest,
    getVisitorRequest,
    getPendingRequestsForHost,
    getApprovedRequestsForHost,
    getAllRequestsForSecurity,
    unreadCount,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Helper function to get mock hosts for demonstration
export const getMockHosts = () => [
  {
    id: 'host1',
    name: 'Dr. John Smith',
    email: 'john.smith@rvce.edu.in',
    department: 'Computer Science',
    phone: '+91-80-67178002'
  },
  {
    id: 'host2',
    name: 'Prof. Sarah Johnson', 
    email: 'sarah.johnson@rvce.edu.in',
    department: 'Electronics',
    phone: '+91-80-67178003'
  },
  {
    id: 'host3',
    name: 'Dr. Raj Patel',
    email: 'raj.patel@rvce.edu.in', 
    department: 'Mechanical',
    phone: '+91-80-67178004'
  },
  {
    id: 'host4',
    name: 'Prof. Priya Sharma',
    email: 'priya.sharma@rvce.edu.in',
    department: 'Civil Engineering',
    phone: '+91-80-67178005'
  },
  {
    id: 'host5',
    name: 'Dr. Kumar Reddy',
    email: 'kumar.reddy@rvce.edu.in',
    department: 'Information Science',
    phone: '+91-80-67178006'
  }
];
