const jwtUtil = require('../utils/jwtUtils')
module.exports = class admin_dao extends require('../model/admin_mod') {
    /**
     * 根据用户类型与查询字段模糊查询
     * @param req
     * @param resp
     * @returns {Promise<void>}
     */
    static async getUsersByTypeAndChar(req, resp) {
        let query = req.query;
        let type = query.type
        let inputText = query.inputText
        let CharType = query.CharType
        let pageNum = query.pageNum
        let currPage = query.currPage
        let data = await this.getUserByTypeAndCharMod(type, inputText, CharType, currPage, pageNum)
        let total = await this.getUserByTypeAndCharTotal(type, inputText, CharType)
        resp.send({ data, total: total[0].count })
    }

    /**
     * 发布公告
     * @param req
     * @param resp
     * @returns {Promise<void>}
     */
    static async announce(req, resp) {
        let title = req.body.title
        let classes = req.body.classes
        let results = await this.announceMod(title, classes)
        resp.send(results)
    }

    /**
    * 分页获取所有通知与数量
    * @param req
    * @param resp
    * @returns {Promise<void>}
    */
    static async getAllNotice(req, resp) {
        let pageNum = req.query.pageNum
        let currPage = req.query.currPage
        let data = await this.getAllNoticeMod(pageNum, currPage)
        let total = await this.getAllNoticeTotal()
        resp.send({ data, total: total[0].count })
    }
    /**
     * 取该老师所属班级的全部请假单与数量(分页查询)
     * @param req
     * @param resp
     * @returns {Promise<void>}
     */
    static async getLeave(req, resp) {
        let verify = await jwtUtil.verifysync(req.query.token, globalKey)
        console.log(verify.classes);
        let classArr = verify.classes.split(';')
        let data = await this.getLeaveMod(classArr, req.query.currPage, req.query.pageNum)
        let total = await this.getLeaveTotal(classArr)
        resp.send({ data, total: total[0].count })
    }
    /**
     * 获取该用户请假审批与数量(分页
     * @param req
     * @param resp
     * @returns {Promise<void>}
     */
    static async getuserLeave(req, resp) {
        let verify = await jwtUtil.verifysync(req.query.token, globalKey)
        let u_id = verify.id
        console.log(u_id);
        let data = await this.getuserLeaveMod(u_id, req.query.currPage, req.query.pageNum)
        let total = await this.getuserLeaveTotal(u_id)
        resp.send({ data, total: total[0].count })
    }
    /**
    * 当前请假单审批(修改审批状态)
    * @param req
    * @param resp
    * @returns {Promise<void>}
    */
    static async upLeaveState(req, resp) {
        let results = await this.upLeaveStateMod(req.query.l_id, req.query.upState)
        resp.send(results)
    }
    /**
    *******************增值功能:公告**************************
    */
    static async NoticeDetails(req, resp) {
        let n_id = req.query.n_id
        let users = {}
        //1、获取当前公告已读人的人数
        let readNum = await this.getreadNum(n_id)
        readNum = readNum[0].count
        console.log("readNum:" + readNum);
        //2、获取当前公告已读的人的id数组,再通过id去查询用户数据
        let readIdArr = await this.getreadId(n_id)
        if (readIdArr.length != 0) users = await this.getreadByidArr(readIdArr)

        //3. 获取当前通知的详情信息
        let data = await this.NoticeDetailsMod(n_id)
        console.log("data:" + data);
        //4. 获取当前公告通知的总人数
        let total = await this.NoticeDetailsTotal(data[0].class)
        total = total[0].count
        console.log("total:" + total);
        //5. 获取已读人的阅读时间与uid
        let idAndTime = await this.getreadTime(n_id)
        //将阅读时间附加到users中
        for (let i = 0; i < idAndTime.length; i++) {
            for (let j = 0; j < users.length; j++) {
                if (users[i].id == idAndTime[j].u_id)
                    users[i].readtime = idAndTime[j].readtime
            }
        }
        resp.send(data, readNum, total, users)
    }


}