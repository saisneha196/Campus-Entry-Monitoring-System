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
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack, AccessTime, Check, Close } from '@mui/icons-material';

interface Approval {
  id: number;
  name: string;
  department: string;
  purpose: string;
  time: string;
}

const PendingApprovalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApprovals([
        { id: 1, name: 'Alice Johnson', department: 'Computer Science', purpose: 'Meeting with Prof. Kumar', time: '2:30 PM' },
        { id: 2, name: 'Bob Williams', department: 'Electronics', purpose: 'Project Discussion', time: '3:00 PM' },
        { id: 3, name: 'Carol Davis', department: 'Mechanical', purpose: 'Lab Visit', time: '4:15 PM' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = async (id: number) => {
    try {
      // Simulate API call
      console.log('Approving visitor:', id);
      setApprovals(prev => prev.filter(approval => approval.id !== id));
    } catch (error) {
      console.error('Error approving visitor:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      // Simulate API call
      console.log('Rejecting visitor:', id);
      setApprovals(prev => prev.filter(approval => approval.id !== id));
    } catch (error) {
      console.error('Error rejecting visitor:', error);
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
            Pending Approvals
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AccessTime sx={{ fontSize: 32, color: 'warning.main', mr: 2 }} />
            <Typography variant="h4">
              Pending Approvals
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : approvals.length === 0 ? (
            <Alert severity="info">
              No pending approvals at the moment.
            </Alert>
          ) : (
            <List>
              {approvals.map(approval => (
                <ListItem key={approval.id} divider sx={{ py: 2 }}>
                  <ListItemText
                    primary={approval.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {approval.department} • {approval.time}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Purpose: {approval.purpose}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<Check />}
                      onClick={() => handleApprove(approval.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Close />}
                      onClick={() => handleReject(approval.id)}
                    >
                      Reject
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default PendingApprovalsPage;
