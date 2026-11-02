import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../util/stream.js";
import { sessionApi } from "../api/sessions.js";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  // resolves once the previous effect run has fully left the call
  const cleanupRef = useRef(Promise.resolve());

  // depend on primitives, not the session object - react-query hands us a new object on every
  // refetch, which used to tear down and re-join the call (showing the same user several times)
  const callId = session?.callId;
  const status = session?.status;
  const canJoin = isHost || isParticipant;

  useEffect(() => {
    if (loadingSession || !callId || !canJoin || status === "completed") return;

    let cancelled = false;
    let videoCall = null;
    let chatClientInstance = null;

    const initCall = async () => {
      try {
        // wait for a previous run (StrictMode remount, rejoin) to leave before joining again
        await cleanupRef.current;
        if (cancelled) return;

        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();
        if (cancelled) return;

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );
        if (cancelled) return;
        setStreamClient(client);

        videoCall = client.call("default", callId);
        await videoCall.join({ create: true });
        if (cancelled) return;
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );
        if (cancelled) return;
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", callId);
        await chatChannel.watch();
        if (cancelled) return;
        setChannel(chatChannel);
      } catch (error) {
        if (cancelled) return;
        toast.error("Failed to join video call");
        console.error("Error init call", error);
      } finally {
        if (!cancelled) setIsInitializingCall(false);
      }
    };

    const initPromise = initCall();

    // leave right away on refresh/tab close so we don't linger as a ghost participant
    const handlePageHide = () => {
      videoCall?.leave().catch(() => {});
    };
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      cancelled = true;
      window.removeEventListener("pagehide", handlePageHide);

      // wait for an in-flight join to finish, then leave it - otherwise a join that
      // completes after unmount stays in the call
      cleanupRef.current = initPromise.then(async () => {
        try {
          if (videoCall) await videoCall.leave();
        } catch (error) {
          // already left (e.g. via the leave button)
          console.debug("Call leave skipped:", error?.message);
        }
        try {
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      });
    };
  }, [callId, status, loadingSession, canJoin]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;
