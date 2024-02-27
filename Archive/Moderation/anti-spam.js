const { EmbedBuilder } = require('discord.js')

const usersMap = new Map();
const LIMIT = 5;
const TIME = 7000;
const DIFF = 3000;

const theme = require("../../../embedConfig.json");


//AUDIT LOG
const Audit_Log = require("../../Schemas.js/auditlog");

module.exports = async (client) => {
    client.on('messageCreate', (message) => {

        const data = Audit_Log.findOne({ Guild: message.guild.id})

    if (message.author.bot) return;
    if (usersMap.has(message.author.id)) {
        const userData = usersMap.get(message.author.id);
        const { lastMessage, timer } = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let msgCount = userData.msgCount;
        console.log(difference);

        if (difference > DIFF) {
            clearTimeout(timer);
            userData.msgCount = 1;
            userData.lastMessage = message;
            userData.timer = setTimeout(() => {
                usersMap.delete(message.author.id);
            }, TIME);
            usersMap.set(message.author.id, userData);
        } else {
            ++msgCount;
            if (parseInt(msgCount) === LIMIT) {
                if (data) {
                    const channel = client.channels.cache.get(data.Channel)

                    const embed = new EmbedBuilder()
                    .setTitle("SPAM DETECTED")
                    .addFields(
                        {name: "Channel:", value: `${message.channel}`, inline: false},
                        {name: "User:", value: `${message.author}`, inline: false},
                    ).setColor("Red")
                    .setThumbnail(`${message.author.displayAvatarURL()}`)

                    channel.send({
                        embeds: [embed]
                    })
                }
            } else {
                userData.msgCount = msgCount;
                usersMap.set(message.author.id, userData);
            }
        }
    } else {
        let fn = setTimeout(() => {
            usersMap.delete(message.author.id);
        }, TIME);
        usersMap.set(message.author.id, {
            msgCount: 1,
            lastMessage: message,
            timer: fn
        });
    }
});
}