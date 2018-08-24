/**
 * Created by admin on 2018/8/17.
 */

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.redirect('/posts')
    });

    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/posts', require('./posts'));
    app.use('/comments', require('./comments'));

    app.use(function (req, res) {
        if (!res.headersSent) {
            res.status(404).send('404')
        }
    })
};