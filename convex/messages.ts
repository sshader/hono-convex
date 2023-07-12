import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery } from "./_generated/server";

export const listAll = internalQuery(
  async ({ db }): Promise<Doc<"messages">[]> => {
    return await db.query("messages").collect();
  }
);

export const listByAuthor = internalQuery({
  args: { authorNumber: v.string() },
  handler: async (
    { db },
    { authorNumber }: { authorNumber: string }
  ): Promise<Doc<"messages">[]> => {
    const messages = await db.query("messages").collect();
    return messages.filter((message) => message.author.includes(authorNumber));
  },
});

export const send = internalMutation({
  args: {
    body: v.string(),
    author: v.string(),
  },
  handler: async (
    { db },
    { body, author }: { body: string; author: string }
  ) => {
    const message = { body, author };
    await db.insert("messages", message);
  },
});
