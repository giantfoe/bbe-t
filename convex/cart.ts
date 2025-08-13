import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get user's cart items
export const getUserCart = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    // Get Convex user from Clerk user ID
    const convexUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!convexUser) {
      return [];
    }
    
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", convexUser._id))
      .collect();

    // Get artwork details for each cart item
    const cartWithArtworks = await Promise.all(
      cartItems.map(async (item) => {
        const artwork = await ctx.db.get(item.artworkId);
        if (!artwork) return null;
        
        const artist = await ctx.db.get(artwork.artistId);
        
        return {
          ...item,
          artwork: {
            ...artwork,
            artist: artist ? {
              _id: artist._id,
              name: artist.name,
              profileImage: artist.profileImage,
              isVerified: artist.isVerified
            } : null
          }
        };
      })
    );

    return cartWithArtworks.filter(Boolean);
  },
});

// Add item to cart
export const addToCart = mutation({
  args: {
    clerkUserId: v.string(),
    artworkId: v.id("artworks"),
    quantity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const quantity = args.quantity || 1;
    
    // Get or create Convex user from Clerk user ID
    let convexUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!convexUser) {
      // Create user if doesn't exist
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkUserId,
        name: "User", // Will be updated when user profile is completed
        email: "", // Will be updated when user profile is completed
        createdAt: Date.now(),
      });
      convexUser = await ctx.db.get(userId);
    }
    
    if (!convexUser) {
      throw new Error("Failed to create or retrieve user");
    }
    
    // Check if artwork exists and is available
    const artwork = await ctx.db.get(args.artworkId);
    if (!artwork) {
      throw new Error("Artwork not found");
    }
    if (!artwork.isAvailable) {
      throw new Error("Artwork is not available");
    }

    // Check if item already exists in cart
    const existingItem = await ctx.db
      .query("cart")
      .withIndex("by_user_artwork", (q) => 
        q.eq("userId", convexUser._id).eq("artworkId", args.artworkId)
      )
      .first();

    if (existingItem) {
      // Update quantity if item already exists
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + quantity,
      });
      return existingItem._id;
    } else {
      // Add new item to cart
      const cartItemId = await ctx.db.insert("cart", {
        userId: convexUser._id,
        artworkId: args.artworkId,
        quantity,
        addedAt: Date.now(),
      });
      return cartItemId;
    }
  },
});

// Remove item from cart
export const removeFromCart = mutation({
  args: {
    clerkUserId: v.string(),
    artworkId: v.id("artworks"),
  },
  handler: async (ctx, args) => {
    // Get Convex user from Clerk user ID
    const convexUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!convexUser) {
      throw new Error("User not found");
    }
    
    const cartItem = await ctx.db
      .query("cart")
      .withIndex("by_user_artwork", (q) => 
        q.eq("userId", convexUser._id).eq("artworkId", args.artworkId)
      )
      .first();

    if (cartItem) {
      await ctx.db.delete(cartItem._id);
      return true;
    }
    return false;
  },
});

// Update cart item quantity
export const updateCartQuantity = mutation({
  args: {
    clerkUserId: v.string(),
    artworkId: v.id("artworks"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    // Get Convex user from Clerk user ID
    const convexUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!convexUser) {
      throw new Error("User not found");
    }
    
    if (args.quantity <= 0) {
      // Remove item if quantity is 0 or negative
      const cartItem = await ctx.db
        .query("cart")
        .withIndex("by_user_artwork", (q) => 
          q.eq("userId", convexUser._id).eq("artworkId", args.artworkId)
        )
        .first();

      if (cartItem) {
        await ctx.db.delete(cartItem._id);
        return true;
      }
      return false;
    }

    const cartItem = await ctx.db
      .query("cart")
      .withIndex("by_user_artwork", (q) => 
        q.eq("userId", convexUser._id).eq("artworkId", args.artworkId)
      )
      .first();

    if (cartItem) {
      await ctx.db.patch(cartItem._id, {
        quantity: args.quantity,
      });
      return true;
    }
    return false;
  },
});

// Clear user's cart
export const clearCart = mutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    // Get Convex user from Clerk user ID
    const convexUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!convexUser) {
      return 0;
    }
    
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", convexUser._id))
      .collect();

    await Promise.all(
      cartItems.map((item) => ctx.db.delete(item._id))
    );

    return cartItems.length;
  },
});

// Get cart item count for a user
export const getCartCount = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    // Get Convex user from Clerk user ID
    const convexUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!convexUser) {
      return 0;
    }
    
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", convexUser._id))
      .collect();

    return cartItems.reduce((total, item) => total + item.quantity, 0);
  },
});

// Check if artwork is in user's cart
export const isInCart = query({
  args: {
    clerkUserId: v.string(),
    artworkId: v.id("artworks"),
  },
  handler: async (ctx, args) => {
    // Get Convex user from Clerk user ID
    const convexUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!convexUser) {
      return 0;
    }
    
    const cartItem = await ctx.db
      .query("cart")
      .withIndex("by_user_artwork", (q) => 
        q.eq("userId", convexUser._id).eq("artworkId", args.artworkId)
      )
      .first();

    return cartItem ? cartItem.quantity : 0;
  },
});