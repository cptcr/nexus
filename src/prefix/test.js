module.exports = {
  data: {
    name: "test",
  },

  async reply(message) {
    await message.reply("test");
  },
};
