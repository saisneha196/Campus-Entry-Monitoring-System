import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  TextField,
} from '@mui/material';
import {
  QrCodeScanner,
  ArrowBack,
  FlashOn,
  FlashOff,
  CameraAlt,
  Refresh,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

interface VisitorData {
  id: string;
  name: string;
  contactNumber: string;
  department: string;
  staffMember: string;
  purpose: string;
  checkInTime?: any;
  status: string;
}

const QRScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualQRInput, setManualQRInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    checkCameraPermission();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  const checkCameraPermission = async (retryCount = 0) => {
    console.log(`Checking camera permission attempt ${retryCount + 1}`);
    
    try {
      // First check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Multiple camera constraint strategies
      const constraints = [
        // Strategy 1: Basic video only
        { video: true },
        // Strategy 2: Specific video constraints
        { 
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 },
            facingMode: 'environment'
          } 
        },
        // Strategy 3: Minimal constraints
        { 
          video: { 
            width: 320, 
            height: 240 
          } 
        },
        // Strategy 4: Any video device
        { 
          video: { 
            facingMode: { ideal: 'environment' },
            width: { min: 320 },
            height: { min: 240 }
          } 
        }
      ];

      let stream = null;
      let lastError = null;

      // Try each constraint strategy
      for (let i = 0; i < constraints.length; i++) {
        try {
          console.log(`Trying camera constraint strategy ${i + 1}:`, constraints[i]);
          stream = await navigator.mediaDevices.getUserMedia(constraints[i]);
          console.log('Camera access successful with strategy:', i + 1);
          break;
        } catch (err) {
          console.log(`Strategy ${i + 1} failed:`, err);
          lastError = err;
          
          // Small delay between attempts
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      if (stream) {
        // Success! Clean up the test stream
        stream.getTracks().forEach(track => track.stop());
        setHasCamera(true);
        setError(null);
        console.log('Camera permission check successful');
        return;
      } else {
        throw lastError || new Error('All camera strategies failed');
      }
      
    } catch (err: any) {
      console.error(`Camera permission error (attempt ${retryCount + 1}):`, err);
      
      // Retry logic for certain errors
      if (retryCount < 3 && (
        err.name === 'AbortError' || 
        err.name === 'NotReadableError' ||
        err.message.includes('timeout') ||
        err.message.includes('could not start')
      )) {
        console.log(`Retrying camera access in 1 second... (attempt ${retryCount + 2})`);
        setTimeout(() => {
          checkCameraPermission(retryCount + 1);
        }, 1000);
        return;
      }
      
      // Final failure - set appropriate error message
      setHasCamera(false);
      
      let errorMessage = 'Camera access failed. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please click the camera icon in your browser\'s address bar and allow camera access, then refresh the page.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found. Please ensure a camera is connected and try again.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is in use by another application. Please close other apps using the camera and try again.';
      } else {
        errorMessage += 'Please ensure camera permissions are granted and no other applications are using the camera.';
      }
      
      setError(errorMessage);
    }
  };

  const startScanning = async (retryCount = 0) => {
    if (!videoRef.current || !hasCamera) {
      console.log('Cannot start scanning: no video element or camera');
      return;
    }

    try {
      setIsScanning(true);
      setError(null);
      setSuccess(null);
      
      console.log('Starting QR scanner...');
      
      // Ensure any existing scanner is cleaned up
      if (scannerRef.current) {
        try {
          scannerRef.current.destroy();
        } catch (e) {
          console.log('Error cleaning up existing scanner:', e);
        }
        scannerRef.current = null;
      }
      
      // Create new scanner with correct callback format
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result: any) => {
          console.log('QR Code detected:', result);
          console.log('QR Data:', result.data);
          // Extract the data from the result object - it's always in result.data
          const qrData = result.data;
          console.log('Extracted QR data:', qrData);
          handleQRCodeDetected(qrData);
        },
        {
          onDecodeError: (error: any) => {
            // Only log actual errors, not "No QR code found" messages
            if (!error.toString().includes('No QR code found') && !error.toString().includes('NotFoundException')) {
              console.log('QR decode error:', error);
            }
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5
        }
      );

      // Start the scanner with retry logic
      await scannerRef.current.start();
      console.log('QR scanner started successfully');
      
      // Check if flash is available and turn it on if enabled
      if (flashEnabled) {
        try {
          await scannerRef.current.turnFlashOn();
          console.log('Flash enabled');
        } catch (error) {
          console.log('Flash not available on this device:', error);
        }
      }
      
    } catch (err: any) {
      console.error(`Error starting scanner (attempt ${retryCount + 1}):`, err);
      
      // Clean up on error
      if (scannerRef.current) {
        try {
          scannerRef.current.destroy();
        } catch (e) {
          console.log('Error during cleanup:', e);
        }
        scannerRef.current = null;
      }
      
      setIsScanning(false);
      
      // Retry logic for scanner start failures
      if (retryCount < 2 && (
        err.name === 'NotReadableError' ||
        err.message.includes('Could not start') ||
        err.message.includes('NotAllowedError')
      )) {
        console.log(`Retrying scanner start in 1 second... (attempt ${retryCount + 2})`);
        setTimeout(() => {
          startScanning(retryCount + 1);
        }, 1000);
        return;
      }
      
      // Show appropriate error message
      let errorMessage = 'Failed to start QR scanner. ';
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera access and try again.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is in use by another application.';
      } else {
        errorMessage += 'Please check camera permissions and try again.';
      }
      
      setError(errorMessage);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const toggleFlash = async () => {
    if (!scannerRef.current) return;

    try {
      if (flashEnabled) {
        await scannerRef.current.turnFlashOff();
      } else {
        await scannerRef.current.turnFlashOn();
      }
      setFlashEnabled(!flashEnabled);
    } catch (err) {
      console.error('Flash toggle error:', err);
    }
  };

  const handleQRCodeDetected = async (qrData: string) => {
    console.log('Processing QR data:', qrData);
    setLoading(true);
    setError(null);
    
    try {
      // Stop scanning temporarily
      stopScanning();
      
      // Parse QR code data (assuming it contains a visitor ID or structured data)
      let visitorId: string;
      let qrInfo: any = null;
      
      try {
        // Try to parse as JSON first
        qrInfo = JSON.parse(qrData);
        console.log('Parsed QR JSON:', qrInfo);
        visitorId = qrInfo.id || qrInfo.visitorId || qrData;
        console.log('Extracted visitor ID:', visitorId);
      } catch (parseError) {
        console.log('QR data is not JSON, treating as direct visitor ID:', qrData);
        // If not JSON, treat as direct visitor ID
        visitorId = qrData;
      }

      console.log('Looking for visitor with ID:', visitorId);
      
      // Fetch visitor data from Firestore
      const visitorDoc = await getDoc(doc(db, 'visits', visitorId));
      console.log('Firestore query result:', visitorDoc.exists(), visitorDoc.data());
      
      if (visitorDoc.exists()) {
        const visitorData = { id: visitorDoc.id, ...visitorDoc.data() } as VisitorData;
        console.log('Found visitor data:', visitorData);
        
        // Update check-in time and status
        await updateDoc(doc(db, 'visits', visitorId), {
          checkInTime: serverTimestamp(),
          status: 'checked-in',
          lastScanned: new Date().toISOString(),
        });

        setScannedData(visitorData);
        setSuccess(`Welcome, ${visitorData.name}! Check-in successful.`);
        
        // Navigate to visitor details after a delay
        setTimeout(() => {
          navigate('/visitor-checked-in', { 
            state: { 
              visitorData: {
                ...visitorData,
                checkInTime: new Date().toISOString()
              }
            } 
          });
        }, 3000);
        
      } else {
        console.log('No visitor found with ID:', visitorId);
        console.log('QR contained:', qrInfo);
        setError(`Visitor not found. QR code contained ID: ${visitorId}`);
        // Restart scanning after a delay
        setTimeout(() => {
          startScanning();
        }, 2000);
      }
      
    } catch (err: any) {
      console.error('Error processing QR code:', err);
      setError('Failed to process QR code. Please try again.');
      // Restart scanning after a delay
      setTimeout(() => {
        startScanning();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = () => {
    navigate('/quick-checkin');
  };

  const handleManualQRSubmit = () => {
    if (!manualQRInput.trim()) {
      setError('Please enter a QR code value.');
      return;
    }
    handleQRCodeDetected(manualQRInput.trim());
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
            <QrCodeScanner sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              QR Code Scanner
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Scan visitor QR code for instant check-in
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

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
              Processing QR code...
            </Typography>
          </Box>
        )}

        {/* Camera View */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ position: 'relative', textAlign: 'center' }}>
              {hasCamera ? (
                <>
                  <video
                    ref={videoRef}
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      height: '300px',
                      backgroundColor: '#000',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                    playsInline
                    muted
                  />
                  
                  {/* Scanner overlay */}
                  {isScanning && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 200,
                        height: 200,
                        border: '2px solid',
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -2,
                          left: -2,
                          right: -2,
                          bottom: -2,
                          border: '2px solid',
                          borderColor: 'primary.main',
                          borderRadius: 2,
                          animation: 'pulse 2s infinite',
                        },
                      }}
                    />
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    flexDirection: 'column',
                  }}
                >
                  <CameraAlt sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Camera access is required to scan QR codes
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => checkCameraPermission()}
                    sx={{ mt: 2 }}
                    startIcon={<Refresh />}
                  >
                    Enable Camera
                  </Button>
                </Box>
              )}
            </Box>

            {/* Controls */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              {hasCamera && (
                <>
                  {!isScanning ? (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => startScanning()}
                      startIcon={<QrCodeScanner />}
                      disabled={loading}
                    >
                      Start Scanning
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={stopScanning}
                      color="error"
                    >
                      Stop Scanning
                    </Button>
                  )}

                  {isScanning && (
                    <IconButton
                      onClick={toggleFlash}
                      sx={{ 
                        bgcolor: flashEnabled ? 'warning.main' : 'grey.200',
                        color: flashEnabled ? 'white' : 'grey.700',
                        '&:hover': {
                          bgcolor: flashEnabled ? 'warning.dark' : 'grey.300',
                        }
                      }}
                    >
                      {flashEnabled ? <FlashOff /> : <FlashOn />}
                    </IconButton>
                  )}
                </>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Scanned Data Display */}
        {scannedData && (
          <Card variant="outlined" sx={{ mb: 3, bgcolor: 'success.50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6" color="success.main">
                  Visitor Found!
                </Typography>
              </Box>
              
              <Typography variant="body1">
                <strong>Name:</strong> {scannedData.name}
              </Typography>
              <Typography variant="body1">
                <strong>Department:</strong> {scannedData.department}
              </Typography>
              <Typography variant="body1">
                <strong>Staff Member:</strong> {scannedData.staffMember}
              </Typography>
              <Typography variant="body1">
                <strong>Purpose:</strong> {scannedData.purpose}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Manual QR Input Section - Hidden by default */}
        {showManualInput && (
          <Card variant="outlined" sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6" color="primary">
                  Manual QR Code Input
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setShowManualInput(false)}
                >
                  Hide
                </Button>
              </Box>
            
              <Typography variant="body2" color="text.secondary" paragraph>
                If you can't use the camera scanner, you can manually type or paste the QR code content:
              </Typography>
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Expected formats:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  • Simple visitor ID: <code>visitor_12345</code>
                  <br />
                  • JSON format: <code>{'{"id": "visitor_12345", "name": "John Doe"}'}</code>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  label="QR Code Content"
                  variant="outlined"
                  placeholder="Enter or paste QR code text here..."
                  value={manualQRInput}
                  onChange={(e) => setManualQRInput(e.target.value)}
                  disabled={loading}
                  helperText="This could be a visitor ID or JSON data from the QR code"
                />
                <Button
                  variant="contained"
                  onClick={handleManualQRSubmit}
                  disabled={loading || !manualQRInput.trim()}
                  sx={{ mt: 0, whiteSpace: 'nowrap' }}
                >
                  Process
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Alternative Options */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Alternative Check-in Methods
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Having trouble with QR scanning? Try these alternatives:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={handleManualEntry}
                startIcon={<QrCodeScanner />}
              >
                Manual Phone Entry
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => navigate('/visitor-registration')}
                startIcon={<QrCodeScanner />}
              >
                New Registration
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => setShowManualInput(true)}
                startIcon={<QrCodeScanner />}
              >
                Manual QR Input
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Instructions:</strong>
            <br />
            • Position the QR code within the scanning frame
            <br />
            • Ensure good lighting for better scanning
            <br />
            • Hold steady until the code is detected
            <br />
            • Use flash if needed in low light conditions
          </Typography>
        </Box>
        
        {/* HTTPS Notice */}
        {!window.location.protocol.includes('https') && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 2, borderLeft: 4, borderColor: 'warning.main' }}>
            <Typography variant="body2" color="warning.dark">
              <strong>Note:</strong> Camera access requires HTTPS for security. 
              For production deployment, ensure your site uses HTTPS.
              <br />
              For local development, you can use <code>localhost</code> which is exempt from this requirement.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default QRScannerPage;
