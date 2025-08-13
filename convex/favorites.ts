import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get user's favorite artworks
export const getUserFavorites = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    // Get Convex user from Clerk user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!user) {
      return [];
    }
    
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
    
    // Get artwork details for each favorite
    const favoritesWithArtworks = await Promise.all(
      favorites.map(async (favorite) => {
        const artwork = await ctx.db.get(favorite.artworkId);
        if (!artwork) return null;
        
        const artist = await ctx.db.get(artwork.artistId);
        
        return {
          ...favorite,
          artwork: {
            ...artwork,
            artist: artist ? {
              _id: artist._id,
              name: artist.name,
              profileImage: artist.profileImage,
              isVerified: artist.isVerified,
            } : null,
          },
        };
      })
    );
    
    return favoritesWithArtworks.filter(Boolean);
  },
});

// Check if artwork is favorited by user
export const isArtworkFavorited = query({
  args: {
    clerkUserId: v.string(),
    artworkId: v.id("artworks"),
  },
  handler: async (ctx, args) => {
    // Get Convex user from Clerk user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!user) {
      return false;
    }
    
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_artwork", (q) => 
        q.eq("userId", user._id).eq("artworkId", args.artworkId)
      )
      .first();
    
    return !!favorite;
  },
});

// Add artwork to favorites
export const addToFavorites = mutation({
  args: {
    clerkUserId: v.string(),
    artworkId: v.id("artworks"),
  },
  handler: async (ctx, args) => {
    // Get Convex user from Clerk user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Check if already favorited
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_artwork", (q) => 
        q.eq("userId", user._id).eq("artworkId", args.artworkId)
      )
      .first();
    
    if (existing) {
      throw new Error("Artwork is already in favorites");
    }
    
    return await ctx.db.insert("favorites", {
      userId: user._id,
      artworkId: args.artworkId,
      createdAt: Date.now(),
    });
  },
});

// Remove artwork from favorites
export const removeFromFavorites = mutation({
  args: {
    clerkUserId: v.string(),
    artworkId: v.id("artworks"),
  },
  handler: async (ctx, args) => {
    // Get Convex user from Clerk user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_artwork", (q) => 
        q.eq("userId", user._id).eq("artworkId", args.artworkId)
      )
      .first();
    
    if (!favorite) {
      throw new Error("Artwork is not in favorites");
    }
    
    return await ctx.db.delete(favorite._id);
  },
});

// Toggle favorite status
export const toggleFavorite = mutation({
  args: {
    clerkUserId: v.string(),
    artworkId: v.id("artworks"),
  },
  handler: async (ctx, args) => {
    // Get Convex user from Clerk user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_artwork", (q) => 
        q.eq("userId", user._id).eq("artworkId", args.artworkId)
      )
      .first();
    
    if (existing) {
      await ctx.db.delete(existing._id);
      return { action: "removed", favoriteId: existing._id };
    } else {
      const favoriteId = await ctx.db.insert("favorites", {
        userId: user._id,
        artworkId: args.artworkId,
        createdAt: Date.now(),
      });
      return { action: "added", favoriteId };
    }
  },
});

// Get favorite count for artwork
export const getArtworkFavoriteCount = query({
  args: { artworkId: v.id("artworks") },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_artwork", (q) => q.eq("artworkId", args.artworkId))
      .collect();
    
    return favorites.length;
  },
});