$(() => {
    // 为layui 添加校验规则
    layui.form.verify({
        nickname: [/^\S{6,12}$/, '昵称必须在6-12个字符之间~']
    })
    // 加载
    initUserInfo()
    // 重置按钮事件
    $('#btnReset').on('click', function () {
        initUserInfo()
    })
    // 
    $('.layui-form').on('submit', submitData)
})
// 1.初始化用户的基本信息
function initUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            layui.form.val('formUserInfo', res.data)
        }
    })
}

// 2.提交 表单数据
function submitData(e) {
    e.preventDefault()
    $.ajax({
        url: '/my/userinfo',
        method: 'post',
        data: $(this).serialize(),
        success(res) {
            if (res.status != 0) return layui.layer.msg(res.message);
            window.top.getUserInfo()
        }
    })
}


