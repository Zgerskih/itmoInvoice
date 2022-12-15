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

inpDocumentNumber.addEventListener("keyup", () => inpDocumentNumberVerification());

inpQtyElements.addEventListener("keyup", (event) => {
  console.log("> inpQtyElements:", event.currentTarget.value);
  currentWorkItem.qty = parseInt(event.currentTarget.value);
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
  currentWorkItem.cost = parseInt(event.currentTarget.value);
  inputTotalElements.innerHTML = currentWorkItem.total;
  checkCanCreate();
});

tableItems.addEventListener("click", (e) => {
  const target = e.target.tableItems;
  // console.log("click -> ", target, target.dataset.todoid);
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
  constructor(title = "", description = "", qty, cost) {
    this.id = null;
    this.title = title;
    this.description = description;
    this.qty = qty;
    this.cost = cost;
  }
  get total() {
    return (this.cost) * (this.qty);
  }
}

const invoiceVO = JSON.parse(localStorage.getItem("invoice")) || new InvoiceVO();
let currentWorkItem = null;

displayMessages();

function openPopupContainer(index) {
  console.log(index);
  currentWorkItem = index ? Object.create({}, invoiceVO.items[parseInt(index)]) : new WorkItemVO();
  console.log("> openPopupContainer -> currentWorkItem", currentWorkItem);
  btnCreateItem.disabled = true;
  popupContainer.style.display = "block";
  inpQtyElements.value = currentWorkItem.qty;
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

function sumOfItemsQtyAndCost() {
  const canCalculateTotal = currentWorkItem.qty && currentWorkItem.cost;
  currentWorkItem.total = canCalculateTotal ? currentWorkItem.qty * currentWorkItem.cost : 0;
  inputTotalElements.innerHTML = currentWorkItem.total;
}
function createItemSheet() {
  if (currentWorkItem.id == null) {
    currentWorkItem.id = Date.now();
    invoiceVO.items.push(currentWorkItem);
  } else {
    const index = invoiceVO.items.findIndex((vo) => vo.id === currentWorkItem.id);
    invoiceVO.items.splice(index, 1, currentWorkItem);
  }

  currentWorkItem = null;
  displayMessages();
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
    <td
    class="pointer-events-none text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
    >
    ${workItemVO.qty}
    </td>
    <td
    class="pointer-events-none text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
    >
    ${workItemVO.cost}
    </td>
    <td
    class="pointer-events-none text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
    >
    $${workItemVO.total}
    </td>
    </tr>
      `;
    subtotalResult.innerHTML = invoiceVO.items.reduce(function (prev, curr) {
      return prev + curr.total;
    }, 0);
  });
  tableItems.innerHTML = listItems;
}