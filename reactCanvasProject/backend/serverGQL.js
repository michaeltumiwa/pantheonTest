const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// === Middleware ===
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, try again later',
});
app.use(limiter);

// === GraphQL Schema ===
const schema = buildSchema(`
  type Image {
    image_ID: String
    thumbnails: String
    preview: String
    title: String
    source: String
    tags: [String]
  }

  type Query {
    images(query: String!): [Image]
  }
`);

// === Fetch Functions ===

// Unsplash
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
        image_ID: img.id,
        thumbnails: img.urls.thumb,
        preview: img.urls.small,
        title: img.alt_description || 'Untitled',
        source: 'Unsplash',
        // tags: img.tags?.map((tag) => tag.title) || [],
        tags: (img.tags?.length > 0
          ? img.tags.map((tag) => tag.title)
          : (img.alt_description?.split(' ').filter(Boolean) || [])),        
      })),
    };
  } catch (error) {
    console.error('Unsplash error:', error.message);
    return { source: 'Unsplash', success: false, error: error.message };
  }
};

// Pixabay
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
        image_ID: img.id.toString(),
        thumbnails: img.previewURL,
        preview: img.webformatURL,
        title: img.tags || 'Pixabay image',
        source: 'Pixabay',
        tags: img.tags.split(',').map((t) => t.trim()),
      })),
    };
  } catch (error) {
    console.error('Pixabay error:', error.message);
    return { source: 'Pixabay', success: false, error: error.message };
  }
};

// === Root Resolver ===
const root = {
  images: async ({ query }) => {
    const results = await Promise.allSettled([
      fetchUnsplashImages(query),
      fetchPixabayImages(query),
    ]);

    return results.flatMap((result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        return result.value.data;
      }
      return [];
    });
  },
};

// === GraphQL Endpoint ===
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
});
