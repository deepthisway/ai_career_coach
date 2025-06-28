import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserID: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserID: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};

// why are we creating the user directly in the database?
// basically, we are checking if the user exists in our database
// Because Clerk's user object is not directly accessible in the database.
// We need to create a corresponding user in our database to manage user-specific data.
// This function checks if the user exists in our database and creates them if they don't.
// This is useful for ensuring that we have a user record in our database
// that corresponds to the Clerk user, allowing us to manage user-specific data
// and permissions within our application.
