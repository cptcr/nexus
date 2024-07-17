const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const contents = {
    create: "const { SlashCommandBuilder, Em",
    delete: ""
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName("custom-commands")
    .setDescription("Create/Delete Custom commands within your server.")
    .addSubcommand(c => c
        .setName("create")
        .setDescription("Create a custom command")
        .addStringOption(o => o.setName("name").setDescription("Your command name").setRequired(true))
        .addStringOption(o => o.setName("description").setDescription("The description of the custom command").setRequired(true))
        .addStringOption(o => o.setName("reply").setDescription("What content should the bot reply with?").setRequired(true))
        .addBooleanOption(o => o.setName("ephemeral").setDescription("Should the bot reply with an invisible message?").setRequired(true))
    )
    .addSubcommand(c => c
        .setName("delete")
        .setDescription("Delete a custom command")
        .addStringOption(o => o.setName("name").setDescription("Your command name").setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute (interaction, client) {
        const errEmbed1 = new EmbedBuilder({
            title: "Missing permissions",
            description: "You have to be a **Administrator** to use this command!"
        }).setColor("Red")

        const errEmbedAlreadyCreated = new EmbedBuilder({
            title: "Command already exists",
            description: "This command already exists in this server! Use \`/custom-commands delete\` to delete the command!"
        }).setColor("Orange")

        const errEmbedMaxLimitReached = new EmbedBuilder({
            title: "Max limit reached",
            description: "You have reached the maximum limit of custom commands in this server!"
        }).setColor("DarkOrange")

        const dirPath = `src/custom-commands/${interaction.guild.id}/`;
        
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        let customCommandCount = 0;

        filesReaded.forEach(f => {
            customCommandCount++;
        })

        if (customCommandCount >= 10) {
            return await interaction.reply({
                embeds: [errEmbedMaxLimitReached],
                ephemeral: true
            })
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                embeds: [errEmbed1],
                ephemeral: true
            })
        }

        switch (interaction.options.getSubcommand()) {
            case "create":
                const createName = interaction.options.getString("name");
                const createDescription = interaction.options.getString("description");
                const createReply = interaction.options.getString("reply");
                const createEphemeral = interaction.options.getBoolean("ephemeral");
        
                const commandString = `
        const { SlashCommandBuilder } = require("discord.js");
        
        module.exports = {
            data: new SlashCommandBuilder()
                .setName('${createName}')
                .setDescription('${createDescription}'),
        
            async execute(interaction) {
                return await interaction.reply({
                    content: '${createReply}',
                    ephemeral: ${createEphemeral}
                });
            }
        };`;
        
                const errEmbedClientHasCommand = new EmbedBuilder()
                    .setTitle("Command already exists")
                    .setDescription(`This command already exists on this client! Use another name than \`${createName}\``)
                    .setColor("Orange");
        
                if (checkIfExists(createName, interaction)) {
                    return await interaction.reply({
                        embeds: [errEmbedAlreadyCreated],
                        ephemeral: true
                    });
                }
        
                if (checkIfClientHas(createName)) {
                    return await interaction.reply({
                        embeds: [errEmbedClientHasCommand],
                        ephemeral: true
                    });
                }
        
                const dir = `./src/command-functions/${interaction.guild.id}`;
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
        
                const filePath = `${dir}/${createName}.js`;
        
                fs.writeFileSync(filePath, commandString);
        
                // Respond to the interaction
                await interaction.reply({
                    content: `Command \`${createName}\` has been created successfully.`,
                    ephemeral: true
                });
        
                break;
        
            case "delete":
                const deleteName = interaction.options.getString("name");
        
                const fileToDelete = `./src/command-functions/${interaction.guild.id}/${deleteName}.js`;
        
                if (!fs.existsSync(fileToDelete)) {
                    const errEmbedNotFound = new EmbedBuilder()
                        .setTitle("Command not found")
                        .setDescription(`The command \`${deleteName}\` does not exist.`)
                        .setColor("Red");
        
                    return await interaction.reply({
                        embeds: [errEmbedNotFound],
                        ephemeral: true
                    });
                }
        
                fs.unlinkSync(fileToDelete);
        
                // Respond to the interaction
                await interaction.reply({
                    content: `Command \`${deleteName}\` has been deleted successfully.`,
                    ephemeral: true
                });
        
                break;
        
            default:
                await interaction.reply({
                    content: "Unknown subcommand.",
                    ephemeral: true
                });
                break;
        }
    }
}

async function checkIfExists (name, interaction) {
    const file = fs.readdirSync(`./src/custom-commands/${interaction.guild.id}`).filter(f => f.endsWith(`${name}.js`));

    if (file) {
        return true
    } else {
        return false
    }
}

async function checkIfClientHas (name) {
    const commands = fs.readdirSync('./src/commands/');

    for (folder of commands) {
        const file = fs.readdirSync(`./src/commands/${folder}/`).filter(f => f.endsWith(`${name}.js`));;

        if (file) {
            return true
        } else {
            return false
        }
    }
}