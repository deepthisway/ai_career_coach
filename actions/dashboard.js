import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function generateAIInsights(industry)    {
    
}

export async function getIndustryInsights() {
    // check if the user is logged in
    const { userId } = await auth();
    if(!useId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: {
            clerkUserID: userId,
        }
    });
    if(!user) throw new Error("User not found");

    if(!user.industryInsights)  {
        //generate insights for the user
    }
}