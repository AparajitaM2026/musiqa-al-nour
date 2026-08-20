import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

const THRESHOLD = 70;
const MAX_PULL = 120;

/**
 * Additive pull-to-refresh for touch devices. Wraps page content and, when
 * the nearest scrollable ancestor is at the top, grows a refresh indicator on
 * swipe-down; calls `onRefresh` when released past the threshold. No effect on
 * mouse/desktop interactions.
 */
export default function PullToRefresh({ onRefresh, children }) {
  const wrapRef = useRef(null);
  const scrollRef = useRef(null);
  const startYRef = useRef(null);
  const activeRef = useRef(false);
  const pullRef = useRef(0);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let node = el.parentElement;
    while (node) {
      const s = window.getComputedStyle(node);
      if (/(auto|scroll)/.test(s.overflowY)) {
        scrollRef.current = node;
        break;
      }
      node = node.parentElement;
    }
  }, []);

  const onTouchStart = (e) => {
    if (refreshing) return;
    const sc = scrollRef.current;
    if (!sc || sc.scrollTop > 0) {
      activeRef.current = false;
      return;
    }
    startYRef.current = e.touches[0].clientY;
    activeRef.current = true;
  };

  const onTouchMove = (e) => {
    if (!activeRef.current || startYRef.current == null) return;
    const dy = e.touches[0].clientY - startYRef.current;
    if (dy <= 0) {
      pullRef.current = 0;
      setPull(0);
      return;
    }
    const dist = Math.min(dy * 0.5, MAX_PULL);
    pullRef.current = dist;
    setPull(dist);
  };

  const onTouchEnd = useCallback(async () => {
    if (!activeRef.current) return;
    activeRef.current = false;
    startYRef.current = null;
    if (pullRef.current >= THRESHOLD) {
      setRefreshing(true);
      setPull(THRESHOLD);
      try {
        await onRefresh?.();
      } finally {
        setRefreshing(false);
        setPull(0);
        pullRef.current = 0;
      }
    } else {
      setPull(0);
      pullRef.current = 0;
    }
  }, [onRefresh]);

  const progress = Math.min(pull / THRESHOLD, 1);
  const showIndicator = pull > 0 || refreshing;

  return (
    <div
      ref={wrapRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {showIndicator && (
        <div
          className="flex items-center justify-center overflow-hidden text-primary"
          style={{ height: refreshing ? THRESHOLD : pull }}
        >
          {refreshing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <ChevronDown
              className="w-6 h-6 transition-transform"
              style={{ transform: `rotate(${progress * 180}deg)` }}
            />
          )}
        </div>
      )}
      {children}
    </div>
  );
}