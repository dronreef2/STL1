import React, { useState, useEffect } from 'react';
import Viewer3D from './components/Viewer3D';

function App() {
  const [catalog, setCatalog] = useState([]);
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch catalog.json on mount
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
      })
      .catch(err => {
        console.error('Error loading catalog:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Catalog</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Make sure to run <code className="bg-gray-100 px-2 py-1 rounded">npm run docs</code> to generate the catalog.
          </p>
        </div>
      </div>
    );
  }

  if (catalog.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Models Found</h2>
          <p className="text-gray-600 mb-4">
            Add models to <code className="bg-gray-100 px-2 py-1 rounded">design/</code> and run the build commands.
          </p>
          <div className="text-sm text-left bg-gray-50 p-4 rounded">
            <code className="block">npm run gen</code>
            <code className="block">npm run docs</code>
          </div>
        </div>
      </div>
    );
  }

  const selectedModel = catalog[selectedModelIndex];

  return (
    <div className="App h-screen flex flex-col">
      <header className="bg-gray-900 text-white p-4 shadow-lg z-20">
        <h1 className="text-2xl font-bold">MakerOS - 3D Model Viewer</h1>
        <p className="text-sm text-gray-300 mt-1">
          Code-CAD with JSCAD • React Three Fiber • GitOps
        </p>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto shadow-lg">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Model Library</h3>
            
            <div className="space-y-2">
              {catalog.map((model, index) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModelIndex(index)}
                  className={`w-full text-left p-4 rounded-lg transition-all border ${
                    index === selectedModelIndex
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200'
                  }`}
                >
                  <div className="font-semibold text-base">{model.title}</div>
                  <div className={`text-xs mt-1 ${
                    index === selectedModelIndex ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {model.description}
                  </div>
                  <div className={`text-xs mt-2 ${
                    index === selectedModelIndex ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {model.parameters.length} parameter{model.parameters.length !== 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 3D Viewer */}
          <div className="flex-1 relative">
            <Viewer3D key={selectedModel.id} modelUrl={selectedModel.stlUrl} />
          </div>

          {/* Parameter table - fixed at bottom */}
          <div className="bg-white border-t border-gray-200 p-6 shadow-lg max-h-64 overflow-y-auto">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              {selectedModel.title} - Technical Specifications
            </h3>
            
            {selectedModel.parameters.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parameter
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Default
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Range
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedModel.parameters.map((param, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">
                          {param.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {param.type}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                          {param.initial}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {param.min !== undefined && param.max !== undefined 
                            ? `${param.min} - ${param.max}${param.step ? ` (±${param.step})` : ''}`
                            : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {param.caption || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No configurable parameters</p>
            )}

            <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <span className="font-semibold">Model ID:</span>{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">{selectedModel.id}</code>
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {new Date(selectedModel.lastUpdate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
