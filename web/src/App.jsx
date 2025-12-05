import React, { useState } from 'react';
import Viewer3D from './components/Viewer3D';

function App() {
  const models = [
    { name: 'Demo Box', file: 'demo-box.stl', description: 'Parametric container with mounting holes' },
    { name: 'Simple Cube', file: 'examples.stl', description: 'Basic cube example' },
  ];

  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const selectedModel = models[selectedModelIndex];

  return (
    <div className="App">
      <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 z-10 shadow-lg">
        <h1 className="text-2xl font-bold">MakerOS - 3D Model Viewer</h1>
        <p className="text-sm text-gray-300 mt-1">
          Code-CAD with JSCAD • React Three Fiber • GitOps
        </p>
      </header>
      
      <div className="pt-20">
        <Viewer3D key={selectedModel.file} modelUrl={`/models/${selectedModel.file}`} />
      </div>

      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm">
        <h3 className="font-semibold mb-3">Model Selector</h3>
        
        <div className="space-y-2 mb-4">
          {models.map((model, index) => (
            <button
              key={model.file}
              onClick={() => setSelectedModelIndex(index)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                index === selectedModelIndex
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <div className="font-semibold">{model.name}</div>
              <div className={`text-xs mt-1 ${
                index === selectedModelIndex ? 'text-blue-100' : 'text-gray-600'
              }`}>
                {model.description}
              </div>
            </button>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-1">
            Current: <span className="font-mono text-blue-600">{selectedModel.file}</span>
          </p>
          <p className="text-xs text-gray-500">
            Add models to <code className="bg-gray-100 px-1 rounded">design/</code> and run <code className="bg-gray-100 px-1 rounded">npm run gen</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
