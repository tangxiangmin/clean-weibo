// 接口请求节流函数

module.exports = {
    /**
     * 
     * @param {需要分组的数据} arr 
     * @param {每组的长度} length 
     */
    genGroup(arr, length) {
        let group = [];
        for (let i = 0; i < arr.length;) {
            let sub = arr.slice(i, i + length);
            i += length;

            group.push(sub);
        }
        return group;
    },
    /**
     * 
     * @param {数组} group 
     * @param {回调函数} cb 
     * @param {*} delay 
     */
    throttle(group, cb, delay = 200) {
        for (let i = 0; i < group.length; ++i) {
            setTimeout(() => {
                cb(group[i]);
            }, delay * i);
        }
    }
};