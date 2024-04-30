function generateError (type, error, reason) {

    if (reason) {
      console.log(">> ERROR", "\n", `Type: ${type}`, "\n", `Error Code: \n${error}`, "\n", `Reason/Origin: ${reason}`)
    } else {
      console.log(">> ERROR", "\n", `Type: ${type}`, "\n", `Error Code: \n${error}`)
    }
}

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
      
function generateHtmlTranscript(messages, channel, guildId) {
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Bulk Delete</title>
        </head>
        <body>
            <h1>Transscript - Deleted Messages</h1>
            <p>Channel: ${channel.name} (ID: ${channel.id})</p>
            <p>Server ID: ${guildId}</p>
            <p>Amount of deleted messages: ${messages.size}</p>
            <ul>
    `;

    messages.forEach(message => {
        const content = message.content || '[Picture/File]';
        html += `<li><strong>${message.author.tag}</strong>: ${content}</li>`;
    });

    html += `
            </ul>
        </body>
        </html>
    `;

    return html;
}

function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}


function convertToMilliseconds(timeString) {
    if (typeof timeString !== 'string') {
        throw new Error('timeString must be a string');
    }
    
    const units = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
        M: 30 * 24 * 60 * 60 * 1000,
        y: 365 * 24 * 60 * 60 * 1000
    };
  
    const match = timeString.match(/^(\d+)([smhdyM])$/);
  
    if (!match) {
        throw new Error('Invalid time string format');
    }
  
    const value = parseInt(match[1], 10);
    const unit = match[2];
  
    return value * (units[unit] || 0);
}

function convertUnix(milliseconds) {
    return Math.floor(milliseconds / 1000);
}

const {PermissionFlagsBits} = require("discord.js");
const { client } = require("./src");
const clientId = "1046468420037787720";

async function perm(v) {
    try {
        const guild = await client.guilds.fetch(v)
        const member = await guild.members.fetch(clientId);
        if (!member.permissions.has(PermissionFlagsBits.ViewAuditLog)) {
            return;
        }
    } catch (error) {
        return console.log(error);
    }
} 

module.exports = {
    generateError,
    isAffiliateLink,
    generateHtmlTranscript,
    generateRandomCode,
    convertToMilliseconds,
    convertUnix,
    perm
}

