import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useIsAdmin } from "../hooks/useIsAdmin";

function AdminRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const { isAdmin, isLoading } = useIsAdmin();

  const isDenied = isLoaded && isSignedIn && !isLoading && !isAdmin;

  useEffect(() => {
    if (isDenied) toast.error("You are not authorized. Only admins can do that.");
  }, [isDenied]);

  // Prevent flicker
  if (!isLoaded || isLoading) {
    return null;
  }

  // Not logged in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Logged in but NOT admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin → allow access
  return children;
}

export default AdminRoute;
