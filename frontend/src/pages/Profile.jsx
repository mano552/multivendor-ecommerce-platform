import { useEffect, useState } from "react";
import { FiUser, FiBox, FiRefreshCw, FiInbox, FiTruck, FiCreditCard, FiMapPin, FiLogOut, FiCamera, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import AddCardForm from "../components/AddCardForm";
import AddressManager from "../components/AddressManager";

const tabs = [
  { key: "profile", label: "Profile", icon: FiUser },
  { key: "orders", label: "Orders", icon: FiBox },
  { key: "refunds", label: "Refunds", icon: FiRefreshCw },
  { key: "inbox", label: "Inbox", icon: FiInbox },
  { key: "track", label: "Track Order", icon: FiTruck },
  { key: "payment", label: "Payment Methods", icon: FiCreditCard },
  { key: "address", label: "Address", icon: FiMapPin },
];

const ProfileTab = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ fullName: "", phone: "", zipCode: "", address1: "", address2: "" });
  const [preview, setPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        zipCode: user.zipCode || "",
        address1: user.address1 || "",
        address2: user.address2 || "",
      });
    }
  }, [user]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (avatarFile) data.append("avatar", avatarFile);
    const { data: updated } = await api.put("/auth/me", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex flex-col items-center mb-8">
        <label className="relative cursor-pointer">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 bg-gray-100 flex items-center justify-center">
            {preview || user?.avatar ? (
              <img src={preview || user.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <FiUser size={36} className="text-gray-400" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full">
            <FiCamera size={14} />
          </div>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>

      <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full border rounded-md px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email Address</label>
          <input value={user?.email || ""} disabled className="w-full border rounded-md px-3 py-2 mt-1 bg-gray-100" />
        </div>
        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded-md px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Zip Code</label>
          <input
            value={form.zipCode}
            onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
            className="w-full border rounded-md px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Address 1</label>
          <input
            value={form.address1}
            onChange={(e) => setForm({ ...form, address1: e.target.value })}
            className="w-full border rounded-md px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Address 2</label>
          <input
            value={form.address2}
            onChange={(e) => setForm({ ...form, address2: e.target.value })}
            className="w-full border rounded-md px-3 py-2 mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <button className="bg-primary text-white px-6 py-2 rounded-md font-medium">Save Changes</button>
          {saved && <span className="text-green-600 text-sm ml-3">Saved!</span>}
        </div>
      </form>
    </div>
  );
};

const OrdersTab = ({ onRequestRefund, onTrack }) => {
  const [orders, setOrders] = useState([]);
  const load = () => api.get("/orders/my").then(({ data }) => setOrders(data));
  useEffect(() => { load(); }, []);
  if (!orders.length) return <p className="text-gray-500">No orders yet.</p>;
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="border rounded-md p-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Order #{o.id}</span>
            <span className="capitalize text-primary">{o.orderStatus.replace(/_/g, " ")}</span>
          </div>
          <p className="text-sm text-gray-500">{o.items?.length} item(s) — ${o.totalAmount}</p>
          <p className="text-xs text-gray-400 capitalize">{o.paymentMethod} · {o.paymentStatus}</p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => onTrack(o.id)} className="text-xs border rounded-md px-3 py-1 text-primary border-primary">
              Track Order
            </button>
            {o.orderStatus === "delivered" && o.items?.map((it) => (
              <button
                key={it.id}
                onClick={() => onRequestRefund(o.id, it.id, it.product?.name)}
                className="text-xs border rounded-md px-3 py-1 text-red-500 border-red-300"
              >
                Refund "{it.product?.name}"
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const RefundsTab = ({ pendingRequest, onClearPending }) => {
  const [refunds, setRefunds] = useState([]);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get("/refunds/my").then(({ data }) => setRefunds(data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!pendingRequest) return;
    setSubmitting(true);
    try {
      await api.post("/refunds", { orderId: pendingRequest.orderId, orderItemId: pendingRequest.orderItemId, reason });
      setReason("");
      onClearPending();
      load();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {pendingRequest && (
        <form onSubmit={submit} className="border rounded-md p-4 mb-6 bg-primary/5">
          <p className="text-sm font-medium mb-2">Request refund for "{pendingRequest.productName}"</p>
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tell us what went wrong..."
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
          <div className="flex gap-2 mt-2">
            <button disabled={submitting} className="bg-primary text-white px-4 py-1.5 rounded-md text-sm">
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
            <button type="button" onClick={onClearPending} className="border px-4 py-1.5 rounded-md text-sm">Cancel</button>
          </div>
        </form>
      )}
      {!refunds.length ? (
        <p className="text-gray-500">No refund requests yet.</p>
      ) : (
        <div className="space-y-3">
          {refunds.map((r) => (
            <div key={r.id} className="border rounded-md p-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{r.orderItem?.product?.name}</span>
                <span className={`capitalize font-medium ${
                  r.status === "approved" ? "text-green-600" : r.status === "rejected" ? "text-red-500" : "text-yellow-600"
                }`}>{r.status}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{r.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const statusOrder = ["processing", "shipped", "out_for_delivery", "delivered"];
const statusLabels = {
  processing: "Order Placed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const TrackOrderTab = ({ orderId, onOrderIdChange }) => {
  const [inputId, setInputId] = useState(orderId || "");
  const [tracking, setTracking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { if (orderId) fetchTracking(orderId); }, [orderId]); // eslint-disable-line

  const fetchTracking = async (id) => {
    setError("");
    setTracking(null);
    try {
      const { data } = await api.get(`/orders/${id}/tracking`);
      setTracking(data);
    } catch (err) {
      setError(err.response?.data?.message || "Order not found");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onOrderIdChange(inputId);
    fetchTracking(inputId);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          placeholder="Enter Order ID"
          className="flex-1 border rounded-md px-3 py-2 text-sm"
        />
        <button className="bg-primary text-white px-4 rounded-md text-sm">Track</button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {tracking && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Order #{tracking.order.id} — {tracking.order.shippingAddress1}, {tracking.order.shippingCity}
          </p>
          <div className="space-y-0">
            {(tracking.order.orderStatus === "cancelled"
              ? [{ status: "cancelled", note: "Order cancelled", createdAt: tracking.history[tracking.history.length - 1]?.createdAt }]
              : statusOrder
            ).map((step, i) => {
              const reached = tracking.order.orderStatus === "cancelled"
                ? true
                : statusOrder.indexOf(tracking.order.orderStatus) >= i;
              const update = tracking.history.find((h) => h.status === step);
              return (
                <div key={step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${reached ? "bg-primary" : "bg-gray-200"}`} />
                    {i < statusOrder.length - 1 && <div className={`w-0.5 flex-1 ${reached ? "bg-primary" : "bg-gray-200"}`} style={{ minHeight: 32 }} />}
                  </div>
                  <div className="pb-6">
                    <p className={`text-sm font-medium ${reached ? "text-gray-900" : "text-gray-400"}`}>{statusLabels[step]}</p>
                    {update && <p className="text-xs text-gray-400">{new Date(update.createdAt).toLocaleString()}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentMethodsTab = () => {
  const [methods, setMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => api.get("/payment-methods").then(({ data }) => setMethods(data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Remove this card?")) return;
    await api.delete(`/payment-methods/${id}`);
    load();
  };

  return (
    <div>
      {loading ? (
        <p className="text-gray-500 mb-4">Loading...</p>
      ) : !methods.length ? (
        <p className="text-gray-500 mb-4">No saved payment methods.</p>
      ) : (
        <div className="space-y-3 mb-4">
          {methods.map((m) => (
            <div key={m.id} className="flex items-center justify-between border rounded-md p-4">
              <div className="flex items-center gap-3">
                <FiCreditCard size={22} className="text-gray-400" />
                <div>
                  <p className="font-medium capitalize">{m.brand} •••• {m.last4}</p>
                  <p className="text-xs text-gray-400">Expires {String(m.expMonth).padStart(2, "0")}/{m.expYear}</p>
                </div>
                {m.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
              </div>
              <button onClick={() => remove(m.id)} className="text-red-500"><FiTrash2 /></button>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <AddCardForm
          onSaved={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button onClick={() => setShowForm(true)} className="bg-primary text-white px-4 py-2 rounded-md text-sm">
          + Add now
        </button>
      )}
    </div>
  );
};

const Placeholder = ({ text }) => <p className="text-gray-500">{text}</p>;

const Profile = () => {
  const [active, setActive] = useState("profile");
  const [pendingRefund, setPendingRefund] = useState(null);
  const [trackOrderId, setTrackOrderId] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const requestRefund = (orderId, orderItemId, productName) => {
    setPendingRefund({ orderId, orderItemId, productName });
    setActive("refunds");
  };

  const trackOrder = (orderId) => {
    setTrackOrderId(orderId);
    setActive("track");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
      <aside className="md:col-span-1 border rounded-lg p-4 h-fit">
        <ul className="space-y-1">
          {tabs.map((t) => (
            <li key={t.key}>
              <button
                onClick={() => setActive(t.key)}
                className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md ${
                  active === t.key ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <t.icon /> {t.label}
              </button>
            </li>
          ))}
          <li>
            <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-red-500 hover:bg-red-50">
              <FiLogOut /> Log out
            </button>
          </li>
        </ul>
      </aside>

      <main className="md:col-span-3 border rounded-lg p-6">
        {active === "profile" && <ProfileTab />}
        {active === "orders" && <OrdersTab onRequestRefund={requestRefund} onTrack={trackOrder} />}
        {active === "refunds" && <RefundsTab pendingRequest={pendingRefund} onClearPending={() => setPendingRefund(null)} />}
        {active === "inbox" && (
          <div>
            <p className="text-gray-500 mb-4">Chat with sellers about your orders and products.</p>
            <Link to="/messages" className="bg-primary text-white px-4 py-2 rounded-md text-sm inline-block">Open Messages</Link>
          </div>
        )}
        {active === "track" && <TrackOrderTab orderId={trackOrderId} onOrderIdChange={setTrackOrderId} />}
        {active === "payment" && <PaymentMethodsTab />}
        {active === "address" && <AddressManager />}
      </main>
    </div>
  );
};

export default Profile;
