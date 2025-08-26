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
  CircularProgress,
  Fade,
  Grow,
  Slide,
} from '@mui/material';
import {
  CheckCircle,
  Download,
  Share,
  Print,
  Home,
  QrCode,
  Person,
  AccessTime,
  Badge,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'qrcode';

interface VisitorData {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  address: string;
  department: string;
  staffMember: string;
  purpose: string;
  visitDate: string;
  createdAt: string;
  photoURL?: string;
}

const VisitorSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Get visitor data from navigation state
    const data = location.state?.visitorData as VisitorData;
    
    console.log('VisitorSuccessPage: Received location state:', location.state);
    console.log('VisitorSuccessPage: Extracted visitor data:', data);
    
    if (!data) {
      console.log('VisitorSuccessPage: No visitor data found, redirecting to visitor-entry');
      // If no data, redirect to main page
      navigate('/visitor-entry');
      return;
    }

    console.log('VisitorSuccessPage: Setting visitor data and generating QR code');
    setVisitorData(data);
    generateQRCode(data);

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
    }, 25);

    return () => clearInterval(timer);
  }, [location.state, navigate]);

  const generateQRCode = async (data: VisitorData) => {
    try {
      console.log('VisitorSuccessPage: Starting QR code generation for:', data);
      
      // Create QR code data with visitor ID and essential info
      const qrData = {
        id: data.id,
        name: data.name,
        contact: data.contactNumber,
        department: data.department,
        timestamp: new Date().toISOString(),
        type: 'visitor_entry'
      };

      console.log('VisitorSuccessPage: QR data to encode:', qrData);

      // Generate QR code as data URL
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      console.log('VisitorSuccessPage: QR code generated successfully, length:', qrCodeDataURL.length);
      setQrCodeData(qrCodeDataURL);
      
    } catch (error) {
      console.error('VisitorSuccessPage: Error generating QR code:', error);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeData || !visitorData) return;

    const link = document.createElement('a');
    link.download = `visitor_qr_${visitorData.name.replace(/\s+/g, '_')}_${visitorData.id}.png`;
    link.href = qrCodeData;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!visitorData) return;

    const shareData = {
      title: 'RVCE Visitor Entry',
      text: `Visitor Registration Successful for ${visitorData.name}`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `Visitor Registration Successful!\nName: ${visitorData.name}\nID: ${visitorData.id}\nDepartment: ${visitorData.department}`
      );
      alert('Visitor details copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
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
            p: 4, 
            borderRadius: 4, 
            border: '2px solid', 
            borderColor: 'success.main',
            background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8f1 50%, #ffffff 100%)',
            overflow: 'hidden'
          }}>
        {/* Success Header with Animation */}
        <Box textAlign="center" mb={4}>
          <Grow in={showContent} timeout={1500}>
            <Avatar
              sx={{
                bgcolor: 'success.main',
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 3,
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
              }}
            >
              <CheckCircle sx={{ fontSize: 60 }} />
            </Avatar>
          </Grow>
          
          <Typography variant="h4" component="h1" gutterBottom color="success.main">
            Registration Successful!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Your visitor registration has been completed successfully. 
            Please save your QR code for easy campus entry.
          </Typography>

          <Chip
            label="ENTRY APPROVED"
            color="success"
            sx={{ fontWeight: 'bold', fontSize: '0.9rem', px: 2 }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Visitor Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Slide direction="right" in={showContent} timeout={800}>
              <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Visitor Details</Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  {visitorData.photoURL && (
                    <Avatar
                      src={visitorData.photoURL}
                      sx={{ width: 60, height: 60, mb: 2 }}
                    />
                  )}
                  
                  <Typography variant="h6" gutterBottom>
                    {visitorData.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>ID:</strong> {visitorData.id}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Phone:</strong> {visitorData.contactNumber}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Email:</strong> {visitorData.email}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Address:</strong> {visitorData.address}
                  </Typography>
                </Box>
              </CardContent>
              </Card>
            </Slide>
          </Grid>

          {/* Visit Details & QR Code */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Slide direction="left" in={showContent} timeout={1000}>
              <Card variant="outlined" sx={{ height: '100%', borderRadius: 3, bgcolor: 'success.50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Badge sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="h6">Visit Information</Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                    <strong>Department:</strong> {visitorData.department}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Staff Member:</strong> {visitorData.staffMember}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Purpose:</strong> {visitorData.purpose}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <AccessTime sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                    <strong>Visit Date:</strong> {formatDate(visitorData.visitDate)}
                  </Typography>
                </Box>

                {/* QR Code */}
                <Divider sx={{ my: 2 }} />
                
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    <QrCode sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                    Your Entry QR Code
                  </Typography>
                  
                  {qrCodeData ? (
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, display: 'inline-block' }}>
                      <img
                        src={qrCodeData}
                        alt="Visitor QR Code"
                        style={{ width: 150, height: 150 }}
                        onError={() => console.error('VisitorSuccessPage: QR Code image failed to load')}
                        onLoad={() => console.log('VisitorSuccessPage: QR Code image loaded successfully')}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ p: 4, bgcolor: 'grey.100', borderRadius: 2, display: 'inline-block' }}>
                      <Typography variant="body2" color="text.secondary">
                        Generating QR Code...
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    </Box>
                  )}
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Show this QR code at the campus entrance
                  </Typography>
                </Box>
              </CardContent>
              </Card>
            </Slide>
          </Grid>
        </Grid>

        {/* Actions */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadQR}
            disabled={!qrCodeData}
          >
            Download QR Code
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrint}
          >
            Print Details
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={handleShare}
          >
            Share
          </Button>
        </Box>

        {/* Navigation */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={() => navigate('/visitor-entry')}
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/visitor-registration')}
          >
            Register Another Visitor
          </Button>
        </Box>

        {/* Important Notes */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'warning.50', borderRadius: 2, borderLeft: 4, borderColor: 'warning.main' }}>
          <Typography variant="h6" color="warning.dark" gutterBottom>
            Important Instructions:
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            • <strong>Save your QR code:</strong> Download or take a screenshot for quick entry
            <br />
            • <strong>Campus entry:</strong> Show the QR code at the security gate
            <br />
            • <strong>Contact person:</strong> Proceed to {visitorData.department} to meet {visitorData.staffMember}
            <br />
            • <strong>Valid ID required:</strong> Carry a valid photo identification document
            <br />
            • <strong>Follow guidelines:</strong> Adhere to campus rules and security protocols
          </Typography>
        </Box>

        {/* Contact Information */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            For assistance or inquiries, contact the security desk at <strong>+91-80-67178000</strong>
          </Typography>
        </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default VisitorSuccessPage;
