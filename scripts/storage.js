//Contains localStorage functions

const STORAGE_KEY = "finance-tracker-data";
const SETTINGS_KEY = "finance-tracker-settings"

//Function retrieves previously existing/ loaded data when executed
export function loadTransactions(){
    try{
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored): []
    }catch (error){
        console.error('Error loading transactions:', error);
        return [];
    }
}

//Function triggers the saving of new transactions if all fields meet criteria
export function saveTransactions(transactions){
    try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        return true;
    } catch (error) {
        console.error('Error saving transactions', error);
        return false;
    }
}

//JSON importation and exportation
export function exportToJSON(transactions){
    return JSON.stringify(transactions, null, 2);
}

export function importFromJSON(jsonString){
    try{
        const data = JSON.parse(jsonString);

        //Checking if it's an array
        if(Array.isArray(data)){
            return data;
        }
        throw new Error('Invalid data format')
    }catch(error){
        console.error('Error importing JSON:', error);
        return null;
    }
}

//Default currency settings
export function getDefaultSettings(){
    return{
        defaultCurrency: 'UGX',
        monthlyBudget: 0,
        exchangeRates: {KSH: 0.024, RWF: 0.32}
    }
}


export function saveSettings(settings){
    try{

        return true;
    } catch (error){
        console.error('Error saving settings', error)
        return false;
    }
}

//Currency settings storage
export function loadSettings(){
    try{
        const stored = localStorage.getItem(SETTINGS_KEY);

        return stored ? JSON.parse(stored) : {
            defaultCurrency: 'UGX',
            monthlyBudget: 0,
            exchangeRates: {KSH: 0.024, RWF: 0.32}
        };
    }catch (error){
        console.error('Error loading settings:', error)
        return getDefaultSettings();
    }
}
