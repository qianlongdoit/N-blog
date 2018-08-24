/**
 * Created by admin on 2018/8/19.
 */

const express = require('express');
const router = express.Router();

const CommentModel = require('../models/comments');
const PostMode = require('../models/posts');
const checkLogin = require('../middleware/check').checkLoginIn;

// POST /comments 创建一条留言
router.post('/', checkLogin, function (req, res, next) {
    const author = req.session.user._id;
    const postId = req.fields.postId;
    const content = req.fields.content;

    // 校验参数
    try {
        if (!content.length) {
            throw new Error('请填写留言内容')
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back')
    }

    const comment = {
        author: author,
        postId: postId,
        content: content
    };

    Promise.all([
        CommentModel.create(comment),
        PostMode.updateCommentsCount(postId, 'add')
    ])
        .then(() => {
            req.flash('success', '留言成功');
            res.redirect('back')
        })
        .catch(next);
});

router.get('/:commentId/remove', checkLogin, function (req, res, next) {
    const commentId = req.params.commentId;
    const postId = req.query.postId;
    const author = req.session.user._id;

    CommentModel.getCommentById(commentId)
        .then(comment => {
            if (!comment) {
                throw new Error('留言不存在')
            }
            if (comment.author.toString() !== author.toString()) {
                throw new Error('没有权限删除留言')
            }

            Promise.all([
                CommentModel.delCommentById(commentId),
                PostMode.updateCommentsCount(postId, 'minus')
            ])
                .then(() => {
                    req.flash('success', '删除留言成功');
                    res.redirect('back')
                })
                .catch(next);
        })
        .catch(next)
});


module.exports = router;