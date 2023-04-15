var express = require('express');
var router = express.Router();
const admin = require('../dao/admin_dao')
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('admin进入路由根目录');
});
router.get('/getUsersByTypeAndChar', function (req, res, next) {
    admin.getUsersByTypeAndChar(req, res)
});
router.post('/announce', function (req, resp, next) {
    admin.announce(req, resp)
})
router.get('/getAllNotice', function (req, resp, next) {
    admin.getAllNotice(req, resp)
})
/**
 * 获取该老师所属班级的全部请假单与数量(分页查询)
 */
router.get('/getLeave', function (req, res, next) {
    admin.getLeave(req, res)
});
/**
 *  获取该用户请假审批与数量(分页)
 */
router.get('/getuserLeave', function (req, res, next) {
    admin.getuserLeave(req, res)
});
/**
 *  当前请假单审批(修改审批状态)
 */
router.get('/upLeaveState', function (req, res, next) {
    admin.upLeaveState(req, res)
});
/**
 *******************增值功能:公告**************************
 */
router.get("/NoticeDetails", function (req, res) {
    admin.NoticeDetails(req, res)
})
module.exports = router;