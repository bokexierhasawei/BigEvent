var $image = null
var options = null

$(function () {
    // 初始化富文本编辑器
    initEditor()
    // 1.请求分类下拉框数据 并渲染下拉框
    initCateList()
    // 裁剪
    // 1. 初始化图片裁剪器
    $image = $('#image')

    // 2. 裁剪选项
    options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 模拟隐藏文件框被点击
    $('#btnChoose').on('click', function () {
        $('#coverFile').click()
    })
    // 文件选择框中 选中文件 改变 是触发
    $('#coverFile').on('change', fileChange)
    // 5.为草稿和发布按钮 绑定事件
    $('#btnPublish').on('click', publish)
    $('#btnDraft').on('click', draft)
    // 6.为表单提交绑定事件
    $('#form-pub').on('submit', doSubmit)
})


// 1.请求分类下拉框数据 并渲染下拉框
function initCateList() {
    // 异步请求
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success(res) {
            let strHtml = template('initArticle', res.data)
            $('.articleList').html(strHtml)
            layui.form.render()
        }
    })
}
// 
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

// 发布函数
let state = '已发布'
function publish() {
    state = '已发布'
}
// 草稿函数
function draft() {
    state = '草稿'
}

// 表单提交事件处理函数
function doSubmit(e) {
    e.preventDefault()
    // 获取表单数据
    let fd = new FormData(this);
    fd.append('state', state);
    // 
    $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob)
            // 6. 发起 ajax 数据请求
            $.ajax({
                url: '/my/article/add',
                method: 'post',
                data: fd,
                processData: false,
                contentType: false,
                success(res) {
                    // 判断是否成功
                    if (res.status != 0) return layui.layer.msg(res.message)
                    // 成功执行下面
                    location.href = '/article/art_list.html'
                }
            })
        })
}