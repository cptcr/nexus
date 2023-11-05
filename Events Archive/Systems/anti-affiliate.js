function containsAffiliateLink(content) {
    // Define common affiliate link patterns
    const affiliatePatterns = [
      /\/ref=/i,          // Amazon
      /&tag=/i,           // Amazon, other retailers
      /\/affiliates\//i,  // Common affiliate directory
      /\/out\//i,         // Common outbound link indicator
    ];
  
    // Check if the content contains any of the affiliate patterns
    return affiliatePatterns.some(pattern => pattern.test(content));
  }
  const {client} = require("../../../index");
  const {Events} = require("discord.js");
  const theme = require("../../../../embedConfig.json");
  //Anti Affiliate
  client.on("messageCreate", async (message) => {
    const {content} = message;
  
    let result = containsAffiliateLink(content)
  
    if (result) {
      await message.delete()
      const msg = await message.channel.send({
        conent: `<@${message.user.id}> affiliate links would not be tolerated!`
      })
  
      setTimeout(() => {msg.delete()}, 60000)
    }
  })
  
  client.on("messageUpdate", async (newMessage) => {
    const {content} = newMessage;
  
    let result = containsAffiliateLink(content)
  
    if (result) {
      await message.delete()
      const msg = await message.channel.send({
        conent: `<@${message.user.id}> affiliate links would not be tolerated!`
      })
  
      setTimeout(() => {msg.delete()}, 60000)
    }
  })