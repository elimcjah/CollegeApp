const { prisma } = require('../generated/prisma-client');

const { schools } = require('./testData');

async function main(){
    try {
        schools.forEach(async (school) => {
            const collegeCreated = await prisma.createCollege({
                ...school
            });
        });
    } catch (e) {
        throw new Error(e);
    }
}

main().then(() => {
    console.log('Seed Successful');
}).catch((e) => {
    throw new Error(e);
});