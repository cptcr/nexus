const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);

module.exports = async (client) => {
  
    //Guild Update
    client.on(Events.GuildUpdate, async (oldGuild, newGuild) => {
        //Old Stuff
        const oldName = oldGuild.name;
        const oldDesc = oldGuild.description;
        const oldBanner = oldGuild.bannerURL();
        const oldIcon = oldGuild.iconURL();
      
        //New Stuff
        const newName = newGuild.name;
        const newDesc = newGuild.description;
        const newBanner = newGuild.bannerURL();
        const newIcon = newGuild.iconURL();
      
        
        const data = await Audit_Log.findOne({
          Guild: newGuild.id
        })
        let logID;
        if (data) {
          logID = data.Channel
        } else {
          return;
        }
      
        var icon;
        var name;
        var banner;
        var desc;
      
        if (oldIcon !== newIcon) {
          icon = {
            name: "Icon:",
            value: `Old Icon: ${oldIcon} \nNew Icon: ${newIcon}`,
            inline: false,
          }
        } else {
          icon = {
            name: "Icon:",
            value: "No icon changes have been made"
          }
        }
      
        if (oldName !== newName) {
          name = {
            name: "Name:",
            value: `Old name: ${oldName}\nNew Name: ${newName}`,
            inline: false
          }
        } else {
          name = {
            name: "Name:",
            value:"No name changes have been made"
          }
        }
        
        const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
        const auditChannel = client.channels.cache.get(logID);
      
        if (newBanner !== oldBanner) {
          auditEmbed.setImage(newBanner)
      
          banner = {
            name: "Banner:",
            value: `[Old Banner](${oldBanner}) \n[New Banner](${newBanner})`,
            inline: false
          }
        } else {
          banner = {
            name: "Banner:",
            value: `No banner changes have been made`,
            inline: false
          }
        }
      
        if (oldDesc !== newDesc) {
          desc = {
            name: "Description:",
            value: `Old: ${oldDesc} \nNew: ${newDesc}`,
            inline: false
          }
        } else {
          desc = {
            name: "Description:",
            value: `No description changes have been made`,
            inline: false
          }
        }
      
        auditEmbed.addFields(
          icon,
          name,
          banner,
          desc
        )
      
        await auditChannel.send({
          embeds: [auditEmbed]
        })
    })

}