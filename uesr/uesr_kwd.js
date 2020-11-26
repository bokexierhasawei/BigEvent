$(function () {
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须在6-12位，且不许有空格'],
        samepwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新旧密码不能一样哦~~~';
            }
        },
        confirmpwd: function (value) {
            if (value != $('[name=newPwd]').val()) {
                return '确认密码和新密码输入不一样哦~~~';
            }
        }
    })

    $('.layui-form').on('submit', changePwd)
})

function changePwd(e) {
    e.preventDefault();
    $.ajax({
        url: '/my/updatepwd',
        method: 'post',
        data: $(this).serialize(),
        success(res) {
            //如果不成功 ，则 退出函数
            if (res.status != 0) return layui.layer.msg(res.message);
            // 成功则清空token 并跳转到login.html
            layui.layer.msg(res.message, {
                icon: 1,
                time: 1500 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                //do something
                localStorage.removeItem('token');
                window.top.location = '/login.html'
            });
        }
    })
}