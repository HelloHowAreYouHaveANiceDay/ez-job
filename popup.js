const getTabText = async () => {
    const tabText = await chrome.scripting.executeScript({
        target: {
            tabId: await getActiveTabId()
        },
        func: () => document.documentElement.innerText
    })
    const {frameId, result} = tabText[0]
   console.log(result)
}

const getActiveTabId = async () => {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true})
    return tabs[0].id
}

getTabText()