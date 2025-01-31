require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const api = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.BASE_URL,
});

// API endpoint for AI chat
app.post("/ask-ai", async (req, res) => {
  try {
    const { userMessage } = req.body;

    const systemPrompt = "Tell about food, Descriptive";
    const completion = await api.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

    const aiResponse = completion.choices[0]?.message?.content || "No response from AI";

    res.json({ aiResponse });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});