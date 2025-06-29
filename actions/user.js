"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";


export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  // console.log("user id is:", userId);

  const user = await db.user.findUnique({
    where: { clerkUserID: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const result = await db.$transaction(async(tx)=> {
        let industryInsight = await tx.industryInsights.findUnique({
          where: { industry: data.industry },
        });

        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);
          if (!insights) throw new Error("Failed to generate insights");
          industryInsight = await tx.industryInsights.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            },
          });
        }

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            industry: data.industry,
            experience: data.experience,
            skills: data.skills,
            bio: data.bio,
          },
        });
        return {
          user: updatedUser,
          industryInsight,
        };
    }, {
      timeout: 10000, // giving it 10 seconds to generate the insights
    })
    return {success: true, ...result}
    }
    catch (error) {
      console.error("Error checking onboarding status:", error);
      throw new Error("Failed to check onboarding status");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserID: userId,
      },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}