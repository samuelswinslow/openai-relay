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
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant who provides clear, logical explanations of the business opportunity for Renova Builders. Start by briefly introducing how our program works, highlight key benefits (like energy savings, government incentives, and expert guidance), and assist the user in understanding and navigating the process.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
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
