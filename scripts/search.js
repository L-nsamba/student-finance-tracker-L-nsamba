export function compileRegex(input, flags = 'i'){
    try{
        return input ? new RegExp(input, flags) : null;
    }catch(error){
        return null;
    }
}

export function highlightMatches(text, regex){
    if(!regex || !text) return text;

    return text.replace(regex, match => `<mark class="search-highlight">${match}</mark>`);
}

export function searchTransactions(transactions, searchPattern){

    //Checks if the search is empty
    if (!searchPattern.trim()){
        return transactions.map(transaction => ({
            ...transaction,
            originalDescription: transaction.description
        }));
    }


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
            ...transaction,
            description: highlightedDescription,
            originalDescription: transaction.description
        };
    });
}

export function setupSearch(transactions, renderFunction){
    const searchInput = document.querySelector('.search-container input');

    if(!searchInput) return;

    //Timeout creates an interval between user typing and computer searching for input
    let searchTimeout;

    searchInput.addEventListener('input', (event) => {
        //Cancels previous searches from history
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            const searchTerm = event.target.value;
            const filteredTransactions = searchTransactions(transactions, searchTerm);

            //Calling function to display filtered results that meet condition
            renderFunction(filteredTransactions);

        }, 500)
    });

    /*When the user hovers over the search box it will give them these hints
    of valid regex patterns*/
    searchInput.setAttribute('title', 'Supports regex patterns. Examples: /latte|milk/i, /\d{4,}/, /^lunch/');
}


export const financeRegexPatterns = {

    hasDecimals: /\.\d{2}\b/,

    foodKeywords: /(latte|coffee|tea|dinner|lunch|breakfast|snack)/i,

    duplicateWords: /\b(\w+)\s+\1\b/i,

    largeAmounts: /\b(5\d{4,}|\d{6,})\b/,

    categorySearch: /@(\w+)/,

}