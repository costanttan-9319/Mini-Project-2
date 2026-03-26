import stores from '../Database/Store.json';
import members from '../Database/Member.json';
import locations from '../Database/Location.json';
import cuisines from '../Database/Cuisine.json';
import countries from '../Database/Country.json';

// --- 1. DROPDOWN HELPERS ---
export const getSortedLocations = () => [...locations].sort();
export const getSortedCountries = () => [...countries].sort();
export const getSortedCuisines = () => ["All", ...cuisines.filter(c => c !== "All").sort()];

// --- 2. LIVE STATUS ENGINE (Singapore GMT+8) ---
export const getStoreStatus = (openingHours) => {
  if (!openingHours || typeof openingHours !== 'object') return { text: "Closed", color: "error" };

  const now = new Date();
  const options = { timeZone: 'Asia/Singapore', weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: false };
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(now);
  
  const day = parts.find(p => p.type === 'weekday').value;
  const hour = parseInt(parts.find(p => p.type === 'hour').value);
  const min = parseInt(parts.find(p => p.type === 'minute').value);
  const nowInMins = hour * 60 + min;

  const todayHours = openingHours[day];
  if (!todayHours) return { text: "Closed", color: "error" };

  // --- NEW: 24 HOURS GUARD ---
  // If the text says "24 hours", return OPEN immediately and skip time calculation
  const normalizedHours = todayHours.toLowerCase();
  if (normalizedHours.includes("24 hours") || normalizedHours.includes("24hrs")) {
    return { text: "Open", color: "success" };
  }

  if (normalizedHours === "closed") return { text: "Closed", color: "error" };

  const parseToMins = (timeStr) => {
    try {
      const [time, modifier] = timeStr.trim().split(' ');
      let [h, m] = time.split(':').map(Number);
      
      // Ensures "9 AM" works as "9:00 AM"
      const minutes = m || 0;
      
      if (modifier === 'PM' && h !== 12) h += 12;
      if (modifier === 'AM' && h === 12) h = 0;
      return h * 60 + minutes;
    } catch (e) { return 0; }
  };

  const [startStr, endStr] = todayHours.split(' - ');
  const start = parseToMins(startStr);
  const end = parseToMins(endStr);

  if (nowInMins >= start - 30 && nowInMins < start) return { text: "Opening Soon", color: "warning" };
  if (nowInMins >= end - 30 && nowInMins < end) return { text: "Closing Soon", color: "warning" };
  if (nowInMins >= start && nowInMins < end) return { text: "Open", color: "success" };
  
  return { text: "Closed", color: "error" };
};

// --- 3. THE FILTER ENGINE (Supports Array & Strings) ---
export const getFilteredStores = (selectedCountry, selectedLocation, selectedCuisine) => {
  if (!selectedCountry) return "ERROR_NO_COUNTRY";
  if (!selectedLocation) return "ERROR_NO_LOCATION";

  const filtered = stores.filter((s) => {
    const matchCountry = s.country?.toLowerCase() === selectedCountry?.toLowerCase();
    const matchLocation = s.location?.toLowerCase() === selectedLocation?.toLowerCase();
    
    const isAll = !selectedCuisine || selectedCuisine === "All";
    
    // Checks if the selected cuisine is in the array OR matches the string
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

// --- 4. THE DICE (Randomize Logic) ---
export const getRandomStore = (list) => {
  if (!list || list.length === 0 || typeof list === "string") return null;
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};

// --- 5. AUTH ---
export const authenticateUser = (e, p) => members.find(m => m.email.toLowerCase() === e.toLowerCase() && m.password === p) || null;