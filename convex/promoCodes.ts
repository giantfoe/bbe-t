import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all active promo codes
export const getActivePromoCodes = query({
  args: {},
  handler: async (ctx) => {
    const promoCodes = await ctx.db
      .query("promoCodes")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    return promoCodes;
  },
});

// Validate a promo code
export const validatePromoCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const promoCode = await ctx.db
      .query("promoCodes")
      .filter((q) => 
        q.and(
          q.eq(q.field("code"), code.toUpperCase()),
          q.eq(q.field("isActive"), true)
        )
      )
      .first();

    if (!promoCode) {
      return { valid: false, message: "Invalid promo code. Please try again." };
    }

    // Check if promo code has expired
    if (promoCode.expiresAt && promoCode.expiresAt < Date.now()) {
      return { valid: false, message: "This promo code has expired." };
    }

    // Check usage limit
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return { valid: false, message: "This promo code has reached its usage limit." };
    }

    return {
      valid: true,
      message: `Promo code applied! ${promoCode.discountType === 'percentage' ? promoCode.discountValue + '% off' : '$' + promoCode.discountValue + ' off'}.`,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      minOrderAmount: promoCode.minOrderAmount,
    };
  },
});

// Create a new promo code (admin function)
export const createPromoCode = mutation({
  args: {
    code: v.string(),
    discountType: v.union(v.literal("percentage"), v.literal("fixed")),
    discountValue: v.number(),
    minOrderAmount: v.optional(v.number()),
    maxUses: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const promoCodeId = await ctx.db.insert("promoCodes", {
      ...args,
      code: args.code.toUpperCase(),
      isActive: true,
      usedCount: 0,
      createdAt: Date.now(),
    });
    return promoCodeId;
  },
});

// Use a promo code (increment usage count)
export const usePromoCode = mutation({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const promoCode = await ctx.db
      .query("promoCodes")
      .filter((q) => 
        q.and(
          q.eq(q.field("code"), code.toUpperCase()),
          q.eq(q.field("isActive"), true)
        )
      )
      .first();

    if (promoCode) {
      await ctx.db.patch(promoCode._id, {
        usedCount: promoCode.usedCount + 1,
      });
    }

    return promoCode;
  },
});

// Deactivate a promo code
export const deactivatePromoCode = mutation({
  args: { promoCodeId: v.id("promoCodes") },
  handler: async (ctx, { promoCodeId }) => {
    await ctx.db.patch(promoCodeId, {
      isActive: false,
    });
  },
});