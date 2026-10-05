import { useEffect, useState } from "react";
import { FiBarChart2, FiUsers, FiBox, FiGrid, FiShoppingBag, FiTrash2, FiRefreshCw } from "react-icons/fi";
import api from "../../api/axios";

const tabs = [
  { key: "stats", label: "Overview", icon: FiBarChart2 },
  { key: "sellers", label: "Sellers", icon: FiUsers },
  { key: "products", label: "Products", icon: FiBox },
  { key: "categories", label: "Categories", icon: FiGrid },
  { key: "orders", label: "Orders", icon: FiShoppingBag },
  { key: "refunds", label: "Refunds", icon: FiRefreshCw },
];

const StatsTab = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/admin/stats").then(({ data }) => setStats(data)); }, []);
  if (!stats) return <p className="text-gray-500">Loading...</p>;
  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Total Sellers", value: stats.totalSellers },
    { label: "Total Products", value: stats.totalProducts },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Revenue (paid)", value: `$${stats.totalRevenue.toFixed(2)}` },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="border rounded-lg p-5">
          <p className="text-sm text-gray-500">{c.label}</p>
          <p className="text-2xl font-bold mt-1">{c.value}</p>
        </div>
      ))}
    </div>
  );
};

const SellersTab = () => {
  const [sellers, setSellers] = useState([]);
  const load = () => api.get("/admin/sellers").then(({ data }) => setSellers(data));
  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    await api.put(`/admin/sellers/${id}/approve`);
    load();
  };

  if (!sellers.length) return <p className="text-gray-500">No sellers registered yet.</p>;

  return (
    <div className="space-y-3">
      {sellers.map((s) => (
        <div key={s.id} className="flex items-center justify-between border rounded-md p-4">
          <div>
            <p className="font-medium">{s.shopName || s.fullName}</p>
            <p className="text-sm text-gray-500">{s.email}</p>
          </div>
          <button
            onClick={() => toggle(s.id)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium ${
              s.approved ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
            }`}
          >
            {s.approved ? "Revoke Approval" : "Approve"}
          </button>
        </div>
      ))}
    </div>
  );
};

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const load = () => api.get("/admin/products").then(({ data }) => setProducts(data));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  if (!products.length) return <p className="text-gray-500">No products yet.</p>;

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div key={p.id} className="flex items-center gap-4 border rounded-md p-3">
          <img src={p.images?.[0] || "https://placehold.co/60x60?text=Img"} className="w-14 h-14 object-cover rounded-md" />
          <div className="flex-1">
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-gray-500">{p.seller?.shopName} · {p.category?.name} · ${p.price}</p>
          </div>
          <button onClick={() => remove(p.id)} className="text-red-500"><FiTrash2 /></button>
        </div>
      ))}
    </div>
  );
};

const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const load = () => api.get("/categories").then(({ data }) => setCategories(data));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post("/categories", { name });
    setName("");
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <form onSubmit={add} className="flex gap-2 mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" className="flex-1 border rounded-md px-3 py-2" />
        <button className="bg-primary text-white px-4 rounded-md">Add</button>
      </form>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between border rounded-md p-3">
            <span>{c.name}</span>
            <button onClick={() => remove(c.id)} className="text-red-500"><FiTrash2 /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const load = () => api.get("/orders/all").then(({ data }) => setOrders(data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, orderStatus) => {
    await api.put(`/orders/${id}/status`, { orderStatus });
    load();
  };

  if (!orders.length) return <p className="text-gray-500">No orders yet.</p>;

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="border rounded-md p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Order #{o.id} — {o.buyer?.fullName}</p>
              <p className="text-sm text-gray-500">{o.items?.length} item(s) — ${o.totalAmount}</p>
              <p className="text-xs text-gray-400 capitalize">{o.paymentMethod} · {o.paymentStatus}</p>
            </div>
            <select
              value={o.orderStatus}
              onChange={(e) => updateStatus(o.id, e.target.value)}
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

const RefundsTab = () => {
  const [refunds, setRefunds] = useState([]);
  const load = () => api.get("/refunds/all").then(({ data }) => setRefunds(data));
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

const AdminDashboard = () => {
  const [active, setActive] = useState("stats");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
      <aside className="md:col-span-1 border rounded-lg p-4 h-fit">
        <h2 className="font-semibold mb-4">Admin Panel</h2>
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
        {active === "stats" && <StatsTab />}
        {active === "sellers" && <SellersTab />}
        {active === "products" && <ProductsTab />}
        {active === "categories" && <CategoriesTab />}
        {active === "orders" && <OrdersTab />}
        {active === "refunds" && <RefundsTab />}
      </main>
    </div>
  );
};

export default AdminDashboard;
