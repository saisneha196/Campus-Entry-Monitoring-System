import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Security,
  Shield,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const SecurityLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // For security, we might use username instead of email
      // Convert username to email format for Firebase
      const email = formData.username.includes('@') 
        ? formData.username 
        : `${formData.username}@rvce.security.local`;
      
      await signIn(email, formData.password);
      
      // Set custom claims for security role
      localStorage.setItem('userRole', 'security');
      
      navigate('/security-dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid security credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
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
              Security Login
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
              RVCE Gate Access Control
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
                label="Security ID / Username"
                value={formData.username}
                onChange={handleInputChange('username')}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Security color="warning" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

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
                      <Person color="warning" />
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
                {loading ? 'Authenticating...' : 'Access Security Portal'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Don't have a security account?
                </Typography>
                <Button
                  component={Link}
                  to="/security-signup"
                  variant="outlined"
                  fullWidth
                  color="warning"
                  sx={{ mb: 2, borderRadius: 2, textTransform: 'none' }}
                >
                  Create Security Account
                </Button>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Are you a faculty or staff member?
                </Typography>
                <Button
                  component={Link}
                  to="/host-login"
                  variant="text"
                  sx={{ mb: 2, textTransform: 'none' }}
                >
                  Host Login
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

export default SecurityLoginPage;
