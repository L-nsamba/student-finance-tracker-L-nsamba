//Definition of keys in localStorage
const STORAGE_KEY = "finance-tracker-data";
const SETTINGS_KEY = "finance-tracker-settings"

export function loadTransactions(){
    try{
        //Retrival of data from localStorage & conversion to JSON string
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored): []
    }catch (error){
        console.error('Error loading transactions:', error);
        return [];
    }
}

export function saveTransactions(transactions){
    try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        return true;
    } catch (error) {
        console.error('Error saving transactions', error);
        return false;
    }
}

export function exportToJSON(transactions){
    //Function facilitates the downloading of JSON files
    const data = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        transactions: transactions
    };
    return JSON.stringify(data, null, 2);
}

export function importFromJSON(jsonString){
    //Function facilitates the uploading of JSON files
    try{
        const transactions = JSON.parse(jsonString);

        if(!Array.isArray(transactions)){
            throw new Error('File must contain an array of transactions');
        }
        return transactions;
    }catch (error){
        throw new Error('Invalid JSON file')
    }
}

export function getDefaultSettings(){
    //Determines the default settings user has on first app usage
    return{
        defaultCurrency: 'UGX',
        monthlyBudget: 0,
        exchangeRates: {KSH: 0.024, RWF: 0.32}
    }
}


export function saveSettings(settings){
    try{
        //Conversion of text into JSON string
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (error){
        console.error('Error saving settings', error)
        return false;
    }
}

export function loadSettings(){
    //Retrieves the saved settings
    try{
        const stored = localStorage.getItem(SETTINGS_KEY);

        if(!stored){
            //Sets these currency settings to default
            const defaultSettings = {
                defaultCurrency: 'UGX',
                monthlyBudget: 0,
                exchangeRates: {KSH: 0.024, RWF: 0.32}
            };

            saveSettings(defaultSettings)
            return defaultSettings;
        }
        //Conversion of JSON string to JSON object
        return JSON.parse(stored);

    }catch (error){
        console.error('Error loading settings:', error);
        return getDefaultSettings();
    }

}