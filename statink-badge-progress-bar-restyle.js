// ==UserScript==
// @name     stat.ink badge progress bar restyle
// @version  1
// @grant    none
// @match    https://stat.ink/@strohkoenig/spl3/stats/badge
// @run-at   document-idle
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
        idArray.push({ id: list[k].querySelector("td.auto-tooltip").innerText.replace(",", ""), row: list[k] });
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

tableBody = document.querySelector("tbody");
allRows = tableBody.children;
newOrder = [];
currentList = [];

for (i = 0; i < allRows.length; i++) {
    if (allRows[i].querySelector("td.battle-row-group-header")) {
        currentList = sort(currentList);

        for (j = 0; j < currentList.length; j++) {
            newOrder.push(currentList[j]);
        }

        currentList = [];

        newOrder.push(allRows[i]);
    } else {
        currentList.push(allRows[i]);
    }
}

currentList = sort(currentList);
for (i = 0; i < currentList.length; i++) {
    console.log("servus " + i);
    newOrder.push(currentList[i]);
}

theParentNode = tableBody.children[0].parentNode
while (theParentNode.children.length > 0) {
  theParentNode.removeChild(theParentNode.children[0]);
}

for (i = 0; i < newOrder.length; i++) {
    theParentNode.appendChild(newOrder[i]);
}
