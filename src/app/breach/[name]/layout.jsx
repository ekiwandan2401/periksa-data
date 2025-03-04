// app/breach/[name]/layout.jsx
"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BreachLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme based on system preference or localStorage
  useEffect(() => {
    // Check local storage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Apply theme when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
            <span className="sr-only">
              {isDarkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
            </span>
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}