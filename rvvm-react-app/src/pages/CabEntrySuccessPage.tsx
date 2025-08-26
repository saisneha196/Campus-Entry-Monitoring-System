import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Container,
  Paper,
  Avatar,
  Chip,
  Grid,
  Divider,
  LinearProgress,
  Fade,
  Grow,
  Slide,
} from '@mui/material';
import {
  LocalTaxi,
  Person,
  DirectionsCar,
  LocationOn,
  Phone,
  Home,
  Directions,
  Security,
  Schedule,
  Badge,
  Speed,
  Groups,
  Warning,
  Map,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface CabData {
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
  entryTime: string;
}

const CabEntrySuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cabData, setCabData] = useState<CabData | null>(null);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Get cab data from navigation state
    const data = location.state?.cabData as CabData;
    const entryTime = location.state?.entryTime as string;
    
    if (!data) {
      // If no data, redirect to main page
      navigate('/visitor-entry');
      return;
    }

    setCabData({ ...data, entryTime: entryTime || new Date().toISOString() });

    // Animate progress bar
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setShowContent(true);
          return 100;
        }
        return prev + 3;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [location.state, navigate]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDirections = () => {
    alert(`Navigation to ${cabData?.destination}:\n\n• Follow campus speed limits (15 km/h maximum)\n• Use designated vehicle routes only\n• Report to security for specific directions\n• Parking available at visitor parking zones`);
  };

  const contactSecurity = () => {
    alert('Campus Security: +91-80-67178000\n\nServices:\n• Route guidance\n• Parking assistance\n• Emergency support\n• Entry/exit procedures');
  };

  const viewParkingMap = () => {
    alert('Campus Parking Information:\n\n• Visitor parking zones marked in blue\n• Time limit: As per visit duration\n• No parking in faculty/student zones\n• Emergency vehicles have priority');
  };

  if (!cabData) {
    return null;
  }

  const getVehicleIcon = () => {
    switch (cabData.vehicleType) {
      case 'auto': return '🛺';
      case 'bus': return '🚐';
      case 'taxi': return '🚕';
      default: return '🚗';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
      {/* Animated Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 6, 
            borderRadius: 3,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)'
            }
          }} 
        />
      </Box>

      <Fade in={showContent} timeout={1000}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 50%, #ffffff 100%)',
            border: '2px solid',
            borderColor: 'info.main',
            overflow: 'hidden'
          }}
        >
          {/* Success Header with Animation */}
          <Box 
            sx={{ 
              background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
              color: 'white',
              p: 4,
              textAlign: 'center',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><g fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"><path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15C30 6.716 23.284 0 15 0zm0 28C7.82 28 2 22.18 2 15S7.82 2 15 2s13 5.82 13 13-5.82 13-13 13z"/></g></svg>") repeat',
              }
            }}
          >
            <Grow in={showContent} timeout={1500}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  backdropFilter: 'blur(10px)',
                  border: '3px solid rgba(255,255,255,0.3)',
                  fontSize: 60
                }}
              >
                <LocalTaxi sx={{ fontSize: 60 }} />
              </Avatar>
            </Grow>
            
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              Entry Approved!
            </Typography>
            
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 2 }}>
              {getVehicleIcon()} Welcome to RVCE Campus
            </Typography>

            <Chip
              label={`${cabData.vehicleType.toUpperCase()} - ${cabData.vehicleNumber}`}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 3,
                py: 1,
                backdropFilter: 'blur(10px)'
              }}
            />
          </Box>

          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Driver Information */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Slide direction="right" in={showContent} timeout={800}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Person sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h5" fontWeight="bold">
                          Driver Information
                        </Typography>
                      </Box>
                      
                      <Box sx={{ space: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Badge sx={{ mr: 2, color: 'grey.600' }} />
                          <Box>
                            <Typography variant="h6" fontWeight="600">
                              {cabData.driverName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              License: {cabData.driverLicense}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'grid', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Phone sx={{ mr: 2, color: 'info.main', fontSize: 20 }} />
                            <Box>
                              <Typography variant="body1">{cabData.driverPhone}</Typography>
                              <Typography variant="body2" color="text.secondary">Primary Contact</Typography>
                            </Box>
                          </Box>

                          {cabData.emergencyContact && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Security sx={{ mr: 2, color: 'warning.main', fontSize: 20 }} />
                              <Box>
                                <Typography variant="body1">{cabData.emergencyContact}</Typography>
                                <Typography variant="body2" color="text.secondary">Emergency Contact</Typography>
                              </Box>
                            </Box>
                          )}

                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Schedule sx={{ mr: 2, color: 'success.main', fontSize: 20 }} />
                            <Box>
                              <Typography variant="body1">
                                {formatTime(cabData.entryTime)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">Entry Time</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>

              {/* Vehicle & Trip Information */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Slide direction="left" in={showContent} timeout={1000}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 3, bgcolor: 'info.50' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <DirectionsCar sx={{ mr: 1, color: 'info.main', fontSize: 28 }} />
                        <Typography variant="h5" fontWeight="bold" color="info.main">
                          Trip Details
                        </Typography>
                      </Box>
                      
                      <Box sx={{ space: 2 }}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            VEHICLE
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6" fontWeight="600" color="info.dark">
                              {cabData.vehicleNumber}
                            </Typography>
                            <Chip size="small" label={cabData.vehicleType} color="info" />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Service: {cabData.taxiService}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            DESTINATION
                          </Typography>
                          <Typography variant="h6" fontWeight="600" color="info.dark">
                            {cabData.destination}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            PURPOSE
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            bgcolor: 'white', 
                            p: 2, 
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'info.200'
                          }}>
                            {cabData.purpose}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Groups sx={{ mr: 1, color: 'info.main', fontSize: 20 }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">Passengers</Typography>
                              <Typography variant="h6" color="info.dark">{cabData.passengerCount}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Schedule sx={{ mr: 1, color: 'warning.main', fontSize: 20 }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">Duration</Typography>
                              <Typography variant="h6" color="info.dark">{cabData.estimatedDuration}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Map />}
                onClick={viewParkingMap}
                sx={{ 
                  minWidth: 200,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                  boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                }}
              >
                Parking Info
              </Button>

              <Button
                variant="contained"
                size="large"
                startIcon={<Directions />}
                onClick={getDirections}
                sx={{ 
                  minWidth: 200,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }}
              >
                Get Directions
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<Security />}
                onClick={contactSecurity}
                sx={{ 
                  minWidth: 200,
                  py: 1.5,
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  }
                }}
              >
                Contact Security
              </Button>
            </Box>

            {/* Navigation Options */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Need something else?
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="text"
                  startIcon={<Home />}
                  onClick={() => navigate('/visitor-entry')}
                  sx={{ borderRadius: 2 }}
                >
                  Back to Home
                </Button>
                <Button
                  variant="text"
                  startIcon={<LocalTaxi />}
                  onClick={() => navigate('/cab-entry')}
                  sx={{ borderRadius: 2 }}
                >
                  Register Another Vehicle
                </Button>
              </Box>
            </Box>

            {/* Important Guidelines */}
            <Paper 
              elevation={0}
              sx={{ 
                mt: 4, 
                p: 3, 
                bgcolor: 'warning.50', 
                borderRadius: 3, 
                border: '1px solid',
                borderColor: 'warning.200'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Warning sx={{ mr: 2, color: 'warning.dark', mt: 0.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" color="warning.dark" gutterBottom>
                    Campus Driving Guidelines:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    🚗 <strong>Speed Limit:</strong> Maximum 15 km/h throughout campus
                    <br />
                    🅿️ <strong>Parking:</strong> Use designated visitor parking areas only
                    <br />
                    🚸 <strong>Priority:</strong> Pedestrians and cyclists have right of way
                    <br />
                    📍 <strong>Navigation:</strong> Follow campus signage and security directions
                    <br />
                    ⚠️ <strong>Emergency:</strong> Pull over safely and contact security immediately
                    <br />
                    ⏰ <strong>Duration:</strong> Respect your estimated visit duration
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Campus Services */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: 'success.50', textAlign: 'center', p: 2 }}>
                  <Speed sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                  <Typography variant="h6" color="success.dark">Speed Limit</Typography>
                  <Typography variant="h4" color="success.main" fontWeight="bold">15</Typography>
                  <Typography variant="body2" color="text.secondary">km/h MAX</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: 'info.50', textAlign: 'center', p: 2 }}>
                  <Security sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                  <Typography variant="h6" color="info.dark">Security</Typography>
                  <Typography variant="body1" color="info.main" fontWeight="bold">+91-80-67178000</Typography>
                  <Typography variant="body2" color="text.secondary">24/7 Available</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: 'warning.50', textAlign: 'center', p: 2 }}>
                  <LocationOn sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h6" color="warning.dark">Parking</Typography>
                  <Typography variant="body1" color="warning.main" fontWeight="bold">Visitor Zones</Typography>
                  <Typography variant="body2" color="text.secondary">Blue Marked Areas</Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Contact Information Footer */}
            <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Campus Security: <strong>+91-80-67178000</strong> | 
                Emergency Services: <strong>108</strong> | 
                Vehicle Issues: <strong>Contact Security</strong>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default CabEntrySuccessPage;
