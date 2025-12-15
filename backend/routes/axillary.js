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
                model: "unsloth/gemma-3-4b-it",
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
    const prompt = `
You are an expert code formatter. Follow these rules strictly:

1. Detect the programming language of all code blocks in the note.
2. Fix only indentation and syntax errors in the code blocks.
3. Do NOT change, summarize, remove, or add anything in natural language text, comments, or paragraphs.
4. Preserve all original spacing, line breaks, and paragraph structure outside of code.
5. If the code is already correct, return the content exactly as it was.
6. Do NOT reformat, paraphrase, or clean up text outside of code.
7. Return ONLY the resulting content, exactly as instructed, with nothing extra.

Content to process:
${noteData}
`;

    const chuteResponse = await invokeChute(prompt);
    const formattedNote = chuteResponse.choices?.[0]?.message?.content || "";

    res.status(200).json({
        original: noteData,
        formatted: formattedNote || ""
    });
})

router.post("/note/grammarfix", async (req, res) => {
    const noteData = req.body.note;
    const prompt = `
You are a precise text editor. Follow these rules strictly:

1. Leave all code blocks and inline code exactly as they are.
2. Correct grammar, punctuation, and readability ONLY in normal text, comments, and paragraphs.
3. Do NOT summarize, add, remove, or alter any content outside of grammar fixes.
4. Preserve all original spacing, indentation, line breaks, and paragraph structure.
5. If no corrections are needed, return the content exactly as it was.
6. Do NOT reformat, paraphrase, or clean up code or text outside grammar corrections.
7. Return ONLY the corrected content, exactly as instructed, with nothing extra.

Content to fix:
${noteData}
`;


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