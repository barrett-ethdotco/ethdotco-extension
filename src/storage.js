 const ethDomainStorage = {
  append: (values, cb) => {
    chrome.storage.sync.get((domains)=>{
      var domainsArray = Array.from(domains);
      var alldomains = domains.length == 0 ? Array.from(new Set(values)) : Array.from(new Set(domainsArray.concat(values)));
      chrome.storage.sync.set(
        {
          ethDomains: alldomains,
        }, () => {
          cb();
        });
    });
  },

    get: (cb) => {
      chrome.storage.sync.get({ethDomains:[]}, (result) => {
        cb(result.ethDomains.reverse() ?? []);
      });
    }, 
    
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          ethDomains: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  const favoriteDomainStorage = {
    get: (cb) => {
      chrome.storage.sync.get({favoriteDomain:[]}, (result) => {
        cb(result.favoriteDomain.reverse()?? []);
      });
    },
    remove:(value, cb) => {
      favoriteDomainStorage.get((result) => {
        var filteredArray = result.filter(function(e) { return e !== value })
        favoriteDomainStorage.set(filteredArray, ()=>{
          cb();
        })
      });
    },
    append: (values, cb) => {
      favoriteDomainStorage.get((domains)=>{
        var domainsArray = Array.from(domains);
        var alldomains = domains.length == 0 ? [values] : Array.from(new Set(domainsArray.concat(values)));
        chrome.storage.sync.set(
          {
            favoriteDomain: alldomains,
          }, () => {
            cb();
          });
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          favoriteDomain: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  const searchDomainStorage = {
    get: (cb) => {
      chrome.storage.sync.get({searchDomain:[]}, (result) => {
        cb(result.searchDomain.reverse() ?? []);
      });
    },
    remove:(value, cb) => {
      searchDomainStorage.get((result) => {
        var filteredArray = result.filter(function(e) { return e !== value })
        searchDomainStorage.set(filteredArray, ()=>{
          cb();
        })
      });
    },
    append: (values, cb) => {
      searchDomainStorage.get((domains)=>{
        var domainsArray = Array.from(domains);
        var alldomains = domains.length == 0 ? [values] : Array.from(new Set(domainsArray.concat(values)));
        chrome.storage.sync.set(
          {
            searchDomain: alldomains,
          }, () => {
            cb();
          });
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          searchDomain: value,
        },
        () => {
          cb();
        }
      );
    },
  };