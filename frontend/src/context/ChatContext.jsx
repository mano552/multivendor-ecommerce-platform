import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messagesByThread, setMessagesByThread] = useState({}); // key: `${otherUserId}-${productId||'none'}`
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user || !token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      return;
    }

    const socket = io("/", { auth: { token }, path: "/socket.io" });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("new_message", (message) => {
      const otherId = message.senderId === user.id ? message.receiverId : message.senderId;
      const key = `${otherId}-${message.productId || "none"}`;
      setMessagesByThread((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), message],
      }));
      if (message.senderId !== user.id) setUnreadCount((c) => c + 1);
    });

    return () => socket.disconnect();
  }, [user]);

  const sendMessage = (receiverId, productId, content) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject(new Error("Not connected"));
      socketRef.current.emit("send_message", { receiverId, productId, content }, (res) => {
        if (res?.ok) resolve(res.message);
        else reject(new Error(res?.error || "Failed to send"));
      });
    });
  };

  const loadThreadKey = (otherUserId, productId) => `${otherUserId}-${productId || "none"}`;

  const setThreadMessages = (otherUserId, productId, messages) => {
    setMessagesByThread((prev) => ({ ...prev, [loadThreadKey(otherUserId, productId)]: messages }));
  };

  return (
    <ChatContext.Provider
      value={{ connected, messagesByThread, sendMessage, loadThreadKey, setThreadMessages, unreadCount, setUnreadCount }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
