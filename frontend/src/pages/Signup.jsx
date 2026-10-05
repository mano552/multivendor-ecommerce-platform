import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [shopName, setShopName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      if (role === "seller") formData.append("shopName", shopName);
      if (avatar) formData.append("avatar", avatar);

      await signup(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
      {error && <p className="bg-red-50 text-red-600 text-sm p-2 rounded mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center">
          <label className="relative cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <FiUpload size={24} className="text-gray-400" />
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
          <span className="text-xs text-gray-500 mt-2">Upload profile picture from gallery</span>
        </div>

        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded-md px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Email Address</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-md px-3 py-2 mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">I want to sign up as</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={role === "buyer"} onChange={() => setRole("buyer")} /> Buyer
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={role === "seller"} onChange={() => setRole("seller")} /> Seller
            </label>
          </div>
        </div>

        {role === "seller" && (
          <div>
            <label className="text-sm font-medium">Shop Name</label>
            <input required value={shopName} onChange={(e) => setShopName(e.target.value)} className="w-full border rounded-md px-3 py-2 mt-1" />
          </div>
        )}

        <button type="submit" className="w-full bg-primary text-white py-2 rounded-md font-medium">
          Sign up
        </button>
      </form>
      <p className="text-center text-sm mt-6">
        Already have an account? <Link to="/login" className="text-primary font-medium">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
