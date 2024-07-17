```js
// app.js
const userModel = require('./models/userModel');
const productModel = require('./models/productModel');
const db = require('./db');

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