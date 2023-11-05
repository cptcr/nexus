//new reactrole test system
const {client} = require("../../../src/index");
const {Events} = require("discord.js");
const theme = require("../../../embedConfig.json");
const roleTestSchema = require("../../../src/Schemas.js/reactRoleTest");
client.on(Events.InteractionCreate, async (i) => {
  const reactData = await roleTestSchema.findOne({ CustomID: i.customId, Guild: i.guild.id, ChannelID: i.channel.id});

  if (!reactData) {
    return;
  } else if (reactData) {
    const ROLE_ID = reactData.Role;
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
})