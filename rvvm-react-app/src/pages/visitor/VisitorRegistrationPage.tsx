import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { ArrowBack, PhotoCamera, Upload } from '@mui/icons-material';
import { VisitorRegistrationForm } from '../../types';

const departments = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Information Science',
  'Electrical',
  'Administration',
  'Other'
];

const documentTypes = [
  'Aadhar Card',
  'PAN Card',
  'Driving License',
  'Passport',
  'Other Government ID'
];

const VisitorRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<VisitorRegistrationForm>({
    name: '',
    address: '',
    contactNumber: '',
    email: '',
    vehicleNumber: '',
    purposeOfVisit: '',
    numberOfVisitors: 1,
    whomToMeet: '',
    department: '',
    documentType: '',
    sendNotification: true,
    type: 'visitor'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/visitors/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof VisitorRegistrationForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSelectChange = (field: keyof VisitorRegistrationForm) => (
    event: any
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Visitor registered successfully! Redirecting...
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Visitor Registration
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Register New Visitor
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  sx={{ flex: '1 1 300px' }}
                />
                <TextField
                  required
                  fullWidth
                  label="Contact Number"
                  value={formData.contactNumber}
                  onChange={handleInputChange('contactNumber')}
                  sx={{ flex: '1 1 300px' }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  sx={{ flex: '1 1 300px' }}
                />
                <TextField
                  fullWidth
                  label="Vehicle Number"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange('vehicleNumber')}
                  sx={{ flex: '1 1 300px' }}
                />
              </Box>

              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Address"
                value={formData.address}
                onChange={handleInputChange('address')}
              />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl fullWidth required sx={{ flex: '1 1 300px' }}>
                  <InputLabel>Department to Visit</InputLabel>
                  <Select
                    value={formData.department}
                    onChange={handleSelectChange('department')}
                    label="Department to Visit"
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  required
                  fullWidth
                  label="Person to Meet"
                  value={formData.whomToMeet}
                  onChange={handleInputChange('whomToMeet')}
                  sx={{ flex: '1 1 300px' }}
                />
              </Box>

              <TextField
                required
                fullWidth
                multiline
                rows={2}
                label="Purpose of Visit"
                value={formData.purposeOfVisit}
                onChange={handleInputChange('purposeOfVisit')}
              />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Number of Visitors"
                  value={formData.numberOfVisitors}
                  onChange={handleInputChange('numberOfVisitors')}
                  inputProps={{ min: 1 }}
                  sx={{ flex: '1 1 300px' }}
                />
                <FormControl fullWidth required sx={{ flex: '1 1 300px' }}>
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    value={formData.documentType}
                    onChange={handleSelectChange('documentType')}
                    label="Document Type"
                  >
                    {documentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PhotoCamera />}
                  sx={{ height: 56, flex: '1 1 300px' }}
                >
                  Take Photo
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Upload />}
                  sx={{ height: 56, flex: '1 1 300px' }}
                >
                  Upload Document
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ minWidth: 150 }}
                >
                  {loading ? 'Registering...' : 'Register Visitor'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default VisitorRegistrationPage;
