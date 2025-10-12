//Runs all the js

import { showSection, setupNavigation } from "./ui.js";

document.addEventListener('DOMContentLoaded', function(){
    setupNavigation();
    showSection('dashboard');
})