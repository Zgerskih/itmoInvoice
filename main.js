// button
const btnOpenContainer = document.getElementById("btnAddItem");
const btnCloceContainer = document.getElementById("btnCloceContainer");
const btnCreateItem = document.getElementById("btnCreateItem");


btnCreateItem.addEventListener("click", createItemSheet);
btnCloceContainer.addEventListener("click", closePopupContainer);
btnOpenContainer.addEventListener("click", () => openPopupContainer());

//  input
const popupContainer = document.getElementById("popupContainer");
const inpDocumentNumber = document.getElementById("documentNumber");
const inpQtyElements = document.getElementById("inputQtyElements");
const inputCostElements = document.getElementById("inputCostElements");
const inputTotalElements = document.getElementById("inputTotalElements");
const tableItems = document.getElementById("tableItems");
const inpItemTitle = document.getElementById("inpItemTitle");
const inpDescription = document.getElementById("inpDescription");
const subtotalResult = document.getElementById("subtotalResult");
const discountResult = document.getElementById("discountResult");
const totalResult = document.getElementById("totalResult");
const popupBackgroundBlocker = document.getElementById("popupBackgroundBlocker");
const discountInput = document.getElementById("discountInput");

inpDocumentNumber.addEventListener("keyup", () => inpDocumentNumberVerification());
discountInput.addEventListener("keyup", () => {
  let discount = parseInt(discountInput.value);
  if (discount > 100) {
    discount = 100;
    discountInput.value = discount;
  }
  invoiceVO.discount = discount;
  calculateTotal()
});

inpQtyElements.addEventListener("keyup", (event) => {
  console.log("> inpQtyElements:", event.currentTarget.value);
  currentWorkItem.qty = parseInt(event.currentTarget.value) || 0;
  inputTotalElements.innerHTML = currentWorkItem.total;
  checkCanCreate();
});
inpItemTitle.addEventListener("keyup", (event) => {
  console.log("> inpItemTitle:", event.currentTarget.value);
  currentWorkItem.title = event.currentTarget.value;
  checkCanCreate();
});
inputCostElements.addEventListener("keyup", (event) => {
  console.log("> inputCostElements:", event.currentTarget.value);
  currentWorkItem.cost = parseInt(event.currentTarget.value) || 0;
  inputTotalElements.innerHTML = currentWorkItem.total;
  checkCanCreate();
});

tableItems.addEventListener("click", (e) => {
  const target = e.target;
  console.log("click -> ", target, target.dataset.todoid);
  if (target.dataset.todoid) {
    openPopupContainer(target.dataset.todoid);
  }
});
console.log(tableItems);

const checkCanCreate = () => {
  const result = !(currentWorkItem.title.length > 0 && currentWorkItem.total > 0);
  console.log("> checkCanCreate:", result);
  btnCreateItem.disabled = result;
};

class InvoiceVO {
  constructor() {
    this.id = "";
    this.items = [];
    this.discount = 0;
    this.iban = "";
  }
}

class WorkItemVO {
  constructor({id, title = "", description = "", qty = 0, cost = 0}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.qty = qty;
    this.cost = cost;
  }
  get total() {
    return (this.qty || 0) * (this.cost || 0);
  }
}

const invoiceVO = JSON.parse(localStorage.getItem("invoice")) || new InvoiceVO();
invoiceVO.items = invoiceVO.items.map((raw) => new WorkItemVO(raw))
let currentWorkItem = null;
displayMessages();
calculateTotal();

function openPopupContainer(index) {
  console.log('> openPopupContainer:',index);
  const copy = index ? { ...invoiceVO.items[parseInt(index)] } : {};
  currentWorkItem = new WorkItemVO(copy);
  console.log("> openPopupContainer -> currentWorkItem", currentWorkItem);
  btnCreateItem.disabled = true;
  popupContainer.style.display = "block";

  inpQtyElements.value = currentWorkItem.qty || '';
  inputCostElements.value = currentWorkItem.cost || '';
  inpItemTitle.value = currentWorkItem.title;
  inpDescription.value = currentWorkItem.description;
  inputTotalElements.innerHTML = currentWorkItem.total;
}

function closePopupContainer() {
  popupContainer.style.display = "none";
}


function inpDocumentNumberVerification() {
  const invoiceDocumentNumber = inpDocumentNumber.value;
  const checkingForNumber = invoiceDocumentNumber && !Number.isNaN(invoiceDocumentNumber);
  if (checkingForNumber) {
    return true;
  } else {
    alert("Enter the number");
  }
}

function createItemSheet() {
  console.log("> createItemSheet", currentWorkItem);
  if (currentWorkItem.id == null) {
    currentWorkItem.id = Date.now();
    invoiceVO.items.push(currentWorkItem);
  } else {
    const index = invoiceVO.items.findIndex((vo) => vo.id === currentWorkItem.id);
    invoiceVO.items.splice(index, 1, currentWorkItem);
  }

  currentWorkItem = null;
  closePopupContainer();
  displayMessages();
  calculateTotal();
  saveInvoice();
}

function saveInvoice() {
  localStorage.setItem("invoice", JSON.stringify(invoiceVO));
}

function displayMessages() {
  let listItems = "";
  invoiceVO.items.forEach((workItemVO, index) => {
    listItems += `
      <tr data-todoid="${workItemVO.id}"
    class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
    for="item_${index}"
      >
    <td data-todoid="${index}"
    class="pointer-events-none px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800"
    >
    ${workItemVO.title} <span class="text-gray-500"><br>${workItemVO.description}</span>
    </td>
    <td data-todoid="${index}"
    class="pointer-events-none text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
    >
    ${workItemVO.qty}
    </td>
    <td data-todoid="${index}"
    class="pointer-events-none text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
    >
    ${workItemVO.cost}
    </td>
    <td data-todoid="${index}"
    class="pointer-events-none text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
    >
    $${workItemVO.total}
    </td>
    </tr>
      `;
  });
  tableItems.innerHTML = listItems;
}
function calculateTotal(){
  const total = invoiceVO.items.reduce((prev, curr) => (prev += curr.total, prev), 0);
  const discount = (invoiceVO.discount || 0) / 100 * total;
  discountResult.innerHTML = `${discount}`;
  subtotalResult.innerHTML = `${total}`;
  totalResult.innerHTML = `${total - discount}`;
}