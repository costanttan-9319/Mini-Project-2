import React, { useState, useEffect } from 'react';
import { 
  Autocomplete, TextField, Button, Box, Typography, Card, 
  CardContent, IconButton, Tooltip, CardMedia, Chip, Divider 
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino'; 
import AccessTimeIcon from '@mui/icons-material/AccessTime'; 

// Custom hook time system
import useTimeSystem from '../hooks/useTimeSystem';
import { 
  getSortedCountries, getSortedLocations, getSortedCuisines, 
  getFilteredStores, getRandomStore 
} from '../Services/SearchService';

function Home() {
  // This ensures the Home component re-renders every time the hook's timer ticks.
  const { currentTime, getStoreStatus } = useTimeSystem();

  const [countries, setCountries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [results, setResults] = useState([]);
  const [failedImages, setFailedImages] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    setCountries(getSortedCountries() || []);
    setLocations(getSortedLocations() || []);
    setCuisines(getSortedCuisines() || []);

    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const savedName = localStorage.getItem('userName');
    if (loggedInStatus === 'true' && savedName) {
      setUser(savedName);
    }
  }, []);

  const handleSearch = () => {
    const filtered = getFilteredStores(selectedCountry, selectedLocation, selectedCuisine);
    
    if (filtered === "ERROR_NO_COUNTRY") {
      alert("Please fill in the Country searchbar!");
      return;
    }
    if (filtered === "ERROR_NO_LOCATION") {
      alert("Please fill in the Location searchbar!");
      return;
    }
    
    setResults(filtered || []);
  };

  const handleRandom = () => {
    const filtered = getFilteredStores(selectedCountry, selectedLocation, selectedCuisine || "All");
    
    if (filtered === "ERROR_NO_COUNTRY") {
      alert("Please fill in the Country before hitting the dice!");
      return;
    }
    if (filtered === "ERROR_NO_LOCATION") {
      alert("Please fill in the Location before hitting the dice!");
      return;
    }

    const luckyPick = getRandomStore(filtered);
    if (luckyPick) {
      setResults([luckyPick]); 
    } else {
      alert("No outlets found for this selection!");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {user && (
        <Typography 
          variant="body2" 
          sx={{ mt: -5, ml: -2, mb: 8, fontWeight: 'bold', color: 'text.secondary' }}
        >
          Welcome, {user}!
        </Typography>
      )}

      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#1976d2' }}>
        Eatwhere Search
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', flexWrap: 'wrap' }}>
        <Autocomplete options={countries} sx={{ width: 180 }} renderInput={(params) => <TextField {...params} label="Country" />} value={selectedCountry} onChange={(e, v) => setSelectedCountry(v)} />
        <Autocomplete options={locations} sx={{ width: 180 }} renderInput={(params) => <TextField {...params} label="Location" />} value={selectedLocation} onChange={(e, v) => setSelectedLocation(v)} />
        <Autocomplete options={cuisines} sx={{ width: 180 }} renderInput={(params) => <TextField {...params} label="Cuisine" />} value={selectedCuisine} onChange={(e, v) => setSelectedCuisine(v)} />
        <Button variant="contained" onClick={handleSearch} sx={{ fontWeight: 'bold' }}>Search</Button>
        <Tooltip title="Random Pick!">
          <IconButton color="secondary" onClick={handleRandom} sx={{ border: '1px solid', borderRadius: 1 }}>
            <CasinoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 3 }}>
        {results?.map((store) => {
          // Now this re-runs automatically whenever currentTime changes
          const status = getStoreStatus(store.openingHours);
          
          // Use the currentTime from the hook for the "Today" highlight
          const currentDay = new Intl.DateTimeFormat('en-US', { 
            timeZone: 'Asia/Singapore', 
            weekday: 'long' 
          }).format(currentTime);

          const isAlways24h = store.openingHours && 
            Object.values(store.openingHours).every(h => h.toLowerCase().includes("24 hours"));

          return (
            <Card key={store.id} elevation={3} sx={{ borderRadius: 4, display: 'flex', flexDirection: 'column' }}>
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
                      <Typography variant="caption" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', px: 1, borderRadius: 1, fontWeight: 'bold' }}>
                        {store.cuisine}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 800 }}>{store.name}</Typography>
                <Typography variant="body2" color="text.secondary">📍 {store.location}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#ffa000', mt: 1 }}>⭐ {store.rating}</Typography>

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
                <Button fullWidth variant="contained" href={store.mapLink} target="_blank" sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}>
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

export default Home;