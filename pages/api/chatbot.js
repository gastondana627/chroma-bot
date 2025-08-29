export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { message, mode } = req.body;
  
    // Modes: "story", "faq", "stats"
    let response = "";
  
    if (mode === "story") {
      response = getStoryResponse(message);
    } else if (mode === "faq") {
      response = getFAQResponse(message);
    } else if (mode === "stats") {
      response = getLiveStats();
    }
  
    return res.status(200).json({ reply: response });
  }
  
  // --- Simple Functions ---
  function getStoryResponse(input) {
    if (input.includes("help")) {
      return "The system is unstable. Beware of fake profiles.";
    }
    return "The narrative continues...";
  }
  
  function getFAQResponse(input) {
    if (input.includes("scam")) {
      return "Scammers often ask for money quickly or push you off-platform.";
    }
    return "Try asking about 'identity fraud' or 'dating app risks'.";
  }
  
  function getLiveStats() {
    return "Over $10B is lost annually to online scams. Stay vigilant.";
  }

  