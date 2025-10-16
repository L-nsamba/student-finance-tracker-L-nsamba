import { loadSettings } from "./storage.js";
import { setupSearch, searchTransactions, compileRegex, highlightMatches } from "./search.js";
import { getTransactions, sortTransactions, editTransaction, deleteTransaction, getDashboardStats,
getLastSevenDaysTransactions, getLastSevenDaysDailyTotals, convertCurrency,
} from "./state.js";

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
        displayTable(transactions);
    }

    if (sectionId === 'card-view'){
        const transactions = getTransactions();
        displayTable(transactions);
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
    //This function handles both table and card creation
    const tbody = document.querySelector('.transactions-table tbody');
    const cardsContainer = document.querySelector('.cards-container');
    const settings = loadSettings();

    if (transactions.length === 0){
        if (tbody) tbody.innerHTML = '<tr><td colspan="5"> No transactions yet</td></tr>';

        if(cardsContainer) cardsContainer.innerHTML = '<p class="no-transactions">No transactions yet</p>';
        return;

    }

    //This if condition handles table creation for table view
    if (tbody){
        tbody.innerHTML = transactions.map(transaction => `
            <tr data-id="${transaction.id}">
                <td data-label="Description">
                ${isSearchResult ? transaction.description: transaction.originalDescription || transaction.description}
                </td>

                <td data-label="Amount">
                ${settings.defaultCurrency}
                ${convertCurrency(transaction.amount, 'UGX', settings.defaultCurrency).toLocaleString()}
                </td>
                <td data-label="Category">${transaction.category}</td>
                <td data-label="Date">${transaction.date}</td>
                <td data-label="Actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            </tr>`).join('');
    }

    if (cardsContainer) {

        //This if condition handles card creation for card view
        cardsContainer.innerHTML = transactions.map(transaction => `
            <div class="transaction-card" data-id="${transaction.id}">
                <h3>${transaction.description}</h3>
                <p class="card-amount">${settings.defaultCurrency}
                 ${convertCurrency(transaction.amount, 'UGX', settings.defaultCurrency).toLocaleString()}
                </p>
                <p class="card-category">${transaction.category}</p>
                <p class="card-date">${transaction.date}</p>
                <div class="card-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
            `).join('');
    }
}

export function initializeSearch(transactions){
    //Takes transactions, calls the search function & displays highlighted matches
    setupSearch(transactions, (filteredTransactions => {
        displayTable(filteredTransactions, true);
    }));
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
    const headers = document.querySelectorAll('.transactions-table th');

    //Sorts items in ascending order
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
    const cardsContainer = document.querySelector('.cards-container')

    table.addEventListener('click', (event) => {
        //Enables the actual editing on button of choice
        const button = event.target;
        const row = button.closest('tr');
        if (!row) return;
        handleEditDelete(button, row.dataset.id);
    });

    if(cardsContainer){
        cardsContainer.addEventListener('click', (event) => {
            const button = event.target;
            const card = button.closest('.transaction-card');
            if(!card) return;
            handleEditDelete(button, card.dataset.id);
        });
    }

    function handleEditDelete(button, transactionId){
        //Introducing of functionality to buttons on card view and table view
        if (button.classList.contains('edit-btn')){
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
            //Removal of deleted item history from dashboard overview
            if (deleteTransaction(transactionId)){
                const transactions = getTransactions();
                displayTable(transactions);
                updateDashboard(getDashboardStats());
            }
        }
    }
}

export function updateLastSevenDaysChart(){
    //Creation of the logic for the chart
    const lastSevenDaysElement = document.querySelector('#last_seven_days')

    if (!lastSevenDaysElement) return;

    const settings = loadSettings();
    const sevenDaysStats = getLastSevenDaysTransactions();

    const dailyTotals = getLastSevenDaysDailyTotals();
    const maxAmount = Math.max(...dailyTotals.map(day => day.total), 1);

    const barsHTML = dailyTotals.map(day => {
        const height = (day.total / maxAmount) *50;
        const dayName = new Date(day.date).toLocaleDateString('en-US', {weekday: 'short'});

        return `<div class="chart-bar" style="height: ${height}px"
        title="${dayName}: ${settings.defaultCurrency} ${convertCurrency(day.total, 'UGX',
        settings.defaultCurrency).toLocaleString()}"></div>`;

    }).join('');

    const convertedTotal = convertCurrency(sevenDaysStats.total, 'UGX', settings.defaultCurrency);

    const statValueElement = lastSevenDaysElement.querySelector('.stat-value');


    if (statValueElement){
        //Description of the chart's html structure
        statValueElement.innerHTML = `
            <h3>Last 7 Days</h3>
            <div class="simple-chart">
                <div class="chart-bars">${barsHTML}</div>
                <div class="chart-summary">
                    ${settings.defaultCurrency} ${convertedTotal.toLocaleString()}

                    <br><small>${sevenDaysStats.count} transactions</small>
                </div>
            </div>
        `
    };

}