$(function () {
    initCropper();
    $('#btnUpload').on('click', chooseFile)
    // 文件选择框中 选中文件 改变 是触发
    $('#file').on('change', fileChange)
    // 
    $('#btnOk').on('click', upload)
})

// 1.2 配置选项
let $image = null
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

function initCropper() {
    // 1.1 获取裁剪区域的 DOM 元素
    $image = $('#image')


    // 1.3 创建裁剪区域
    $image.cropper(options)
}
function chooseFile() {
    $('#file').click()
}
function fileChange(e) {
    let fileList = e.target.files;
    if (fileList.length == 0) return layui.layer.msg('请选择文件')
    console.log(fileList);
    // 
    let file = fileList[0]
    //  创建文件虚拟路径
    var newImgURL = URL.createObjectURL(file)
    // 显示新图片 
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
}
function upload() {
    // 获取选中的 裁剪后 的图片数据
    var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    console.log(dataURL);
    // 提交到 服务期接口
    $.ajax({
        url: '/my/update/avatar',
        method: 'post',
        data: {
            avatar: dataURL
        },
        success(res) {
            layui.layer.msg(res.message);
            // 如果失败，退出函数
            if (res.status != 0) return;
            // 成功
            window.top.getUserInfo()
        }
    })
    // 如果上传成功，则调用父页面的 方法 重新 渲染 用户信息
}