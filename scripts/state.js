
import { loadTransactions, saveTransactions } from "./storage.js";
import { loadSettings } from "./storage.js";

let transactions = loadTransactions();

export function getTransactions(){
    //Retrival of saved transactions if any
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
        //toISOString() method converts date into standard string format
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

//Currency convert logic in settings section
export function convertCurrency(amount, fromCurrency, toCurrency){
    const settings = loadSettings();

    if (fromCurrency === toCurrency) return amount;

    let amountInUGX = amount;

    if (fromCurrency !== 'UGX'){
        amountInUGX = amount / settings.exchangeRates[fromCurrency];
    }

    if (toCurrency === 'UGX'){
        return amountInUGX;
    }else{
        return amountInUGX * settings.exchangeRates[toCurrency];
    }
}

export function getDashboardStats(){
    //Computes dashboard summary statistics

    //Constants defined to access saved settings and transactions
    const settings = loadSettings();
    const totalTransactions = transactions.length;

    //Conversion of total spend to selected currency
    const totalSpendUGX = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalSpend = convertCurrency(totalSpendUGX, 'UGX', settings.defaultCurrency);

    //Determines how many times each category appears and stores in an object
    const categoryCount = {};
    transactions.forEach(t => {
        categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
    });

    const topCategory = Object.keys(categoryCount).reduce((a,b) =>
        //Identifys the key,value pair which has most appearances in the object
        categoryCount[a] > categoryCount[b] ? a : b, 'None');

    return {
        totalTransactions,
        totalSpend: totalSpend || 0,
        topCategory,
        currency: settings.defaultCurrency
    };
}
