'use client';

import dynamic from 'next/dynamic';
import BettingPanel from '@/components/BettingPanel';
import { Card, CardContent } from "@/components/ui/card";
import ResultHistory from '@/components/ResultHistory';
import GameAlert from '@/components/GameAlert';
import { SpinProvider } from '@/contexts/SpinContext';

const RouletteWheel = dynamic(() => import('@/components/RouletteWheel'), {
  ssr: false,
  loading: () => (
    <div className="flex-shrink-0 relative">
      <div className="p-10">
        <div className="w-[400px] h-[400px] rounded-full bg-zinc-800/50 animate-pulse" />
      </div>
    </div>
  )
});

export default function Home() {
  console.log('Page rendering');

  return (
    <SpinProvider>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white relative">
        <main className="container mx-auto p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/5 flex flex-col gap-8">
              <div className="flex flex-col items-center space-y-4">
                <img src="/favicon.ico" alt="logo" className="w-70 h-70" />
                <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 text-transparent bg-clip-text">
                  Hong-Nyang Wheel Game
                </h1>
              </div>
              <BettingPanel />
            </div>
            <div className="lg:w-2/3">
              <Card className="bg-zinc-900/50 border-zinc-800 h-[55rem] relative">
                <CardContent className="p-6 h-full">
                  <div className="grid grid-cols-[1fr_450px] grid-rows-[auto_0.8fr] h-full gap-4">
                    <div className="flex justify-center items-center">
                      <img 
                        src="/vhong-nyang.gif" 
                        alt="vhong" 
                        className="w-70 h-70 object-contain"
                      />
                    </div>
                    <div className="row-span-2">
                      <ResultHistory />
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="scale-95">
                        <RouletteWheel />
                      </div>
                    </div>
                  </div>
                  <GameAlert />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SpinProvider>
  );
}
