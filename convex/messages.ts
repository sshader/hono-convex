import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery } from "./_generated/server";

export const listAll = internalQuery({
  handler: async (ctx): Promise<Doc<"messages">[]> => {
    return await ctx.db.query("messages").collect();
  },
});

export const listByAuthor = internalQuery({
  args: { authorNumber: v.string() },
  handler: async (ctx, { authorNumber }): Promise<Doc<"messages">[]> => {
    const messages = await ctx.db.query("messages").collect();
    return messages.filter((message) => message.author.includes(authorNumber));
  },
});

export const send = internalMutation({
  args: {
    body: v.string(),
    author: v.string(),
  },
  handler: async (ctx, { body, author }) => {
    const message = { body, author };
    await ctx.db.insert("messages", message);
  },
});
