$(function () {
    initArticleList()
    $('#btnAddCate').on('click', addCate);
    $('body').on('submit', '#formAdd', doAdd)
    $('tbody').on('click', '.btn-delete', doDelete)
    $('tbody').on('click', '.btn-edit', showEdit)
})

// 1.获取文章分类的列表
function initArticleList() {
    $.ajax({
        url: '/my/article/cates',
        method: 'get',
        success(res) {
            console.log(res);
            let strHtml = template('tplTable', res)
            $('tbody').html(strHtml)
        }
    })
}

let layID = null
function addCate() {
    layID = layui.layer.open({
        type: 1,
        area: ['500px', '300px'],
        title: '添加文章分类',
        content: $('#tplWindow').html()
    })
}
function doAdd(e) {
    e.preventDefault();
    let title = $('.layui-layer-title').text().trim()
    if (title == "添加文章分类") {
        // 获取数据
        let dataStr = $(this).serialize();
        dataStr = dataStr.replace('Id=&', '');
        console.log(dataStr);
        $.ajax({
            // 获取数据
            //异步提交
            url: '/my/article/addcates',
            method: 'post',
            data: dataStr,
            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return;
                initArticleList()
                // 关闭弹出窗口
                layui.layer.close(layID)
            }
        })
    } else {
        // 编辑操作
        $.ajax({
            url: '/my/article/updatecate',
            method: 'post',
            data: $(this).serialize(),
            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return;
                initArticleList()
                // 关闭弹出窗口
                layui.layer.close(layID)
            }
        })

    }

}


// 删除
function doDelete() {
    layui.layer.confirm('大坏蛋', (index) => {
        // let id = this.getAttribute('data-id')
        let id = this.dataset.id
        console.log(id);
        $.ajax({
            url: '/my/article/deletecate/' + id,
            method: 'get',
            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return;
                initArticleList()
            }
        })
        layui.layer.close(index)
    })
}
// 编辑
function showEdit() {
    console.log(this.dataset.id);
    // 弹出层
    layID = layui.layer.open({
        type: 1,
        area: ['500px', '300px'],
        title: '编辑文章分类',
        content: $('#tplWindow').html()
    })
    let id = this.dataset.id;
    $.ajax({
        url: '/my/article/cates/' + id,
        method: 'get',
        success(res) {
            console.log(res);
            // 
            layui.form.val('formData', res.data)
        }
    })
}