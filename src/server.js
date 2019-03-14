const express = require('express');
const bodyParser = require('body-parser');
const packageJSON = require('../package.json');


const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    return res.send(`College App Version ${packageJSON.version}`);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});