import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export interface Visit {
  id: string;
  name: string;
  contactNumber: string;
  email?: string;
  department: string;
  status: 'pending' | 'approved' | 'rejected' | 'checked_in' | 'checked_out';
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

// Hook for real-time pending visitors (for hosts)
export const usePendingVisitors = (hostEmail?: string) => {
  const [visitors, setVisitors] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hostEmail) {
      setLoading(false);
      return;
    }

    try {
      const visitsRef = collection(db, 'visits');
      const q = query(
        visitsRef,
        where('whomToMeetEmail', '==', hostEmail),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const visitData: Visit[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            visitData.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              entryTime: data.entryTime?.toDate() || new Date(),
              exitTime: data.exitTime?.toDate(),
              approvedAt: data.approvedAt?.toDate(),
              notificationSentAt: data.notificationSentAt?.toDate(),
            } as Visit);
          });
          setVisitors(visitData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching pending visitors:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err: any) {
      console.error('Error setting up pending visitors listener:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [hostEmail]);

  return { visitors, loading, error };
};

// Hook for real-time approved visitors (for security)
export const useApprovedVisitors = () => {
  const [visitors, setVisitors] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const visitsRef = collection(db, 'visits');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const q = query(
        visitsRef,
        where('createdAt', '>=', today),
        where('isApproved', '==', true),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const visitData: Visit[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            visitData.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              entryTime: data.entryTime?.toDate() || new Date(),
              exitTime: data.exitTime?.toDate(),
              approvedAt: data.approvedAt?.toDate(),
              notificationSentAt: data.notificationSentAt?.toDate(),
            } as Visit);
          });
          setVisitors(visitData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching approved visitors:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err: any) {
      console.error('Error setting up approved visitors listener:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { visitors, loading, error };
};

// Hook for today's visitors with real-time updates
export const useTodaysVisitors = () => {
  const [visitors, setVisitors] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const visitsRef = collection(db, 'visits');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const q = query(
        visitsRef,
        where('createdAt', '>=', today),
        where('createdAt', '<', tomorrow),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const visitData: Visit[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            visitData.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              entryTime: data.entryTime?.toDate() || new Date(),
              exitTime: data.exitTime?.toDate(),
              approvedAt: data.approvedAt?.toDate(),
              notificationSentAt: data.notificationSentAt?.toDate(),
            } as Visit);
          });
          setVisitors(visitData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching today\'s visitors:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err: any) {
      console.error('Error setting up today\'s visitors listener:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { visitors, loading, error };
};

// Actions for updating visitor status
export const approveVisitor = async (visitId: string, hostEmail: string): Promise<void> => {
  try {
    const visitRef = doc(db, 'visits', visitId);
    await updateDoc(visitRef, {
      status: 'approved',
      isApproved: true,
      approvedBy: hostEmail,
      approvedAt: new Date()
    });
  } catch (error) {
    console.error('Error approving visitor:', error);
    throw error;
  }
};

export const rejectVisitor = async (visitId: string, hostEmail: string): Promise<void> => {
  try {
    const visitRef = doc(db, 'visits', visitId);
    await updateDoc(visitRef, {
      status: 'rejected',
      isApproved: false,
      approvedBy: hostEmail,
      approvedAt: new Date()
    });
  } catch (error) {
    console.error('Error rejecting visitor:', error);
    throw error;
  }
};

export const checkInVisitor = async (visitId: string, securityPersonnel: string): Promise<void> => {
  try {
    const visitRef = doc(db, 'visits', visitId);
    await updateDoc(visitRef, {
      status: 'checked_in',
      entryTime: new Date(),
      checkedInBy: securityPersonnel
    });
  } catch (error) {
    console.error('Error checking in visitor:', error);
    throw error;
  }
};

export const checkOutVisitor = async (visitId: string, securityPersonnel: string): Promise<void> => {
  try {
    const visitRef = doc(db, 'visits', visitId);
    await updateDoc(visitRef, {
      status: 'checked_out',
      exitTime: new Date(),
      checkedOutBy: securityPersonnel
    });
  } catch (error) {
    console.error('Error checking out visitor:', error);
    throw error;
  }
};
