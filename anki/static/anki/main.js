document.addEventListener('DOMContentLoaded', function() {
    // When PLAY CARDS page is loaded:
    if (document.title === 'Play cards') {
        loadScript('/static/anki/play.js');
    }

    // When MY COLLECTION page is loaded:
    if (document.title === 'My collection') {
        loadScript('/static/anki/collection.js');
    }

    // When ARCHIVE page is loaded:
    if (document.title === 'Archive') {
        loadScript('static/anki/archive.js');
    }
})

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function loadScript(url)
{    
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}