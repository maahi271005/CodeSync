import { chatClient, streamClient } from "../util/stream.js";
import Session from "../models/Session.js";
import Problem from "../models/Problem.js";
import { finishSession } from "../util/finishSession.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // store the display title so lists don't have to show the slug
    const problemDoc = await Problem.findOne({ slug: problem }).select("title");
    const problemTitle = problemDoc?.title || problem;

    // create session in db
    const session = await Session.create({ problem, problemTitle, difficulty, host: userId, callId });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    // rejoining as the existing participant is fine
    if (session.participant?.equals(userId)) return res.status(200).json({ session });

    // check if session is already full - has a participant
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    await finishSession(session);

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionRecordings(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.controlAdmin;

    const session = await Session.findById(id)
      .populate("host", "name email clerkId")
      .populate("participant", "name email clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host, participant, or admin
    const isHostOrParticipant =
      session.host._id.toString() === userId.toString() ||
      session.participant?._id?.toString() === userId.toString();

    if (!isHostOrParticipant && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    // get recordings from stream
    const call = streamClient.video.call("default", session.callId);
    const response = await call.listRecordings();

    res.status(200).json({
      recordings: response.recordings || [],
      session: {
        id: session._id,
        problem: session.problem,
        problemTitle: session.problemTitle,
        difficulty: session.difficulty,
        host: session.host,
        participant: session.participant,
        status: session.status,
        createdAt: session.createdAt
      }
    });
  } catch (error) {
    console.log("Error in getSessionRecordings controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// fetch stream recordings for each completed session matching the filter
async function getRecordingsForSessions(filter) {
  const sessions = await Session.find({ ...filter, status: "completed" })
    .populate("host", "name email clerkId")
    .populate("participant", "name email clerkId")
    .sort({ createdAt: -1 });

  const sessionsWithRecordings = await Promise.all(
    sessions.map(async (session) => {
      const base = {
        sessionId: session._id,
        problem: session.problem,
        problemTitle: session.problemTitle,
        difficulty: session.difficulty,
        host: session.host,
        participant: session.participant,
        createdAt: session.createdAt,
      };

      try {
        const call = streamClient.video.call("default", session.callId);
        const response = await call.listRecordings();

        return {
          ...base,
          recordings: response.recordings || [],
          hasRecordings: response.recordings && response.recordings.length > 0
        };
      } catch (error) {
        console.log(`Error fetching recordings for session ${session._id}:`, error.message);
        return { ...base, recordings: [], hasRecordings: false, error: "Failed to fetch recordings" };
      }
    })
  );

  // Filter to only sessions with recordings
  const withRecordings = sessionsWithRecordings.filter(s => s.hasRecordings);

  return {
    allSessions: sessionsWithRecordings,
    sessionsWithRecordings: withRecordings,
    totalSessions: sessionsWithRecordings.length,
    totalWithRecordings: withRecordings.length
  };
}

export async function getAllRecordings(_req, res) {
  try {
    // This endpoint is for admins only - middleware will check
    res.status(200).json(await getRecordingsForSessions({}));
  } catch (error) {
    console.log("Error in getAllRecordings controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecordings(req, res) {
  try {
    const userId = req.user._id;

    // recordings from sessions the user hosted or joined
    res.status(200).json(await getRecordingsForSessions({ $or: [{ host: userId }, { participant: userId }] }));
  } catch (error) {
    console.log("Error in getMyRecordings controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}