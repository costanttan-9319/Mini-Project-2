import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';

function Navbar() {
  return (
    <AppBar position="static" sx={{ bgcolor: '#ffffff', color: '#333', boxShadow: 1 }}>
      <Toolbar>
        {/* Logo Section */}
        <RestaurantIcon sx={{ color: '#1976d2', mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#1976d2' }}>
          Eatwhere
        </Typography>

        {/* Navigation Links */}
        <Box>
          <Button color="inherit" component={Link} to="/" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/toppicks" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
            Top Picks
          </Button>
          <Button variant="contained" component={Link} to="/login" sx={{ ml: 2, textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}>
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;