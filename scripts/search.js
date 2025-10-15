export function compileRegex(input, flags = 'i'){
    //Function assesses the validity of the regex
    try{
        return input ? new RegExp(input, flags) : null;
    }catch(error){
        console.log('Invalid regex pattern:', error);
        return null;
    }
}

export function highlightMatches(text, regex){
    //Function finds all matches of regex in the text
    if(!regex || !text) return text;

    //text.replace finds all matches while mark element highlights the matches
    return text.replace(regex, match => `<mark class="search-highlight">${match}</mark>`);

}

export function searchTransactions(transactions, searchPattern){

    //Checks if the search is empty
    if (!searchPattern.trim()){
        //Creates a new array for invalid matches
        return transactions.map(transaction => ({
            //Copies properties from original array
            ...transaction,

            //Storage of unhighlighted version
            originalDescription: transaction.description
        }));
    }

    /*
    gi represents the regex case sensitivity flags
    ie it allows users to enter different cases without penalizing them
     */
    const regex = compileRegex(searchPattern, 'gi');
    if(!regex){
        return transactions.map(transaction => ({
            ...transaction,
            originalDescription: transaction.description
        }));
    }

    return transactions.map(transaction => {
        //Creation of new array for highlighted matches
        const highlightedDescription = highlightMatches(transaction.description, regex);

        return{
            //Copying properties from original array
            ...transaction,
            //Storage of highlighted version
            description: highlightedDescription,

            //Storage of original for sorting
            originalDescription: transaction.description
        };
    });
}

export function setupSearch(transactions, renderFunction){
    const searchInput = document.querySelector('.search-container input');

    if(!searchInput) return;

    /*
    Timeout is necessary to allow computer to only search
    after a specified time has passed from user stopping typing
    so as to prevent immediately searching each character user types
    */
    let searchTimeout;

    searchInput.addEventListener('input', (event) => {
        //Cancels previous searches from history
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            const searchTerm = event.target.value;
            const filteredTransactions = searchTransactions(transactions, searchTerm);

            //Calling function to display filtered results that meet condition
            renderFunction(filteredTransactions);

        }, 300)
    });

    /*When the user hovers over the search box it will give them these hints
    of valid regex patterns*/
    searchInput.setAttribute('title', 'Supports regex patterns. Examples: /latte|milk/i, /\d{4,}/, /^lunch/');
}


export const financeRegexPatterns = {
    //Function has advanced regex patterns for finance tracking

    hasDecimals: /\.\d{2}\b/,

    foodKeywords: /(latte|coffee|tea|dinner|lunch|breakfast|snack)/i,

    duplicateWords: /\b(\w+)\s+\1\b/i,

    largeAmounts: /\b(5\d{4,}|\d{6,})\b/,

    categorySearch: /@(\w+)/,

}