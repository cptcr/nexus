const  {SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("send-msg-webhook")
    .setDescription("create a webhook")
    .addStringOption(option => option
        .setName("title")
        .setDescription("The title of the embed")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("description")
        .setDescription("The description")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("color")
        .setDescription("The color of the embed")
        .setRequired(true)
        .addChoices(
            {name: "aqua", value: "#00FFFF"},
            {name: "blurple", value: "#7289DA"},
            {name: "fuchsia", value: "#FF00FF"},
            {name: "gold", value: "#FFD700"},
            {name: "green", value: "#008000"},
            {name: "grey", value: "#808080"},
            {name: "greyple", value: "#7D7F9A"},
            {name: "light-grey", value: "#D3D3D3"},
            {name: "luminos-vivid-pink", value: "#FF007F"},
            {name: "navy", value: "#000080"},
            {name: "not-quite-black", value: "#232323"},
            {name: "orange", value: "#FFA500"},
            {name: "purple", value: "#800080"},
            {name: "red", value: "#FF0000"},
            {name: "white", value: "#FFFFFF"},
            {name: "yellow", value: "#FFFF00"},
            {name: "blue", value: "#0000FF"}
        )
    )
    .addStringOption(option => option
        .setName("name")
        .setDescription("Name of the webhook")
        .setRequired(false)
    )
    .addStringOption(option => option
        .setName("avatar")
        .setDescription("avatar of the webhook")
        .setRequired(false)
    ).addStringOption(option => option
        .setName("thumbnail")
        .setDescription("add a Thumbnail")
        .setRequired(false))
    .addStringOption(option => option
        .setName("image")
        .setDescription("image url")
        .setRequired(false)
    ),

    async execute (interaction) {
        const name = interaction.options.getString("name") || `${interaction.user.username}'s webhook`;
        const AVATAR = interaction.options.getString("avatar") || 'https://i.imgur.com/AfFp7pu.png';
        const Color = interaction.options.getString("color");
        const Title = interaction.options.getString("title");
        const Desc = interaction.options.getString("description");
        const IMAGE =  interaction.options.getString("image") || "https://i.imgur.com/AfFp7pu.png";
        const THUMBNAIL = interaction.options.getString("thumbnail") || "https://i.imgur.com/AfFp7pu.png";

        

        const embed = new EmbedBuilder()
        .setColor(`${Color}`)
        .setTitle(`${Title}`)
        .setDescription(`${Desc}`)
        .setImage(`${IMAGE}`)
        .setThumbnail(`${THUMBNAIL}`)

        interaction.channel.createWebhook({
            name: name,
            avatar: `${AVATAR}`,
        }).then((webhook) => {
            webhook.send({embeds: [embed] });
        }).catch(err => {
                return;
        });

        return interaction.reply({ content: `created webhook: ${name}`});

        
    }
}