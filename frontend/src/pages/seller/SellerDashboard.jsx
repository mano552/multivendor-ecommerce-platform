import { useEffect, useState } from "react";
import { FiPackage, FiPlusCircle, FiShoppingBag, FiInbox, FiTrash2, FiEdit2, FiRefreshCw, FiDollarSign } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const tabs = [
  { key: "products", label: "My Products", icon: FiPackage },
  { key: "add", label: "Add Product", icon: FiPlusCircle },
  { key: "orders", label: "Orders", icon: FiShoppingBag },
  { key: "refunds", label: "Refunds", icon: FiRefreshCw },
  { key: "earnings", label: "Earnings", icon: FiDollarSign },
  { key: "inbox", label: "Inbox", icon: FiInbox },
];

const emptyForm = {
  name: "", description: "", price: "", discountPrice: "", stock: "", brand: "",
  categoryId: "", isFeatured: false, isBestSeller: false,
};

const ProductsTab = ({ reloadKey }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  const load = () => api.get(`/products?sellerId=${user.id}`).then(({ data }) => setProducts(data));
  useEffect(() => { load(); }, [reloadKey]); // eslint-disable-line

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  if (!products.length) return <p className="text-gray-500">You haven't listed any products yet.</p>;

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div key={p.id} className="flex items-center gap-4 border rounded-md p-3">
          <img src={p.images?.[0] || "https://placehold.co/80x80?text=Img"} className="w-16 h-16 object-cover rounded-md" />
          <div className="flex-1">
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-gray-500">${p.price} · {p.stock} in stock · {p.sold} sold</p>
          </div>
          <button className="text-gray-500"><FiEdit2 /></button>
          <button onClick={() => handleDelete(p.id)} className="text-red-500"><FiTrash2 /></button>
        </div>
      ))}
    </div>
  );
};

const AddProductTab = ({ onCreated }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { api.get("/categories").then(({ data }) => setCategories(data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      images.forEach((img) => data.append("images", img));
      await api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
      setForm(emptyForm);
      setImages([]);
      setMessage("Product added successfully!");
      onCreated();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      {message && <p className="md:col-span-2 bg-primary/10 text-primary text-sm p-2 rounded">{message}</p>}
      <div className="md:col-span-2">
        <label className="text-sm font-medium">Product Name</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1" />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm font-medium">Description</label>
        <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Price ($)</label>
        <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Original / Discount-from Price ($)</label>
        <input type="number" step="0.01" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Stock</label>
        <input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium">Brand</label>
        <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1" />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm font-medium">Category</label>
        <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1">
          <option value="">Select a category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="text-sm font-medium">Product Images</label>
        <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} className="w-full border rounded-md px-3 py-2 mt-1" />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} /> Best Seller
        </label>
      </div>
      <div className="md:col-span-2">
        <button disabled={saving} className="bg-primary text-white px-6 py-2 rounded-md font-medium disabled:opacity-60">
          {saving ? "Saving..." : "Add Product"}
        </button>
      </div>
    </form>
  );
};

const OrdersTab = () => {
  const [items, setItems] = useState([]);

  const load = () => api.get("/orders/seller").then(({ data }) => setItems(data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { orderStatus: status });
    load();
  };

  if (!items.length) return <p className="text-gray-500">No orders yet.</p>;

  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.id} className="border rounded-md p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{it.product.name} × {it.quantity}</p>
              <p className="text-sm text-gray-500">
                Order #{it.Order.id} — {it.Order.shippingFullName}, {it.Order.shippingAddress1}, {it.Order.shippingCity}
              </p>
              <p className="text-xs text-gray-400 capitalize">{it.Order.paymentMethod} · {it.Order.paymentStatus}</p>
            </div>
            <select
              value={it.Order.orderStatus}
              onChange={(e) => updateStatus(it.Order.id, e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm"
            >
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

const InboxTab = () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => { api.get("/messages/inbox").then(({ data }) => setMessages(data)); }, []);
  return (
    <div>
      <div className="mb-4">
        <Link to="/messages" className="bg-primary text-white px-4 py-2 rounded-md text-sm inline-block">
          Open Live Chat
        </Link>
      </div>
      {!messages.length ? (
        <p className="text-gray-500">No messages from buyers yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="border rounded-md p-4">
              <p className="text-sm font-medium">{m.sender?.fullName} — about "{m.product?.name}"</p>
              <p className="text-sm text-gray-600 mt-1">{m.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RefundsTab = () => {
  const [refunds, setRefunds] = useState([]);
  const load = () => api.get("/refunds/seller").then(({ data }) => setRefunds(data));
  useEffect(() => { load(); }, []);

  const respond = async (id, status) => {
    await api.put(`/refunds/${id}/status`, { status });
    load();
  };

  if (!refunds.length) return <p className="text-gray-500">No refund requests yet.</p>;

  return (
    <div className="space-y-3">
      {refunds.map((r) => (
        <div key={r.id} className="border rounded-md p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-sm">{r.orderItem?.product?.name}</p>
              <p className="text-sm text-gray-500">{r.buyer?.fullName} — {r.reason}</p>
              <span className={`text-xs capitalize font-medium ${
                r.status === "approved" ? "text-green-600" : r.status === "rejected" ? "text-red-500" : "text-yellow-600"
              }`}>{r.status}</span>
            </div>
            {r.status === "pending" && (
              <div className="flex gap-2">
                <button onClick={() => respond(r.id, "approved")} className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-md">Approve</button>
                <button onClick={() => respond(r.id, "rejected")} className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-md">Reject</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const EarningsTab = () => {
  const [earnings, setEarnings] = useState(null);
  useEffect(() => { api.get("/orders/seller/earnings").then(({ data }) => setEarnings(data)); }, []);
  if (!earnings) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-5">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <p className="text-2xl font-bold mt-1">${earnings.totalEarnings.toFixed(2)}</p>
        </div>
        <div className="border rounded-lg p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold mt-1">{earnings.totalOrders}</p>
        </div>
      </div>

      <h3 className="font-semibold mb-3">Monthly Breakdown</h3>
      {!earnings.monthly.length ? (
        <p className="text-gray-500 text-sm mb-6">No sales yet.</p>
      ) : (
        <div className="space-y-2 mb-6">
          {earnings.monthly.map((m) => (
            <div key={m.month} className="flex justify-between border-b py-1.5 text-sm">
              <span>{m.month}</span>
              <span className="font-medium">${m.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      <h3 className="font-semibold mb-3">By Product</h3>
      {!earnings.byProduct.length ? (
        <p className="text-gray-500 text-sm">No sales yet.</p>
      ) : (
        <div className="space-y-2">
          {earnings.byProduct.map((p) => (
            <div key={p.product} className="flex justify-between border-b py-1.5 text-sm">
              <span>{p.product}</span>
              <span className="font-medium">${p.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SellerDashboard = () => {
  const [active, setActive] = useState("products");
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
      <aside className="md:col-span-1 border rounded-lg p-4 h-fit">
        <h2 className="font-semibold mb-4">Seller Dashboard</h2>
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
        </ul>
      </aside>

      <main className="md:col-span-3 border rounded-lg p-6">
        {active === "products" && <ProductsTab reloadKey={reloadKey} />}
        {active === "add" && <AddProductTab onCreated={() => setReloadKey((k) => k + 1)} />}
        {active === "orders" && <OrdersTab />}
        {active === "refunds" && <RefundsTab />}
        {active === "earnings" && <EarningsTab />}
        {active === "inbox" && <InboxTab />}
      </main>
    </div>
  );
};

export default SellerDashboard;
