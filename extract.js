chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "download_csv") {
      // Check if the current URL ends with '/tags'
      if (window.location.href.endsWith('/tags')) {
        downloadCSV();
      } else {
        alert('You can only run this on the "Tags" page');
      }
    }
  }
);

function downloadCSV() {
  var table = document.querySelector('table.gtm-multiselect-table');

  if (!table) {
    console.error('Table not found on this page.');
  } else {
    var data = ["Name,Type,Firing Triggers,Last Edited"]; // Headings

    var rows = table.querySelectorAll('tr.wd-tag-row');

    rows.forEach(function (row) {
      var rowData = [];
      var cells = row.querySelectorAll('td');

      cells.forEach(function (cell, index) {
        if (index === 0) return; // Skip the first column (checkbox/icon)

        var cellData = cell.textContent.trim();

        if (index === 3) { // Firing Triggers column
          var smallTriggerChips = cell.querySelectorAll('.small-trigger-chip.md-gtm-theme');
          if (smallTriggerChips.length > 0) {
            cellData = Array.from(smallTriggerChips, chip => chip.textContent.trim()).join('\n');
          }
        }
        rowData.push(cellData);
      });

      if (rowData.length > 0) {
        data.push(rowData.join(',')); // Add row data
      }
    });

    // Create and download CSV
    var csvContent = 'data:text/csv;charset=utf-8,' + data.join('\n');
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'table_data.csv');
    document.body.appendChild(link);
    link.click();
  }
}

