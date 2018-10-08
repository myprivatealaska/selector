
/* The function that finds and returns the selected text */
const getSelection = function () {
  let selection = window.getSelection();
  return (selection.rangeCount > 0) ? selection.toString() : '';
};

/* This line converts the above function to string
 * (and makes sure it will be called instantly) */
const codeString = ';(' + getSelection + ')();';


chrome.commands.onCommand.addListener(function(cmd){
  if(cmd === 'selectedText') {
    chrome.tabs.executeScript({
        code: codeString,
        allFrames: true
      },
      function (selectedTextPerFrame) {
        if (chrome.runtime.lastError) {
          alert('ERROR:\n' + chrome.runtime.lastError.message);
        }
        else if ((selectedTextPerFrame.length > 0)
          && (typeof(selectedTextPerFrame[0]) === 'string')) {

          let selectedText = selectedTextPerFrame[0];

          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let activeTab = tabs[0];
            let activeTabUrl = activeTab.url;

            chrome.storage.sync.set({selectedText : activeTabUrl}, function(result) {
              alert(selectedTextPerFrame[0]);
            });
          });
        }
      })
  }});