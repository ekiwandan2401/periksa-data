"use client"

import DataBreachChecker from '@/components/DataBreachChecker';
import TypingText from '@/components/ui/TypingText';
import { HyperText } from "@/components/magicui/hyper-text";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
      <HyperText className="text-4xl font-bold mb-4 text-center tracking-tight">
        Cek Kebocoran Data
      </HyperText>
     <div className="min-w-96 max-w-96 rounded-sm bg-gray-800 px-4 py-2 text-yellow-400 shadow-lg">
          <TypingText
            text="> By Eki Wandana Putra"
          />
        </div>  
      <DataBreachChecker />
    </main>
  );
}