
let data = [];
let tabfilterData = [];//蔬果 水果 花卉 切換要顯示的資料
let tabStatus = 'all'; //all N04 N05 N06
const sortSelect = document.querySelector('.sort-select');
const showList = document.querySelector('.showList');

//取得資料-----------------------------------
getData();
function getData() {
    axios.get('https://hexschool.github.io/js-filter-data/data.json')
        .then(function (response) {
            data = response.data;
            //renderData(data);
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

//tab切換，根據tab顯示相對應資料 取消active則渲染全部資料---------------
const tabBtnGroup = document.querySelector('.button-group');
let tabBtn = document.querySelectorAll('.button-group .btn');
tabBtnGroup.addEventListener('click', function (e) {
    if (e.target.nodeName === 'BUTTON') {
        tabStatus = e.target.dataset.type;
        //let tabBtn = document.querySelectorAll('.button-group .btn');
        tabBtn.forEach(function (item) {
            item.classList.remove('active');
        })
        e.target.classList.add('active');
        tabStatusChange(tabStatus);
    }
    console.log(e.target);
});

//根據tabStatus篩選資料--------------------
function tabStatusChange(tabStatus) {
    //let tabfilterData = []; 為了排序功能將此句移至全域
    tabfilterData = data.filter((item) => item.種類代碼 == tabStatus)
    renderData(tabfilterData);
    sortSelect.value ='排序篩選';
}

//搜尋-----------------------------------
const textInput = document.querySelector('.text-input');
const searchBtn = document.querySelector('.search');
searchBtn.addEventListener('click', search);
function search() {
    if (textInput.value.trim() == '') {
        alert('請輸入搜尋內容');
        return
    }
    let searchData = data.filter((item) => item.作物名稱 && item.作物名稱.match(textInput.value))
    //不懂為何用下面這句會報錯誤↓↓
    //searchData = data.filter((item) => item.作物名稱.match(keyword.value))

    if (searchData.length == 0) {
        showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">查無資料 Q_Q</td></tr>`;
    } else {
        renderData(searchData);
        textInput.value = '';
    }
    //搜尋後取消tab的active--4/21待檢查
    tabBtn.forEach(function (item) {
        item.classList.remove('active');
    })
}
//按Enter可搜尋
textInput.addEventListener('keypress', function (e) {
    if (e.key == 'Enter') {
        search();
    }
})
//排序-------------------------------
sortSelect.addEventListener('change', function (e) {
     let selectItem = e.target.value;
    // // if (selectItem == '排序篩選') {
    // //     renderData(data)
    // // } else
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
    let newData = tabfilterData.sort(function (a, b) {
        return b[value] - a[value]
    })
    renderData(newData);
}


// function sortItem(value) {
//     //先搜尋再排序
//     if (tabStatus == 'all') {
//         let newData = data.sort(function (a, b) {
//             return b[value] - a[value]
//         })
//         renderData(newData);
//     } else {
//         //先按標籤再排序 (蔬果 水果 花卉)
//         let newData = tabfilterData.sort(function (a, b) {
//             return b[value] - a[value]
//         })
//         renderData(newData);
//     }
// }
//排序(上下箭頭)--4/21待做----------------------

// switch (e.target.value) {
    //     case '依上價排序':
    //         sortItem('上價')
    //         break
    //     case '依中價排序':
    //         sortItem('中價')
    //         break
    //     case '依下價排序':
    //         sortItem('下價')
    //         break
    //     case '依平均價排序':
    //         sortItem('平均價')
    //         break
    //     case '依交易量排序':
    //         sortItem('交易量')
    //         break
    // }


//tab切換重覆點可以取消active 爛code寫法-------------
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