import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import api from "../api/axios";

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get("/addresses");
      setAddresses(data);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setForm({
      fullName: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      isDefault: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, form);
      } else {
        await api.post("/addresses", form);
      }
      await fetchAddresses();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save address");
    }
  };

  const handleEdit = (address) => {
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state || "",
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await api.delete(`/addresses/${id}`);
      await fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.put(`/addresses/${id}/set-default`);
      await fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to set default address");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Addresses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-opacity-90"
        >
          <FiPlus /> Add New Address
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold mb-4">{editingId ? "Edit Address" : "Add New Address"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name *</label>
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone *</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Address Line 1 *</label>
              <input
                required
                value={form.address1}
                onChange={(e) => setForm({ ...form, address1: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Address Line 2</label>
              <input
                value={form.address2}
                onChange={(e) => setForm({ ...form, address2: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">City *</label>
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">State</label>
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">ZIP Code *</label>
              <input
                required
                value={form.zipCode}
                onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Country *</label>
              <input
                required
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                />
                <span className="text-sm">Set as default address</span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90">
                {editingId ? "Update Address" : "Add Address"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length === 0 && !showForm && (
          <div className="col-span-2 text-center py-8 text-gray-500">
            No addresses saved yet. Click "Add New Address" to get started.
          </div>
        )}
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`border rounded-lg p-4 relative ${
              addr.isDefault ? "border-primary border-2 bg-primary bg-opacity-5" : ""
            }`}
          >
            {addr.isDefault && (
              <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <FiCheck size={12} /> Default
              </div>
            )}
            <div className="space-y-1">
              <p className="font-semibold">{addr.fullName}</p>
              <p className="text-sm text-gray-600">{addr.phone}</p>
              <p className="text-sm text-gray-600">
                {addr.address1}
                {addr.address2 && `, ${addr.address2}`}
              </p>
              <p className="text-sm text-gray-600">
                {addr.city}
                {addr.state && `, ${addr.state}`} {addr.zipCode}
              </p>
              <p className="text-sm text-gray-600">{addr.country}</p>
            </div>
            <div className="flex gap-2 mt-4">
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-sm text-primary hover:underline"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => handleEdit(addr)}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <FiEdit2 size={14} /> Edit
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-sm text-red-600 hover:underline flex items-center gap-1"
              >
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressManager;
