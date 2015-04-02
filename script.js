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
var newsElem = document.querySelector(".news-container");

var initialismLetterElem =  document.querySelector(".initialism-letter");
var initialismWordElem =  document.querySelector(".initialism-word");

var encodeHTML = function(str){
    var elem = document.createElement("div");
    elem.textContent = str;
    return elem.innerHTML;
};

var decodeHTML = function(str){
    var elem = document.createElement("div");
    elem.innerHTML = str;
    return elem.textContent;
};

var initialismWords = [
    "speed", "spirit", "science", "innovation",
    "style", "simplicity"
];

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
    if (window.pageYOffset >= 500) {
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

function currentSection(){
    var returnVal = null;
    
    if (innerHeight + window.pageYOffset === document.body.scrollHeight) {
        returnVal = document.querySelector("section:last-of-type").getAttribute("id");
        
    } else {
        [].slice.call(sectionElems).forEach(function(elem){
            var top = elem.getClientRects()[0].top;
            var bottom = elem.getClientRects()[0].bottom;

            if (top <= 0 && bottom > 0) {
                returnVal = elem.getAttribute("id");
            }
        });
    }
    
    return returnVal;
}

setInterval(function(){
    var id = currentSection();
    
    if (id && location.hash !== "#" + id) {
        document.title = document.querySelector("#" + id + " h2").textContent + " - SC Racers";
        history.pushState(null, null, "#" + id);
        
        [].slice.call(navLinkElems).forEach(function(elem){
            elem.classList.remove("current");
        });
        document.querySelector("nav a[href='#" + id + "']").classList.add("current");
    } else if (!id && location.href.indexOf("#") !== -1) {
        document.title = "SC Racers";
        history.pushState("", document.title, location.pathname + location.search);
        
        [].slice.call(navLinkElems).forEach(function(elem){
            elem.classList.remove("current");
        });
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

/* get twitter feed from queryfeed via yql */

function layoutNewsMsnry(){
    newsMsnry = new Masonry(newsElem, {
        isFitWidth: true,
        gutter: 10
    });
}

function displayTwitterStream(data){
    console.log(data);
    
    data.forEach(function(post){
        var elem = document.createElement("li");
        
        var body = decodeHTML(post.description);
        if (body.indexOf("http://t.co/") !== -1) body = body.substring(0, body.lastIndexOf("http://t.co/"));
        
        elem.innerHTML = "<p>" + twttr.txt.autoLink(body) + "</p>";
        if (post.enclosure && post.enclosure.type === "image/png") {
            elem.innerHTML = "<img src='" + post.enclosure.url + "'>" + elem.innerHTML;
            elem.querySelector("img").addEventListener("load", function(){
                layoutNewsMsnry();
            });
        }
        
        [].slice.call(elem.querySelectorAll("a")).forEach(function(elem){
            elem.setAttribute("target", "_blank");
        });
        
        newsElem.appendChild(elem);
    });
        
    layoutNewsMsnry();
}

if (
    localStorage.getItem("twitterStreamData") && 
    new Date().getTime() - Number(localStorage.getItem("twitterStreamCacheDate")) < 600000 /* 10 minutes */
) {
    displayTwitterStream(JSON.parse(localStorage.getItem("twitterStreamData")));
} else {
    var query = "select * from rss where url='http://www.queryfeed.net/twitter?q=from%3ASC_Racers'";
    var yqlUrl = "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json";
    xhr(yqlUrl, function(r){
        r = JSON.parse(r);
        var twitterData = r.query.results.item;
        displayTwitterStream(twitterData);
        
        localStorage.setItem("twitterStreamData", JSON.stringify(twitterData));
        localStorage.setItem("twitterStreamCacheDate", new Date().getTime());
    });
}

/* initialisms */

function initialismChange(){
    var wordElems = [].slice.call(initialismWordElem.children);
    
    if (initialismWordElem.querySelector(".current")) {
        var oldWordElem = initialismWordElem.querySelector(".current");
        var newWordElem = wordElems[wordElems.indexOf(oldWordElem) + 1] || wordElems[0];
        
        oldWordElem.classList.remove("current");
        newWordElem.classList.add("current");
    } else {
        wordElems[0].classList.add("current");
    }
}

initialismWords.sort(function(){return Math.round(Math.random())}).forEach(function(word){
    var elem = document.createElement("div");
    elem.textContent = word;
    initialismWordElem.appendChild(elem);
});

initialismChange();
setInterval(initialismChange, 5000);