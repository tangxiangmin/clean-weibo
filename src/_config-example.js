
// 这两个接口通过fiddler抓包获取，包含账户认证信息
// 获取对应链接后可将该文件修改为_config.js，然后执行脚本

module.exports = {
    LIST_URL: ``,
    DELETE_URL: ``,
    /**
     * 微博删除策略，将传入Array.prototype.filter
     * @param {*} record 
     */
    DELETE_STRATEGY(record, index) {
        return false
    },
}