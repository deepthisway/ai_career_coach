"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


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

        if(!industryInsight)  {
          industryInsight = await tx.industryInsights.create({
            data: {
              industry: data.industry,
              salaryRanges: [],
              growthRate: 1.1,
              demandLevel: 'High',
              topSkills: [],
              marketOutlook: 'Positive',
              keyTrends: [],
              recommendedSkills: [],
              nextUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
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