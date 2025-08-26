import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Security,
  Person,
  School,
  VerifiedUser,
  QrCode,
  Notifications,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const loginOptions = [
    {
      title: 'Security Login',
      description: 'Access security dashboard for visitor registration, QR scanning, and access control',
      icon: <Security sx={{ fontSize: 40 }} />,
      color: 'primary',
      route: '/security-login',
      features: [
        'Visitor Registration',
        'QR Code Scanner',
        'Dashboard & Analytics',
        'Approval Notifications',
        'Cab Entry Management'
      ]
    },
    {
      title: 'Host Login',
      description: 'Access host dashboard to approve visitor requests and manage visits',
      icon: <Person sx={{ fontSize: 40 }} />,
      color: 'secondary',
      route: '/host-login',
      features: [
        'Visitor Approval Requests',
        'Dashboard Overview',
        'Pending Approvals',
        'Approved Visitors',
        'Notification Center'
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3,
          }}
        >
          <School sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          RVCE Visitor Management
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 2, maxWidth: '600px', mx: 'auto' }}
        >
          Streamlined visitor registration and approval system for
          R.V. College of Engineering
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VerifiedUser color="primary" />
            <Typography variant="body2">Secure Access</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QrCode color="primary" />
            <Typography variant="body2">QR Code System</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Notifications color="primary" />
            <Typography variant="body2">Real-time Notifications</Typography>
          </Box>
        </Box>
      </Box>

      {/* Login Options */}
      <Grid container spacing={4} justifyContent="center">
        {loginOptions.map((option, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                border: 2,
                borderColor: 'transparent',
                '&:hover': {
                  borderColor: `${option.color}.main`,
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <Avatar
                  sx={{
                    bgcolor: `${option.color}.main`,
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  {option.icon}
                </Avatar>
                
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: `${option.color}.main` }}
                >
                  {option.title}
                </Typography>
                
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  {option.description}
                </Typography>

                <Divider sx={{ my: 2 }} />
                
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, fontWeight: 'bold' }}
                >
                  Key Features:
                </Typography>
                
                <Box sx={{ textAlign: 'left' }}>
                  {option.features.map((feature, idx) => (
                    <Typography
                      key={idx}
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: `${option.color}.main`,
                          mr: 2,
                        }}
                      />
                      {feature}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  color={option.color as any}
                  onClick={() => navigate(option.route)}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 3,
                  }}
                >
                  Login as {option.title.split(' ')[0]}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer Section */}
      <Box sx={{ textAlign: 'center', mt: 8, pt: 4, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          © 2024 R.V. College of Engineering - Visitor Management System
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Powered by RVVM Technology
        </Typography>
      </Box>
    </Container>
  );
};

export default LandingPage;
