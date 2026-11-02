import { chatClient, streamClient } from "./stream.js";
import { clearSessionState } from "./socket.js";

// Marks a session completed and tears down its Stream call/chat.
// Used by the host's "End Session" and by the stale-session cleanup job.
export async function finishSession(session) {
  // End the call to mark it as ended (preserves recordings)
  // DO NOT use call.delete({ hard: true }) - it will remove all recordings!
  try {
    await streamClient.video.call("default", session.callId).end();
  } catch (error) {
    console.log(`Could not end call for session ${session._id}:`, error.message);
  }

  // delete stream chat channel
  try {
    await chatClient.channel("messaging", session.callId).delete();
  } catch (error) {
    console.log(`Could not delete chat for session ${session._id}:`, error.message);
  }

  session.status = "completed";
  await session.save();

  clearSessionState(session._id);
  return session;
}
