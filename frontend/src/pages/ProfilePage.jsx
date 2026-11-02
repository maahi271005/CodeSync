import { SignOutButton, UserProfile } from "@clerk/clerk-react";
import { LogOutIcon } from "lucide-react";
import Navbar from "../components/navbar";

function ProfilePage() {
  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-base-content mb-2">My Profile</h1>
            <p className="text-base-content/60">Manage your account details and security</p>
          </div>

          <SignOutButton redirectUrl="/">
            <button className="btn btn-error btn-outline gap-2">
              <LogOutIcon className="size-4" />
              Sign out
            </button>
          </SignOutButton>
        </div>

        {/* path routing so Clerk's tabs (e.g. /profile/security) are real URLs */}
        <UserProfile
          routing="path"
          path="/profile"
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "w-full! max-w-none!",
            },
          }}
        />
      </div>
    </div>
  );
}

export default ProfilePage;
