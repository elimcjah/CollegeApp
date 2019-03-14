const express = require('express');
const bodyParser = require('body-parser');
const packageJSON = require('../package.json');
const { prisma } = require('../prisma/generated/prisma-client');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    return res.send(`College App Version ${packageJSON.version}`);
});

app.get('/schools', async (req, res) => {
    try{
        const allColleges = await prisma.colleges({
            where: {
                deleted: false
            }
        });
        return res.send(allColleges);
    } catch(e) {
        throw new Error(e);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});