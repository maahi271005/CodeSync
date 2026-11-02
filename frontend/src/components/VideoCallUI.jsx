import {CallControls, CallingState, SpeakerLayout, useCallStateHooks, useCall } from "@stream-io/video-react-sdk";
import {
  Loader2Icon,
  MessageSquareIcon,
  UsersIcon,
  XIcon,
  CircleIcon,
  StopCircleIcon,
  UserPlusIcon,
  LinkIcon,
  Share2Icon,
  MailIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import toast from "react-hot-toast";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel, inviteLink, problemTitle }) {
  const navigate = useNavigate();
  const call = useCall();
  const { useCallCallingState, useParticipants, useIsCallRecordingInProgress } = useCallStateHooks();
  const callingState = useCallCallingState();
  // count people, not connections - a stale connection from a closed tab shouldn't show up as an extra participant
  const participants = useParticipants();
  const participantCount = new Set(participants.map((p) => p.userId)).size;
  const isRecording = useIsCallRecordingInProgress();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecordingLoading, setIsRecordingLoading] = useState(false);

  const handleToggleRecording = async () => {
    if (!call) return;

    setIsRecordingLoading(true);
    try {
      if (isRecording) {
        await call.stopRecording();
        toast.success("Recording stopped. It will be available in ~30 seconds.");
      } else {
        await call.startRecording();
        toast.success("Recording started");
      }
    } catch (error) {
      console.error("Recording error:", error);
      toast.error(isRecording ? "Failed to stop recording" : "Failed to start recording");
    } finally {
      setIsRecordingLoading(false);
    }
  };

  const inviteText = `Join me on CodeSync to solve "${problemTitle || "a coding problem"}" together`;
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const closeInviteMenu = () => document.activeElement?.blur();

  const handleCopyInviteLink = async () => {
    closeInviteMenu();
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied");
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Couldn't copy link");
    }
  };

  const handleShareInviteLink = async () => {
    closeInviteMenu();
    try {
      await navigator.share({ title: "CodeSync session", text: inviteText, url: inviteLink });
    } catch (error) {
      // user closing the share sheet is not an error
      if (error?.name !== "AbortError") {
        console.error("Share error:", error);
        toast.error("Couldn't share link");
      }
    }
  };

  const emailInviteHref = `mailto:?subject=${encodeURIComponent(
    "Join my CodeSync session"
  )}&body=${encodeURIComponent(`${inviteText}:\n\n${inviteLink}`)}`;

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-lg">Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-3 relative str-video">
      <div className="flex-1 flex flex-col gap-3">
        {/* Participants count badge and Chat Toggle */}
        <div className="flex items-center justify-between gap-2 bg-base-100 p-3 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold">
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
            {isRecording && (
              <span className="flex items-center gap-1 text-error text-sm font-medium">
                <CircleIcon className="size-3 fill-error animate-pulse" />
                Recording
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {inviteLink && (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className={`btn btn-sm gap-2 ${participantCount <= 1 ? "btn-primary" : "btn-ghost"}`}
                  title="Invite someone to this session"
                >
                  <UserPlusIcon className="size-4" />
                  Invite
                </div>
                <ul
                  tabIndex={-1}
                  className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg border border-base-300"
                >
                  <li>
                    <button onClick={handleCopyInviteLink}>
                      <LinkIcon className="size-4" />
                      Copy link
                    </button>
                  </li>
                  {canNativeShare && (
                    <li>
                      <button onClick={handleShareInviteLink}>
                        <Share2Icon className="size-4" />
                        Share...
                      </button>
                    </li>
                  )}
                  <li>
                    <a href={emailInviteHref} onClick={closeInviteMenu}>
                      <MailIcon className="size-4" />
                      Send via email
                    </a>
                  </li>
                </ul>
              </div>
            )}
            {chatClient && channel && (
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`btn btn-sm gap-2 ${isChatOpen ? "btn-primary" : "btn-ghost"}`}
                title={isChatOpen ? "Hide chat" : "Show chat"}
              >
                <MessageSquareIcon className="size-4" />
                Chat
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 bg-base-300 rounded-lg overflow-hidden relative">
          <SpeakerLayout />
          {participantCount <= 1 && inviteLink && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-base-100/90 backdrop-blur px-4 py-2 rounded-full shadow">
              <span className="text-sm text-base-content/80">Waiting for someone to join</span>
              <button onClick={handleCopyInviteLink} className="btn btn-primary btn-xs gap-1">
                <LinkIcon className="size-3" />
                Copy invite link
              </button>
            </div>
          )}
        </div>

        <div className="bg-base-100 p-3 rounded-lg shadow flex justify-center">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* CHAT SECTION */}

      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-lg shadow overflow-hidden bg-[#272a30] transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="bg-[#1c1e22] p-3 border-b border-[#3a3d44] flex items-center justify-between">
                <h3 className="font-semibold text-white">Session Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Close chat"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden stream-chat-dark">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
export default VideoCallUI;