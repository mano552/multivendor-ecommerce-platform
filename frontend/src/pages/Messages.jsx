import { useEffect, useState } from "react";
import api from "../api/axios";
import ChatWindow from "../components/ChatWindow";

const Messages = () => {
  const [threads, setThreads] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/messages/threads").then(({ data }) => {
      setThreads(data);
      if (data.length) setActive(data[0]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : threads.length === 0 ? (
        <p className="text-gray-500">No conversations yet. Message a seller from a product page to start one.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-md divide-y">
            {threads.map((t) => (
              <button
                key={`${t.otherUser.id}-${t.product?.id || "none"}`}
                onClick={() => setActive(t)}
                className={`w-full text-left p-3 hover:bg-gray-50 ${
                  active?.otherUser.id === t.otherUser.id && active?.product?.id === t.product?.id ? "bg-primary/5" : ""
                }`}
              >
                <p className="font-medium text-sm">{t.otherUser.fullName}</p>
                {t.product && <p className="text-xs text-gray-400">about {t.product.name}</p>}
                <p className="text-sm text-gray-500 truncate">{t.lastMessage}</p>
              </button>
            ))}
          </div>
          <div className="md:col-span-2">
            {active && (
              <ChatWindow
                otherUserId={active.otherUser.id}
                otherUserName={active.otherUser.fullName}
                productId={active.product?.id || null}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
