import { Outlet } from "react-router";
import AppNavbar from "../AppNavbar/AppNavbar";
export default function Layout() {
  return (
    <div className="relative min-h-screen bg-[#0b0f19] text-white">

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-125 h-125 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute -top-32 -right-32 w-100 h-100 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-50 left-1/2 -translate-x-1/2 w-150 h-150 bg-blue-500/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
      </div>

      {/* Navbar */}
      <AppNavbar />

      {/* Content */}
      <div className="relative pt-24 z-10">
        <Outlet />
      </div>

    </div>
  );
}
