import { internalMutation } from "./_generated/server";

// Seed script to add a message if the table is empty
// This can be run automatically by modifying package.json
// scripts:
//  "dev:init": "convex dev --until-success --run init",
// Or removed with:
//  "dev:init": "convex dev --until-success",
export default internalMutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("messages").first();
    if (existing === null) {
      await ctx.db.insert("messages", {
        author: "User 123",
        body: "Hello World",
      });
      await ctx.db.insert("messages", {
        author: "User 456",
        body: "Hello User 123",
      });
    }
  },
});
