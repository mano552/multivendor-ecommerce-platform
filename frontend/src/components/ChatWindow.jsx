import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const ChatWindow = ({ otherUserId, otherUserName, productId = null }) => {
  const { user } = useAuth();
  const { messagesByThread, sendMessage, loadThreadKey, setThreadMessages, connected } = useChat();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const key = loadThreadKey(otherUserId, productId);
  const messages = messagesByThread[key] || [];

  useEffect(() => {
    setLoading(true);
    api.get(`/messages/conversation/${otherUserId}${productId ? `?productId=${productId}` : ""}`)
      .then(({ data }) => setThreadMessages(otherUserId, productId, data))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserId, productId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const content = text;
    setText("");
    try {
      await sendMessage(otherUserId, productId, content);
    } catch {
      // fallback to REST if socket isn't connected
      await api.post("/messages", { receiverId: otherUserId, productId, content });
      const { data } = await api.get(`/messages/conversation/${otherUserId}${productId ? `?productId=${productId}` : ""}`);
      setThreadMessages(otherUserId, productId, data);
    }
  };

  return (
    <div className="border rounded-md flex flex-col h-80">
      <div className="px-3 py-2 border-b flex items-center justify-between">
        <span className="font-medium text-sm">{otherUserName}</span>
        <span className={`text-xs ${connected ? "text-green-600" : "text-gray-400"}`}>
          {connected ? "● online" : "connecting..."}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-400">Say hello 👋</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.senderId === user.id ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                  m.senderId === user.id ? "bg-primary text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2 p-2 border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-md px-3 py-1.5 text-sm"
        />
        <button className="bg-primary text-white px-3 rounded-md"><FiSend size={16} /></button>
      </form>
    </div>
  );
};

export default ChatWindow;
