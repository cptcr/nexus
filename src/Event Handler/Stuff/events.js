const { Events, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, ModalSubmitFields, ModalSubmitInteraction } = require("discord.js")
const GiveawaysManager = require("../../Utils/giveaway");
const { createTranscript } = require('discord-html-transcripts');
const QuickChart = require('quickchart-js');
const os = require("os");
const path = require('path');
const axios = require("axios");

//some schemas

const theme = require("../../../embedConfig.json");


//AUDIT LOG
const Audit_Log = require("../../Schemas.js/auditlog");
module.exports = async (client) => {
//Blacklist User from Support DC server
client.on(Events.GuildMemberAdd, async (member) => {
  

client.giveawayManager = new GiveawaysManager(client, {
  default: {
    botsCanWin: false,
    embedColor: "#a200ff",
    embedColorEnd: "#550485",
    reaction: "🎉",
  },
})
})
}