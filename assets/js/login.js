$(function () {
  // 点击“去注册账号”的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击去登录按钮
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })
  // 从 layui中获取form对象
  // 通过form.verify()函数自定义校验规则
  layui.form.verify({
    pwd: [
      /^[\S]{6,12}$/, '密码须 6-12 位，不能出现空格~'
    ],
    repwd: function (value) {
      // 通过形参拿到确认密码框中的内容
      let pwd = $('.reg-box [name=password]').val();
      console.log(pwd);
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })
  // 注册表单提交事件
  $('#regForm').on('submit', submitData);
})
// 根路径
let baseUrl = 'http://ajax.frontend.itheima.net';

function submitData(e) {
  e.preventDefault()
  let dataStr = $(this).serialize();
  console.log(dataStr);
  $.ajax({
    url: baseUrl + '/api/reguser',
    method: 'post',
    data: dataStr,
    success(res) {
      layui.layer.msg(res.message);
      if (res.status != 0) return;
      console.log('注册成功');
      $('#regForm')[0].reset()
      $('#link_login').click()
    }
  })
}

