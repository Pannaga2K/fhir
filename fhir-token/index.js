const axios = require('axios');
const dotenv = require("dotenv").config();

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

const retrieveData = async () => {
    const accessToken = await axios.request(options)
    let config = {
        headers: {
            'Authorization': 'Bearer ' + accessToken.data.access_token
        }
    }
    const result = await axios.get( process.env.API_URL + "Patient?name=Pannagadhara", config);
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
}

retrieveData();