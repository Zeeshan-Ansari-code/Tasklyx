"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Set sidebar open by default on desktop
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint
      if (isDesktop) {
        setSidebarOpen(true);
      }
    }
  }, []);

  // Temporary user data (will be replaced with actual auth)
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: null,
  };

  // Calculate sidebar width
  const sidebarWidth = sidebarCollapsed ? 64 : 256; // 64px = collapsed, 256px = expanded

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        sidebarWidth={sidebarWidth}
      />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main content with dynamic padding */}
      <main
        className="min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out"
        style={{
          paddingLeft: sidebarOpen ? `${sidebarWidth}px` : "0px",
        }}
      >
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}