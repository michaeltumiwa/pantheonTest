import React, { useState } from 'react';

interface ImageData {
  image_ID: string;
  thumbnails: string;
  preview: string;
  title: string;
  source: string;
  tags: string[];
}

const GraphQLImageSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setImages([]);

    try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              images(query: "${query}") {
                image_ID
                thumbnails
                preview
                title
                source
                tags
              }
            }
          `,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setImages(data.data.images);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Search Images (GraphQL)</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for images..."
        style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
      />
      <button onClick={handleSearch} style={{ padding: '0.5rem 1rem' }}>
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem' }}>
        {images.map((image) => (
          <div key={image.image_ID} style={{ width: 300 }}>
            <img src={image.preview} alt={image.title} style={{ width: '100%' }} />
            <h4>{image.title}</h4>
            <p>Source: {image.source}</p>
            {/* <div>
              {image.tags.map((tag, i) => (
                <span key={i} style={{ marginRight: '6px', color: '#555' }}>
                  #{tag}
                </span>
              ))}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraphQLImageSearch;
