(function () {

  document.addEventListener('DOMContentLoaded', function () {

      var searchInput = document.getElementById("eth-co-search-input");

      setUpTabListeners();
      setUpClearedListeners()

    var clearSearchBtn = document.getElementById("clear-search-btn");
    clearSearchBtn.addEventListener("click", (e)=>{
      var searchInput = document.getElementById("eth-co-search-input");
      searchInput.value = "";
      var searchResults = document.getElementById("eth-co-ext-search-list");
      searchResults.hidden = true;
    });

    const debounced = debounce(searchTyped, 500);

    searchInput.addEventListener("keyup", debounced);

    refreshAll()


  });

  function refreshAll(){
    getRecents();
    getFavoties();
    getRecentlySearched()
  }

  function search(searchTerm){
    var url = eth_autocomplete + "?json=%7B%22user_input%22%3A%22"+searchTerm+"%22%7D";
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(data) {
      
      var ens = data.ens;
      if (ens.length == 0){
        var ul = document.getElementById("eth-co-ext-search-list");
        var li = document.createElement("li");
          li.classList.add("list-group-item")
          var span = document.createElement("span")
          span.innerHTML = ens[i].highlighted;
          li.appendChild(document.createElement("No ens domains found"));
          ul.appendChild(li);
          return;
      }else {

        favoriteDomainStorage.get((favorites)=>{
          var ul = document.getElementById("eth-co-ext-search-list");
          ul.innerHTML = "";
          for (var i = 0;  i < ens.length; i++){
            
            var li = document.createElement("li");
            li.classList.add("list-group-item")
            var span = document.createElement("span");
            span.innerHTML = ens[i].highlighted;
            li.append(span);
            var img = document.createElement('img');
            img.classList.add("fav-icon");
            img.setAttribute("domain", ens[i].name)
            if(favorites.includes(ens[i])){
              img.src = chrome.runtime.getURL("/public/icons/fav-selected.png")
              img.addEventListener("click", (e)=>{
                e.target.src = chrome.runtime.getURL("/public/icons/fav.png")
                removeFromFavorites(e.target.getAttribute('domain'))
              });
            } else {
              img.src = chrome.runtime.getURL("/public/icons/fav.png")
              img.addEventListener("click", (e)=>{
                e.target.src = chrome.runtime.getURL("/public/icons/fav-selected.png")
                addToFavorites(e.target.getAttribute('domain'))
              });
            }
            var viewImg =  document.createElement('img');
            viewImg.setAttribute("domain", ens[i].name)
            viewImg.src = chrome.runtime.getURL("/public/icons/view.png")
  
            viewImg.classList.add("view-icon");
            viewImg.addEventListener("click", (e)=>{
              viewDomainFromSearch(e.target.getAttribute('domain'))
            });
            li.append(img);
            li.append(viewImg);
            ul.append(li);
          }
        });


        
          

       
      }
      
    }).catch(function(e) {
    });
  }


  function setUpClearedListeners(){
    var recent = document.getElementById("recent-eth-co-ext-clear-btn")
    recent.addEventListener("click", clearRecents)

    var favorite = document.getElementById("favorite-eth-co-ext-clear-btn")
    favorite.addEventListener("click", clearFavorites)

    var search = document.getElementById("search-eth-co-ext-clear-btn")
    search.addEventListener("click", clearSearch);
  }

  function clearSearch(){
    searchDomainStorage.set([], ()=>{
      refreshAll()
    })
  }

  function clearFavorites(){
    favoriteDomainStorage.set([], ()=>{
      refreshAll()
    });
  }

  function clearRecents(){
    ethDomainStorage.set([], ()=>{
      refreshAll()
    })
  }

  function debounce (fn) {

    // Setup a timer
    let timeout;
  
    // Return a function to run debounced
    return function () {
  
      // Setup the arguments
      let context = this;
      let args = arguments;
  
      // If there's a timer, cancel it
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }
  
      // Setup the new requestAnimationFrame()
      timeout = window.requestAnimationFrame(function () {
        fn.apply(context, args);
      });
  
    };
  
  }

  function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  }

  
  function searchTyped(event){
    var searchInput = document.getElementById("eth-co-search-input");
    var searchResults = document.getElementById("eth-co-ext-search-list");
    if(searchInput.value == ""){
      searchResults.hidden = true
    } else {
      searchResults.hidden = false
    }
    search(searchInput.value);
  }


  function getRecents(){

     ethDomainStorage.get((domains)=>{

      favoriteDomainStorage.get((favorites)=>{
        var ul = document.getElementById("recent-list");
        ul.innerHTML = "";
        if(domains.length == 0){
          var li = document.createElement("li");
          li.classList.add("list-group-item")
          li.appendChild(document.createTextNode("You haven't come across any .eth addresses in web browsing"));
          ul.appendChild(li);
          return;
        }
        for (var i = 0;  i < domains.length; i++){
          var li = document.createElement("li");
          li.classList.add("list-group-item")
          var img = document.createElement('img');
          img.classList.add("fav-icon");
          img.setAttribute("domain", domains[i])
          if(favorites.includes(domains[i])){
            img.src = chrome.runtime.getURL("/public/icons/fav-selected.png")
            img.addEventListener("click", (e)=>{
              e.target.src = chrome.runtime.getURL("/public/icons/fav.png")
              removeFromFavorites(e.target.getAttribute('domain'))
            });
          } else {
            img.src = chrome.runtime.getURL("/public/icons/fav.png")
            img.addEventListener("click", (e)=>{
              e.target.src = chrome.runtime.getURL("/public/icons/fav-selected.png")
              addToFavorites(e.target.getAttribute('domain'))
            });
          }

          var viewImg =  document.createElement('img');
          viewImg.setAttribute("domain", domains[i])
          viewImg.src = chrome.runtime.getURL("/public/icons/view.png")

          viewImg.classList.add("view-icon");
          viewImg.addEventListener("click", (e)=>{
            viewDomain(e.target.getAttribute('domain'))
          });
        li.appendChild(document.createTextNode(domains[i]));
        li.appendChild(img);
        li.appendChild(viewImg);
        ul.appendChild(li);
        }
      });
    
      
     });

    
  }

  function getFavoties(){

      favoriteDomainStorage.get((favorites)=>{
        var domains = favorites
        var ul = document.getElementById("favorites-list");
        ul.innerHTML = "";
        if(domains.length == 0){
          var li = document.createElement("li");
          li.classList.add("list-group-item")
          li.appendChild(document.createTextNode("You don't have any favorites yet"));
          ul.appendChild(li);
          return;
        }
        for (var i = 0;  i < domains.length; i++){
          var li = document.createElement("li");
          li.classList.add("list-group-item")
          var img = document.createElement('img');
          img.classList.add("fav-icon");
          img.setAttribute("domain", domains[i])
          if(favorites.includes(domains[i])){
            img.src = chrome.runtime.getURL("/public/icons/fav-selected.png")
            img.addEventListener("click", (e)=>{
              e.target.src = chrome.runtime.getURL("/public/icons/fav.png")
              removeFromFavorites(e.target.getAttribute('domain'))
            });
          } else {
            img.src = chrome.runtime.getURL("/public/icons/fav.png")
            img.addEventListener("click", (e)=>{
              e.target.src = chrome.runtime.getURL("/public/icons/fav-selected.png")
              addToFavorites(e.target.getAttribute('domain'))
            });
          }

          var viewImg =  document.createElement('img');
          viewImg.setAttribute("domain", domains[i])
          viewImg.src = chrome.runtime.getURL("/public/icons/view.png")

          viewImg.classList.add("view-icon");
          viewImg.addEventListener("click", (e)=>{
            viewDomain(e.target.getAttribute('domain'))
          });
        li.appendChild(document.createTextNode(domains[i]));
        li.appendChild(img);
        li.appendChild(viewImg);
        ul.appendChild(li);
        }
      });
    
      

    
  }

  function getRecentlySearched(){
    searchDomainStorage.get((domains)=> {
      favoriteDomainStorage.get((favorites)=>{
     
        var ul = document.getElementById("search-list");
        ul.innerHTML = "";
        if(domains.length == 0){
          var li = document.createElement("li");
          li.classList.add("list-group-item")
          li.appendChild(document.createTextNode("You visited any search domains yet"));
          ul.appendChild(li);
          return;
        }
        for (var i = 0;  i < domains.length; i++){
          var li = document.createElement("li");
          li.classList.add("list-group-item")
          var img = document.createElement('img');
          img.classList.add("fav-icon");
          img.setAttribute("domain", domains[i])
          if(favorites.includes(domains[i])){
            img.src = chrome.runtime.getURL("/public/icons/fav-selected.png")
            img.addEventListener("click", (e)=>{
              e.target.src = chrome.runtime.getURL("/public/icons/fav.png")
              removeFromFavorites(e.target.getAttribute('domain'))
            });
          } else {
            img.src = chrome.runtime.getURL("/public/icons/fav.png")
            img.addEventListener("click", (e)=>{
              e.target.src = chrome.runtime.getURL("/public/icons/fav-selected.png")
              addToFavorites(e.target.getAttribute('domain'))
            });
          }
  
          var viewImg =  document.createElement('img');
          viewImg.setAttribute("domain", domains[i])
          viewImg.src = chrome.runtime.getURL("/public/icons/view.png")
  
          viewImg.classList.add("view-icon");
          viewImg.addEventListener("click", (e)=>{
            viewDomain(e.target.getAttribute('domain'))
          });
        li.appendChild(document.createTextNode(domains[i]));
        li.appendChild(img);
        li.appendChild(viewImg);
        ul.appendChild(li);
        }
      });
    })
    
  
  
  
}

  function addToFavorites(domain){
    favoriteDomainStorage.append(domain, ()=>{
    });
  }

  function removeFromFavorites(domain){
    favoriteDomainStorage.remove(domain, ()=>{
    })
  }

  function viewDomainFromSearch(domain){
    searchDomainStorage.append(domain);
    chrome.tabs.create({ url: "https:"+domain+".co" });
  }

  function viewDomain(domain){
    chrome.tabs.create({ url: "https:"+domain+".co" });
  }

  function setUpTabListeners(){
    var recents = document.getElementById("pills-recent-tab")
    var recentsContent = document.getElementById("pills-recent")

    var favorites = document.getElementById("pills-favorites-tab")
    var favoritesContent = document.getElementById("pills-favorites")

    var search = document.getElementById("pills-seardch-tab")
    var searchContent = document.getElementById("pills-search")

    recents.addEventListener("click", (e)=>{
      getRecents();
      getFavoties();
      getRecentlySearched();

      recents.classList.add("active")
      recentsContent.classList.add("show")
      recentsContent.classList.add("active")

      favorites.classList.remove("active")
      favoritesContent.classList.remove("show")
      favoritesContent.classList.remove("active")

      search.classList.remove("active")
      searchContent.classList.remove("show")
      searchContent.classList.remove("active")
    })

    favorites.addEventListener("click", (e)=>{
      getRecents();
      getFavoties();
      getRecentlySearched();

      recents.classList.remove("active")
      recentsContent.classList.remove("show")
      recentsContent.classList.remove("active")

      favorites.classList.add("active")
      favoritesContent.classList.add("show")
      favoritesContent.classList.add("active")

      search.classList.remove("active")
      searchContent.classList.remove("show")
      searchContent.classList.remove("active")
    })

    search.addEventListener("click", (e)=>{
      getRecents();
      getFavoties();
      getRecentlySearched();

      recents.classList.remove("active")
      recentsContent.classList.remove("show")
      recentsContent.classList.remove("active")

      favorites.classList.remove("active")
      favoritesContent.classList.remove("show")
      favoritesContent.classList.remove("active")

      search.classList.add("active")
      searchContent.classList.add("show")
      searchContent.classList.add("active")
    })

  }
})();
