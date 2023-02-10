
(() => {
    var ethDomains = [];
    
    // listener when page loads
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;
        if (type === "page-load") {
            removeAll()
        }
    });

    // if page has been checked for ens go through and remove any old profile links
    function removeAll(){
        var items = document.getElementsByClassName("eth-co-links");
        for(var i =0; i < items.length; i ++){
            var itemNumber = items.length - i -1
            items[itemNumber].remove();
        }
        addObserver()
        checkPageForEthDomains();

    }

    // observer listens for dom changes. we have to turn it off when we add our ethco elements otherwise we would get in forever loop
    function addObserver(){
        new MutationObserver(function(mutations, obs) {
            obs.disconnect()
            checkPageForEthDomains()
            addObserver()
        }).observe(document.body, { attributes: true, childList: true, characterData: true, subtree:true });
    }

    const checkPageForEthDomains = async () => {
        findAndReplace()
    }

    // add popover to page when user clicks on a profile
    var addPopover = function(user){

        if (document.getElementById("eht-co-pop-over-main") != undefined){
            return
        }

        document.body.setAttribute("class", "eht-co-stop-scrolling");
        var slideOver = document.createElement( 'div' );
        slideOver.id = "eht-co-pop-over-main";
        slideOver.setAttribute("id", "eht-co-pop-over-main")
        slideOver.setAttribute("class", "eht-co-popover-main")
         buildPopover(user, (popover)=>{
            slideOver.innerHTML = popover
            document.body.insertAdjacentElement("afterbegin", slideOver);
            var closeBtn = document.getElementById("eth-co-ext-close-btn");
            closeBtn.addEventListener("click", (e)=>{
                hidePopOver();
            })
            var favorite = document.getElementById("ethco-favorite-domain")
            favorite.addEventListener("click", favoritePopOver);
         });
      
    }

    // ad domain to the favorites list if user clicks the favorite button when the popover is shown
    function favoritePopOver(e){
        var favorite = e.target;
        var domain = favorite.getAttribute("domain")
        var isFavorite = favorite.getAttribute("isFavorite")
        if(isFavorite == "true"){
            favorite.src =  chrome.runtime.getURL("/public/icons/fav-white.png");
            favoriteDomainStorage.remove(domain,()=>{
            });
            favorite.setAttribute("isFavorite", "false")
        }else{
            favorite.src =  chrome.runtime.getURL("/public/icons/fav-selected.png");
            favoriteDomainStorage.append(domain, ()=>{
            });
            favorite.setAttribute("isFavorite", "true")
        }
    }

    // remove the popover if user clicks close
    function hidePopOver(){
        var slideOver = document.getElementById("eht-co-pop-over-main") 
        slideOver.innerHTML = "";
        slideOver.remove(slideOver);
        document.body.classList.remove("eht-co-stop-scrolling")
    }

    // returns the element that slides over and displays ethco
    var buildPopover = function(user, cb){

        favoriteDomainStorage.get((favorites)=>{

            var imgSrc = "/public/icons/fav-white.png";
            var contains = favorites.includes(user)
            if(contains){
               imgSrc = "/public/icons/fav-selected.png";
            }

            var slideOver = 
            "<div class='eht-co-popover-full-screen'>"+
                "<div id='eth-co-popover' class='eht-co-popover-container'>"+
                    '<div style="cursor:pointer; left:-45px; width:40px; height:40px; position:absolute;"><img  id="eth-co-ext-close-btn" style="width:40px;height:40px;" src="'+chrome.runtime.getURL("/public/icons/close.png")+'"></div>'+
                    '<div style="left:-40px; top:55px; width:40px; height:40px; position:absolute; cursor:pointer" id="ethco-fav"  ><img id="ethco-favorite-domain"  domain="'+ user +'" isFavorite="'+ contains +'" style="width:30px;height:30px;" src="'+chrome.runtime.getURL(imgSrc)+'"></div>'+
                    '<div style="left:-40px; top:110px; width:40px; height:40px; position:absolute; cursor:pointer" id="ethco-fav" ><a href="https://'+user+'.co" target="_blank"><img style="width:30px;height:30px;" src="'+chrome.runtime.getURL("public/icons/view-white.png")+'"></a></div>'+
                    "<iframe src='"+chrome.runtime.getURL('/src/iframe.html?user='+user)+"' style='width:100%; height:100%;'></iframe>"+
                "</div>"+
            "</div>"
            cb(slideOver)
        });

       
    }

    
    // quer the dom and return elements found
    function getElementsByXPath(xpath, parent){
        let results = [];
        let query = document.evaluate(xpath, parent || document,
            null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
            results.push(query.snapshotItem(i));
        }
        return (results);
    }

    // uses xpath query to locat all .eth domains
    const findAndReplace = async ()=> {

        var xpath = "//*[contains(text(),'.eth')]";
        var items = getElementsByXPath(xpath, document)

        var domains = []
        // loop through all eth domains and add our ethco icon and other elements
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let text = item.textContent;
            const regex = /\w*.eth\b/g;
            const handles = text.match(regex);
            var link = item.getElementsByClassName("eth-co-links");
            // check to make sure we didn't already add our element to the item
            if (link.length == 0  &&  item.tagName != "TITLE" && item.tagName != "SCRIPT" && handles[0] != undefined){
                const newURL = 'http://'+handles[0]+'.co'
                var popup = getLink(handles[0])
                domains.push(handles[0])
                item.appendChild(popup);
                // add mouser and other event listners to elements
                popup.addEventListener("mouseover",(e)=>{
                    var domain = e.target.getAttribute("domain")
                    var profilePreview = document.createElement('div');
                    profilePreview.classList.add("eht-co-ext-popup");
                    profilePreview.setAttribute("domain", domain);
                    profilePreview.innerHTML = '<iframe style="z-index:20;" id="eht-co-hover-popover" src="'+ chrome.runtime.getURL("/src/hoverview.html?user="+domain) +'" />';
                    var rect = e.target.getBoundingClientRect();
                    profilePreview.style.left = rect.left+'px';
                    profilePreview.style.top = rect.top+'px';
                    document.body.appendChild(profilePreview);
                    var clickArea = document.createElement("div")
                    clickArea.setAttribute("domain", domain);
                    clickArea.classList.add("eht-co-ext-popup-clickarea")
                    profilePreview.appendChild(clickArea);

                    profilePreview.addEventListener("click", (e)=>{
                        var domain = e.target.getAttribute("domain");
                        addPopover(domain)
                        profilePreview.remove()
                    })

                    profilePreview.addEventListener("mouseout", (e)=>{
                        profilePreview.remove()
                    })

                    clickArea.addEventListener("mouseout", (e)=>{
                        profilePreview.remove()
                    })

                })

          popup.addEventListener("click",(e) => {
            e.preventDefault()
            var domain = e.target.getAttribute("domain");
            var text = e.target.parentElement.textContent;
            const regex = /\w*.eth\b/g;
            const handles = text.match(regex);
            addPopover(handles[0])
            return false;

      })
              
            } 
            
        }
        if( domains.length > 0 ){
            ethDomainStorage.append(domains, ()=>{
            });
        }

    }
    
    function getLink(handle){
        var popup = document.createElement('img');
        popup.setAttribute("domain", handle);
        popup.classList.add("eth-co-links");
        popup.style = "cursor: pointer; width:20px; height:20px"
        popup.classList.add(["eth-co-ext-icon", "eth-co-links" ])
        popup.src = chrome.runtime.getURL("/public/icons/logo.png")
        return popup;
       
    }

    checkPageForEthDomains()
    findAndReplace()
})();