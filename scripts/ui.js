//Contains DOM manipulation functions
export function showSection(sectionId){
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    })

    const targetSection = document.getElementById(sectionId);
    targetSection.classList.remove('hidden');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    document.querySelector(`[href="#${sectionId}"]`).classList.add(`active`);

    closeMobileMenu();
}


//Responsible for controlling the general menu toggle bar functionality
export function setupNavigation(){
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetSection = link.getAttribute('href').substring(1);
            showSection(targetSection)
        });
    });

    //Calling the setup function to trigger required action
    setupMobileMenu();
}

//Responsible for triggering the menu toggle bar opening
export function setupMobileMenu(){
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    })
}

//Responsible for triggering the menu toggle bar closing
export function closeMobileMenu(){
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.remove('active');
}

export function renderTable(transactions){
    const tbody = document.querySelector('.transactions-table tbody');

    //Returns error message if transaction table is empty
    if (transactions.length === 0){
        tbody.innerHTML = '<tr><td colspan="5"> No transactions yet</td></tr>';
        return;
    }

    //Returns the transaction items if has added any yet
    tbody.innerHTML = transactions.map(transaction => `
        <tr>
            <td>${transaction.description}</td>
            <td>${transaction.amount.toLocaleString()}</td>
            <td>${transaction.category}</td>
            <td>${transaction.date}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        </tr>`).join('');
}

export function updateDashboard(stats){
    //Updates dashboard elements

    const totalSpendElement = document.querySelector('#total_spend .stat-value');
    const totalTransactionsElement = document.querySelector('#total_no_of_transactions .stat-value');
    const topCategoryElement = document.querySelector('#top_category .stat-value');

    if (totalSpendElement){
        totalSpendElement.textContent = `${stats.currency} ${stats.totalSpend.toLocaleString()}`;
    }

    if (totalTransactionsElement){
        totalTransactionsElement.textContent = stats.totalTransactions;
    }

    if (topCategoryElement){
        topCategoryElement.textContent = stats.topCategoryElement
    }
}