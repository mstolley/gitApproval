/*********
* Author: Matthew Stolley
*
* This extension adds visual notifications of approvals on pull requests.
*
* It first reads the DOM to find pull requests.
* Then, if there are comments on the PR, a call is made to get the comments from each listed PR.
* Those comments are parsed to find the number of thumbs ups given.
*
* This extension may soon be obsolete, as a new github API called "reactions"
* is currently in beta.
* https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments
**********/


var approvalNumber;

function iteratePRs() {
    var pullRequests = document.getElementsByClassName('js-issue-row');

    removeExistingThumbs();
    for (i = 0; i < pullRequests.length; i++) {
        parseCommentsForPR(pullRequests[i]);
    }
}

function parseCommentsForPR(prElement) {
    var issuePath = prElement.getElementsByClassName('js-navigation-open')[0].href;
    // path: /:owner/:repo/pull/:number
    var tokens = issuePath.split('/');
    var number = tokens[6];
    var prUrl = 'pull/' + number;
    var http = new XMLHttpRequest();

    console.log('approvalNumber: ', approvalNumber);

    http.onreadystatechange = function() {
        if(http.readyState === 4 && http.status === 200) {
            if(!isIncomplete(http.responseText)) {
                var numThumbs = getNumberOfApprovals(http.responseText);
            };

            if(numThumbs) {
                renderThumbs(prElement, numThumbs);
            }

            // Set approvalNumber from settings
            if(numThumbs >= approvalNumber) {
                prElement.style.backgroundColor = '#e1f3d8';
            }
        }
    }

    http.open("GET", prUrl, true);
    http.send(null);
}

function removeExistingThumbs() {
    var existingThumbs = document.getElementsByClassName('thumbs-up');

    while(existingThumbs[0]) {
        existingThumbs[0].remove();
    }
}

function isIncomplete(text) {
    var regex = /completeness-indicator-error/gm;
    var error = !!(text.match(regex) || []).length;

    return error;
}

function getNumberOfApprovals(text) {
    var regex = /is-approved/gm;
    var approvals = (text.match(regex) || []).length;

    return approvals;
}

function renderThumbs(prElement, numThumbs) {
    var titleBlock = prElement.getElementsByClassName('issue-pr-status')[0];

    for(var i = 0; i < numThumbs; i++) {
        var thumb = document.createElement('span');

        thumb.className = 'thumbs-up';
        thumb.innerHTML = '<img class="emoji" title="+1" alt="+1" src="https://github.com/images/icons/emoji/unicode/1f44d.png" height="16" width="16" align="absmiddle">';
        titleBlock.appendChild(thumb);
    }
}

chrome.storage.sync.get("approvalNumber", function(data) {
    approvalNumber = data.approvalNumber;

    iteratePRs();
});
