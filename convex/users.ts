import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get user by ID
export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Get Convex user ID by Clerk ID
export const getConvexUserIdByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    return user?._id || null;
  },
});

// Get all artists
export const getArtists = query({
  args: {
    limit: v.optional(v.number()),
    isVerified: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    let query = ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "artist"));
    
    if (args.isVerified !== undefined) {
      query = query.filter((q) => q.eq(q.field("isVerified"), args.isVerified));
    }
    
    const artists = await query.take(limit);
    
    // Get artwork count for each artist
    const artistsWithStats = await Promise.all(
      artists.map(async (artist) => {
        const artworkCount = await ctx.db
          .query("artworks")
          .withIndex("by_artist", (q) => q.eq("artistId", artist._id))
          .filter((q) => q.eq(q.field("isAvailable"), true))
          .collect()
          .then(artworks => artworks.length);
        
        return {
          ...artist,
          artworkCount,
        };
      })
    );
    
    return artistsWithStats;
  },
});

// Create or update user
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    clerkId: v.optional(v.string()),
    role: v.union(v.literal("buyer"), v.literal("artist"), v.literal("admin")),
    profileImage: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      instagram: v.optional(v.string()),
      twitter: v.optional(v.string()),
      facebook: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // Check for existing user by email or Clerk ID
    let existingUser = null;
    
    if (args.clerkId) {
      existingUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .first();
    }
    
    if (!existingUser) {
      existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();
    }
    
    if (existingUser) {
      // Update existing user
      return await ctx.db.patch(existingUser._id, {
        ...args,
        updatedAt: Date.now(),
      });
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        ...args,
        isVerified: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

// Update user profile
export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      instagram: v.optional(v.string()),
      twitter: v.optional(v.string()),
      facebook: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    
    return await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Get user statistics for dashboard
export const getUserStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get total purchases
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_buyer", (q) => q.eq("buyerId", args.userId))
      .collect();
    
    const totalPurchases = orders.length;
    const totalSpent = orders
      .filter(order => order.status === "delivered")
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get favorites count
    const favoritesCount = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
      .then(favorites => favorites.length);
    
    // Get cart count
    const cartCount = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
      .then(cartItems => cartItems.reduce((sum, item) => sum + item.quantity, 0));
    
    // TODO: Add following count when we implement user following
    const followingCount = 0;
    
    return {
      purchases: totalPurchases,
      favorites: favoritesCount,
      following: followingCount,
      spent: totalSpent,
      cartItems: cartCount,
    };
  },
});

// Get artist profile with stats
export const getArtistProfile = query({
  args: { artistId: v.id("users") },
  handler: async (ctx, args) => {
    const artist = await ctx.db.get(args.artistId);
    if (!artist || artist.role !== "artist") {
      return null;
    }
    
    // Get artist's artworks
    const artworks = await ctx.db
      .query("artworks")
      .withIndex("by_artist", (q) => q.eq("artistId", args.artistId))
      .filter((q) => q.eq(q.field("isAvailable"), true))
      .collect();
    
    // Get total sales count
    const totalSales = await ctx.db
      .query("orders")
      .withIndex("by_artist", (q) => q.eq("artistId", args.artistId))
      .filter((q) => q.eq(q.field("status"), "delivered"))
      .collect()
      .then(orders => orders.length);
    
    // Get average rating
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_artist", (q) => q.eq("artistId", args.artistId))
      .collect();
    
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
    
    return {
      ...artist,
      stats: {
        totalArtworks: artworks.length,
        totalSales,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
      },
      artworks: artworks.slice(0, 12), // Latest 12 artworks for preview
    };
  },
});