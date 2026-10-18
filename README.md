Student Finance Tracker

A responsive, accessible expense tracker for students, built with plain HTML, CSS, and JavaScript (no frameworks).

Live site (GitHub Pages): https://humwamikaz-ops.github.io/SFT/
Demo video (unlisted): https://www.loom.com/share/68d687fb466743779807217bfd07ca2e
Chosen theme: Student Finance Tracker
Author: Umwamikazi Honorata (GitHub: humwamikaz-ops, email: h.umwamikaz@alustudent.com)
Features
Add, edit, and delete transactions (delete asks for confirmation; edit uses browser prompts)
Dashboard with record count, total spent, top category, transactions in the past week, and a 7-day bar chart
Spending cap message that is polite when under the cap and assertive when over it
Live regex search across description, category, and amount, with an "Ignore case" toggle and an inline message for invalid patterns
Sorting by date, description (A to Z), and amount (low to high)
Form validation with regular expressions and inline error messages
Records saved to localStorage and restored on reload
JSON export, and JSON import that checks the structure before replacing data
Responsive layout with breakpoints at 600px, 768px, and 1024px
Skip link, labelled inputs, ARIA live regions, and visible focus styles
External links open in a new tab
Project structure
index.html
tests.html
seed.json
README.md
.gitignore
scripts/
  storage.js      save and load with localStorage
  state.js        the records and add, update, delete
  validators.js   regex validation rules
  search.js       safe regex search and highlight
  ui.js           rendering, dashboard stats, chart
  main.js         starts the app and wires events
styles/
  sft.css
codevibe-reports/
  (CodeVibe report)
Data model
json
{
  "id": "rec_0001",
  "description": "Lunch at cafeteria",
  "amount": 12.5,
  "category": "Food",
  "date": "2026-10-12",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}

New records get an id like rec_ followed by a timestamp. The seed file uses ids like rec_0001.

Regex catalog
Rule	Pattern	Valid example	Invalid example
Description (no leading or trailing space)	^\S(?:.*\S)?$	Lunch at cafeteria	 Lunch
Advanced: repeated word (back-reference)	\b(\w+)\s+\1\b	Bus pass	lunch lunch
Amount	^(0|[1-9]\d*)(\.\d{1,2})?$	12.50	007, 1.234
Date format	^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$	2026-10-14	2025-13-01, 2025-9-5
Category	^[A-Za-z]+(?:[ -][A-Za-z]+)*$	Fast-food	Food123

The date pattern accepts impossible dates such as 2025-02-30, so the validator also builds a JavaScript Date and compares the year, month, and day. This rejects them.

The repeated-word rule is treated as an error, so "lunch lunch" cannot be saved.

Search

The search box takes any regular expression. Invalid patterns (for example [) show a message instead of crashing. Try:

Pattern	What it finds
\.\d{2}\b	Amounts with cents
(coffee|tea)	Beverage keywords
\b(\w+)\s+\1\b	Repeated words
Keyboard map
Key	Action
Tab / Shift+Tab	Move forward / backward through links, fields, and buttons
Enter on the skip link	Jump to the main content
Enter on a nav link	Go to that section
Enter in a form field	Submit the form
Enter or Space on a button	Activate Save, Edit, Delete, or Export
Arrow keys on a dropdown	Change the selected option
Accessibility notes
Landmarks: header, nav, main, sections, and footer, with one h1 and h2 headings for sections
Skip-to-content link is the first focusable element and appears when it receives focus
Every form control has a label bound with for and id
Form errors are linked to their inputs with aria-describedby
Form, search, and settings messages use role="status"
The cap message sets aria-live to polite when under the cap and assertive when over it
The table has a caption and scope="col" headers
The chart has role="img" with an aria-label
Visible focus outlines on links, buttons, inputs, and selects
Error and over-budget states use words as well as color
Animations are turned off for users who prefer reduced motion
How to run
Clone the repo.
Serve the folder with a local server, for example the VS Code Live Server extension. Opening index.html by double-clicking can block local files.
Open index.html.
How to run the tests

Open tests.html through the same local server (or the live site at /tests.html). It runs checks on the validators and lists PASS or FAIL for each one, with a summary line. All lines should show PASS. The tests cover basic valid and invalid inputs for description, amount, date, and category.

Import and export

Export downloads the current records as transactions.json. Import reads a JSON file and checks that it is a list and that each record has an id, a description, a numeric amount, a category, a date, and both timestamps. If the check fails, an error is shown and the current data is kept. After a valid import the app asks for confirmation before replacing records.

seed.json contains 10 sample records to try the import.

Known limitations
The spending cap, currency, and exchange-rate fields in Settings are not saved after a reload, and the currency selection does not convert amounts yet.
Editing uses browser prompts instead of inline editing.
Search highlighting marks the typed text literally, while filtering uses the full regular expression.
The Edit and Delete buttons do not yet have row-specific accessible names.
Records appear as a scrolling table on small screens rather than cards.
Credits and academic integrity

W3Schools (https://www.w3schools.com), used for reference and guidance:

https://www.w3schools.com/js/js_api_web_storage.asp : used for storing and retrieving data in a browser
https://www.w3schools.com/js/js_json.asp : used for learning how to send, receive, and store data
https://www.w3schools.com/js/js_regexp.asp : used for regular expressions
https://www.w3schools.com/js/js_htmldom.asp : used for DOM manipulation and querySelector
https://www.w3schools.com/jsref/met_document_createelement.asp : used for createElement
https://www.w3schools.com/js/js_array_methods.asp : used for learning the array methods used in my scripts

AI assistance: Anthropic. (2026). Claude (Sonnet 5.5) [Large language model]. https://claude.ai. Used in October 2026 for guidance and feedback while building this project: reviewing code I wrote, pointing out bugs and typos, and explaining concepts. I made all code changes myself. It also drafted this README, my seed data, and my commit messages, which I reviewed and edited.
