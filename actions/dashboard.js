import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

export async function generateAIInsights(industry)    {
    console.log("genAI fxn called")
    const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            
            if (!response || !response.text) {
                throw new Error("No response from AI model");
            }
            
            const text = response.text();
            const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

            return JSON.parse(cleanedText);
        } catch (error) {
            console.error("Error generating AI insights:", error);
            throw new Error("Failed to generate AI insights");
        }
}

export async function getIndustryInsights() {
    // check if the user is logged in
    const { userId } = await auth();
    if(!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: {
            clerkUserID: userId,
        },
        include: {
            industryInsight: true
        }
    });
    if(!user) throw new Error("User not found");

    if(!user.industryInsight)  {
        //generate insights for the user
        const insights = await generateAIInsights(user.industry);
        if(!insights) throw new Error("Failed to generate insights");
        const industryInsight = await db.industryInsights.create({
            data:{
                industry: user.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            }
        })
        return {
            success: true,
            industryInsight,
        };
    }
    // if insights already exist
    return user.industryInsight;
}