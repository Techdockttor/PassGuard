const fs = require('fs');
const { randomInt, randomFloat } = require('crypto');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

function getRandomInt(min, max) {
    return randomInt(min, max + 1);
}

function getRandomFloat(min, max) {
    return min + randomFloat() * (max - min);
}

async function generateLogs() {
    for (let i = 0; i < 10000; i++) {
        await sleep(getRandomFloat(0, 1) * 1000);

        const ipAddress = `${getRandomInt(1, 255)}.${getRandomInt(1, 255)}.${getRandomInt(1, 255)}.${getRandomInt(1, 255)}`;
        const timestamp = new Date().toISOString();
        const httpMethod = "GET";
        const path = "/projects/1216";
        const protocol = "HTTP/1.1";
        const statusCode = [200, 301, 400, 401, 403, 404, 405, 500][getRandomInt(0, 7)];
        const fileSize = getRandomInt(1, 1024);

        const logEntry = `${ipAddress} - [${timestamp}] "${httpMethod} ${path} ${protocol}" ${statusCode} ${fileSize}\n`;

        process.stdout.write(logEntry);
    }
}

generateLogs().catch(err => console.error(err));
