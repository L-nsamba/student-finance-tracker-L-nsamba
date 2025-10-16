
import { addTransaction, editTransaction, getDashboardStats, getTransactions, setTransactions } from "./state.js";
import { showSection, setupNavigation, displayTable, updateDashboard, initializeSearch, setupSorting, setupEditAndDelete } from "./ui.js";
import { saveSettings, loadSettings, exportToJSON, importFromJSON } from "./storage.js";
import { validateTransaction } from "./validators.js";

document.addEventListener('DOMContentLoaded', function(){
    //Calling functions to execute tasks defined within them
    setupNavigation();
    setupFormHandling();
    setupImportExport();

    const transactions = getTransactions();
    const settings = loadSettings();

    showSection('dashboard');
    displayTable(transactions);
    updateDashboard(getDashboardStats());
    updateBudgetDisplay(settings);
    setupEditAndDelete();

});

function updateBudgetDisplay(settings){
    //Function contains the logic that adjusts content in features on dashboard overview

    const monthlyBudgetElement = document.querySelector('#monthly_budget .stat-value');
    const budgetRemainingElement = document.querySelector('#monthly_budget .budget-remaining');

    if (monthlyBudgetElement && budgetRemainingElement){

        const stats = getDashboardStats();

        //Constant defined will either display the new updated amount or a default (0)
        const monthlyBudget = settings.monthlyBudget || 0;
        const totalSpend = stats.totalSpend || 0;
        const remaining = monthlyBudget - totalSpend;

        //Displays monthly budget numeric value on html dashboard overview
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

    const transactionForm = document.getElementById('transactions-form');
    transactionForm.addEventListener('submit', handleTransactionSubmit);

    const settingsForm = document.getElementById('settings-form');
    settingsForm.addEventListener('submit', handleSettingsSubmit);
}

function handleTransactionSubmit(event){
    event.preventDefault();

    const formData = new FormData(event.target);
    const form = event.target;

    //This constant will be called upon when user is editing a saved transaction
    const isEditing = form.dataset.editingId;

    //Accessing the desired filled in fields from the form
    const transaction = {
        description: formData.get('description'),
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        date: formData.get('date')

    };

    //Constant defined to call the function that has form regex validation
    const validationResult = validateTransaction(transaction)

    //This if condition will return the error if a field doesnt meet regex criteria
    if(!validationResult.isValid){
        clearErrorMessages();
        validationResult.errors.forEach(error => {
            showError(error.field, error.message);
        });
        return;
    }

    clearErrorMessages();

    if (isEditing){
        editTransaction(isEditing, transaction);
        announceStatus('Transaction updated successfully');
    }else{
        addTransaction(transaction);
        announceStatus('Transaction added successfully');
    }

    //Clearing the old saved transaction from system memory
    form.reset();
    delete form.dataset.editingId;

    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.textContent = 'Add Transaction';

    const transactions = getTransactions();
    const settings = loadSettings();

    //Updates tables, dashboard overview, budget
    displayTable(transactions);
    updateDashboard(getDashboardStats());
    updateBudgetDisplay(settings);

    showSection('dashboard');
}

function clearErrorMessages(){

    //Will display an empty string and no output
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
}

function showError(field, message){
    const errorElement = document.getElementById(`${field}-error`);

    //Describes the nature of the error
    if (errorElement){
        errorElement.textContent = message;
        errorElement.style.display = 'block'
    }
}

function announceStatus(message){
    //This function contains the logic for announcements for screen readers
    const statusSr = document.getElementById('status-announcement');
    if (statusSr){
        statusSr.textContent = message;

        setTimeout(() => {
            statusSr.textContent = '';
        }, 3000);
    }
}

function handleSettingsSubmit(event){
    //This function defines the predefined settings for the settings//currency page
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
    announceStatus('Settings saved successfully');
}

function setupImportExport(){
    //Function gives the import and export JSON buttons clickable functionality
    const exportBtn = document.getElementById('export-btn');
    const importFile = document.getElementById('import-file');

    if (exportBtn){
        exportBtn.addEventListener('click', handleExport);
    }

    if (importFile){
        importFile.addEventListener('change', handleImport);
    }
}

function handleExport(){
    //Function allows user to download the JSON file I have created
    const transactions = getTransactions();
    if (transactions.length === 0){
        alert('No transactions to export!')
        return;
    }

    const jsonData = JSON.stringify(transactions, null, 2);

    //Blob in js means binary large object
    const blob = new Blob([jsonData], {type: 'application/json'});
    const url = URL.createObjectURL(blob);

    //Creation of an anchor tag to link the url to and download the json file on click
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.json'
    a.click();

    //Cleaning up url object
    URL.revokeObjectURL(url);

    alert('Exported successfully!')
    announceStatus(`Exported ${transactions.length} transactions successfully`)
}

function handleImport(event){
    //Function allows user to use their own JSON file
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e){
        try{
            const importedTransactions = importFromJSON(e.target.result);
            setTransactions(importedTransactions);
            displayTable(importedTransactions);
            updateDashboard(getDashboardStats());
            alert(`Imported ${importedTransactions.length} transactions!`)
            announceStatus(`Successfully imported ${importedTransactions.length} transactions`);

        } catch(error){
            alert('Import failed: ' + error.message)
        }

    };
    reader.readAsText(file);
}