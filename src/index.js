
let apiModel = require('./api')

let Util = require('./util')
let config = require('./_config')

class Weibo {
    constructor() {
        this.requestSize = 10 // 请求微博记录时分页数据
        this.deletePerSize = 1 // 删除接口并发次数
        this.deleteDuration = 200 // 调用删除接口时的频率
    }
    start() {
        this.getWeiboList().then(list => {
            let targetList = list.filter(config.DELETE_STRATEGY)
            // 批量删除
            this.removeWeibo(targetList)
        })
    }
    // 是否是微博记录
    isBlog(record) {
        return record.card_type === 9
    }

    // 返回精简版的微博记录，只包含所需的字段
    genSimpleWeibo(record) {
        let { mblog } = record
        let { id, text, created_at } = mblog;
        return {
            id,
            text,
            created_at
        }
    }
    // 获取数据
    getWeiboList() {
        return apiModel.getLocalList().then(list => {
            if (!list) {
                return this.requestList()
            }

            return list
        })
    }
    // 请求远程接口并保存在本地
    requestList() {
        let { requestSize } = this
        return apiModel.getWeiboList(requestSize).then(res => {
            let { cards } = res
            if (!Array.isArray(cards)) {
                // 接口请求错误
                return
            }

            let list = cards.reduce((acc, item) => {
                if (this.isBlog(item)) {
                    let simpleWeibo = this.genSimpleWeibo(item)
                    acc.push(simpleWeibo)
                }
                return acc
            }, [])

            return list

        }).then(list => {
            return apiModel.saveToLocalList(list)
        })
    }

    // 批量删除微博，节流处理
    removeWeibo(list) {
        if (!list || !list.length) {
            return
        }

        let { deletePerSize, deleteDuration } = this

        // 对待删除的列表进行分组节流控制，批量删除
        let targetGroup = Util.genGroup(list, deletePerSize);
        Util.throttle(
            targetGroup,
            groupList => {
                groupList.forEach(item => {
                    let { id } = item
                    apiModel.deleteWeibo(id).then(res => {
                        if (res.errno) {
                            console.log(`Error with: ${res.errmsg}`)
                        } else {
                            console.log(`Deleted ${id}`)
                        }
                    })
                });
            },
            deleteDuration
        );
    }
}

module.exports = Weibo