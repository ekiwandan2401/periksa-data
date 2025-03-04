"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Moon, Sun } from "lucide-react";
import BreachCard from '@/components/BreachCard';

export default function DataBreachChecker() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [breachData, setBreachData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      toast.error("Email tidak valid", {
        description: "Silakan masukkan alamat email yang valid"
      });
      return;
    }
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await fetch('/api/check-breach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle rate limit error (status 429)
        if (response.status === 429) {
          const retryAfterMinutes = Math.ceil(errorData.retryAfter / 60);
          toast.error("Terlalu banyak permintaan", {
            description: `Batas: 5 permintaan per jam. Coba lagi dalam ${retryAfterMinutes} menit.`,
          });
          return;
        }
        
        throw new Error(errorData.error || 'Permintaan API gagal');
      }
      
      const data = await response.json();
      const fetchedBreaches = data.breachData || [];
      
      setBreachData(fetchedBreaches);
      
      if (fetchedBreaches.length > 0) {
        toast.warning(`Ditemukan ${fetchedBreaches.length} kebocoran`, {
          description: "Email Anda ditemukan dalam kebocoran data",
        });
      } else {
        toast.success("Kabar baik!", {
          description: "Tidak ditemukan kebocoran untuk alamat email ini",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: error.message === 'Failed to check data breach' 
          ? "Gagal memeriksa kebocoran data. Silakan coba lagi."
          : error.message,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
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

      <Card className="p-6 shadow-lg border-t-4 border-green-600 dark:border-green-500">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="email"
              placeholder="Masukkan alamat email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="md:col-span-3"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memeriksa
                </>
              ) : "Periksa Sekarang"}
            </Button>
          </div>
        </form>
      </Card>

      {hasSearched && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">
            {isLoading ? "Mencari..." : 
              breachData.length > 0 ? `Ditemukan ${breachData.length} Kebocoran` : "Tidak Ditemukan Kebocoran"}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-green-600 dark:text-green-500" />
            </div>
          ) : breachData.length > 0 ? (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {breachData.map((breach, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <BreachCard breach={breach} />
                </motion.div>
              ))}
            </motion.div>
          ) : hasSearched && !isLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-green-800 dark:text-green-200 mb-2">Kabar Baik!</h3>
                <p className="text-green-700 dark:text-green-300 max-w-md">
                  Alamat email Anda tidak ditemukan dalam kebocoran data yang kami periksa.
                </p>
              </div>
            </motion.div>
          ) : null}
        </div>
      )}
    </div>
  );
}
