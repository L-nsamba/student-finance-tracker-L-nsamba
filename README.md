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
├── 📄index.html                    #Contains the html code
├── 📁 styles/            
│   └── 📄 main.css                 #Styling the html
├── 📁 scripts/
│   └── 📄 app.js                   #Main app logic
│   └── 📄 state.js                 #App state management
│   └── 📄 storage.js               #localStorage
│   └── 📄 ui.js                    #DOM manipulation functions
│   └── 📄 validators.js            #Regex validation functions
│   └── 📄 search.js                #Search + highlighting functions
├── 📄 seed.json                    #Sample data
├── 📄 tests.html                   #Contains regex tests
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

### 🧑‍🦯 Screen Reader Support & Accessibility Features
<li>ARIA live regions announce status updates</li>
<li>Form labels properly associated with inputs</li>
<li>Semantic HTML structure for easy navigation</li>
<li>Skip Navigation Link to jump directly to main contents</li>
<li>Keyboard Navigation</li>
<li>Focus Indicators</li>
<li>Form Labels</li>
<li>Color Contrast</li>

### 🔍 Regex Validation Patterns Used
#### A). Form Validation Regex
1. Description - ``` /^\S(?:.*\S)?$/ ``` (No leading/ trailing spaces)
2. Amount - ``` /^(0|[1-9]\d*)(\.\d{1,2})?$/ ``` (Positive numbers)
3. Date - ``` /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/ ``` (YYYY-MM-DD format)
4. Category - ``` /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/ ``` (Letters, spaces, hypens)

#### B). Advanced Regex (Search)
1. Backward-reference - ``` /\b(\w+)\s+\1\b/i ``` (Find duplicate words e.g "tea tea at school":❌)
2. Alternation - ``` /coffee|tea/i ``` (Find key words e.g "coffee or tea": ✅ ) 

### 🧪 Testing
#### Regex Validation Tests
Open ``` tests.html ``` in your browser to run all regex validation tests. The tests cover the following:
<li>Description validation (spaces, empty strings)</li>
<li>Amount validation (decimals, leading zeros)</li>
<li>Date validation (format, invalid dates)</li>
<li>Category validation (special characters)</li>
<li>Advanced regex (duplicate words)</li>

### 🛠️ Tech Stack
<li>1. Frontend: Vanilla HTML, CSS, JavaScript</li>
<li>2. Deployment: GitHub Pages</li>

### 👤 Author
👨🏽‍💻**Leon Nsamba**<br>
📧 **Email: l.nsamba@alustudent.com**<br>
💻 **GitHub: [L-nsamba](https://github.com/L-nsamba)**



