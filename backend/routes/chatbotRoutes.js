const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
require("dotenv").config();

// Enhanced fallback response function for when AI APIs are not available
const getFallbackResponse = (question) => {
  const lowerQuestion = question.toLowerCase();
  
  // NEET exam related responses
  if (lowerQuestion.includes("neet") || lowerQuestion.includes("exam") || lowerQuestion.includes("test")) {
    return "NEET (National Eligibility cum Entrance Test) is a medical entrance exam in India. It's conducted by NTA and is required for admission to MBBS, BDS, and other medical courses. The exam consists of Physics, Chemistry, and Biology sections. Would you like to know more about specific subjects or exam preparation strategies?";
  }
  
  // Study tips
  if (lowerQuestion.includes("study") || lowerQuestion.includes("prepare") || lowerQuestion.includes("tips")) {
    return "For NEET preparation, focus on NCERT books first, practice previous year questions, take regular mock tests, and maintain a study schedule. Biology carries the most weight (50%), followed by Chemistry (25%) and Physics (25%). Regular revision and solving practice questions is key to success!";
  }
  
  // Biology related
  if (lowerQuestion.includes("biology") || lowerQuestion.includes("bio")) {
    return "Biology is the most important subject for NEET with 50% weightage. Focus on NCERT Biology books, especially Class 11 and 12. Important topics include Human Physiology, Genetics, Ecology, and Plant Physiology. Practice diagrams and understand concepts rather than memorizing.";
  }
  
  // Chemistry related
  if (lowerQuestion.includes("chemistry") || lowerQuestion.includes("chem")) {
    return "Chemistry has 25% weightage in NEET. Focus on Physical Chemistry calculations, Organic Chemistry mechanisms, and Inorganic Chemistry facts. NCERT books are essential. Practice numerical problems regularly and understand reaction mechanisms.";
  }
  
  // Physics related
  if (lowerQuestion.includes("physics")) {
    return "Physics also has 25% weightage in NEET. Focus on Mechanics, Electromagnetism, and Optics. Practice numerical problems and understand concepts. NCERT books are important, but you may need additional reference books for better understanding.";
  }
  
  // General greeting
  if (lowerQuestion.includes("hello") || lowerQuestion.includes("hi") || lowerQuestion.includes("hey")) {
    return "Hello! I'm your NEET Academy AI assistant. I can help you with NEET preparation questions, study tips, and exam strategies. How can I assist you today?";
  }
  
  // Default response
  return "I'm here to help you with NEET preparation! You can ask me about exam strategies, study tips, specific subjects (Biology, Chemistry, Physics), or any other NEET-related questions. What would you like to know?";
};

// Try Hugging Face API (Free tier available)
const tryHuggingFace = async (question) => {
  const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!huggingFaceApiKey) {
    return null;
  }

  try {
    console.log("Trying Hugging Face API");
    
    // Try different free models that work well for chat
    const models = [
      "mistralai/Mistral-7B-Instruct-v0.1",
      "google/flan-t5-large"
    ];
    
    for (const model of models) {
      try {
        console.log(`Trying Hugging Face model: ${model}`);
        
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${huggingFaceApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: `You are a NEET Academy AI assistant. Help with NEET preparation. User: ${question}`,
              parameters: {
                max_length: 150,
                temperature: 0.7,
                do_sample: true,
                return_full_text: false
              }
            }),
          }
        );

        console.log(`Hugging Face response status for ${model}:`, response.status);

        if (response.ok) {
          const data = await response.json();
          console.log(`Hugging Face raw response for ${model}:`, data);
          
          // Handle different response formats
          let generatedText = null;
          
          if (Array.isArray(data) && data.length > 0) {
            // Standard format
            if (data[0].generated_text) {
              generatedText = data[0].generated_text;
            } else if (data[0].text) {
              generatedText = data[0].text;
            }
          } else if (data.generated_text) {
            // Single object format
            generatedText = data.generated_text;
          } else if (data.text) {
            // Alternative format
            generatedText = data.text;
          }
          
          if (generatedText) {
            console.log(`Hugging Face response successful with model ${model}`);
            return {
              response: generatedText,
              model: model
            };
          }
        } else {
          console.error(`Hugging Face API error for ${model}:`, response.status, response.statusText);
        }
      } catch (error) {
        console.error(`Error with Hugging Face model ${model}:`, error);
        continue;
      }
    }
  } catch (error) {
    console.error("Hugging Face API error:", error);
  }
  
  return null;
};

