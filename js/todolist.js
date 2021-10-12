/* 获取之前本地存储中匹配信息，再将获取的输入信息添加到本地存储中，最后更新本地存储中的数据，遍历本地存储中的数据，重新渲染页面 */
// 即：获取数据，修改数据，保存数据，重新渲染

$(function () {
    load();

    $('.txt').on('keydown',function (e) {
        if(e.keyCode == 13){
            var val = $(this).val();
            if(val == ""){
                alter("请输入您要的操作");
            }else {
                // 存储的数据格式  var todolist = [{title: "xxx", done: false}]
                var local = getData();
                // 获取val，更新local
                local.push({title: val, done: false});
                // 将更新的local放到本地存储中
                saveData(local);
                // 重新渲染页面（即添加li）
                load();
            }
            $(this).val("");
        }
    })

    // 事件委托，因为 a 是后面创建的
    $('ol, ul').on('click', 'a', function () {
        // 从本地存储中移除该条数据 （获取其索引，即id）
        var index = $(this).attr('id');
        // 获取本地存储数据
        var data = getData();
        // 删除第 index 个开始的 1 个数据
        data.splice(index,1);
        // 保存到本地存储
        saveData(data);
        //重新渲染页面
        load();
    })

    // 事件委托，点击 input 响应事件
    $('ul, ol').on('click','input',function () {
        // 获取本地存储数据
        var data = getData();
        // 修改数据 (获取要修改对象的下标，将该对象的 done 的值改为 该元素checked属性的状态)
        var index = $(this).siblings('a').attr('id');
        data[index].done = $(this).prop('checked');
        // 保存数据到本地存储
        saveData(data);
        // 重新渲染页面
        load();
    })

    //获取本地存储的数据（以对象的形式表示）
    function getData() {
        var data = localStorage.getItem('todolist');
        if(data != null){
            // 本地数据存储的数据是以字符串的形式存储的，JSON.parse()将字符串转换成对象的形式
            return JSON.parse(data);
        }else {
            return [];
        }
    }

    function saveData(local) {
        /* 将更新后的新数组转换成字符串的形式重新赋值 */
        var data = JSON.stringify(local);
        /* 本地存储的数据以 键值对 的形式存在 */
        localStorage.setItem('todolist',data);
    }
    
    function load() {
        // 获取本地存储中的数据
        var data = getData();
        // 记录list清单条目数
        var todoCount = 0;
        var doneCount = 0;
        // 遍历之前先要清空ol里面的元素内容
        $("ol, ul").empty();
        // 将本地存储中的数据添加到页面
        $.each(data,function (i,ele) {
            // 如果对象键 done 的值为 false：ol里创建li，true：ul里创建li
            if(ele.done){
                $("ul").prepend("<li><input type='checkbox' checked='checked'> <p>" + ele.title + "</p> <a href='javascript:;' id=" + i + " ></a></li>")
                doneCount++;
            }else {
                $("ol").prepend("<li><input type='checkbox'> <p>" + ele.title + "</p> <a href='javascript:;' id=" + i + " ></a></li>")
                todoCount++;
            }
        })
        // 根据记录修改内容
        $('#todoCount').text(todoCount);
        $('#doneCount').text(doneCount);
    }
})