/**
 * Created by ww on 2018/8/21.
 */

const Post = require('../lib/mongo').Post;
const CommentModel = require('./comments');

module.exports = {
    create(post) {
        return Post.create(post);
    },

    getPostById(postId) {
        return Post.findOne({_id: postId})
            .populate({path: 'author', model: 'usermodels'})
    },

    getPosts(author) {
        const query = {};
        if (author) {
            query.author = author
        }
        return Post.find(query)
            .populate({path: 'author', model: 'usermodels'})
    },

    incPv(postId) {
        return Post.update({_id: postId}, {$inc: {pv: 1}})
    },

    updateCommentsCount(postId, type){
        let x = type === 'add' ? 1 : -1;
        return Post.update({_id: postId}, {$inc: {commentsCount: x}});
    },

    getRawPostById(postId) {
        return Post.findOne({_id: postId})
            .populate({path: 'author', model: 'usermodels'})
    },

    updatePostById(posId, data) {
        return Post.update({_id: posId}, {$set: data})
    },

    delPostById(postId, author) {
        return Post.deleteOne({_id: postId, author: author})
            .then(res => {
                // console.log('删除文章成功：', res)
                if (res.ok && res.n > 0) {
                    return CommentModel.delCommentByPostId(postId)
                }
            })
    }
};
