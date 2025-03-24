'use client';

import { useSpinContext } from '@/contexts/SpinContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ResultHistory() {
  const { history } = useSpinContext();

  return (
    <Card className="bg-zinc-900/50 border-zinc-700 h-full">
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 text-transparent bg-clip-text">
          Betting History
        </CardTitle>
        <p className="text-zinc-400 text-xs mt-2">
          Track your betting history and performance. Win rates are calculated based on your selected numbers and payouts.
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[30rem] rounded-md border border-zinc-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-bold text-orange-400">Multiplier</TableHead>
                <TableHead className="text-center font-bold text-orange-400">Bet Amount</TableHead>
                <TableHead className="text-center font-bold text-orange-400">Result</TableHead>
                <TableHead className="text-center font-bold text-orange-400">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-white">{item.number}x</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 text-white">
                      <span>{item.amount}</span>
                      <img 
                        src="/hong-nyang-token.png" 
                        alt="token" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-bold ${
                      item.result === 'WIN' 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {item.result}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`font-bold ${
                        item.change > 0 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {item.change > 0 ? '+' : ''}{item.change}
                      </span>
                      <img 
                        src="/hong-nyang-token.png" 
                        alt="token" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-zinc-500 py-7">
                    No betting history yet. Start playing to see your results!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Total Bets:</span>
            <span>{history.length}</span>
          </div>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Win Rate:</span>
            <span>
              {history.length > 0
                ? `${((history.filter(item => item.result === 'WIN').length / history.length) * 100).toFixed(1)}%`
                : '0%'}
            </span>
          </div>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Net Profit:</span>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${
                history.reduce((sum, item) => sum + item.change, 0) > 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {history.reduce((sum, item) => sum + item.change, 0)}
              </span>
              <img 
                src="/hong-nyang-token.png" 
                alt="token" 
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 