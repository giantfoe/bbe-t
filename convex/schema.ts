import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    clerkId: v.optional(v.string()), // Clerk user ID for mapping
    role: v.optional(v.union(v.literal("buyer"), v.literal("artist"), v.literal("admin"))),
    profileImage: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      instagram: v.optional(v.string()),
      twitter: v.optional(v.string()),
      facebook: v.optional(v.string()),
    })),
    isVerified: v.optional(v.boolean()),
    createdAt: v.union(v.number(), v.string()),
    updatedAt: v.optional(v.union(v.number(), v.string())),
    // Legacy fields
    avatarUrl: v.optional(v.string()),
    walletAddress: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_clerk_id", ["clerkId"]),

  artworks: defineTable({
    title: v.string(),
    description: v.string(),
    artistId: v.id("users"),
    category: v.union(
      v.literal("painting"),
      v.literal("sculpture"),
      v.literal("photography"),
      v.literal("digital"),
      v.literal("mixed-media"),
      v.literal("drawing")
    ),
    medium: v.string(),
    dimensions: v.object({
      width: v.number(),
      height: v.number(),
      depth: v.optional(v.number()),
      unit: v.union(v.literal("cm"), v.literal("in")),
    }),
    price: v.number(),
    currency: v.string(),
    images: v.array(v.object({
      url: v.string(),
      alt: v.string(),
      isPrimary: v.boolean(),
    })),
    tags: v.array(v.string()),
    isAvailable: v.boolean(),
    isFeatured: v.boolean(),
    yearCreated: v.optional(v.number()),
    edition: v.optional(v.object({
      current: v.number(),
      total: v.number(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_artist", ["artistId"])
    .index("by_category", ["category"])
    .index("by_availability", ["isAvailable"])
    .index("by_featured", ["isFeatured"])
    .index("by_price", ["price"]),

  orders: defineTable({
    buyerId: v.id("users"),
    artworkId: v.id("artworks"),
    artistId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    totalAmount: v.number(),
    currency: v.string(),
    shippingAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      postalCode: v.string(),
      country: v.string(),
    }),
    paymentIntentId: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_buyer", ["buyerId"])
    .index("by_artist", ["artistId"])
    .index("by_artwork", ["artworkId"])
    .index("by_status", ["status"]),

  favorites: defineTable({
    userId: v.id("users"),
    artworkId: v.id("artworks"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_artwork", ["artworkId"])
    .index("by_user_artwork", ["userId", "artworkId"]),

  collections: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),
    artworkIds: v.array(v.id("artworks")),
    isPublic: v.boolean(),
    coverImage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_public", ["isPublic"]),

  cart: defineTable({
    userId: v.id("users"),
    artworkId: v.id("artworks"),
    quantity: v.number(),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_artwork", ["artworkId"])
    .index("by_user_artwork", ["userId", "artworkId"]),

  reviews: defineTable({
    orderId: v.optional(v.id("orders")),
    buyerId: v.optional(v.id("users")),
    artistId: v.optional(v.id("users")),
    artworkId: v.optional(v.id("artworks")),
    rating: v.number(), // 1-5
    comment: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    // Legacy fields for existing data
    author: v.optional(v.string()),
    title: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    avatarImgixUrl: v.optional(v.string()),
  })
    .index("by_order", ["orderId"])
    .index("by_buyer", ["buyerId"])
    .index("by_artist", ["artistId"])
    .index("by_artwork", ["artworkId"]),

  promoCodes: defineTable({
    code: v.string(),
    discountType: v.union(v.literal("percentage"), v.literal("fixed")),
    discountValue: v.number(),
    minOrderAmount: v.optional(v.number()),
    maxUses: v.optional(v.number()),
    usedCount: v.number(),
    expiresAt: v.optional(v.number()),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_active", ["isActive"]),
});