/**
 * Created by ww on 2018/8/20.
 */

const User = require('../lib/mongo').User;

module.exports = {
   create(user) {
       return User.create(user);
   },
    getUserByName(name) {
       return User.findOne({name: name})
    }
};