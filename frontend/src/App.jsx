import { useState } from 'react';
import { shortenUrl, getAnalytics } from './services/api';
import { Copy, Link as LinkIcon, ArrowRight, BarChart3, RefreshCw } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [shortened, setShortened] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clicks, setClicks] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setClicks(0);
    try {
      const result = await shortenUrl(url);
      setShortened(result);
    } catch (error) {
      console.error(error);
      alert('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStats = async () => {
    if (!shortened) return;
    const data = await getAnalytics(shortened.code);
    if (data) {
      setClicks(data.totalClicks);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortened.shortUrl);
    alert('Link copiado!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
          ShortLink
        </h1>
        <p className="text-gray-400 text-lg">Encurtador com Analytics em Tempo Real</p>
      </div>

      <div className="w-full max-w-xl bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="url"
              placeholder="Cole seu link aqui..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? 'Encurtando...' : <>Encurtar Agora <ArrowRight size={20} /></>}
          </button>
        </form>

        {shortened && (
          <div className="mt-8 space-y-4 animation-fade-in">
            
            {/* Área do Link */}
            <div className="p-4 bg-gray-900/50 rounded-xl border border-blue-500/30">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Link Gerado</p>
              <div className="flex items-center justify-between gap-4 bg-gray-950 p-3 rounded-lg">
                <a href={shortened.shortUrl} target="_blank" className="text-blue-400 font-mono truncate hover:underline">
                  {shortened.shortUrl}
                </a>
                <button onClick={copyToClipboard} className="p-2 hover:bg-gray-800 rounded text-gray-300">
                  <Copy size={18} />
                </button>
              </div>
            </div>

            {/* Área de Analytics */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 flex items-center gap-3">
                    <div className="p-3 bg-purple-500/20 text-purple-400 rounded-lg">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase">Total Cliques</p>
                        <p className="text-2xl font-bold text-white">{clicks}</p>
                    </div>
                </div>

                <button 
                    onClick={handleRefreshStats}
                    className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl border border-gray-600 flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    <span className="text-sm font-medium">Atualizar Dados</span>
                </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;