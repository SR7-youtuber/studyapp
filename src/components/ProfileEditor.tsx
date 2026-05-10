/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Camera, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  setUsername: (name: string) => void;
}

export default function ProfileEditor({ isOpen, onClose, username, setUsername }: ProfileEditorProps) {
  const [tempName, setTempName] = useState(username);

  const handleSave = () => {
    setUsername(tempName);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-space-deep/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-space-deep">Edit Explorer</h2>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-cosmic-blue/20 flex items-center justify-center overflow-hidden border-4 border-cosmic-blue/30">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-cosmic-yellow rounded-full shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
                    <Camera size={14} className="text-space-deep font-bold" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3 font-medium uppercase tracking-widest">Profile Identity</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">
                    Cosmic Callsign
                  </label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cosmic-blue/50 focus:border-cosmic-blue transition-all"
                    placeholder="Enter your name..."
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 px-4 rounded-xl bg-cosmic-yellow text-space-deep font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-md active:scale-95"
                >
                  <Save size={18} />
                  Save Identity
                </button>
              </div>
            </div>
            
            {/* Bottom Accent */}
            <div className="h-2 w-full bg-cosmic-blue" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
