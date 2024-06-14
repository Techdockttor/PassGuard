// src/passwordGenerator.js
const readline = require('readline');

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
const numbers = '0123456789'.split('');
const symbols = '!@£%^&*+#'.split('');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function generatePassword() {
    const noLetters = parseInt(await askQuestion("How many letters do you want in your password?\n"), 10);
    const noNumbers = parseInt(await askQuestion("How many numbers do you want in your password?\n"), 10);
    const noSymbols = parseInt(await askQuestion("How many symbols do you want in your password?\n"), 10);

    let passwordList = [];

    for (let i = 0; i < noLetters; i++) {
        passwordList.push(letters[Math.floor(Math.random() * letters.length)]);
    }

    for (let i = 0; i < noNumbers; i++) {
        passwordList.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }

    for (let i = 0; i < noSymbols; i++) {
        passwordList.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    // Shuffle the password list
    for (let i = passwordList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordList[i], passwordList[j]] = [passwordList[j], passwordList[i]];
    }

    const password = passwordList.join('');
    console.log("Your Password is: " + password);

    rl.close();
}

module.exports = generatePassword;
