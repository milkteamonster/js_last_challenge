const productWrap = document.querySelector(".productWrap")
const cartbuy = document.querySelector(".shoppingCart-tableList");
let cartData = []
// 加入購物車功能
productWrap.addEventListener("click", function(e){
  e.preventDefault();
if (e.target.innerText !== "加入購物車"){
    return
}

let productId = e.target.getAttribute('data-id'); // 產品id
let quantity = 1; // 產品數量基本值

// 計算該產品數量
cartList.forEach(item => {
    if (item.product.id == productId) { 
    quantity += item.quantity ;
    }
})

let addData = { // 加入購物車指定格式
    "data": {
    "productId": productId,
    "quantity": quantity
    }
};

axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/milktea/carts", addData)
    .then(res => {
    console.log(res);
    getCartList();
    })
    .catch(err => {
    console.log(err);
    })
})

//取得產品列表   
function getProductList(){
    axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/milktea/products")
    .then(function(response){
        productList = response.data.products;
        renderProductList(productList);
        itemFilter()
    })
    .catch(function(error){
        console.log(error)
    })
}

// 將產品列表資料渲染到畫面上
function renderProductList(productList){
    let str = "";
    productList.forEach((item)=>{
        str += `
        <li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${item.images}" alt="${item.description}">
        <a href="#" class="addCardBtn" data-id=${item.id}>加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
        </li>`
    })
    productWrap.innerHTML = str;
}

//產品列表過濾功能
const productSelect = document.querySelector(".productSelect");
function itemFilter(){
  productSelect.addEventListener("change", function(e){
    let str = "";
    productList.forEach((item)=>{
      //有選擇分類
         if(e.target.value == item.category){
          str += `
            <li class="productCard">
            <h4 class="productType">新品</h4>
            <img src="${item.images}" alt="${item.description}">
            <a href="#" class="addCardBtn" data-id=${item.id}>加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
            </li>`;
        productWrap.innerHTML = str;
         } 
         //全部分類
         else if (e.target.value == "全部"){
          str += `
          <li class="productCard">
          <h4 class="productType">新品</h4>
          <img src="${item.images}" alt="${item.description}">
          <a href="#" class="addCardBtn" data-id=${item.id}>加入購物車</a>
          <h3>${item.title}</h3>
          <del class="originPrice">NT$${item.origin_price}</del>
          <p class="nowPrice">NT$${item.price}</p>
          </li>`;
        productWrap.innerHTML = str;
         }
      })
  })
}


// 取得購物車列表
const cartTotal = document.querySelector(".cartTotal");
function getCartList(){
    axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/milktea/carts")
    .then(function(response){
        cartList = response.data.carts;
        renderCartList(cartList);
        cartTotal.textContent = response.data.finalTotal;
    })
    .catch(function(error){
        console.log(error)
    })
}

// 將購物車列表渲染到畫面上
function renderCartList(cartList){
  let str = "";
  cartList.forEach((item)=>{
    str += `
    <tr>
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
  });
  cartbuy.innerHTML = str;
}

// 刪除購物車內單一品項
cartbuy.addEventListener("click", function (e) {
    e.preventDefault(); //取消預設彈回
    let cartId = e.target.getAttribute("data-id");
    if (cartId == null) {
      return;
    }
    deleteCartItem(cartId);
  });
  function deleteCartItem(cartId) {
    axios
      .delete("https://livejs-api.hexschool.io/api/livejs/v1/customer/milktea/carts/${cartId}")
      .then(function (response) {
        alert("刪除單筆購物車成功！");
        getCartList();
      });
  }

// 清除購物車內全部產品
const discardAllBtn = document.querySelector(".discardAllBtn")
function deleteAllCartList() {
    axios.delete("https://livejs-api.hexschool.io/api/livejs/v1/customer/milktea/carts")
      .then(function (response) {
        alert("刪除全部購物車成功！");
        getCartList();
      })
      .catch(function (response) {
        alert("購物車已清空！");
      });
  }
discardAllBtn.addEventListener("click", deleteCart)
function deleteCart(e){
    e.preventDefault();
    deleteAllCartList();
}

// 訂單提交
const orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click",function(e){
  e.preventDefault();
  if(cartData.length ==0){
    alert("請加入購物車");
    return;
  }
  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const customerTradeWay = document.querySelector("#tradeWay").value;
  const inputArr = document.querySelectorAll("input")
  let inputHasEmptyStr = false; 
  inputArr.forEach((item) => {
    if (item.value === "") { // 若遍歷時輸入匡為空白
     inputHasEmptyStr = true; // 就改成「輸入匡有空白」
    }
  });
  if(inputHasEmptyStr){
    alert("請填入資料否則無法送出");
    return;
  }
//   if (customerName==""|| customerPhone==""|| customerEmail==""|| customerAddress==""|| customerTradeWay==""){
//     alert("請勿輸入空資訊");
//     return;
//   }
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/milktea/orders`,{
    "data": {
      "user": {
        "name": customerName,
        "tel": customerPhone,
        "email": customerEmail,
        "address": customerAddress,
        "payment": customerTradeWay
      }
    }
  }).then(function(response){
    alert("訂單建立成功");
     document.querySelector("#customerName").value="";
     document.querySelector("#customerPhone").value="";
     document.querySelector("#customerEmail").value="";
     document.querySelector("#customerAddress").value="";
     document.querySelector("#tradeWay").value="ATM";
    getCartList();
  })
  .catch(function(error) {
  console.error(error);
  alert("訂單建立失敗");})
})


// 網頁初始化動作
function init(){
    getProductList();
    getCartList();
  }
  init();

