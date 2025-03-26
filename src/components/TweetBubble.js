import { useState } from 'react';
import SupabaseSetupHelp from './SupabaseSetupHelp';

const TweetBubble = ({ content, darkMode }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const handleTweetClick = () => {
    // Encode the tweet content for the URL
    const encodedTweet = encodeURIComponent(content);
    // Open Twitter intent URL in a new tab
    window.open(`https://twitter.com/intent/tweet?text=${encodedTweet}`, '_blank');
  };

  const handleSaveClick = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Save the tweet using our API endpoint
      const response = await fetch('/api/save-tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save tweet');
      }

      setIsSaved(true);
    } catch (err) {
      console.error('Error saving tweet:', err);
      setError('Failed to save tweet');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className={`mb-4 p-4 rounded-xl shadow-md border ${
        darkMode 
          ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
          : 'bg-white border-blue-100 hover:shadow-lg'
      } transition-all duration-200 transform hover:-translate-y-1`}>
        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{content}</p>
        <div className="flex justify-end mt-2 space-x-2">
          <button 
            onClick={handleSaveClick}
            disabled={isSaved || isSaving}
            title={isSaved ? "Tweet saved" : "Save for later"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
              isSaved
                ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-600 text-white')
                : isSaving
                  ? (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600')
                  : (darkMode 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white')
            }`}
          >
            {isSaved ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Saved
              </>
            ) : isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                Save
              </>
            )}
          </button>
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
        {error && (
          <div className="mt-2">
            <div className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
              {error}
            </div>
            <button
              onClick={() => setShowSetupGuide(true)}
              className={`mt-2 text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              Need help? View Supabase setup guide
            </button>
          </div>
        )}
      </div>
      
      {showSetupGuide && (
        <SupabaseSetupHelp 
          darkMode={darkMode}
          onClose={() => setShowSetupGuide(false)}
        />
      )}
    </>
  );
};

export default TweetBubble; 