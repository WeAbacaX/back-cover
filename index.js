import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= CLOUDINARY CONFIG ================= */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/* ================= TESTE API ================= */
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API online 🚀" });
});

/* ================= BUSCAR IMAGENS POR PASTA ================= */
app.get("/images/*", async (req, res) => {
  try {
    const folder = req.params[0];

    if (!folder) {
      return res.status(400).json({
        error: "Pasta não informada",
      });
    }

    const result = await cloudinary.search
      .expression(`folder="${folder}" AND resource_type:image`)
      .sort_by("created_at", "asc")
      .max_results(100)
      .execute();

    const images = result.resources.map(img => ({
      id: img.asset_id,
      publicId: img.public_id,
      url: img.secure_url,
      width: img.width,
      height: img.height,
      format: img.format,
      created: img.created_at,
    }));

    res.json(images);

  } catch (err) {
    console.error("❌ ERRO CLOUDINARY:", err);

    res.status(500).json({
      error: "Erro ao buscar imagens",
      details: err.message,
    });
  }
});

/* ================= LISTAR TODAS AS PASTAS ================= */
/* opcional mas MUITO útil */
app.get("/folders", async (req, res) => {
  try {
    const result = await cloudinary.api.root_folders();

    res.json(result.folders.map(f => f.name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar pastas" });
  }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 API rodando → http://localhost:${PORT}`);
});
