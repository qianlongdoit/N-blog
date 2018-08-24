/**
 * Created by ww on 2018/8/20.
 */

const mongoose = require('mongoose');
const config = require('config-lite')(__dirname);

mongoose.connect(config.mongodb, {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('has connect')
});


let userSchema = new mongoose.Schema({
    name: {type: 'string', required: true, index: true, unique: true},
    password: {type: 'string', required: true},
    avatar: {type: 'string', required: true},
    gender: {type: 'string', enum: ['m', 'f', 'x'], default: 'x'},
    bio: {type: 'string'}
});
exports.User = mongoose.model('usermodels', userSchema);


let postSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: {type: 'string', required: true},
    content: {type: 'string', required: true},
    pv: {type: 'number', default: 0},
    commentsCount: {type: 'number', default: 0}
});
exports.Post = mongoose.model('postSchema', postSchema);


let comment = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, required: true},
    content: {type: 'string', required: true},
    postId: {type: mongoose.Schema.Types.ObjectId, required: true}
});
exports.Comment = mongoose.model('comments', comment);
