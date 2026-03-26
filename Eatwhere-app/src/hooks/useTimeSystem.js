import { useState, useEffect } from 'react';

const useTimeSystem = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Updates every 1 minute

    return () => clearInterval(timer);
  }, []);

  const getStoreStatus = (openingHours) => {
    if (!openingHours || typeof openingHours !== 'object') {
      return { text: "Closed", color: "error" };
    }

    const options = { 
      timeZone: 'Asia/Singapore', 
      weekday: 'long', 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: false 
    };
    
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(currentTime);
    
    const day = parts.find(p => p.type === 'weekday').value;
    const hour = parseInt(parts.find(p => p.type === 'hour').value);
    const min = parseInt(parts.find(p => p.type === 'minute').value);
    const nowInMins = hour * 60 + min;

    const todayHours = openingHours[day];
    if (!todayHours) return { text: "Closed", color: "error" };

    const normalizedHours = todayHours.toLowerCase();
    if (normalizedHours.includes("24 hours") || normalizedHours.includes("24hrs")) {
      return { text: "Open", color: "success" };
    }

    if (normalizedHours === "closed") return { text: "Closed", color: "error" };

    const parseToMins = (timeStr) => {
      try {
        const [time, modifier] = timeStr.trim().split(' ');
        let [h, m] = time.split(':').map(Number);
        const minutes = m || 0;
        
        if (modifier === 'PM' && h !== 12) h += 12;
        if (modifier === 'AM' && h === 12) h = 0;
        return h * 60 + minutes;
      } catch (e) { 
        return 0; 
      }
    };

    const [startStr, endStr] = todayHours.split(' - ');
    const start = parseToMins(startStr);
    const end = parseToMins(endStr);

    if (nowInMins >= start - 30 && nowInMins < start) return { text: "Opening Soon", color: "warning" };
    if (nowInMins >= end - 30 && nowInMins < end) return { text: "Closing Soon", color: "warning" };
    if (nowInMins >= start && nowInMins < end) return { text: "Open", color: "success" };
    
    return { text: "Closed", color: "error" };
  };

  return { getStoreStatus };
};

export default useTimeSystem;