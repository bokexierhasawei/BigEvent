// 分页查询参数对象
let q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
};
// 入口函数
$(function () {
    // 创建 事件格式化 过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = dt.getMonth() + 1;
        let d = dt.getDate();
        let hh = dt.getHours();
        let mm = dt.getMinutes();
        let ss = dt.getSeconds();
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }
    initTable();
    initCate();
    // 为查询表单绑定事件
    $('#form-search').on('submit', search)
    // 为未来的删除按钮绑定 代理 点击事件
    $('tbody').on('click', '.btn-delete', del)
})

// 加载页面
function initTable() {
    $.ajax({
        method: 'get',
        url: '/my/article/list',
        data: q,
        success(res) {
            let strHtml = template('tpl-list', res)
            $('tbody').html(strHtml)
            //    调用生成页码条方法
            rederPage(res.total)
        }
    })
}

// 初始化文章分类的函数
function initCate() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success(res) {
            if (res.status !== 0) {
                return layer.msg('获取分类数据失败！')
            }
            let htmlStr = template('tpl-cate', res.data)
            // 将 html 代码 添加到 分类下拉框中
            $('select[name=cate_id]').html(htmlStr)
            layui.form.render()
        }

    })
}

// 查询事件处理函数
function search(e) {
    // a.阻断表单提交
    e.preventDefault();
    // b.逐一查询表单下拉框的数据
    q.cate_id = $('select[name=cate_id]').val();
    q.state = $('select[name=state]').val()
    console.log(q);
    // c.设置给 分页查询参数对象
    initTable()
}

// 生成页码条
function rederPage(total) {
    console.log(total);
    layui.laypage.render({
        elem: 'pageBar',//页码条容量
        count: total,//总行数
        curr: q.pagenum,//获取起始页
        limit: q.pagesize,//页容量
        limits: [2, 5, 10, 15, 20],
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        // 分页切换触发jump函数
        // first是true
        jump(obj, first) {
            console.log(obj.curr);
            q.pagenum = obj.curr;
            q.pagesize = obj.limit
            if (!first) {
                initTable()
            }
        }
    })
}

// 删除业务
function del() {
    layui.layer.confirm('大坏蛋', (index) => {
        // let id = this.getAttribute('data-id')
        let id = this.dataset.id
        let rows = $('tbody tr .btn-delete').length;

        $.ajax({
            url: '/my/article/delete/' + id,
            method: 'get',
            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return;
                // 删除成功后 需要判断是否有行
                if (rows <= 1) {
                    q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                }
                initTable()
            }
        })
        layui.layer.close(index)
    })
}


