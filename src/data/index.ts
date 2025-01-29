import { Home } from "lucide-react";
import React from "react";

export const navItems = [
  { name: "Home", link: "/", icon: React.createElement(Home) },
];

export const placeholders = ["Search albums", "Search artists", "Search users"];

export const usernameRegex = /^[a-zA-Z0-9]+$/;
