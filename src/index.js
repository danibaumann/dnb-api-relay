const http = require('http');
const express = require('express');
const morgan = require('morgan');
const app = express();
const server = http.createServer(app);
const axios = require('axios');
const cors = require('cors');
require('dotenv').config()

app.use(cors()); // allow all origin (*) for development

// check if process env is set
if (!process.env.DNB_API || !process.env.KEY || !process.env.SECRET || !process.env.PORT) {
  console.log(`Error: Please set DNB_API, PORT, KEY and SECRET environment variables before starting the server.`);
  // close server & exit process
  server.close(() => {
    process.exit(0);
  });
}
const port = process.env.PORT;
const dnbapi = process.env.DNB_API;
const key = process.env.KEY;
const secret = process.env.SECRET;
let token = '';

// add body-parser support and basic setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup logger
app.use(morgan('tiny'));

// login on startup
login();

// set interval to get a new auth token every 8h
// you should do an expiresIn check in production
const loginInterval = 8 * 60 * 60 * 1000;
setInterval(() => {
  login();
}, loginInterval);

async function login() {
  try {
    const base64 = Buffer.from(`${key}:${secret}`).toString('base64');
    const data = { "grant_type": "client_credentials" }
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64}`
      }
    }
    const authResponse = await axios.post(
      `${dnbapi}/v2/token`, data, options
    );
    token = authResponse.data.access_token;
    console.log('successfully logged in');
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err.message);
  }
}

// start relay
app.get('/v1/search/typeahead', async (req, res, next) => {
  let searchTerm;
  try {
    // get search string from query params
    searchTerm = req.query.searchTerm;
    if (searchTerm === '') {
      throw new Error('Please provide a search term');
    }

    try {
      // request company data
      const response = await axios.get(
        `${dnbapi}/v1/search/typeahead?searchTerm=${searchTerm}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      // TODO convert to array of dnb company model
      // basic check
      const comps = response.data.searchCandidates;
      if (comps.length > 0) {
        return res.status(200).json({
          success: true,
          data: comps
        })
      };
    } catch (err) {
      if (err.response.status === 404) {
        return res.status(200).json({
          success: false,
          message: err.response.data.error.errorMessage
        });
      }
      return res.status(500).json(err.message);
    }

  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err.message);
  }
});

app.get('/v1/match/cleanseMatch', async (req, res, next) => {
  let duns;
  try {
    // get search string from query params
    duns = req.query.duns;
    if (duns === '') {
      throw new Error('Please provide a search term');
    }

    try {
      // request company data
      const response = await axios.get(
        `${dnbapi}/v1/match/cleanseMatch?duns=${duns}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      // TODO convert dnb company model
      // basic check
      const comp = response.data.matchCandidates[0].organization;
      if (response.data.matchCandidates.length === 1 && comp != 'undefined') {
        // console.log(comp);
        return res.status(200).json({
          success: true,
          data: comp
        })
      };
    } catch (err) {
      if (err.response.status === 404) {
        return res.status(200).json({
          success: false,
          message: err.response.data.error.errorMessage
        });
      }
      return res.status(500).json(err.message);
    }

  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err.message);
  }
});



app.get('*', (req, res, next) => {
  res.status(404).send('404 Page not found');
});

// starting Server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Server is running in ${process.env.NODE_ENV} environment.`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // close server & exit process
  server.close(() => {
    process.exit(1);
  });
});