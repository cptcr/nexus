const { EmbedBuilder, Events } = require('discord.js')
const reactSchema = require("../../Schemas.js/reactionrole");

module.exports = async (client) => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.customId === "reactionrole") {
            const {message, guild, channel, member} = interaction;
            const guildx = guild.id;
            const messagex = message.id;
            const reactchannel = channel.id;
    
            const reactData = await reactSchema.findOne({
                Guild: guildx,
                Message: messagex,
                Channel: reactchannel
            })
    
            if (!reactData) {
                return;
            } else if (reactData) {
                //Role ID
                const ROLE_ID = reactData.Role;
                //try add/remove role
                try {
                    const role = guild.roles.cache.get(ROLE_ID);
                    if (!role) {
                      interaction.reply({
                        content: 'Role not found.',
                        ephemeral: true
                      });
                    }
                    if (member.roles.cache.has(ROLE_ID)) {
                        member.roles.remove(role).catch(err => {return;});
                      interaction.reply({
                        content: `Removed the role ${role} from ${member}.`,
                        ephemeral: true
                      });
                    } else {
                      await member.roles.add(role).catch(err => {return;});
                      interaction.reply({
                        content: `Added the role ${role} to ${member}.`,
                        ephemeral: true
                      });
                    }
                  } catch (error) {
                    return;
                }
            }
        }
    });
}