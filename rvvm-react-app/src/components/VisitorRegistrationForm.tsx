import React, { useState, useRef } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  FormHelperText,
  Chip,
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  LocationOn,
  Business,
  Assignment,
  CameraAlt,
  CloudUpload,
  Delete,
} from '@mui/icons-material';
import { departments, departmentStaff, documentTypes } from '../data/departmentData';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

interface VisitorFormData {
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  purposeOfVisit: string;
  department: string;
  whomToMeet: string;
  numberOfVisitors: number;
  vehicleNumber: string;
  documentType: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  sendNotification: boolean;
}

interface VisitorRegistrationFormProps {
  onSubmit?: (visitorData: VisitorFormData) => void;
  onSuccess?: (visitId: string, visitorData: VisitorFormData) => void;
}

const steps = ['Basic Information', 'Visit Details', 'Emergency Contact'];

const VisitorRegistrationForm: React.FC<VisitorRegistrationFormProps> = ({
  onSubmit,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<VisitorFormData>({
    name: '',
    address: '',
    contactNumber: '',
    email: '',
    purposeOfVisit: '',
    department: '',
    whomToMeet: '',
    numberOfVisitors: 1,
    vehicleNumber: '',
    documentType: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    sendNotification: true,
  });

  const [errors, setErrors] = useState<Partial<VisitorFormData>>({});

  const handleInputChange = (field: keyof VisitorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Photo size should be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Document size should be less than 10MB');
        return;
      }
      setDocumentFile(file);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<VisitorFormData> = {};

    if (step === 0) {
      // Basic Information validation
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = 'Contact number is required';
      } else if (!/^\d{10}$/.test(formData.contactNumber)) {
        newErrors.contactNumber = 'Contact number must be 10 digits';
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (step === 1) {
      // Visit Details validation
      if (!formData.purposeOfVisit.trim()) newErrors.purposeOfVisit = 'Purpose of visit is required';
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.whomToMeet) newErrors.whomToMeet = 'Please select whom to meet';
      if (!formData.documentType) newErrors.documentType = 'Document type is required';
    }

    if (step === 2) {
      // Emergency Contact validation
      if (!formData.emergencyContactName.trim()) {
        newErrors.emergencyContactName = 'Emergency contact name is required';
      }
      if (!formData.emergencyContactNumber.trim()) {
        newErrors.emergencyContactNumber = 'Emergency contact number is required';
      } else if (!/^\d{10}$/.test(formData.emergencyContactNumber)) {
        newErrors.emergencyContactNumber = 'Emergency contact number must be 10 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    setError(null);

    try {
      // Create visitor document in Firestore
      const visitorData = {
        ...formData,
        type: 'registration',
        status: 'pending',
        isApproved: false,
        hasPhoto: !!photoFile,
        hasDocument: !!documentFile,
        createdAt: serverTimestamp(),
        entryTime: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'visits'), visitorData);
      
      console.log('VisitorRegistrationForm: Document created with ID:', docRef.id);
      console.log('VisitorRegistrationForm: Form data to pass:', formData);
      
      // TODO: Upload photo and document files to Firebase Storage
      // This would require additional Firebase Storage setup
      
      onSubmit?.(formData);
      
      console.log('VisitorRegistrationForm: Calling onSuccess callback');
      onSuccess?.(docRef.id, formData);
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        contactNumber: '',
        email: '',
        purposeOfVisit: '',
        department: '',
        whomToMeet: '',
        numberOfVisitors: 1,
        vehicleNumber: '',
        documentType: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        sendNotification: true,
      });
      setActiveStep(0);
      setPhotoFile(null);
      setPhotoPreview(null);
      setDocumentFile(null);

    } catch (err: any) {
      console.error('Error submitting visitor registration:', err);
      setError(err.message || 'Failed to register visitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInformation = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Full Name"
          required
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          InputProps={{
            startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Contact Number"
          required
          value={formData.contactNumber}
          onChange={(e) => handleInputChange('contactNumber', e.target.value)}
          error={!!errors.contactNumber}
          helperText={errors.contactNumber}
          inputProps={{ maxLength: 10 }}
          InputProps={{
            startAdornment: <Phone sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Email Address (Optional)"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{
            startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Number of Visitors"
          type="number"
          value={formData.numberOfVisitors}
          onChange={(e) => handleInputChange('numberOfVisitors', parseInt(e.target.value) || 1)}
          inputProps={{ min: 1, max: 10 }}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Address"
          required
          multiline
          rows={3}
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          error={!!errors.address}
          helperText={errors.address}
          InputProps={{
            startAdornment: <LocationOn sx={{ color: 'action.active', mr: 1, alignSelf: 'flex-start', mt: 1 }} />,
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Vehicle Number (Optional)"
          value={formData.vehicleNumber}
          onChange={(e) => handleInputChange('vehicleNumber', e.target.value.toUpperCase())}
          placeholder="KA01AB1234"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {/* Photo Upload Section */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Photo (Optional)
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            {photoPreview ? (
              <Avatar src={photoPreview} sx={{ width: 64, height: 64 }} />
            ) : (
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'grey.300' }}>
                <CameraAlt />
              </Avatar>
            )}
            <Box>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handlePhotoCapture}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<CameraAlt />}
                onClick={() => fileInputRef.current?.click()}
              >
                Take Photo
              </Button>
              {photoFile && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );

  const renderVisitDetails = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Purpose of Visit"
          required
          multiline
          rows={2}
          value={formData.purposeOfVisit}
          onChange={(e) => handleInputChange('purposeOfVisit', e.target.value)}
          error={!!errors.purposeOfVisit}
          helperText={errors.purposeOfVisit}
          InputProps={{
            startAdornment: <Assignment sx={{ color: 'action.active', mr: 1, alignSelf: 'flex-start', mt: 1 }} />,
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required error={!!errors.department}>
          <InputLabel>Department</InputLabel>
          <Select
            value={formData.department}
            label="Department"
            onChange={(e) => {
              handleInputChange('department', e.target.value);
              handleInputChange('whomToMeet', ''); // Reset staff selection
            }}
            startAdornment={<Business sx={{ color: 'action.active', mr: 1 }} />}
          >
            {departments.map((dept) => (
              <MenuItem key={dept.value} value={dept.value}>
                {dept.label}
              </MenuItem>
            ))}
          </Select>
          {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required error={!!errors.whomToMeet}>
          <InputLabel>Whom to Meet</InputLabel>
          <Select
            value={formData.whomToMeet}
            label="Whom to Meet"
            onChange={(e) => handleInputChange('whomToMeet', e.target.value)}
            disabled={!formData.department}
            startAdornment={<Person sx={{ color: 'action.active', mr: 1 }} />}
          >
            {formData.department && departmentStaff[formData.department]?.map((staff) => (
              <MenuItem key={staff.value} value={staff.value}>
                {staff.label}
              </MenuItem>
            ))}
          </Select>
          {errors.whomToMeet && <FormHelperText>{errors.whomToMeet}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required error={!!errors.documentType}>
          <InputLabel>Document Type</InputLabel>
          <Select
            value={formData.documentType}
            label="Document Type"
            onChange={(e) => handleInputChange('documentType', e.target.value)}
          >
            {documentTypes.map((doc) => (
              <MenuItem key={doc.value} value={doc.value}>
                {doc.label}
              </MenuItem>
            ))}
          </Select>
          {errors.documentType && <FormHelperText>{errors.documentType}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {/* Document Upload Section */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Document Upload (Optional)
          </Typography>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            ref={documentInputRef}
            style={{ display: 'none' }}
            onChange={handleDocumentUpload}
          />
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={() => documentInputRef.current?.click()}
            fullWidth
          >
            {documentFile ? documentFile.name : 'Upload Document'}
          </Button>
          {documentFile && (
            <Chip
              label={documentFile.name}
              onDelete={() => setDocumentFile(null)}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  );

  const renderEmergencyContact = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Emergency Contact Name"
          required
          value={formData.emergencyContactName}
          onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
          error={!!errors.emergencyContactName}
          helperText={errors.emergencyContactName}
          InputProps={{
            startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Emergency Contact Number"
          required
          value={formData.emergencyContactNumber}
          onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
          error={!!errors.emergencyContactNumber}
          helperText={errors.emergencyContactNumber}
          inputProps={{ maxLength: 10 }}
          InputProps={{
            startAdornment: <Phone sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
      </Grid>
    </Grid>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderVisitDetails();
      case 2:
        return renderEmergencyContact();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Visitor Registration
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Registering...' : 'Register Visitor'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default VisitorRegistrationForm;
