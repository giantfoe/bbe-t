/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as artworks from "../artworks.js";
import type * as auth from "../auth.js";
import type * as cart from "../cart.js";
import type * as collections from "../collections.js";
import type * as favorites from "../favorites.js";
import type * as migrateUsers from "../migrateUsers.js";
import type * as orders from "../orders.js";
import type * as promoCodes from "../promoCodes.js";
import type * as seedArtworks from "../seedArtworks.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  artworks: typeof artworks;
  auth: typeof auth;
  cart: typeof cart;
  collections: typeof collections;
  favorites: typeof favorites;
  migrateUsers: typeof migrateUsers;
  orders: typeof orders;
  promoCodes: typeof promoCodes;
  seedArtworks: typeof seedArtworks;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
