const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, 'data');

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

const createFilePath = (modelName) => path.join(dataPath, `${modelName}.json`);

const createFileIfNotExists = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    await fs.promises.writeFile(filePath, JSON.stringify([]));
  }
};

const readFile = async (filePath) => {
  const fileContent = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

const writeFile = async (filePath, data) => {
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
};

class LocalDatabase {
  constructor(modelName, schema) {
    this.modelName = modelName;
    this.schema = schema;
    this.filePath = createFilePath(modelName);
    createFileIfNotExists(this.filePath);
  }

  async insert(document) {
    document._id = uuidv4();
    const data = await readFile(this.filePath);
    data.push(document);
    await writeFile(this.filePath, data);
    return document;
  }

  async find(query = {}) {
    const data = await readFile(this.filePath);
    return data.filter((doc) =>
      Object.keys(query).every((key) => doc[key] === query[key])
    );
  }

  async findOne(query = {}) {
    const data = await readFile(this.filePath);
    return data.find((doc) =>
      Object.keys(query).every((key) => doc[key] === query[key])
    );
  }

  async update(query, updates) {
    const data = await readFile(this.filePath);
    const updatedDocs = [];
    const updatedData = data.map((doc) => {
      if (Object.keys(query).every((key) => doc[key] === query[key])) {
        updatedDocs.push({ ...doc, ...updates });
        return { ...doc, ...updates };
      }
      return doc;
    });
    await writeFile(this.filePath, updatedData);
    return updatedDocs;
  }

  async delete(query) {
    const data = await readFile(this.filePath);
    const filteredData = data.filter((doc) =>
      !Object.keys(query).every((key) => doc[key] === query[key])
    );
    await writeFile(this.filePath, filteredData);
    return data.length !== filteredData.length;
  }
}

module.exports = LocalDatabase;
