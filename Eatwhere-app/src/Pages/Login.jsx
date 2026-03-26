import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { authenticateUser } from '../Services/SearchService';

function Login() {
  // --- STATE ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // --- LOGIC: CHECK PERSISTENT LOGIN ON MOUNT ---
  useEffect(() => {
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    const savedName = localStorage.getItem('userName');
    
    if (savedLoginStatus === 'true' && savedName) {
      setIsLoggedIn(true);
      setUserName(savedName);
    }
  }, []);

  // --- LOGIC: HANDLING LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const user = authenticateUser(email, password);

    if (user) {
      // Set persistence in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', user.name);
      
      // Update local state
      setIsLoggedIn(true);
      setUserName(user.name);
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };

  // --- LOGIC: HANDLING LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <Container maxWidth="sm" sx={styles.container}>
      {isLoggedIn ? (
        /* --- LOGGED IN UI --- */
        <Paper elevation={3} sx={styles.paper}>
          <Box sx={styles.centerBox}>
            <Typography variant="h4" sx={styles.welcomeTitle}>
              Welcome Costant
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              You are currently signed in to your account.
            </Typography>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleLogout}
              sx={styles.logoutBtn}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      ) : (
        /* --- LOGIN FORM UI --- */
        <Paper elevation={3} sx={styles.paper}>
          <Box sx={styles.headerBox}>
            <Typography variant="h4" sx={styles.title}>
              Member Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access your favorite eats and saved locations.
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Box sx={styles.formGap}>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth
                sx={styles.signInBtn}
              >
                Sign In
              </Button>
            </Box>
          </form>
        </Paper>
      )}
    </Container>
  );
}

// --- STYLE CODES ---
const styles = {
  container: { 
    mt: 10 
  },
  paper: { 
    p: 4, 
    borderRadius: 3 
  },
  centerBox: { 
    textAlign: 'center', 
    py: 2 
  },
  headerBox: { 
    textAlign: 'center', 
    mb: 3 
  },
  welcomeTitle: { 
    fontWeight: 'bold', 
    color: '#1976d2', 
    mb: 1 
  },
  title: { 
    fontWeight: 'bold', 
    color: '#1976d2' 
  },
  formGap: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 3 
  },
  signInBtn: { 
    py: 1.5, 
    fontWeight: 'bold', 
    textTransform: 'none', 
    borderRadius: 2 
  },
  logoutBtn: { 
    py: 1.2, 
    px: 6, 
    fontWeight: 'bold', 
    textTransform: 'none', 
    borderRadius: 2 
  }
};

export default Login;