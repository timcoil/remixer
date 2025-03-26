import { useState, useEffect } from 'react';

const SavedTweet = ({ tweet, darkMode, onDelete }) => {
  return (
    <div className={`mb-3 p-3 rounded-lg shadow-sm border ${
      darkMode 
        ? 'bg-gray-700 border-gray-600' 
        : 'bg-white border-blue-100'
    }`}>
      <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{tweet.content}</p>
      <div className="flex justify-between mt-2">
        <button 
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.content)}`, '_blank')}
          title="Tweet this"
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            darkMode 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
          </svg>
          Tweet
        </button>
        <button 
          onClick={() => onDelete(tweet.id)}
          title="Delete"
          className={`p-1 rounded-full ${
            darkMode 
              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-600' 
              : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function SavedTweets({ darkMode, isOpen }) {
  const [savedTweets, setSavedTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch saved tweets
  const fetchSavedTweets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/get-tweets');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tweets');
      }
      
      setSavedTweets(data.tweets || []);
    } catch (err) {
      console.error('Error fetching saved tweets:', err);
      setError('Failed to load saved tweets');
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved tweets on component mount
  useEffect(() => {
    fetchSavedTweets();
    
    // Set up interval to check for new tweets
    const interval = setInterval(() => {
      fetchSavedTweets();
    }, 10000); // Check every 10 seconds
    
    // Clean up interval
    return () => clearInterval(interval);
  }, []);
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/delete-tweet?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete tweet');
      }
      
      // Update UI optimistically
      setSavedTweets(prev => prev.filter(tweet => tweet.id !== id));
    } catch (err) {
      console.error('Error deleting tweet:', err);
      setError('Failed to delete tweet');
    }
  };
  
  return (
    <div className={`fixed top-0 right-0 h-full w-80 transition-transform duration-300 transform ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    } ${darkMode ? 'bg-gray-800 border-l border-gray-700' : 'bg-gray-50 border-l border-gray-200'} shadow-xl z-50 overflow-hidden flex flex-col`}>
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Saved Tweets
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className={`flex justify-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className={`text-center py-8 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
            {error}
          </div>
        ) : savedTweets.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No saved tweets yet
          </div>
        ) : (
          savedTweets.map((tweet) => (
            <SavedTweet 
              key={tweet.id} 
              tweet={tweet} 
              darkMode={darkMode} 
              onDelete={handleDelete} 
            />
          ))
        )}
      </div>
    </div>
  );
} 