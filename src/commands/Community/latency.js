const { SlashCommandBuilder, EmbedBuilder, Client, Embed } = require("discord.js");
const { MongoClient } = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("latency")
    .setDescription("Tests the latency"),

    /**
     * 
     * @param {import("discord.js").Interaction} interaction 
     * @param {import("discord.js").Client} client 
     */
    async execute (interaction, client) {
        const clientPing = client.ws.ping();
        const messagePing = Date.now() - interaction.createdTimestamp;
        const databasePing = pingMongoDB(process.env.MONGOURI);

        interaction.deferReply();

        const embed = new EmbedBuilder({
            title: "Latency Test",
            fields: [
                { name: "Bot WS", value: `${clientPing}`, inline: false},
                { name: "Interaction", value: `${messagePing}`, inline: false},
                { name: "Database", value: `${databasePing}`, inline: false},
                { name: "Database Information", value: "**Host:** [MongoDB](https://mongodb.com) \n**Provider:** [Amazon Web Services (AWS)](https://aws.amazon.com) \n**Server:** eu-central-1 \n**Location:** Frankfurt, Germany \n**Latency (You - Server):** https://awsspeedtest.com/latency", inline: false}
            ]
        }).setColor("Orange")

        return await interaction.editReply({ embeds: [embed] });
    }
}

async function pingMongoDB(uri) {
    let ping;
    
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();

        const db = client.db("admin");

        const result = await db.command({ ping: 1 });
        ping = result

        if (result.ok === 1) {
            ping = `${result}, Connection OK`
        } else {
            ping = "Failed"
        }
    } catch (err) {
        ping = "Connection Timeout"
    } finally {
        await client.close();
    }

    return ping;
}