module.exports = async (client) => {
    client.on('messageCreate', async message => {
    if (message.content.startsWith("!postRules")) {
      const rulesEmbed = new EmbedBuilder()
          .setTitle("Rules")
          .setDescription("Please read our rules!")
          .setColor("Blurple")
          .addFields(
          {name: "Rule 1 [Respect]", value: "Treat all members with respect. Harassment, hate speech, or discriminatory behavior will result in severe penalties.", inline: false},
          {name: "Rule 2 [Profile Content]", value: "Keep your profile clean from offensive, inappropriate, or explicit content, including usernames, avatars, and statuses.", inline: false},
          {name: "Rule 3 [Impersonation]", value: "Impersonation of members, staff, or any individual is strictly prohibited and can result in immediate bans.", inline: false},
      
          // Communication
          {name: "Rule 4 [Spamming]", value: "Avoid spamming in any form. This includes excessive messaging, emote use, or command misuse.", inline: false},
          {name: "Rule 5 [Links and Media]", value: "Do not share harmful links, unauthorized invites, or inappropriate media. This will be met with strict action.", inline: false},
          {name: "Rule 6 [Sensitive Content]", value: "Sensitive discussions should be limited to designated areas and handled respectfully to avoid disputes.", inline: false},
      
          // Advertising and Self-Promotion
          {name: "Rule 7 [Self Advertising]", value: "Unauthorized advertising or self-promotion is forbidden. This includes direct messaging members without consent.", inline: false},
      
          // Server Participation
          {name: "Rule 8 [Joining this Server]", value: "Joining and participating in this server means you agree to follow all rules. Non-compliance may lead to penalties.", inline: false},
          {name: "Rule 9 [Staff Pings]", value: "Only ping staff for valid reasons. Misuse of this feature is not tolerated and may result in disciplinary action.", inline: false},
          {name: "Rule 10 [Mini-Modding]", value: "Do not act as a moderator. Report rule violations to the staff using the proper channels.", inline: false},
      
          // Hosting and Server Use
          {name: "Rule 11 [Hosting Software]", value: "Use our hosting software responsibly. Any misuse, such as deploying malicious code, will lead to immediate suspension.", inline: false},
          {name: "Rule 12 [Using Our Servers]", value: "The servers provided should be used as intended. Any form of abuse or unauthorized use will result in service revocation.", inline: false},
          
          // Information Security
          {name: "Rule 13 [Code Sharing]", value: "Do not share dangerous or copyrighted code. Always respect intellectual property rights and ensure software safety.", inline: false},
          {name: "Rule 14 [Sharing Sensitive Information]", value: "Keep personal and sensitive information secure. Do not share such information without explicit consent.", inline: false},
      
          // Support and Requests
          {name: "Rule 15 [Support Tickets]", value: "Open support tickets only for valid issues. Non-essential tickets waste resources and may lead to restrictions.", inline: false},
          {name: "Rule 16 [Tickets and Bot Requests]", value: "For bot purchases, open a BOT REQUEST TICKET. Ensure you have a legitimate need before opening any ticket.", inline: false},
      
          // Compliance and Enforcement
          {name: "Rule 17 [Moderation Actions]", value: "Violations of these rules may result in warnings, mutes, kicks, or bans depending on the severity of the offense.", inline: false},
          {name: "Rule 18 [Acceptance of Terms]", value: "By using NEXUS services and this server, you accept our [Terms of Service](https://tos.toowake.repl.co) and [Privacy Policy](https://privacy-policy.toowake.repl.co).", inline: false}
          )
          .setImage("https://us-east-1.tixte.net/uploads/toowake.bot.style/DALL%C2%B7E_2024-04-23_03.01.54_-_A_graphic_image_with_a_very_large_white_text_'RULES'_centered_on_a_black_background._The_text_shoul.webp");
      await message.channel.send({ embeds: [rulesEmbed] });
    }
  });
}