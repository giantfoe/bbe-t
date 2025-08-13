import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
-import { api } from '@/convex/_generated/api';
+import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { code, orderAmount } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, message: 'Invalid promo code format.' },
        { status: 400 }
      );
    }

    // Validate the promo code using Convex
    const validation = await convex.query(api.promoCodes.validatePromoCode, {
      code: code.trim(),
    });

    if (!validation.valid) {
      return NextResponse.json(validation);
    }

    // Check minimum order amount if specified
    if (validation.minOrderAmount && orderAmount < validation.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order amount of $${validation.minOrderAmount} required for this promo code.`,
      });
    }

    return NextResponse.json(validation);
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json(
      { valid: false, message: 'Error validating promo code. Please try again.' },
      { status: 500 }
    );
  }
}