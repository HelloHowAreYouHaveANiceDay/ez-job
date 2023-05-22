// Job Parser Chrome Extension
// 1. Get the selected text from the current tab
// 2. Send the text to OpenAI to parse the job description
// 3. Parse the response
// 4. Push the scraped job to Airtable



const parseStructure = {
    'jobTitle': 'string',
    'company': 'string',
    'location': 'string in the format of city, state',
    'jobDescription': 'string',
    'jobRequirements': 'string',
    'isHybrid': 'boolean',
    'isRemote': 'boolean',
    'salaryRangeLow': 'number',
    'salaryRangeHigh': 'number',
    'has401k': 'boolean',
    'hasEquity': 'boolean',
    'hasHealthInsurance': 'boolean',
    'hasDentalInsurance': 'boolean',
    'hasVisionInsurance': 'boolean',
}

// get text from the currently active tab
const getTabText = async (tabId) => {
    const tabText = await chrome.scripting.executeScript({
        target: {
            tabId,
        },
        // func: () => document.documentElement.innerText
        // get the selected string from the page
        func: () => window.getSelection().toString()
    })
    const { frameId, result } = tabText[0]
    const text = cleanText(result)
    console.log(text)
    return text
}

// get the id of the currently active tab 
const getActiveTabId = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    return tabs[0].id
}

const parseJobText = async (text) => {
    const body = JSON.stringify({
        'model': 'gpt-3.5-turbo',
        messages: [
            {
                "role": "system", "content": "[Output only JSON] [no prose]"
            },
            {
                "role": "user", "content": `parse the following information ${JSON.stringify(parseStructure)} from this text: ${text}`
            }
        ],
        // I like it spicy but not too hot
        'temperature': 0.7
    })


    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        'method': 'POST',
        'headers': {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Organization': OPENAI_ORG_ID,
            'Content-Type': 'application/json'
        },
        body,
    })

    const data = await response.json()

    // console.log(data)

    return data['choices'][0]['message']['content']
}


const postToAirtable = async (job) => {

    try {
        const response = await fetch('https://api.airtable.com/v0/appRthYTCjP35v3lA/Jobs', {
            'method': 'POST',
            'headers': {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    fields: job,
                    "typecast": true
                }
            )
        })

        console.log(await response.json())
    } catch (error) {
        console.error(error)
    }

}

const run = async () => {
    // 1. get the text from the currently active tab
    const id = await getActiveTabId()
    const text = await getTabText(id)
    // 2. send the text to OpenAI to parse the job description
    const content = await parseJobText(text)
    // if the content is valid json, post it to airtable
    if(isJson(content)){
        // 3. parse the response
        const results = JSON.parse(content)
        // 4. push the scraped job to Airtable
        await postToAirtable(results)
        changeModalText('Job posted to Airtable')
    } else {
        changeModalText(content)
    }
   
    console.log(results)
}

// clean the text to reduce token use
function cleanText(text) {
    return text.trim().replace(/\s+/g, ' ');
}

// checks if the returned content is valid json
// if OpenAI can't parse the description, it will return a error message
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// run the script when the button is clicked
document.getElementById('clickme').addEventListener('click', function () {
    run()
});

function changeModalText(message){
    var dialog = document.createElement('dialog');
    dialog.textContent = message;
    var button = document.createElement('button');
    button.textContent = 'Close';
    dialog.appendChild(button);
    button.addEventListener('click', function() {
      dialog.close();
    });
    document.body.appendChild(dialog);
    dialog.showModal();
}