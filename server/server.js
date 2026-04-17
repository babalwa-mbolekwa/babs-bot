import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import rateLimit from "express-rate-limit";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from API!",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    res.status(200).send({
      bot: response.output_text, // ✅ cleaner
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error.message,
    });
  }
});

app.listen(5000, () =>
  console.log("Server is running on http://localhost:5000")
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 50, // max 50 requests per IP
});

app.use(limiter);