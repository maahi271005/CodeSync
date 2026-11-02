import { useUser } from '@clerk/clerk-react'
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router'
import HomePage from "./pages/HomePage"

import ProblemsPage from './pages/ProblemsPage'
import DashboardPage from './pages/DashboardPage'
import ProblemPage from './pages/ProblemPage'
import SessionPage from './pages/SessionPage'
import CreateProblem from "./pages/CreateProblem";
import AdminRoute from "./components/AdminRoute";
import AdminRecordingsPage from "./pages/AdminRecordingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from 'react-hot-toast'
import { getSafeRedirect } from "./util/utils.js";

// send signed-out users to the home page, remembering where they were headed (e.g. an invite link)
function RedirectToSignIn() {
  const location = useLocation();
  return <Navigate to={`/?redirect=${encodeURIComponent(location.pathname)}`} replace />;
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
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={afterSignIn} replace />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <RedirectToSignIn />} />
        <Route path="/create-problem" element={<CreateProblem />} />
        <Route path="/profile/*" element={isSignedIn ? <ProfilePage /> : <Navigate to={"/"} />} />
        <Route path="/recordings" element={isSignedIn ? <AdminRecordingsPage /> : <Navigate to={"/"} />} />
        {/*ADMIN ONLY */}
        {/* <Route
        path="/create-problem"
        element={
          <AdminRoute>
            <CreateProblem />
          </AdminRoute>
        }
      /> */}
        {/* 404 - Catch all unknown routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App

//tw,daisyui,react-router,react-hot-toast,react-query aka tanstack query,axios done