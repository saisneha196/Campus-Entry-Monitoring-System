import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Alert,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Tooltip,
  AppBar,
  Toolbar,
  Divider,
} from '@mui/material';
import {
  Add,
  Person,
  QrCodeScanner,
  Dashboard,
  Notifications,
  LocalTaxi,
  CheckCircle,
  Cancel,
  AccessTime,
  TrendingUp,
  Group,
  Security,
  NotificationsActive,
  PersonAdd,
  Assignment,
  Business,
  Logout,
  Phone,
  Email,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

const EnhancedSecurityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { 
    notifications, 
    visitorRequests, 
    markAsRead, 
    getAllRequestsForSecurity,
    unreadCount 
  } = useNotifications();
  
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'visitors' | 'notifications'>('dashboard');
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get data from notification context
  const allRequests = getAllRequestsForSecurity();
  const pendingRequests = allRequests.filter(r => r.status === 'pending');
  const approvedRequests = allRequests.filter(r => r.status === 'approved');
  const todayRequests = allRequests.filter(r => {
    const today = new Date().toDateString();
    const requestDate = new Date(r.requestedTime).toDateString();
    return requestDate === today;
  });

  useEffect(() => {
    // Check if there's a success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setShowSuccessMessage(true);
      // Clear the state to prevent showing message again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const statsCards = [
    {
      title: 'Total Requests Today',
      value: todayRequests.length,
      icon: <Person />,
      color: 'primary' as const,
      trend: '+12%'
    },
    {
      title: 'Pending Approvals',
      value: pendingRequests.length,
      icon: <AccessTime />,
      color: 'warning' as const,
      trend: pendingRequests.length > 0 ? `${pendingRequests.length} waiting` : 'All clear'
    },
    {
      title: 'Approved Today',
      value: approvedRequests.filter(r => {
        const today = new Date().toDateString();
        const approvalDate = r.approvalTime ? new Date(r.approvalTime).toDateString() : null;
        return approvalDate === today;
      }).length,
      icon: <CheckCircle />,
      color: 'success' as const,
      trend: '+8%'
    },
    {
      title: 'Notifications',
      value: unreadCount,
      icon: <NotificationsActive />,
      color: 'info' as const,
      trend: unreadCount > 0 ? `${unreadCount} new` : 'All read'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle />;
      case 'pending':
        return <AccessTime />;
      case 'rejected':
        return <Cancel />;
      default:
        return <Person />;
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <AppBar position="static" sx={{ mb: 4, borderRadius: 2 }}>
        <Toolbar>
          <Security sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              RVCE Security Dashboard
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Welcome back, {user?.name || 'Security Officer'}
            </Typography>
          </Box>
          
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              onClick={(e) => setNotificationAnchor(e.currentTarget)}
            >
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Account">
            <IconButton 
              color="inherit" 
              onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.name?.[0] || 'S'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Quick Action Buttons */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size="auto">
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonAdd />}
            onClick={() => navigate('/security/visitor-registration')}
            sx={{ borderRadius: 3, px: 3 }}
          >
            Register New Visitor
          </Button>
        </Grid>
        <Grid size="auto">
          <Button
            variant="outlined"
            size="large"
            startIcon={<QrCodeScanner />}
            onClick={() => navigate('/quick-checkin')}
            sx={{ borderRadius: 3, px: 3 }}
          >
            QR Quick Check-in
          </Button>
        </Grid>
        <Grid size="auto">
          <Button
            variant="outlined"
            size="large"
            startIcon={<LocalTaxi />}
            onClick={() => navigate('/cab-entry')}
            sx={{ borderRadius: 3, px: 3 }}
          >
            Cab Entry
          </Button>
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
            <Button
              variant={selectedTab === 'dashboard' ? 'contained' : 'outlined'}
              startIcon={<Dashboard />}
              onClick={() => setSelectedTab('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant={selectedTab === 'visitors' ? 'contained' : 'outlined'}
              startIcon={<Person />}
              onClick={() => setSelectedTab('visitors')}
            >
              Visitor Requests
            </Button>
            <Button
              variant={selectedTab === 'notifications' ? 'contained' : 'outlined'}
              startIcon={<Notifications />}
              onClick={() => setSelectedTab('notifications')}
            >
              Notifications {unreadCount > 0 && <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }} />}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 'dashboard' && (
        <Grid container spacing={3}>
          {/* Stats Cards */}
          {statsCards.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="h6">
                        {card.title}
                      </Typography>
                      <Typography variant="h4" component="div">
                        {card.value}
                      </Typography>
                      <Typography variant="body2" color={`${card.color}.main`}>
                        {card.trend}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: `${card.color}.main` }}>
                      {card.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Recent Activity */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {allRequests.slice(0, 5).map((request) => (
                  <ListItem key={request.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getStatusColor(request.status) + '.main' }}>
                        {getStatusIcon(request.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${request.visitorName} - ${request.status.toUpperCase()}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Host: {request.hostName} • {request.department}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(request.requestedTime)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Alerts */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Alerts & Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {pendingRequests.length > 0 && (
                  <Alert severity="warning">
                    {pendingRequests.length} visitor request{pendingRequests.length > 1 ? 's' : ''} awaiting host approval
                  </Alert>
                )}
                {unreadCount > 0 && (
                  <Alert severity="info">
                    {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                  </Alert>
                )}
                {pendingRequests.length === 0 && unreadCount === 0 && (
                  <Alert severity="success">
                    All up to date! No pending actions.
                  </Alert>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {selectedTab === 'visitors' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="warning.main">
                Pending Approvals ({pendingRequests.length})
              </Typography>
              <List>
                {pendingRequests.length === 0 ? (
                  <ListItem>
                    <ListItemText 
                      primary="No pending requests"
                      secondary="All visitor requests have been processed"
                    />
                  </ListItem>
                ) : (
                  pendingRequests.map((request) => (
                    <ListItem key={request.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <AccessTime />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={request.visitorName}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              📞 {request.visitorPhone} • 🏢 {request.department}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              👤 Host: {request.hostName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              📋 {request.purposeOfVisit}
                            </Typography>
                            <Typography variant="body2" color="warning.main">
                              ⏰ Requested: {formatTime(request.requestedTime)}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label="Waiting for Host"
                        color="warning"
                        size="small"
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="success.main">
                Recently Approved ({approvedRequests.slice(0, 5).length})
              </Typography>
              <List>
                {approvedRequests.slice(0, 5).length === 0 ? (
                  <ListItem>
                    <ListItemText 
                      primary="No approved requests yet"
                      secondary="Approved visitors will appear here"
                    />
                  </ListItem>
                ) : (
                  approvedRequests.slice(0, 5).map((request) => (
                    <ListItem key={request.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <CheckCircle />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={request.visitorName}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              📞 {request.visitorPhone} • 🏢 {request.department}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              👤 Host: {request.hostName}
                            </Typography>
                            <Typography variant="body2" color="success.main">
                              ✅ Approved: {request.approvalTime ? formatTime(request.approvalTime) : 'Recently'}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Chip
                          label="Approved"
                          color="success"
                          size="small"
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Person />}
                          onClick={() => {
                            navigate('/visitor-checked-in', {
                              state: {
                                visitorData: {
                                  id: request.id,
                                  name: request.visitorName,
                                  contactNumber: request.visitorPhone,
                                  email: request.visitorEmail,
                                  department: request.department,
                                  whomToMeet: request.hostName,
                                  purposeOfVisit: request.purposeOfVisit,
                                  checkInTime: new Date().toISOString(),
                                  status: 'checked-in',
                                  numberOfVisitors: request.numberOfVisitors,
                                  vehicleNumber: request.vehicleNumber
                                }
                              }
                            });
                          }}
                        >
                          Check In
                        </Button>
                      </Box>
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      {selectedTab === 'notifications' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Notifications ({notifications.length})
                </Typography>
                {unreadCount > 0 && (
                  <Chip 
                    label={`${unreadCount} unread`} 
                    color="primary" 
                    size="small" 
                  />
                )}
              </Box>
              
              <List>
                {notifications.length === 0 ? (
                  <ListItem>
                    <ListItemText 
                      primary="No notifications"
                      secondary="All notifications will appear here"
                    />
                  </ListItem>
                ) : (
                  notifications.map((notification) => (
                    <ListItem 
                      key={notification.id} 
                      onClick={() => handleNotificationClick(notification.id)}
                      sx={{ 
                        cursor: 'pointer',
                        bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                        '&:hover': { bgcolor: 'action.selected' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: notification.type === 'visitor_approved' ? 'success.main' : 
                                    notification.type === 'visitor_rejected' ? 'error.main' : 'info.main'
                          }}
                        >
                          {notification.type === 'visitor_approved' ? <CheckCircle /> : 
                           notification.type === 'visitor_rejected' ? <Cancel /> : <Notifications />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight={notification.isRead ? 'normal' : 'bold'}>
                              {notification.title}
                            </Typography>
                            {!notification.isRead && (
                              <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(notification.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={notification.type.replace('_', ' ').toUpperCase()}
                        color={
                          notification.type === 'visitor_approved' ? 'success' : 
                          notification.type === 'visitor_rejected' ? 'error' : 'info'
                        }
                        size="small"
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Success Message Snackbar */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={6000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSuccessMessage(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: '350px',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Typography variant="body2" color="primary.main">
              {unreadCount} unread notifications
            </Typography>
          )}
        </Box>
        
        {notifications.slice(0, 5).length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <MenuItem 
              key={notification.id}
              onClick={() => {
                handleNotificationClick(notification.id);
                setNotificationAnchor(null);
              }}
              sx={{ 
                bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                whiteSpace: 'normal',
                py: 1.5
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={notification.isRead ? 'normal' : 'bold'}
                  >
                    {notification.title}
                  </Typography>
                  {!notification.isRead && (
                    <Box sx={{ width: 6, height: 6, bgcolor: 'primary.main', borderRadius: '50%' }} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(notification.timestamp)}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
        
        <Divider />
        <MenuItem onClick={() => {
          setSelectedTab('notifications');
          setNotificationAnchor(null);
        }}>
          <Typography variant="body2" color="primary.main">
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* Account Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem disabled>
          <Box>
            <Typography variant="subtitle2">{user?.name || 'Security Officer'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || 'security@rvce.edu.in'}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          setMenuAnchor(null);
          navigate('/security/profile');
        }}>
          <Person sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={() => {
          setMenuAnchor(null);
          navigate('/security/settings');
        }}>
          <Dashboard sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={async () => {
          setMenuAnchor(null);
          await signOut();
          navigate('/security-login');
        }}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default EnhancedSecurityDashboard;
