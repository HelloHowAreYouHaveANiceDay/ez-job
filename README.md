# GPT Job Parser

A chrome extension that parses the selected text on the page and sends it to Airtable

See it in action [here](https://www.youtube.com/live/tOxOE5F2eJM?feature=share&t=1478)

## Installation

1. Clone the repo
2. Make an Airtable Base with a table that matches the `parseStructure` in `parser.js` 
3. Make a copy of `.secrets.template.js` and rename it to `.secrets.js`
4. Fill out `.secrets.js` with your OpenAI and Airtable secrets
5. Go to `chrome://extensions/`
6. Enable developer mode
7. Click on `Load unpacked`
8. Select the cloned repo
9. Load the extension

## Usage

1. go to a page with a job posting with text that you can select
2. select the text with the relevant information you want to parse (usually title and description)
3. click on the extension and click "Parse Job"
4. if successful, a new entry will be added to your airtable

