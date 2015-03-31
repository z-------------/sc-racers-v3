/* globals */

var xhr = function(url,callback) {
    var oReq = new XMLHttpRequest();
    oReq.onload = function(){
        var response = this.responseText;
        callback(response);
    };
    oReq.open("get", url, true);
    oReq.send();
};

var sectionElems = document.querySelectorAll("section");
var asideElem = document.querySelector("aside");
var navLinkElems = document.querySelectorAll("nav a");

/* spinning logo on hover */

(function(){
    var logoElem = document.querySelector(".logo");
    logoElem.addEventListener("load", function(){
        var svgDoc = logoElem.contentDocument;
        var styleElem = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");

        styleElem.textContent = "#logo-rings {\
transform: rotate(0);\
transform-origin: 58.5% 50%;\
}\
svg:hover #logo-rings {\
transform: rotate(10turn);\
transition: transform 3s;\
}";
        svgDoc.querySelector("svg").appendChild(styleElem);
    });
})();

/* floating nav */

setInterval(function(){
    if (window.scrollY >= 500) {
        asideElem.classList.add("float");
    } else {
        asideElem.classList.remove("float");
    }
}, 50);

/* nav icons */

[].slice.call(document.querySelectorAll("nav a[data-icon]")).forEach(function(elem){
    var iconURL = "/assets/img/ui/nav-icon/" + elem.dataset.icon + ".svg";
    elem.style.backgroundImage = "url(" + iconURL + ")";
});

/* nav link titles */

[].slice.call(document.querySelectorAll("nav a")).forEach(function(elem){
    elem.setAttribute("title", elem.textContent);
});

/* highlight nav links */

setInterval(function(){
    var newHash;
    if (innerHeight + scrollY === document.body.scrollHeight) {
        var lastNavLinkElem = document.querySelector("nav a:last-of-type");
        [].slice.call(navLinkElems).forEach(function(elem){
            elem.classList.remove("current");
        });
        lastNavLinkElem.classList.add("current");
        newHash = lastNavLinkElem.getAttribute("href");
    } else {
        [].slice.call(sectionElems).forEach(function(elem){
            var top = elem.getClientRects()[0].top;
            var bottom = elem.getClientRects()[0].bottom;

            var navLinkElem = document.querySelector("nav a[href='#" + elem.getAttribute("id") + "']");

            if (top <= 0 && bottom > 0) {
                navLinkElem.classList.add("current");
                newHash = navLinkElem.getAttribute("href");
            } else {
                navLinkElem.classList.remove("current");
            }
        });
    }
    
    if (document.querySelector("nav a.current") && location.hash.length > 1 && newHash !== location.hash) {
        history.pushState(null, null, newHash);
    }
}, 100);

/* automatic member photos */

[].slice.call(document.querySelectorAll(".members-container li")).forEach(function(elem){
    var photoElem = elem.querySelector(".member-photo");
    var name = elem.querySelector(".member-name").textContent;
    
    photoElem.src = "/assets/img/members/" + name + ".jpg";
});

/* section background images */

[].slice.call(document.querySelectorAll("section[data-bg]")).forEach(function(elem){
    var imgUrl = elem.dataset.bg;
    
    var bgElem = document.createElement("div");
    bgElem.style.backgroundImage = "url(" + imgUrl + ")";
    bgElem.classList.add("section-bg-image");
    
    elem.appendChild(bgElem);
});

/* get twitter feed from twitrssme via yql */

function displayTwitterStream(data){
    console.log(data);
}

if (
    localStorage.getItem("twitterStreamData") && 
    new Date().getTime() - Number(localStorage.getItem("twitterStreamCacheDate")) < 600000 /* 10 minutes */
) {
    displayTwitterStream(JSON.parse(localStorage.getItem("twitterStreamData")));
} else {
    var query = "select * from rss where url='http://twitrss.me/twitter_user_to_rss/?user=SC_Racers'";
    var yqlUrl = "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json";
    xhr(yqlUrl, function(r){
        r = JSON.parse(r);
        var twitterData = r.query.results;
        displayTwitterStream(twitterData);
        
        localStorage.setItem("twitterStreamData", JSON.stringify(twitterData));
        localStorage.setItem("twitterStreamCacheDate", new Date().getTime());
    });
}