const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const INFLUX = "IV-8eb6de2caeaf7cf60932e910812876e95565e36b9a66ee8d679e1518cd145deebd64a6";
const post = (require("axios")).post;

module.exports = {
    data: new SlashCommandBuilder()
    .setName("influx")
    .setDescription("Interact with the IV API")
    .addSubcommandGroup(g => g
        .setName("lookup")
        .setDescription("Some lookups")
        .addSubcommand(c => c
            .setName("openjourney")
            .setDescription("Displays a users openjourney card")
            .addUserOption(o => o.setName("target").setDescription("The user you want to grab the info from").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("ip")
            .setDescription("Get information about an IP adress")
            .addStringOption(o => o
                .setName("ip")
                .setDescription("The IP-Adress (for example: 1.1.1.1)")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup(g => g
        .setName("fun")
        .setDescription("The funny commands")
        .addSubcommand(c => c
            .setName("affect")
            .setDescription("Smoking affect")
            .addUserOption(o => o.setName("target").setDescription("The user you want to affect").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("bat-slap")
            .setDescription("Slap someone!")
            .addUserOption(o => o.setName("batman").setDescription("The user who is batman").setRequired(true))
            .addUserOption(o => o.setName("target").setDescription("The user who gets slapped").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("beautiful")
            .setDescription("Oh this is a beautiful!")
            .addUserOption(o => o.setName("beauty").setDescription("The user who is beautiful <3").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("darkness")
            .setDescription("Makes an image 20% darker")
            .addUserOption(o => o.setName("image").setDescription("The image URL for the darkness process").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("delete")
            .setDescription("Are you sure you want to delete this user?")
            .addUserOption(o => o.setName("image").setDescription("The image URL of the user to delete").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("gay")
            .setDescription("Add a gay flag in front of the users profile picture")
            .addUserOption(o => o.setName("target").setDescription("Which person is gay?").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("greyscale")
            .setDescription("Make the avatar of a user grey")
            .addUserOption(o => o.setName("target").setDescription("The user whichs Avatar should be greyscaled").setRequired(true))
        )
        .addSubcommand(c  => c
            .setName("invert") 
            .setDescription("Invert the colors of a users avatar")
            .addUserOption(o => o.setName("target").setDescription("The user which's avatar i should invert").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("jail")
            .setDescription("Shows the avatar of a user behind the jail")
            .addUserOption(o => o.setName("target").setDescription("The user which should be in the jail").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("sad-cat") 
            .setDescription("Sad cat meme")
            .addStringOption(o => o.setName("text").setDescription("The reason why the cat is sad").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("communism") 
            .setDescription("Make a user a communism")
            .addUserOption(o => o.setName("target").setDescription("The user which is a communist").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("pikachu") 
            .setDescription("Shocked pikachu reaction to a text")
            .addStringOption(o => o.setName("text").setDescription("The text is the reason why pikachu is shocked").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("gun") 
            .setDescription("Make the user avatar with a gun")
            .addUserOption(o => o.setName("target").setDescription("The user with a gun").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("wanted") //endpoint: wanted
            .setDescription("Make a user wanted!")
            .addUserOption(o => o.setName("target").setDescription("Who was a bad person?").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("oogway") //ednpoint: oogway
            .setDescription("A wise sentence oggway said")
            .addStringOption(o => o.setName("text").setDescription("The text for the image.").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("alert") //endpoint: alert
            .setDescription("A phone message alert")
            .addStringOption(o => o.setName("message").setDescription("The text which will be shown in the message").setRequired(true))
        )
        .addSubcommand(c => c //endpoint: caution
            .setName("caution")
            .setDescription("Make an caution sign")
            .addStringOption(o => o.setName("text").setDescription("The message on that sign").setRequired(true))
        )
        .addSubcommand(c => c
            .setName("tweet")
            .setDescription("Create a fake tweet")
            .addUserOption(o => o
                .setName("avatar")
                .setDescription("I will use the discord users avatar")
                .setRequired(true)
            )
            .addStringOption(o => o.setName("username").setDescription("The username of the twitter user").setRequired(true))
            .addStringOption(o => o.setName("display-name").setDescription("The name displayed on the image").setRequired(true))
            .addStringOption(o => o.setName("comment").setDescription("The comment on the twitter card").setRequired(true))
            .addStringOption(o => o.setName("theme").setDescription("The theme on the twitter card").setRequired(true).setChoices(
                {name: "Light", value: "light"},
                {name: "Dim", value: "dim"},
                {name: "Dark", value: "dark"}
            ))
            .addBooleanOption(o => o.setName("verified").setDescription("Is the user verified?").setRequired(true))
        )
    ),

    async execute(interaction, client) {
        const {guild, user, options} = interaction;
        const group = options.getSubcommandGroup();
        const cmd = options.getSubcommand();

        switch (group) {
            case "fun":
                switch(cmd) {
                    case "affect":
                        const affectImage = options.getUser("target").displayAvatarURL().setFormat('png');
    
                        fun("/affect", interaction, affectImage)
                    break;
    
                    case "bat-slap":
                        const batSlapImg = options.getUser("batman").displayAvatarURL().setFormat('png');
                        const batTarImg = options.getUser("target").displayAvatarURL().setFormat('png');
    
                        fun("/batslap", interaction, batSlapImg, batTarImg);
                    break;
    
                    case "beautiful":
                        const beautifulBeauty = options.getUser("beauty").displayAvatarURL().setFormat('png');
    
                        fun("/beautiful", interaction, beautifulBeauty);
                    break;
    
                    case "darkness":
                        const darknessImage = options.getUser("image").displayAvatarURL().setFormat('png');
    
                        fun("/darkness", interaction, darknessImage);
                    break;
    
                    case "gay":
                        const gayImage = options.getUser("target").displayAvatarURL().setFormat('png');
    
                        fun("/gay", interaction, gayImage);
                    break;
    
                    case "greyscale":
                        const greyScaleImage = options.getUser("target").displayAvatarURL().setFormat('png');
    
                        fun("/greyscale", interaction, greyScaleImage);
                    break;
    
                    case "invert":
                        const invertImage = options.getUser("target").displayAvatarURL().setFormat('png');
    
                        fun("/invert", interaction, invertImage);
                    break;
                    
                    case "jail":
                        const jailImage = options.getUser("target").displayAvatarURL().setFormat('png');
    
                        fun("/jail", interaction, jailImage);
                    break;
    
                    case "sad-cat":
                        const catImage = options.getString("text");
    
                        funText("/sad-cat", interaction, catImage);
                    break;
    
                    case "communism":
                        const comImage = options.getUser("target").displayAvatarURL().setFormat('png');
    
                        fun("/communism", interaction, comImage);
                    break;
    
                    case "pikachu":
                        const pikImage = options.getString("text");
    
                        funText("/pikachu", interaction, pikImage);
                    break;
    
                    case "gun":
                        const gunImage = options.getUser("target").displayAvatarURL().setFormat('png');
    
                        fun("/gun", interaction, gunImage);
                    break;
    
                    case "wanted":
                        const wantedImage = options.getUser("target").displayAvatarURL().setFormat('png');
    
                        fun("/wanted", interaction, wantedImage);
                    break;
    
                    case "oogway":
                        const textOog = options.getString("text");
    
                        funText("/oogway", interaction, textOog);
                    break;
    
                    case "alert":
                        const textAlert = options.getString("message");
    
                        funText("/alert", interaction, textAlert);
                    break;
    
                    case "caution":
                        const textCaution = options.getString("text");
    
                        funText("/caution", interaction, textCaution)
                    break;
    
                    case "tweet":
                        const bdy = {
                            "avatar": `${options.getUser('avatar').displayAvatarURL()}`.replace(".webp", ".png"),
                            "username": options.getString("username"),
                            "displayName": options.getString("display-name"),
                            "verified": options.getBoolean("verified"),
                            "comment": options.getString("comment"),
                            "theme": options.getString("theme")
                        }
    
                        const response = getResponse(`https://api.influx.vision/canvas/tweet`, bdy);
    
                        if (response.status === 200) {
                            const embed = new EmbedBuilder({
                                color: [255, 255, 255],
                                image: `${response.result}`,
                            }).setTimestamp(true)
                
                            return await interaction.reply({
                                embeds: [embed]
                            })
                        } else if (response.staus > 200) {
                            return await interaction.reply({
                                content: `**${response.error}:** ${response.message}`,
                                ephemeral: true
                            })
                        }
                    break;

                    default:
                        return await interaction.reply({
                            content: `The command **${cmd}** does not exist or is under development!`,
                            ephemeral: true
                        })
                }
            break;

            default: 
                await interaction.reply({
                    content: `The group **${group}** does not exist or is under development!`,
                    ephemeral: true
                })
            break;
        }
    }
}


async function fun(endpoint, interaction, image1, image2) {
    try {
        
        function images(x, i) {
            x.toString();
            i.toString();
            
            if (x && i){
                if (x.endsWith('.webp')) x.replace('.webp', '.png');
                if (i.endsWith('.webp')) i.replace('.webp', '.png');

                return {
                    "image:1": x,
                    "image:2": i,
                };
            } else if (x) {
                if (x.endsWith('.webp')) x.replace('.webp', '.png');

                return {
                    image: x
                };
            } else return {};
        }

        const response = getResponse(`https://api.influx.vision/canvas/fun${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`, images(image1, image2))

        if (response.status === 200) {
            const embed = new EmbedBuilder({
                color: [255, 255, 255],
                image: `${response.result}`,
            }).setTimestamp(true)

            return await interaction.reply({
                embeds: [embed]
            })
        } else if (response.staus > 200) {
            return await interaction.reply({
                content: `**${response.error}:** ${response.message}`,
                ephemeral: true
            })
        }
    } catch (error) {
        await interaction.reply({
            content: "There was an error while processing your request! Please try again later...",
            ephemeral: true
        })        
    }
    
}

async function funText(endpoint, interaction, text) {
    try {
        const response = getResponse(`https://api.influx.vision/canvas/fun${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`, { "text": text});

        if (response.status === 200) {
            const embed = new EmbedBuilder({
                color: [255, 255, 255],
                image: `${response.result}`,
            }).setTimestamp(true)

            return await interaction.reply({
                embeds: [embed]
            })
        } else if (response.staus > 200) {
            return await interaction.reply({
                content: `**${response.error}:** ${response.message}`,
                ephemeral: true
            })
        }

    } catch (error) {
        await interaction.reply({
            content: "There was an error while processing your request! Please try again later...",
            ephemeral: true
        })
    }
}

async function getResponse(url, body) {
    const response = await post(url, body, {
        "Authorization": INFLUX,
        "Accept": "application/json",
        "Content-Type": "application/json"
    });

    return response;
}