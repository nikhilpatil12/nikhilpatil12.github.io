function openNav() {
    document.getElementById("divPopup").style.height = "100%";
    $("#divHamBurgerButton").hide();
    
    // $("#new")[0].style.height = "100%";

    // document.getElementById("new").style.height = "100%";
    // document.getElementById("divSide").style.visibility = "visible";
}
function closeNav() {
    document.getElementById("divPopup").style.height = "0%";
    $("#divHamBurgerButton").show();

    // $("#new")[0].style.height = "0%";

    // document.getElementById("new").style.height = "0%";
    // document.getElementById("divSide").style.visibility = "collapse";

}

window.addEventListener('resize', function(event) {
    if(event.target.outerWidth<576)
        closeNav();
    else
        openNav();
}, true);
// $(document).ready(function() { 
//     closeNav();
    
// });
window.addEventListener('load', 
  function() { 
    if(window.outerWidth<576)
        closeNav();
  }, false);