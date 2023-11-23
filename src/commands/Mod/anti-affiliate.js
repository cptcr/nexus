const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("affiliate-check")
    .setDescription("Check if a Link is affiliate")
    .addStringOption(option => option
        .setName("url")
        .setDescription("The URL")
        .setRequired(true)
    ),

    async execute (interaction) {
        var URL = interaction.options.getString("url");

        function isAffiliateLink(url) {
            var affiliateParams = ['ref', 'affiliate', 'tag', 'tracking'];
            for (var i = 0; i < affiliateParams.length; i++) {
              if (url.indexOf(affiliateParams[i] + '=') !== -1) {
                return true;
              }
            }
            if (
              url.indexOf('://amzn.to/') !== -1 ||  
              url.indexOf('://rstyle.me/') !== -1 ||
              url.indexOf('://go.redirectingat.com/') !== -1 
            ) {
              return true;
            }
            return false;
          }
          
          const result  = isAffiliateLink(URL);
          
          let yn = " ";

          if (result === true) {
            yn = "Affilite detected!"
          } else {
            yn = "Clear"
          }

          const embed = new EmbedBuilder()
          .setTitle("Affiliate Link check")
          .addFields(
            {name: "URL:", value: `${URL}`, inline: false},
            {name: "Affiliate:", value: `${result}`, inline: false},
          )
          .setColor(theme.theme)
          .setTimestamp()
          .setAuthor({ name: "Affiliate Check"})
          .setFooter({ text: `${yn}` })

          return await interaction.reply({ embeds: [embed], ephemeral: true});
          
    }
}