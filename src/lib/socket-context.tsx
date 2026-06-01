"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io, type Socket } from "socket.io-client";
import { BASE_URL, TOKEN_EVENT, tokenStorage } from "@/api/api-client";
import { useAuth } from "@/lib/auth-context";

function getSocketUrl(): string {
  const apiBase = BASE_URL.replace(/\/+$/, "");
  const origin = apiBase.replace(/\/api$/i, "");
  return `${origin}/ws`;
}

type SocketHandler = (...args: unknown[]) => void;

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  on: (event: string, handler: SocketHandler) => void;
  off: (event: string, handler: SocketHandler) => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

function attachStoredListeners(
  instance: Socket,
  listeners: Map<string, Set<SocketHandler>>,
) {
  listeners.forEach((handlers, event) => {
    handlers.forEach((handler) => {
      instance.on(event, handler);
    });
  });
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Map<string, Set<SocketHandler>>>(new Map());

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSocket(null);
    setIsConnected(false);
  }, []);

  const connectSocket = useCallback(() => {
    const token = tokenStorage.get();
    if (!token) {
      disconnectSocket();
      return;
    }

    disconnectSocket();

    const instance = io(getSocketUrl(), {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    instance.on("connect", () => setIsConnected(true));
    instance.on("disconnect", () => setIsConnected(false));

    attachStoredListeners(instance, listenersRef.current);
    socketRef.current = instance;
    setSocket(instance);
  }, [disconnectSocket]);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    connectSocket();

    const handleTokenChange = (event: Event) => {
      const hasToken = (event as CustomEvent<boolean>).detail;
      if (!hasToken) {
        disconnectSocket();
        return;
      }
      connectSocket();
    };

    window.addEventListener(TOKEN_EVENT, handleTokenChange as EventListener);
    return () => {
      window.removeEventListener(TOKEN_EVENT, handleTokenChange as EventListener);
      disconnectSocket();
    };
  }, [isAuthenticated, connectSocket, disconnectSocket]);

  const on = useCallback((event: string, handler: SocketHandler) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event)!.add(handler);
    socketRef.current?.on(event, handler);
  }, []);

  const off = useCallback((event: string, handler: SocketHandler) => {
    listenersRef.current.get(event)?.delete(handler);
    socketRef.current?.off(event, handler);
  }, []);

  const value = useMemo(
    () => ({
      socket,
      isConnected,
      on,
      off,
    }),
    [socket, isConnected, on, off],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
}
