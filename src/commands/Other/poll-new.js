const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PollLayoutType } = require("discord.js");
const schema = require("../../Schemas.js/pollDiscord");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("discord-poll")
    .setDescription("Create a discord official poll")
    .addSubcommand(c => c
        .setName("create")
        .setDescription("Creates a discord poll")
        .addStringOption(o => o.setName("question").setDescription("What do you want to ask?").setRequired(true))
        .addBooleanOption(o => o.setName('allow-multi').setDescription("Select multiple options?").setRequired(true))
        .addStringOption(o => o.setName("answer-1").setDescription("Possible answer 1").setRequired(true))
        .addStringOption(o => o.setName("answer-2").setDescription("Possible answer 2").setRequired(true))
        .addStringOption(o => o.setName("answer-3").setDescription("Possible answer 1").setRequired(false))
        .addStringOption(o => o.setName("answer-4").setDescription("Possible answer 2").setRequired(false))
        .addStringOption(o => o.setName("answer-5").setDescription("Possible answer 1").setRequired(false))
        .addStringOption(o => o.setName("emoji-1").setDescription("Emoji for option 1").setRequired(false))
        .addStringOption(o => o.setName("emoji-2").setDescription("Emoji for option 1").setRequired(false))
        .addStringOption(o => o.setName("emoji-3").setDescription("Emoji for option 1").setRequired(false))
        .addStringOption(o => o.setName("emoji-4").setDescription("Emoji for option 1").setRequired(false))
        .addStringOption(o => o.setName("emoji-5").setDescription("Emoji for option 1").setRequired(false))
    )
    .addSubcommand(c => c
        .setName("end")
        .setDescription("Ends a discord poll")
        .addStringOption(o => o.setName("poll").setAutocomplete(true).setDescription("Which poll do you want to end?"))
    )
    .addSubcommand(c => c
        .setName("view-votes")
        .setDescription("Shows the results of a vote")
        .addStringOption(o => o.setName("poll").setDescription("The poll you want to view the results from").setAutocomplete(true))
    ),

    async autocomplete(interaction, client) {
        const focus = interaction.options.getFocused();

        if (focus.optionName === 'poll') {
            let data;
    
            if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                data = await schema.find({
                    Guild: interaction.guild.id
                })
            } else {
                data = await schema.find({
                    isAdmin: false,
                    Guild: interaction.guild.id,
                    Author: interaction.user.id
                })
            }
    
            let choices = [];
    
            data.forEach(d => {
                choices.push({
                    name: d.Question,
                    value: d.Message
                })
           })
        }
    },

    async execute (interaction, client) {
        const { options, guild, member, user } = interaction;
        const { getSubcommand, getString, getBoolean } = options;
        const sub = interaction.options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionFlagsBits.SendPolls)) {
            return await interaction.reply({
                content: "You are not allowed to send/manage polls!",
                ephemeral: true
            })
        }

        switch (sub) {
            case "create":
                const question = interaction.options.getString("question");
                const allowMultiselect = interaction.options.getBoolean("allow-multi");
                const maxAnswers = 5; // Maximum number of answers you expect
                const answers = [];
                const emojis = [];
            
                // Collecting answers and emojis
                for (let i = 1; i <= maxAnswers; i++) {
                    const answer = interaction.options.getString(`answer-${i}`);
                    const emoji = interaction.options.getString(`emoji-${i}`);
                
                    if (answer) {
                        answers.push(answer);
                        if (emoji) {
                            emojis.push(emoji);
                        } else if (emojis.length < answers.length) { 
                            emojis.push(undefined); 
                        }
                    } else if (emoji) {
                        if (answers.length > emojis.length) {
                            emojis.push(emoji);  
                        }
                    }
                }
            
                const voteOptions = answers.map((answer, index) => ({
                    text: answer,
                    emoji: emojis[index] || undefined  
                }));
            
                if (voteOptions.length < 2) {
                    await interaction.reply({ content: "You must provide at least two answers to create a poll.", ephemeral: true });
                    return;
                }
            
                await createPoll(interaction, question, allowMultiselect, voteOptions);
            break;

            case "end":
                const endId = getString("poll");
                endPoll(interaction, endId)
            break;

            case "view-votes":
                const viewId = getString("poll");
                fetchVoters(interaction, client, viewId, guild.id)
            break;

            default:
                return await interaction.reply({ content: "Command does not exist!", ephemeral: true })
        }
    }
}

async function createPoll(interaction, question, select, answers) {
    const poll = interaction.channel.send({
        poll: {
            question: { text: question},
            answers: answers,
            allowMultiselect: select,
            layoutType: PollLayoutType.Default
        }
    })

    let a = false;

    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        a = true
    }

    schema.create({
        Guild: interaction.guild.id,
        Message: poll.id,
        Author: interaction.user.id,
        isAdmin: a,
        Question: question
    })

    await interaction.reply({
        content: "Poll created!",
        ephemeral: true
    })
}

async function endPoll(interaction, messageId) {
    const targetMessage = await interaction.channel.messages.fetch(messageId);

    await targetMessage.poll.end();

    return await interaction.reply({
        content: "Poll has been ended successfull!",
        ephemeral: true
    })
}

async function fetchVoters(interaction, client, messageId, guildId) {
    let fMessage = null;

    try {
        const guild = await client.guilds.fetch(guildId);

        for (const [channelId, channel] of guild.channels.cache) {
            if (channel.isTextBased()) {
                try {
                    fMessage = await channel.messages.fetch(messageId);
                } catch (error) {
                    console.error(error);
                    return await interaction.reply({
                        content: "This poll has been deleted or i cant find it!",
                        ephemeral: true
                    })
                }
            }
        }
    } catch (error) {
        console.log(error);

        return await interaction.reply({
            content: "There was an error recieving the info of the poll message!",
            ephemeral: true
        })
    }

    let voters = [];
    
    fMessage.poll.forEach(a => {
        voters.push({
            name: `${a.text}`,
            value: `Votes: ${a.voteCount}`
        })
    })

    const embed = new EmbedBuilder({
        title: "Poll Results",
        description: `>>> Expires: ${fMessage.poll.expiresTimestamp} \n Question: ${fMessage.poll.question.text} \n Multi Select: ${fMessage.poll.allowMultiselect}`,
        fields: voters,
    }).setColor("White")

    return await interaction.reply({ embeds: [embed], ephemeral: true })
}

