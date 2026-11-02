import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/user.js";
import Session from "../models/Session.js";
import { finishSession } from "./finishSession.js";
import { upsertStreamUser,deleteStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "CodeSync" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await User.create(newUser);

    await upsertStreamUser({
      id: id,
      name: newUser.name,
      image: newUser.profileImage
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id.toString());
  }
);

// sessions left open (host closed the tab without "End Session") are ended after this long
const STALE_SESSION_HOURS = 3;

const endStaleSessions = inngest.createFunction(
  { id: "end-stale-sessions" },
  { cron: "0 * * * *" }, // hourly
  async ({ step }) => {
    await connectDB();

    const cutoff = new Date(Date.now() - STALE_SESSION_HOURS * 60 * 60 * 1000);
    const staleSessions = await Session.find({ status: "active", createdAt: { $lt: cutoff } });

    for (const session of staleSessions) {
      await step.run(`end-session-${session._id}`, () => finishSession(session).then(() => session._id.toString()));
    }

    return { ended: staleSessions.length };
  }
);

export const functions = [syncUser, deleteUserFromDB, endStaleSessions];