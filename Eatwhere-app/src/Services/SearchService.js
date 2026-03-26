import stores from '../Database/Store.json';
import members from '../Database/Member.json';
import locations from '../Database/Location.json';
import cuisines from '../Database/Cuisine.json';
import countries from '../Database/Country.json';

// --- 1. DROPDOWN HELPERS ---
export const getSortedLocations = () => [...locations].sort();
export const getSortedCountries = () => [...countries].sort();
export const getSortedCuisines = () => ["All", ...cuisines.filter(c => c !== "All").sort()];

// --- 2. THE FILTER ENGINE ---
export const getFilteredStores = (selectedCountry, selectedLocation, selectedCuisine) => {
  if (!selectedCountry) return "ERROR_NO_COUNTRY";
  if (!selectedLocation) return "ERROR_NO_LOCATION";

  const filtered = stores.filter((s) => {
    const matchCountry = s.country?.toLowerCase() === selectedCountry?.toLowerCase();
    const matchLocation = s.location?.toLowerCase() === selectedLocation?.toLowerCase();
    
    const isAll = !selectedCuisine || selectedCuisine === "All";
    
    let matchCuisine = false;
    if (isAll) {
      matchCuisine = true;
    } else if (Array.isArray(s.cuisine)) {
      matchCuisine = s.cuisine.some(c => c.toLowerCase() === selectedCuisine.toLowerCase());
    } else {
      matchCuisine = s.cuisine?.toLowerCase() === selectedCuisine?.toLowerCase();
    }

    return matchCountry && matchLocation && matchCuisine;
  });

  return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
};

// --- 3. THE DICE (Randomize Logic) ---
export const getRandomStore = (list) => {
  if (!list || list.length === 0 || typeof list === "string") return null;
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};

// --- 4. AUTH ---
export const authenticateUser = (e, p) => 
  members.find(m => m.email.toLowerCase() === e.toLowerCase() && m.password === p) || null;