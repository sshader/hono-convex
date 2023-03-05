import { Document } from "./_generated/dataModel";
import { query } from "./_generated/server";

export default query(async ({ db }): Promise<Document<"messages">[]> => {
  return await db.query("messages").collect();
});

export const byAuthor = query(
  async ({ db }, authorNumber: string): Promise<Document<"messages">[]> => {
    const messages = await db.query("messages").collect();
    return messages.filter((message) => message.author.includes(authorNumber));
  }
);
