/*
 * @LastEditors: liguobiao
 * @LastEditTime: 2021-03-24 11:19:27
 */
var express = require("express");
var router = express.Router();
var commonJS = require("../public/js/common");
var sqlHandle = require("../public/config/mysqlModal");

/**
 * @description: 新建房间
 * @param {*}
 * @return {*}
 */

router.post("/addRoom", async (req, res, next) => {
  let data = req.body;
  let sql = `insert into living_room (id,title,user_id,type) value ('${commonJS.getCode(
    32
  )}','${data.title}','${data.user_id}','${data.type}')`;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    res.send(commonJS.outPut(200, data, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

/**
 * @description: 获取直播间列表
 * @param {*}
 * @return {*}
 */
router.get("/roomList", async (req, res, next) => {
  let data = req.query;
  let sql;
  if (!data.keyword) {
    sql = `select living_room.id,living_room.user_id,living_room.title,user.name,living_room.image,user.avatar,living_room.type from living_room left join user on living_room.user_id = user.id  where living_room.status != 0`;
  } else {
    sql = `select living_room.id,living_room.user_id,living_room.title,user.name,living_room.image,user.avatar,living_room.type from living_room left join user on living_room.user_id = user.id where title like '%${data.keyword}%' or user.name like '%${data.keyword}%' and living_room.status !=0 limit 20`;
  }
  let result = await sqlHandle.DB2(sql);
  if (result.length >= 0) {
    res.send(commonJS.outPut(200, result, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

/**
 * @description: 根据类型获取直播间列表
 * @param {*}
 * @return {*}
 */
router.get("/roomList/type/:type", async (req, res, next) => {
  let data = req.params;
  let sql;
  if (!data.type) {
    sql = `select living_room.id,living_room.user_id,living_room.title,user.name,living_room.image,user.avatar,living_room.type from living_room left join user on living_room.user_id = user.id  where living_room.status != 0`;
  } else {
    sql = `select living_room.id,living_room.user_id,living_room.title,user.name,living_room.image,user.avatar,living_room.type from living_room left join user on living_room.user_id = user.id where type = '${data.type}' and living_room.status !=0 limit 20`;
  }
  let result = await sqlHandle.DB2(sql);
  if (result.length >= 0) {
    res.send(commonJS.outPut(200, result, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

/**
 * @description: 编辑房间
 * @param {*}
 * @return {*}
 */

router.put("/editRoom", async (req, res, next) => {
  let data = req.body;
  let sql = `update living_room set title='${data.title}',status='${data.status}',user_id='${data.user_id}' where id ='${data.id}' `;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    res.send(commonJS.outPut(200, data, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

module.exports = router;
