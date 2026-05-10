/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pencil } from 'lucide-react';
import { motion } from 'motion/react';

interface TopBarProps {
  username: string;
  onEditProfile: () => void;
  gems: number;
  xp: number;
}

export default function TopBar({ username, onEditProfile, gems, xp }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-transparent px-4 flex items-center justify-between">
      {/* Profile Section */}
      <motion.div 
        whileTap={{ scale: 0.95 }}
        onClick={onEditProfile}
        className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-cosmic-blue/40 border border-white/30 overflow-hidden ring-2 ring-white/10">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
            alt="Profile icon" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-bold text-sm tracking-tight">{username}</span>
          <Pencil size={12} className="text-cosmic-blue" />
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="flex gap-2">
        <StatPill label="Gems" value={gems} color="bg-cosmic-blue" />
        <StatPill label="XP" value={xp} color="bg-cosmic-yellow" />
      </div>
    </header>
  );
}

function StatPill({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20`}>
      <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_rgba(255,255,255,0.5)]`} />
      <span className="text-white font-bold text-xs uppercase tracking-wider">{value}</span>
      <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest ml-0.5">{label}</span>
    </div>
  );
}
