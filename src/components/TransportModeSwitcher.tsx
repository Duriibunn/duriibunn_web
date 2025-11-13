import type { TransportMode } from '../types';
import { Car, Bus, Footprints } from 'lucide-react';

interface TransportModeSwitcherProps {
  mode: TransportMode;
  onChange: (mode: TransportMode) => void;
}

const modes: Array<{ value: TransportMode; label: string; icon: typeof Car }> = [
  { value: 'WALK', label: '도보', icon: Footprints },
  { value: 'TRANSIT', label: '대중교통', icon: Bus },
  { value: 'DRIVE', label: '차량', icon: Car },
];

export default function TransportModeSwitcher({ mode, onChange }: TransportModeSwitcherProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">이동 수단</h3>
      <div className="grid grid-cols-3 gap-2">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => onChange(m.value)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                isActive
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
