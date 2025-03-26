import { useState, useEffect } from 'react';
import Head from 'next/head';

// Tweet bubble component
const TweetBubble = ({ content, darkMode }) => {
  const handleTweetClick = () => {
    // Encode the tweet content for the URL
    const encodedTweet = encodeURIComponent(content);
    // Open Twitter intent URL in a new tab
    window.open(`https://twitter.com/intent/tweet?text=${encodedTweet}`, '_blank');
  };

  return (
    <div className={`mb-4 p-4 rounded-xl shadow-md border ${
      darkMode 
        ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
        : 'bg-white border-blue-100 hover:shadow-lg'
    } transition-all duration-200 transform hover:-translate-y-1`}>
      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{content}</p>
      <div className="flex justify-end mt-2">
        <button 
          onClick={handleTweetClick}
          title="Tweet this"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
            darkMode 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
          </svg>
          Tweet
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [text, setText] = useState('');
  const [remixType, setRemixType] = useState('summarize');
  const [result, setResult] = useState('');
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from user preference or localStorage
  useEffect(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      // If no localStorage value, check user preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Update document class and localStorage when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');
    setTweets([]);
    
    try {
      if (!text.trim()) {
        throw new Error('Please enter some text to convert to tweets');
      }
      
      console.log('Submitting request with text:', text.substring(0, 50) + '...');
      console.log('Remix type:', remixType);
      
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, remixType }),
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        setResult(data.result);
        if (data.tweets && Array.isArray(data.tweets)) {
          setTweets(data.tweets);
        }
      } else {
        setError(`Error: ${data.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setError(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-indigo-50 to-blue-50'
    }`}>
      <Head>
        <title>Tweet Generator</title>
        <meta name="description" content="Generate tweets with Claude AI" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
        <header className="flex justify-end mb-4">
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                : 'bg-blue-100 hover:bg-blue-200 text-gray-700'
            }`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
        </header>

        <main className={`bg-white rounded-2xl shadow-xl p-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          <div className="flex items-center justify-center mb-8">
            <h1 className={`text-4xl font-extrabold ${
              darkMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}>
              Tweet Generator
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="text" className={`block mb-2 text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Enter your text:
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={`w-full min-h-[180px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm resize-y transition duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Paste your text here to convert into tweets..."
                required
              />
            </div>
            
            <div>
              <label htmlFor="remixType" className={`block mb-2 text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Choose tweet style:
              </label>
              <select
                id="remixType"
                value={remixType}
                onChange={(e) => setRemixType(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm cursor-pointer transition duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="summarize">✨ Summarize</option>
                <option value="simplify">🔤 Simplify</option>
                <option value="professional">👔 Professional</option>
                <option value="creative">🎨 Creative</option>
                <option value="academic">🎓 Academic</option>
                <option value="technical">💻 Technical</option>
                <option value="marketing">📢 Marketing Copy</option>
                <option value="friendly">🙂 Friendly & Casual</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all duration-200 shadow-md ${
                loading 
                  ? 'bg-blue-400 cursor-not-allowed opacity-70' 
                  : `${darkMode 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} 
                    hover:shadow-lg transform hover:-translate-y-0.5`
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Generate Tweet'}
            </button>
          </form>
          
          {error && (
            <div className="mt-8 animate-fade-in">
              <div className={`p-4 rounded-lg shadow-sm ${
                darkMode 
                  ? 'bg-red-900/50 border border-red-800 text-red-200' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <div className="flex">
                  <svg className={`h-5 w-5 text-red-400 mr-2`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            </div>
          )}
          
          {/* Display tweets in individual bubbles */}
          {tweets.length > 0 && (
            <div className="mt-8 animate-fade-in">
              <h2 className={`text-xl font-semibold mb-3 ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>Your Tweets:</h2>
              <div className="space-y-2">
                {tweets.map((tweet, index) => (
                  <TweetBubble key={index} content={tweet} darkMode={darkMode} />
                ))}
              </div>
            </div>
          )}
          
          {/* Keep the original result display for debugging or if there are no parsed tweets */}
          {result && tweets.length === 0 && (
            <div className="mt-8 animate-fade-in">
              <h2 className={`text-xl font-semibold mb-3 ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>Result:</h2>
              <div className={`p-6 rounded-lg shadow-inner ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 border border-gray-600' 
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'
              }`}>
                <p className="whitespace-pre-wrap">{result}</p>
              </div>
            </div>
          )}
        </main>

        <footer className={`mt-8 text-center text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p>Powered by Claude AI • Built with Next.js</p>
        </footer>
      </div>
    </div>
  );
} 