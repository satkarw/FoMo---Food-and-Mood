"use client";

import { createContext, useContext, useState, useCallback } from "react";
import NotificationToast from "@/app/components/NotificationToast";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const notify = useCallback((message, type = "success") => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 1000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && <NotificationToast {...notification} />}
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  return useContext(NotificationContext);
}
