const searchByName = document.getElementById('searchByName');
const searchByAmount = document.getElementById('searchByAmount');
const tableBody = document.querySelector('#customerTable tbody');
const chartCanvas = document.getElementById('transactionChart');
let newCart =""

let customers = [];
let transactions = [];

const apiUrl = 'https://raw.githubusercontent.com/Aly-Elsayed12/api/master/data.json';

document.addEventListener('DOMContentLoaded', async function() {
  let response = await fetch(apiUrl);
  let data = await response.json();
  customers = data.customers;
  transactions = data.transactions;
  displayCustomers(customers, transactions);
});

function displayCustomers(customers, transactions) {
  tableBody.innerHTML = '';
  customers.forEach(customer => {
    const customerTransactions = transactions.filter(transaction => transaction.customer_id === customer.id);
    customerTransactions.forEach(transaction => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${customer.id}</td>
        <td class="customer-name" data-customer-id="${customer.id}">${customer.name}</td>
        <td>${transaction.amount}</td>
        <td>${transaction.date}</td>
      `;
      tableBody.appendChild(row);
    });
  });

  const customerNameElements = document.querySelectorAll('.customer-name');
  customerNameElements.forEach(element => {
    element.addEventListener('click', () => {
      const customerId = parseInt(element.getAttribute('data-customer-id'));
      const customer = customers.find(c => c.id === customerId);
      displayChart(customer, transactions);
    });
  });
}

searchByName.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredCustomers = customers.filter(customer => customer.name.toLowerCase().includes(searchTerm));
  displayCustomers(filteredCustomers, transactions);
});

searchByAmount.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredTransactions = transactions.filter(transaction => transaction.amount.toString().includes(searchTerm));
  const customersWithFilteredTransactions = customers.filter(customer =>
    filteredTransactions.some(transaction => transaction.customer_id === customer.id)
  );
  displayCustomers(customersWithFilteredTransactions, filteredTransactions);
});

function displayChart(customer, transactions) {
  const customerTransactions = transactions.filter(transaction => transaction.customer_id === customer.id);
  const dates = customerTransactions.map(t => t.date);
  const amounts = customerTransactions.map(t => t.amount);

  if(newCart){
    newCart.destroy();
  }
    newCart =new Chart(chartCanvas, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Transaction Amount',
        data: amounts,
        backgroundColor: 'rgb(116, 12, 12)',
        borderColor: 'rgb(163, 28, 28)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
