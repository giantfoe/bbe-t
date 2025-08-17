# Changelog

## Setup Instructions

### Clerk Authentication Configuration

To properly configure Clerk authentication for this project, you need to:

1. **Create a Clerk Account**:
   - Visit [Clerk Dashboard](https://dashboard.clerk.com)
   - Create a new application or use an existing one

2. **Get Your API Keys**:
   - Navigate to API Keys section in your Clerk dashboard
   - Copy your Publishable Key and Secret Key

3. **Update Environment Variables**:
   ✅ **COMPLETED**: Clerk API keys have been configured in `.env.local`
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aGFuZHktbGFtcHJleS03NC5jbGVyay5hY2NvdW50cy5kZXYk
   CLERK_SECRET_KEY=sk_test_YgvqAG4yFZHtiDS18LvBWBGjtTUtXJybNYq6GGGJQv
   ```

### Authentication System Status

✅ **Ready for Testing**: Clerk authentication is now properly configured with valid API keys. The authentication system is ready for development and testing.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Git repository initialization and GitHub setup
- Project pushed to GitHub repository: https://github.com/giantfoe/bbe-t

### Changed
- Updated .vercelignore file to exclude .next directory and other large files/directories to prevent deployment size limit errors
- **Vercel Deployment Configuration**: Updated `vercel.json` to use `npm install --legacy-peer-deps` as the install command to resolve peer dependency conflicts during deployment
- Added install script to `package.json` with `--legacy-peer-deps` flag for consistent dependency resolution across environments
- Removed `@convex-dev/auth` dependency due to peer dependency conflict with `@auth/core@0.40.0`; project uses Clerk + Convex integration via `auth.config.js` instead
- Updated `convex/schema.ts` to remove `authTables` import/spread from `@convex-dev/auth/server`
- Cleaned up `convex/auth.ts` (no longer re-exporting from `@convex-dev/auth/server`)

### Fixed
- Fixed React error "Objects are not valid as a React child" when artwork dimensions are undefined by adding proper null checking in artwork details page
- Fixed React error "Objects are not valid as a React child" by adding comprehensive null checking for artwork dimensions properties
- Fixed React error in cart page where artwork dimensions object was being rendered directly instead of formatted text
- Fixed checkout button in cart page not working - now passes first selected artwork ID as URL parameter to prevent redirect to marketplace
- ArgumentValidationError in favorites:isArtworkFavorited query by correcting parameter from userId to clerkUserId in artwork detail page
- Updated .gitignore with proper Next.js exclusions (node_modules, .next, build artifacts) to reduce deployment bundle size and prevent "Request body too large" errors
- Fixed Vercel deployment "Request body too large" error by properly excluding build artifacts and large files in .vercelignore
- Fixed Clerk provider context error by moving ClerkProvider inside body element
- Resolved useSession hook error by ensuring proper provider hierarchy

### Added
- Enhanced "Add to Cart" and "Buy Now" button functionality in ArtworkCard component
- Sonner toast provider for user feedback notifications
- User authentication checks for cart operations
- Error handling and success messages for cart actions
- Direct Clerk user ID integration for cart operations (eliminates slow Convex user ID loading)

### Fixed
- Non-functional "Add to Cart" and "Buy Now" buttons in marketplace
- Missing toast notifications for user feedback
- Authentication race condition causing "Please sign in" message for authenticated users
- Improved error messaging to distinguish between unauthenticated users and loading states
- Slow cart operations due to Convex user ID dependency - now uses Clerk user ID directly
- "Loading user data, please try again in a moment" delays in cart functionality

### Changed
- Cart API functions now accept `clerkUserId` instead of `userId` for faster operations
- Automatic user creation in Convex when using cart functions with new Clerk users
- Simplified authentication flow for MVP - no more waiting for Convex user ID resolution
- Fixed React error "Objects are not valid as a React child" in ArtworkCard component
  - Updated `Artwork` interface to correctly define `dimensions` as an object with `width`, `height`, optional `depth`, and `unit` properties
  - Added `formatDimensions` helper function to convert dimensions object to display string format
  - Fixed rendering of dimensions in both grid and list view modes
- **ArtworkCard Convex User ID Mapping**: Fixed `ArgumentValidationError` in `favorites:getUserFavorites` query by implementing Clerk-to-Convex user ID mapping in ArtworkCard component, using `api.users.getConvexUserIdByClerkId` to get the proper Convex user ID before calling favorites and cart mutations
- **Cart Page Convex User ID Mapping**: Fixed `ArgumentValidationError` in `cart:getUserCart` query by implementing Clerk-to-Convex user ID mapping in cart page, updated `updateQuantity` and `removeItem` functions to use `convexUserId` instead of Clerk user ID for all cart mutations
- Fixed `ArgumentValidationError` in dashboard page by implementing Clerk-to-Convex user ID mapping for `getUserFavorites`, `getUserStats`, and `getUserOrders` queries
- Fixed `ArgumentValidationError` in favorites page by implementing Clerk-to-Convex user ID mapping for `getUserFavorites` query and `removeFromFavorites` mutation
- Fixed dashboard page TypeScript errors: corrected image handling (imageUrl vs images array), added null checks for favorite artwork rendering, fixed stats property access with proper nesting, and updated `getArtistProfile` query parameters

### Added
- Created artwork seed script (`convex/seedArtworks.ts`) with dynamic generation of up to 100 diverse filler artworks
- Added `img.clerk.com` to Next.js image domains configuration
- Expanded seed script to generate varied artwork categories, mediums, prices, and metadata

## [Latest] - 2024-12-19

### Fixed
- Fixed JSX syntax error in collections page (missing closing parenthesis in conditional rendering)
- Fixed incorrect import path for Convex API in collections page (changed from '@/../convex/_generated/api' to '../../convex/_generated/api')
- Fixed `TypeError: Cannot read properties of undefined (reading 'views')` in ArtworkCard component by adding null checks for stats property and making it optional in the interface
- Fixed Convex user ID mapping issue by adding `clerkId` field to users schema and creating helper functions to map Clerk user IDs to Convex user IDs
- Fixed `ArgumentValidationError` in `favorites:isArtworkFavorited` query by properly mapping Clerk user IDs to Convex user IDs
- Updated artwork details page to use Convex user IDs for all user-related operations (favorites, cart, etc.)
- Fixed `ReferenceError: Cannot access 'artwork' before initialization` in artwork details page by reordering variable declarations
- Fixed `Invalid src prop` error by adding `images.unsplash.com` to allowed domains in `next.config.js`

### Added
- Added `clerkId` field to users table schema with index for efficient lookups
- Added `getUserByClerkId` and `getConvexUserIdByClerkId` helper functions in `convex/users.ts`
- Added `migrateUsers.ts` with functions to migrate existing users and create users with Clerk IDs
- Updated `createUser` mutation to handle Clerk ID mapping during user creation

### Fixed
- **Convex Query Parameter Validation**: Fixed `ArgumentValidationError` in marketplace page by correcting parameter name from `availableOnly` to `isAvailable` in `getArtworks` query call
- **Marketplace Page TypeError**: Fixed `TypeError: artworks.map is not a function` in marketplace page by accessing `artworks.page` array from paginated query response
- **Next.js Image Configuration**: Fixed Next.js image configuration error for Clerk user avatars by adding `img.clerk.com` to allowed domains
- **Clerk JWT Integration**: Added missing `CLERK_JWT_ISSUER_DOMAIN` environment variable for Convex integration
- Fixed TypeScript errors in seed script by properly typing artwork categories and medium objects
- **Artwork Details Page ReferenceError**: Fixed `ReferenceError: Cannot access 'artwork' before initialization` in artwork details page by reordering variable declarations
- Fixed `Invalid src prop` error for Next.js images by adding `images.unsplash.com` to allowed domains configuration
- **Authentication Routes**: Updated Clerk sign-in/sign-up URLs to use proper catchall routes (`/sign-in`, `/sign-up`)
- **JWT Template Configuration**: Added instructions for creating required 'convex' JWT template in Clerk dashboard

#### Required Clerk Dashboard Setup
To complete the Clerk-Convex integration, you must create a JWT template in your Clerk dashboard:

1. Go to your Clerk Dashboard → JWT Templates
2. Click "New template" 
3. Set the template name to: `convex`
4. Configure the following claims:
   ```json
   {
     "iss": "{{org.slug || 'user'}}",
     "sub": "{{user.id}}",
     "aud": "convex",
     "exp": "{{date.now_plus_minutes(60)}}",
     "iat": "{{date.now}}",
     "email": "{{user.primary_email_address}}",
     "name": "{{user.full_name}}",
     "picture": "{{user.profile_image_url}}"
   }
   ```
5. Save the template

Without this JWT template, authentication will fail with "No JWT template exists with name: convex" error.
- **Clerk Authentication Routing**: Fixed `net::ERR_ABORTED` error by implementing proper Clerk catchall routes
  - Created `/src/app/sign-in/[[...sign-in]]/page.tsx` for Clerk SignIn component
  - Created `/src/app/sign-up/[[...sign-up]]/page.tsx` for Clerk SignUp component
  - Updated all authentication route references from `/auth/login` and `/auth/register` to `/sign-in` and `/sign-up`
  - Resolved Clerk's `useEnforceCatchAllRoute` requirement for proper routing structure

### Changed
- **BREAKING CHANGE**: Migrated from Supabase authentication to Clerk + Convex authentication system
- Replaced Supabase Auth with Clerk for user authentication and session management
- Updated login and signup pages to use Clerk's prebuilt components (`SignIn` and `SignUp`)
- Replaced custom `useAuth` hook with Clerk's authentication hooks
- Updated middleware to use `clerkMiddleware` for route protection
- Integrated Convex with Clerk authentication using `ConvexProviderWithClerk`
- Updated Convex schema to support Clerk authentication tables

### Removed
- Removed all Supabase authentication packages and dependencies
- Removed Supabase client configuration files (`client.ts`, `server.ts`, `middleware.ts`)
- Removed Supabase authentication routes (`/auth/confirm`)
- Removed custom authentication forms and validation logic

### Added
- Added `@clerk/nextjs` package for authentication
- Added `@convex-dev/auth` package for Convex authentication integration
- Added Clerk environment variables configuration
- Added `convex/auth.config.js` for Clerk-Convex integration
- Added protected route configuration using `createRouteMatcher`

### Technical Details
- Authentication now handled entirely by Clerk with seamless Convex integration
- User sessions managed through Clerk's secure token system
- Route protection implemented via Clerk middleware
- Maintained existing UI design while replacing authentication components
- All authentication flows (login, signup, logout) now use Clerk's optimized components

## [2024-12-20]

### Added
- Netlify configuration for static hosting support: created `netlify.json` with install command and SPA rewrite
- Added `_redirects` file to support SPA fallback routing on Netlify and ensure Next.js client-side routes work on refresh

### Notes
- For Next.js on Netlify, dynamic routes, API routes, and SSR require the Netlify Next.js adapter which is auto-applied during builds; the `_redirects` rule `/* /index.html 200` ensures SPA behavior for purely static exports