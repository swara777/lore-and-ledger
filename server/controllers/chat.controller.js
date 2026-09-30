// @desc    Chat with PathBot AI
// @route   POST /api/chat
// @access  Private
const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const apiKey = process.env.AI_API_KEY;

    // If no API key, use intelligent fallback responses
    if (!apiKey || apiKey === 'your_gemini_or_openai_api_key_here') {
      const fallbackResponse = getFallbackResponse(message);
      return res.json({ reply: fallbackResponse });
    }

    // Try Gemini API first
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{
                  text: `You are PathBot, a friendly and knowledgeable career counselor for students. 
You help students explore career paths, understand different professions, and make informed decisions about their education and future. 
Keep responses concise (2-3 paragraphs max), encouraging, and actionable.
Always relate your advice to practical steps the student can take.

Student's message: ${message}`
                }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500
            }
          })
        }
      );

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]) {
        const reply = data.candidates[0].content.parts[0].text;
        return res.json({ reply });
      }
    } catch (apiError) {
      console.error('Gemini API error:', apiError.message);
    }

    // Fallback if API fails
    const fallbackResponse = getFallbackResponse(message);
    res.json({ reply: fallbackResponse });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Server error during chat' });
  }
};

// Intelligent fallback responses when no API key is configured
function getFallbackResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes('engineer') || msg.includes('software') || msg.includes('coding') || msg.includes('programming')) {
    return "🚀 Software Engineering is an amazing career choice! Start by learning fundamentals like HTML, CSS, and JavaScript. Then explore frameworks like React or Node.js. Build projects, contribute to open source, and practice coding challenges on platforms like LeetCode. A CS degree helps, but many successful developers are self-taught. The key is consistent practice and building a strong portfolio!";
  }
  if (msg.includes('doctor') || msg.includes('medicine') || msg.includes('medical')) {
    return "🏥 Medicine is a rewarding but demanding career path. You'll need strong foundations in Biology, Chemistry, and Physics. Prepare for entrance exams like NEET (India) or MCAT (US). Medical school typically takes 4-6 years, followed by residency. Volunteer at hospitals, shadow doctors, and stay curious about human health. Your compassion and dedication will make a difference!";
  }
  if (msg.includes('design') || msg.includes('ux') || msg.includes('ui') || msg.includes('creative')) {
    return "🎨 Design is where creativity meets problem-solving! Start learning tools like Figma, Adobe XD, or Sketch. Study design principles, color theory, and typography. Build a portfolio with personal projects and redesign challenges. UX/UI designers are in high demand — focus on understanding user needs and creating intuitive interfaces. Take online courses on platforms like Coursera or Interaction Design Foundation!";
  }
  if (msg.includes('business') || msg.includes('entrepreneur') || msg.includes('startup')) {
    return "💼 Business and Entrepreneurship offer incredible opportunities! Start by understanding fundamentals — finance, marketing, and operations. Read books like 'The Lean Startup' and 'Zero to One'. Consider an MBA if you want structured learning, but real-world experience is invaluable. Start small: solve a real problem, validate your idea, and iterate. Network actively and learn from mentors!";
  }
  if (msg.includes('data') || msg.includes('analytics') || msg.includes('ai') || msg.includes('machine learning')) {
    return "📊 Data Science and AI are among the fastest-growing fields! Start with Python and statistics, then learn libraries like Pandas, NumPy, and scikit-learn. Understand SQL for data manipulation. For AI/ML, explore TensorFlow or PyTorch. Kaggle competitions are great practice. A strong math background helps — focus on linear algebra, calculus, and probability. Build projects with real datasets!";
  }
  if (msg.includes('law') || msg.includes('lawyer') || msg.includes('legal')) {
    return "⚖️ Law is a prestigious career that combines critical thinking with advocacy. Develop strong reading, writing, and argumentation skills. Prepare for entrance exams like CLAT (India) or LSAT (US). Law school takes 3-5 years. Participate in debate clubs, moot courts, and internships at law firms. Specialize in areas that interest you — corporate law, criminal law, or intellectual property!";
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "👋 Hello! I'm PathBot, your career guidance assistant. I can help you explore career paths, understand different professions, and plan your educational journey. What career or field are you curious about? Feel free to ask me anything!";
  }
  if (msg.includes('help') || msg.includes('what can you do')) {
    return "🌟 I'm PathBot, and I'm here to help you navigate your career journey! I can help with:\n\n• Exploring different career paths\n• Understanding required skills and education\n• Suggesting learning resources\n• Providing exam and preparation guidance\n• Offering career-specific advice\n\nJust ask me about any career field you're interested in!";
  }

  return "🌟 That's a great question! Career exploration is all about discovering what excites you and building the right skills. I'd recommend starting with self-assessment — what subjects do you enjoy? What problems do you like solving? Take our career quiz to get personalized recommendations, and explore the career cards on your dashboard. I'm here to help you find your path! What specific career field interests you?";
}

module.exports = { chat };
