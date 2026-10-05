require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, User, Category, Product } = require("../models");

const categories = [
  { name: "Computers & Laptops", icon: "laptop" },
  { name: "Cosmetics & Body Care", icon: "cosmetics" },
  { name: "Accessories", icon: "accessories" },
  { name: "Clothes", icon: "clothes" },
  { name: "Shoes", icon: "shoes" },
  { name: "Gifts", icon: "gift" },
  { name: "Pet Care", icon: "pet" },
  { name: "Mobile & Tablets", icon: "mobile" },
  { name: "Music & Gaming", icon: "gaming" },
  { name: "Others", icon: "others" },
];

const brands = ["Dell", "Apple", "LG", "Sony", "Microsoft", "Asus", "Samsung", "HP"];

const productNamesByCategory = {
  "Computers & Laptops": [
    { name: "Ultra-Slim Laptop 15\"", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&q=80" },
    { name: "Gaming Desktop PC", image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&h=500&fit=crop&q=80" },
    { name: "Wireless Mouse Combo", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop&q=80" },
    { name: "27\" 4K Monitor", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop&q=80" }
  ],
  "Cosmetics & Body Care": [
    { name: "Vitamin C Face Serum", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop&q=80" },
    { name: "Moisturizing Body Lotion", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop&q=80" },
    { name: "Matte Lipstick Set", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop&q=80" },
    { name: "Herbal Shampoo", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&h=500&fit=crop&q=80" }
  ],
  "Accessories": [
    { name: "Leather Wallet", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop&q=80" },
    { name: "Sunglasses Classic", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop&q=80" },
    { name: "Analog Wrist Watch", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop&q=80" },
    { name: "Backpack Travel Pro", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&q=80" }
  ],
  "Clothes": [
    { name: "Men's Denim Jacket", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop&q=80" },
    { name: "Women's Summer Dress", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop&q=80" },
    { name: "Cotton T-Shirt Pack", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80" },
    { name: "Hooded Sweatshirt", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&q=80" }
  ],
  "Shoes": [
    { name: "Running Sneakers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80" },
    { name: "Leather Formal Shoes", image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=500&fit=crop&q=80" },
    { name: "Casual Sandals", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=500&fit=crop&q=80" },
    { name: "High-Top Sneakers", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop&q=80" }
  ],
  "Gifts": [
    { name: "Scented Candle Set", image: "/uploads/candle.jpg" },
    { name: "Personalized Photo Frame", image: "/uploads/photo.jpg" },
    { name: "Gift Hamper Deluxe", image: "/uploads/gift.jpg" },
    { name: "Greeting Card Bundle", image: "/uploads/greeting.jpg" }
  ],
  "Pet Care": [
    { name: "Dog Food 5kg", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&h=500&fit=crop&q=80" },
    { name: "Cat Scratching Post", image: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=500&h=500&fit=crop&q=80" },
    { name: "Pet Grooming Kit", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop&q=80" },
    { name: "Chew Toy Pack", image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=500&h=500&fit=crop&q=80" }
  ],
  "Mobile & Tablets": [
    { name: "Smartphone 128GB", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&q=80" },
    { name: "Tablet 10.1\" WiFi", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&q=80" },
    { name: "Phone Case Cover", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop&q=80" },
    { name: "Fast Charger 30W", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop&q=80" }
  ],
  "Music & Gaming": [
    { name: "Gaming Headphone Asus with multiple color options", image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=500&h=500&fit=crop&q=80" },
    { name: "Bluetooth Speaker", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&q=80" },
    { name: "Wireless Gamepad", image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=500&h=500&fit=crop&q=80" },
    { name: "Studio Headphones", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop&q=80" }
  ],
  "Others": [
    { name: "LED Desk Lamp", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop&q=80" },
    { name: "Ceramic Coffee Mug", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop&q=80" },
    { name: "Travel Water Bottle", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop&q=80" },
    { name: "Multi-Tool Kit", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500&h=500&fit=crop&q=80" }
  ],
};

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synced (all tables recreated)");

    // Admin
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    await User.create({
      fullName: "Site Admin",
      email: "admin@shopo.com",
      password: adminPassword,
      role: "admin",
    });

    // Demo seller
    const sellerPassword = await bcrypt.hash("Seller@123", 10);
    const seller = await User.create({
      fullName: "Asus Ltd Store",
      email: "seller@shopo.com",
      password: sellerPassword,
      role: "seller",
      shopName: "Asus Ltd",
    });

    // Demo buyer
    const buyerPassword = await bcrypt.hash("Buyer@123", 10);
    await User.create({
      fullName: "Demo Buyer",
      email: "buyer@shopo.com",
      password: buyerPassword,
      role: "buyer",
    });

    // Categories
    const createdCategories = [];
    for (const cat of categories) {
      const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const created = await Category.create({ name: cat.name, icon: cat.icon, slug });
      createdCategories.push(created);
    }

    // Products
    for (const cat of createdCategories) {
      const products = productNamesByCategory[cat.name] || [];
      for (const product of products) {
        const productName = product.name;
        const productImage = product.image;
        const price = randomBetween(15, 300);
        const hasDiscount = Math.random() > 0.4;
        // Using specific Unsplash image URLs for each product
        await Product.create({
          name: productName,
          description:
            "Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers make an informed decision. This product is high quality, durable, and comes with manufacturer warranty.",
          price,
          discountPrice: hasDiscount ? Math.round(price * 1.25) : null,
          stock: randomBetween(0, 50),
          sold: randomBetween(0, 40),
          images: [
            productImage,
            productImage.replace('w=500&h=500', 'w=600&h=600'),
          ],
          brand: brands[randomBetween(0, brands.length - 1)],
          ratingsAverage: (Math.random() * 2 + 3).toFixed(1),
          ratingsCount: randomBetween(3, 120),
          isFeatured: Math.random() > 0.6,
          isBestSeller: Math.random() > 0.6,
          categoryId: cat.id,
          sellerId: seller.id,
        });
      }
    }

    console.log("Seed data inserted successfully!");
    console.log("Login with: admin@shopo.com / Admin@123 (admin)");
    console.log("            seller@shopo.com / Seller@123 (seller)");
    console.log("            buyer@shopo.com / Buyer@123 (buyer)");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
