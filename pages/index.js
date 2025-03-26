import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [text, setText] = useState('');
  const [remixType, setRemixType] = useState('summarize');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, remixType }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data.result);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Head>
        <title>Text Remixer</title>
        <meta name="description" content="Remix your text with Claude AI" />
      </Head>

      <main>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Text Remixer</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="text" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Enter your text:
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ width: '100%', minHeight: '150px', padding: '0.5rem' }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="remixType" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Choose remix type:
            </label>
            <select
              id="remixType"
              value={remixType}
              onChange={(e) => setRemixType(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="summarize">Summarize</option>
              <option value="simplify">Simplify</option>
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              backgroundColor: '#4A90E2', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : 'Remix Text'}
          </button>
        </form>
        
        {result && (
          <div style={{ marginTop: '2rem' }}>
            <h2>Result:</h2>
            <div 
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                padding: '1rem',
                backgroundColor: '#f9f9f9' 
              }}
            >
              {result}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 