const axios = require('axios');
const dotenv = require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    console.log(req.query)
    const resultInfo = await retrieveData(req.query);
    res.send(resultInfo);
});

app.get("/:resource", async (req, res) => {
    const resourceType = req.params.resource;
    const resultInfo = await retrieveData(resourceType);
    res.send(resultInfo);
});

app.listen(4000, () => {
    console.log("SERVER HAS STARTED!");
});

const options = {
        method: 'POST',
        url: process.env.ACCESS_TOKEN_URL,
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: new URLSearchParams({
          grant_type: process.env.GRANT_TYPE,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          scope: process.env.SCOPE
        })
};

const retrieveData = async (params) => {
    try {
        const accessToken = await axios.request(options)
        let config = {
            headers: {
                'Authorization': 'Bearer ' + accessToken.data.access_token
            }
        }
        let result = {};
        let url = process.env.API_URL;
        if(typeof params == typeof "" ) {
            url += params;
        } else if(JSON.stringify(params) !== '{}') {
            url += Object.keys(params)[0] + "=" + Object.values(params)[0];
        }
        console.log(params, url);
        result = await axios.get( url, config);
        let resourceResult = [];
        result?.data?.entry?.forEach((rE, index) => {
            if(resourceResult.length) {
                if(resourceResult.find((oI) => oI.name == rE.resource.resourceType)) {
                    resourceResult.forEach((rR) => {
                        if(rE.resource.resourceType == rR.name){
                            rR.count++;
                        }
                    })
                } else {
                    resourceResult.push({
                        name: rE.resource.resourceType,
                        count: 1
                    })
                }
            } else if(!resourceResult.length) {
                resourceResult.push({
                    name: rE.resource.resourceType,
                    count: 1
                })
            }
        });
        console.log(result.data.entry);
        return result.data.entry;
    } catch(err) {
        throw new Error(err);
    }
    
}

