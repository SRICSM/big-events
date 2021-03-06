$(function () {

  // initUserInfo()
  var layer = layui.layer

  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  //为上传按钮绑定点击事件 
  // 在按钮的点击事件里面调用input文件选择框的点击事件，来实现对本地文件进行选择
  $('#btnChooseImage').on('click', function () {
    $('#file').click()
  })

  //为文件选择框绑定change事件 
  /* change事件一般作用于标签，
  可以监听input的value值，
  当它的value值有变化时，
  在失去焦点后触发change事件 */
  $('#file').on('change', function (e) {
    // console.log(e)

    //获取用户选择的文件
    var filelist = e.target.files
    if (filelist.length === 0) {
      return layer.msg('请选择照片！')
    }

    //将用户选择的文件替换裁剪区域
    //1.拿到用户选择的文件
    var file = e.target.files[0]
    //2.将文件，转化为路径
    var imgURL = URL.createObjectURL(file)
    //3.重新初始化裁剪区域
    $image
      .cropper('destroy') //销毁旧的裁剪区域
      .attr('src', imgURL) //重新设置图片路径
      .cropper(options) //重新初始化裁剪区域
  })

  //为 确定按钮 绑定点击事件
  $('#btnUpload').on('click', function () {
    //1.要拿到用户裁剪之后的头像
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        //创建一个Canvas画布
        width: 100,
        height: 100
      })
      //将Canvas画布上的内容转化为base64格式的字符串
      //经过base64编码后的文件体积比一般文件大30%左右
      .toDataURL('image/png')
    //2.调用接口，把头像上传到服务器
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        console.log(res)
        if (res.status !== 0) {
          return layer.msg('更换头像失败！')
        }
        layer.msg('更换头像成功！')
        //调用父窗口获取用户信息函数，更新父页面内容
        window.parent.getUserInfo()
        // var my = $('#image')
        var my = document.querySelector('#image')
        my.setAttribute('src',res.avatar)
        console.log(my)
      }
    })
  })
})


// 获取用户信息 设置初始裁剪区域示例图片为我的头像
// function initUserInfo() {
//   $.ajax({
//     method: 'GET',
//     url: '/my/userinfo',
//     success: function (res) {
//       if (res.status !== 0) {
//         return layer.msg('获取用户信息失败！')
//       }
//       var my = document.querySelector('#image')
//       my.setAttribute('src', res.data.user_pic)
//       console.log(my)
//     }
//   })
// }