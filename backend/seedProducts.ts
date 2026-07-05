import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/product.model.js";

dotenv.config();

const products = [
  {
    name: "Apple MacBook Pro 16-inch M4 Max",
    description:
      "The most powerful MacBook Pro ever. Featuring the M4 Max chip with a 16-core CPU and 40-core GPU, 48GB unified memory, and a stunning 16.2-inch Liquid Retina XDR display. Perfect for professionals who demand the ultimate in performance for video editing, 3D rendering, and software development.",
    category: "Laptops",
    price: 3499.0,
    stock: 25,
    images: [
      {
        url: "https://picsum.photos/seed/macbook-pro/800/600",
        publicId: "seed/macbook-pro",
      },
    ],
  },
  {
    name: "Sony WH-1000XM6 Wireless Headphones",
    description:
      "Industry-leading noise cancellation meets premium sound quality. The WH-1000XM6 features 40mm drivers with LDAC support, 40-hour battery life, adaptive sound control, and ultra-comfortable memory foam ear cushions. Speak-to-chat and multipoint connection make these the perfect everyday companion.",
    category: "Audio",
    price: 399.99,
    stock: 120,
    images: [
      {
        url: "https://picsum.photos/seed/sony-headphones/800/600",
        publicId: "seed/sony-headphones",
      },
    ],
  },
  {
    name: "Samsung Galaxy S25 Ultra 512GB",
    description:
      "The ultimate smartphone experience with a 6.9-inch Dynamic AMOLED 2X display, Snapdragon 8 Elite processor, 200MP main camera with advanced AI photography features, built-in S Pen, and a massive 5000mAh battery. Galaxy AI brings intelligent assistance to your fingertips with real-time translation and generative editing.",
    category: "Smartphones",
    price: 1419.99,
    stock: 80,
    images: [
      {
        url: "https://picsum.photos/seed/galaxy-s25/800/600",
        publicId: "seed/galaxy-s25",
      },
    ],
  },
  {
    name: "Dyson V15 Detect Absolute Cordless Vacuum",
    description:
      "Dyson's most intelligent vacuum with a piezo sensor that counts and sizes microscopic particles, showing proof of a deep clean on the LCD screen. The laser slim fluffy cleaner head reveals invisible dust on hard floors. Features 240 air watts of powerful suction and up to 60 minutes of fade-free runtime.",
    category: "Home Appliances",
    price: 749.99,
    stock: 45,
    images: [
      {
        url: "https://picsum.photos/seed/dyson-vacuum/800/600",
        publicId: "seed/dyson-vacuum",
      },
    ],
  },
  {
    name: "Nike Air Jordan 1 Retro High OG",
    description:
      "The iconic Air Jordan 1 Retro High OG stays true to its roots with premium full-grain leather uppers, classic Wings logo, and the legendary Nike Air cushioning. This timeless silhouette transitions seamlessly from the court to the street. Available in the classic Chicago colorway with red, white, and black.",
    category: "Footwear",
    price: 180.0,
    stock: 200,
    images: [
      {
        url: "https://picsum.photos/seed/jordan-1/800/600",
        publicId: "seed/jordan-1",
      },
    ],
  },
  {
    name: "LG C4 65-inch OLED evo 4K Smart TV",
    description:
      "Experience cinematic brilliance with LG's latest OLED evo technology. The C4 delivers self-lit pixels for perfect blacks and infinite contrast, a9 Gen7 AI Processor for intelligent picture and sound optimization, Dolby Vision and Dolby Atmos support, 4 HDMI 2.1 ports for gaming at 4K@120Hz, and webOS 24 with built-in streaming apps.",
    category: "Electronics",
    price: 1799.99,
    stock: 30,
    images: [
      {
        url: "https://picsum.photos/seed/lg-oled-tv/800/600",
        publicId: "seed/lg-oled-tv",
      },
    ],
  },
  {
    name: "Kindle Paperwhite Signature Edition",
    description:
      "The premium Kindle reading experience with a 7-inch glare-free 300ppi display, adjustable warm light, auto-adjusting front light sensor, wireless charging, and 32GB of storage. IPX8 waterproof rated so you can read by the pool or in the bath. A single charge lasts up to 12 weeks.",
    category: "Electronics",
    price: 189.99,
    stock: 150,
    images: [
      {
        url: "https://picsum.photos/seed/kindle-paperwhite/800/600",
        publicId: "seed/kindle-paperwhite",
      },
    ],
  },
  {
    name: "Lego Technic Lamborghini Sián FKP 37",
    description:
      "Build the breathtaking Lamborghini Sián FKP 37 in 1:8 scale with this 3,696-piece LEGO Technic set. Features a working 8-speed sequential gearbox, moving pistons in the V12 engine, front and rear suspension, and stunning golden green bodywork. An immersive building experience for adult LEGO enthusiasts and supercar fans alike.",
    category: "Toys & Games",
    price: 449.99,
    stock: 35,
    images: [
      {
        url: "https://picsum.photos/seed/lego-lambo/800/600",
        publicId: "seed/lego-lambo",
      },
    ],
  },
  {
    name: "Osprey Atmos AG 65 Backpack",
    description:
      "The award-winning Atmos AG 65 features Osprey's Anti-Gravity suspension system that distributes weight evenly across the entire back panel for unmatched comfort on long treks. Includes a built-in raincover, Stow-on-the-Go trekking pole attachment, multiple access points, and a removable floating top lid that converts to a daypack. Capacity: 65 liters.",
    category: "Outdoor & Sports",
    price: 320.0,
    stock: 60,
    images: [
      {
        url: "https://picsum.photos/seed/osprey-backpack/800/600",
        publicId: "seed/osprey-backpack",
      },
    ],
  },
  {
    name: "Breville Barista Express Impress Espresso Machine",
    description:
      "Craft café-quality espresso at home with the Barista Express Impress. Features an Assisted Tamping system for consistent extraction, integrated conical burr grinder with 25 settings, digital temperature control, a 2-liter water tank, and a powerful 15-bar Italian pump. Includes a steam wand for microfoam milk texturing and latte art.",
    category: "Kitchen Appliances",
    price: 899.95,
    stock: 40,
    images: [
      {
        url: "https://picsum.photos/seed/breville-espresso/800/600",
        publicId: "seed/breville-espresso",
      },
    ],
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB.");

    // Remove existing seeded products (by checking publicId prefix)
    const existingCount = await Product.countDocuments();
    console.log(`📊 Existing products in database: ${existingCount}`);

    // Insert products
    const created = await Product.insertMany(products);
    console.log(`🌱 Successfully seeded ${created.length} products:`);

    created.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} — $${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedProducts();
