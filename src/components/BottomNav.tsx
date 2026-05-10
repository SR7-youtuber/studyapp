/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, ShoppingCart, Trophy, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: 'study', label: 'Study', icon: BookOpen },
  { id: 'shop', label: 'Shop', icon: ShoppingCart },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pb-safe pt-2 h-16 md:h-20 z-50 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            id={`nav-item-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center relative transition-colors ${
              isActive ? 'text-cosmic-yellow' : 'text-gray-400 hover:text-cosmic-blue'
            }`}
          >
            <div className="relative p-1">
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2}
                className="transition-transform duration-200"
              />
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-cosmic-yellow/10 blur-md rounded-full -z-10"
                />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
              {tab.label}
            </span>
            
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -top-2 w-8 h-1 bg-cosmic-yellow rounded-full"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
