//Contains application state management functions

//Importation of saved transaction history
import { loadTransactions, saveTransactions } from "./storage.js";

let transactions = loadTransactions();

export function getTransactions(){
    return transactions;
}

export function setTransactions(newTransactions){
    transactions = newTransactions;
    saveTransactions(transactions);
    return transactions;
}

export function addTransaction(transaction){

    //Creation of unique ID's and timestamps
    const newTransaction = {
        id: 'txn_' + Date.now(),
        ...transaction,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    //Adds to the current data
    transactions.push(newTransaction);

    //Saves to localStorage
    saveTransactions(transactions);

    //returns updated transaction list
    return newTransaction;
}


export function getDashboardStats(){
    //Function responsible for calculating totals, top category

    const totalTransactions = transactions.length;

    //Reduce method ensures each time an item is added its price is added to total spend
    const totalSpend = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

    //Finding top category
    const categoryCount = {};
    transactions.forEach(t => {
        categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
    });

    const topCategory = Object.keys(categoryCount).reduce((a,b) =>
        categoryCount[a] > categoryCount[b] ? a : b, 'None');

    return {
        totalTransactions,
        totalSpend,
        topCategory
    };
}
