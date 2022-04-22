//宣告變數-----------------------------------
let data = [];//初始資料
let tabData = [];//蔬果 水果 花卉 切換要顯示的資料
let searchData = []; //使用搜尋篩出來的資料
let tabStatus = ''; //N04 N05 N06
//抓DOM------------------------------------
const tabBtnGroup = document.querySelector('.button-group');
const tabBtn = document.querySelectorAll('.button-group .btn');//蔬果 水果 花卉
const textInput = document.querySelector('.text-input');//搜尋欄
const searchBtn = document.querySelector('.search');//搜尋紐
const sortSelect = document.querySelector('.sort-select');//下拉選單
const mobileSelect = document.querySelector('.mobile-select');//手機下拉選單
const sortAdvanced = document.querySelector('.js-sort-advanced');//
const showList = document.querySelector('.showList');
//取得資料-----------------------------------
getData();
function getData() {
    axios.get('https://hexschool.github.io/js-filter-data/data.json')
        .then(function (response) {
            data = response.data;
        });
}
//渲染資料--------------------------------
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

//tab切換並賦予.active，根據tab顯示相對應資料(蔬果 水果 花卉)-------
tabBtnGroup.addEventListener('click', function (e) {
    if (e.target.nodeName === 'BUTTON') {
        textInput.value = '';//清空搜尋欄文字
        tabStatus = e.target.dataset.type;
        tabBtn.forEach(function (item) {
            item.classList.remove('active');
        })
        e.target.classList.add('active');
        tabStatusChange(tabStatus);
    }
});

//根據tabStatus篩選資料--------------------
function tabStatusChange(tabStatus) {
    tabData = data.filter((item) => item.種類代碼 == tabStatus)
    renderData(tabData);
    sortSelect.value ='排序篩選'; //下拉選單恢復預設
    mobileSelect.value = '排序';//手機板下拉選單恢復預設
}

//搜尋-----------------------------------
searchBtn.addEventListener('click', search);
function search() {
    if (textInput.value.trim() == '') {
        alert('請輸入搜尋內容');
        return
    }
    //不懂為何用下面這句會報錯誤↓↓
    //searchData = data.filter((item) => item.作物名稱.match(textInput.value))
    searchData = data.filter((item) => item.作物名稱 && item.作物名稱.match(textInput.value))
    if (searchData.length == 0) {
        showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">抱歉...查無資料 >_<</td></tr>`;
    } else {
        renderData(searchData);
    }
    //搜尋後取消tab的.active
    tabBtn.forEach(function (item) {
        item.classList.remove('active');
    })
    tabStatus = ''; //tabStatus恢復預設
    sortSelect.value ='排序篩選'; //下拉選單恢復預設
    mobileSelect.value = '排序';//手機板下拉選單恢復預設
}
//按Enter可搜尋
textInput.addEventListener('keypress', function (e) {
    if (e.key == 'Enter') {
        search();
    }
})
//排序I(下拉選單)-------------------------------
sortSelect.addEventListener('change', function (e) {
    let selectItem = e.target.value;
    if (selectItem == '依上價排序') {
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
    //假如搜尋欄有值 根據搜尋結果排序/ searchData[]
    if (textInput.value !== '') {
        let newData = searchData.sort((a, b) => b[value] - a[value])
        renderData(newData);
    }
    //else根據選的tab排序 (蔬果 水果 花卉)/ tabData[]
    else {
        let newData = tabData.sort((a, b) => b[value] - a[value])
        renderData(newData);
    }
}
//排序II(上下箭頭)------------------------
sortAdvanced.addEventListener('click', function (e) {
    const sortPrice = e.target.dataset.price
    const sortIcon = e.target.dataset.sort

    //假如搜尋欄為空值 根據選的tab排序 (蔬果 水果 花卉) tabData[]
    if ((e.target.nodeName == 'I') && (textInput.value == '')) {
        if (sortIcon == 'up') {
            tabData.sort((a, b) => b[sortPrice] - a[sortPrice])
        } else {
            tabData.sort((a, b) => a[sortPrice] - b[sortPrice])
        }
        renderData(tabData)
        sortSelect.value = `依${sortPrice}排序`;//下拉選單顯示相對應項目
        mobileSelect.value =`${sortPrice}`;//手機下拉選單顯示相對應項目
    }
    //假如搜尋欄有值 根據搜尋結果排序 searchData[]
    else if ((e.target.nodeName == 'I') && (textInput.value !== '')) {
        if (sortIcon == 'up') {
            searchData.sort((a, b) => b[sortPrice] - a[sortPrice])
        } else {
            searchData.sort((a, b) => a[sortPrice] - b[sortPrice])
        }
        renderData(searchData)
        sortSelect.value = `依${sortPrice}排序`;//下拉選單顯示相對應項目
        mobileSelect.value =`${sortPrice}`;//手機下拉選單顯示相對應項目
    }
})

//手機下拉選單--------------------------
mobileSelect.addEventListener('change',function(e){
    let selectItem = e.target.value;
    if (selectItem == '上價') {
        sortItem('上價')
    } else if (selectItem == '中價') {
        sortItem('中價')
    } else if (selectItem == '下價') {
        sortItem('下價')
    } else if (selectItem == '平均價') {
        sortItem('平均價')
    } else if (selectItem == '交易量') {
        sortItem('交易量')
    }
})