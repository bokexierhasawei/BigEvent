$(function () {
    getUserInfo();
    $('#btnLoginout').on('click', logout)
})

function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success(res) {
            console.log(res.status);
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!')
            }
            renderAvatar(res.data)
        }
    })
}
function renderAvatar(user) {
    let name = user.nickname || user.username
    $('#welcome').html(name)
    if (user.user_pic !== null) {
        // 有图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        // 隐藏文字头像
        $('.text-avatar').hide();
    } else {
        // 没有图片头像
        $('.layui-nav-img').hide()
        let firstChar = name[0].toUpperCase();
        $('.text-avatar').text(firstChar).show();
    }
}
function logout() {
    layui.layer.confirm('really want to leave me?', { icon: 3, title: '提示' }, function (index) {
        //do something
        // 删除 localStorage 中的token
        localStorage.removeItem('token');
        location.href = "/login.html"

        layer.close(index);
    });
}