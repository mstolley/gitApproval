function save_options() {
    var host = document.getElementById('host').value;
    var approvalNumber = document.getElementById('approvalNumber').value;
    var prElementClass = document.getElementById('prElementClass').value;
    var titleBlockClass = document.getElementById('titleBlockClass').value;
    var approvalClass = document.getElementById('approvalClass').value;
    var approvalImg = document.getElementById('approvalImg').value;
    var approvalColor = document.getElementById('approvalColor').value;
    chrome.storage.sync.set({
        host: host,
        approvalNumber: approvalNumber,
        prElementClass: prElementClass,
        titleBlockClass: titleBlockClass,
        approvalClass: approvalClass,
        approvalImg: approvalImg,
        approvalColor: approvalColor
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        host: 'https://github.com',
        approvalNumber: '2',
        prElementClass: 'js-navigation-open',
        titleBlockClass: 'issue-pr-status',
        approvalClass: 'thumbs-up',
        approvalImg: 'https://github.com/images/icons/emoji/unicode/1f44d.png',
        approvalColor: '#e1f3d8'
    }, function(items) {
        document.getElementById('host').value = items.host;
        document.getElementById('approvalNumber').value = items.approvalNumber;
        document.getElementById('prElementClass').value = items.prElementClass;
        document.getElementById('titleBlockClass').value = items.titleBlockClass;
        document.getElementById('approvalClass').value = items.approvalClass;
        document.getElementById('approvalImg').value = items.approvalImg;
        document.getElementById('approvalColor').value = items.approvalColor;
    });
}

function toggleExtraOptions() {
    var elements = document.getElementsByClassName('extra');
    for(i=0;i<elements.length;i++) {
        elements[i].disabled = !elements[i].disabled;
    }
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('reset').addEventListener('click', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('cbExtraOptions').addEventListener('change', toggleExtraOptions);
