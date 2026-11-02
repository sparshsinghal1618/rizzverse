// RIZZVERSE WebLLM Integration - Runs AI in browser
import * as webllm from "https://esm.run/@mlc-ai/web-llm";

class RizzverseAI {
    constructor() {
        this.engine = null;
        this.isReady = false;
        this.modelId = "Llama-3.2-3B-Instruct-q4f32_1-MLC";
    }
    
    async initialize() {
        try {
            this.engine = await webllm.CreateMLCEngine(this.modelId, {
                initProgressCallback: (progress) => {
                    console.log("Loading RIZZVERSE AI:", progress.text);
                    this.updateLoadingUI(progress.text);
                }
            });
            this.isReady = true;
            this.hideLoadingUI();
            console.log("RIZZVERSE AI Ready!");
            return true;
        } catch (error) {
            console.error("Failed to load AI:", error);
            this.showErrorUI();
            return false;
        }
    }
    
    updateLoadingUI(text) {
        const loader = document.getElementById('ai-loader');
        const loaderText = document.getElementById('ai-loader-text');
        if (loader && loaderText) {
            loader.style.display = 'flex';
            loaderText.textContent = text;
        }
    }
    
    hideLoadingUI() {
        const loader = document.getElementById('ai-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
    
    showErrorUI() {
        const loader = document.getElementById('ai-loader');
        const loaderText = document.getElementById('ai-loader-text');
        if (loader && loaderText) {
            loaderText.textContent = 'Failed to load AI. Using demo mode.';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 3000);
        }
    }
    
    async analyzeConversation(messages, context = '') {
        if (!this.isReady) {
            return this.getDemoAnalysis();
        }
        
        const conversationText = messages.map(m => `${m.sender}: ${m.content}`).join('\n');
        const prompt = `You are RIZZVERSE, the ultimate AI wingman. Analyze this conversation with extreme precision.

CONVERSATION:
${conversationText}

${context ? `CONTEXT: ${context}` : ''}

Analyze and return ONLY valid JSON in this exact format:
{
  "rizzScore": number (0-100),
  "vibe": "Playful|Interested|Friendly|Flirty|Neutral|Dry|Uncertain|Distant",
  "verdict": "string (personalized, witty explanation)",
  "personalityBreakdown": {
    "confidence": number, "humour": number, "creativity": number, "naturalness": number,
    "emotionalIntelligence": number, "conversationalFlow": number, "listeningSkills": number,
    "messageQuality": number, "communicationBalance": number
  },
  "conversationHealth": {
    "oneSided": boolean, "followUpQuestions": number, "positiveEngagement": number,
    "repetitive": boolean, "possibleMisunderstandings": boolean,
    "awkwardMoments": [], "opportunities": []
  },
  "suggestions": [{"title": "string", "description": "string", "priority": "high|medium|low"}],
  "whatToDoNext": ["string", "string", "string"]
}

Be honest, witty, Gen Z fluent but not cringe. Never guarantee interest. Focus on actionable advice.`;

        try {
            const response = await this.engine.chat.completions.create({
                messages: [
                    { role: "system", content: "You are RIZZVERSE, expert AI wingman. Always return valid JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 800,
            });
            
            const content = response.choices[0].message.content;
            return JSON.parse(content);
        } catch (error) {
            console.error("Analysis error:", error);
            return this.getDemoAnalysis();
        }
    }
    
    async generateReply(messages, style = 'natural', adjustments = []) {
        if (!this.isReady) {
            return this.getDemoReply(style);
        }
        
        const conversationText = messages.map(m => `${m.sender}: ${m.content}`).join('\n');
        const lastMessage = messages[messages.length - 1];
        
        const styleInstructions = {
            smooth: "Effortlessly charming and natural, like you don't even try but somehow do",
            funny: "Clever and witty, make them laugh without trying too hard",
            flirty: "Playful romantic energy, subtle and respectful, never creepy",
            nonchalant: "Relaxed and confident, casually cool without overthinking",
            bold: "Direct but respectful, confident without being pushy",
            mysterious: "Intriguing without being manipulative, leaves them wanting to know more",
            wholesome: "Sweet and genuine, heartfelt without being sappy",
            chaotic: "Funny internet-style energy, unhinged in a charming way",
            sassy: "Playful confidence with a bit of bite, never mean",
            natural: "Sounds like an actual human texting, casual and authentic"
        };
        
        const prompt = `Generate ONE reply as the user responding to: "${lastMessage.content}"

Conversation:
${conversationText}

Style: ${style.toUpperCase()} - ${styleInstructions[style]}
${adjustments.length ? 'Adjustments: ' + adjustments.join(', ') : ''}

Rules:
- Generate ONLY the reply text, nothing else
- Keep it natural for texting
- Don't use excessive emojis
- Be contextually appropriate
- Never be desperate or pushy
- Match conversation energy
- Sound human, not AI

Reply:`;

        try {
            const response = await this.engine.chat.completions.create({
                messages: [
                    { role: "system", content: "You are RIZZVERSE reply generator. Generate only the reply text." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 150,
            });
            
            return response.choices[0].message.content.trim().replace(/"/g, '');
        } catch (error) {
            console.error("Reply error:", error);
            return this.getDemoReply(style);
        }
    }
    
    async chatWithWingman(message, history = []) {
        if (!this.isReady) {
            return this.getDemoWingmanResponse();
        }
        
        const messages = [
            { role: "system", content: `You are RIZZVERSE, the ultimate AI wingman. 
Witty, intelligent, slightly sarcastic but supportive. Gen Z fluent without being cringe.
Give practical advice, read situations well, be honest but kind.
Never encourage manipulation or harassment. Prioritize respect and boundaries.
Keep responses conversational and actionable.` },
            ...history,
            { role: "user", content: message }
        ];
        
        try {
            const response = await this.engine.chat.completions.create({
                messages: messages,
                temperature: 0.8,
                max_tokens: 300,
            });
            
            return response.choices[0].message.content;
        } catch (error) {
            console.error("Chat error:", error);
            return this.getDemoWingmanResponse();
        }
    }
    
    getDemoAnalysis() {
        return {
            rizzScore: Math.floor(Math.random() * 30) + 65,
            vibe: ["Playful", "Interested", "Flirty"][Math.floor(Math.random() * 3)],
            verdict: "There's definitely some chemistry here. Keep the energy playful and don't overthink it. They're engaging with you, which is a good sign.",
            personalityBreakdown: {
                confidence: Math.floor(Math.random() * 20) + 70,
                humour: Math.floor(Math.random() * 20) + 75,
                creativity: Math.floor(Math.random() * 20) + 70,
                naturalness: Math.floor(Math.random() * 20) + 75,
                emotionalIntelligence: Math.floor(Math.random() * 20) + 72,
                conversationalFlow: Math.floor(Math.random() * 20) + 78,
                listeningSkills: Math.floor(Math.random() * 20) + 73,
                messageQuality: Math.floor(Math.random() * 20) + 76,
                communicationBalance: Math.floor(Math.random() * 20) + 74
            },
            conversationHealth: {
                oneSided: false,
                followUpQuestions: Math.floor(Math.random() * 4) + 2,
                positiveEngagement: Math.floor(Math.random() * 3) + 3,
                repetitive: false,
                possibleMisunderstandings: false,
                awkwardMoments: [],
                opportunities: ["Ask about their interests more", "Share something personal"]
            },
            suggestions: [
                {title: "Keep the momentum", description: "They're engaged, keep the conversation flowing naturally.", priority: "high"},
                {title: "Show genuine interest", description: "Ask follow-up questions about things they mention.", priority: "high"},
                {title: "Stay authentic", description: "Don't overthink it, your natural energy is working.", priority: "medium"}
            ],
            whatToDoNext: ["Keep the playful banter going", "Ask them about something they mentioned", "Be yourself and don't force it"]
        };
    }
    
    getDemoReply(style) {
        const replies = {
            smooth: ["only if i get to pick the snacks lmaoo", "sounds like a plan, when's good for you?", "i'd say yes but i need to know if you're buying"],
            funny: ["was kidnapped by my bed and refused to be rescued lmaoo", "yeah i was busy becoming cooler, how bout you?", "my wifi went down and i had to talk to people irl, tragic"],
            flirty: ["only if you save me a seat next to you", "depends, are you gonna make it worth my while?", "if you ask nicely maybe i'll consider it"],
            nonchalant: ["sure could be fun", "yeah why not", "hit me with the details"],
            bold: ["i'm free friday, you got plans?", "wanna do something about that or what?", "tell me when and where"],
            mysterious: ["maybe... depends on your pitch", "i'll think about it, impress me", "could be interesting, tell me more"],
            wholesome: ["that sounds really sweet of you", "aww that made me smile fr", "you seem really cool actually"],
            chaotic: ["NAHHHH say less i'm on my way", "absolutely unhinged and i respect it", "let's cause problems together fr"],
            sassy: ["oh so now you want to talk huh", "took you long enough lmaoo", "bold of you to assume i was waiting"],
            natural: ["nice, what about you?", "sounds fun fr, you down for that?", "lmaoo same honestly"]
        };
        const styleReplies = replies[style] || replies.natural;
        return styleReplies[Math.floor(Math.random() * styleReplies.length)];
    }
    
    getDemoWingmanResponse() {
        const responses = [
            "Alright spill the tea, what's the situation?",
            "Ooh I like your energy. Walk me through this.",
            "Say less, I got you. Tell me everything.",
            "Bet. Give me context and I'll cook up something solid.",
            "ayee what's the vibe here? lay it on me",
            "lmaoo sounds interesting, tell me more fr"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Global instance
window.rizzAI = new RizzverseAI();

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', async function() {
    // Add AI loader to page if not exists
    if (!document.getElementById('ai-loader')) {
        const loader = document.createElement('div');
        loader.id = 'ai-loader';
        loader.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; z-index: 10000; 
                        background: rgba(13, 9, 23, 0.9); backdrop-filter: blur(10px);
                        padding: 12px 20px; border-radius: 12px; border: 1px solid rgba(255, 61, 154, 0.5);
                        display: flex; align-items: center; gap: 10px; color: white;">
                <div style="width: 20px; height: 20px; border: 2px solid rgba(255, 61, 154, 0.3); 
                            border-top: 2px solid #FF3D9A; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span id="ai-loader-text" style="font-size: 12px;">Loading RIZZVERSE AI...</span>
            </div>
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
        `;
        document.body.appendChild(loader);
    }
    
    // Initialize AI
    await window.rizzAI.initialize();
});
