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