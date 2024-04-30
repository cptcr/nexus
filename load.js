const { ShardingManager, Client } = require('discord.js');
const mongoose = require('mongoose');
const si = require("systeminformation");
const express = require('express');
const path = require("path");
const router = express.Router();
const fs = require("fs");
const https = require("https");
const hostname = "toowake.live";
const authRouter = require('./express/dashboard/auth');

var mongooseStatus = false

// MongoDB Connection
async function connectToMongoDB() {
    try {
        mongoose.set('strictQuery', false);
        mongoose.connect(process.env.MONGOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .catch(err => console.error('Could not connect to MongoDB:', err));

        mongoose.connection.on('connected', () => {
            mongooseStatus = true;
        });
        
        mongoose.connection.on('error', (err) => {
            mongooseStatus = false;
        });
        
        mongoose.connection.on('disconnected', () => {
            mongooseStatus = false;
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); 
    } 
}

async function getSystemInfo() {
    try {
        const cpuInfo = await si.cpu();
        console.log("-> CPU: ", `${cpuInfo.manufacturer} ${cpuInfo.brand}`);
        const memInfo = await si.memLayout();
        memInfo.forEach((mem, index) => {
            console.log(`-> RAM Slot ${index + 1}: ${mem.manufacturer || "No data available"} ${mem.partNum}`);
        });
        const gpuInfo = await si.graphics();
        gpuInfo.controllers.forEach((gpu, index) => {
            console.log("-> GPU ", `${index + 1}: ${gpu.model}`);
        });
    } catch (error) {
        console.error("Error occurred while getting system information: ", `${error}`);
    }
}

// Main function to run the application
async function main() { 
    
    const amountShards =  "auto"; //parseInt(process.env.SHARDS) ||

    const t = `${process.env.TOKEN}`

    const manager = new ShardingManager('./src/index.js', {
        token: t,
        totalShards: amountShards
    });

    manager.on('shardCreate', shard => console.log("Launched Shard: ", `${shard.id + 1}`));
    manager.spawn().catch(console.error);
    if (process.env.SITE === 'on') {
        
    // Express Setup
    const app = express();
    const PORT = process.env.PORT || 3129;

    app.set('view engine', 'ejs');

    app.use('/auth', authRouter);
    
    // Load Express
    fs.readdirSync('./express').forEach((dir) => {
        fs.readdirSync(`./express/${dir}`).forEach((handler) => {
            require(`./express/${dir}/${handler}`)(app);
        }); 
    });

    app.listen(PORT,  'localhost', () => console.log("Server running on port ", `${PORT}`));
    }
}

// Execute the main function
main().catch(error => {
    console.error(`An error occurred: ${error}`);
    process.exit(1);
});

connectToMongoDB();

module.exports = {mongooseStatus}