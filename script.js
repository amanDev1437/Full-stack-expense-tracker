
const expenseName = document.getElementById("name");
const expenseDate = document.querySelector("#date");
const expenseAmount = document.getElementById("amount");
const addData = document.getElementById("btn");
const expenseDatadiv = document.querySelector(".expense-data");

// Define the API endpoint URL
const apiUrl = "https://crudcrud.com/api/44874fb980e14e34b3434c4348864e80/expense";

let expenseTable;

// Function to create the table
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

// Function to create a new row in the table
function createTableData() {
  const expenseTable = document.querySelector(".my-expenses");
  const row = expenseTable.insertRow();
  row.className = "table-row";
  row.insertAdjacentHTML(
    "beforeend",
    "<td class='expense-name'></td><td class='expense-date'></td><td class='expense-Amount'></td><td><button class='delete-expense'>X</button></td>"
  );
}

// Function to post expense data to the API
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

// Function to retrieve expenses from the API and display them in the table
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
      
      // Add a delete event listener for each delete button
      const deleteButton = row.querySelector(".delete-expense");
      deleteButton.addEventListener("click", async () => {
        await deleteExpense(expense._id); // Delete the expense from the API
        row.remove(); // Remove the row from the table
      });
    });
  } catch (error) {
    console.error("Error getting expenses:", error);
  }
}

// Function to delete an expense from the API
async function deleteExpense(expenseId) {
  try {
    await axios.delete(`${apiUrl}/${expenseId}`);
  } catch (error) {
    console.error(`Error deleting expense with ID ${expenseId}:`, error);
  }
}

// Event listener for adding expense data
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

    const newExpense = await postExpense(name, Date, amount); // Post the expense to the API
    createTableData(); // Create a new row for the added expense

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

    // Add a delete event listener for the new delete button
    const row = expenseDatadiv.querySelector(".my-expenses").rows[
      expenseDatadiv.querySelector(".my-expenses").rows.length - 1
    ];
    const deleteButton = row.querySelector(".delete-expense");
    deleteButton.addEventListener("click", async () => {
      await deleteExpense(newExpense.id); // Delete the added expense from the API
      row.remove(); // Remove the row from the table
    });
  }
});

// Initialize the application by loading existing expenses from the API
getExpenses();
