const myUrl = new URL(window.location.toLocaleString()).searchParams;;
var user = myUrl.get('user');
var newURL ="https://"+user+".co"
document.getElementById('iframe').src = newURL;
