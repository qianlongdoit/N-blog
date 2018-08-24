/**
 * Created by admin on 2018/8/19.
 */

const express = require('express');
const router = express.Router();

const checkLogin = require('../middleware/check').checkLoginIn;

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
    req.session.user = null;
    req.flash('success', '登出成功');

    res.redirect('/posts')
});

module.exports = router;