'use client';

import { Wheel } from 'react-custom-roulette';
import { data } from '@/constants/wheelData';
import { useSpinContext } from '@/contexts/SpinContext';
import { useEffect } from 'react';

export default function RouletteWheel() {
  const { mustStartSpinning, prizeNumber, handleSpinComplete } = useSpinContext();

  useEffect(() => {
    console.log('Wheel state:', { mustStartSpinning, prizeNumber, dataLength: data.length });
  }, [mustStartSpinning, prizeNumber]);

  return (
    <div className="flex-shrink-0 relative">
      <div>
        <Wheel
          mustStartSpinning={mustStartSpinning}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={handleSpinComplete}
          outerBorderColor="#1e1e1e"
          outerBorderWidth={3}
          innerRadius={0}
          innerBorderColor="#1e1e1e"
          innerBorderWidth={20}
          radiusLineColor="#1e1e1e"
          radiusLineWidth={2}
          fontSize={20}
          fontFamily="Geist"
          textDistance={85}
          spinDuration={0.8}
          perpendicularText={true}
          backgroundColors={[
            '#FF6B6B',
            '#4ECDC4',
            '#45B7D1',
            '#96CEB4',
            '#FFEEAD',
            '#FFD93D',
            '#FF9F1C',
            '#E84A5F',
          ]}
          textColors={['#ffffff']}
        />
      </div>
    </div>
  );
}