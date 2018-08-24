/**
 * Created by admin on 2018/8/19.
 */

const express = require('express');
const router = express.Router();

const PostModel = require('../models/posts');
const CommentModel = require('../models/comments');
const checkLogin = require('../middleware/check').checkLoginIn;


// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
    const author = req.query.author;

    PostModel.getPosts(author)
        .then( posts => {
            res.render('posts', {posts: posts});
        })
        .catch(next)
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
    res.render('create')
});

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
    const author = req.session.user._id;
    const title = req.fields.title;
    const content = req.fields.content;

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题')
        }
        if (!content.length) {
            throw new Error('请填写内容')
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back')
    }

    let post = {
        author: author,
        title: title,
        content: content
    };

    PostModel.create(post)
        .then( result => {
            req.flash('success', '发表成功');
            // console.log('result: ', result)
            res.redirect(`/posts/${result._id}`)
        })
        .catch(next)
});

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
    const postId = req.params.postId;

    Promise.all([
        PostModel.getPostById(postId),
        CommentModel.getComments(postId),
        PostModel.incPv(postId)
    ])
        .then( result => {
            if (!result[0]) {
                return res.render('404');
            }
            res.render('post', {post: result[0], comments: result[1]})
        })
        .catch(next)
});

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
    const postId = req.params.postId;
    const author = req.session.user._id;

    PostModel.getRawPostById(postId)
        .then(post => {
            if (!post) {
                throw new Error('该文章不存在')
            }
            if (author.toString() !== post.author._id.toString()) {
                throw new Error('权限不足')
            }

            res.render('edit', {post: post})
        })
        .catch(next)
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
    const postId = req.params.postId;
    const author = req.session.user._id;
    const title = req.fields.title;
    const content = req.fields.content;

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题')
        }
        if (!content.length) {
            throw new Error('请填写内容')
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back')
    }

    PostModel.getRawPostById(postId)
        .then(post => {
            if (!post) {
                throw new Error('文章不存在')
            }
            if (post.author._id.toString() !== author.toString()) {
                throw new Error('没有权限')
            }

            PostModel.updatePostById(postId, {title: title, content: content})
                .then(() => {
                    req.flash('success', '修改成功');
                    res.redirect(`/posts/${postId}`);
                })
        })
        .catch(next)
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
    const postId = req.params.postId;
    const author = req.session.user._id;

    PostModel.getRawPostById(postId)
        .then(post => {
            if (!post) {
                throw new Error('文章不存在')
            }
            if (post.author._id.toString() !== author.toString()) {
                throw new Error('没有权限')
            }

            PostModel.delPostById(postId, author)
                .then(() => {
                    req.flash('success', '删除文章成功');
                    res.redirect('back');
                })
        })
        .catch(next)
});

module.exports = router;