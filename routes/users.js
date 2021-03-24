var express = require("express");
var router = express.Router();
var commonJS = require("../public/js/common");
var sqlHandle = require("../public/config/mysqlModal");
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/**
 * @description: 注册
 * @param {*}
 * @return {*}
 */
router.post("/addUser", async (req, res, next) => {
  let data = req.body;
  if (!data.email || !data.password) {
    res.status(500).send(commonJS.outPut(500, "邮箱/密码不能为空", "fail"));
    return;
  }
  let sql = `insert into user (id,name,age,email,password) values ('${commonJS.getCode(
    32
  )}','${data.name}','${data.age}','${data.email}','${data.password}')`;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    res.send(commonJS.outPut(200, data, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

/**
 * @description: 获取用户信息
 * @param {*}
 * @return {*}
 */
router.get("/:id", async (req, res, next) => {
  let data = req.params;
  let sql = `select * from user where id = '${data.id}' limit 1`;
  let result = await sqlHandle.DB2(sql);
  if (result.length == 1) {
    res.send(commonJS.outPut(200, result[0], "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

/**
 * @description: 编辑用户信息
 * @param {*}
 * @return {*}
 */
router.put("/:id", async (req, res, next) => {
  let id = req.params && req.params.id;
  let data = req.body;
  if (id) {
    let sql = `update user set name='${data.name}',age='${data.age}',password='${data.password}' where id='${id}'`;
    let result = await sqlHandle.DB2(sql);
    if (result.affectedRows == 1) {
      res.send(commonJS.outPut(200, data, "success"));
    } else {
      res.send(commonJS.outPut(500, result, "fail"));
    }
  }
});

// TODO:事实上，登录注册应该属于登录注册的模块，不属于用户管理
/**
 * @description: 用户登录
 * @param {*}
 * @return {*}
 */
router.post("/login", async (req, res, next) => {
  let data = req.body;
  if (data.account && data.password) {
    console.log(data.account, data.password);
    let sql = `select * from user where email='${data.account}' limit 1`;
    let result = await sqlHandle.DB2(sql);
    console.log(result);
    if (result.length == 1) {
      const token =
        "Bearer " +
        jwt.sign(
          {
            id: result[0].id,
            name: result[0].name,
            age: result[0].age,
            email: result[0].email,
          },
          "living_my_living",
          {
            expiresIn: 3600 * 24 * 7,
          }
        );

      res.send(commonJS.outPut(200, token, "success"));
    } else {
      res.send(commonJS.outPut(500, "账号/密码错误", "fail"));
    }
  } else {
    res.send(commonJS.outPut(500, "账号/密码不能为空", "fail"));
  }
});

module.exports = router;
