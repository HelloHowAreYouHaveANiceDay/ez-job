

// get text from the currently active tab
const getTabText = async (tabId) => {
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
    fetch('http://www.example.com?par=0').then(r => r.text()).then(result => {
        // Result now contains the response text, do what you want...
    })
}

getTabText(getActiveTabId())