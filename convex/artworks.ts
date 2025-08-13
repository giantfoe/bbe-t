import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all artworks with pagination
export const getArtworks = query({
  args: {
    paginationOpts: v.optional(v.object({
      numItems: v.number(),
      cursor: v.optional(v.string()),
    })),
    category: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    isAvailable: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("artworks");
    
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    if (args.isAvailable !== undefined) {
      query = query.filter((q) => q.eq(q.field("isAvailable"), args.isAvailable));
    }
    
    if (args.isFeatured !== undefined) {
      query = query.filter((q) => q.eq(q.field("isFeatured"), args.isFeatured));
    }
    
    if (args.minPrice !== undefined) {
      const minPrice = args.minPrice;
      query = query.filter((q) => q.gte(q.field("price"), minPrice));
    }
    
    if (args.maxPrice !== undefined) {
      const maxPrice = args.maxPrice;
      query = query.filter((q) => q.lte(q.field("price"), maxPrice));
    }
    
    const paginationOpts = args.paginationOpts || { numItems: 12 };
    const results = await query.paginate({
      numItems: paginationOpts.numItems,
      cursor: paginationOpts.cursor || null,
    });
    
    // Get artist information for each artwork
    const artworksWithArtists = await Promise.all(
      results.page.map(async (artwork) => {
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
      ...results,
      page: artworksWithArtists,
    };
  },
});

// Get artwork by ID
export const getArtwork = query({
  args: { id: v.id("artworks") },
  handler: async (ctx, args) => {
    const artwork = await ctx.db.get(args.id);
    if (!artwork) return null;
    
    const artist = await ctx.db.get(artwork.artistId);
    
    return {
      ...artwork,
      artist: artist ? {
        _id: artist._id,
        name: artist.name,
        profileImage: artist.profileImage,
        bio: artist.bio,
        location: artist.location,
        website: artist.website,
        socialLinks: artist.socialLinks,
        isVerified: artist.isVerified,
      } : null,
    };
  },
});

// Get artworks by artist
export const getArtworksByArtist = query({
  args: { 
    artistId: v.id("users"),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("artworks")
      .withIndex("by_artist", (q) => q.eq("artistId", args.artistId));
    
    if (args.isAvailable !== undefined) {
      query = query.filter((q) => q.eq(q.field("isAvailable"), args.isAvailable));
    }
    
    return await query.collect();
  },
});

// Get featured artworks
export const getFeaturedArtworks = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 8;
    const artworks = await ctx.db
      .query("artworks")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .filter((q) => q.eq(q.field("isAvailable"), true))
      .take(limit);
    
    // Get artist information for each artwork
    const artworksWithArtists = await Promise.all(
      artworks.map(async (artwork) => {
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
    
    return artworksWithArtists;
  },
});

// Search artworks
export const searchArtworks = query({
  args: { 
    searchTerm: v.string(),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    let query = ctx.db.query("artworks");
    
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    const artworks = await query
      .filter((q) => q.eq(q.field("isAvailable"), true))
      .collect();
    
    // Simple text search in title, description, and tags
    const searchTerm = args.searchTerm.toLowerCase();
    const filteredArtworks = artworks
      .filter((artwork) => {
        const titleMatch = artwork.title.toLowerCase().includes(searchTerm);
        const descriptionMatch = artwork.description.toLowerCase().includes(searchTerm);
        const tagsMatch = artwork.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        return titleMatch || descriptionMatch || tagsMatch;
      })
      .slice(0, limit);
    
    // Get artist information for each artwork
    const artworksWithArtists = await Promise.all(
      filteredArtworks.map(async (artwork) => {
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
    
    return artworksWithArtists;
  },
});