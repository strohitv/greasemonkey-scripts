// ==UserScript==
// @name     stat.ink badge progress bar restyle
// @version  1
// @grant    none
// @match    https://stat.ink/@*/spl3/stats/badge
// @run-at   document-end
// ==/UserScript==


// FIX PROGRESSBAR WIDTHS

allProgressbars = document.querySelectorAll("div.progress-bar");

for (i = 0; i < allProgressbars.length - 1; i += 2) {
    currentDivLeft = allProgressbars[i];
    currentDivRight = allProgressbars[i + 1];

    if (currentDivLeft.classList.contains("progress-bar-success")) {
        continue;
    }

    progress = currentDivLeft.innerText.trim();
    stillTodo = (100 - currentDivLeft.innerText.trim().replace("%", "")) + "%";

    currentDivLeft.style.width = progress;
    currentDivRight.style.width = stillTodo;
}



// SORT TABLE ENTRIES BASED ON PROGRESS

function sort(list) {
    if (list.length == 0) {
        return [];
    }

    idArray = [];
    for (k = 0; k < list.length; k++) {
        idArray.push({ id: list[k].querySelector("td.auto-tooltip").innerText.replace(/\D/g, ""), row: list[k] });
    }

    idArray.sort(function (a, b) {
        return b.id - a.id;
    })

    rows = [];
    for (l = 0; l < idArray.length; l++) {
        rows.push(idArray[l].row);
    }

    return rows;
}

document.addEventListener('DOMContentLoaded', function() {
  tableBody = document.querySelector("tbody");
  allRows = tableBody.children;
  newOrder = [];
  currentList = [];

  // iterate all rows of the badge table
  for (i = 0; i < allRows.length; i++) {
      if (allRows[i].querySelector("td.battle-row-group-header")) {
          // current row is a header
          // -> done with the previous section
          // -> sort entries and add them to sorted list
          currentList = sort(currentList);

          for (j = 0; j < currentList.length; j++) {
              newOrder.push(currentList[j]);
          }

          currentList = [];

          // add the header row to the sorted list afterwards
          newOrder.push(allRows[i]);
      } else {
          // current row is a regular stat -> add to list for later sorting
          currentList.push(allRows[i]);
      }
  }

  // sort and add last remaining category (salmon boss stats) to sorted list
  currentList = sort(currentList);
  for (i = 0; i < currentList.length; i++) {
      newOrder.push(currentList[i]);
  }

  // remove all unsorted entries from table list
  theParentNode = tableBody.children[0].parentNode
  while (theParentNode.children.length > 0) {
    theParentNode.removeChild(theParentNode.children[0]);
  }

  // add all sorted entries to table list
  for (i = 0; i < newOrder.length; i++) {
      theParentNode.appendChild(newOrder[i]);
  }
});
