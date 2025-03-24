'use client';

import { useState, useCallback, useEffect } from 'react';
import { NumberOption, BettingMode } from '@/constants/wheelData';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useSpinContext } from '@/contexts/SpinContext';

const PAYOUT_MAP = {
  '1': 2,
  '3': 4,
  '5': 6,
  '10': 11,
  '20': 21
} as const;

export default function BettingPanel() {
  const [scrap, setScrap] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedNumber, setSelectedNumber] = useState<NumberOption>('1');
  const [bettingMode, setBettingMode] = useState<BettingMode>('normal');
  const [initialBet, setInitialBet] = useState(10);
  const [autoStatus, setAutoStatus] = useState<'idle' | 'running'>('idle');

  const {
    startSpin,
    mustStartSpinning,
    lastResult,
    showAlert
  } = useSpinContext();

  const handleBetAmountChange = (amount: number) => {
    const safeAmount = Math.min(amount, scrap);
    setBetAmount(safeAmount);
  };

  const handleNormalSpin = useCallback(() => {
    if (mustStartSpinning || betAmount <= 0 || betAmount > scrap) return;
    setScrap(prev => prev - betAmount);
    startSpin(betAmount, selectedNumber);
  }, [betAmount, selectedNumber, scrap, mustStartSpinning, startSpin]);

  const handleSpinUntilWin = useCallback(() => {
    if (mustStartSpinning || initialBet <= 0 || initialBet > scrap) return;
    
    setBetAmount(initialBet);
    setAutoStatus('running');
    setScrap(prev => prev - initialBet);
    startSpin(initialBet, selectedNumber);
  }, [initialBet, selectedNumber, scrap, mustStartSpinning, startSpin]);

  const handleMartingaleLogic = useCallback(() => {
    if (!lastResult || showAlert || mustStartSpinning) return;
    
    if (lastResult.result === 'WIN') {
      setAutoStatus('idle');
      return;
    }
    
    const nextBetAmount = lastResult.amount * 2;
    
    if (nextBetAmount > scrap) {
      setAutoStatus('idle');
      return;
    }
    
    setBetAmount(nextBetAmount);
    setScrap(prev => prev - nextBetAmount);
    startSpin(nextBetAmount, selectedNumber);
    
  }, [lastResult, showAlert, mustStartSpinning, scrap, selectedNumber, startSpin]);

  useEffect(() => {
    if (bettingMode !== 'martingale' || autoStatus !== 'running') return;

    const timer = setTimeout(() => {
      handleMartingaleLogic();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [bettingMode, autoStatus, handleMartingaleLogic]);

  useEffect(() => {
    if (lastResult) {
      const winAmount = lastResult.amount + lastResult.change;
      setScrap(prev => prev + winAmount);
    }
  }, [lastResult]);

  useEffect(() => {
    setBetAmount(0);
    setInitialBet(0);
    setAutoStatus('idle');
  }, [bettingMode]);

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
          <div className="flex items-center gap-3">
            <img 
              src="/hong-nyang-token.png" 
              alt="token" 
              className="w-14 h-14 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-sm text-zinc-400">HONG-NYANG</span>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                {scrap.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-2 bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 px-4 py-2 rounded-lg border border-orange-900/50 shadow-xl">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                <div className="w-0.5 h-2 bg-gradient-to-b from-orange-500 to-transparent" />
              </div>
              <span className="text-sm font-medium tracking-wide bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
                Available Balance
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-zinc-400">Select Multiplier</Label>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(PAYOUT_MAP).map(([number]) => (
                <Button
                  key={number}
                  onClick={() => setSelectedNumber(number as NumberOption)}
                  className={`h-9 ${
                    selectedNumber === number
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  {number}x
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-zinc-400">Betting Mode</Label>
            <div className="flex rounded-lg bg-zinc-800/50 p-1 gap-1">
              <button
                onClick={() => setBettingMode('normal')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  bettingMode === 'normal'
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setBettingMode('martingale')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  bettingMode === 'martingale'
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Martingale
              </button>
            </div>
          </div>

          {bettingMode === 'normal' && (
            <div className="space-y-2">
              <Label className="text-sm text-zinc-400">Bet Amount</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={betAmount || ''}
                    onChange={(e) => handleBetAmountChange(Number(e.target.value))}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-2 appearance-none text-white"
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleBetAmountChange(Math.ceil(scrap * 0.25))}
                    className="min-w-[48px] h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                  >
                    25%
                  </button>
                  <button
                    onClick={() => handleBetAmountChange(Math.ceil(scrap * 0.5))}
                    className="min-w-[48px] h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => handleBetAmountChange(scrap)}
                    className="min-w-[48px] h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>
          )}

          {bettingMode === 'martingale' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-zinc-400">Initial Bet</Label>
                  <Label className="text-sm text-orange-400">Current Bet: {betAmount}</Label>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={initialBet || ''}
                      onChange={(e) => setInitialBet(Number(e.target.value))}
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-2 appearance-none text-white"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setInitialBet(Math.ceil(scrap * 0.25))}
                      className="min-w-[48px] h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      25%
                    </button>
                    <button
                      onClick={() => setInitialBet(Math.ceil(scrap * 0.5))}
                      className="min-w-[48px] h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      50%
                    </button>
                    <button
                      onClick={() => setInitialBet(scrap)}
                      className="min-w-[48px] h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={bettingMode === 'normal' ? handleNormalSpin : handleSpinUntilWin}
          disabled={
            mustStartSpinning || 
            (bettingMode === 'normal' 
              ? (betAmount <= 0 || betAmount > scrap)
              : (initialBet <= 0 || initialBet > scrap)
            )
          }
          className={`
            w-full h-14 relative overflow-hidden
            ${mustStartSpinning 
              ? 'bg-zinc-800 cursor-not-allowed' 
              : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600'}
            disabled:bg-zinc-800 disabled:cursor-not-allowed
            transition-all duration-300 ease-out
            shadow-lg hover:shadow-orange-500/25
            group
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative flex items-center justify-center w-full h-full -translate-x-5">
            <span className={`font-semibold text-lg flex items-center gap-3 ${
              mustStartSpinning ? 'animate-pulse' : ''
            }`}>
              <img 
                src="/hongsi2.png" 
                alt="token" 
                className={`w-13 h-13 object-contain ${
                  mustStartSpinning ? 'animate-spin' : 'group-hover:scale-110 transition-transform duration-300'
                }`}
              />
              {mustStartSpinning ? 'Spinning...' : (bettingMode === 'normal' ? 'Spin' : 'Spin Until Win')}
            </span>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
} 