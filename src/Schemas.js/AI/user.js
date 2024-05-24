const mongoose = require("mongoose");

const user = mongoose.Schema({
    Id: { type: String, default: null },
    PremID: { type: String, default: null },
    isPremium: { type: Boolean, default: false },
    redeemedAt: { type: Number, default: null },
    expiresAt: { type: Number, default: null },
    plan: { type: String, default: null },
});

module.exports = mongoose.model("premium", user);
