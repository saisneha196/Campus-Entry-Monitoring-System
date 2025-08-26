import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  FlashOn,
  LocalTaxi,
  AccessTime,
  People,
  AccountCircle,
  ExitToApp
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactElement;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, subtitle, icon, onClick }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box sx={{ color: 'primary.main', mb: 2, fontSize: 48 }}>
          {icon}
        </Box>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleMenuClose();
    navigate('/login');
  };

  const dashboardItems = [
    {
      title: 'Quick Check-In',
      subtitle: 'Fast track visitor entry',
      icon: <FlashOn />,
      onClick: () => navigate('/quick-checkin')
    },
    {
      title: 'Cab Entry',
      subtitle: 'Register campus cabs',
      icon: <LocalTaxi />,
      onClick: () => navigate('/cab-entry')
    },
    {
      title: 'Pending Approvals',
      subtitle: 'View pending requests',
      icon: <AccessTime />,
      onClick: () => navigate('/pending-approvals')
    },
    {
      title: "Today's Visitors",
      subtitle: 'View active visitors',
      icon: <People />,
      onClick: () => navigate('/todays-visitors')
    }
  ];

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            RVCE Visitor Management
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.name || user?.email}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleSignOut}>
              <ExitToApp sx={{ mr: 1 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Hero Image/Carousel placeholder */}
        <Box
          sx={{
            height: 200,
            backgroundColor: 'primary.main',
            borderRadius: 2,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
          }}
        >
          <Typography variant="h4" color="white" textAlign="center">
            Welcome to RVCE Campus
          </Typography>
        </Box>

        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 3,
            mb: 4
          }}
        >
          {dashboardItems.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              onClick={item.onClick}
            />
          ))}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ mr: 2, mb: 2 }}
              onClick={() => navigate('/visitor-registration')}
            >
              Register New Visitor
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ mr: 2, mb: 2 }}
              onClick={() => navigate('/todays-visitors')}
            >
              View Reports
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;
