
import { loadTransactions, saveTransactions } from "./storage.js";
import { loadSettings } from "./storage.js";

let transactions = loadTransactions();

export function getTransactions(){
    return transactions;
}

export function setTransactions(newTransactions){
    //Allows user to add new transaction that will be stored in localStorage
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

    //Addition of data to js object, saving to localStorage and returning new transactions
    transactions.push(newTransaction);
    saveTransactions(transactions);
    return newTransaction;
}

export function convertCurrency(amount, fromCurrency, toCurrency){
    //Currency conversion logic on settings page
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
    const settings = loadSettings();
    const totalTransactions = transactions.length;

    //Conversion to default currency (UGX)
    const totalSpendUGX = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalSpend = convertCurrency(totalSpendUGX, 'UGX', settings.defaultCurrency);

    //Determines how many appeareances each category item has
    const categoryCount = {};
    transactions.forEach(t => {
        categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
    });

    const topCategory = Object.keys(categoryCount).reduce((a,b) =>
        //Determines the top category by identifying the item with highest frequency in categoryCount
        categoryCount[a] > categoryCount[b] ? a : b, 'None');

    return {
        totalTransactions,
        totalSpend: totalSpend || 0,
        topCategory,
        currency: settings.defaultCurrency
    };
}

export function getLastSevenDaysTransactions(){
    //Function displays transaction stats over past week on dashboard overview
    const lastSevenDays = new Date();
    lastSevenDays.setDate(lastSevenDays.getDate() - 7);


    const recentTransactions = transactions.filter( t =>
        new Date(t.date) >= lastSevenDays
    );

    //Obtaining the total cost and number of transactions
    const total = recentTransactions.reduce((sum, t) => sum + t.amount, 0);
    const count = recentTransactions.length;

    return { total, count, transactions: recentTransactions};
}

export function getLastSevenDaysDailyTotals(){
    const dailyTotals = [];

    for (let i = 6; i >= 0; i--){
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        const dayTransactions = transactions.filter(t => t.date === dateString);
        const dayTotal = dayTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

        dailyTotals.push({
            date: dateString,
            total: dayTotal,
            count: dayTransactions.length
        });
    }
    return dailyTotals
}

export function sortTransactions(transactions, sortBy){
    //Functions enables sorting in ascending order
    const sorted = [...transactions];

    sorted.sort((a,b) => {
        switch(sortBy){
            //Comparison of elements to determine sort order
            case 'description':
                return a.description.localeCompare(b.description);

            case 'amount':
                return a.amount - b.amount;

            case 'date':
                return new Date(a.date) - new Date(b.date);

            case 'category':
                return a.category.localeCompare(b.category);

            default:
                return 0;
        }
    });

    return sorted
}

export function editTransaction(id, updatedData){
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        //Allows assignment of new timestamp
        Object.assign(transaction, updatedData, {
            updatedAt: new Date().toISOString()
        });
        saveTransactions(transactions);
        return transaction
    }
    return null;
}

export function deleteTransaction(id){
    //Allows deleting of previous transactions
    if(confirm('Are you sure you want to delete this transaction?')){
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions(transactions);
        return true;
    }
    return false;
}