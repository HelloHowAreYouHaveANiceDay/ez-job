
const parseStructure = {
    'position': "",
    'company': '',
    'location': '',
    'isRemote': '',
    'salaryListed': '',
    'salaryLow': '',
    'salaryHigh': ''
}

// get text from the currently active tab
const getTabText = async (tabId) => {
    // console.log(`tab_id is ${tabId}`)
    const tabText = await chrome.scripting.executeScript({
        target: {
            tabId,
        },
        func: () => document.documentElement.innerText
    })
    const {frameId, result} = tabText[0]
    const text = cleanText(result)
//    console.log(text)
    return text
}

// ge the id of the currently active tab 
const getActiveTabId = async () => {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true})
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

    //   const payload = JSON.stringify({
    //     'model': 'gpt-3.5-turbo',
    //     messages: [
    //       {
    //           "role": "system", "content": "Output only JSON" 
    //       },
    //       {
    //           "role": "user", "content": `what is a good example of bad behavior?`
    //       }
    //     ],
    //     // I like it spicy but not too hot
    //     'temperature': 0.7
    //   })
    

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

    console.log(data)

    return data['choices'][0]['message']['content']
}


const getAirtableSchema = async () => {
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`, {
        headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`
        }
    })
    
    const text = response.text()

    return text
}

const run = async () => {
    const id = await getActiveTabId()
    const text = await getTabText(id)
    const content = await parseJobText(text)
    const results = JSON.parse(content)
    console.log(results)
    // const schema = await getAirtableSchema()
    // console.log('got ze schema')
    // console.log(Object.keys(JSON.parse(schema)))
}

function cleanText(text) {
    return text.trim().replace(/\s+/g, ' ');
}

run()

