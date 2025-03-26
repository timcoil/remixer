import { useState } from 'react';

export default function SupabaseSetupHelp({ darkMode, onClose }) {
  const [step, setStep] = useState(1);
  
  const steps = [
    {
      title: "Create a Supabase account",
      content: (
        <div>
          <p className="mb-3">First, create a free account at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Supabase.com</a>.</p>
          <p>Once logged in, click "New Project" to create a new database.</p>
        </div>
      )
    },
    {
      title: "Set up a new project",
      content: (
        <div>
          <p className="mb-3">Name your project and set a secure database password.</p>
          <p className="mb-3">Choose the free plan and a region closest to you.</p>
          <p>Click "Create new project" and wait for it to be created (this takes about 1 minute).</p>
        </div>
      )
    },
    {
      title: "Create the saved_tweets table",
      content: (
        <div>
          <p className="mb-3">In your new project, go to the "SQL Editor" section from the left sidebar.</p>
          <p className="mb-3">Click "New Query" and paste this SQL code:</p>
          <pre className={`p-3 rounded my-3 text-xs overflow-x-auto ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
            {`create table saved_tweets (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);`}
          </pre>
          <p className="mb-3">Click "Run" to create the table.</p>
        </div>
      )
    },
    {
      title: "Get your API credentials",
      content: (
        <div>
          <p className="mb-3">Go to "Project Settings" → "API" in the left sidebar.</p>
          <p className="mb-3">Find these values:</p>
          <ul className="list-disc pl-5 mb-3">
            <li className="mb-1">Project URL (looks like: https://something.supabase.co)</li>
            <li>anon/public key (starts with "eyJh...")</li>
          </ul>
        </div>
      )
    },
    {
      title: "Update your environment variables",
      content: (
        <div>
          <p className="mb-3">In your project, create or edit the <code className="font-mono">.env.local</code> file with:</p>
          <pre className={`p-3 rounded my-3 text-xs overflow-x-auto ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
            {`NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
          </pre>
          <p className="mb-3">Replace with your actual values.</p>
          <p>Restart your development server for changes to take effect.</p>
        </div>
      )
    }
  ];
  
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4`}>
      <div className={`max-w-md w-full rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Supabase Setup Guide</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between mb-4">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > index + 1 
                    ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                    : step === index + 1
                      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                      : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600')
                }`}
              >
                {step > index + 1 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Step {step}: {steps[step-1].title}</h3>
          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {steps[step-1].content}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => setStep(prev => Math.max(prev - 1, 1))}
            disabled={step === 1}
            className={`px-4 py-2 rounded ${
              step === 1
                ? (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                : (darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300')
            }`}
          >
            Previous
          </button>
          
          {step < steps.length ? (
            <button
              onClick={() => setStep(prev => Math.min(prev + 1, steps.length))}
              className={`px-4 py-2 rounded ${
                darkMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                darkMode 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 