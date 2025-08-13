import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get user's collections
export const getUserCollections = query({
  args: { 
    userId: v.id("users"),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("collections")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));
    
    if (args.isPublic !== undefined) {
      query = query.filter((q) => q.eq(q.field("isPublic"), args.isPublic));
    }
    
    const collections = await query.order("desc").collect();
    
    // Get artwork count and preview images for each collection
    const collectionsWithDetails = await Promise.all(
      collections.map(async (collection) => {
        const artworks = await Promise.all(
          collection.artworkIds.slice(0, 4).map(id => ctx.db.get(id))
        );
        
        const validArtworks = artworks.filter(Boolean);
        
        return {
          ...collection,
          artworkCount: collection.artworkIds.length,
          previewArtworks: validArtworks.map(artwork => ({
            _id: artwork!._id,
            title: artwork!.title,
            images: artwork!.images,
          })),
        };
      })
    );
    
    return collectionsWithDetails;
  },
});

// Get public collections
export const getPublicCollections = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const collections = await ctx.db
      .query("collections")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .take(limit);
    
    // Get user and artwork details for each collection
    const collectionsWithDetails = await Promise.all(
      collections.map(async (collection) => {
        const user = await ctx.db.get(collection.userId);
        const artworks = await Promise.all(
          collection.artworkIds.slice(0, 4).map(id => ctx.db.get(id))
        );
        
        const validArtworks = artworks.filter(Boolean);
        
        return {
          ...collection,
          user: user ? {
            _id: user._id,
            name: user.name,
            profileImage: user.profileImage,
          } : null,
          artworkCount: collection.artworkIds.length,
          previewArtworks: validArtworks.map(artwork => ({
            _id: artwork!._id,
            title: artwork!.title,
            images: artwork!.images,
          })),
        };
      })
    );
    
    return collectionsWithDetails;
  },
});

// Get collection by ID
export const getCollection = query({
  args: { collectionId: v.id("collections") },
  handler: async (ctx, args) => {
    const collection = await ctx.db.get(args.collectionId);
    if (!collection) return null;
    
    const user = await ctx.db.get(collection.userId);
    
    // Get all artworks in the collection
    const artworks = await Promise.all(
      collection.artworkIds.map(async (artworkId) => {
        const artwork = await ctx.db.get(artworkId);
        if (!artwork) return null;
        
        const artist = await ctx.db.get(artwork.artistId);
        
        return {
          ...artwork,
          artist: artist ? {
            _id: artist._id,
            name: artist.name,
            profileImage: artist.profileImage,
            isVerified: artist.isVerified,
          } : null,
        };
      })
    );
    
    return {
      ...collection,
      user: user ? {
        _id: user._id,
        name: user.name,
        profileImage: user.profileImage,
        bio: user.bio,
      } : null,
      artworks: artworks.filter(Boolean),
    };
  },
});

// Create a new collection
export const createCollection = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),
    isPublic: v.boolean(),
    coverImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("collections", {
      ...args,
      artworkIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update collection
export const updateCollection = mutation({
  args: {
    collectionId: v.id("collections"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    coverImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { collectionId, ...updateData } = args;
    
    return await ctx.db.patch(collectionId, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Add artwork to collection
export const addArtworkToCollection = mutation({
  args: {
    collectionId: v.id("collections"),
    artworkId: v.id("artworks"),
  },
  handler: async (ctx, args) => {
    const collection = await ctx.db.get(args.collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }
    
    if (collection.artworkIds.includes(args.artworkId)) {
      throw new Error("Artwork is already in this collection");
    }
    
    return await ctx.db.patch(args.collectionId, {
      artworkIds: [...collection.artworkIds, args.artworkId],
      updatedAt: Date.now(),
    });
  },
});

// Remove artwork from collection
export const removeArtworkFromCollection = mutation({
  args: {
    collectionId: v.id("collections"),
    artworkId: v.id("artworks"),
  },
  handler: async (ctx, args) => {
    const collection = await ctx.db.get(args.collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }
    
    const updatedArtworkIds = collection.artworkIds.filter(
      id => id !== args.artworkId
    );
    
    return await ctx.db.patch(args.collectionId, {
      artworkIds: updatedArtworkIds,
      updatedAt: Date.now(),
    });
  },
});

// Delete collection
export const deleteCollection = mutation({
  args: { collectionId: v.id("collections") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.collectionId);
  },
});