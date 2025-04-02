import React, { useState } from 'react';

interface ImageResult {
  url: string;
  alt: string;
  tags: string[];
}

const SearchImages: React.FC = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setImages([]);

    try {
      const res = await fetch(`http://localhost:3000/api/images?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to fetch images');

      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Image Search</h2>
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

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '2rem', gap: '1rem' }}>
        {images.map((img, i) => (
          <div key={i}>
            <img src={img.url} alt={img.alt} style={{ width: '200px', height: 'auto' }} />
            <p style={{ maxWidth: '200px' }}>{img.alt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchImages;