// Try Cohere API (Free tier available)
const tryCohere = async (question) => {
  const cohereApiKey = process.env.COHERE_API_KEY;
  
  if (!cohereApiKey) {
    return null;
  }

  try {
    console.log("Trying Cohere API");
    
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cohereApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-light",
        prompt: `You are an AI assistant for NEET Academy, a coaching institute for NEET (National Eligibility cum Entrance Test) preparation. Help students with NEET-related questions, study tips, and exam strategies. Keep responses focused on NEET preparation.\n\nUser: ${question}\nAssistant:`,
        max_tokens: 200,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: "NONE"
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.generations && data.generations[0] && data.generations[0].text) {
        console.log("Cohere response successful");
        return {
          response: data.generations[0].text.trim(),
          model: "cohere-command-light"
        };
      }
    }
  } catch (error) {
    console.error("Cohere API error:", error);
  }
  
  return null;
};

// Try Local Ollama (Completely Free - No Limits)
const tryLocalOllama = async (question) => {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama2";
  
  try {
    console.log("Trying Local Ollama API");
    
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: `You are an AI assistant for NEET Academy, a coaching institute for NEET (National Eligibility cum Entrance Test) preparation. Help students with NEET-related questions, study tips, and exam strategies. Keep responses focused on NEET preparation.

User: ${question}
Assistant:`,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 300
        }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.response) {
        console.log("Local Ollama response successful");
        return {
          response: data.response.trim(),
          model: ollamaModel
        };
      }
    }
  } catch (error) {
    console.error("Local Ollama API error:", error);
  }
  
  return null;
};

// POST /api/chatbot/ask
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    console.log("Chatbot request received:", question);

    if (!question || typeof question !== "string") {
      return res
        .status(400)
        .json({ error: "Question is required and must be a string" });
    }

    // Check Hugging Face API key
    const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;

    console.log("API Keys check:", {
      huggingFaceConfigured: !!huggingFaceApiKey
    });

    // Try Hugging Face (only provider)
    if (huggingFaceApiKey) {
      const result = await tryHuggingFace(question);
      if (result) {
        return res.json({
          response: result.response,
          timestamp: new Date().toISOString(),
          model: result.model,
          provider: "huggingface"
        });
      } else {
        return res.status(500).json({
          error: "Hugging Face API is not responding. Please check your API key and try again.",
        });
      }
    }

    // If no Hugging Face API key, provide fallback response
    console.log("No API keys available, using fallback responses");
    const fallbackResponse = getFallbackResponse(question);
    return res.json({
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      model: "fallback",
      provider: "fallback"
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
});

// GET /api/chatbot/health
router.get("/health", (req, res) => {
  const huggingFaceConfigured = !!process.env.HUGGINGFACE_API_KEY;
  
  res.json({
    status: "ok",
    huggingface_configured: huggingFaceConfigured,
    is_configured: huggingFaceConfigured,
    provider: "Hugging Face Only",
    free_tier: "30,000 requests/month",
    setup_required: !huggingFaceConfigured ? "Add HUGGINGFACE_API_KEY to environment variables" : null
  });
});

// GET /api/chatbot/test-huggingface
router.get("/test-huggingface", async (req, res) => {
  const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!huggingFaceApiKey) {
    return res.status(400).json({ error: "Hugging Face API key not configured" });
  }

  try {
    console.log("Testing Hugging Face API connection...");
    console.log("API Key format check:", huggingFaceApiKey.substring(0, 3) + "...");
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${huggingFaceApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: "Hello, how are you?",
          parameters: {
            max_length: 100,
            temperature: 0.7,
            do_sample: true
          }
        }),
      }
    );

    console.log("Hugging Face test response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Hugging Face test response:", data);
      
      res.json({
        status: "success",
        message: "Hugging Face API is working",
        response: data,
        status_code: response.status,
        api_key_format: "Valid (starts with hf_)"
      });
    } else {
      const errorData = await response.text();
      console.error("Hugging Face test error:", errorData);
      
      res.status(response.status).json({
        status: "error",
        message: "Hugging Face API test failed",
        error: errorData,
        status_code: response.status,
        api_key_format: huggingFaceApiKey.startsWith("hf_") ? "Valid format" : "Invalid format (should start with hf_)"
      });
    }
  } catch (error) {
    console.error("Hugging Face test error:", error);
    res.status(500).json({
      status: "error",
      message: "Hugging Face API test failed",
      error: error.message,
      api_key_format: huggingFaceApiKey.startsWith("hf_") ? "Valid format" : "Invalid format (should start with hf_)"
    });
  }
});

module.exports = router;
