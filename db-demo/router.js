/*
 * @Author: hongyongbo
 * @LastEditors: hongyongbo
 * @Description: 封装路由
 * @Notice: 
 * @Date: 2019-02-22 11:37:13
 * @LastEditTime: 2019-02-22 18:59:08
 */


var router = {}

/**
 *注册路由
 *
 * @param {*} method
 * @param {*} path
 * @param {*} cb
 */
function registerRouter(method, path, cb) {
  method = method.toUpperCase();
  router[method] = router[method] || {}
  router[method][path] = cb
}

/**
 *查找路由对应的处理方法
 *
 * @param {*} method
 * @param {*} path
 * @returns
 */
function findRouter(method, path) {
  method = method.toUpperCase();
  if (!router[method] || !router[method][path]) {//路由未注册
    return null
  }
  else {
    return router[method][path]
  }
}

module.exports = {
  registerRouter,
  findRouter
}