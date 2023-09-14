const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help"),
    async execute (interaction) {
        const sysEmbed = new EmbedBuilder()
        .setTitle("Help")
        .setColor("White")
        .setFooter({ text: "Created by toowake"})
        .setDescription("**AUTOMOD AND SYSTEMS**")
        .addFields(
            {name: "/anti-flagged-words", value: "Anti flagged words system \nCommand: </anti-flagged-words:1091340536494960682>", inline: false},
            {name: "/anti-ghostping", value: "Enable/Disable Ghostpings \nCommand: </anti-ghostping:1091837745925726306>", inline: false},
            {name: "/anti-link", value: "Setup and disable the anti link system \nCommand: </anti-link:1091851481109508116>", inline: false},
            {name: "/anti-mention-spam", value: "Donst Spam Mentions \nCommand: </anti-mention-spam:1091340536494960683>", inline: false},
            {name: "/anti-spam", value: "max number of messages in a interval \nCommand: </anti-spam:1091340536494960681>", inline: false},
            {name: "/anti-word", value: "delete messages with a specific keyowrd \nCommand: </anti-word:1091340536494960680>", inline: false},
            {name: "/autoreply-setup", value: "Setup the autoreply in your server \nCommand: </autoreply-setup:1138171181183291543>", inline: false},
            {name: "/autoreply-delete", value: "Delete the autoreply in your server \nCommand: </autoreply-delete:1138171181183291542>", inline: false},
            {name: "/color-hex", value: "Get information about a hex color \nCommand: </color-hex:1138489283246817390>", inline: false},
            {name: "/color-rgb", value: "Get info about a rgb color \nCommand: </color-rgb:1138489283246817391>", inline: false},
            {name: "/command-logging", value: "enable/disable command logging for you \nCommand: </command-logging:1125824858194972852>", inline: false},
            {name: "/delete-my-data", value: "This command deletes all your restored data! \nCommand: </delete-my-data:1120693930636365985>", inline: false},
            {name: "/giveaway", value: "Start a giveaway or configure already existing ones. \nCommand: </giveaway:1098651788627947684>"},
            {name: "/impersonate", value: "impersonate a user with a webhook \nCommand: </impersonate:1093631827647942757>", inline: false},
            {name: "/join-to-create", value: "Configure your join to create voice channel. \nCommand: </join-to-create:1100855119588896850>", inline: false},
            {name: "/login", value: "Login System \nCommand: </login:1105503793325551626>", inline: false},
            {name: "/panel-systems", value: "Enable or disable systems \nCommand: </panel-systems:1133710925346639924>", inline: false},
            {name: "/remind", value: "Configure your reminders.\nCommand: </remind:1101915503032811680>", inline: false},
            {name: "/stream", value: "Setup a streamplan \nCommand: </stream:1109500976051785859>", inline: false},
            {name: "/template", value: "Creates a loadable template of your server. \nCommand: </template:1121015103286956048>", inline: false},
            {name: "/ticket-setup", value: "Sets up the ticket system for the server. \nCommand: </ticket-setup:1108442468283842671>", inline: false},
            {name: "/ticket-disable", value: "Disables the ticket system for the server. \nCommand: </ticket-disable:1106562459478802482>", inline: false}
        );

        const comEmbed =  new EmbedBuilder()
        .setTitle("Help")
        .setColor("White")
        .setFooter({ text: "Created by toowake"})
        .setDescription("**COMMUNITY**")
        .addFields(
            {name: "/dicitionary", value: "search a word in the dictionary \nCommand: </dictionary:1073624441805881384>", inline: false},
            {name: "/enlarge", value: "make an emoji bigger \nCommand: </enlarge:1091839297033883678>", inline: false},
            {name: "/game", value: "get a random game \nCommand: </game:1091433410712580168>", inline: false},
            {name: "/google", value: "replies with the google search you put \nCommand: </google:1094637007940100200>", inline: false},
            {name: "/hug", value: "hug a discord member \nCommand: </hug:1093954294388117685>", inline: false},
            {name: "/kiss", value: "kiss a discord member \nCommand: </kiss:1093954294388117686>", inline: false},
            {name: "/lyrics", value: "Displays the lyrics from the given song \nCommand: </lyrics:1102338755286810705>", inline: false},
            {name: "/membercount", value: "Get the server membercount \nCommand: </membercount:1056900006315036714>", inline: false},
            {name: "/random", value: "Gives you a random answer from the given options \nCommand: </random:1087773739376181288>", inline: false},
            {name: "/say", value: "Say somehting as your bot! \nCommand: </say:1087773739376181288>", inline: false},
            {name: "/spotify", value: "see a users current spotify status \nCommand: </spotify:1100855119588896848>", inline: false},
            {name: "/serverinfo", value: "This gets some server info \nCommand: </serverinfo:1065994243983810681>", inline: false},
            {name: "/slap", value: "Slap a discord member \nCommand: </slap:1093949717194481784>", inline: false},
            {name: "/translate", value: "Translate a text to english \nCommand: </translate:1121015103286956045>", inline: false},
            {name: "/web-screenshot", value: "Take a screenshot of a website \nCommand: </web-screenshot:1138231213828620298>", inline: false},
            {name: "/wiki", value: "search something on wikipedia \nCommand: </wiki:1091837745925726304>", inline: false},
            {name: "/vote", value: "Vote for me on top.gg!\nCOmmand: </vote:1140762720963137656>"}
        );

        const modEmbed =  new EmbedBuilder()
        .setTitle("Help")
        .setColor("White")
        .setFooter({ text: "Created by toowake"})
        .setDescription("**MODERATION**")
        .addFields(
            {name: "/add-role", value: "Adds a role to a member. \nCommand: </add-role:1118155818592895009>", inline: false},
            {name: "/affiliate-check", value: "Check if a Link is affiliate \nCommand: </affiliate-check:1125770132422152302>", inline: false},
            {name: "/clear", value: "clear a channels messages \nCommand: </clear:1133710925346639923>", inline: false},
            {name: "/lock", value: "lock a channel \nCommand: </lock:1066419333447823411>", inline: false},
            {name: "/membercount-graph", value: "Shows the number of members on the server. \nCommand: </membercount-graph:1118472434887168051>", inline: false},
            {name: "/mod-panel", value: "Moderate a user with this panel \nCommand: </mod-panel:1118867182202404945>", inline: false},
            {name: "/send-msg-webhook", value: "create a webhook \nCommand: </send-msg-webhook:1094646867389841559>", inline: false},
            {name: "/steal", value: "Adds a given emoji to the server \nCommand: </steal:1068840902107353209>", inline: false},
            {name: "/unban", value: "unban a user \nCommand: </unban:1050492451263107072>", inline: false},
            {name: "/unlock", value: "unlock a channel \nCommand: </unlock:1066419333447823412>", inline: false},
            {name: "/reactionrole", value: "Create reactionroles in your server \nCommand: </reactionrole:1142545569076760698>", inline: false}
        );

        const otherEmbed =  new EmbedBuilder()
        .setTitle("Help")
        .setColor("White")
        .setFooter({ text: "Created by toowake"})
        .setDescription("**OTHER/USELESS COMMANDS**")
        .addFields(
            {name: "/answer", value: "Answer to a message \nCommand: </answer:1101971612280033350>", inline: false},
            {name: "/credits", value: "Credits to all the people who helped me \nCommand: </credits:1100855119588896851>", inline: false},
            {name: "/rizz", value: "get rizzzzzzz \nCommand: </rizz:1121877504727207946>", inline: false},
            {name: "/weather", value: "Get weather information \nCommand: </weather:1134522752091574374>", inline: false},
        );

        const nsfwEmbed =  new EmbedBuilder()
        .setTitle("Help")
        .setColor("White")
        .setFooter({ text: "Created by toowake"})
        .setDescription("**NSFW COMMANDS**")
        .addFields(
            {name: "/akaneko", value: "get some random akaneko content \nCommand: </akaneko:1118472434887168052>", inline: false},
            {name: "/nsfw", value: "Uhm.. self explanatory! \nCommand: </nsfw:1121015103286956049>", inline: false}
        );

        const impSysEmbed =  new EmbedBuilder()
        .setTitle("Help")
        .setColor("White")
        .setFooter({ text: "Created by toowake"})
        .setDescription("Important Systems")
        .addFields(
            {name: "XP System", value: "XP Amount: </xp:1145648836119904356> \nXP Channel: </xp-channel:1125770132422152303> \nRole Reward: </xp-role:1143109888315240479> \nRank: </rank:1118867182202404947> \nEdit Card: </card:1139224170945847407> \nLeaderboard: </top:1118867182202404946> \nXP Reset: </xp-server-reset:1118867182202404948> </xp-user-reset:1118867182202404949>", inline: false},
            {name: "Warn System", value: "Trollwarn: </trollwarn:1083459697174134984> \nClearwarn: </clearwarn:1047900759414554744> \nWarn: </warn:1047900759414554745> \nWarnings: </warnings:1136694547263529030>", inline: true},
            {name: "Economy", value: "Balance: </bal:1087408915416879206> \nBeg: </beg:1087408915416879207> \nCreate/delete Account: </economy:1087408915416879208>", inline: false},
            {name: "Modmail:", value: "Command: </modmail:1139604099147518074>", inline: false},
            {name: "Audit Log:", value: "Setup: </auditlog-setup:1140383257444220989> \nDelete: </auditlog-delete:1140383257444220989>", inline: false}
        )

        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setEmoji("<:code:1135252421430497290>")
            .setLabel("Systems")
            .setCustomId("sys")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setEmoji("<:code:1135252421430497290>")
            .setLabel("Community")
            .setCustomId("com")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setEmoji("<:code:1135252421430497290>")
            .setLabel("Moderation")
            .setCustomId("mod")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setEmoji("<:code:1135252421430497290>")
            .setLabel("Other")
            .setCustomId("oth")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setEmoji("<:code:1135252421430497290>")
            .setLabel("NSFW")
            .setCustomId("nsfw")
            .setStyle(ButtonStyle.Primary),
        )
        const button2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setEmoji("<:code:1135252421430497290>")
            .setLabel("Main Systems")
            .setCustomId("main")
            .setStyle(ButtonStyle.Primary)
        )

        const start =  new EmbedBuilder()
        .setTitle("Help")
        .setColor("White")
        .setFooter({ text: "Created by toowake"})
        .setDescription("This is the help command. Click the buttons below to get info for your command! \n[Discord](https://discord.gg/z8nxPve4pn) | [Website](https://nexus.toowake.repl.co) | [TOP.GG](https://top.gg/bot/1046468420037787720)")

        const msg = await interaction.reply({embeds: [start], components: [buttons, button2] });

        const collector = await msg.createMessageComponentCollector();

        collector.on("collect", async i => {
            const {customId, member} = i;
            if (customId === "main") {
                await i.update({ embeds: [impSysEmbed], components: [buttons, button2] });
            }

            if (customId === "nsfw") {
                if (!i.channel.nsfw) {
                    return i.reply(
                        {
                            content: "🔞 This is not a NSFW Channel!",
                            ephemeral: true
                        }
                    )
                }
                await i.update({ embeds: [nsfwEmbed], components: [buttons, button2] });
            }

            if (customId === "oth") {
                await i.update({ embeds: [otherEmbed], components: [buttons, button2] });
            }

            if (customId === "mod") {
                await i.update({ embeds: [modEmbed], components: [buttons, button2] });
            }

            if (customId === "com") {
                await i.update({ embeds: [comEmbed], components: [buttons, button2] });
            }

            if (customId === "sys") {
                await i.update({ embeds: [sysEmbed], components: [buttons, button2] });
            }
        })
    }
}