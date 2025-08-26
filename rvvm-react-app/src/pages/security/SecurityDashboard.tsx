import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ExitToApp,
  People,
  CheckCircle,
  Cancel,
  PersonAdd,
  PersonRemove,
  Search,
  Security,
  Today,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface ApprovedVisitor {
  id: string;
  name: string;
  contactNumber: string;
  department: string;
  purposeOfVisit: string;
  whomToMeet: string;
  approvedBy: string;
  approvedAt: Date;
  status: 'approved' | 'checked_in' | 'checked_out';
  entryTime?: Date;
  exitTime?: Date;
}

const SecurityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [approvedVisitors, setApprovedVisitors] = useState<ApprovedVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkInDialog, setCheckInDialog] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<ApprovedVisitor | null>(null);
  const [stats, setStats] = useState({
    pendingEntry: 0,
    insideCampus: 0,
    todayTotal: 0
  });

  useEffect(() => {
    fetchApprovedVisitors();
    fetchStats();
    // Set up real-time listener here
  }, []);

  const fetchApprovedVisitors = async () => {
    try {
      // In a real app, this would fetch approved visitors from Firestore
      const mockVisitors: ApprovedVisitor[] = [
        {
          id: '1',
          name: 'John Doe',
          contactNumber: '9876543210',
          department: 'Computer Science',
          purposeOfVisit: 'Research Discussion',
          whomToMeet: 'prof.kumar@rvce.edu.in',
          approvedBy: 'Prof. Kumar',
          approvedAt: new Date(Date.now() - 15 * 60 * 1000),
          status: 'approved'
        },
        {
          id: '2',
          name: 'Jane Smith',
          contactNumber: '9876543211',
          department: 'Electronics',
          purposeOfVisit: 'Project Meeting',
          whomToMeet: 'prof.sharma@rvce.edu.in',
          approvedBy: 'Prof. Sharma',
          approvedAt: new Date(Date.now() - 45 * 60 * 1000),
          status: 'checked_in',
          entryTime: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: '3',
          name: 'Mike Johnson',
          contactNumber: '9876543212',
          department: 'Mechanical',
          purposeOfVisit: 'Lab Visit',
          whomToMeet: 'prof.patel@rvce.edu.in',
          approvedBy: 'Prof. Patel',
          approvedAt: new Date(Date.now() - 90 * 60 * 1000),
          status: 'checked_out',
          entryTime: new Date(Date.now() - 80 * 60 * 1000),
          exitTime: new Date(Date.now() - 10 * 60 * 1000)
        }
      ];
      
      setApprovedVisitors(mockVisitors);
      setStats({
        pendingEntry: mockVisitors.filter(v => v.status === 'approved').length,
        insideCampus: mockVisitors.filter(v => v.status === 'checked_in').length,
        todayTotal: mockVisitors.length
      });
    } catch (error) {
      console.error('Error fetching approved visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Fetch real-time statistics from backend
  };

  const handleCheckIn = async (visitor: ApprovedVisitor) => {
    try {
      // API call to check in visitor
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/visitors/checkin/${visitor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token here
        },
        body: JSON.stringify({ securityPersonnel: currentUser?.email })
      });

      if (response.ok) {
        setApprovedVisitors(prev => 
          prev.map(v => 
            v.id === visitor.id 
              ? { ...v, status: 'checked_in', entryTime: new Date() }
              : v
          )
        );
        setStats(prev => ({ 
          ...prev, 
          pendingEntry: prev.pendingEntry - 1,
          insideCampus: prev.insideCampus + 1
        }));
      }
    } catch (error) {
      console.error('Error checking in visitor:', error);
    }
    setCheckInDialog(false);
    setSelectedVisitor(null);
  };

  const handleCheckOut = async (visitor: ApprovedVisitor) => {
    try {
      // API call to check out visitor
      setApprovedVisitors(prev => 
        prev.map(v => 
          v.id === visitor.id 
            ? { ...v, status: 'checked_out', exitTime: new Date() }
            : v
        )
      );
      setStats(prev => ({ 
        ...prev, 
        insideCampus: prev.insideCampus - 1
      }));
    } catch (error) {
      console.error('Error checking out visitor:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('userRole');
      navigate('/security-login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const filteredVisitors = approvedVisitors.filter(visitor =>
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.contactNumber.includes(searchTerm) ||
    visitor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: 'warning.main' }}>
        <Toolbar>
          <Security sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Security Dashboard - Gate Management
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Security: {currentUser?.email?.split('@')[0]}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonAdd sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.pendingEntry}
                    </Typography>
                    <Typography color="text.secondary">
                      Awaiting Entry
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <People sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.insideCampus}
                    </Typography>
                    <Typography color="text.secondary">
                      Inside Campus
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Today sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.todayTotal}
                    </Typography>
                    <Typography color="text.secondary">
                      Today's Total
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Visitor List */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Security sx={{ fontSize: 32, color: 'warning.main', mr: 2 }} />
              <Typography variant="h5" sx={{ flexGrow: 1 }}>
                Visitor Gate Management
              </Typography>
            </Box>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name, phone, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ mb: 3 }}
            />

            {filteredVisitors.length === 0 ? (
              <Alert severity="info">
                No visitors found. {searchTerm && 'Try adjusting your search.'}
              </Alert>
            ) : (
              <List>
                {filteredVisitors.map((visitor, index) => (
                  <React.Fragment key={visitor.id}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">
                              {visitor.name}
                            </Typography>
                            <Chip 
                              label={visitor.status.replace('_', ' ').toUpperCase()} 
                              color={
                                visitor.status === 'checked_in' ? 'success' :
                                visitor.status === 'checked_out' ? 'default' : 'warning'
                              }
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              📞 {visitor.contactNumber} • 📍 {visitor.department}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              👤 Meeting: {visitor.whomToMeet}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ✅ Approved: {formatTime(visitor.approvedAt)} by {visitor.approvedBy}
                            </Typography>
                            {visitor.entryTime && (
                              <Typography variant="body2" color="success.main">
                                🚪 Entry: {formatTime(visitor.entryTime)}
                              </Typography>
                            )}
                            {visitor.exitTime && (
                              <Typography variant="body2" color="text.secondary">
                                🚪 Exit: {formatTime(visitor.exitTime)}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {visitor.status === 'approved' && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<PersonAdd />}
                              onClick={() => {
                                setSelectedVisitor(visitor);
                                setCheckInDialog(true);
                              }}
                            >
                              Check In
                            </Button>
                          )}
                          {visitor.status === 'checked_in' && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<PersonRemove />}
                              onClick={() => handleCheckOut(visitor)}
                            >
                              Check Out
                            </Button>
                          )}
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < filteredVisitors.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Today />}
              onClick={() => navigate('/security/today-entries')}
              sx={{ py: 1.5 }}
            >
              Today's Entries
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<People />}
              onClick={() => navigate('/security/inside-campus')}
              sx={{ py: 1.5 }}
            >
              Inside Campus
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Schedule />}
              onClick={() => navigate('/security/visitor-log')}
              sx={{ py: 1.5 }}
            >
              Visitor Log
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Check In Confirmation Dialog */}
      <Dialog open={checkInDialog} onClose={() => setCheckInDialog(false)}>
        <DialogTitle>Confirm Visitor Check-In</DialogTitle>
        <DialogContent>
          {selectedVisitor && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedVisitor.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: {selectedVisitor.contactNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Department: {selectedVisitor.department}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Meeting: {selectedVisitor.whomToMeet}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Purpose: {selectedVisitor.purposeOfVisit}
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
                Approved by: {selectedVisitor.approvedBy} at {formatTime(selectedVisitor.approvedAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckInDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => selectedVisitor && handleCheckIn(selectedVisitor)}
            variant="contained"
            color="success"
          >
            Confirm Check-In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecurityDashboard;
