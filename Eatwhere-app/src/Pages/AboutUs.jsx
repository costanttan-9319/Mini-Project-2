import React from 'react';
import { Box, Typography, Container, Paper, Grid, Divider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GroupsIcon from '@mui/icons-material/Groups';

function AboutUs() {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: '#f9f9f9' }}>
        
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
            About Eatwhere
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your trusted companion for discovering the best eats in Singapore and beyond.
          </Typography>
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* Content Grid */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <RestaurantIcon color="primary" fontSize="large" />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Our Mission</Typography>
                <Typography variant="body2" color="text.secondary">
                  To simplify the "What should I eat?" dilemma by providing a fair and transparent 
                  search experience based on real ratings and locations.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <InfoIcon color="primary" fontSize="large" />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Fair & Square</Typography>
                <Typography variant="body2" color="text.secondary">
                  Our unique algorithm ensures that while top-rated spots get visibility, 
                  every merchant gets a fair chance through our randomized secondary sorting.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, bgcolor: '#ffffff', p: 3, borderRadius: 2, border: '1px solid #eee' }}>
              <GroupsIcon color="primary" fontSize="large" />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>The Team</Typography>
                <Typography variant="body2" color="text.secondary">
                  Eatwhere was developed as a mini-project to showcase the power of React and 
                  MUI in creating meaningful, data-driven user experiences.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Footer Note */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="caption" color="text.disabled">
            © 2026 Eatwhere App Project. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default AboutUs;