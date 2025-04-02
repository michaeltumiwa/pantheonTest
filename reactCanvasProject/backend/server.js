const cors = require('cors');
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const rateLimit = require('express-rate-limit');


const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());


// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, try again later',
});
app.use(limiter);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Image Search API');
});

// === Fetch Functions ===

// Fetch from Unsplash
const fetchUnsplashImages = async (query, page = 1) => {
  try {
    console.log('Fetching from Unsplash...');
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        client_id: process.env.UNSPLASH_API_KEY,
        page,
        per_page: 10,
      },
    });

    return {
      source: 'Unsplash',
      success: true,
      data: response.data.results.map((img) => ({
        url: img.urls.small,
        alt: img.alt_description,
        tags: img.tags?.map((tag) => tag.title) || [],
      })),
    };
  } catch (error) {
    console.error('Unsplash error:', error.message);
    return { source: 'Unsplash', success: false, error: error.message };
  }
};

// Fetch from Pixabay
const fetchPixabayImages = async (query) => {
  try {
    console.log('Fetching from Pixabay...');
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: process.env.PIXABAY_API_KEY,
        q: query,
        image_type: 'photo',
      },
    });

    return {
      source: 'Pixabay',
      success: true,
      data: response.data.hits.map((img) => ({
        url: img.webformatURL,
        alt: img.tags,
        tags: img.tags.split(','),
      })),
    };
  } catch (error) {
    console.error('Pixabay error:', error.message);
    return { source: 'Pixabay', success: false, error: error.message };
  }
};

// OPTIONAL: Storyblocks (commented until you have a valid key)
/*
const fetchStoryblocksImages = async (query) => {
  try {
    console.log('Fetching from Storyblocks...');
    const response = await axios.get('https://api.storyblocks.com/v1/video-search', {
      headers: {
        Authorization: `Bearer ${process.env.STORYBLOCKS_API_KEY}`,
      },
      params: { query },
    });

    return {
      source: 'Storyblocks',
      success: true,
      data: response.data.results.map((img) => ({
        url: img.url,
        alt: img.description,
        tags: img.categories,
      })),
    };
  } catch (error) {
    console.error('Storyblocks error:', error.message);
    return { source: 'Storyblocks', success: false, error: error.message };
  }
};
*/

// === Route ===

app.get('/api/images', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  try {
    const fetchTasks = [
      fetchUnsplashImages(query),
      fetchPixabayImages(query),
      // fetchStoryblocksImages(query), // Uncomment when ready
    ];

    const results = await Promise.allSettled(fetchTasks);

    const images = results.flatMap((result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        return result.value.data;
      } else {
        console.error(result.reason || result.value?.error);
        return [];
      }
    });

    res.json({ images });
  } catch (error) {
    console.error('Internal error:', error.message);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
