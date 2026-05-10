/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import TopBar from './components/TopBar';
import SpaceHeader from './components/SpaceHeader';
import BottomNav from './components/BottomNav';
import MainDisplay from './components/MainDisplay';
import ProfileEditor from './components/ProfileEditor';

export default function App() {
  const [activeTab, setActiveTab] = useState('study');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [username, setUsername] = useState('Stellar_Seeker');
  
  // Mock stats
  const [gems] = useState(450);
  const [xp] = useState(2450);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden relative">
      {/* Background Layer (Deep Space) */}
      <div className="absolute top-0 left-0 right-0 h-[35vh] space-gradient -z-20" />
      
      {/* Persistent Top Bar */}
      <TopBar 
        username={username} 
        onEditProfile={() => setIsEditingProfile(true)} 
        gems={gems}
        xp={xp}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-16">
        {/* Space Header (Stars & Quote) */}
        <SpaceHeader />
        
        {/* Scrollable Content Display */}
        <div className="flex-1 bg-white rounded-t-[40px] -mt-10 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mt-4 mb-2" />
          <MainDisplay activeTab={activeTab} />
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Overlays */}
      <ProfileEditor 
        isOpen={isEditingProfile} 
        onClose={() => setIsEditingProfile(false)}
        username={username}
        setUsername={setUsername}
      />
    </div>
  );
}

