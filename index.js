import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= CONFIG CLOUDINARY ================= */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/* ================= TESTE API ================= */
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API online 🚀" });
});

/* ================= ROTA DE IMAGENS ================= */
app.get("/images/*", async (req, res) => {
  try {
    const folder = req.params[0]; // <- pega caminho completo com /

    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder, // <- pega tudo dentro da pasta
      max_results: 100
    });

    res.json(
      result.resources.map(img => ({
        id: img.asset_id,
        publicId: img.public_id,
        url: img.secure_url,
        width: img.width,
        height: img.height,
      }))
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar imagens" });
  }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🔥 API rodando na porta ${PORT}`)
);
