const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Create some things")
    .addSubcommand(command => command
        .setName("thread")
        .setDescription("create a public thread")
        .addStringOption(option => option.setName('name').setDescription('Name of the thread').setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Reason for creating this Thread").setRequired(false))
    )
    .addSubcommand(command => command
        .setName("ms")
        .setDescription("Calculate milliseconds")
        .addIntegerOption(option => option.setName("years").setDescription("the amount of years").setRequired(false))
        .addIntegerOption(option => option.setName("months").setDescription("the amount of months").setRequired(false))
        .addIntegerOption(option => option.setName("weeks").setDescription("the amount of weeks").setRequired(false))
        .addIntegerOption(option => option.setName("days").setDescription("the amount of days").setRequired(false))
        .addIntegerOption(option => option.setName("hours").setDescription("the amount of hours").setRequired(false))
        .addIntegerOption(option => option.setName("minutes").setDescription("the amount of minutes").setRequired(false))
        .addIntegerOption(option => option.setName("seconds").setDescription("the amount of seconds").setRequired(false))
    )
    .addSubcommand(command => command
        .setName("webhook")
        .setDescription("Create a webhook")
        .addStringOption(option => option.setName("name").setDescription("Name of the webhook").setRequired(false))
        .addStringOption(option => option.setName("avatar").setDescription("avatar of the webhook").setRequired(false))
    )
    .addSubcommand(command => command
        .setName("embed")
        .setDescription("create a embed message")
        .addStringOption(option => option.setName("title").setDescription("The title of the embed").setRequired(true))
        .addStringOption(option => option.setName("description").setDescription("The description").setRequired(true))
        .addStringOption(option => option.setName("color").setDescription("The color of the embed").setRequired(true).addChoices(
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
        .addStringOption(option => option.setName("hyperlink-name").setDescription("Name of the hyperlink").setRequired(false))
        .addStringOption(option => option.setName("hyperlink-link").setDescription("Add a hyper link").setRequired(false))
        .addStringOption(option => option.setName("thumbnail").setDescription("add a Thumbnail").setRequired(false))
        .addStringOption(option => option.setName("image").setDescription("image url").setRequired(false))
        .addChannelOption(option => option.setName("channel").setDescription("The channel you will send this message").setRequired(false))
    ),

    async execute (interaction, client) {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case "thread":  
            const errEmbed = new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")
            .setDescription("Missing Permissions: Create Public Threads")
            .setTimestamp()
        
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.CreatePublicThreads)) return await interaction.reply({embeds: [errEmbed], ephemeral: true});
        
            const name = interaction.options.getString('name');
            const reason = interaction.options.getString("reason") || "No reason given!";
        
            const thread = await interaction.channel.threads.create({
                name: `${name}`,
                autoArchiveDuration: 60,
            }).catch(err => {
                return;
            });
        
            const embed2 = new EmbedBuilder()
            .setTitle("Created Thread successfull!")
            .addFields(
                {name: "Thread:", value: `<#${thread.id}>`, inline: true},
                {name: "Member:", value: `<@${interaction.member.id}>`, inline: true},
                {name: "Reason:", value: `${reason}`, inline: true}
            )
            .setTimestamp()
            .setColor("Green")
        
            const threadID = thread.id;
            const ThreadSend = client.channels.cache.get(`${threadID}`);
        
            const embed3 = new EmbedBuilder()
            .setTitle("Your Thread has been created!")
            .setColor("Green")
            .setDescription("This is your Thread!")
            .addFields(
                {name: "Reason", value: `${reason}`}
            )
            .setTimestamp()
        
            ThreadSend.send({
                content: `<@${interaction.user.id}>`,
                embeds: [embed3]
            }).catch(err => {
                return;
            })
        
            
            await interaction.reply({
                embeds: [embed2]
            }).catch(err => {
                return;
            });
            break;
            case "ms":
                const years = interaction.options.getInteger("years") || "0";
                const months = interaction.options.getInteger("months") || "0";
                const weeks = interaction.options.getInteger("weeks") || "0";
                const days = interaction.options.getInteger("days") || "0";
                const hours = interaction.options.getInteger("hours") || "0";
                const minutes = interaction.options.getInteger("minutes") || "0";
                const seconds = interaction.options.getInteger("seconds") || "0";
         
                const year = "31536000000";
                const month = "2628000000";
                const week = "604800000";
                const day = "86400000";
                const hour = "3600000";
                const minute = "60000";
                const second = "1000";
         
                const xyear = Math.floor(year * years);
                const xmonth = Math.floor(month * months);
                const xweek = Math.floor(week * weeks);
                const xday = Math.floor(day * days);
                const xhour = Math.floor(hour * hours);
                const xminute = Math.floor(minute * minutes);
                const xsecond = Math.floor(second * seconds);
         
                const ALL = Math.floor(xyear + xmonth + xweek + xday + xhour + xminute + xsecond)
         
                const embed = new EmbedBuilder()
                .setTitle("Your results are here!")
                .setDescription(`Exactly MS: ||${ALL}||`)
                .addFields(
                    {name: `${years} Years:`, value: `${xyear}`, inline: true},
                    {name: `${months} Months:`, value: `${xmonth}`, inline: true},
                    {name: `${weeks} Weeks:`, value: `${xweek}`, inline: true},
                    {name: `${days} Days:`, value: `${xday}`, inline: true},
                    {name: `${hours} Hours:`, value: `${xhour}`, inline: true},
                    {name: `${minutes} Minutes::`, value: `${xminute}`, inline: true},
                    {name: `${seconds} Seconds:`, value: `${xsecond}`, inline: true},
                )
                .setColor("Blue")
                .setTimestamp()
         
                await interaction.reply({
                    embeds: [embed]
                })
            break;
            case "webhook":
                const namex = interaction.options.getString("name") || `${interaction.user.username}'s webhook`;
                const AVATAR = interaction.options.getString("avatar") || 'https://i.imgur.com/AfFp7pu.png';
        
                const errEmbedx = new EmbedBuilder()
                .setTitle("ERROR")
                .setColor("Red")
                .setDescription("Missing Permissions: Manage Webhooks")
                .setTimestamp()
        
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) return interaction.reply({
                    embeds: [errEmbedx],
                    ephemeral: true
                });
        
                interaction.channel.createWebhook({
                    name: namex,
                    avatar: `${AVATAR}`,
                })
                    
                    .catch(err => {
                        return;
                    });
        
                await interaction.reply({ content: `created webhook: ${namex}`})
            break;
            case "embed":
                const Color = interaction.options.getString("color");
                const Title = interaction.options.getString("title");
                const Desc = interaction.options.getString("description");
                const hyName = interaction.options.getString("hyperlink-name") || "No link given";
                const hyLink = interaction.options.getString("hyperlink-link") || " ";
                const Channel = interaction.options.getChannel("channel") || interaction.channel;
                const IMAGE =  interaction.options.getString("image");
                const THUMBNAIL = interaction.options.getString("thumbnail");
                const CID  = Channel.id;
        
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply("You cant use this command");
        
                const embedxx = new EmbedBuilder()
                .setTitle(`${Title}`)
                .setColor(`${Color}`)
                .setDescription(`${Desc}`)
                .setTimestamp()
        
                if (hyName === "No link given") {
                } else {
                    embedxx.addFields(
                        {name: "Hyperlink:", value: `[${hyName}](${hyLink})`}
                    )
                }
        
                if (IMAGE) {
                    embedxx.setImage(`${IMAGE}`)
                }
        
                if (THUMBNAIL) {
                    embedxx.setThumbnail(`${THUMBNAIL}`)
                }
        
               
                if (CID) {
                    const channel = client.channels.cache.get(`${CID}`);
                    await channel.send({ embeds: [embedxx], content: "@everyone" });
                    return await interaction.reply({ content: `Message has been send in <#${CID}>!`, ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [embedxx] });
                }
            break;

                 
        }
    }
}