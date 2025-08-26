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
  Badge,
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Notifications,
  ExitToApp,
  People,
  AccessTime,
  CheckCircle,
  Cancel,
  Person,
  Schedule,
  Today
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { usePendingVisitors, approveVisitor, rejectVisitor } from '../../hooks/useFirebaseRealTime';

interface PendingVisitor {
  id: string;
  name: string;
  contactNumber: string;
  department: string;
  purposeOfVisit: string;
  whomToMeet: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const HostDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  // Use real-time Firebase data
  const { visitors: pendingVisitors, loading, error } = usePendingVisitors(currentUser?.email);
  
  const [stats, setStats] = useState({
    totalPending: 0,
    todayApproved: 0,
    weeklyVisitors: 0
  });

  // Update stats when visitors change
  useEffect(() => {
    setStats({
      totalPending: pendingVisitors.filter(v => v.status === 'pending').length,
      todayApproved: 5, // This would be calculated from Firebase data
      weeklyVisitors: 23 // This would be calculated from Firebase data
    });
  }, [pendingVisitors]);


  const handleApprove = async (visitorId: string) => {
    try {
      if (currentUser?.email) {
        await approveVisitor(visitorId, currentUser.email);
        // Firebase real-time listener will automatically update the UI
      }
    } catch (error) {
      console.error('Error approving visitor:', error);
      // Show user-friendly error message
    }
  };

  const handleReject = async (visitorId: string) => {
    try {
      if (currentUser?.email) {
        await rejectVisitor(visitorId, currentUser.email);
        // Firebase real-time listener will automatically update the UI
      }
    } catch (error) {
      console.error('Error rejecting visitor:', error);
      // Show user-friendly error message
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('userRole');
      navigate('/host-login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Host Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {currentUser?.email?.split('@')[0]}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={stats.totalPending} color="error">
              <Notifications />
            </Badge>
          </IconButton>
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
                  <AccessTime sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.totalPending}
                    </Typography>
                    <Typography color="text.secondary">
                      Pending Approvals
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
                  <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.todayApproved}
                    </Typography>
                    <Typography color="text.secondary">
                      Approved Today
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
                  <People sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.weeklyVisitors}
                    </Typography>
                    <Typography color="text.secondary">
                      This Week
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pending Visitors */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Person sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
              <Typography variant="h5">
                Visitors Awaiting Your Approval
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">
                Error loading visitors: {error}
              </Alert>
            ) : pendingVisitors.length === 0 ? (
              <Alert severity="info">
                No pending visitor approvals at the moment.
              </Alert>
            ) : (
              <List>
                {pendingVisitors.map((visitor, index) => (
                  <React.Fragment key={visitor.id}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">
                              {visitor.name}
                            </Typography>
                            <Chip 
                              label={visitor.status.toUpperCase()} 
                              color={
                                visitor.status === 'approved' ? 'success' :
                                visitor.status === 'rejected' ? 'error' : 'warning'
                              }
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              📞 {visitor.contactNumber} • 🕐 {formatTime(visitor.createdAt)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              📍 {visitor.department}
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                              <strong>Purpose:</strong> {visitor.purposeOfVisit}
                            </Typography>
                          </Box>
                        }
                      />
                      {visitor.status === 'pending' && (
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApprove(visitor.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => handleReject(visitor.id)}
                            >
                              Reject
                            </Button>
                          </Box>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                    {index < pendingVisitors.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Today />}
              onClick={() => navigate('/host/today-visitors')}
              sx={{ py: 1.5 }}
            >
              View Today's Visitors
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Schedule />}
              onClick={() => navigate('/host/visitor-history')}
              sx={{ py: 1.5 }}
            >
              Visitor History
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HostDashboard;
