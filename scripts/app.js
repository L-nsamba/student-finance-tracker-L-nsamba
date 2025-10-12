//Runs all the js

import { addTransaction, getDashboardStats, getTransactions } from "./state.js";
import { showSection, setupNavigation, renderTable, updateDashboard } from "./ui.js";

document.addEventListener('DOMContentLoaded', function(){
    setupNavigation();
    setupFormHandling();
    showSection('dashboard');

    //Load initial data
    const transactions = getTransactions();
    renderTable(transactions);
    updateDashboard(getDashboardStats());
});

function setupFormHandling(){
    //Function controls the forms initial setup

    const form = document.getElementById('transactions-form');

    form.addEventListener('submit', (event) => {
        //Prevention of submitting empty form
        event.preventDefault();

        const formData = new FormData(form);

        //Defining the parameters for the form
        const transaction = {
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount')),
            category: formData.get('category'),
            date: formData.get('date')
        };


        addTransaction(transaction);

        //Resets the form upon completion of adding transaction
        form.reset();

        //Updates the user interface
        const transactions = getTransactions();
        renderTable(transactions);
        updateDashboard(getDashboardStats());

        //Go back to dashboard
        showSection('dashboard');
        });
}
