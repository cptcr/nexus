const { ShardingManager } = require('discord.js');
require('dotenv').config();
const mongoose = require('mongoose');
const si = require("systeminformation");
const express = require('express');
const lead = require('./src/Schemas.js/Leveling/level'); 
const warnSchema = require('./src/Schemas.js/warnSchema');
const streamSchema = require('./src/Schemas.js/streamSchema');
const ecoSchema = require('./src/Schemas.js/ecoSchema'); 

const mongodbURL = process.env.MONGODBURL;
if (!mongodbURL) {
    console.error("Error: Cannot find MongodbURL in .env file.");
    process.exit(1);
}

// MongoDB Connection
async function connectToMongoDB() {
    try {
        mongoose.connect(mongodbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB:', err));

        
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB.');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected.');
        });



        console.log('Connected to MongoDB successfully.');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); 
    } 

    return console.log("test")
}

async function getSystemInfo() {
    try {
        const cpuInfo = await si.cpu();
        console.log(`-> CPU: ${cpuInfo.manufacturer} ${cpuInfo.brand}`);
        const memInfo = await si.memLayout();
        memInfo.forEach((mem, index) => {
            console.log(`-> RAM Slot ${index + 1}: ${mem.manufacturer || "No data available"} ${mem.partNum}`);
        });
        const gpuInfo = await si.graphics();
        gpuInfo.controllers.forEach((gpu, index) => {
            console.log(`-> GPU ${index + 1}: ${gpu.model}`);
        });
    } catch (error) {
        console.error(`Error occurred while getting system information: ${error}`);
    }
}

// Main function to run the application
async function main() {
    await connectToMongoDB(); 
    await getSystemInfo();

    const manager = new ShardingManager('./src/index.js', {
        token: process.env.TOKEN,
        totalShards: 5
    });

    manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
    manager.spawn().catch(console.error);

    // Express Setup
    const app = express();
    const PORT = process.env.PORT || 3129;

    app.set('view engine', 'ejs');

    app.get("/:guildId/leaderboard", async (req, res) => {
        try {
            const { guildId } = req.params;
            const leaderboardData = await lead.find({ Guild: guildId }).sort({ XP: -1 }).limit(10);
            const usersWithDetails = await Promise.all(leaderboardData.map(async (user) => {
                const client = require("./src/index").client;
                const discordUser = await client.users.fetch(user.User); 
                return {
                    avatarUrl: discordUser.displayAvatarURL(),
                    username: discordUser.username,
                    level: user.Level,
                    xp: user.XP
                };
            }));
            res.render('leaderboardPage', { leaderboard: usersWithDetails });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
    
    app.get("/:guildId/warns/:userId", async (req, res) => {
        const { guildId, userId } = req.params;
        try {
            const warnData = await warnSchema.findOne({ GuildID: guildId, UserID: userId });
            if (!warnData) {
                return res.status(404).send("No warnings found for the specified user.");
            }

            const warnings = warnData.Content.map(warn => ({
                warnId: warn.WarnID,
                moderator: warn.ExecuterTag,
                reason: warn.Reason,
                date: new Date(warn.Timestamp).toLocaleString(),
            }));

            res.render('warnPage', { warnings }); 
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
    
    //view streamplan
    app.get("/:guildId/streamplan", async (req, res) => {
    const { guildId } = req.params;
    try {
        const streamPlanData = await streamSchema.findOne({ Guild: guildId });
        if (!streamPlanData) {
            return res.status(404).send("No stream plan found for the specified guild.");
        }

        // Render the stream plan page with the fetched data
        res.render('streamplan', { streamPlan: streamPlanData });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }});

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Execute the main function
main().catch(error => {
    console.error(`An error occurred: ${error}`);
    process.exit(1);
});
