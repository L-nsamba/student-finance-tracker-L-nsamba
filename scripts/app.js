//Runs all the js

import { addTransaction, getDashboardStats, getTransactions } from "./state.js";
import { showSection, setupNavigation, renderTable, updateDashboard } from "./ui.js";
import { saveSettings, loadSettings } from "./storage.js";
import { validateTransaction } from "./validators.js";

document.addEventListener('DOMContentLoaded', function(){
    setupNavigation();
    setupFormHandling();

    //Load initial data
    const transactions = getTransactions();
    const settings = loadSettings();

    showSection('dashboard');
    renderTable(transactions);
    updateDashboard(getDashboardStats());
    updateBudgetDisplay(settings);
});

function updateBudgetDisplay(settings){

    /*Function contains the logic to adjust the monthly budget and total spend
    on the dashboard overview. It also carries out the  calculations for amount remaining*/

    const monthlyBudgetElement = document.querySelector('#monthly_budget .stat-value');

    const budgetRemainingElement = document.querySelector('#monthly_budget .budget-remaining');

    if (monthlyBudgetElement && budgetRemainingElement){

        const stats = getDashboardStats();



        const monthlyBudget = settings.monthlyBudget || 0;
        const totalSpend = stats.totalSpend || 0;
        const remaining = monthlyBudget - totalSpend;

        //Displays monthly budget numeric value
        monthlyBudgetElement.textContent = `${settings.defaultCurrency} ${monthlyBudget.toLocaleString()}`;

        if (remaining >= 0){
            budgetRemainingElement.textContent = `${settings.defaultCurrency} ${remaining.toLocaleString()} remaining`;

            budgetRemainingElement.style.color = '#27ae60'
        }else{
            budgetRemainingElement.textContent = `${settings.defaultCurrency} ${Math.abs(remaining).toLocaleString()} over budget`;
            budgetRemainingElement.style.color = '#e74c3c'
        }
    }
}

function setupFormHandling(){
    //Function controls the forms initial setup

    //Transaction form
    const transactionForm = document.getElementById('transactions-form');
   transactionForm.addEventListener('submit', handleTransactionSubmit);

    //Settings form
    const settingsForm = document.getElementById('settings-form');
    settingsForm.addEventListener('submit', handleSettingsSubmit);
}

function handleTransactionSubmit(event){
    event.preventDefault();

    const formData = new FormData(event.target);

    const transaction = {
        description: formData.get('description'),
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        date: formData.get('date')

    };

    const validationResult = validateTransaction(transaction)

    if(!validationResult.isValid){
        clearErrorMessages();
        validationResult.errors.forEach(error => {
            showError(error.field, error.message);
        });
        return;
    }

    clearErrorMessages();

    addTransaction(transaction);

    event.target.reset();



    const transactions = getTransactions();
    const settings = loadSettings();

    renderTable(transactions);
    updateDashboard(getDashboardStats());
    updateBudgetDisplay(settings);

    //Updates the dashboard overview
    showSection('dashboard');
}

function clearErrorMessages(){
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
}

function showError(field, message){
    const errorElement = document.getElementById(`${field}-error`);

    if (errorElement){
        errorElement.textContent = message;
        errorElement.style.display = 'block'
    }
}

function handleSettingsSubmit(event){
    event.preventDefault();

    const formData = new FormData(event.target);

    const settings = {
        defaultCurrency: formData.get('currency'),
        monthlyBudget: parseFloat(formData.get('monthly-budget')) || 0,
        exchangeRates: {
            KSH: parseFloat(formData.get('ksh-rate')),
            RWF: parseFloat(formData.get('rwf-rate'))
        }
    };

    saveSettings(settings)



    updateBudgetDisplay(settings);
    updateDashboard(getDashboardStats());

    alert('Settings saved successfully')
}
