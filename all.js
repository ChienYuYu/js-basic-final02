
let data = [];
let tabfilterData = [];
let tabStatus = 'all'; //all N04 N05 N06
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
//tab狀態更新
function updateTabStatus(e){
    if(tabStatus == 'all'){
        tabBtnGroup.getAttribute('data-type')
    }
}
//tab切換，根據tab顯示相對應資料 取消active則渲染全部資料---------------
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

//重覆點可以取消active 爛code寫法
// tabBtnGroup.addEventListener('click', function (e) {
//     if ((e.target.nodeName === 'BUTTON') && 
//     (tabStatus !== e.target.getAttribute('data-type'))) {
//         tabStatus = e.target.dataset.type;
//         let tabBtn = document.querySelectorAll('.button-group .btn');
//         tabBtn.forEach(function (item) {
//             item.classList.remove('active');
//         })
//         e.target.classList.add('active');
//         tabStatusChange(tabStatus);
//     }
//     else if ((e.target.nodeName === 'BUTTON') &&
//      (tabStatus == e.target.getAttribute('data-type'))) {
//         e.target.classList.remove('active');
//         tabStatus = 'all';
//         sortItem();
//         renderData(data)
//     }
//     console.log(tabStatus);
// });

//根據tabStatus篩選資料--------------------
function tabStatusChange(tabStatus) {
    //let tabfilterData = []; 為了排序功能將此句移至全域
    tabfilterData = data.filter((item) => item.種類代碼 == tabStatus)
    renderData(tabfilterData);
}

//搜尋-----------------------------------
const textInput = document.querySelector('.text-input');
const searchBtn = document.querySelector('.search');
searchBtn.addEventListener('click', searchData);
function searchData() {
    if (textInput.value.trim() == '') {
        alert('請輸入搜尋內容');
        return
    }
    let filterData = data.filter((item) => item.作物名稱 && item.作物名稱.match(textInput.value))
    //不懂為何用下面這句會報錯誤↓↓
    //filterData = data.filter((item) => item.作物名稱.match(keyword.value))

    if (filterData.length == 0) {
        showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">查無資料 Q_Q</td></tr>`;
    } else {
        renderData(filterData);
        textInput.value = '';
    }
}
//按Enter可搜尋
textInput.addEventListener('keypress', function (e) {
    if (e.key == 'Enter') {
        searchData();
    }
})

//排序-------------------------------
const sortSelect = document.querySelector('.sort-select');
sortSelect.addEventListener('change', function (e) {
    let selectItem = e.target.value;
    if (selectItem == '排序篩選') {
        renderData(data)
    } else if (selectItem == '依上價排序') {
        sortItem('上價')
    } else if (selectItem == '依中價排序') {
        sortItem('中價')
    } else if (selectItem == '依下價排序') {
        sortItem('下價')
    } else if (selectItem == '依平均價排序') {
        sortItem('平均價')
    } else if (selectItem == '依交易量排序') {
        sortItem('交易量')
    }
})
function sortItem(value) {
    if (tabStatus == 'all') {
        let newData = data.sort(function (a, b) {
            return b[value] - a[value]
        })
        renderData(newData);
    } else {
        let newData = tabfilterData.sort(function (a, b) {
            return b[value] - a[value]
        })
        renderData(newData);
    }
}
//上價(高~低)
//中價
//下價(低~高)
//平均價
//交易量