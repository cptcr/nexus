const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class Model {
  constructor(name, schema) {
    this.name = name;
    this.schema = schema;
    this.filePath = `./database/data/${name}.json`;

    // Initialize the data file
    if (!fs.existsSync('./database/data')) {
      fs.mkdirSync('./database/data', { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  validate(data) {
    for (let key of Object.keys(this.schema)) {
      if (!data.hasOwnProperty(key)) {
        throw new Error(`Missing required field: ${key}`);
      }
      if (typeof data[key] !== this.schema[key]) {
        throw new Error(`Expected ${key} to be of type ${this.schema[key]}`);
      }
    }
    return true;
  }

  addId(data) {
    if (!data._id) {
      data._id = uuidv4();
    }
    return data;
  }
}

module.exports = Model;
