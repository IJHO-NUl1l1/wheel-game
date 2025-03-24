'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSpinContext } from '@/contexts/SpinContext';

export default function GameAlert() {
  const { showAlert, hideAlert, alertInfo } = useSpinContext();
  const { result, amount, multiplier, payout } = alertInfo;

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[100]"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: {
                type: "spring",
                duration: 0.5
              }
            }}
            exit={{ 
              scale: 0.5, 
              opacity: 0,
              transition: {
                duration: 0.3
              }
            }}
            className="flex flex-col items-center bg-zinc-900/90 border border-zinc-700 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="space-y-6">
              <motion.div 
                className="relative"
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  transition: {
                    duration: 1,
                    repeat: 2
                  }
                }}
              >
                <img 
                  src="/hong-nyang-token.png" 
                  alt="token" 
                  className="w-30 h-30 object-contain m-5"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`absolute -top-2 -right-0.5 text-sm font-bold px-3 py-1 rounded-full ${
                    result === 'WIN' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500' 
                      : 'bg-red-500/20 text-red-400 border border-red-500'
                  }`}
                >
                  {result}
                </motion.div>
              </motion.div>

              <motion.div 
                className="text-center space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className={`text-3xl font-bold ${
                  result === 'WIN' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result === 'WIN' ? 'You Won!' : 'You Lost!'}
                </h2>
                <div className="space-y-1 text-zinc-400">
                  <p>Bet Amount: {amount}</p>
                  <p>Multiplier: {multiplier}x</p>
                  <motion.p 
                    className={`text-xl font-bold ${
                      result === 'WIN' ? 'text-green-400' : 'text-red-400'
                    }`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {result === 'WIN' ? '+' : ''}{payout}
                  </motion.p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5 }}
                className={`w-full h-1 rounded-full ${
                  result === 'WIN' 
                    ? 'bg-gradient-to-r from-green-500/20 via-green-500 to-green-500/20' 
                    : 'bg-gradient-to-r from-red-500/20 via-red-500 to-red-500/20'
                }`} 
              />

              <motion.div 
                className="w-full space-y-4 mt-4 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center text-zinc-400 gap-1">
                  <span>Result:</span>
                  <span className={result === 'WIN' ? 'text-green-400' : 'text-red-400'}>
                    {result === 'WIN' ? `Won ${payout}` : `Lost ${amount}`}
                  </span>
                  <img 
                  src="/hong-nyang-token.png" 
                  alt="token" 
                  className="w-10 h-10 object-contain"
                />
                </div>
                <div className="flex items-center text-zinc-400 gap-1">
                  <span>Change:</span>
                  <span className={payout - amount >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {payout - amount >= 0 ? '+' : ''}{payout - amount}
                  </span>
                </div>
              </motion.div>

              <motion.button
                onClick={hideAlert}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full py-2 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 