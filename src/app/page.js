"use client"

import DataBreachChecker from '@/components/DataBreachChecker';
import TypingText from '@/components/ui/TypingText';
import { HyperText } from "@/components/magicui/hyper-text";
import { RetroGrid } from '@/components/magicui/retro-grid';
import { FaEdge, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Dock from '@/components/magicui/dock';

export default function Home() {

   const items = [
    {
      link: 'https://github.com/ekiwandan2401',
      target: '_blank',
      Icon: <FaGithub size={22} />,
      defaultBgColor: 'bg-zinc-700',
      hoverBgColor: 'bg-zinc-700',
      tooltip: 'GitHub', 
    },
    {
      link:'https://ekiwandanaputra-portfolio.vercel.app',
      target: '_blank',
      Icon: <FaEdge size={22} />,
      defaultBgColor: 'bg-zinc-700',
      hoverBgColor: 'bg-zinc-700',
      tooltip: 'Portfolio',
    },
    {
      link: 'https://x.com/ekky2400',
      target: '_blank',
      Icon: <FaTwitter size={22} />,
      defaultBgColor: 'bg-zinc-700',
      hoverBgColor: 'bg-zinc-700',
      tooltip: 'Twitter', 
    },
    {
      link: 'https://instagram.com/ekiwandana.id',
      target: '_blank',
      Icon: <FaInstagram size={22} />,
      defaultBgColor: 'bg-zinc-700',
      hoverBgColor: 'bg-zinc-700',
      tooltip: 'Instagram', 
    },
    {
      link: 'https://www.linkedin.com/in/eki-wandana-putra-06a148198/',
      target: '_blank',
      Icon: <FaLinkedin size={22} />,
      defaultBgColor: 'bg-zinc-700',
      hoverBgColor: 'bg-zinc-700',
      tooltip: 'LinkedIn', 
    },
  ];

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
      <RetroGrid/>
      <Dock position="bottom" items={items} />
    </main>
  );
}
