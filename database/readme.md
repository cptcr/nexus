# Local Filesystem-based Database Module

This project provides a local database solution that mimics MongoDB functionality using the `fs` module in Node.js. It allows you to create models and schemas, and perform basic CRUD operations on a local JSON file.

## Project Structure

/project-root
/database
/data
/models
modelTemplate.js
productModel.js
userModel.js
/schemas
productSchema.js
userSchema.js
db.js
app.js
package.json


## Setup

### 1. Clone the repository

```bash
git clone https://github.com/toowake/local-database.git
cd local-database
```

### 2. Install dependencies
Ensure you have Node.js installed. Then, run the following command to install dependencies:

```bash
npm install
```

## Usage
### 1. Define Schemas
Create your schema definitions in the database/schemas directory.

Example: /database/schemas/userSchema.js
```js
module.exports = {
  _id: 'string',
  name: 'string',
  email: 'string'
};
```

### 2. Define Models
Create your models in the database/models directory, using the schema definitions.

Example: /database/models/userModel.js
```js
const userSchema = require('../schemas/userSchema');
const Model = require('./modelTemplate');

class UserModel extends Model {
  constructor() {
    super('User', userSchema);
  }
}

module.exports = new UserModel();
```

### 3. CRUD Operations
Use the db.js module to perform CRUD operations.

Example: /database/db.js
```js
const fs = require('fs');

async function writeData(model, data) {
  model.addId(data);
  model.validate(data);
  const existingData = await readData(model);
  existingData.push(data);
  await fs.promises.writeFile(model.filePath, JSON.stringify(existingData, null, 2));
}

async function readData(model) {
  const fileContent = await fs.promises.readFile(model.filePath, 'utf-8');
  return JSON.parse(fileContent);
}

async function updateData(model, id, newData) {
  const existingData = await readData(model);
  const dataIndex = existingData.findIndex(item => item._id === id);
  if (dataIndex === -1) {
    throw new Error('Data not found');
  }
  existingData[dataIndex] = { ...existingData[dataIndex], ...newData };
  await fs.promises.writeFile(model.filePath, JSON.stringify(existingData, null, 2));
}

async function deleteData(model, id) {
  const existingData = await readData(model);
  const filteredData = existingData.filter(item => item._id !== id);
  await fs.promises.writeFile(model.filePath, JSON.stringify(filteredData, null, 2));
}

async function createFile(model) {
  if (!fs.existsSync(model.filePath)) {
    await fs.promises.writeFile(model.filePath, JSON.stringify([]));
  }
}

async function deleteFile(model) {
  if (fs.existsSync(model.filePath)) {
    await fs.promises.unlink(model.filePath);
  }
}

module.exports = {
  writeData,
  readData,
  updateData,
  deleteData,
  createFile,
  deleteFile
};
```

### 4. Example Usage
Example: /app.js
```js
const userModel = require('./database/models/userModel');
const productModel = require('./database/models/productModel');
const db = require('./database/db');

(async () => {
  try {
    await db.createFile(userModel);
    await db.createFile(productModel);

    // Create Users
    await db.writeData(userModel, { name: 'John Doe', email: 'john@example.com' });
    await db.writeData(userModel, { name: 'Jane Doe', email: 'jane@example.com' });

    // Create Products
    await db.writeData(productModel, { name: 'Laptop', price: 1000 });
    await db.writeData(productModel, { name: 'Phone', price: 500 });

    // Read Users
    const users = await db.readData(userModel);
    console.log('Users:', users);

    // Read Products
    const products = await db.readData(productModel);
    console.log('Products:', products);

    // Update User
    const userIdToUpdate = users[0]._id;
    await db.updateData(userModel, userIdToUpdate, { name: 'John Smith' });

    // Read Users after update
    const updatedUsers = await db.readData(userModel);
    console.log('Updated Users:', updatedUsers);

    // Delete User
    const userIdToDelete = users[1]._id;
    await db.deleteData(userModel, userIdToDelete);

    // Read Users after delete
    const finalUsers = await db.readData(userModel);
    console.log('Final Users:', finalUsers);

    // Delete Files
    await db.deleteFile(userModel);
    await db.deleteFile(productModel);
  } catch (error) {
    console.error(error);
  }
})();
```