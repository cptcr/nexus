const { model , Schema } = require("mongoose");

let schema = new Schema({
    Type: String,
});

module.exports = model("maintenance_schema", schema)