const express = require("express");
const app = express();
const axios = require("axios");

app.get("/", async (req, res) => {
    let resultData = [];
    const result = await axios.get("https://hapi.fhir.org/baseR4/Encounter/$everything?_count=1000");
    result?.data.entry.forEach((rE) => {
        if(resultData.length && rE?.resource?.subject) {
            let resultIndex = resultData.findIndex((oI) => oI.patient == rE.resource.subject.reference.split("/")[1]);
            console.log(resultIndex);
            if(!(resultIndex == undefined || resultIndex == -1)) {
                resultData[resultIndex].patientEncounterCount++;
            } else {
                resultData.push({
                    encounter: rE.resource.id,
                    patient: rE.resource.subject.reference.split("/")[1],
                    patientEncounterCount: 1
                })
            }
        } else {
            if(rE?.resource?.subject) {
                resultData.push({
                    encounter: rE.resource.id,
                    patient: rE?.resource.subject.reference.split("/")[1],
                    patientEncounterCount: 1
                })
            }
        }
    });
    res.send(resultData);
});

app.listen(3000, () => {
    console.log("SERVER HAS STARTED!");
});