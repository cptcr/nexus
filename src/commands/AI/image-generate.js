const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    SlashCommandBuilder,
} = require('discord.js');

const REPLICATE_API_KEY = "r8_QpBn6HfIGa2hQ01oiwZVNsspPvyoBLW1mPYMZ"

const models = [
    {
      name: 'Stable Diffusion (Default)',
      value:
        'stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478',
    },
    {
      name: 'Openjourney (Midjourney style)',
      value:
        'prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb',
    },
    {
      name: 'Erlich',
      value: 'laion-ai/erlich:92fa143ccefeed01534d5d6648bd47796ef06847a6bc55c0e5c5b6975f2dcdfb',
    },
    {
      name: 'Mini DALL-E',
      value: 'kuprel/min-dalle:2af375da21c5b824a84e1c459f45b69a117ec8649c2aa974112d7cf1840fc0ce',
    },
    {
      name: 'Waifu Diffusion',
      value: 'cjwbw/waifu-diffusion:25d2f75ecda0c0bed34c806b7b70319a53a1bccad3ade1a7496524f013f48983',
    },
];
  
module.exports = {
    data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Generate an image using openai")
    .addStringOption(o => o.setName("prompt").setDescription("What do you want to generate?").setRequired(true))
    .addStringOption(o => o.setName("model").setDescription("the model you want to choose").setRequired(true).setChoices(
        {
          name: 'Stable Diffusion (Default)',
          value:
            'stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478',
        },
        {
          name: 'Openjourney (Midjourney style)',
          value:
            'prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb',
        },
        {
          name: 'Erlich',
          value: 'laion-ai/erlich:92fa143ccefeed01534d5d6648bd47796ef06847a6bc55c0e5c5b6975f2dcdfb',
        },
        {
          name: 'Mini DALL-E',
          value: 'kuprel/min-dalle:2af375da21c5b824a84e1c459f45b69a117ec8649c2aa974112d7cf1840fc0ce',
        },
        {
          name: 'Waifu Diffusion',
          value: 'cjwbw/waifu-diffusion:25d2f75ecda0c0bed34c806b7b70319a53a1bccad3ade1a7496524f013f48983',
        },)),
    async execute (interaction, client) {
      try {
        await interaction.deferReply();
  
        const { default: Replicate } = await import('replicate');
  
        const replicate = new Replicate({
          auth: REPLICATE_API_KEY,
        });
  
        const prompt = interaction.options.getString('prompt');
        const model = interaction.options.getString('model') || models[0].value;
  
        const output = await replicate.run(model, { input: { prompt } });
  
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel(`Download`)
            .setStyle(ButtonStyle.Link)
            .setURL(`${output[0]}`)
            .setEmoji('1101133529607327764')
        );
  
        const resultEmbed = new EmbedBuilder()
          .setTitle('Image Generated')
          .addFields({ name: 'Prompt', value: prompt })
          .setImage(output[0])
          .setColor('#44a3e3')
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          });
  
        await interaction.editReply({
          embeds: [resultEmbed],
          components: [row],
        });
      } catch (error) {
        const errEmbed = new EmbedBuilder()
          .setTitle('An error occurred')
          .setDescription('```' + error + '```')
          .setColor(0xe32424);
  
        interaction.editReply({ embeds: [errEmbed] });
      }
    }
};