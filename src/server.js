const express = require('express');
const bodyParser = require('body-parser');
const packageJSON = require('../package.json');
const { prisma } = require('../prisma/generated/prisma-client');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    return res.status(400).send(`College App Version ${packageJSON.version}`);
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

app.get('/schools/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const school = await prisma.colleges({
            where: {
                AND: [{ id }, { deleted: false }]
            }
        });
        if(school.length === 0) {
            res.status(400).json('College Not Found.');
        } else {
            res.json(school);
        }
    } catch (e) {
        res.json(e);
        throw new Error(e);
    }
});

app.put('/schools/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        const schoolExists = await prisma.$exists.college({
            AND: [
                { id },
                { deleted: false }
            ]});
        if(!schoolExists) {
            res.status(400).json('College not found.');
        } else {
            const updatedSchool = await prisma.updateCollege({
                data,
                where: {
                    id
                }
            });
            res.json(updatedSchool);
        }
    } catch (e) {
        res.status(500).json(e);
        throw new Error(e);
    }
});

app.delete('/schools/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const schoolExists = await prisma.$exists.college({
            AND: [
                { id },
                { deleted: false }
            ]});
        if(!schoolExists) {
            res.status(400).json('College not found.');
        } else {
            const deletedSchool = await prisma.updateCollege({
                data: {
                    deleted: true
                },
                where: {
                    id
                }
            });
            res.json(deletedSchool);
        }
    } catch (e) {
        res.status(500).json(e);
        throw new Error(e);
    }
});

app.post('/schools', async (req, res) => {
    const { name, city, state, zip, circulation } = req.body;
    let numberOfPropertiesOnRequest = Object.keys(req.body).length;
    if(numberOfPropertiesOnRequest !== 5){
        res.status(400).json('Request body has incorrect number of properties');
    } else {
        try {
            const result = await prisma.createCollege({
                name,
                city,
                state,
                zip,
                circulation
            });
            res.json(result);
        } catch (e) {
            res.status(500).json(e);
            throw new Error(e);
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
