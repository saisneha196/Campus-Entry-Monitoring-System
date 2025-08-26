import { Response } from 'express';
import { adminDb } from '../services/firebaseAdmin';
import { AuthenticatedRequest } from '../middleware/auth';
import { ApiResponse, Visit, COLLECTIONS } from '../types';

// Mock data storage for development
let mockVisits: any[] = [];
let mockCounter = 1;

// Helper function to check if Firebase is available
const isFirebaseAvailable = () => {
  try {
    return adminDb && process.env.NODE_ENV === 'production';
  } catch {
    return false;
  }
};

// Register new visitor
export const registerVisitor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const visitorData = req.body;
    
    // Create visit record
    const visitData: any = {
      ...visitorData,
      createdAt: new Date(),
      entryTime: new Date(),
      status: 'pending',
      type: 'registration',
      isApproved: false,
      notificationSent: false
    };

    let id: string;
    
    // Use mock data for development
    if (!isFirebaseAvailable()) {
      console.log('🔧 Using mock data storage (Firebase not available)');
      id = `mock_${mockCounter++}`;
      visitData.id = id;
      mockVisits.push(visitData);
    } else {
      const docRef = await adminDb.collection(COLLECTIONS.VISITS).add(visitData);
      id = docRef.id;
    }
    
    const response: ApiResponse = {
      success: true,
      message: 'Visitor registered successfully',
      data: { id, ...visitData }
    };
    
    res.status(201).json(response);
  } catch (error: any) {
    console.error('Registration error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to register visitor',
      error: error.message
    };
    res.status(500).json(response);
  }
};

// Quick check-in
export const quickCheckIn = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contactNumber } = req.body;
    
    // Find previous visits by phone number
    const visitsSnapshot = await adminDb
      .collection(COLLECTIONS.VISITS)
      .where('contactNumber', '==', contactNumber)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (visitsSnapshot.empty) {
      const response: ApiResponse = {
        success: false,
        message: 'No previous visits found. Please register as a new visitor.'
      };
      return res.status(404).json(response);
    }

    const lastVisit = visitsSnapshot.docs[0].data();
    
    // Create new visit based on last visit
    const newVisitData: Partial<Visit> = {
      ...lastVisit,
      createdAt: new Date(),
      entryTime: new Date(),
      status: 'pending',
      type: 'quick_checkin',
      isApproved: false
    };

    delete newVisitData.id; // Remove old ID
    
    const docRef = await adminDb.collection(COLLECTIONS.VISITS).add(newVisitData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Quick check-in successful',
      data: { id: docRef.id, ...newVisitData }
    };
    
    res.status(201).json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to process quick check-in',
      error: error.message
    };
    res.status(500).json(response);
  }
};

// Get today's visitors
export const getTodaysVisitors = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let visitors: any[];
    
    if (!isFirebaseAvailable()) {
      console.log('🔧 Using mock data for today\'s visitors');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      visitors = mockVisits.filter(visit => {
        const visitDate = new Date(visit.createdAt);
        return visitDate >= today && visitDate < tomorrow;
      });
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const visitsSnapshot = await adminDb
        .collection(COLLECTIONS.VISITS)
        .where('createdAt', '>=', today)
        .where('createdAt', '<', tomorrow)
        .orderBy('createdAt', 'desc')
        .get();

      visitors = visitsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    const response: ApiResponse = {
      success: true,
      message: 'Today\'s visitors retrieved successfully',
      data: visitors
    };
    
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to get today\'s visitors',
      error: error.message
    };
    res.status(500).json(response);
  }
};

// Get pending approvals
export const getPendingApprovals = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const visitsSnapshot = await adminDb
      .collection(COLLECTIONS.VISITS)
      .where('status', '==', 'pending')
      .where('isApproved', '==', false)
      .orderBy('createdAt', 'desc')
      .get();

    const pendingVisitors = visitsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const response: ApiResponse = {
      success: true,
      message: 'Pending approvals retrieved successfully',
      data: pendingVisitors
    };
    
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to get pending approvals',
      error: error.message
    };
    res.status(500).json(response);
  }
};

// Approve visitor
export const approveVisitor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { visitId } = req.params;
    
    await adminDb.collection(COLLECTIONS.VISITS).doc(visitId).update({
      isApproved: true,
      status: 'checked_in',
      approvedBy: req.user?.email,
      approvedAt: new Date()
    });

    const response: ApiResponse = {
      success: true,
      message: 'Visitor approved successfully'
    };
    
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to approve visitor',
      error: error.message
    };
    res.status(500).json(response);
  }
};
