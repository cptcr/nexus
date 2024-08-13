const { MongoClient } = require('mongodb');
const readlineSync = require('readline-sync');
const chalk = require('chalk');
require('dotenv').config();

const mongoUrl = process.env.MONGOURI; 

async function clearDatabase() {
    const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log(chalk.green('Connected to the database successfully!'));

        const db = client.db(); 
        const collections = await db.collections();

        if (collections.length === 0) {
            console.log(chalk.yellow('The database is already empty.'));
            return;
        }

        // List all collections
        console.log(chalk.cyan('Collections in the database:'));
        collections.forEach((collection) => console.log(chalk.blue(`- ${collection.collectionName}`)));

        // Confirmation prompt
        const userConfirmation = readlineSync.question(chalk.red('Are you sure you want to delete all collections in the database? (y/n): '));

        if (userConfirmation.toLowerCase() === 'y') {
            // Drop each collection
            for (let collection of collections) {
                await db.collection(collection.collectionName).drop();
                console.log(chalk.magenta(`Collection ${collection.collectionName} has been deleted.`));
            }

            console.log(chalk.green('All collections have been deleted successfully!'));
        } else {
            console.log(chalk.yellow('Operation cancelled by the user.'));
        }
    } catch (error) {
        console.error(chalk.red('Error occurred while connecting to the database:', error));
    } finally {
        await client.close();
        console.log(chalk.cyan('Database connection closed.'));
    }
}

// Execute the script
clearDatabase();
