const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.listen(process.env.PORT || 3000, () => {});

app.use(express.static('public'));
app.use(express.json());

const yelp_api_search_url = new URL(process.env.YELP_API_SEARCH_URL)
const categoryType = 'restaurant';
const searchLimit = 50;

app.get('/business_search/:paramsString', async (req, res) => {
    const paramsJson = JSON.parse(req.params.paramsString);
    paramsJson.categories = categoryType;
    paramsJson.limit = searchLimit;
    
    yelp_api_search_url.search = new URLSearchParams(paramsJson).toString();

    const yelp_response = await fetch(yelp_api_search_url.href, {
        headers: {
            'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
        }
    });
    const yelp_json = await yelp_response.json();

    res.json(yelp_json);
})