const domBtnPlus = document.getElementById('btnAddWorkItem');
const domBtnClose = document.getElementById('btnCloseWorkItemPopup');
const popup = document.getElementById('popup');
const domInputQty = document.getElementById('inputWorkItemQty');
const domInputCost = document.getElementById('inputWorkItemCost');
const domItemTotal = document.getElementById('workItemTotalContainer');
const domBtnCreateWorkItem = document.getElementById('btnCreateWorkItem');
const domLiItem = document.getElementById('liItem');

domBtnPlus.addEventListener('click', onBtnOpenAddWorkItem);
domBtnClose.addEventListener('click', onBtnCloseAddWorkItem);
domInputQty.addEventListener('keyup', totalItem);
domInputCost.addEventListener('keyup', totalItem);
domBtnCreateWorkItem.addEventListener("click", onCreateWorkItem)

function totalItem() {
  const qty = domInputQty.value;
  const cost = domInputCost.value;
  let total = qty * cost;
  domItemTotal.innerHTML = total;
  console.log(total, qty, cost);
  return total;
}

function onBtnOpenAddWorkItem() {
  popup.style.display = 'block';
}

function onBtnCloseAddWorkItem() {
  popup.style.display = 'none';
}
// //
// function onCreateWorkItem(event) {
//   console.log('> domBtnCreateWorkItem -> handle(click)', event)
// }

//проверка на disabled
// function onCreateWorkItemCheck () {
//   let $texts = $('#inputWorkItemQty, #inputWorkItemCost');
//   let $button = $('#btnCreateWorkItem');
//   $texts.on("change", function() {
//     let hasEmpty = $texts.filter(function() { return !$(this).val(); }).length > 0;
//     $button.prop('disabled', hasEmpty);
//   }).trigger('change');
// };

// function createWorkItem(){
// document.createElement("li"){
//   if (totalItem != 0 );
//   return domLiItem
//   }
// }
