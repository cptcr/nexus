//Info Point
/*
  rules
  nexus-uptime
  nexus-stats
  Nexus 
*/
const {client} = require("../../../src/index");
const {Events, EmbedBuilder} = require("discord.js");
const theme = require("../../../embedConfig.json");
client.on(Events.InteractionCreate, async (i) => {
    console.log("test")
    const rulesEmbed = new EmbedBuilder()
    .setTitle("Rules")
    .setDescription("Please read our rules!")
    .setColor(theme.theme)
    .addFields(
      {name: "Rule 1 [Spamming]", value: "Donst Spam", inline: false},
      {name: "Rule 2 [Links and Media]", value: "Dont share phishing links, invites or anything dangerous.", inline: false},
      {name: "Rule 3 [Self Ad]", value: "Self-Advertising sucks.", inline: false},
      {name: "Rule 4 [Joining this Server]", value: "If you do anything on this server, you have accepted the rules", inline: false},
      {name: "Rule 5 [Mini-modding]", value: "No mini-modding. Ping a Staff member.", inline: false},
      {name: "Rule 6 [Staff pings]", value: "If you ping a Dev / Head Mod /Mod without a reason, you would get timeoutet, warned or banned!", inline: false},
      {name: "Rule 7 [Code share]", value: "Dont share dangerous code!", inline: false},
      {name: "Rule 8 [DM]", value: "Dont DM users. (Only DM then when the member allows it.)\n \nTo turn off your DMs for this server: \n1. Click on the Servername \n2. Click on Privacy Settings \n3. Turn off DMs", inline: false},
      {name: "Rule 9 [NEXUS]", value: "If you use NEXUS you automatically accept [TOS](https://tos.toowake.repl.co) and [Privacy Policy](https://privacy-policy.toowake.repl.co)", inline: false},
      {name: "Rule 10 [Tickets and Bot requests]", value: "Dont open a ticket without a reason. If you want to buy a discord bot, open a BOT REQUEST TICKET", inline: false},
    )
    .setImage("https://therules.org/wp-content/uploads/2017/10/LogoHorizontal.png")
  
    //SERVER USAGE
    const usage = process.cpuUsage();
    const usagePercent = usage.system / usage.user * 100;
    const memoryUsed = (os.totalmem - os.freemem)/1000000000;
    const memoryTotal = os.totalmem()/1000000000;
  
    const statsEmbed = new EmbedBuilder()
    .setTitle("Bot Stats")
    .setColor(theme.theme)
    .addFields({name: `Memory:`, value: `> ${(memoryUsed/memoryTotal * 100).toFixed(1)}%`})
    .addFields({name: 'OS:', value: `> ${os.type}`})
    .addFields({name: `OS Version:`, value: `> ${os.release}`})
    .addFields({name: 'CPU: ', value: `> ${usagePercent.toFixed(1)}%`, inline: false})
    .addFields({name: "CPU Name:", value: `> ${os.cpus()[0].model}`, inline: false})
    .addFields({name: 'CPU Type (Arch): ', value: `> ${os.arch}`, inline: false})
    .addFields({name: "Owner:", value:`> <@931870926797160538>`, inline: false})
    .addFields({name: "OS Name:", value: os.type().replace("Windows_NT", "Windows").replace("Darwin", "macOS"), inline: false})
    .addFields({name: "Platform:", value: `${os.platform}`, inline: false})
  
    const daysx = Math.floor(client.uptime / 86400000)
    const hoursx = Math.floor(client.uptime / 3600000) % 24
    const minutesx = Math.floor(client.uptime / 60000) % 60
    const secondsx = Math.floor(client.uptime / 1000) % 60
    const uptimeEmbed = new EmbedBuilder()
    .setTitle(`Uptime of: ${client.user.username}`)
    .setColor(theme.theme)
    .setTimestamp()
    .addFields({ name: "Days: ", value: `${daysx}`, inline: false})
    .addFields({ name: "Hours: ", value: `${hoursx}`, inline: false})
    .addFields({ name: "Minutes: ", value: `${minutesx}`, inline: false})
    .addFields({ name: "Seconds: ", value: `${secondsx}`, inline: false})
  
    const nexus = new EmbedBuilder()
    .setTitle(`${client.user.username}`)
    .setColor(theme.theme)
    .addFields(
      {name: "Name:", value: `${client.user.username}`},
      {name: "ID:", value:`${client.user.id}`},
      {name: "Tag:", value: `<@${client.user.id}>`},
    )
  
    if (i.customId === "rules") {await i.reply({embeds: [rulesEmbed], ephemeral: true})};
    if (i.customId === "Nexus") {await i.reply({embeds: [nexus], ephemeral: true})};
    if (i.customId === "nexus-stats") {await i.reply({embeds: [statsEmbed], ephemeral: true})};
    if (i.customId === "nexus-uptime") {await i.reply({embeds: [uptimeEmbed], ephemeral: true})};
  
  })