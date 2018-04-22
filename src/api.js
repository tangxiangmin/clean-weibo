
let axios = require('axios')
let qs = require('qs')
let fs = require('fs-extra')


let config = require('./_config')

axios.defaults.baseURL = "https://mapi.weibo.com";

axios.defaults.headers = {
    'Content-type': 'application/x-www-form-urlencoded'
}


const LOCAL_CACHE_LIST = './data/list.json'
module.exports = {
    // 获取微博列表
    getWeiboList(count) {
        let url = config.LIST_URL,
            params = {
                count
            }

        return axios.get(url, { params }).then(res => res.data)
    },

    // 删除微博
    deleteWeibo(id) {
        let url = config.DELETE_URL,
            params = {
                id
            }

        return axios.post(url, qs.stringify(params)).then(res => res.data)
    },
    // 保存到本地
    saveToLocalList(list) {
        return fs.outputJson(LOCAL_CACHE_LIST, list).then(() => {
            return list
        })
    },
    getLocalList() {
        if (fs.pathExistsSync(LOCAL_CACHE_LIST)) {
            return fs.readJson(LOCAL_CACHE_LIST)
        }
        return Promise.resolve(false)
    }
}