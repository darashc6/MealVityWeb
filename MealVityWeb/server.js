const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.listen(process.env.PORT || 3000, () => {
    console.log('Server started');
});

app.use(express.static('public'));
app.use(express.json());

// Yelp Fusion API
// Endpoint used: https://www.yelp.com/developers/documentation/v3/business_search
// For more info about the API: https://www.yelp.com/developers/documentation/v3
const yelp_api_search_url = new URL(process.env.YELP_API_SEARCH_URL);
app.get('/business_search/:paramsString', async (req, res) => {
    const paramsJson = JSON.parse(req.params.paramsString);
    paramsJson.categories = 'restaurant';
    paramsJson.limit = 50;
    
    yelp_api_search_url.search = new URLSearchParams(paramsJson).toString();

    const yelp_response = await fetch(yelp_api_search_url.href, {
        headers: {
            'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
        }
    });
    const yelp_json = await yelp_response.json();

    res.json(yelp_json);
});

// HERE developer
// Endpoint used: https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-autosuggest-brief.html
// For more info about the API: https://developer.here.com/documentation/geocoding-search-api/dev_guide/index.html
const here_api_autocomplete_url = new URL(process.env.HERE_API_AUTOCOMPLETE_URL)
const here_api_key = process.env.HERE_API_KEY
app.get('/autocomplete/:address', async (req, res) => {
    const params = {
        q: req.params.address,
        at: '40.4637,3.7492',
        in: 'countryCode:ESP',
        resultTypes: 'street',
        limit: 5,
        apiKey: here_api_key
    }

    here_api_autocomplete_url.search = new URLSearchParams(params)
    
    const response = await fetch(here_api_autocomplete_url.href);
    const response_json = await response.json();

    res.json(response_json);
});