'use client';

import { Wheel } from 'react-custom-roulette';

interface RoulettWheelProps {
  mustStartSpinning: boolean;
  prizeNumber: number;
  data: Array<{
    option: string;
    style: {
      backgroundColor: string;
      textColor: string;
      fontSize: number;
    };
  }>;
  onStopSpinning: () => void;
}

export default function RouletteWheel({
  mustStartSpinning,
  prizeNumber,
  data,
  onStopSpinning
}: RoulettWheelProps) {
  return (
    <Wheel
      mustStartSpinning={mustStartSpinning}
      prizeNumber={prizeNumber}
      data={data}
      outerBorderColor="#333"
      outerBorderWidth={3}
      innerRadius={0}
      radiusLineColor="#333"
      radiusLineWidth={2}
      fontSize={20}
      spinDuration={0.4}
      onStopSpinning={onStopSpinning}
      textDistance={85}
      startingOptionIndex={15}
    />
  );
} 