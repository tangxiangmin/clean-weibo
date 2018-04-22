clean-weibo
===

使用脚本批量删除自己的微博记录。PS：本插件仅供自己使用[/斜眼]。

思路比较简单：
* 对微博客户端进行抓包，获取需要的接口列表，这里使用的是Fiddler进行
* 获取自己的微博记录列表
* 遍历列表，根据删除策略，获取待删除的微博id
* 批量删除对应微博，可能需要进行接口节流处理，控制调用频率

## 相关接口
通过对微博客户端进行抓包，获取到相关的接口，由于是部分参数携带我自己的账号信息，因此隐藏处理
```
# Host: https://mapi.weibo.com
```
### 获取微博列表
可携带count参数，表示分页数目
```
GET /2/cardlist HTTP/1.1
```
返回值是一个包含下面两个字段
```json
{
    "cards"：[], // 包含微博记录的数组
    "cardlistInfo": {}
}
```

### 删除微博
相关账户信息附带于query参数上，post主体参数id表示对应的微博id
```
POST /2/statuses/destroy HTTP/1.1
```
返回的是当前的微博记录
```json
{
    "annotations": {
        "mapi_request": True
    }
    // ... 其他信息
}
```

## 单条微博记录字段分析
对微博列表里面的单条微博记录进行分析，根据需求，只需要拿到记录id和记录内容即可
```json
{
    "card_type": 9, // 列表卡片类型，9为正常微博内容
    "card_type_name": "",
    "itemid": "",
    "scheme": "sinaweibo://detail/?mblogid=GdehU7Kxb",
    "mblog": {
        "created_at": "Sun Apr 22 09:08:06 +0800 2018",
        "id": 4231531901847177,
        "idstr": "4231531901847177",
        "mid": "4231531901847177",
        "can_edit": false,
        "text": "[笑而不语]转发的微博清完了，插件后面再上传，发现了微博分页的bug[偷笑] ​​​",
        "textLength": 69,
        "source_allowclick": 1,
        "source_type": 2,
        "source": "<a href=\"sinaweibo://customweibosource\" rel=\"nofollow\">iPhone客户端</a>",
        "appid": 25,
        "favorited": false,
        "truncated": false,
        "in_reply_to_status_id": "",
        "in_reply_to_user_id": "",
        "in_reply_to_screen_name": "",
        "pic_ids": [],
        "geo": "",
        "is_paid": false,
        "mblog_vip_type": 0,
        // ...其他字段
    },
    "show_type": 1,
    "title": "",
    "openurl": ""
}
```
## 遇见的一个坑
微博后台应该是不支持`application/json`格式的形式，导致使用axios调用删除接口一直返回参数错误，
需要修改为如下形式，这是axios常见的一个问题~记得用qs对post参数进行转换
```
axios.defaults.headers = {
    'Content-type': 'application/x-www-form-urlencoded'
}
```