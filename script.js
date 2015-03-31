/* globals */

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
    if (innerHeight + scrollY === document.body.scrollHeight) {
        var lastNavLinkElem = document.querySelector("nav a:last-of-type");
        [].slice.call(navLinkElems).forEach(function(elem){
            elem.classList.remove("current");
        });
        lastNavLinkElem.classList.add("current");
    } else {
        [].slice.call(sectionElems).forEach(function(elem){
            var top = elem.getClientRects()[0].top;
            var bottom = elem.getClientRects()[0].bottom;

            var navLinkElem = document.querySelector("nav a[href='#" + elem.getAttribute("id") + "']");

            if (top <= 0 && bottom > 0) {
                navLinkElem.classList.add("current");
            } else {
                navLinkElem.classList.remove("current");
            }
        });
    }
}, 100);

/* automatic member photos */

[].slice.call(document.querySelectorAll(".members-container li")).forEach(function(elem){
    var photoElem = elem.querySelector(".member-photo");
    var name = elem.querySelector(".member-name").textContent;
    
    photoElem.src = "/assets/img/members/" + name + ".jpg";
});