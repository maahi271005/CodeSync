import { Server } from "socket.io";
import mongoose from "mongoose";
import { verifyToken } from "@clerk/express";
import { ENV } from "../env.js";
import User from "../models/user.js";
import Session from "../models/Session.js";

let io;

// latest code/language per session so late joiners and refreshes get the current state
const sessionState = new Map();
const MAX_CODE_LENGTH = 50000;

const getCookie = (cookieHeader, name) =>
  cookieHeader
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);

export const clearSessionState = (sessionId) => {
  sessionState.delete(String(sessionId));
};

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ENV.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // only signed-in users can connect - token from the client, or Clerk's session cookie
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || getCookie(socket.handshake.headers.cookie, "__session");
      if (!token) return next(new Error("Unauthorized"));

      const payload = await verifyToken(token, { secretKey: ENV.CLERK_SECRET_KEY });
      socket.data.clerkId = payload.sub;
      next();
    } catch (error) {
      console.log("Socket auth failed:", error.message);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // only the session's host/participant may join its room
    socket.on("join-session", async (sessionId) => {
      try {
        if (!mongoose.isValidObjectId(sessionId)) return;

        const [user, session] = await Promise.all([
          User.findOne({ clerkId: socket.data.clerkId }),
          Session.findById(sessionId),
        ]);

        const isMember =
          user &&
          session &&
          (session.host.equals(user._id) || session.participant?.equals(user._id));

        if (!isMember || session.status !== "active") {
          socket.emit("session-error", "You are not part of this session");
          return;
        }

        socket.join(sessionId);

        const state = sessionState.get(sessionId);
        if (state) socket.emit("session-state", state);
      } catch (error) {
        console.log("Error in join-session:", error.message);
      }
    });

    socket.on("code-change", ({ sessionId, code } = {}) => {
      if (!socket.rooms.has(sessionId) || typeof code !== "string" || code.length > MAX_CODE_LENGTH) return;

      sessionState.set(sessionId, { ...sessionState.get(sessionId), code });
      socket.to(sessionId).emit("code-update", code);
    });

    socket.on("language-change", ({ sessionId, language } = {}) => {
      if (!socket.rooms.has(sessionId) || typeof language !== "string") return;

      sessionState.set(sessionId, { ...sessionState.get(sessionId), language });
      socket.to(sessionId).emit("language-update", language);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
