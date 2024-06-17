const readline = require('readline');
const { EOL } = require('os');

// Regular expressions to extract log components
const regexPatterns = {
    ip: /\s*(\S+)\s*/,
    date: /\s*\[(\d+-\d+-\d+ \d+:\d+:\d+\.\d+)\]/,
    request: /\s*"([^"]*)"\s*/,
    statusCode: /\s*(\S+)/,
    fileSize: /\s*(\d+)/
};

// Function to extract information from a log line
function extractInput(inputLine) {
    const logFmt = `${regexPatterns.ip.source}\\-${regexPatterns.date.source}${regexPatterns.request.source}${regexPatterns.statusCode.source}${regexPatterns.fileSize.source}\\s*`;
    const respMatch = new RegExp(logFmt).exec(inputLine);
    const info = {
        statusCode: 0,
        fileSize: 0
    };
    if (respMatch) {
        info.statusCode = respMatch[4];
        info.fileSize = parseInt(respMatch[5], 10);
    }
    return info;
}

// Function to print the accumulated statistics of the HTTP request log
function printStatistics(totalFileSize, statusCodesStats) {
    console.log(`File size: ${totalFileSize}`);
    for (const statusCode of Object.keys(statusCodesStats).sort()) {
        const num = statusCodesStats[statusCode];
        if (num > 0) {
            console.log(`${statusCode}: ${num}`);
        }
    }
}

// Function to update the metrics from a given HTTP request log
function updateMetrics(line, totalFileSize, statusCodesStats) {
    const lineInfo = extractInput(line);
    const statusCode = lineInfo.statusCode;
    if (statusCodesStats.hasOwnProperty(statusCode)) {
        statusCodesStats[statusCode] += 1;
    }
    return totalFileSize + lineInfo.fileSize;
}

// Function to start the log parser
function run() {
    let lineNum = 0;
    let totalFileSize = 0;
    const statusCodesStats = {
        '200': 0,
        '301': 0,
        '400': 0,
        '401': 0,
        '403': 0,
        '404': 0,
        '405': 0,
        '500': 0
    };

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line) => {
        totalFileSize = updateMetrics(line, totalFileSize, statusCodesStats);
        lineNum += 1;
        if (lineNum % 10 === 0) {
            printStatistics(totalFileSize, statusCodesStats);
        }
    });

    rl.on('close', () => {
        printStatistics(totalFileSize, statusCodesStats);
    });
}

if (require.main === module) {
    run();
}
