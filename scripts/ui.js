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