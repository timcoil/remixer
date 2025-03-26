import { useState, useEffect } from 'react';

const SavedTweet = ({ tweet, darkMode, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet.content);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(tweet.content);
  };

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch('/api/update-tweet', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: tweet.id,
          content: editedContent 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update tweet');
      }

      setIsEditing(false);
      onUpdate?.(tweet.id, editedContent);
    } catch (err) {
      console.error('Error updating tweet:', err);
      setError('Failed to update tweet');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`mb-3 p-3 rounded-lg shadow-sm border ${
      darkMode 
        ? 'bg-gray-700 border-gray-600' 
        : 'bg-white border-blue-100'
    }`}>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className={`w-full p-2 rounded-lg border ${
            darkMode 
              ? 'bg-gray-600 border-gray-500 text-white' 
              : 'bg-white border-gray-300 text-gray-800'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          rows="3"
        />
      ) : (
        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{tweet.content}</p>
      )}
      <div className="flex justify-between mt-2">
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancelEdit}
                title="Cancel editing"
                className={`p-2 rounded-full ${
                  darkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button 
                onClick={handleSaveEdit}
                disabled={isSaving}
                title="Save edited tweet"
                className={`p-2 rounded-full ${
                  isSaving
                    ? (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600')
                    : (darkMode 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white')
                }`}
              >
                {isSaving ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.content)}`, '_blank')}
                title="Tweet this"
                className={`p-2 rounded-full ${
                  darkMode 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              <button 
                onClick={handleEditClick}
                title="Edit tweet"
                className={`p-2 rounded-full ${
                  darkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
            </>
          )}
        </div>
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
      {error && (
        <div className={`text-xs mt-2 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default function SavedTweets({ darkMode, isOpen, onClose, onTweetCountChange }) {
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
      // Notify parent about tweet count
      onTweetCountChange?.(data.tweets?.length || 0);
    } catch (err) {
      console.error('Error fetching saved tweets:', err);
      setError('Failed to load saved tweets');
      onTweetCountChange?.(0);
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
      setSavedTweets(prev => {
        const newTweets = prev.filter(tweet => tweet.id !== id);
        // Notify parent about updated tweet count
        onTweetCountChange?.(newTweets.length);
        return newTweets;
      });
    } catch (err) {
      console.error('Error deleting tweet:', err);
      setError('Failed to delete tweet');
    }
  };

  const handleUpdate = (id, newContent) => {
    setSavedTweets(prev => 
      prev.map(tweet => 
        tweet.id === id 
          ? { ...tweet, content: newContent }
          : tweet
      )
    );
  };

  const handleToggle = () => {
    if (isOpen) {
      onClose();
    } else {
      onClose(); // This will actually open it since it's a toggle
    }
  };
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed top-0 right-0 h-full transition-all duration-300 ease-in-out transform ${
          isOpen ? 'w-80' : 'w-12'
        } ${darkMode ? 'bg-gray-800 border-l border-gray-700' : 'bg-gray-50 border-l border-gray-200'} shadow-xl z-50 overflow-hidden flex flex-col`}
        onClick={!isOpen ? handleToggle : undefined}
      >
        {/* Header */}
        <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} ${!isOpen && 'hidden'}`}>
            Saved Tweets
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-opacity-10 hover:bg-black transition-colors duration-200 ${!isOpen && 'hidden'}`}
            aria-label="Close saved tweets"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className={`flex-1 overflow-y-auto ${isOpen ? 'p-4' : 'p-0'}`}>
          {isOpen ? (
            loading ? (
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
                  onUpdate={handleUpdate}
                />
              ))
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              {savedTweets.length > 0 && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                  {savedTweets.length}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 