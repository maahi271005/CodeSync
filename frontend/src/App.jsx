import { useUser } from '@clerk/clerk-react'
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router'
import { lazy, Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/NotFoundPage";

// heavier pages (Monaco editor, Stream video/chat) load only when visited
const ProblemsPage = lazy(() => import("./pages/ProblemsPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProblemPage = lazy(() => import("./pages/ProblemPage"));
const SessionPage = lazy(() => import("./pages/SessionPage"));
const CreateProblem = lazy(() => import("./pages/CreateProblem"));
const AdminRecordingsPage = lazy(() => import("./pages/AdminRecordingsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
import { Toaster } from 'react-hot-toast'
import { getSafeRedirect } from "./util/utils.js";

// send signed-out users to the home page, remembering where they were headed (e.g. an invite link)
function RedirectToSignIn() {
  const location = useLocation();
  return <Navigate to={`/?redirect=${encodeURIComponent(location.pathname)}`} replace />;
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center">
      <Loader2Icon className="size-10 animate-spin text-primary" />
    </div>
  );
}

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const [searchParams] = useSearchParams();
  const afterSignIn = getSafeRedirect(searchParams.get("redirect")) || "/dashboard";

  //In order to get rid of flickering issue
  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={afterSignIn} replace />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <RedirectToSignIn />} />
        {/* open to everyone for now - wrap in <AdminRoute> to restrict to admins again */}
        <Route path="/create-problem" element={isSignedIn ? <CreateProblem /> : <Navigate to={"/"} />} />
        <Route path="/profile/*" element={isSignedIn ? <ProfilePage /> : <Navigate to={"/"} />} />
        <Route path="/recordings" element={isSignedIn ? <AdminRecordingsPage /> : <Navigate to={"/"} />} />
        {/* 404 - Catch all unknown routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App

//tw,daisyui,react-router,react-hot-toast,react-query aka tanstack query,axios done