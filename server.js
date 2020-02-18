const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require('axios');

const app = express();
const Joi = require('joi');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

let projectData = {};

app.post("/addData", (req, res) => {
  console.log(req.body);
  projectData.temp = req.body.temperature;
  projectData.feel = req.body.feeling;
  projectData.date = req.body.date;
  res.send({
    msg: "I received it"
  });
});

app.get("/givemydata", (req, res) => {
  res.send(projectData);
});

app.get('/api/weather/:countryCode/:zipCode', function (req, res) {
  axios.get(`http://api.openweathermap.org/data/2.5/weather?zip=${req.params.zipCode},${req.params.countryCode}&appid=ffce2b69545cb42e759abdc19a52bd14`)
  .then(function(response) {
    console.log(response);
    res.json(response.data);
  }).catch((err) => {
    console.error(err);
    res.send("ERROR");
  })
})

