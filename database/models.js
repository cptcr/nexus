class Model {
    constructor(name, schema) {
      this.name = name;
      this.schema = schema;
      this.filePath = `./data/${name}.json`;
  
      // Initialize the data file
      if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
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
      }
      return true;
    }
}
  
module.exports = Model;
  