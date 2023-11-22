const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, AttachmentBuilder } = require("discord.js");
const util = require("util");
const owners = require("../../../owner.json").owners;
const maintenance = require("../../Schemas.js/Developers/maintenance");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("dev")
    .setDescription("Developer commands")
    .addSubcommandGroup(g => g
        .setName("maintenance")
        .setDescription("Enable/Disable")
        .addSubcommand(c => c.setName("enable").setDescription("Enable the maintenance system"))
        .addSubcommand(c => c.setName("disable").setDescription("Disable the maintenance system"))
    )
    .addSubcommand(c => c.setName("eval").setDescription("Eval command").addStringOption(o => o.setName("input").setDescription("The code to execute").setRequired(true))),

    async execute (interaction, client) {
        if (!owners.includes(interaction.user.id)) {

            const embed = new EmbedBuilder()
            .setDescription("Sorry, you are not a developer/owner!")
            .setColor("Red")
            .setTitle("Access Denied!")
            .setURL("https://discord.gg/nexcord")

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })

        } else {
            const {options, member, user, guild} = interaction;
            const group = options.getSubcommandGroup();
            const command = options.getSubcommand();

            const channel = await client.channels.cache.get("1131267858085711922");
            
            const embed = new EmbedBuilder()
            .setTitle(`${interaction}`)
            .addFields(
                {name: "Developer:", value: `${interaction.user}`, inline: false},
                {name: "Developer ID:", value: `${interaction.user.id}`, inline: false},
            )
            .setThumbnail(`${interaction.member.displayAvatarURL()}`)

            const dataMain = await maintenance.findOne({ Type: "main" });

            if (group) {
                switch (group) {
                    case "maintenance":
                        switch (command) {
                            case "enable":
                                if (dataMain) {
                                    await interaction.reply({
                                        content: "The maintenance system is already enabled!",
                                        ephemeral: true
                                    })
                                } else {
                                    await maintenance.create({
                                        Type: "main"
                                    })

                                    await interaction.reply({
                                        content: "The maintenance system has been enabled!",
                                        ephemeral: true
                                    })

                                    await channel.send({ embeds: [embed] });
                                }
                            break
                            
                            case "disable":
                                if (!dataMain) {
                                    await interaction.reply({
                                        content: "The maintenance system is already disabled!",
                                        ephemeral: true
                                    })
                                } else {
                                    await maintenance.deleteMany({
                                        Type: "main"
                                    })

                                    await interaction.reply({
                                        content: "The maintenance system has been disabled!",
                                        ephemeral: true
                                    })

                                    await channel.send({ embeds: [embed] });
                                }
                            break;
                        }
                    break;
                }
            } else {
                switch (command) {
                    case "eval":
                        let code = options.getString("input");

                        const evalEmbed = new EmbedBuilder()
                        .setTitle("Eval")
                        .addFields(
                            {name: "Code:", value: `${code}`, inline: false}
                        )
                        .setColor("White")
                        .setFooter({ text: "Credits to soyDaddy!"})

                        await interaction.reply({
                            embeds: [evalEmbed],
                            ephemeral: true
                        })

                        if (code.includes("token")) {
                            await interaction.reply({
                                content: "Sorry, you dont get my token LOL",
                                ephemeral: true
                            })

                            console.log(`${interaction.user.username} tried to grap my token!`)
                        } else {
                            try {
                                const start = process.hrtime();
                                evaled = eval(code)
                                code = code.replace(/[""]/g, '"').replace(/['']/g, "'")
                                let evaled;
    
                                if (evaled instanceof Promise) {
                                    evaled = await evaled;
                                } 
    
                                const stop = process.hrtime(start);
                                const outputResponse = `\`\`\`${inspect(evaled, { depth: 0 })}\n\`\`\``;
                                
                                if (outputResponse.length <= 1024) {
                                    evalEmbed.addFields(
                                        {name: "Output:", value: outputResponse.substring(0, 1024)}
                                    )
                                } else {
                                    const output = new AttachmentBuilder(Buffer.from(outputResponse), {name: "output.txt"});
                                    
                                    evalEmbed.addFields(
                                        {name: "Output:", value: `${outputResponse}`, inline: false},
                                    )

                                    await interaction.editReply({
                                        embeds: [evalEmbed],
                                        ephemeral: true
                                    });

                                    await interaction.channel.send({
                                        files: [output],
                                        ephemeral: true
                                    }).catch(err => {return;})
                                }
                            } catch (err) {
                                evalEmbed.addFields(
                                    {name: "Error:", value: `${clean(err)}`, inline: false}
                                )

                                await interaction.editReply({
                                    embeds: [evalEmbed],
                                    ephemeral: true
                                })
                            }
                        }
                    break;
                }
            }
        }
    }
}

const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}