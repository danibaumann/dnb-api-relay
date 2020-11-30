const axios = require('axios');

const dnbapi = process.env.DNB_API;
const key = process.env.KEY;
const secret = process.env.SECRET;
let token = '';


exports.login = async () => {
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

exports.typeahead = async (req, res, next) => {
    let searchTerm;
    try {
      // get search string from query params
      searchTerm = req.query.searchTerm;
      if (searchTerm === '') {
        throw new Error('Please provide a search term');
      }
      
      try {
        // request company data
        // TODO set default search country
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
  }

exports.match = async (req, res, next) => {
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
  }

  exports.cmpelk = async (req, res, next) => {
    let duns;
    try {
      // get search string from query params
      duns = req.params.duns;
      if (duns === '') {
        throw new Error('Please provide a search term');
      }
  
      try {
        // request company data
        const response = await axios.get(
          `${dnbapi}/v1/data/duns/${duns}?productId=cmpelk&versionId=v2&tradeUp=hq&customerReference=customer%20reference%20text`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        // TODO convert dnb company model
        // basic check
        const comp = response.data.organization;
        if (comp && comp.duns != 'undefined') {
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
  }
