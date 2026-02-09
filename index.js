import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.get("/", (req, res) => {
  res.json({ ok: true, message: "API online 🚀" });
});

app.get("/images/:folder", async (req, res) => {
  try {
    const { folder } = req.params;

    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by("created_at", "asc")
      .max_results(50)
      .execute();

    res.json(
      result.resources.map(img => ({
        id: img.asset_id,
        publicId: img.public_id,
        url: img.secure_url,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar imagens" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🔥 API rodando na porta ${PORT}`)
);
