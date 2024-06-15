# Creating and Managing Mongoose Schemas

## Introduction
Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Schemas in Mongoose define the structure of the data to be stored in MongoDB, including the types of fields, possible validation requirements, and default values.

## Directory Structure
To manage schemas effectively, especially in larger projects, it's beneficial to create them inside a dedicated directory. Here, we'll use a directory named `Schemas.js` which might be misleading as it suggests a JavaScript file. Instead, it's better to use a directory name like `schemas` or `models` to store your schema files.

### Creating Subfolders
You can organize schemas into subfolders within the `schemas` directory based on their context or usage within your application, such as `users`, `products`, etc. This helps in maintaining a clean and manageable codebase.

## Example Schema with All Mongoose Types
Here is how you can create a comprehensive Mongoose schema using various data types that Mongoose supports. This example includes common field types and how to define them in a schema.

```javascript
// Importing Mongoose schema and model
const { model, Schema } = require("mongoose");

// Create a new Mongoose schema
let customSchema = new Schema({
    // String type
    name: { type: String, required: true },
    // Number type
    age: Number,
    // Boolean type
    isActive: Boolean,
    // Array type
    tags: [String],
    // Mixed type
    any: Schema.Types.Mixed,
    // ObjectId type (typically used for relationships)
    userId: Schema.Types.ObjectId,
    // Date type
    createdAt: { type: Date, default: Date.now },
    // Decimal128 type (for high precision decimals)
    price: Schema.Types.Decimal128,
    // Map type (an arbitrary map of key-value pairs)
    features: {
        type: Map,
        of: String  // Each value in the map is a String
    },
    // Buffer type (for storing binary data)
    file: Buffer,
    // Embedded document type using another schema
    address: new Schema({
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String
    }),
    // Enum type (for fields that should only allow values from a predefined set)
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator']
    }
});

// Export the model, named according to the schema
module.exports = model("CustomModel", customSchema);
```

## Using the internal database
Tutorial not out yet