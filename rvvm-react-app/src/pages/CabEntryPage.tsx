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
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  LocalTaxi,
  Person,
  DirectionsCar,
  LocationOn,
  Save,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

interface CabEntryFormData {
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  vehicleNumber: string;
  vehicleType: string;
  taxiService: string;
  passengerCount: number;
  destination: string;
  purpose: string;
  estimatedDuration: string;
  emergencyContact: string;
}

const CabEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<CabEntryFormData>({
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    vehicleNumber: '',
    vehicleType: 'taxi',
    taxiService: '',
    passengerCount: 1,
    destination: '',
    purpose: '',
    estimatedDuration: '1-2 hours',
    emergencyContact: '',
  });

  const vehicleTypes = [
    { value: 'taxi', label: 'Taxi' },
    { value: 'auto', label: 'Auto Rickshaw' },
    { value: 'cab', label: 'Private Cab' },
    { value: 'bus', label: 'Mini Bus' },
    { value: 'other', label: 'Other' },
  ];

  const taxiServices = [
    'Ola',
    'Uber',
    'Local Taxi Service',
    'Private Cab',
    'Auto Rickshaw',
    'Other',
  ];

  const estimatedDurations = [
    '30 minutes',
    '1-2 hours',
    '2-4 hours',
    '4-6 hours',
    'Full day',
    'Multiple days',
  ];

  const purposes = [
    'Student pickup/drop',
    'Staff pickup/drop',
    'Visitor transport',
    'Emergency transport',
    'Event transport',
    'Delivery service',
    'Other',
  ];

  const handleInputChange = (field: keyof CabEntryFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const validateForm = (): string | null => {
    const { driverName, driverPhone, driverLicense, vehicleNumber, destination, purpose } = formData;

    if (!driverName.trim()) return 'Driver name is required';
    if (!driverPhone.trim()) return 'Driver phone number is required';
    if (!/^\d{10}$/.test(driverPhone)) return 'Phone number must be 10 digits';
    if (!driverLicense.trim()) return 'Driver license number is required';
    if (!vehicleNumber.trim()) return 'Vehicle number is required';
    if (!destination.trim()) return 'Destination is required';
    if (!purpose.trim()) return 'Purpose of visit is required';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Submit to Firestore
      await addDoc(collection(db, 'cabEntries'), {
        ...formData,
        entryTime: serverTimestamp(),
        status: 'active',
        createdAt: new Date().toISOString(),
      });

      setSuccess('Cab entry registered successfully!');
      
      // Redirect to success page or main page
      setTimeout(() => {
        navigate('/cab-entry-success', { 
          state: { 
            cabData: formData,
            entryTime: new Date().toISOString() 
          } 
        });
      }, 2000);

    } catch (err: any) {
      console.error('Error registering cab entry:', err);
      setError('Failed to register cab entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/visitor-entry')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <LocalTaxi sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
            <Typography variant="h4" component="h1" gutterBottom color="info.main">
              Cab Entry Registration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Register taxi, cab, or auto rickshaw entry to campus
            </Typography>
          </Box>
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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Driver Information */}
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Driver Information</Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Driver Name"
                        value={formData.driverName}
                        onChange={(e) => handleInputChange('driverName', e.target.value)}
                        required
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Driver Phone"
                        value={formData.driverPhone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            handleInputChange('driverPhone', value);
                          }
                        }}
                        inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                        required
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Driver License Number"
                        value={formData.driverLicense}
                        onChange={(e) => handleInputChange('driverLicense', e.target.value)}
                        required
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Emergency Contact"
                        value={formData.emergencyContact}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            handleInputChange('emergencyContact', value);
                          }
                        }}
                        inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Vehicle Information */}
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DirectionsCar sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="h6">Vehicle Information</Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Vehicle Number"
                        value={formData.vehicleNumber}
                        onChange={(e) => handleInputChange('vehicleNumber', e.target.value.toUpperCase())}
                        placeholder="KA 01 AB 1234"
                        required
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Vehicle Type</InputLabel>
                        <Select
                          value={formData.vehicleType}
                          label="Vehicle Type"
                          onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                        >
                          {vehicleTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Taxi Service</InputLabel>
                        <Select
                          value={formData.taxiService}
                          label="Taxi Service"
                          onChange={(e) => handleInputChange('taxiService', e.target.value)}
                        >
                          {taxiServices.map((service) => (
                            <MenuItem key={service} value={service}>
                              {service}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Number of Passengers"
                        type="number"
                        value={formData.passengerCount}
                        onChange={(e) => handleInputChange('passengerCount', parseInt(e.target.value) || 1)}
                        inputProps={{ min: 1, max: 20 }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Visit Information */}
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h6">Visit Details</Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Destination/Department"
                        value={formData.destination}
                        onChange={(e) => handleInputChange('destination', e.target.value)}
                        placeholder="e.g., Main Building, Hostel, Administration Block"
                        required
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Purpose of Visit</InputLabel>
                        <Select
                          value={formData.purpose}
                          label="Purpose of Visit"
                          onChange={(e) => handleInputChange('purpose', e.target.value)}
                        >
                          {purposes.map((purpose) => (
                            <MenuItem key={purpose} value={purpose}>
                              {purpose}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid size={{ xs: 12 }}>
                      <FormControl fullWidth>
                        <InputLabel>Estimated Duration</InputLabel>
                        <Select
                          value={formData.estimatedDuration}
                          label="Estimated Duration"
                          onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                        >
                          {estimatedDurations.map((duration) => (
                            <MenuItem key={duration} value={duration}>
                              {duration}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  disabled={loading}
                  sx={{ minWidth: 200, py: 1.5 }}
                >
                  {loading ? 'Registering...' : 'Register Cab Entry'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {/* Guidelines */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Guidelines for Cab Drivers:</strong>
            <br />
            • Valid driving license and vehicle registration required
            <br />
            • Follow campus speed limits and parking regulations
            <br />
            • Passengers must be accompanied by authorized personnel
            <br />
            • Report to security for any assistance or emergency
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default CabEntryPage;
