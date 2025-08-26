import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Paper,
} from '@mui/material';
import {
  Phone,
  QrCodeScanner,
  Login,
  Person,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

interface QuickCheckInPageProps {
  onVisitorFound?: (visitorData: any) => void;
}

const QuickCheckInPage: React.FC<QuickCheckInPageProps> = ({ onVisitorFound }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const validatePhoneNumber = (phone: string): boolean => {
    return /^\d{10}$/.test(phone);
  };

  const handlePhoneSearch = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Phone number must be 10 digits');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Search for visitor in Firestore
      const visitsRef = collection(db, 'visits');
      const q = query(visitsRef, where('contactNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Found visitor records
        const visitorDoc = querySnapshot.docs[0];
        const visitorData = { id: visitorDoc.id, ...visitorDoc.data() } as any;
        
        setSuccess(`Welcome back, ${visitorData.name || 'Visitor'}! Redirecting to visit details...`);
        
        // Call the callback if provided
        onVisitorFound?.(visitorData);
        
        // Navigate to return visitor details page
        setTimeout(() => {
          navigate('/return-visitor-details', { 
            state: { 
              phoneNumber, 
              visitorData 
            } 
          });
        }, 2000);
      } else {
        setError('No visitor found with this phone number. Please register as a new visitor.');
      }
    } catch (err: any) {
      console.error('Error searching for visitor:', err);
      setError('Failed to search for visitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = () => {
    navigate('/qr-scanner');
  };

  const handleNewRegistration = () => {
    navigate('/visitor-registration');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Quick Check-In
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your phone number or scan QR code for fast entry
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Phone sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Phone Number Check-In</Typography>
                </Box>
                
                <TextField
                  fullWidth
                  label="Phone Number"
                  placeholder="Enter your 10-digit phone number"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only digits
                    if (value.length <= 10) {
                      setPhoneNumber(value);
                    }
                  }}
                  error={!!error && error.includes('phone')}
                  inputProps={{ 
                    maxLength: 10,
                    pattern: '[0-9]*'
                  }}
                  InputProps={{
                    startAdornment: <Phone sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                  sx={{ mb: 2 }}
                />
                
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <Login />}
                  onClick={handlePhoneSearch}
                  disabled={loading || !phoneNumber}
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Searching...' : 'Check In'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
                OR
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <QrCodeScanner sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom align="center">
                  QR Code Scanner
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Scan your visitor QR code for instant check-in
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<QrCodeScanner />}
                  onClick={handleQRScan}
                  fullWidth
                >
                  Scan QR Code
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <Person sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom align="center">
                  New Visitor?
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  First time visiting? Register yourself here
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Person />}
                  onClick={handleNewRegistration}
                  fullWidth
                >
                  Register as New Visitor
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            <strong>Note:</strong> If you're a returning visitor, use your registered phone number for quick check-in.
            For new visitors, please complete the full registration process.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default QuickCheckInPage;
