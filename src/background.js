// load storage
if( 'undefined' === typeof window){
  importScripts('./storage.js')
  importScripts('./appinfo.js') // this is our secret sauce
}
// listen for when pages load
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.status == "complete") {
   chrome.tabs.sendMessage(tabId, {
      type: "page-load",
    });
  }
});
