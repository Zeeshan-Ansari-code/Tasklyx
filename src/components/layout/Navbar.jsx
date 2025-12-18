"use client";

import { useState } from "react";
import { Menu, Bell, Search, Plus } from "lucide-react";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import Input from "../ui/Input";
import ThemeToggle from "../ui/ThemeToggle";
import { cn } from "@/lib/utils";

const Navbar = ({ onMenuClick, user, sidebarOpen, sidebarCollapsed, sidebarWidth }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav
      className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-300"
      style={{
        paddingLeft: sidebarOpen ? `${sidebarWidth}px` : "0px",
      }}
    >
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Menu Button (Mobile Only) - Shows/hides sidebar on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo - Mobile Only */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">T</span>
          </div>
          <span className="font-bold text-lg">Tasklyx</span>
        </div>

        {/* Search - Desktop - Always visible, adjusts position with sidebar */}
        <div className="flex-1 max-w-xl hidden md:block ml-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search boards, tasks..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Search Icon (Mobile) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-auto"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="h-5 w-5" />
        </Button>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          {/* Create Button */}
          <Button size="sm" className="hidden sm:flex">
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
          <Button size="icon" className="sm:hidden">
            <Plus className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          {/* User Avatar */}
          <Avatar
            name={user?.name || "User"}
            src={user?.avatar}
            size="default"
            className="cursor-pointer"
          />
        </div>

        {/* Mobile Right Section */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <Avatar
            name={user?.name || "User"}
            src={user?.avatar}
            size="default"
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className="px-4 pb-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search boards, tasks..." className="pl-10" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;