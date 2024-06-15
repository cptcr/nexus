# Event Handling
To handle events we use a custom made handler like we use for the commands.

Folder Path: `./src/Event Handler/`

In that folder you can create custom sub folders with a name you'd like to use as category. In that folder you create a file calles `YOUR_FILE_NAME.js`. This is going to be the file where you handle the event.

Code example:
```js
// Import necessary components from the discord.js library
const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js'); 

// Load the theme configuration from a JSON file for styling embeds
const theme = require('../../../embedModule/config.json'); 

// Import database schema for logging audit events
const Audit_Log = require('../../Schemas.js/auditlog'); 

// Import database schema for logging different types of actions
const log_actions = require("../../Schemas.js/logactions");

// Retrieve a token using a custom function from the encryption module; '5' might be a parameter for token generation
const token = require("../../../encrypt").token(5); 

// Import a permission checking function from a utility module
const perm = require("../../../functions").perm; 

// Define the main module export where 'client' is the Discord client object
module.exports = async (client) => {

    // Set up an event listener for when a guild member is banned
    client.on(Events.GuildBanAdd, async (ban) => {

        // Execute a permission check using the banned member's ID
        perm(ban.id);

        // Fetch the last (most recent) audit log for the member ban event
        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd,
        });
        const banLog = fetchedLogs.entries.first(); // Get the first log entry

        // Determine the moderator who executed the ban, default to 'Unknown' if no log is found
        const moderator = banLog ? banLog.executor.tag : 'Unknown';
        
        // Create an embed for the audit log using settings from the theme configuration
        const auditEmbed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTitle('Member Banned')
            .setDescription(`Member: ${ban.user.tag}\nReason: ${ban.reason || 'No reason provided'}\nModerator: ${moderator}`)
            .setTimestamp()
            .setFooter({ text: 'Nexus Audit Log System' });

        // Retrieve audit log data for the guild from the database
        const data = await Audit_Log.findOne({ Guild: ban.guild.id });
        if (!data) return; // Exit if no audit log data is found

        // Fetch the Discord channel where audit logs are sent, handle errors gracefully
        const auditChannel = await client.channels.fetch(data.Channel).catch(() => null);
        if (auditAttend banChannel) {
            // Send the embed to the designated audit log channel
            await auditChannel.send({ embeds: [auditEmbed] }).catch(() => {});
        }

        // Log the ban action in a separate database collection for audit purposes
        await log_actions.create({
            Moderator: moderator,
            Action: "BAN_MEMBER",
            Guild: ban.guild.id,
            Reason: ban.reason || 'No reason provided',
            ID: token
        });
    });
};
```