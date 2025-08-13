import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Migration function to add Clerk IDs to existing users
// This should be run manually after the schema update
export const addClerkIdToUser = mutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!user) {
      throw new Error(`User with email ${args.email} not found`);
    }
    
    if (user.clerkId) {
      throw new Error(`User ${args.email} already has a Clerk ID: ${user.clerkId}`);
    }
    
    await ctx.db.patch(user._id, {
      clerkId: args.clerkId,
      updatedAt: Date.now(),
    });
    
    return { success: true, userId: user._id, clerkId: args.clerkId };
  },
});

// Helper function to create a user with Clerk ID if they don't exist
export const createUserWithClerkId = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    clerkId: v.string(),
    role: v.optional(v.union(v.literal("buyer"), v.literal("artist"), v.literal("admin"))),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists with this Clerk ID
    const existingUserByClerkId = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (existingUserByClerkId) {
      return existingUserByClerkId;
    }
    
    // Check if user exists by email
    const existingUserByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existingUserByEmail) {
      // Update existing user with Clerk ID
      await ctx.db.patch(existingUserByEmail._id, {
        clerkId: args.clerkId,
        name: args.name,
        profileImage: args.profileImage,
        updatedAt: Date.now(),
      });
      return existingUserByEmail;
    }
    
    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      clerkId: args.clerkId,
      role: args.role || "buyer",
      profileImage: args.profileImage,
      isVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return await ctx.db.get(userId);
  },
});