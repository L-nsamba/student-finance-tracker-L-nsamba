export function compileRegex(input, flags = 'i'){
    //Function prevents crashing of program incase of regex errors
    try{
        return input ? new RegExp(input, flags) : null;
    }catch(error){
        return null;
    }
}

export function highlightMatches(text, regex){
    //Highlighting of text that matches users search criteria
    if(!regex || !text) return text;

    return text.replace(regex, match => `<mark class="search-highlight">${match}</mark>`);
}

export function searchTransactions(transactions, searchPattern){
    //If condition facilitates the searching through description field
    if (!searchPattern.trim()){
        return transactions.map(transaction => ({
            ...transaction,
            originalDescription: transaction.description
        }));
    }

    const regex = compileRegex(searchPattern, 'gi');
    if(!regex){
        //The regex defined ensures case insensitivity
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


    searchInput.setAttribute('title', 'Supports regex patterns. Examples: /latte|milk/i, /\d{4,}/, /^lunch/');
}

export const financeRegexPatterns = {
    //Advanced regex pattern with backreferencing
    //Currently working on where to incorporate it in my app
    hasDecimals: /\.\d{2}\b/,
    foodKeywords: /(latte|coffee|tea|dinner|lunch|breakfast|snack)/i,
    duplicateWords: /\b(\w+)\s+\1\b/i,
    largeAmounts: /\b(5\d{4,}|\d{6,})\b/,
    categorySearch: /@(\w+)/,
}