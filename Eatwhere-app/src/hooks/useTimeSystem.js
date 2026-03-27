import { useState, useEffect } from 'react';

const useTimeSystem = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    updateTime();
    // Update every 10 seconds 
    const timer = setInterval(updateTime, 10000); 

    return () => clearInterval(timer);
  }, []);

  const getStoreStatus = (openingHours) => {
    if (!openingHours) {
      return { text: "Closed", color: "error" };
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Singapore',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });

    const parts = formatter.formatToParts(currentTime);
    const day = parts.find(p => p.type === 'weekday').value;
    const hourNow = parseInt(parts.find(p => p.type === 'hour').value);
    const minNow = parseInt(parts.find(p => p.type === 'minute').value);
    const nowInMins = hourNow * 60 + minNow;

    const todayHours = openingHours[day];
    if (!todayHours || todayHours.toLowerCase() === "closed") {
      return { text: "Closed", color: "error" };
    }

    if (todayHours.toLowerCase().includes("24 hours") || todayHours.toLowerCase().includes("24hrs")) {
      return { text: "Open", color: "success" };
    }

    const parseToMins = (timeStr) => {
      if (!timeStr) return 0;
      const match = timeStr.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
      if (!match) return 0;

      let [_, hours, mins, modifier] = match;
      hours = parseInt(hours);
      mins = mins ? parseInt(mins) : 0;

      if (modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12;
      if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

      return hours * 60 + mins;
    };

    const timeRange = todayHours.split('-').map(s => s.trim());
    if (timeRange.length !== 2) return { text: "Closed", color: "error" };

    const start = parseToMins(timeRange[0]);
    const end = parseToMins(timeRange[1]);

    if (nowInMins >= start && nowInMins < end) {
      if (nowInMins >= end - 30) return { text: "Closing Soon", color: "warning" };
      return { text: "Open", color: "success" };
    }

    if (nowInMins >= start - 30 && nowInMins < start) {
      return { text: "Opening Soon", color: "warning" };
    }

    return { text: "Closed", color: "error" };
  };

  // FIX: You MUST return currentTime here to trigger re-renders in Home.jsx
  return { currentTime, getStoreStatus };
};

export default useTimeSystem;