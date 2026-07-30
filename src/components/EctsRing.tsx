import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { GESAMT_ECTS } from '../lib/constants';

interface EctsRingProps {
  erreichtEcts: number;
  laufendEcts: number;
}

const FARBE_ERREICHT = '#6366f1';
const FARBE_LAUFEND = '#a5b4fc';

export function EctsRing({ erreichtEcts, laufendEcts }: EctsRingProps) {
  const { theme } = useTheme();
  const farbeRest = theme === 'dark' ? '#334155' : '#e2e8f0';
  const rest = Math.max(GESAMT_ECTS - erreichtEcts - laufendEcts, 0);
  const prozent = Math.min(Math.round((erreichtEcts / GESAMT_ECTS) * 100), 100);

  const data = [
    { name: 'Erreicht', value: erreichtEcts, farbe: FARBE_ERREICHT },
    { name: 'Laufend', value: laufendEcts, farbe: FARBE_LAUFEND },
    { name: 'Rest', value: rest, farbe: farbeRest },
  ];

  return (
    <div className="relative mx-auto h-32 w-32 sm:h-48 sm:w-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((eintrag) => (
              <Cell key={eintrag.name} fill={eintrag.farbe} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold sm:text-3xl">{prozent}%</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {erreichtEcts}/{GESAMT_ECTS} ECTS
        </span>
      </div>
    </div>
  );
}
