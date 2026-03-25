import React, { createContext, useEffect, useMemo, useState, useContext } from 'react';

const CompareContext = createContext();
const AI_COMPARE_LIMIT = 3;
const AI_COMPARE_WINDOW_MS = 60 * 1000;
const AI_COMPARE_STORAGE_KEY = 'aiva-ai-compare-timestamps';

export const useCompare = () => {
  return useContext(CompareContext);
};

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [aiCompareTimestamps, setAiCompareTimestamps] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const savedTimestamps = JSON.parse(window.localStorage.getItem(AI_COMPARE_STORAGE_KEY) || '[]');
      const now = Date.now();
      return Array.isArray(savedTimestamps)
        ? savedTimestamps.filter(timestamp => now - timestamp < AI_COMPARE_WINDOW_MS)
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(AI_COMPARE_STORAGE_KEY, JSON.stringify(aiCompareTimestamps));
  }, [aiCompareTimestamps]);

  useEffect(() => {
    if (aiCompareTimestamps.length === 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      setAiCompareTimestamps(prevTimestamps => {
        const nextTimestamps = prevTimestamps.filter(timestamp => now - timestamp < AI_COMPARE_WINDOW_MS);
        return nextTimestamps.length === prevTimestamps.length ? prevTimestamps : nextTimestamps;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [aiCompareTimestamps.length]);

  const compareCooldownSeconds = useMemo(() => {
    if (aiCompareTimestamps.length < AI_COMPARE_LIMIT) {
      return 0;
    }

    const oldestActiveTimestamp = aiCompareTimestamps[0];
    return Math.max(0, Math.ceil((oldestActiveTimestamp + AI_COMPARE_WINDOW_MS - currentTime) / 1000));
  }, [aiCompareTimestamps, currentTime]);

  const isAiCompareRateLimited = compareCooldownSeconds > 0;

  const addToCompare = (device) => {
    setCompareList(prevList => {
      if (prevList.find(d => d.id === device.id)) {
        return prevList; // Already in list
      }
      if (prevList.length < 2) {
        return [...prevList, device];
      }
      return prevList; // List is full
    });
  };

  const removeFromCompare = (deviceId) => {
    setCompareList(prevList => prevList.filter(d => d.id !== deviceId));
  };

  const recordAiCompareRequest = () => {
    const now = Date.now();
    setCurrentTime(now);

    setAiCompareTimestamps(prevTimestamps => {
      const activeTimestamps = prevTimestamps.filter(timestamp => now - timestamp < AI_COMPARE_WINDOW_MS);
      return [...activeTimestamps, now];
    });
  };

  const value = {
    compareList,
    addToCompare,
    removeFromCompare,
    isAiCompareRateLimited,
    compareCooldownSeconds,
    recordAiCompareRequest,
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
};
