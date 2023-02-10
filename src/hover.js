

function fetchProfileInfo(){
    const myUrl = new URL(window.location.toLocaleString()).searchParams;
    var user = myUrl.get('user');
    var url = eth_stats + "?json=%7B%22accounts%22:%5B%22"+user+"%22%5D%7D";
    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        var name = document.getElementById("name");
        name.innerHTML = data.accounts[0].name
        
        var NFTCount = document.getElementById("NFTCount");
        NFTCount.innerHTML = "NFTs: "+data.accounts[0].number_of_nfts
        var avatar = document.getElementById("avatar");
        avatar.src = Object.values(data.accounts[0].avatar)[0];

    });
}

fetchProfileInfo()