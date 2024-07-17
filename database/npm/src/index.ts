import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';

interface Schema {
  [key: string]: string;
}

interface Document {
  _id?: string;
  [key: string]: any;
}

const createFilePath = (folderPath: string, modelName: string): string => path.join(folderPath, `${modelName}.json`);

const createFileIfNotExists = async (filePath: string): Promise<void> => {
  if (!fs.existsSync(filePath)) {
    await fs.promises.writeFile(filePath, JSON.stringify([]));
  }
};

const readFile = async (filePath: string): Promise<any[]> => {
  const fileContent = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

const writeFile = async (filePath: string, data: any[]): Promise<void> => {
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
};

class LocalDatabase {
  private modelName: string;
  private schema: Schema;
  private filePath: string;

  constructor(modelName: string, schema: Schema, folderPath: string = './src/data') {
    this.modelName = modelName;
    this.schema = schema;
    this.filePath = createFilePath(folderPath, modelName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    createFileIfNotExists(this.filePath);
  }

  private generateUUID(): string {
    return createHash('sha1').update(`${Date.now()}${Math.random()}`).digest('hex');
  }

  private validateSchema(document: Document): boolean {
    for (const key in this.schema) {
      if (typeof document[key] !== this.schema[key]) {
        throw new Error(`Invalid type for ${key}. Expected ${this.schema[key]}, but got ${typeof document[key]}`);
      }
    }
    return true;
  }

  async insert(document: Document): Promise<Document> {
    this.validateSchema(document);
    document._id = this.generateUUID();
    const data = await readFile(this.filePath);
    data.push(document);
    await writeFile(this.filePath, data);
    return document;
  }

  async find(query: Partial<Document> = {}): Promise<Document[]> {
    const data = await readFile(this.filePath);
    return data.filter((doc) =>
      Object.keys(query).every((key) => doc[key] === query[key])
    );
  }

  async findOne(query: Partial<Document> = {}): Promise<Document | undefined> {
    const data = await readFile(this.filePath);
    return data.find((doc) =>
      Object.keys(query).every((key) => doc[key] === query[key])
    );
  }

  async update(query: Partial<Document>, updates: Partial<Document>): Promise<Document[]> {
    const data = await readFile(this.filePath);
    const updatedDocs: Document[] = [];
    const updatedData = data.map((doc) => {
      if (Object.keys(query).every((key) => doc[key] === query[key])) {
        const updatedDoc = { ...doc, ...updates };
        this.validateSchema(updatedDoc);
        updatedDocs.push(updatedDoc);
        return updatedDoc;
      }
      return doc;
    });
    await writeFile(this.filePath, updatedData);
    return updatedDocs;
  }

  async delete(query: Partial<Document>): Promise<boolean> {
    const data = await readFile(this.filePath);
    const filteredData = data.filter((doc) =>
      !Object.keys(query).every((key) => doc[key] === query[key])
    );
    await writeFile(this.filePath, filteredData);
    return data.length !== filteredData.length;
  }
}

export default LocalDatabase;
