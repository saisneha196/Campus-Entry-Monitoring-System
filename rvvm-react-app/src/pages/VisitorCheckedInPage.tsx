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
  CheckCircle,
  Person,
  Assignment,
  LocationOn,
  Phone,
  Home,
  Directions,
  Security,
  Badge,
  Schedule,
  CheckCircleOutline,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface VisitorData {
  id: string;
  name: string;
  contactNumber: string;
  department: string;
  whomToMeet: string;
  purposeOfVisit: string;
  checkInTime: string;
  status: string;
  email?: string;
  vehicleNumber?: string;
  numberOfVisitors?: number;
}

const VisitorCheckedInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Get visitor data from navigation state
    const data = location.state?.visitorData as VisitorData;
    
    if (!data) {
      // If no data, redirect to main page
      navigate('/visitor-entry');
      return;
    }

    setVisitorData(data);

    // Animate progress bar
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setShowContent(true);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [location.state, navigate]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDirections = () => {
    // This could integrate with Google Maps or internal campus map
    alert(`Directions to ${visitorData?.department}: Please proceed to the main building and ask security for specific directions.`);
  };

  const contactSecurity = () => {
    // This could make a phone call or send a message
    alert('Security Contact: +91-80-67178000\nFor any assistance or emergency, please contact campus security.');
  };

  if (!visitorData) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh' }}>
      {/* Animated Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 6, 
            borderRadius: 3,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)'
            }
          }} 
        />
      </Box>

      <Fade in={showContent} timeout={1000}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8f1 50%, #ffffff 100%)',
            border: '2px solid',
            borderColor: 'success.main',
            overflow: 'hidden'
          }}
        >
          {/* Success Header with Animation */}
          <Box 
            sx={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
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
                background: 'url("data:image/svg+xml,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"><circle cx="3" cy="3" r="3"/><circle cx="13" cy="13" r="3"/></g></svg>") repeat',
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
                  border: '3px solid rgba(255,255,255,0.3)'
                }}
              >
                <CheckCircle sx={{ fontSize: 60 }} />
              </Avatar>
            </Grow>
            
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              Welcome to RVCE!
            </Typography>
            
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 2 }}>
              Check-in Successful
            </Typography>

            <Chip
              label={`VISITOR CHECKED IN`}
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
              {/* Visitor Information */}
              <Grid size={{ xs: 12, lg: 7 }}>
                <Slide direction="right" in={showContent} timeout={800}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Person sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h5" fontWeight="bold">
                          Visitor Details
                        </Typography>
                      </Box>
                      
                      <Box sx={{ space: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Badge sx={{ mr: 2, color: 'grey.600' }} />
                          <Box>
                            <Typography variant="h6" fontWeight="600">
                              {visitorData.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Visitor ID: {visitorData.id.slice(-8).toUpperCase()}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'grid', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Phone sx={{ mr: 2, color: 'info.main', fontSize: 20 }} />
                            <Typography variant="body1">{visitorData.contactNumber}</Typography>
                          </Box>

                          {visitorData.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Assignment sx={{ mr: 2, color: 'info.main', fontSize: 20 }} />
                              <Typography variant="body1">{visitorData.email}</Typography>
                            </Box>
                          )}

                          {visitorData.vehicleNumber && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Directions sx={{ mr: 2, color: 'warning.main', fontSize: 20 }} />
                              <Typography variant="body1">Vehicle: {visitorData.vehicleNumber}</Typography>
                            </Box>
                          )}

                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Schedule sx={{ mr: 2, color: 'success.main', fontSize: 20 }} />
                            <Typography variant="body1">
                              Checked in: {formatTime(visitorData.checkInTime)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>

              {/* Visit Information */}
              <Grid size={{ xs: 12, lg: 5 }}>
                <Slide direction="left" in={showContent} timeout={1000}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 3, bgcolor: 'info.50' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <LocationOn sx={{ mr: 1, color: 'info.main', fontSize: 28 }} />
                        <Typography variant="h5" fontWeight="bold" color="info.main">
                          Visit Information
                        </Typography>
                      </Box>
                      
                      <Box sx={{ space: 2 }}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            DEPARTMENT
                          </Typography>
                          <Typography variant="h6" fontWeight="600" color="info.dark">
                            {visitorData.department}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            MEETING WITH
                          </Typography>
                          <Typography variant="h6" fontWeight="600" color="info.dark">
                            {visitorData.whomToMeet}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            PURPOSE OF VISIT
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            bgcolor: 'white', 
                            p: 2, 
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'info.200'
                          }}>
                            {visitorData.purposeOfVisit}
                          </Typography>
                        </Box>

                        {visitorData.numberOfVisitors && visitorData.numberOfVisitors > 1 && (
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              GROUP SIZE
                            </Typography>
                            <Chip 
                              label={`${visitorData.numberOfVisitors} Visitors`} 
                              color="info" 
                              variant="outlined"
                            />
                          </Box>
                        )}
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
                  startIcon={<Person />}
                  onClick={() => navigate('/visitor-registration')}
                  sx={{ borderRadius: 2 }}
                >
                  Register Another Visitor
                </Button>
              </Box>
            </Box>

            {/* Important Notes */}
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
                <CheckCircleOutline sx={{ mr: 2, color: 'warning.dark', mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" color="warning.dark" gutterBottom>
                    Important Reminders:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    • <strong>Keep your ID:</strong> Carry valid photo identification at all times
                    <br />
                    • <strong>Follow directions:</strong> Proceed to {visitorData.department} to meet {visitorData.whomToMeet}
                    <br />
                    • <strong>Campus rules:</strong> Please follow all campus guidelines and security protocols
                    <br />
                    • <strong>Check-out:</strong> Remember to check out when leaving the campus
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Contact Information */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Need help? Contact Campus Security: <strong>+91-80-67178000</strong>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default VisitorCheckedInPage;
