import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Security,
  Shield,
  Person,
  Email,
  Badge
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const SecuritySignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    securityId: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  });

  const securityDepartments = [
    'Main Gate Security',
    'Campus Security',
    'Parking Security',
    'Building Security',
    'Night Security',
    'Emergency Response'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Create the security email format
      const securityEmail = formData.email.includes('@') 
        ? formData.email 
        : `${formData.email}@rvce.security.local`;

      await signUp(
        securityEmail,
        formData.password,
        'security',
        formData.fullName
      );
      
      // Set role in localStorage
      localStorage.setItem('userRole', 'security');
      
      // Navigate to security dashboard
      navigate('/security-dashboard', {
        state: { 
          message: `Welcome ${formData.fullName}! Your security account has been created successfully.` 
        }
      });
      
    } catch (err: any) {
      setError(err.message || 'Failed to create security account');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={8} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ bgcolor: 'warning.main', color: 'white', p: 3, textAlign: 'center' }}>
            <Shield sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              Security Signup
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
              Create RVCE Security Account
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                required
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="warning" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                required
                fullWidth
                label="Security ID"
                value={formData.securityId}
                onChange={handleInputChange('securityId')}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge color="warning" />
                    </InputAdornment>
                  ),
                }}
                placeholder="SEC001, SEC002, etc."
                sx={{ mb: 2 }}
              />

              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="warning" />
                    </InputAdornment>
                  ),
                }}
                placeholder="security@rvce.edu.in"
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                <InputLabel>Security Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={handleInputChange('department')}
                  label="Security Department"
                  required
                >
                  {securityDepartments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Security color="warning" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                required
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Security color="warning" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                color="warning"
                sx={{ 
                  mb: 3, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                {loading ? 'Creating Account...' : 'Create Security Account'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Already have a security account?
                </Typography>
                <Button
                  component={Link}
                  to="/security-login"
                  variant="outlined"
                  fullWidth
                  color="warning"
                  sx={{ mb: 2, borderRadius: 2, textTransform: 'none' }}
                >
                  Sign In to Security Portal
                </Button>
                
                <Button
                  component={Link}
                  to="/"
                  variant="text"
                  sx={{ textTransform: 'none' }}
                >
                  Back to Home
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SecuritySignupPage;
