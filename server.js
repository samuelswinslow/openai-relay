const express = require('express');
const axios = require('axios');
const cors = require('cors');

// ✅ Dotenv is only for local testing, but let's move it up
require('dotenv').config(); // Local testing, optional

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/ask', async (req, res) => {
    const { prompt } = req.body;

    try {
        console.log("OPENAI_API_KEY:", OPENAI_API_KEY); // Add this line

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150,
            temperature: 0.5
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ reply: response.data.choices[0].message.content.trim() });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get a response from OpenAI.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Relay server running on port ${PORT}`));

