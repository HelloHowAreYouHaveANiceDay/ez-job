

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
   console.log(result)
}

// ge the id of the currently active tab 
const getActiveTabId = async () => {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true})
    return tabs[0].id
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
    getTabText(id)
    const schema = await getAirtableSchema()
    console.log('got ze schema')
    console.log(Object.keys(JSON.parse(schema)))
}

run()

