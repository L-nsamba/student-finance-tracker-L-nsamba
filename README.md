<h1 align="center">STUDENT FINANCE TRACKER 💰</h1>

### 🎯 Project Overview
<p> An accessible, responsive, vanilla HTML/CSS/JS Student Finance Tracker
that demonstrates semantic structure, mobile-first layouts, DOM manipulation, events, regex
validation & search, basic persistence, and clean modular code.
</p>

**GitHub Pages Demo**: https://l-nsamba.github.io/student-finance-tracker-L-nsamba/ <br>
**Video Demo**: https://youtu.be/95a7uKwjC_0

### 🏫 Learning Outcomes
<li>Regex - Validates inputs and power search (including one backreferencing pattern)</li>
<li>HTML/CSS - Semantic layout with responsive design (Flexbox + media queries)</li>
<li>JavaScript - DOM updates, event handling, sorting/filtering, modular structure and error handling</li>
<li>Data - Saving/loading to localStorage (JSON import/export with validation)</li>
<li>Accessibility (a11y) - Keyboard navigation, visible focus, ARIA live regions, and adequate color contrast</li>

### ✨ Core Features
<li>✅ Add/Edit/Delete Transactions with full validation</li> 
<li>✅ Advanced Search with regex support and highlighting</li>
<li>✅ Sortable Table - click any column header to sort</li>
<li>✅ JSON Import/Export - Data backup and restoration</li>
<li>✅ Mobile First Responsive Design - card layout on mobile devices</li>
<li>✅ Dashboard Analytics - spending overview and budget tracking</li>

### 📁 Project Structure
```plaintext
📁 student-finance-tracker-L-nsamba/
├── 📄index.html              
├── 📁 styles/
│   └── 📄 main.css
├── 📁 scripts/
│   └── 📄 app.js
│   └── 📄 state.js
│   └── 📄 storage.js
│   └── 📄 ui.js
│   └── 📄 validators.js
│   └── 📄 search.js
├── 📄 seed.json
├── 📄 tests.html
└── 📄 README.md              
```
### 🛠️ Setup & Installation
i. Clone the project repository
```sh
git clone https://github.com/L-nsamba/student-finance-tracker.git
cd student-finance-tracker
```
ii. Open in ```index.html ``` in any browser

### 📱Usage
<h3>💰 Adding Transactions</h3>
<li>Navigate to "Add Transactions" using the menu</li>
<li>Fill in form fields (description, category, amount, date)</li>
<li>Submit (fields will be validated to ensure they are in correct format)</li>

<h3>🔍 Searching Transactions</h3>
<li>Use the search box in "Table View"</li>
<li>Results highlighting matching text in the description field</li>

<h3>⬇️ Managing Data</h3>
<li>Export JSON: Download all transactions as a JSON file</li>
<li>Upload JSON: Upload JSON file to restore data</li>
<li>Sort : Click any column header to sort in ascending order</li>

### ⌨️ Keyboard Navigation
1. ```Tab``` - Navigates through interactive elements
2. ``` Shift + Tab ``` - Navigates backwards
3. ``` Enter ``` - Activate buttons/links
4. ``` Space ``` - Toggle mobile menu
5. ``` Skip Link ``` - Press Tab on page load to jump to main content

### 🧑‍🦯 Screen Reader Support
<li>ARIA live regions announce status updates</li>
<li>Form labels properly associated with inputs</li>
<li>Semantic HTML structure for easy navigation</li>

🚧 TBC
