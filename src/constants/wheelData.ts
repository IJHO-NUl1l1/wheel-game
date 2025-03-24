export type NumberOption = '1' | '3' | '5' | '10' | '20';
export type BettingMode = 'normal' | 'martingale';

export const rawSegments = [
  '1', '3', '1', '5', '1', '3', '1', '10', '1', '3',
  '1', '20', '1', '3', '1', '5', '1', '3', '1', '10',
  '1', '3', '1', '5', '1', '3', '1', '10', '1', '5'
];

export const backgroundColors: Record<NumberOption, string> = {
  '1': '#e7d292',
  '3': '#90ee90',
  '5': '#87ceeb',
  '10': '#dda0dd',
  '20': '#ff7f50'
};

export const payout: Record<NumberOption, number> = {
  '1': 2,
  '3': 4,
  '5': 6,
  '10': 11,
  '20': 21
};

export const data = rawSegments.map((n) => ({
  option: n,
  style: {
    backgroundColor: backgroundColors[n as NumberOption],
    textColor: 'black',
    fontSize: 20,
  },
})); 