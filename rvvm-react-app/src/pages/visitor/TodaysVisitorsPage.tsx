import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress
} from '@mui/material';
import { ArrowBack, People } from '@mui/icons-material';

interface Visitor {
  id: number;
  name: string;
  department: string;
  status: string;
  time: string;
}

const TodaysVisitorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVisitors([
        { id: 1, name: 'John Doe', department: 'Computer Science', status: 'checked_in', time: '09:30 AM' },
        { id: 2, name: 'Jane Smith', department: 'Electronics', status: 'pending', time: '10:15 AM' },
        { id: 3, name: 'Mike Johnson', department: 'Mechanical', status: 'checked_out', time: '11:00 AM' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked_in': return 'success';
      case 'pending': return 'warning';
      case 'checked_out': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Today's Visitors
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <People sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4">
              Today's Visitors
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {visitors.map(visitor => (
                <ListItem key={visitor.id} divider>
                  <ListItemText
                    primary={visitor.name}
                    secondary={`${visitor.department} • ${visitor.time}`}
                  />
                  <Chip
                    label={visitor.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(visitor.status) as any}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default TodaysVisitorsPage;
