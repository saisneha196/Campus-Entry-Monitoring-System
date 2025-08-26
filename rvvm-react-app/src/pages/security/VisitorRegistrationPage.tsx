import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  Business,
  Assignment,
  DirectionsCar,
  Group,
  Send,
  CheckCircle,
  Notifications,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNotifications, getMockHosts } from '../../contexts/NotificationContext';

const departments = [
  'Computer Science',
  'Information Science',
  'Electronics',
  'Mechanical',
  'Civil Engineering',
  'Electrical',
  'Chemical',
  'Biotechnology',
  'MBA',
  'MCA',
  'Administration',
  'Library',
  'Other'
];

const purposeOptions = [
  'Academic Meeting',
  'Interview',
  'Conference',
  'Workshop',
  'Admission Inquiry',
  'Research Collaboration',
  'Official Visit',
  'Parent Meeting',
  'Industry Visit',
  'Guest Lecture',
  'Campus Tour',
  'Other'
];

interface VisitorFormData {
  visitorName: string;
  visitorPhone: string;
  visitorEmail: string;
  department: string;
  hostId: string;
  purposeOfVisit: string;
  numberOfVisitors: number;
  vehicleNumber: string;
  securityNotes: string;
}

const VisitorRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { createVisitorRequest, addNotification } = useNotifications();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<VisitorFormData>({
    visitorName: '',
    visitorPhone: '',
    visitorEmail: '',
    department: '',
    hostId: '',
    purposeOfVisit: '',
    numberOfVisitors: 1,
    vehicleNumber: '',
    securityNotes: ''
  });

  const mockHosts = getMockHosts();
  const selectedHost = mockHosts.find(h => h.id === formData.hostId);

  const handleInputChange = (field: keyof VisitorFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(formData.visitorName && formData.visitorPhone);
      case 1:
        return !!(formData.department && formData.hostId && formData.purposeOfVisit);
      case 2:
        return true; // Additional details are optional
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!selectedHost) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const requestId = createVisitorRequest({
        visitorName: formData.visitorName,
        visitorPhone: formData.visitorPhone,
        visitorEmail: formData.visitorEmail,
        department: formData.department,
        hostId: formData.hostId,
        hostName: selectedHost.name,
        hostEmail: selectedHost.email,
        purposeOfVisit: formData.purposeOfVisit,
        numberOfVisitors: formData.numberOfVisitors,
        vehicleNumber: formData.vehicleNumber || undefined,
        createdBy: 'security_officer', // In real app, get from auth context
        securityNotes: formData.securityNotes || undefined
      });

      // Show success and navigate to visitor success page with QR code
      setShowSuccess(true);
      setTimeout(() => {
        // Navigate to visitor success page with visitor data for QR generation
        navigate('/visitor-success', {
          state: { 
            visitorData: {
              id: requestId,
              name: formData.visitorName,
              contactNumber: formData.visitorPhone,
              email: formData.visitorEmail || '',
              address: '', // Security form doesn't have address, using empty string
              department: formData.department,
              staffMember: selectedHost.name,
              purpose: formData.purposeOfVisit,
              visitDate: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            }
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error creating visitor request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      label: 'Visitor Information',
      content: (
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Visitor Name"
                value={formData.visitorName}
                onChange={handleInputChange('visitorName')}
                required
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'primary.main' }} />
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.visitorPhone}
                onChange={handleInputChange('visitorPhone')}
                required
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'primary.main' }} />
                }}
                placeholder="+91-XXXXXXXXXX"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email Address"
                value={formData.visitorEmail}
                onChange={handleInputChange('visitorEmail')}
                type="email"
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'primary.main' }} />
                }}
                placeholder="visitor@example.com"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Number of Visitors"
                value={formData.numberOfVisitors}
                onChange={handleInputChange('numberOfVisitors')}
                type="number"
                inputProps={{ min: 1, max: 20 }}
                InputProps={{
                  startAdornment: <Group sx={{ mr: 1, color: 'primary.main' }} />
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Vehicle Number (Optional)"
                value={formData.vehicleNumber}
                onChange={handleInputChange('vehicleNumber')}
                InputProps={{
                  startAdornment: <DirectionsCar sx={{ mr: 1, color: 'primary.main' }} />
                }}
                placeholder="KA-01-AA-1234"
              />
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Visit Details',
      content: (
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={handleInputChange('department')}
                  startAdornment={<Business sx={{ mr: 1, color: 'primary.main' }} />}
                >
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Host to Meet</InputLabel>
                <Select
                  value={formData.hostId}
                  onChange={handleInputChange('hostId')}
                  startAdornment={<Person sx={{ mr: 1, color: 'primary.main' }} />}
                >
                  {mockHosts
                    .filter(host => !formData.department || host.department === formData.department)
                    .map(host => (
                      <MenuItem key={host.id} value={host.id}>
                        {host.name} - {host.department}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth required>
                <InputLabel>Purpose of Visit</InputLabel>
                <Select
                  value={formData.purposeOfVisit}
                  onChange={handleInputChange('purposeOfVisit')}
                  startAdornment={<Assignment sx={{ mr: 1, color: 'primary.main' }} />}
                >
                  {purposeOptions.map(purpose => (
                    <MenuItem key={purpose} value={purpose}>{purpose}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {selectedHost && (
              <Grid size={{ xs: 12 }}>
                <Card variant="outlined" sx={{ bgcolor: 'info.50' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Host Information:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{selectedHost.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedHost.department} • {selectedHost.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedHost.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      )
    },
    {
      label: 'Additional Notes',
      content: (
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Security Notes (Optional)"
                value={formData.securityNotes}
                onChange={handleInputChange('securityNotes')}
                multiline
                rows={4}
                placeholder="Any additional notes or special instructions..."
              />
            </Grid>
            
            {/* Summary Card */}
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Request Summary:
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Visitor:</Typography>
                      <Typography fontWeight="500">{formData.visitorName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Phone:</Typography>
                      <Typography fontWeight="500">{formData.visitorPhone}</Typography>
                    </Box>
                    {formData.visitorEmail && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Email:</Typography>
                        <Typography fontWeight="500">{formData.visitorEmail}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Department:</Typography>
                      <Typography fontWeight="500">{formData.department}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Host:</Typography>
                      <Typography fontWeight="500">{selectedHost?.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Purpose:</Typography>
                      <Typography fontWeight="500">{formData.purposeOfVisit}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Group Size:</Typography>
                      <Chip size="small" label={`${formData.numberOfVisitors} visitor${formData.numberOfVisitors > 1 ? 's' : ''}`} />
                    </Box>
                    {formData.vehicleNumber && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Vehicle:</Typography>
                        <Typography fontWeight="500">{formData.vehicleNumber}</Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
            <Person sx={{ fontSize: 30 }} />
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            Register New Visitor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Complete the form to register a visitor and send approval request to the host
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                {step.content}
                <Box sx={{ mb: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                    disabled={!validateStep(index) || isSubmitting}
                    startIcon={index === steps.length - 1 ? <Send /> : undefined}
                  >
                    {index === steps.length - 1 ? 
                      (isSubmitting ? 'Sending Request...' : 'Send Request to Host') : 
                      'Next'
                    }
                  </Button>
                  {index > 0 && (
                    <Button onClick={handleBack} sx={{ ml: 1 }}>
                      Back
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          iconMapping={{ success: <CheckCircle /> }}
          sx={{ width: '100%' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Notifications />
            <span>Visitor request sent to {selectedHost?.name} successfully!</span>
          </Box>
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VisitorRegistrationPage;
