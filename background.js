// Solution to loading problem found: http://stackoverflow.com/a/21071357/3457142
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    chrome.tabs.executeScript(null,{file:"gitApproval.js"});
});
