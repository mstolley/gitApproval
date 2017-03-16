/*********
* Author: Matthew Stolley
*
* This extension adds visual notifications of approvals on pull requests.
*
* It first reads the DOM to find pull requests.
* Then, if there are comments on the PR, a call is made to get the comments from each listed PR.
* Those comments are parsed to find the number of approvals given.
*
* This extension may soon be obsolete, as a new github API called "reactions"
* is currently in beta.
* https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments
**********/

var host;
var approvalNumber;
var prElementClass;
var titleBlockClass;
var approvalClass;
var approvalImg;
var approvalColor;

function iteratePRs() {
    var pullRequests = document.getElementsByClassName('js-issue-row');

    removeExistingApprovals();
    for (i = 0; i < pullRequests.length; i++) {
        parseCommentsForPR(pullRequests[i]);
    }
}

function parseCommentsForPR(prElement) {
    var issuePath = prElement.getElementsByClassName(prElementClass)[0].href;

    // path: /:owner/:repo/pull/:number
    var tokens = issuePath.split('/');
    var owner = tokens[3];
    var repo = tokens[4];
    var number = tokens[6];
    // Set host from settings
    var prUrl = host + '/' + owner + '/' + repo + '/pull/' + number;
    var http = new XMLHttpRequest();

    http.onreadystatechange = function() {
        if(http.readyState === 4 && http.status === 200) {
            if(!isIncomplete(http.responseText)) {
                var numApprovals = getNumberOfApprovals(http.responseText);
            };

            if(numApprovals) {
                renderApprovals(prElement, numApprovals);
            }

            if(numApprovals >= approvalNumber) {
                prElement.style.backgroundColor = approvalColor;
            }
        }
    }

    http.open("GET", prUrl, true);
    http.send(null);
}

function removeExistingApprovals() {
    var existingApprovals = document.getElementsByClassName(approvalClass);

    while(existingApprovals[0]) {
        existingApprovals[0].remove();
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

function renderApprovals(prElement, numApprovals) {
    var titleBlock = prElement.getElementsByClassName(titleBlockClass)[0];

    for(var i = 0; i < numApprovals; i++) {
        var approvalElement = document.createElement('span');

        approvalElement.className = approvalClass;
        approvalElement.innerHTML = '<img class="emoji" title="+1" alt="+1" src="' + approvalImg + '" height="16" width="16" align="absmiddle">';
        titleBlock.appendChild(approvalElement);
    }
}

chrome.storage.sync.get(["host", "approvalNumber", "prElementClass", "titleBlockClass", "approvalClass", "approvalImg", "approvalColor"], function(data) {
    host = data.host;
    approvalNumber = data.approvalNumber;
    prElementClass = data.prElementClass;
    titleBlockClass = data.titleBlockClass;
    approvalClass = data.approvalClass;
    approvalImg = data.approvalImg;
    approvalColor = data.approvalColor;

    iteratePRs();
});
