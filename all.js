
let data = [];
let tabStatus = ''; //all N04 N05 N06
const showList = document.querySelector('.showList');

//取得資料-----------------------------------
function getData() {
    axios.get('https://hexschool.github.io/js-filter-data/data.json')
        .then(function (response) {
            data = response.data;
            renderData(data);
        });
}
getData();

//渲染資料--------------------------------
//<td>${item.種類代碼}</td>
function renderData(d) {
    let str = '';
    d.forEach(function (item) {
        str +=
            `<tr>
        <td>${item.作物名稱}</td>
        <td>${item.市場名稱}</td>
        <td>${item.上價}</td>
        <td>${item.中價}</td>
        <td>${item.下價}</td>
        <td>${item.平均價}</td>
        <td>${item.交易量}</td>
        <td>${item.種類代碼}</td>
        </tr>`;
    })
    showList.innerHTML = str;
}

//tab切換 移除 新增 active------------------
const tabBtnGroup = document.querySelector('.button-group');
tabBtnGroup.addEventListener('click', function (e) {
    if (e.target.nodeName === 'BUTTON') {
        tabStatus = e.target.dataset.type;
        let tabBtn = document.querySelectorAll('.button-group .btn');
        tabBtn.forEach(function (item) {
            item.classList.remove('active');
        })
        e.target.classList.add('active');
        tabStatusChange(tabStatus);
    }
});

//根據tabStatus篩選資料--------------------
function tabStatusChange(tabStatus) {
    let filterData = [];
    filterData = data.filter((item) => item.種類代碼 == tabStatus)
    renderData(filterData);
}

//搜尋-----------------------------------
const keyword = document.querySelector('.keyword');
const searchBtn = document.querySelector('.search');
searchBtn.addEventListener('click', function (e) {
    if (keyword.value.trim() == '') {
        alert('請輸入搜尋內容');
        return
    }
    //let filterData = [];
    let filterData = data.filter((item) => item.作物名稱 && item.作物名稱.match(keyword.value))
    //不懂為何用下面這句會報錯誤↓↓
    //filterData = data.filter((item) => item.作物名稱.match(keyword.value))

    if (filterData.length == 0) {
        showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">查無資料 Q_Q</td></tr>`;
    } else {
        renderData(filterData);
        keyword.value = '';
    }

})

//排序-------------------------------

//上價(高~低)
//中價
//下價(低~高)
//平均價
//交易量