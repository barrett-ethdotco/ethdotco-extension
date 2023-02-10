# eth.co extension

Simple extension that automatically finds any and all ens domains on webpages and adds ![logo-32](https://user-images.githubusercontent.com/123409972/218204945-797d5751-02af-4981-ae93-b72f65243fa0.png) into the page to let your preview and explore their eth.co profile!

##### Available on firefox add-ons and chrome web store
- [firefox](https://addons.mozilla.org/en-US/firefox/addon/ethdotco/)

- [chrome/brave](https://chrome.google.com/webstore/detail/ethco/hebnlkbbdabcfoeidgphflkpiddfanag)

###### Project setup
Code is shared between firefox and chrome. Firefox only supports v2 manifests so the only difference in running the project is using the correct manifest


###### Running on firefox:
- Copy the manifest-firefox.json to the project root and rename to manifext.json
- [Visit about:debugging#/runtime/this-firefox in firefox](about:debugging#/runtime/this-firefox)
- Tap on load temporary addon button and naviaget to the project and select the manifest.json

###### Running on chrome/brave:
- Copy the manifest-chrome.json to the project root and rename to manifext.json
- [Visit brave://extensions/ in brave](brave://extensions/) or [Visit chrome://extensions/ in chrome](chrome://extensions/)
- Tap on load unpacked button and navigate to the project root and select the manifest.json

