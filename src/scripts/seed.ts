import * as mongoose from "mongoose";
import { ProductSchema } from "../modules/products/product.schema";
import "dotenv/config";

async function seed() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/focustm";
  await mongoose.connect(uri);

  const ProductModel = mongoose.model("Product", ProductSchema);

  const sample = [
    {
      name: "Focus Graphic Tee — Black",
      slug: "focus-graphic-tee-black",
      description: "Premium heavyweight cotton tee with the signature FocusTM graphic print.",
      price: 15000,
      images: [],
      category: "shirts",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Black"],
      customizable: true,
      stock: 24,
      featured: true,
    },
    {
      name: "Lagos Print Tee",
      slug: "lagos-print-tee",
      description: "Limited edition Lagos cityscape print tee.",
      price: 16500,
      images: [],
      category: "shirts",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White"],
      customizable: false,
      stock: 18,
      featured: true,
    },
    {
      name: "FTM Snapback Cap",
      slug: "ftm-snapback-cap",
      description: "Structured snapback with embroidered FTM emblem.",
      price: 9000,
      images: [],
      category: "caps",
      sizes: ["One Size"],
      colors: ["Black", "Navy"],
      customizable: true,
      stock: 40,
      featured: true,
    },
    {
      name: "Focus Hoodie — Charcoal",
      slug: "focus-hoodie-charcoal",
      description: "Heavyweight fleece hoodie with embroidered FocusTM crest.",
      price: 28000,
      images: [],
      category: "tops",
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Charcoal"],
      customizable: true,
      stock: 12,
      featured: true,
    },
  ];

  for (const p of sample) {
    await ProductModel.updateOne({ slug: p.slug }, p, { upsert: true });
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded ${sample.length} products.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
