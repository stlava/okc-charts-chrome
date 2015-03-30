/*********************************************************
 *                                                       *
 *   Menu Click Handlers                                 *
 *                                                       *
 ********************************************************/
function clickSpotlightHandler(e) {
    chrome.extension.sendMessage({
        directive: "spotlight"
    }, function(response) {
        openUI("spotlight");
        this.close();
    });
}
function clickInboxHandler(e) {
    chrome.extension.sendMessage({
        directive: "inbox"
    }, function(response) {
        openUI("inbox");
        this.close();
    });
}
function clickVisitorsHandler(e) {
    chrome.extension.sendMessage({
        directive: "visitors"
    }, function(response) {
        openUI("visitors");
        this.close();
    });
}
function clickSearchHandler(e) {
    chrome.extension.sendMessage({
        directive: "search"
    }, function(response) {
        openUI("search");
        this.close();
    });
}
function clickHelpHandler(e) {
    chrome.extension.sendMessage({
        directive: "help"
    }, function(response) {
        openUI("help");
        this.close();
    });
}

/*********************************************************
 *                                                       *
 *   Add Menu Event Listeners                            *
 *                                                       *
 ********************************************************/
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('spotlight').addEventListener('click', clickSpotlightHandler);
    document.getElementById('spotlight').addEventListener('mouseenter', changeImage);
    document.getElementById('spotlight').addEventListener('mouseleave', changeImage);


    document.getElementById('search').addEventListener('click', clickSearchHandler);
    document.getElementById('search').addEventListener('mouseenter', changeImage);
    document.getElementById('search').addEventListener('mouseleave', changeImage);

    document.getElementById('inbox').addEventListener('click', clickInboxHandler);
    document.getElementById('inbox').addEventListener('mouseenter', changeImage);
    document.getElementById('inbox').addEventListener('mouseleave', changeImage);

    document.getElementById('visitors').addEventListener('click', clickVisitorsHandler);
    document.getElementById('visitors').addEventListener('mouseenter', changeImage);
    document.getElementById('visitors').addEventListener('mouseleave', changeImage);

    document.getElementById('help').addEventListener('click', clickHelpHandler);
    document.getElementById('help').addEventListener('mouseenter', changeImage);
    document.getElementById('help').addEventListener('mouseleave', changeImage);
});

function changeImage(e)
{
    console.log(e);
    if(e.type == "mouseenter") {
        document.images[e.target.name].src= "images/"+e.target.name+"_m.png";
    } else {
        document.images[e.target.name].src= "images/"+e.target.name+".png";
    }
    return true;
}

/*********************************************************
 *                                                       *
 *   UI Functions                                        *
 *                                                       *
 ********************************************************/
function openUI(name) {
    chrome.tabs.create({
        'url': chrome.extension.getURL("charts/"+name+'.html')
    }, function(tab) {
        console.log("Opening " + name + " in a new tab.");
    });
}