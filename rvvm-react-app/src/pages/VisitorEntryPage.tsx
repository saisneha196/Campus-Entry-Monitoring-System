import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Container,
  Grid,
  Button,
  Paper,
  Avatar,
} from '@mui/material';
import {
  PersonAdd,
  FlashOn,
  LocalTaxi,
  QrCodeScanner,
  Assignment,
  Speed,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const VisitorEntryPage: React.FC = () => {
  const navigate = useNavigate();

  const entryOptions = [
    {
      id: 'registration',
      title: 'Visitor Registration',
      subtitle: 'Complete registration form',
      description: 'For new visitors who need to register with complete details including photo and document upload.',
      icon: <PersonAdd sx={{ fontSize: 40 }} />,
      color: 'primary.main',
      bgColor: 'primary.50',
      action: () => navigate('/visitor-registration'),
    },
    {
      id: 'quick-checkin',
      title: 'Quick Check-In',
      subtitle: 'Fast track visitor entry',
      description: 'For returning visitors who have visited before. Just enter your phone number for instant check-in.',
      icon: <FlashOn sx={{ fontSize: 40 }} />,
      color: 'warning.main',
      bgColor: 'warning.50',
      action: () => navigate('/quick-checkin'),
    },
    {
      id: 'cab-entry',
      title: 'Cab Entry',
      subtitle: 'Register campus cabs',
      description: 'Special registration for cab drivers and taxi services entering the campus premises.',
      icon: <LocalTaxi sx={{ fontSize: 40 }} />,
      color: 'info.main',
      bgColor: 'info.50',
      action: () => navigate('/cab-entry'),
    },
    {
      id: 'qr-scanner',
      title: 'QR Scanner',
      subtitle: 'Scan visitor QR code',
      description: 'For visitors with QR codes. Scan the code for instant verification and entry.',
      icon: <QrCodeScanner sx={{ fontSize: 40 }} />,
      color: 'success.main',
      bgColor: 'success.50',
      action: () => navigate('/quick-checkin'),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
        }}
      >
        <Box textAlign="center">
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            RVCE Visitor Management
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Welcome to R.V. College of Engineering Campus
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 }}>
            Please select the appropriate option below to register your visit
          </Typography>
        </Box>
      </Paper>

      {/* Entry Options Grid */}
      <Grid container spacing={3}>
        {entryOptions.map((option) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={option.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={option.action}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{ 
                    bgcolor: option.bgColor,
                    color: option.color,
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {option.icon}
                </Avatar>
                
                <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                  {option.title}
                </Typography>
                
                <Typography variant="body2" color="primary" gutterBottom fontWeight="medium">
                  {option.subtitle}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {option.description}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ 
                    borderColor: option.color,
                    color: option.color,
                    '&:hover': {
                      bgcolor: option.bgColor,
                      borderColor: option.color,
                    }
                  }}
                >
                  {option.id === 'registration' && 'Start Registration'}
                  {option.id === 'quick-checkin' && 'Quick Check-In'}
                  {option.id === 'cab-entry' && 'Register Cab'}
                  {option.id === 'qr-scanner' && 'Scan QR Code'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional Information */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Visitor Guidelines</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                • All visitors must register before entering the campus
                <br />
                • Valid ID proof is required for registration
                <br />
                • Follow security protocols and instructions
                <br />
                • Visitors must be accompanied by the host person
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Quick Tips</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                • First-time visitors: Use "Visitor Registration"
                <br />
                • Returning visitors: Use "Quick Check-In"
                <br />
                • Cab drivers: Use "Cab Entry" option
                <br />
                • Have your QR code ready for faster processing
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer Information */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          For assistance, please contact the security desk at the main gate
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Emergency Contact: +91-80-67178000
        </Typography>
      </Box>
    </Container>
  );
};

export default VisitorEntryPage;
