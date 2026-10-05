require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { sequelize } = require("./models");
const { stripeWebhook } = require("./controllers/orderController");
const { initSocket } = require("./socket");

const app = express();
const httpServer = http.createServer(app);
initSocket(httpServer);

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));

// Stripe webhook needs the RAW body, so register it BEFORE express.json()
app.post("/api/orders/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/refunds", require("./routes/refundRoutes"));
app.use("/api/payment-methods", require("./routes/paymentMethodRoutes"));
app.use("/api/addresses", require("./routes/addressRoutes"));

app.get("/", (req, res) => res.json({ message: "Multi-vendor e-commerce API is running" }));

// Lets the frontend fetch the Stripe PUBLISHABLE key at runtime instead of hardcoding it,
// so a single .env change on the backend is enough to switch Stripe accounts.
app.get("/api/config", (req, res) => {
  res.json({ stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected");
    await sequelize.sync(); // use { alter: true } while developing if needed
    httpServer.listen(PORT, () => console.log(`Server (HTTP + Socket.IO) running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("Unable to start server:", err);
    process.exit(1);
  }
};

start();
