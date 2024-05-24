const { Schema, model, Types } = require('mongoose');

let chatbotmodel = new Schema({ 
    Model: String,
});

module.exports = model('chatbotmodel', chatbotmodel);
