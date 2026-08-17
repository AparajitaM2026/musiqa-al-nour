import React, { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'naghma-follows';

const FollowContext = createContext({
  follows: [],
  isFollowing: () => false,
  toggleFollow: () => {},
});

export function FollowProvider({ children }) {
  const [follows, setFollows] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const persist = (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const isFollowing = useCallback((name) => follows.includes(name), [follows]);

  const toggleFollow = useCallback((name) => {
    setFollows((prev) => {
      const next = prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name];
      persist(next);
      return next;
    });
  }, []);

  return (
    <FollowContext.Provider value={{ follows, isFollowing, toggleFollow }}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollows() {
  return useContext(FollowContext);
}