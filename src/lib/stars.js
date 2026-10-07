import { useState, useEffect } from 'react';
import { storage } from './storage.js';

const STARS_KEY = 'stars:items';
const listeners = new Set();

export function onStarsChanged(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.warn('star listener error', e);
    }
  });
}

export function useStars() {
  const [stars, setStars] = useState(() => getStars());
  useEffect(() => {
    return onStarsChanged(() => setStars(getStars()));
  }, []);
  return stars;
}

export function getStars() {
  return storage.get(STARS_KEY, {});
}

export function isStarred(id) {
  const s = getStars();
  return !!s[id];
}

export function toggleStar(id, item) {
  let isNowStarred = false;
  storage.update(STARS_KEY, {}, (s) => {
    if (s[id]) {
      delete s[id];
    } else {
      s[id] = item;
      isNowStarred = true;
    }
    return s;
  });
  notifyListeners();
  return isNowStarred;
}

export function getStarredItems(category = 'all') {
  const all = Object.values(getStars());
  if (category === 'vocab') return all.filter(i => String(i.id).startsWith('vocab:'));
  if (category === 'ueb') return all.filter(i => String(i.id).startsWith('ueb:'));
  if (category === 'komm') return all.filter(i => String(i.id).startsWith('komm:'));
  if (category === 'grammar') return all.filter(i => !String(i.id).startsWith('vocab:') && !String(i.id).startsWith('ueb:') && !String(i.id).startsWith('komm:'));
  return all;
}

// Los favoritos de vocabulario se repasan juntos, aunque se marcaran desde
// formatos distintos. Cada tarjeta conserva _deToEs para mantener su sentido.
export function groupStarredVocab(items) {
  return items?.length ? [{ mode: 'starred-mixed', dir: null, items: [...items] }] : [];
}
