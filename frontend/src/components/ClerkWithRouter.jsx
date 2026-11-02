import { ClerkProvider } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

//Importing publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// match Clerk's sign-in modal & user menu to the daisyUI "forest" theme (index.html data-theme)
// hex equivalents of the forest oklch tokens - Clerk derives its shades from these
const clerkAppearance = {
  variables: {
    colorPrimary: "#1fb854", // primary
    colorTextOnPrimaryBackground: "#000000", // primary-content
    colorBackground: "#1b1717", // base-100
    colorInputBackground: "#161212", // base-200
    colorText: "#cac9c9", // base-content
    colorInputText: "#cac9c9",
    colorTextSecondary: "#9a9898",
    colorNeutral: "#cac9c9",
    colorDanger: "#ff5861", // error
    colorSuccess: "#00a96e", // success
    colorWarning: "#1fb854", // primary - Clerk uses this for the "Development mode" strip, keep it on-theme
    fontFamily: "inherit",
    borderRadius: "0.75rem",
  },
  elements: {
    // same border as the dashboard cards so Clerk cards don't blend into the page
    // (! = important, otherwise Clerk's own styles win)
    cardBox: "border-2! border-primary/20! shadow-2xl",
    userButtonPopoverCard: "border-2! border-primary/20! shadow-2xl",
    modalBackdrop: "backdrop-blur-sm",
  },
};

// lets Clerk navigate with react-router (e.g. profile tabs) instead of full page reloads
function ClerkWithRouter({ children }) {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={clerkAppearance}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      {children}
    </ClerkProvider>
  );
}

export default ClerkWithRouter;
