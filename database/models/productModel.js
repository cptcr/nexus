const productSchema = require('../schemas/productSchema');
const Model = require('./modelTemplate');

class ProductModel extends Model {
  constructor() {
    super('Product', productSchema);
  }
}

module.exports = new ProductModel();