import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, Container, 
  CardMedia, Chip, Divider 
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import stores from '../Database/Store.json'; 
import { getStoreStatus } from '../Services/SearchService';

function TopPicks() {
  const [failedImages, setFailedImages] = useState({});

  // --- LOGIC: SORT BY RATING AND GET TOP 5 ---
  const topRatedStores = [...stores]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const currentDay = new Intl.DateTimeFormat('en-US', { 
    timeZone: 'Asia/Singapore', 
    weekday: 'long' 
  }).format(new Date());

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#f9b70f' }}>
        Top Picks
      </Typography>

      {/* --- RESULTS AREA --- */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 3 }}>
        {topRatedStores.map((store) => {
          const status = getStoreStatus(store.openingHours);
          
          const isAlways24h = store.openingHours && 
            Object.values(store.openingHours).every(h => h.toLowerCase().includes("24 hours"));

          return (
            <Card 
              key={store.id} 
              elevation={3} 
              sx={{ 
                borderRadius: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                position: 'relative', // For the badge
                overflow: 'visible' 
              }}
            >
              {/* --- TOP RATED BADGE --- */}
              <Box sx={{
                position: 'absolute',
                top: -10,
                right: 15,
                bgcolor: '#ffa000',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 'bold',
                fontSize: '0.75rem',
                zIndex: 10,
                boxShadow: 2
              }}>
                TOP RATED
              </Box>

              {/* --- IMAGE SECTION (MIRRORED FROM HOME.JSX) --- */}
              {!failedImages[store.id] && store.imagePath ? (
                <CardMedia 
                  component="img" 
                  height="180" 
                  image={store.imagePath} 
                  onError={() => setFailedImages(prev => ({...prev, [store.id]: true}))} 
                />
              ) : (
                <Box sx={{ height: 180, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Image unable to load</Typography>
                </Box>
              )}

              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Chip label={status.text} color={status.color} size="small" sx={{ fontWeight: 'bold' }} />
                  
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {isAlways24h && (
                      <Chip 
                        label="24 HRS" 
                        size="small" 
                        sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }} 
                      />
                    )}

                    {Array.isArray(store.cuisine) ? (
                      store.cuisine.map((c) => (
                        <Typography key={c} variant="caption" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', px: 1, borderRadius: 1, fontWeight: 'bold' }}>
                          {c}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="caption" sx={{ bgcolor: '#e3f2fd', color: '#5d6165', px: 1, borderRadius: 1, fontWeight: 'bold' }}>
                        {store.cuisine}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 800 }}>{store.name}</Typography>
                <Typography variant="body2" color="text.secondary">📍 {store.location}</Typography>
                
                {/* Rating display matching the top-right star vibe */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <StarIcon sx={{ color: '#ffa000', fontSize: '1.2rem' }} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#ffa000' }}>
                        {store.rating}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AccessTimeIcon fontSize="small" /> Weekly Hours (SGT)
                </Typography>

                {store.openingHours && typeof store.openingHours === 'object' ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {Object.entries(store.openingHours).map(([day, hours]) => (
                      <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ 
                            fontWeight: day === currentDay ? 'bold' : 'normal', 
                            color: day === currentDay ? 'primary.main' : 'text.secondary' 
                        }}>
                          {day} {day === currentDay && "(Today)"}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                            fontWeight: day === currentDay ? 'bold' : 'normal',
                            color: hours.toLowerCase().includes("24 hours") ? 'success.main' : 'inherit'
                        }}>
                          {hours}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : <Typography variant="caption" color="error">Hours not set correctly.</Typography>}
              </CardContent>

              <Box sx={{ p: 2, mt: 'auto' }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  href={store.mapLink} 
                  target="_blank" 
                  sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, bgcolor: '#ffa000' }}
                >
                  Open Google Maps
                </Button>
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}

export default TopPicks;