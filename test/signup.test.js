/**
 * Created by admin on 2018/8/21.
 */

const path = require('path');
const assert = require('assert');
const request = require('supertest');

const app = require('../index');
const User = require('../lib/mongo').User;

const testName1 = '地方';
const testName2 = '十大';

describe('signup', function () {
    describe('Post/signup', function () {
        const agent = request.agent(app);
        /*beforeEach(done => {
            //  注册用户
            User.create({
                name: testName1,
                password: '123456',
                avatar: '',
                gender: 'f',
                bio: '滴滴滴'
            })
                .then(() => {
                    done()
                })
                .catch(done)
        });

        afterEach(done => {
            //  删除测试用户
            User.deleteMany({name: {$in: [testName1, testName2]}})
                .then(() => {
                    done()
                })
                .catch(done)
        });

        after(done => {
            process.exit()
        });

        // 用户名错误的情况
        it('wrong name', done => {
            agent.post('/signup')
                .type('form')
                .field({name: ''})
                .attach('avatar', path.join(__dirname, 'avatar.png'))
                .redirects()
                .end((err, res) => {
                    if (err) return done(err);
                    assert(res.text.match(/名字请限制在 1-10 个字符/));
                    done()
                })
        })*/


        // after(done => {
        //     User.deleteMany({name: {$in: [testName1, testName2]}})
        // });

        it('rediret', done => {
            agent.post('/signup')
                .end((err, res) => {
                    if (err) return done(err);
                    assert(res.text.match(/Redirecting/));
                    done()
                });
        });

        it('wrong name', function (done) {
            agent.post('/signup')
                .type('form')
                .field({name: ''})
                .attach('avatar', path.join(__dirname, 'img/avatar.png'))
                .redirects()
                .end(function (err, res) {
                    if (err) return done(err);
                    assert(res.text.match(/名字请限制在 1-10 个字符/));
                    done()
                })
        });

        it('wrong gender', function (done) {
            agent.post('/signup')
                .type('form')
                .field({name: testName1, gender: 'a'})
                .attach('avatar', path.join(__dirname, 'img/avatar.png'))
                .redirects()
                .end(function (err, res) {
                    if (err) return done(err);
                    assert(res.text.match(/性别只能是 m、f 或 x/));
                    done()
                })
        });

        it('wrong bio', function (done) {
            agent.post('/signup')
                .type('form')
                .field({name: testName1, gender: 'm', bio: ''})
                .attach('avatar', path.join(__dirname, 'img/avatar.png'))
                .redirects()
                .end(function (err, res) {
                    if (err) return done(err);
                    assert(res.text.match(/个人简介请限制在 1-30 个字符/));
                    done()
                })
        });

        it('wrong avatar', function (done) {
            agent.post('/signup')
                .type('form')
                .field({name: testName1, gender: 'm', bio: '个人简介'})
                .redirects()
                .end(function (err, res) {
                    if (err) return done(err);
                    assert(res.text.match(/缺少头像/));
                    done()
                })
        });

        it('wrong password', function (done) {
            agent.post('/signup')
                .type('form')
                .field({name: testName1, gender: 'm', bio: '个人简介', password: '12345'})
                .attach('avatar', path.join(__dirname, 'img/avatar.png'))
                .redirects()
                .end(function (err, res) {
                    if (err) return done(err);
                    assert(res.text.match(/密码至少 6 个字符/));
                    done()
                })
        });

        it('wrong repassword', function (done) {
            agent.post('/signup')
                .type('form')
                .field({name: testName1, gender: 'm', bio: '个人简介', password: '123456', repassword: '12346'})
                .attach('avatar', path.join(__dirname, 'img/avatar.png'))
                .redirects()
                .end(function (err, res) {
                    if (err) return done(err);
                    assert(res.text.match(/两次输入密码不一致/));
                    done()
                })
        });

        //  异步测试时间长
        it('should duplicate name', function (done) {
            agent.post('/signup')
                .type('form')
                .field({name: testName1, gender: 'm', bio: '个人简介', password: '123456', repassword: '123456'})
                .attach('avatar', path.join(__dirname, 'img/avatar.png'))
                .redirects()
                .end((err, res) => {
                    if (err) return done(err);
                    console.log(res.text)
                    assert(res.text.match(/用户名已被占用/));
                    done()
                })
        });
    })
});