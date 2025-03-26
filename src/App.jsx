import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRemix, setSelectedRemix] = useState('summarize');

  const remixOptions = [
    { id: 'summarize', label: 'Summarize' },
    { id: 'simplify', label: 'Simplify Language' },
    { id: 'professional', label: 'Make Professional' },
    { id: 'creative', label: 'Make Creative' },
  ];

  const handleRemix = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          remixType: selectedRemix,
        }),
      });
      
      const data = await response.json();
      setOutputText(data.result);
    } catch (error) {
      console.error('Error remixing content:', error);
      setOutputText('Error occurred while remixing content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Content Remixer</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Paste your content to remix:
        </label>
        <textarea
          className="w-full p-3 border rounded-md min-h-[200px]"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to remix..."
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Choose remix type:
        </label>
        <div className="flex flex-wrap gap-2">
          {remixOptions.map((option) => (
            <button
              key={option.id}
              className={`px-4 py-2 rounded-md ${selectedRemix === option.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedRemix(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <button
        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
        onClick={handleRemix}
        disabled={isLoading || !inputText.trim()}
      >
        {isLoading ? 'Remixing...' : 'Remix Content'}
      </button>
      
      {outputText && (
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            Remixed Output:
          </label>
          <div className="p-4 border rounded-md bg-gray-50 min-h-[100px] whitespace-pre-wrap">
            {outputText}
          </div>
          <button
            className="mt-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            onClick={() => navigator.clipboard.writeText(outputText)}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}

export default App; 