// pages/me/index.js

const db = wx.cloud.database()
const collection = db.collection('kkb')
Page({
  data: {
    books: [],
    page: 1,
    imgUrl: ''
  },
  onLoad() {
    this.getList(true) //首次加载
  },
  getList(isInit) {
    var _this = this
    wx.showLoading()
    let SIZE = 2
    collection.skip(this.data.page * SIZE).limit(SIZE).get({
      success: res => {
        if (isInit) {
          this.setData({
            books: res.data
          })
        } else {
          this.setData({
            books: this.data.books.concat(res.data)
          })
        }
        wx.hideLoading()
      }
    })
  },
  //触底
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getList()
    console.log('触底')
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getList(true) //首次加载
  },
  addBook(isbn) {
    console.log(isbn)
    wx.cloud.callFunction({
      name: 'kkb',
      data: {
        isbn
      }
    }).then(res => {
      let info = res.result
      info.count = 1
      console.log(info)
      //信息入库
      collection.add({
        data: info,
        success: res => {
          console.log(res);
          if (res._id) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
      // wx.showModal({
      //   title: '搜索成功',
      //   content: `图书《${info.title}》 评分是${info.rating.value}`
      // })
    })
  },
  callLogin() {
    var _this = this
    wx.chooseImage({
      count: 1,
      success: function(res) {
        let filePath = res.tempFilePaths[0]
        let cloudPath = 'kkb-quanzhan-10-' + (new Date().getTime())
        console.log(filePath)
        wx.cloud.uploadFile({
          filePath,
          cloudPath,
          success: res => {
            console.log(res)
            console.log(res.fileID)
            _this.setData({
              imgurl: res.fileID
            })
            console.log(_this.data.imgurl)
          }
        })
      },
    })
    // wx.scanCode({
    //   success: res => {
    //     this.addBook(res.result)
    //   },
    // })
  }

})