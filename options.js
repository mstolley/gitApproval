function save_options() {
    var host = document.getElementById('host').value;
    var approvalNumber = document.getElementById('approvalNumber').value;
    chrome.storage.sync.set({
        host: host,
        approvalNumber: approvalNumber
    }, function() {
        // Update status to let user know options were saved.
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
        approvalNumber: '2'
    }, function(items) {
        document.getElementById('host').value = items.host;
        document.getElementById('approvalNumber').value = items.approvalNumber;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
