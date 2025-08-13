import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get orders for a user
export const getUserOrders = query({
  args: { 
    userId: v.id("users"),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("orders")
      .withIndex("by_buyer", (q) => q.eq("buyerId", args.userId));
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    const orders = await query.order("desc").collect();
    
    // Get artwork and artist details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const artwork = await ctx.db.get(order.artworkId);
        const artist = await ctx.db.get(order.artistId);
        
        return {
          ...order,
          artwork: artwork ? {
            _id: artwork._id,
            title: artwork.title,
            images: artwork.images,
            price: artwork.price,
            currency: artwork.currency,
          } : null,
          artist: artist ? {
            _id: artist._id,
            name: artist.name,
            profileImage: artist.profileImage,
          } : null,
        };
      })
    );
    
    return ordersWithDetails;
  },
});

// Get orders for an artist
export const getArtistOrders = query({
  args: { 
    artistId: v.id("users"),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("orders")
      .withIndex("by_artist", (q) => q.eq("artistId", args.artistId));
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    const orders = await query.order("desc").collect();
    
    // Get artwork and buyer details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const artwork = await ctx.db.get(order.artworkId);
        const buyer = await ctx.db.get(order.buyerId);
        
        return {
          ...order,
          artwork: artwork ? {
            _id: artwork._id,
            title: artwork.title,
            images: artwork.images,
            price: artwork.price,
            currency: artwork.currency,
          } : null,
          buyer: buyer ? {
            _id: buyer._id,
            name: buyer.name,
            email: buyer.email,
          } : null,
        };
      })
    );
    
    return ordersWithDetails;
  },
});

// Create a new order
export const createOrder = mutation({
  args: {
    buyerId: v.id("users"),
    artworkId: v.id("artworks"),
    shippingAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      postalCode: v.string(),
      country: v.string(),
    }),
    paymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const artwork = await ctx.db.get(args.artworkId);
    if (!artwork) {
      throw new Error("Artwork not found");
    }
    
    if (!artwork.isAvailable) {
      throw new Error("Artwork is no longer available");
    }
    
    const orderId = await ctx.db.insert("orders", {
      buyerId: args.buyerId,
      artworkId: args.artworkId,
      artistId: artwork.artistId,
      status: "pending",
      totalAmount: artwork.price,
      currency: artwork.currency,
      shippingAddress: args.shippingAddress,
      paymentIntentId: args.paymentIntentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Mark artwork as unavailable
    await ctx.db.patch(args.artworkId, {
      isAvailable: false,
      updatedAt: Date.now(),
    });
    
    return orderId;
  },
});

// Update order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    trackingNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { orderId, ...updateData } = args;
    
    const order = await ctx.db.get(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    
    // If order is being cancelled, make artwork available again
    if (args.status === "cancelled" && order.status !== "cancelled") {
      await ctx.db.patch(order.artworkId, {
        isAvailable: true,
        updatedAt: Date.now(),
      });
    }
    
    return await ctx.db.patch(orderId, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Get order by ID
export const getOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;
    
    const artwork = await ctx.db.get(order.artworkId);
    const artist = await ctx.db.get(order.artistId);
    const buyer = await ctx.db.get(order.buyerId);
    
    return {
      ...order,
      artwork: artwork ? {
        _id: artwork._id,
        title: artwork.title,
        description: artwork.description,
        images: artwork.images,
        price: artwork.price,
        currency: artwork.currency,
        medium: artwork.medium,
        dimensions: artwork.dimensions,
      } : null,
      artist: artist ? {
        _id: artist._id,
        name: artist.name,
        email: artist.email,
        profileImage: artist.profileImage,
      } : null,
      buyer: buyer ? {
        _id: buyer._id,
        name: buyer.name,
        email: buyer.email,
      } : null,
    };
  },
});