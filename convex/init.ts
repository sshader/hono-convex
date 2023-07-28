import { internalMutation } from "./_generated/server";

// Seed script to add a message if the table is empty
// This can be run automatically by modifying package.json
// scripts:
//  "dev:init": "convex dev --until-success --run init",
// Or removed with:
//  "dev:init": "convex dev --until-success",
export default internalMutation({
  handler: async (ctx) => {
    const exiting = await ctx.db.query("messages").first();
    if (!exiting) {
      await ctx.db.insert("messages", {
        author: "Test User",
        body: "Hello World",
      });
      await ctx.db.insert("messages", {
        author: "World",
        body: "Hello Test User",
      });
    }
  },
});
