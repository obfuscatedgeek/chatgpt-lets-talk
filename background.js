const logMessage = msg => {
    console.log(">>>>>>>>>>>>>> BACKGROUND STARTS");
    console.log(msg);
    console.log("-------------- BACKGROUND ENDS");
}

chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {command: command});
    });
});

// chrome.runtime.onConnect.addListener(function(port) {
//     logMessage("Connected ....." + port);
//     port.onMessage.addListener(function(msg) {
//         logMessage(msg);
//         //  port.postMessage("Hi Popup.js");
//          port.postMessage(msg);

//          chrome.tabs.query({active: true}, tabs => {
//             const [currentTab] = tabs;

//             chrome.tabs.sendMessage(currentTab.id, msg);
//         });
//     });
// });