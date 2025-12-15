const express = require("express");
require('dotenv').config()
const router = express.Router()

async function invokeChute(prompt) {
    try {
        const response = await fetch("https://llm.chutes.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.CHUTES_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 1024,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error invoking Chute:", err);
        return null;
    }
}



router.post("/note/formatter", async (req, res) => {
    const noteData = req.body.note
    const prompt = `Detect the programming language in this note. 
- Fix indentation and syntax errors only in the code. 
- Do not change any text, paragraphs, or other natural language content. 
- Keep everything else exactly as in the note. 
Return only the resulting content: ${noteData}`;

    const chuteResponse = await invokeChute(prompt);
    const formattedNote = chuteResponse.choices?.[0]?.message?.content || "";

    res.status(200).json({
        original: noteData,
        formatted: formattedNote || ""
    });
})

router.post("/note/grammarfix", async (req, res) => {
    const noteData = req.body.note;
    const prompt = `Check the following content. 
- Do not modify any code. Leave all code blocks exactly as they are.
- Correct grammar, punctuation, and readability only in natural language text, comments, and paragraphs, without changing their meaning.
- Keep the original structure, spacing, and code intact.
Return only the corrected content: ${noteData}`;


    const chuteResponse = await invokeChute(prompt);
    const correctedNote = chuteResponse?.choices?.[0]?.message?.content || "";

    res.status(200).json({
        original: noteData,
        corrected: correctedNote
    });
});

router.post("/note/ai", async (req, res) => {
    const { noteData, userPrompt, previousChatsContext } = req.body

    const prompt = `
A user has some queries related to this note: "${noteData}". Here is the previous conversation context (if any) for reference: "${previousChatsContext || 'None'}". Read and understand this note and the previous conversation, then provide a clear, concise, and professional answer to resolve the user's query: "${userPrompt}". Do not add unnecessary explanations, jokes, or filler—focus only on answering the query accurately. You may improve or clarify the answer if needed, but only when it helps make the response more correct or understandable.
`;

    const chuteResponse = await invokeChute(prompt);
    const aiAnswer = chuteResponse?.choices?.[0]?.message?.content || "";

    res.status(200).json({
        userPrompt: userPrompt,
        aiAnswer: aiAnswer
    });

})

module.exports = router;