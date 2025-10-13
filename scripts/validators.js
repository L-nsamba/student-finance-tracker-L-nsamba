//Contains regex validaton

export function validateDescription(description){

    //Ensures description is not left empty
    if(!description || description.trim() === ''){
        return{
            isValid: false,
            message: 'Description is required'
        };
    }

    //Pattern to ensure no trailing or leading space
    const regex = /^\S(?:.*\S)?$/;
    return{
        isValid: regex.test(description),
        message: 'Description cannot start or end with spaces'
    }
}


export function validateAmount(amount){

    //Ensures amount is not left empty
    if(!amount && amount !==0){
        return{
            isValid: false,
            message: 'Amount is required'
        };
    }

    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    /*
    Pattern for amount
    1.Allows 0 or numbers that dont start with leading zeros
    2. Only positive numbers
    3. Maximum two decimal places
    */

    return{
        isValid: regex.test(amount.toString()),
        message: 'Amount must be positive with max 2 decimal places'
    }
}

export function validateDate(date){
    if(!date){
        return{
            isValid: false,
            message: 'Date is required'
        };
    }

    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    /*
    Pattern for date
    1. Ensures it starts with 4 digits for the year
    2. The 4 digits are then followed by '-'
    3. Then followed by two digits for the month with max being 12
    4. Then followed with a dash and another two digits for date
    5. The leading digit must be either 1 or 0 for month
    6. The leading digit must be between 0 and 3 max for date
    */

    return{
        isValid: regex.test(date),
        message: 'Date must be in YYYY-MM-DD format'
    }
}

export function validateCategory(category){
    if(!category || category.trim() === ''){
        return{
            isValid: false,
            message: 'Category is required'
        };
    }
    const regex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    /*
    Pattern for category
    1. Category must start with a letter (not case-sensitive)
    2. Then followed by any other letters only
    3. It can contain a hypen or space as separator if words are spaced
    */

    return{
        isValid: regex.test(category) && category !== '',
        message: 'Category must contain only letters, spaces or hypen'
    };
}

export function validateNoDuplicateWords(text){
    const regex = /\b(\w+)\s+\1\b/i;
    /*
    Pattern explanation
    1. Ensures no words are repeated within description
    */

    return{
        isValid: !regex.test(text),
        message: 'Description cannot contain duplicate words '
    }
}

export function validateDescriptionStrength(text){
    //This function ensures description is of valid characters and length

    const regex = /^(?=(?:\S+\s+){2,}\S+$)[A-Za-z0-9\s.,!?]+$/;
    /*
    Pattern for validation of description
    1. Ensures atleast three spaces must appear to separate words in description
    2. Ensures no special characters expect punctuation
    */

    return{
        isValid: regex.test(text),
        message: 'Description should be atleast 3 words with only basic punctuation'

    };
}

export function validateTransaction(transaction){
    const errors = [];

    const descValidation = validateDescription(transaction.description);

    if (!descValidation.isValid){
        errors.push({field: 'description', message: descValidation.message});
    }

    const descStrengthValidation = validateDescriptionStrength(transaction.description);

    if(!descStrengthValidation.isValid){
        errors.push({field: 'description', message: descStrengthValidation.message});

    }

    const noDuplicateValidation = validateNoDuplicateWords(transaction.description);
    if(!noDuplicateValidation.isValid){
        errors.push({field: 'description', message: noDuplicateValidation.message})
    }

    const amountValidation = validateAmount(transaction.amount);
    if(!amountValidation.isValid){
        errors.push({field: 'amount', message: amountValidation.message});
    }

    const dateValidation = validateDate(transaction.date);
    if(!dateValidation.isValid){
        errors.push({field: 'date', message: dateValidation.message});
    }

    const categoryValidation = validateCategory(transaction.category);
    if(!categoryValidation.isValid){
        errors.push({field: 'category', message: categoryValidation.message})
    };

    return{
        isValid: errors.length === 0,
        errors: errors
    };
}

export function compileRegex(pattern, flags = 'i'){
    try{
        return pattern ? new RegExp(pattern, flags) : null;
    }catch(error){
        console.error('Invalid regex pattern:', pattern);
        return null;
    }
}