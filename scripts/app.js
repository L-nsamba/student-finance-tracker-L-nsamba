//Runs all the js

import { addTransaction, getDashboardStats, getTransactions } from "./state.js";
import { showSection, setupNavigation, renderTable, updateDashboard } from "./ui.js";
import { saveSettings, loadSettings } from "./storage.js";

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
    const monthlyBudgetElement = document.querySelector('#monthly_budget .stat-value');

    const budgetRemainingElement = document.querySelector('#monthly_budget .budget-remaining');

    if (monthlyBudgetElement && budgetRemainingElement){

        const stats = getDashboardStats();


        const monthlyBudget = settings.monthlyBudget || 0;
        const totalSpend = stats.totalSpend || 0;
        const remaining = monthlyBudget - totalSpend;

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

function handleSettingsSubmit(event){
    event.preventDefault();

    const formData = new FormData(event.target);

    //debug
    const monthlyBudgetInput = formData.get('monthly-budget');
    console.log('Form monthly-budget value:', monthlyBudgetInput, 'Type:', typeof monthlyBudgetInput);

    //debug


    const settings = {
        defaultCurrency: formData.get('currency'),
        monthlyBudget: parseFloat(formData.get('monthly-budget')) || 0,
        exchangeRates: {
            KSH: parseFloat(formData.get('ksh-rate')),
            RWF: parseFloat(formData.get('rwf-rate'))
        }
    };

    saveSettings(settings)

    //debug
    const savedSettings = loadSettings();
    console.log('Settings after save:', savedSettings);



    updateBudgetDisplay(settings);
    updateDashboard(getDashboardStats());

    alert('Settings saved successfully')
}
