import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Globe, 
  Settings, 
  Search, 
  X, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  ExternalLink,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('games');
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [browserUrl, setBrowserUrl] = useState('');
  const [currentBrowserUrl, setCurrentBrowserUrl] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const filteredGames = gamesData.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBrowserSubmit = (e) => {
    e.preventDefault();
    let url = browserUrl.trim();
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    // Use our proxy endpoint to bypass CORS
    setCurrentBrowserUrl(`/api/proxy?url=${encodeURIComponent(url)}`);
  };

  // Panic Key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`') {
        window.location.href = 'https://classroom.google.com';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg selection:bg-neon-green selection:text-black">
      {/* Navigation Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-8 space-y-8 bg-dark-card border-r border-white/5 z-50">
        <div className="w-12 h-12 bg-neon-green rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,0,0.3)]">
          <span className="text-black font-black text-2xl">N</span>
        </div>
        
        <NavButton 
          active={activeTab === 'games'} 
          onClick={() => setActiveTab('games')}
          icon={<Gamepad2 size={24} />}
          label="Games"
        />
        
        <NavButton 
          active={activeTab === 'browser'} 
          onClick={() => setActiveTab('browser')}
          icon={<Globe size={24} />}
          label="Proxy"
        />
        
        <div className="mt-auto">
          <NavButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
            icon={<Settings size={24} />}
            label="Settings"
          />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="ml-20 flex-1 p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto"
            >
              <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-5xl font-black uppercase tracking-tighter neon-text mb-2">
                    Nexus <span className="text-neon-green">Games</span>
                  </h1>
                  <p className="text-white/50 font-mono text-sm">ACCESS GRANTED // {filteredGames.length} MODULES LOADED</p>
                </div>
                
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-neon-green transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="SEARCH DATABASE..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 w-full md:w-80 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/30 transition-all font-mono text-sm"
                  />
                </div>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedGame(game)}
                    className="group cursor-pointer bg-dark-card rounded-2xl overflow-hidden cyber-border transition-all"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent opacity-60" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-neon-green transition-colors">{game.title}</h3>
                      <p className="text-white/40 text-sm line-clamp-2 font-mono leading-relaxed">{game.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'browser' && (
            <motion.div
              key="browser"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-[calc(100vh-4rem)] flex flex-col"
            >
              <div className="bg-dark-card border border-white/10 rounded-t-2xl p-4 flex items-center gap-4">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => setCurrentBrowserUrl(currentBrowserUrl)}
                    className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleBrowserSubmit} className="flex-1 relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input 
                    type="text" 
                    value={browserUrl}
                    onChange={(e) => setBrowserUrl(e.target.value)}
                    placeholder="ENTER URL OR SEARCH SECURELY..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:border-neon-green transition-all font-mono text-sm"
                  />
                </form>
                
                <button 
                  onClick={toggleFullScreen}
                  className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors"
                >
                  <Maximize2 size={20} />
                </button>
              </div>
              
              <div className="flex-1 bg-black border-x border-b border-white/10 rounded-b-2xl overflow-hidden relative">
                {!currentBrowserUrl ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-neon-green/10 rounded-full flex items-center justify-center mb-6 border border-neon-green/20">
                      <Globe size={48} className="text-neon-green" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Secure Proxy Browser</h2>
                    <p className="text-white/40 max-w-md font-mono text-sm leading-relaxed">
                      Enter a URL above to browse through our secure tunnel. 
                      Note: Some sites may block iframe embedding due to security policies.
                    </p>
                    <div className="mt-8 flex gap-4">
                      {['google.com', 'duckduckgo.com', 'wikipedia.org'].map(site => (
                        <button 
                          key={site}
                          onClick={() => {
                            setBrowserUrl(site);
                            setCurrentBrowserUrl(`https://${site}`);
                          }}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-neon-green hover:text-neon-green transition-all font-mono text-xs"
                        >
                          {site}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <iframe 
                    src={currentBrowserUrl} 
                    className="w-full h-full border-none"
                    title="Proxy Browser"
                  />
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">System <span className="text-neon-green">Settings</span></h2>
              
              <div className="space-y-6">
                <SettingsCard 
                  title="Cloaking Mode" 
                  description="Changes the tab title and icon to look like a boring school document."
                  action={<button className="px-4 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-white transition-colors">ENABLE</button>}
                />
                <SettingsCard 
                  title="Panic Key" 
                  description="Instantly redirects to Google Classroom when you press the '`' key."
                  action={<button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-neon-green transition-colors">CONFIGURE</button>}
                />
                <SettingsCard 
                  title="Clear Cache" 
                  description="Wipe all local game data and browser history."
                  action={<button className="px-4 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">WIPE DATA</button>}
                />
                
                <div className="p-6 bg-dark-card rounded-2xl border border-white/5 mt-12">
                  <div className="flex items-center gap-3 mb-4 text-neon-green">
                    <Info size={20} />
                    <h3 className="font-bold uppercase tracking-wider">About Nexus</h3>
                  </div>
                  <p className="text-white/40 font-mono text-sm leading-relaxed">
                    Nexus is a privacy-focused web portal designed for unrestricted access. 
                    Built with speed and stealth in mind. Version 2.4.0-stable.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Game Player Overlay */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
                <div>
                  <h2 className="text-xl font-bold leading-none mb-1">{selectedGame.title}</h2>
                  <p className="text-white/40 text-xs font-mono uppercase tracking-widest">RUNNING MODULE // {selectedGame.id}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm font-bold">
                  <ExternalLink size={16} />
                  OPEN IN NEW TAB
                </button>
                <button 
                  onClick={toggleFullScreen}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Maximize2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <iframe 
                src={selectedGame.url} 
                className="w-full h-full border-none"
                title={selectedGame.title}
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`group relative p-3 rounded-xl transition-all duration-300 ${
        active ? 'bg-neon-green text-black' : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="absolute left-full ml-4 px-2 py-1 bg-white text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest">
        {label}
      </span>
    </button>
  );
}

function SettingsCard({ title, description, action }) {
  return (
    <div className="p-6 bg-dark-card rounded-2xl border border-white/5 flex items-center justify-between gap-6 hover:border-white/10 transition-colors">
      <div>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-white/40 text-sm font-mono">{description}</p>
      </div>
      {action}
    </div>
  );
}
