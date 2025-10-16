import { loadSettings } from "./storage.js";
import { setupSearch } from "./search.js";
import { getTransactions, sortTransactions, editTransaction, deleteTransaction, getDashboardStats, getLastSevenDaysTransactions, convertCurrency } from "./state.js";

export function showSection(sectionId){
    //Function gives nav-toggle & nav-links functionality
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    })

    const targetSection = document.getElementById(sectionId);
    targetSection.classList.remove('hidden');

    if (sectionId === 'table'){
        const transactions = getTransactions();
        setupSorting();
        initializeSearch(transactions)
    }

    if (sectionId === 'settings'){
        populateSettingsForm();
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    document.querySelector(`[href="#${sectionId}"]`).classList.add(`active`);

    closeMobileMenu();
}

export function setupNavigation(){
    //Function triggers the nav-links to display content upon being clicked
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetSection = link.getAttribute('href').substring(1);
            showSection(targetSection)
        });
    });

    setupMobileMenu();
}

export function setupMobileMenu(){
    //Responsible for triggering the menu toggle bar opening
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        const isExpanded = navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
    })
}

export function closeMobileMenu(){
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.remove('active');
}

export function populateSettingsForm(){
    //Loads initial default settings
    const settings = loadSettings();

    document.getElementById('currency').value = settings.defaultCurrency;
    document.getElementById('monthly-budget').value = settings.monthlyBudget;
    document.getElementById('ksh-rate').value = settings.exchangeRates.KSH;
    document.getElementById('rwf-rate').value = settings.exchangeRates.RWF;
}


export function displayTable(transactions, isSearchResult = false){
    //isSearchResult parameter displays highlighted text if true and normal transactions if false
    const tbody = document.querySelector('.transactions-table tbody');
    const settings = loadSettings();

    //Returns error message if transaction table is empty
    if (transactions.length === 0){
        tbody.innerHTML = '<tr><td colspan="5"> No transactions yet</td></tr>';
        return;
    }

    //This html content will be added each time a new transaction is created
    tbody.innerHTML = transactions.map(transaction => `
        <tr data-id="${transaction.id}">
            <td data-label="Description">
            ${isSearchResult ? transaction.description: transaction.originalDescription || transaction.description}
            </td>

            <td data-label="Amount">
            ${settings.defaultCurrency}
            ${convertCurrency(transaction.amount, 'UGX', settings.defaultCurrency.toLocaleString())}
            </td>

            <td data-label="Amount">${settings.defaultCurrency} ${transaction.amount.toLocaleString()}</td>
            <td data-label="Category">${transaction.category}</td>
            <td data-label="Date">${transaction.date}</td>
            <td data-label="Actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        </tr>`).join('');
}

export function initializeSearch(transactions){
    //Takes transactions, calls the search function & displays highlighted matches
    setupSearch(transactions, (filteredTransactions => {
        displayTable(filteredTransactions, true);
    }))
}

export function updateDashboard(stats){
    //Function ensures that added transactions reflect on dashboard overview
    const totalSpendElement = document.querySelector('#total_spend .stat-value');
    const totalTransactionsElement = document.querySelector('#total_no_of_transactions .stat-value');
    const topCategoryElement = document.querySelector('#top_category .stat-value');
    const lastSevenDaysElement = document.querySelector('#last_seven_days .stat-value')
    const sevenDaysStats = getLastSevenDaysTransactions();

    if (totalSpendElement){
        totalSpendElement.textContent = `${stats.currency} ${stats.totalSpend.toLocaleString()}`;
    }

    if (totalTransactionsElement){
        totalTransactionsElement.textContent = stats.totalTransactions;
    }

    if (topCategoryElement){
        topCategoryElement.textContent = stats.topCategory;
    }

    if(lastSevenDaysElement){
        //Addition of currency conversion logic whereby UGX is default currency
        const settings = loadSettings();
        const convertedTotal = convertCurrency(sevenDaysStats.total, 'UGX', settings.defaultCurrency)

        lastSevenDaysElement.textContent =
        `${stats.currency} ${convertedTotal.toLocaleString()} ${sevenDaysStats.count} transactions`
    };
}


export function setupSorting(){
    //Function controls the sorting according to category on the table view page
    const headers = document.querySelectorAll('.transactions-table th');

    headers.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            const sortBy = header.textContent.toLowerCase();
            const transactions = getTransactions();
            const sorted = sortTransactions(transactions, sortBy);
            displayTable(sorted)
        });
    });
}

export function setupEditAndDelete(){
    //Function gives the edit and delete buttons functionality
    const table = document.querySelector('.transactions-table');

    table.addEventListener('click', (event) => {

        const button = event.target;
        const row = button.closest('tr');

        if (!row) return;

        if (button.classList.contains('edit-btn')){
            const transactionId = row.dataset.id;
            const transactions = getTransactions();
            const transaction = transactions.find(t => t.id === transactionId);

            if (transaction){
                //Fetching the newly defined parameters
                document.getElementById('description').value = transaction.description;
                document.getElementById('amount').value = transaction.amount;
                document.getElementById('category').value = transaction.category;
                document.getElementById('date').value = transaction.date;

                const form = document.getElementById('transactions-form')
                form.dataset.editingId = transactionId;

                const submitBtn = form.querySelector('.submit-btn');
                submitBtn.textContent = 'Update Transaction';

                showSection('add-form');
            }
        }

        if (button.classList.contains('delete-btn')){
            const transactionId = row.dataset.id;
            //Removal of deleted item history from dashboard overview
            if (deleteTransaction(transactionId)){
                const transactions = getTransactions();
                displayTable(transactions);
                updateDashboard(getDashboardStats());
            }
        }
    });
}