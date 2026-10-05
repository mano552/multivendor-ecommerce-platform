const sequelize = require("../config/db");
const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Review = require("./Review");
const CartItem = require("./CartItem");
const WishlistItem = require("./WishlistItem");
const Message = require("./Message");
const Refund = require("./Refund");
const TrackingUpdate = require("./TrackingUpdate");
const PaymentMethod = require("./PaymentMethod");
const Address = require("./Address");

// Seller (User with role=seller) -> Products
User.hasMany(Product, { foreignKey: "sellerId", as: "products" });
Product.belongsTo(User, { foreignKey: "sellerId", as: "seller" });

// Category -> Products
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Buyer -> Orders
User.hasMany(Order, { foreignKey: "buyerId", as: "orders" });
Order.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });

// Order <-> Product (through OrderItem)
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Product <-> Reviews (by buyers)
Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId" });
User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

// Cart (per buyer)
User.hasMany(CartItem, { foreignKey: "userId" });
CartItem.belongsTo(User, { foreignKey: "userId" });
Product.hasMany(CartItem, { foreignKey: "productId" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Wishlist (per buyer)
User.hasMany(WishlistItem, { foreignKey: "userId" });
WishlistItem.belongsTo(User, { foreignKey: "userId" });
Product.hasMany(WishlistItem, { foreignKey: "productId" });
WishlistItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Messages: buyer -> seller, tied to a product
User.hasMany(Message, { foreignKey: "senderId", as: "sentMessages" });
User.hasMany(Message, { foreignKey: "receiverId", as: "receivedMessages" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Message.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });
Message.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Refunds: buyer requests, tied to an order + order item
User.hasMany(Refund, { foreignKey: "buyerId", as: "refunds" });
Refund.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });
Order.hasMany(Refund, { foreignKey: "orderId", as: "refunds" });
Refund.belongsTo(Order, { foreignKey: "orderId", as: "order" });
OrderItem.hasOne(Refund, { foreignKey: "orderItemId" });
Refund.belongsTo(OrderItem, { foreignKey: "orderItemId", as: "orderItem" });

// Tracking history for an order (a timeline of status updates)
Order.hasMany(TrackingUpdate, { foreignKey: "orderId", as: "trackingHistory" });
TrackingUpdate.belongsTo(Order, { foreignKey: "orderId" });

// Saved payment methods (cards) per buyer
User.hasMany(PaymentMethod, { foreignKey: "userId", as: "paymentMethods" });
PaymentMethod.belongsTo(User, { foreignKey: "userId" });

// Saved addresses per user (buyer, seller, admin)
User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Review,
  CartItem,
  WishlistItem,
  Message,
  Refund,
  TrackingUpdate,
  PaymentMethod,
  Address,
};
