import { useState, useCallback } from 'react';
import { NumberOption, rawSegments } from '@/constants/wheelData';

const PAYOUT_MAP = {
    '1': 2,
    '3': 4,
    '5': 6,
    '10': 11,
    '20': 21
} as const;

type SpinResult = {
  number: string;
  amount: number;
  result: 'WIN' | 'LOSE';
  change: number;
};

type AlertInfo = {
  result: 'WIN' | 'LOSE';
  amount: number;
  multiplier: string;
  payout: number;
};

export function useSpin() {
  const [mustStartSpinning, setMustStartSpinning] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({
    result: 'WIN',
    amount: 0,
    multiplier: '1',
    payout: 0
  });
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);
  const [currentBet, setCurrentBet] = useState<{amount: number, selected: NumberOption} | null>(null);

  const startSpin = useCallback((betAmount: number, selectedNumber: NumberOption) => {
    if (betAmount <= 0 || mustStartSpinning) return;
    
    setShowAlert(false);
    setLastResult(null);
    
    setCurrentBet({ amount: betAmount, selected: selectedNumber });
    const randomNumber = Math.floor(Math.random() * rawSegments.length);
    console.log('Starting spin with prize number:', randomNumber);
    setPrizeNumber(randomNumber);
    setMustStartSpinning(true);
  }, [mustStartSpinning]);

  const handleSpinComplete = useCallback(() => {
    if (!currentBet) {
      console.log('No current bet found');
      return;
    }
    
    console.log('Spin completed, prize number:', prizeNumber);
    const resultNumber = rawSegments[prizeNumber] as NumberOption;
    const isWin = resultNumber === currentBet.selected;
    const payout = isWin ? currentBet.amount * PAYOUT_MAP[currentBet.selected] : 0;
    
    const result: SpinResult = {
      number: currentBet.selected,
      amount: currentBet.amount,
      result: isWin ? 'WIN' : 'LOSE',
      change: payout - currentBet.amount
    };

    console.log('Setting alert info:', {
      result: result.result,
      amount: currentBet.amount,
      multiplier: currentBet.selected,
      payout
    });

    setAlertInfo({
      result: result.result,
      amount: currentBet.amount,
      multiplier: currentBet.selected,
      payout
    });
    
    setShowAlert(true);
    console.log('Alert should be visible now');
    
    setHistory(prev => [result, ...prev]);
    setLastResult(result);
    setMustStartSpinning(false);
    setCurrentBet(null);
  }, [prizeNumber, currentBet]);

  return {
    mustStartSpinning,
    prizeNumber,
    showAlert,
    alertInfo,
    history,
    lastResult,
    startSpin,
    handleSpinComplete,
    hideAlert: () => setShowAlert(false)
  };
} 