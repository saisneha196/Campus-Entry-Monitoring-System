import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import VisitorRegistrationForm from '../components/VisitorRegistrationForm';

const VisitorRegistrationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleFormSubmit = (visitorData: any) => {
    console.log('Visitor registered:', visitorData);
  };

  const handleRegistrationSuccess = (visitId: string, visitorData: any) => {
    console.log('Registration successful, visit ID:', visitId);
    console.log('Visitor data received:', visitorData);
    
    // Prepare complete visitor data for success page
    const successPageData = {
      id: visitId,
      name: visitorData.name || '',
      contactNumber: visitorData.contactNumber || '',
      email: visitorData.email || '',
      address: visitorData.address || '',
      department: visitorData.department || '',
      staffMember: visitorData.whomToMeet || '', // Map whomToMeet to staffMember
      purpose: visitorData.purposeOfVisit || '', // Map purposeOfVisit to purpose
      visitDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      photoURL: visitorData.photoURL || undefined
    };
    
    console.log('Navigating to success page with data:', successPageData);
    
    // Navigate to success page with visitor data
    navigate('/visitor-success', { 
      state: { 
        visitorData: successPageData
      } 
    });
  };

  const handleGoBack = () => {
    navigate('/visitor-entry');
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center',
          bgcolor: 'primary.50',
          borderRadius: 2,
        }}
      >
        <Button 
          variant="text" 
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h6" color="primary" fontWeight="bold">
            New Visitor Registration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please fill in all the required details for campus entry
          </Typography>
        </Box>
      </Paper>

      {/* Registration Form */}
      <VisitorRegistrationForm
        onSubmit={handleFormSubmit}
        onSuccess={handleRegistrationSuccess}
      />
    </Container>
  );
};

export default VisitorRegistrationPage;
