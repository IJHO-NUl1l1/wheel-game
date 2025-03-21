'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

type NumberOption = '1' | '3' | '5' | '10' | '20';
type BettingMode = 'normal' | 'martingale';

const rawSegments = [
  '1', '3', '1', '5', '1', '3', '1', '10', '1', '3',
  '1', '20', '1', '3', '1', '5', '1', '3', '1', '10',
  '1', '3', '1', '5', '1', '3', '1', '10', '1', '5'
];

const backgroundColors: Record<NumberOption, string> = {
  '1': '#e7d292',
  '3': '#90ee90',
  '5': '#87ceeb',
  '10': '#dda0dd',
  '20': '#ff7f50'
};

const data = rawSegments.map((n) => ({
  option: n,
  style: {
    backgroundColor: backgroundColors[n as NumberOption],
    textColor: 'black',
    fontSize: 20,
  },
}));

const payout: Record<NumberOption, number> = {
  '1': 2,
  '3': 4,
  '5': 6,
  '10': 11,
  '20': 21
};

const RouletteWheel = dynamic(() => import('@/components/RouletteWheel'), {
  ssr: false
});

export default function Home() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [scrap, setScrap] = useState(500);
  const [betAmount, setBetAmount] = useState(50);
  const [selectedNumber, setSelectedNumber] = useState<NumberOption>('1');
  const [message, setMessage] = useState('');
  const [bettingMode, setBettingMode] = useState<BettingMode>('normal');
  const [martingaleBet, setMartingaleBet] = useState(50);
  const [autoSpinning, setAutoSpinning] = useState(false);
  const [initialBet, setInitialBet] = useState(50);
  const [history, setHistory] = useState<Array<{
    number: string;
    amount: number;
    result: string;
    change: number;
  }>>([]);

  const handleSpinClick = useCallback(() => {
    if (mustSpin || betAmount > scrap || betAmount < 1) return;

    setMessage('');
    const randomIndex = Math.floor(Math.random() * data.length);
    setPrizeNumber(randomIndex);
    setMustSpin(true);
    setShowResult(false);
    setScrap((prev) => prev - betAmount);
  }, [mustSpin, betAmount, scrap]);

  useEffect(() => {
    if (autoSpinning && !mustSpin) {
      handleSpinClick();
    }
  }, [autoSpinning, mustSpin, handleSpinClick]);

  const handleBetAmountChange = (value: number) => {
    if (value > scrap) {
      setBetAmount(scrap);
    } else if (value < 0) {
      setBetAmount(0);
    } else {
      setBetAmount(value);
    }
  };

  const startMartingale = () => {
    if (martingaleBet > scrap) {
      setMessage("Insufficient balance!");
      setAutoSpinning(false);
      return;
    }
    setSelectedNumber('1');
    setBetAmount(martingaleBet);
    setAutoSpinning(true);
  };

  const handleResult = () => {
    const outcome = data[prizeNumber].option;
    setMustSpin(false);
    setShowResult(true);

    let change = -betAmount;
    if (outcome === selectedNumber) {
      const multiplier = payout[outcome as NumberOption];
      const winnings = betAmount * multiplier;
      change = winnings - betAmount;
      setScrap((prev) => prev + winnings);
      setMessage(`Win ${outcome}x! Got ${winnings} SCRAP`);
      
      if (bettingMode === 'martingale') {
        setAutoSpinning(false);
        setMartingaleBet(initialBet);
      }
    } else {
      setMessage(`Lost! Got ${outcome}, bet on ${selectedNumber}`);
      
      if (bettingMode === 'martingale') {
        const nextBet = betAmount * 2;
        if (nextBet > scrap) {
          setMessage("Martingale stopped: Insufficient balance!");
          setAutoSpinning(false);
          setMartingaleBet(initialBet);
        } else {
          setMartingaleBet(nextBet);
          setBetAmount(nextBet);
        }
      }
    }

    setHistory(prev => [{
      number: selectedNumber,
      amount: betAmount,
      result: outcome,
      change
    }, ...prev].slice(0, 10));
  };

  return (
    <main className="min-h-screen flex flex-col bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold p-4 text-center border-b border-zinc-800">Rust-style Wheel of Fortune</h1>
      
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setBettingMode('normal')}
          className={`px-6 py-3 ${bettingMode === 'normal' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
        >
          Normal
        </button>
        <button
          onClick={() => setBettingMode('martingale')}
          className={`px-6 py-3 ${bettingMode === 'martingale' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
        >
          Martingale
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-6 border-r border-zinc-800">
          <div className="space-y-6">
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="text-xl mb-4">
                Balance: <span className="font-bold text-green-400">{scrap}</span> SCRAP
              </div>
              
              {bettingMode === 'normal' ? (
                <div className="space-y-4">
                  <div>
                    <div className="mb-2">Multiplier:</div>
                    <div className="grid grid-cols-5 gap-2">
                      {['1', '3', '5', '10', '20'].map((num) => (
                        <button
                          key={num}
                          onClick={() => setSelectedNumber(num as NumberOption)}
                          className={`p-3 rounded-lg text-center ${
                            selectedNumber === num 
                              ? 'bg-green-600 text-white' 
                              : 'bg-zinc-700 hover:bg-zinc-600'
                          }`}
                        >
                          {num}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2">Bet Amount:</div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => handleBetAmountChange(Number(e.target.value))}
                        className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-white"
                        min={1}
                      />
                      <button
                        onClick={() => handleBetAmountChange(Math.floor(scrap / 2))}
                        className="px-3 py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600"
                      >
                        1/2
                      </button>
                      <button
                        onClick={() => handleBetAmountChange(scrap)}
                        className="px-3 py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSpinClick}
                    disabled={mustSpin || betAmount > scrap || betAmount < 1}
                    className="w-full bg-green-600 py-3 rounded-lg text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Spin ({betAmount} SCRAP)
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="mb-2">Initial Bet:</div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={initialBet}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setInitialBet(value);
                          setMartingaleBet(value);
                        }}
                        className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-white"
                        min={1}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2">Current Bet: {martingaleBet}</div>
                  </div>

                  <button
                    onClick={startMartingale}
                    disabled={mustSpin || martingaleBet > scrap}
                    className="w-full bg-green-600 py-3 rounded-lg text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {autoSpinning ? 'Auto Running...' : 'Start Martingale'}
                  </button>

                  {autoSpinning && (
                    <button
                      onClick={() => setAutoSpinning(false)}
                      className="w-full bg-red-600 py-3 rounded-lg text-lg hover:bg-red-700 transition"
                    >
                      Stop
                    </button>
                  )}
                </div>
              )}

              {message && (
                <div className="text-yellow-300 text-center mt-4">{message}</div>
              )}
            </div>

            <div className="bg-zinc-800 p-4 rounded-lg">
              <h2 className="text-xl mb-4">History</h2>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {history.map((record, i) => (
                  <div key={i} className="flex justify-between items-center bg-zinc-700 p-2 rounded">
                    <span>{record.number}x bet {record.amount}</span>
                    <span className={record.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {record.change >= 0 ? '+' : ''}{record.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 h-[calc(100vh-5rem)] overflow-hidden">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full max-w-[600px] aspect-square">
              <RouletteWheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                onStopSpinning={handleResult}
              />
            </div>
            
            {showResult && (
              <div className="text-xl font-semibold text-yellow-300 bg-black bg-opacity-75 p-4 rounded-lg animate-bounce">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
