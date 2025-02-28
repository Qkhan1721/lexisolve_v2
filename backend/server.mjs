import express from 'express';
import cors from 'cors';
import axios from 'axios';
import admin from 'firebase-admin';
import fs from 'fs';

// ✅ Load Firebase service account credentials
const serviceAccount = JSON.parse(fs.readFileSync('./lexisolve-firebase-adminsdk.json', 'utf8'));

// ✅ Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Format numbers (K/M format)
const formatNumber = (num) => {
    return num >= 1_000_000 ? (num / 1_000_000).toFixed(1) + 'M' :
           num >= 1_000    ? (num / 1_000).toFixed(1) + 'K' :
                             num.toString();
};

// ✅ Convert Time Range to YouTube API Format
const getPublishedAfter = (timeRange) => {
    const now = new Date();
    switch (timeRange) {
        case "last 24 hours": now.setDate(now.getDate() - 1); break;
        case "last week": now.setDate(now.getDate() - 7); break;
        case "last month": now.setMonth(now.getMonth() - 1); break;
        case "last year": now.setFullYear(now.getFullYear() - 1); break;
        default: return null;
    }
    return now.toISOString();
};

// ✅ Convert Sorting Option to YouTube Order
const getYouTubeOrder = (sortBy) => {
    switch (sortBy) {
        case "most views": return "viewCount";
        case "newest first": return "date";
        default: return "relevance"; // Default: Relevance-based sorting
    }
};

// ✅ YouTube Search API Endpoint
app.post('/search', async (req, res) => {
    const { userId, query, timeRange, minViews, sortBy, maxResults } = req.body;

    if (!userId || !query) {
        return res.status(400).json({ error: 'User ID and query are required' });
    }

    try {
        // 🔥 Retrieve API key from Firestore
        const userApiRef = firestore.doc(`users/${userId}/user-data/youtube-data-api`);
        const docSnap = await userApiRef.get();

        if (!docSnap.exists()) {
            return res.status(404).json({ error: 'User API key not found' });
        }

        const apiKey = docSnap.data().apiKey;
        if (!apiKey) {
            return res.status(400).json({ error: 'API key is missing' });
        }

        // ✅ Construct search parameters
        let searchParams = {
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: maxResults || 10,
            order: getYouTubeOrder(sortBy),
            key: apiKey,
        };

        // ✅ Apply Time Range Filter
        const publishedAfter = getPublishedAfter(timeRange);
        if (publishedAfter) searchParams.publishedAfter = publishedAfter;

        // 🔥 Make search request to YouTube API
        const searchResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search`, { params: searchParams });

        if (!searchResponse.data.items.length) {
            return res.json([]);
        }

        // ✅ Get video IDs for statistics request
        const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

        // 🔥 Fetch Video Statistics
        const statsResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: { part: 'statistics', id: videoIds, key: apiKey },
        });

        // 🔥 Fetch Channel Statistics
        const channelIds = searchResponse.data.items.map(item => item.snippet.channelId).join(',');
        const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
            params: { part: 'statistics', id: channelIds, key: apiKey },
        });

        // ✅ Combine search results with statistics
        let combinedResults = searchResponse.data.items.map((item) => {
            const stats = statsResponse.data.items.find(stat => stat.id === item.id.videoId)?.statistics || {};
            const channelStats = channelResponse.data.items.find(channel => channel.id === item.snippet.channelId)?.statistics || {};

            return {
                id: item.id.videoId,
                title: item.snippet.title,
                channelTitle: item.snippet.channelTitle,
                channelId: item.snippet.channelId,
                thumbnail: item.snippet.thumbnails.medium.url,
                publishedAt: item.snippet.publishedAt,
                viewCount: parseInt(stats.viewCount || '0'),
                likeCount: parseInt(stats.likeCount || '0'),
                subscribers: parseInt(channelStats.subscriberCount || '0'),
            };
        });

        // ✅ Apply Minimum Views Filter
        if (minViews) {
            combinedResults = combinedResults.filter(video => video.viewCount >= parseInt(minViews));
        }

        // ✅ Apply Sorting
        if (sortBy === "most views") {
            combinedResults.sort((a, b) => b.viewCount - a.viewCount);
        } else if (sortBy === "newest first") {
            combinedResults.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        }

        // 🔥 Store search query + filters in Firestore
        await firestore.doc(`users/${userId}/userSearches/${Date.now()}`).set({
            query,
            timestamp: new Date().toISOString(),
            filters: { timeRange, minViews, sortBy, maxResults },
        });

        // ✅ Return filtered and formatted results
        res.json(combinedResults.map(video => ({
            id: video.id,
            title: video.title,
            channelTitle: video.channelTitle,
            channelId: video.channelId,
            thumbnail: video.thumbnail,
            publishedAt: video.publishedAt,
            viewCount: formatNumber(video.viewCount),
            likeCount: formatNumber(video.likeCount),
            subscribers: formatNumber(video.subscribers),
        })));

    } catch (error) {
        console.error('🔥 Error fetching YouTube data:', error.message);
        return res.status(500).json({ error: 'Error fetching data from YouTube API' });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
