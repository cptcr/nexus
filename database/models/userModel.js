const userSchema = require('../schemas/userSchema');
const Model = require('./modelTemplate');

class UserModel extends Model {
  constructor() {
    super('User', userSchema);
  }
}

module.exports = new UserModel();
