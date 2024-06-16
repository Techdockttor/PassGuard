const readline = require('readline');
const db = require('./db'); // Import database connection
const Password = require('./models/password'); // Import Mongoose model

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

  const generatedPassword = passwordList.join('');
  console.log("Your Password is: " + generatedPassword);

  return generatedPassword; // Return generated password
}

async function savePasswordToDatabase() {
  try {
    const { title, description, start_date, end_date } = await promptPasswordDetails(); // Prompt for password details
    const generatedPassword = await generatePassword(); // Generate password

    // Save password to MongoDB using Mongoose
    const newPassword = new Password({
      title,
      description,
      start_date,
      end_date,
      generatedPassword,
    });

    await newPassword.save();
    console.log('Password saved to database:', newPassword);
  } catch (error) {
    console.error('Error generating or saving password:', error);
  } finally {
    rl.close(); // Close readline interface
  }
}

async function promptPasswordDetails() {
  const title = await askQuestion("Enter the title of the password:\n");
  const description = await askQuestion("Enter the description of the password:\n");
  const start_date = new Date();
  const end_date = new Date(start_date.getTime() + 30 * 24 * 60 * 60 * 1000); // Set end date to 30 days from start date

  return { title, description, start_date, end_date };
}

module.exports = {
  generatePassword,
  savePasswordToDatabase
};
