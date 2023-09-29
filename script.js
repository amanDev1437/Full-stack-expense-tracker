
const expenseName = document.getElementById("name");
const expenseDate = document.querySelector("#date");
const expenseAmount = document.getElementById("amount");
const addData = document.getElementById("btn");
const expenseDatadiv = document.querySelector(".expense-data");


const apiUrl = "https://crudcrud.com/api/e0013f2201c241c09e8434687cd17dbe/expense";

let expenseTable;


function createTable() {
  if(!expenseTable){
    createTable = function () {};
  const CreateexpenseTable = document.createElement("table");
  CreateexpenseTable.className = "my-expenses";
  CreateexpenseTable.insertAdjacentHTML(
    "afterbegin",
    "<tr class='table-header'><th>Name</th><th>Date</th><th>Amount</th></tr>"
  );
  expenseDatadiv.appendChild(CreateexpenseTable);
  expenseTable = CreateexpenseTable;
  }
  
}


function createTableData() {
  const expenseTable = document.querySelector(".my-expenses");
  const row = expenseTable.insertRow();
  row.className = "table-row";
  row.insertAdjacentHTML(
    "beforeend",
    "<td class='expense-name'></td><td class='expense-date'></td><td class='expense-Amount'></td><td><button class='delete-expense'>X</button></td>"
  );
}


async function postExpense(name, date, amount) {
  try {
    const response = await axios.post(apiUrl, {
      name,
      date,
      amount,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting expense:", error);
  }
}


async function getExpenses() {
  try {
    if(!expenseTable){
        createTable();
    }
    const response = await axios.get(apiUrl);
    const expenses = response.data;
    
   
    
    expenses.forEach((expense) => {
      createTableData(); // Create a new row for each expense
      const expenseNameTable = document.querySelectorAll(".expense-name");
      const expenseDateTable = document.querySelectorAll(".expense-date");
      const expenseAmountTable = document.querySelectorAll(".expense-Amount");
      const row = expenseTable.rows[expenseTable.rows.length - 1];
      
      expenseNameTable.forEach((names) => {
        if (names.textContent.length === 0) {
          names.textContent = expense.name;
        }
      });
      expenseDateTable.forEach((dates) => {
        if (dates.textContent.length === 0) {
          dates.textContent = expense.date;
        }
      });
      expenseAmountTable.forEach((amt) => {
        if (amt.textContent.length === 0) {
          amt.textContent = expense.amount;
        }
      });
      
      
      const deleteButton = row.querySelector(".delete-expense");
      deleteButton.addEventListener("click", async () => {
        await deleteExpense(expense._id); 
        row.remove(); 
      });
    });
  } catch (error) {
    console.error("Error getting expenses:", error);
  }
}


async function deleteExpense(expenseId) {
  try {
    await axios.delete(`${apiUrl}/${expenseId}`);
  } catch (error) {
    console.error(`Error deleting expense with ID ${expenseId}:`, error);
  }
}


addData.addEventListener("click", async () => {
  if (
    expenseName.value.length === 0 ||
    expenseDate.value.length === 0 ||
    expenseAmount.value.length === 0
  ) {
    alert("Please fill all the required fields");
  } else {
    const name = expenseName.value;
    const Date = expenseDate.value;
    const amount = expenseAmount.value;
    expenseName.value = "";
    expenseDate.value = "";
    expenseAmount.value = "";

    const newExpense = await postExpense(name, Date, amount); 
    createTableData(); 

    const expenseNameTable = document.querySelectorAll(".expense-name");
    const expenseDateTable = document.querySelectorAll(".expense-date");
    const expenseAmountTable = document.querySelectorAll(".expense-Amount");

    expenseNameTable.forEach((names) => {
      if (names.textContent.length === 0) {
        names.textContent = newExpense.name;
      }
    });
    expenseDateTable.forEach((dates) => {
      if (dates.textContent.length === 0) {
        dates.textContent = newExpense.date;
      }
    });
    expenseAmountTable.forEach((amt) => {
      if (amt.textContent.length === 0) {
        amt.textContent = newExpense.amount;
      }
    });

    
    const row = expenseDatadiv.querySelector(".my-expenses").rows[
      expenseDatadiv.querySelector(".my-expenses").rows.length - 1
    ];
    const deleteButton = row.querySelector(".delete-expense");
    deleteButton.addEventListener("click", async () => {
      await deleteExpense(newExpense.id); 
      row.remove(); 
    });
  }
});


getExpenses();
