//reminder
const remindSchema = require("../../../Schemas.js/remindSchema");
const {client} = require("../../../index");
const {Events} = require("discord.js");
const theme = require("../../../../embedConfig.json");
setInterval(async () => {

    const reminders = await remindSchema.find();
    if(!reminders) return;
    else {
        reminders.forEach(async reminder => {


            if (reminder.Time > Date.now()) return;
            
            const user = await client.users.fetch(reminder.User);

            user.send({
                content: `${user}, you asked me to remind you about: \`${reminder.Remind}\``
            }).catch(err => {
                return;
            });

            await remindSchema.deleteMany({
                Time: reminder.Time,
                User: user.id,
                Remind: reminder.Remind
            });
        })
    }
}, 1000 * 5);