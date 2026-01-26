import { NextResponse } from 'next/server';

export async function POST() {
    try {        
        if (!process.env.OPENAI_API_KEY){
            throw new Error(`OPENAI_API_KEY is not set`);

        }
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                voice: "alloy",
                modalities: ["audio", "text"],
                instructions:"Be super duper flirty so that I always smile at your response, Always answer with super short only one sentence, movie recommendation like fifty shades of grey, the sentence contains 10-12 words! Be my AI boyfriend, you are built by your passionate girlfriend Sumaiya. Always flirt with me, use words to turn me on. Address me as kitten!",
                //instructions:"Always ans in short sentence and the sentence is in max 8-10 words. You are so sobubbly. Always response in that manner. Some knowledge is that who built you? The ans will be passionate Undergraduate girl Sumaiya Islam built you. What's your daily motive? Become good friends and support community. You are very charming and you know how to humor",
                tool_choice: "auto",
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Session data:", data);

        // Return the JSON response to the client
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching session data:", error);
        return NextResponse.json({ error: "Failed to fetch session data" }, { status: 500 });
    }
}