const readlineSync = require('readline-sync');
const chalk = require('chalk');

// Simulated collections in the database (for testing purposes)
const simulatedCollections = ['users', 'orders', 'products', 'logs'];

// Function to simulate clearing the entire database
async function testClearDatabase() {
    console.log(chalk.green('Connected to the database successfully!'));

    if (simulatedCollections.length === 0) {
        console.log(chalk.yellow('The database is already empty.'));
        return;
    }

    console.log(chalk.cyan('Collections in the database:'));
    simulatedCollections.forEach((collection) => console.log(chalk.blue(`- ${collection}`)));

    const userConfirmation = readlineSync.question(chalk.red('Are you sure you want to delete all collections in the database? (y/n): '));

    if (userConfirmation.toLowerCase() === 'y') {
        for (let collection of simulatedCollections) {
            console.log(chalk.magenta(`Simulated deletion of collection ${collection}.`));
        }

        console.log(chalk.green('All collections would be deleted successfully (if this were a real operation)!'));
    } else {
        console.log(chalk.yellow('Operation cancelled by the user.'));
    }

    console.log(chalk.green('Database connection would be closed (if this were a real operation).'));
}

// Execute the test script
testClearDatabase();
