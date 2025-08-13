// Script to seed initial promo codes
// Run this script to add sample promo codes to the database

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const initialPromoCodes = [
  {
    code: 'SAVE10',
    discountType: 'percentage' as const,
    discountValue: 10,
    description: '10% off any order',
  },
  {
    code: 'WELCOME20',
    discountType: 'percentage' as const,
    discountValue: 20,
    minOrderAmount: 100,
    description: '20% off orders over $100',
  },
  {
    code: 'FIRST50',
    discountType: 'fixed' as const,
    discountValue: 50,
    minOrderAmount: 200,
    maxUses: 100,
    description: '$50 off orders over $200 (limited use)',
  },
  {
    code: 'STUDENT15',
    discountType: 'percentage' as const,
    discountValue: 15,
    description: '15% student discount',
  },
  {
    code: 'HOLIDAY25',
    discountType: 'percentage' as const,
    discountValue: 25,
    minOrderAmount: 150,
    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
    description: '25% holiday discount (expires in 30 days)',
  },
];

async function seedPromoCodes() {
  console.log('Seeding promo codes...');
  
  try {
    for (const promoCode of initialPromoCodes) {
      const result = await convex.mutation(api.promoCodes.createPromoCode, promoCode);
      console.log(`Created promo code: ${promoCode.code} (ID: ${result})`);
    }
    
    console.log('✅ Promo codes seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding promo codes:', error);
  }
}

// Run the seeding function
if (require.main === module) {
  seedPromoCodes();
}

export { seedPromoCodes };