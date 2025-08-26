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
  Person,
  School,
  Email,
  Work,
  Phone
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const HostSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    staffId: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    password: '',
    confirmPassword: ''
  });

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
    'Library'
  ];

  const designations = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'HOD',
    'Dean',
    'Principal',
    'Staff',
    'Lab Assistant',
    'Administrative Officer',
    'Librarian'
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

    // Validate RVCE email format
    if (!formData.email.endsWith('@rvce.edu.in') && !formData.email.includes('rvce')) {
      setError('Please use a valid RVCE email address (@rvce.edu.in)');
      setLoading(false);
      return;
    }

    try {
      await signUp(
        formData.email,
        formData.password,
        'host',
        formData.fullName
      );
      
      // Set role in localStorage
      localStorage.setItem('userRole', 'host');
      
      // Navigate to host dashboard
      navigate('/host-dashboard', {
        state: { 
          message: `Welcome ${formData.fullName}! Your host account has been created successfully.` 
        }
      });
      
    } catch (err: any) {
      setError(err.message || 'Failed to create host account');
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={8} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, textAlign: 'center' }}>
            <School sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              Host Signup
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
              Create RVCE Faculty & Staff Account
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
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                required
                fullWidth
                label="Staff ID"
                value={formData.staffId}
                onChange={handleInputChange('staffId')}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="RVCE001, RVCE002, etc."
                sx={{ mb: 2 }}
              />

              <TextField
                required
                fullWidth
                label="College Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="name@rvce.edu.in"
                sx={{ mb: 2 }}
              />

              <TextField
                required
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="+91-XXXXXXXXXX"
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={handleInputChange('department')}
                  label="Department"
                  required
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                <InputLabel>Designation</InputLabel>
                <Select
                  value={formData.designation}
                  onChange={handleInputChange('designation')}
                  label="Designation"
                  required
                >
                  {designations.map((designation) => (
                    <MenuItem key={designation} value={designation}>
                      {designation}
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
                      <Person color="primary" />
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
                      <Person color="primary" />
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
                sx={{ 
                  mb: 3, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                {loading ? 'Creating Account...' : 'Create Host Account'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Already have a host account?
                </Typography>
                <Button
                  component={Link}
                  to="/host-login"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2, borderRadius: 2, textTransform: 'none' }}
                >
                  Sign In as Host
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

export default HostSignupPage;
