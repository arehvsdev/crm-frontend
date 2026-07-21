import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import Navbar from "../components/Navbar";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}

export default ProtectedRoute;