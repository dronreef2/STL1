import React, { useState, useEffect } from 'react';
import Viewer3D from './components/Viewer3D';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Github, Search, X, FileText, Settings } from 'lucide-react';

function App() {
  const [catalog, setCatalog] = useState([]);
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' or 'instructions'

  // Fetch catalog.json on mount and handle deep linking
  useEffect(() => {
    fetch('/catalog.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load catalog');
        }
        return response.json();
      })
      .then(data => {
        setCatalog(data);
        setLoading(false);
        
        // Handle deep linking
        const urlParams = new URLSearchParams(window.location.search);
        const modelParam = urlParams.get('model');
        if (modelParam) {
          const modelIndex = data.findIndex(m => m.id === modelParam);
          if (modelIndex !== -1) {
            setSelectedModelIndex(modelIndex);
          }
        }
      })
      .catch(err => {
        console.error('Error loading catalog:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Update URL when model changes
  useEffect(() => {
    if (catalog.length > 0) {
      const selectedModel = catalog[selectedModelIndex];
      const newUrl = `${window.location.pathname}?model=${selectedModel.id}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [selectedModelIndex, catalog]);

  // Filter models based on search query
  const filteredCatalog = catalog.filter(model => 
    model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-slate-300">Loading catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg max-w-md border border-slate-700">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Catalog</h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <p className="text-sm text-slate-400">
            Make sure to run <code className="bg-slate-700 px-2 py-1 rounded">npm run docs</code> to generate the catalog.
          </p>
        </div>
      </div>
    );
  }

  if (catalog.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg max-w-md text-center border border-slate-700">
          <h2 className="text-xl font-bold text-slate-200 mb-2">No Models Found</h2>
          <p className="text-slate-300 mb-4">
            Add models to <code className="bg-slate-700 px-2 py-1 rounded">design/</code> and run the build commands.
          </p>
          <div className="text-sm text-left bg-slate-900 p-4 rounded">
            <code className="block text-slate-300">npm run gen</code>
            <code className="block text-slate-300">npm run docs</code>
          </div>
        </div>
      </div>
    );
  }

  const selectedModel = catalog[selectedModelIndex];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = selectedModel.stlUrl;
    link.download = `${selectedModel.id}.stl`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewSource = () => {
    const repoUrl = 'https://github.com/dronreef2/STL1';
    window.open(`${repoUrl}/tree/main/design/${selectedModel.id}`, '_blank');
  };

  return (
    <div className="App h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <header className="bg-slate-950 text-white p-4 shadow-lg z-20 border-b border-slate-800">
        <h1 className="text-xl md:text-2xl font-bold text-slate-100">MakerOS - 3D Model Viewer</h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Code-CAD with JSCAD • React Three Fiber • GitOps
        </p>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:block w-80 bg-slate-800 border-r border-slate-700 overflow-y-auto shadow-lg">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4 text-slate-100">Model Library</h3>
            
            {/* Search Bar */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Model List */}
            <div className="space-y-2">
              {filteredCatalog.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">No models found</p>
              ) : (
                filteredCatalog.map((model, displayIndex) => {
                  const actualIndex = catalog.findIndex(m => m.id === model.id);
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModelIndex(actualIndex)}
                      className={`w-full text-left p-4 rounded-lg transition-all border ${
                        actualIndex === selectedModelIndex
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                          : 'bg-slate-900 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-base">{model.title}</div>
                      <div className={`text-xs mt-1 ${
                        actualIndex === selectedModelIndex ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        {model.description}
                      </div>
                      <div className={`text-xs mt-2 ${
                        actualIndex === selectedModelIndex ? 'text-blue-200' : 'text-slate-500'
                      }`}>
                        {model.parameters.length} parameter{model.parameters.length !== 1 ? 's' : ''}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Model Title - Only visible when sidebars are hidden */}
          <div className="md:hidden bg-slate-900 px-4 py-3 border-b border-slate-700">
            <h2 className="font-bold text-lg text-slate-100">{selectedModel.title}</h2>
            <p className="text-xs text-slate-400">{selectedModel.description}</p>
          </div>

          {/* 3D Viewer */}
          <div className="flex-1 relative bg-slate-950">
            <Viewer3D key={selectedModel.id} modelUrl={selectedModel.stlUrl} />
          </div>

          {/* Action Buttons - Above the panel */}
          <div className="bg-slate-900 px-4 md:px-6 py-3 border-t border-slate-700 flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-md"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download STL</span>
              <span className="sm:hidden">Download</span>
            </button>
            <button
              onClick={handleViewSource}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold transition-colors border border-slate-600"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">View Source</span>
              <span className="sm:hidden">Source</span>
            </button>
          </div>
        </div>

        {/* Right Panel - Info Panel */}
        <aside className="hidden lg:flex w-96 bg-slate-800 border-l border-slate-700 overflow-y-auto shadow-lg flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-700 bg-slate-900">
            <button
              onClick={() => setActiveTab('specs')}
              className={`flex-1 px-4 py-3 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'specs'
                  ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex-1 px-4 py-3 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'instructions'
                  ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              Instructions
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'specs' ? (
              <div>
                <h3 className="font-bold text-lg mb-4 text-slate-100">
                  {selectedModel.title}
                </h3>
                <p className="text-sm text-slate-400 mb-6">{selectedModel.description}</p>
                
                {selectedModel.parameters.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-700">
                      <thead className="bg-slate-900">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Parameter
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Default
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Range
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {selectedModel.parameters.map((param, idx) => (
                          <tr key={idx} className="hover:bg-slate-700">
                            <td className="px-4 py-3 text-sm font-mono text-slate-200">
                              {param.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-400">
                              {param.type}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-blue-400">
                              {param.initial}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-400">
                              {param.min !== undefined && param.max !== undefined 
                                ? `${param.min} - ${param.max}${param.step ? ` (±${param.step})` : ''}`
                                : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Parameter descriptions below table */}
                    <div className="mt-6 space-y-3">
                      {selectedModel.parameters.map((param, idx) => (
                        param.caption && (
                          <div key={idx} className="bg-slate-900 p-3 rounded border border-slate-700">
                            <span className="font-mono text-sm text-blue-400">{param.name}</span>
                            <p className="text-sm text-slate-300 mt-1">{param.caption}</p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic">No configurable parameters</p>
                )}

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="text-xs text-slate-500 space-y-2">
                    <div>
                      <span className="font-semibold text-slate-400">Model ID:</span>{' '}
                      <code className="bg-slate-900 px-2 py-1 rounded text-slate-300">{selectedModel.id}</code>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">Last updated:</span>{' '}
                      <span className="text-slate-400">{new Date(selectedModel.lastUpdate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom styling for markdown elements
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-slate-100 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-slate-200 mb-3 mt-6" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-slate-300 mb-2 mt-4" {...props} />,
                    p: ({node, ...props}) => <p className="text-slate-300 mb-3 leading-relaxed" {...props} />,
                    a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline 
                        ? <code className="bg-slate-900 px-1.5 py-0.5 rounded text-sm text-blue-300 font-mono" {...props} />
                        : <code className="block bg-slate-900 p-3 rounded text-sm text-slate-300 font-mono overflow-x-auto" {...props} />,
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full divide-y divide-slate-700 border border-slate-700" {...props} />
                      </div>
                    ),
                    thead: ({node, ...props}) => <thead className="bg-slate-900" {...props} />,
                    th: ({node, ...props}) => <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase" {...props} />,
                    td: ({node, ...props}) => <td className="px-4 py-2 text-sm text-slate-300 border-t border-slate-700" {...props} />,
                    tr: ({node, ...props}) => <tr className="hover:bg-slate-700" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside text-slate-300 mb-3 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside text-slate-300 mb-3 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="text-slate-300" {...props} />,
                  }}
                >
                  {selectedModel.readmeContent || 'No instructions available.'}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
