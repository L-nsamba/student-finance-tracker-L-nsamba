import { loadSettings } from "./storage.js";
import { setupSearch } from "./search.js";
import { getTransactions, sortTransactions } from "./state.js";

//Contains DOM manipulation functions
export function showSection(sectionId){
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


//Responsible for controlling the general menu toggle bar functionality
export function setupNavigation(){
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetSection = link.getAttribute('href').substring(1);
            showSection(targetSection)
        });
    });

    //Calling the setup function to trigger required action
    setupMobileMenu();
}

//Responsible for triggering the menu toggle bar opening
export function setupMobileMenu(){
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    })
}

//Responsible for triggering the menu toggle bar closing
export function closeMobileMenu(){
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.remove('active');
}

export function populateSettingsForm(){
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

    /*
    Adjusting the html to change output on transaction screen when
    user searches for specific element
     */
    tbody.innerHTML = transactions.map(transaction => `
        <tr>
            <td data-label="Description">
            ${isSearchResult ? transaction.description: transaction.originalDescription || transaction.description}
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
    //Updates dashboard overview elements

    const totalSpendElement = document.querySelector('#total_spend .stat-value');
    const totalTransactionsElement = document.querySelector('#total_no_of_transactions .stat-value');
    const topCategoryElement = document.querySelector('#top_category .stat-value');

    if (totalSpendElement){
        totalSpendElement.textContent = `${stats.currency} ${stats.totalSpend.toLocaleString()}`;
    }

    if (totalTransactionsElement){
        totalTransactionsElement.textContent = stats.totalTransactions;
    }

    if (topCategoryElement){
        topCategoryElement.textContent = stats.topCategory;
    }
}


export function setupSorting(){
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