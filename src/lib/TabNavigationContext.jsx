import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const ROOT_TABS = ['/', '/search', '/library', '/trending', '/favorites', '/profile'];

const isRootTab = (p) => ROOT_TABS.includes(p);

const TabNavigationContext = createContext(null);

function RouteRecorder() {
  const { recordRoute } = useTabNavigation();
  const location = useLocation();
  useEffect(() => {
    recordRoute(location.pathname);
  }, [location.pathname, recordRoute]);
  return null;
}

export function TabNavigationProvider({ children }) {
  const [tabRoutes, setTabRoutes] = useState(() => {
    const init = {};
    ROOT_TABS.forEach((tab) => (init[tab] = tab));
    return init;
  });
  const activeTabRef = useRef('/');

  const setActiveTab = useCallback((tab) => {
    activeTabRef.current = tab;
  }, []);

  const recordRoute = useCallback((pathname) => {
    if (isRootTab(pathname)) {
      activeTabRef.current = pathname;
      setTabRoutes((prev) => (prev[pathname] === pathname ? prev : { ...prev, [pathname]: pathname }));
    } else {
      const tab = activeTabRef.current;
      setTabRoutes((prev) => (prev[tab] === pathname ? prev : { ...prev, [tab]: pathname }));
    }
  }, []);

  const getTabRoute = useCallback((tab) => tabRoutes[tab] || tab, [tabRoutes]);

  const resetTab = useCallback((tab) => {
    setTabRoutes((prev) => ({ ...prev, [tab]: tab }));
  }, []);

  return (
    <TabNavigationContext.Provider
      value={{ recordRoute, getTabRoute, resetTab, setActiveTab, tabRoutes }}
    >
      <RouteRecorder />
      {children}
    </TabNavigationContext.Provider>
  );
}

export function useTabNavigation() {
  return useContext(TabNavigationContext);
}