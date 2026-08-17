import { useState, useCallback } from 'react';

const STORAGE_KEY = 'naghma-saved-tracks';

export function useFavorites() {
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const isFavorite = (id) => saved.includes(id);

  const toggleFavorite = useCallback((id) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { saved, isFavorite, toggleFavorite };
}