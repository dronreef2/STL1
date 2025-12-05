import React, { useState } from 'react';
import Viewer3D from './components/Viewer3D';

function App() {
  // For now, we'll use a placeholder URL
  // In the future, this will be dynamic based on available models
  const [selectedModel, setSelectedModel] = useState('/models/examples.stl');

  return (
    <div className="App">
      <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 z-10 shadow-lg">
        <h1 className="text-2xl font-bold">MakerOS - 3D Model Viewer</h1>
        <p className="text-sm text-gray-300 mt-1">
          Code-CAD with JSCAD • React Three Fiber • GitOps
        </p>
      </header>
      
      <div className="pt-20">
        <Viewer3D modelUrl={selectedModel} />
      </div>

      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-xs">
        <h3 className="font-semibold mb-2">Model Info</h3>
        <p className="text-sm text-gray-600">
          Current: <span className="font-mono text-blue-600">examples.stl</span>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Place STL files in <code className="bg-gray-100 px-1 rounded">web/public/models/</code>
        </p>
      </div>
    </div>
  );
}

export default App;
