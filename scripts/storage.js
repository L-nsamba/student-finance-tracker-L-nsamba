

//Definition of keys to identify what's in localStorage
const STORAGE_KEY = "finance-tracker-data";
const SETTINGS_KEY = "finance-tracker-settings"

export function loadTransactions(){
    try{
        //Retrival of data from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);

        //Conversion into JSON string
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

export function exportToJSON(transactions){
    /*Function takes an array list of transactions and
    converts them to JSON string*/
    return JSON.stringify(transactions, null, 2);
}

export function importFromJSON(jsonString){
    //Converts JSON strings to usable JS
    try{
        //Tranformation of string into a real array
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

export function getDefaultSettings(){
    //Defines the parameters for the default settings
    return{
        defaultCurrency: 'UGX',
        monthlyBudget: 0,
        exchangeRates: {KSH: 0.024, RWF: 0.32}
    }
}


export function saveSettings(settings){
    //Stores the defined settings
    try{
        /*Converts settings object into JSON string since localStorage
        can only store text*/
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
            //Determines the default settings for currency & exchange rates
            const defaultSettings = {
                defaultCurrency: 'UGX',
                monthlyBudget: 0,
                exchangeRates: {KSH: 0.024, RWF: 0.32}
            };

            /*Calling of function to save default settings to display if user
            has not specified any currency*/
            saveSettings(defaultSettings)

            return defaultSettings;
        }

        /*Returns the saved settings from localStorage and
        converts JSON string of stored settings to a JS object*/
        return JSON.parse(stored);

    }catch (error){
        console.error('Error loading settings:', error);
        return getDefaultSettings();
    }

}