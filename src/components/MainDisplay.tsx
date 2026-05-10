/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ShoppingCart, Trophy, Settings as SettingsIcon, Star, CheckCircle2, UserCircle2 } from 'lucide-react';

interface MainDisplayProps {
  activeTab: string;
}

export default function MainDisplay({ activeTab }: MainDisplayProps) {
  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-8 pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {activeTab === 'study' && <StudyView />}
          {activeTab === 'shop' && <ShopView />}
          {activeTab === 'leaderboard' && <LeaderboardView />}
          {activeTab === 'settings' && <SettingsView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StudyView() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-space-deep">Learning Path</h2>
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full bg-cosmic-blue border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
              {i}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6 relative">
        {/* Connection Line */}
        <div className="absolute top-0 bottom-0 w-1 bg-gray-100 rounded-full -z-10" />

        <StudyNode 
          title="Nebular Basics" 
          icon={BookOpen} 
          status="completed" 
          delay={0.1} 
        />
        <StudyNode 
          title="Quantum Mechanics" 
          icon={BookOpen} 
          status="active" 
          delay={0.2} 
        />
        <StudyNode 
          title="Stellar Lifecycle" 
          icon={Star} 
          status="locked" 
          delay={0.3} 
          offset="right"
        />
        <StudyNode 
          title="Galactic Lore" 
          icon={Star} 
          status="locked" 
          delay={0.4} 
        />
      </div>
    </div>
  );
}

function StudyNode({ title, icon: Icon, status, delay, offset }: any) {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: offset === 'right' ? 20 : offset === 'left' ? -20 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`flex flex-col items-center group ${offset === 'right' ? 'ml-24' : offset === 'left' ? 'mr-24' : ''}`}
    >
      <div className={`
        relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
        ${isCompleted ? 'bg-cosmic-blue text-white shadow-lg' : 
          isActive ? 'bg-cosmic-yellow text-space-deep shadow-xl ring-8 ring-cosmic-yellow/20 scale-110' : 
          'bg-gray-100 text-gray-300'}
      `}>
        <Icon size={32} />
        {isCompleted && (
          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full border-4 border-white">
            <CheckCircle2 size={24} className="text-white" fill="currentColor" />
          </div>
        )}
      </div>
      <span className={`mt-3 font-bold text-sm ${isActive ? 'text-space-deep' : 'text-gray-400'}`}>
        {title}
      </span>
    </motion.div>
  );
}

function ShopView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-space-deep">Orbital Shop</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: 'X-Ray Goggles', price: 250, icon: '👓' },
          { name: 'Moon Boots', price: 500, icon: '🥾' },
          { name: 'Oxygen Tank', price: 100, icon: '🍼' },
          { name: 'Star Map', price: 750, icon: '📜' },
        ].map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-space-deep">{item.name}</h3>
            <div className="flex items-center gap-1 mt-2">
              <div className="w-3 h-3 rounded-full bg-cosmic-blue" />
              <span className="text-xs font-bold text-gray-500">{item.price} Gems</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-space-deep">Stellar Ranking</h2>
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        {[
          { name: 'NovaExplorer', xp: 12400, rank: 1 },
          { name: 'SpaceCadet_01', xp: 10200, rank: 2 },
          { name: 'CosmicDust', xp: 9800, rank: 3 },
          { name: 'LunarLion', xp: 8500, rank: 4 },
          { name: 'SolarFlare', xp: 7200, rank: 5 },
        ].map((user, i) => (
          <div key={user.name} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <span className={`w-6 text-center font-bold font-display ${i < 3 ? 'text-cosmic-yellow' : 'text-gray-300'}`}>
                {user.rank}
              </span>
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <span className="font-bold text-space-deep">{user.name}</span>
            </div>
            <span className="text-sm font-bold text-cosmic-blue">{user.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-space-deep">Cockpit Config</h2>
      <div className="space-y-3">
        {[
          { label: 'Notifications', value: 'Enabled' },
          { label: 'Sound Effects', value: 'Disabled' },
          { label: 'Dark Nebula Mode', value: 'System' },
          { label: 'Study Reminders', value: '8:00 PM' },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
            <span className="font-medium text-gray-500">{item.label}</span>
            <span className="font-bold text-cosmic-blue">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
