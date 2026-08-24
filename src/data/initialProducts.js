export const INITIAL_PRODUCTS = [
  {
    id: "ustar-maxx-cover",
    name: "USTAR Maxx Cover Lipstick",
    image_url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    price: "-",
    currency: "Ks",
    in_stock: true,
    note: "USTAR Maxx Cover Lipstick for everyday personal care.",
    category: "Cosmetic",
    brand: "USTAR",
    tag: "Popular",
    colors: [
      "Ruby Red",
      "Rose Pink",
      "Nude Beige",
      "Deep Plum"
    ],
    created_at: new Date().toISOString()
  },
  {
    id: "cosrx-cleanser",
    name: "COSRX Low pH Good Morning Gel Cleanser",
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    price: "18000",
    currency: "Ks",
    in_stock: true,
    note: "Gentle gel cleanser enriched with tea tree oil and BHA.",
    category: "Skincare",
    brand: "COSRX",
    tag: "Best Seller",
    colors: [],
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "anua-heartleaf-toner",
    name: "Anua Heartleaf 77% Soothing Toner",
    image_url: "https://images.unsplash.com/photo-1608248597260-8f9f7d084a9e?auto=format&fit=crop&w=800&q=80",
    price: "24,500",
    currency: "Ks",
    in_stock: true,
    note: "Calming toner formulation for sensitive and acne-prone skin.",
    category: "Skincare",
    brand: "Anua",
    tag: "Trending",
    colors: [],
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "romand-juicy-tint",
    name: "Rom&nd Juicy Lasting Tint",
    image_url: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=800&q=80",
    price: "15,000",
    currency: "Ks",
    in_stock: false,
    note: "Lustrous lip tint delivering vibrant colors with glassy finish.",
    category: "Cosmetic",
    brand: "Rom&nd",
    tag: "Popular",
    colors: [
      "Jujube",
      "Figfig",
      "Eat Dotori",
      "Cherry Bomb"
    ],
    created_at: new Date(Date.now() - 259200000).toISOString()
  }
];
