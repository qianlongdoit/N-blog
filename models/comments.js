/**
 * Created by ww on 2018/8/21.
 */

const Comment = require('../lib/mongo').Comment;

module.exports = {
   create(comment) {
       return Comment.create(comment);
   },

    // 通过留言 id 获取一个留言
    getCommentById(commentId) {
       return Comment.findOne({_id: commentId})
    },

    // 通过留言 id 删除一个留言
    delCommentById(commentId) {
       return Comment.deleteOne({_id : commentId})
    },

    // 通过文章 id 删除该文章下所有留言
    delCommentByPostId(postId) {
       return Comment.deleteMany({postId: postId})
    },

    // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
    getComments(postId) {
       return Comment.find({postId: postId})
           .populate({path: 'author', model: 'usermodels'})
           .sort({_id: 1})
    },

    // 通过文章 id 获取该文章下留言数
    getCommentCount(postId) {
       return Comment.count({postId: postId})
    },

    // 通过文章 id 更新留言数
};
