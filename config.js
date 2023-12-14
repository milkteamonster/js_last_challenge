const api_path = "milktea";
const token = "8X4sDiBHGlObzqkz4CT1bsIvPAh2"

//取得產品列表
const productList = document.querySelector(".productWrap") 
let productData = [];//用來裝forEach的八筆陣列資料
let cartData = [] //購物車列表
function getProductList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then((res)=>{
        productData = res.data.products;
        renderProductList();
        itemFilter();
    })
    .catch((err)=>{
        console.log(err)
    })
}
//渲染產品列表
function renderProductList(){
    let str = ""
    productData.forEach((item)=>{
        str += combineProductHTMLItem(item)
    })
    productList.innerHTML = str;
}

//組產品列表字串的小元件統一管理
function combineProductHTMLItem(item){
    return `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${item.images}" alt="${item.description}">
        <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
    </li>`
}
//篩選品項功能
const productSelect = document.querySelector(".productSelect")
function itemFilter(){
productSelect.addEventListener("change", function(e){
    const category = e.target.value; //定義 e.target
    if(category == "全部"){  //若選到全部時渲染整個並return
        renderProductList();
        return; //不寫return為什麼不再渲染出來？
    }

    //篩選
    let str = "";
    productData.forEach((item)=>{
        if(item.category == category){ 
        str += combineProductHTMLItem(item) 
        }
    })
    productList.innerHTML = str;
})
}

// 加入購物車 productList綁監聽
productList.addEventListener("click", (e)=>{
    e.preventDefault(); //防止a href="#" 會往視窗頂部跳
    let addCardBtn = e.target.getAttribute("class")
    if(addCardBtn !== "addCardBtn"){ //若監聽內的class不是addCardBtn就不繼續執行
        return
    } 
    let productId = e.target.getAttribute("data-id")
    console.log(productId)

  
    let numCheck = 1;
    cartData.forEach((item)=>{
        if(item.product.id === productId){ //確保購物車內有這個品項，有id一樣的品項的話就+=1，沒有的話就跑numCheck = 1
            numCheck = item.quantity+=1;
        }
    })
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
        "data": {
            "productId": productId,
            "quantity": numCheck
        }
    })
    .then((res)=>{
        alert("加入購物車");
        getCartList();
     })
     .catch((err)=>{
         console.log(err)
     })
    


})

//取得購物車列表
const cartList = document.querySelector(".shoppingCart-tableList")
function getCartList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then((res)=>{
        cartData = res.data.carts;
        let str = "";
        cartData.forEach((item)=>{
            str += combineCartHTMLItem(item);
        });
        
        cartList.innerHTML = str;
        const cartTotal = document.querySelector(".cartTotal");
        cartTotal.innerHTML = res.data.finalTotal;

    })
    .catch((err)=>{
        console.log(err)
    })
} 

//組購物車字串的小元件統一管理
function combineCartHTMLItem(item){
    return `<tr>
    <td>
        <div class="cardItem-title">
            <img src="${item.product.images}" alt="">
            <p>${item.product.title}</p>
        </div>
    </td>
    <td>NT$${item.product.price}</td>
    <td>${item.quantity}</td>
    <td>NT$${item.product.price * item.quantity}</td>
    <td class="discardBtn">
        <a href="#" class="material-icons" data-id="${item.id}">
            clear
        </a>
    </td>
</tr>`
}

//購物車刪除單筆品項
cartList.addEventListener("click", (e)=>{
    e.preventDefault();
    const cartId = e.target.getAttribute("data-id");
    if(cartId == null){
        alert("你點錯囉")
        return;
    }
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
    .then((res)=>{
        alert("刪除單筆購物車")
        getCartList();
    })
    .catch((err)=>{
        console.log(err)
    })
})  

//購物車刪除全部品項
const discardAllBtn = document.querySelector(".discardAllBtn")
discardAllBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then((res)=>{
        alert("已清空購物車")
        getCartList();
    })
    .catch((err)=>{
        alert("購物車沒有東西！")
        console.log(err)
    })
})

const orderInfoBtn = document.querySelector(".orderInfo-btn")
orderInfoBtn.addEventListener("click", (e)=>{
    e.preventDefault(); 
    if(cartData.length == 0){
        alert("購物車沒有品項")
        return
    };
    const customerName = document.querySelector("#customerName").value;
    const customerPhone = document.querySelector("#customerPhone").value;
    const customerEmail = document.querySelector("#customerEmail").value;
    const customerAddress = document.querySelector("#customerAddress").value;
    const customerTradeWay = document.querySelector("#tradeWay").value;
    const inputArr = document.querySelectorAll(".orderInfo-input")
    let hasBlank = false;
    inputArr.forEach((item)=>{
        if(item.value === ""){
            hasBlank = true;
        }
    })
    if(hasBlank){
        alert("請填入資料否則無法送出")
        return 
    }
    // if(customerName=="" || customerPhone=="" || customerEmail=="" || customerAddress=="" || customerTradeWay==""){
    //     alert("請填入資料否則無法送出")
    // }
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
    "data": {
        "user": {
            "name": customerName,
            "tel": customerPhone,
            "email": customerEmail,
            "address": customerAddress,
            "payment": customerTradeWay
        }
    }
    }).then((res)=>{
        alert("訂單送出成功");
        document.querySelector("#customerName").value = "";//為何不能直接customerName= "" ？
        document.querySelector("#customerPhone").value = "";
        document.querySelector("#customerEmail").value = "";
        document.querySelector("#customerAddress").value = "";
        document.querySelector("#tradeWay").value = "ATM";
        getCartList();//為何要再度渲染？若不渲染購物車不會清空，是後端API自己的設定嗎？
    })
    .catch((err)=>{
        alert("訂單提出失敗")
    })

});

function init(){
    getProductList();
    getCartList();
}
init();
