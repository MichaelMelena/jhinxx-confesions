let currentPage = 0;
let data = {};
const keysNext = ["d", "D", "ArrowRight", " "];
const keysPrevious = ["a", "A", "ArrowLeft"];
const loadingCssClass = "loading-active";
const dataUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSA0ItBF6450-eFm5-K1k4pgqUUmgCrVlRs_zBl7sr28hBYhtF2fe_0bId8v7mjYx4xnsEmLa7wtyln/pub?gid=814673941&single=true&output=tsv";
const nextElement = document.getElementById("next");
const previousElement = document.getElementById("previous");
const currentPageElement = document.getElementById("currentPage");
const maxPageElement = document.getElementById("lastPage");
const contentElement = document.getElementById("content");
const loadingElement = document.getElementById("overlay");
/**
 *
 * @param {string} text
 */
function ParseData(text) {
  let lines = text.split("\n");
  let headless = lines.slice(1);
  let i = 0;
  for (let index = 0; index < headless.length; index++) {
    if (headless[index].length < 3) {
      continue;
    }
    data[i] = headless[index].split("\t")[1];
    i++;
  }
}
function ShowLoadingScreen() {
  loadingElement.classList.add(loadingCssClass);
}

function HideLoadingScreen() {
  loadingElement.classList.remove(loadingCssClass);
}

async function FetchDataAsync() {
  ShowLoadingScreen();
  fetch(dataUrl)
    .then(async (response) => {
      let excelData = await response.text();
      ParseData(excelData);
    })
    .then(UpdateContent)
    .then(HideLoadingScreen);
}

function UpdateContent() {
  currentPageElement.value = currentPage + 1;
  maxPageElement.innerText = Object.keys(data).length;
  contentElement.innerText = data[currentPage];
}

function GoNext() {
  if (currentPage >= Object.keys(data).length - 1) {
    return;
  }
  currentPage++;
  UpdateContent();
}

function GoBack() {
  if (currentPage <= 0) {
    return;
  }
  currentPage--;
  UpdateContent();
}

function EnsureInputRange(page) {
  let inputValue = Math.max(0, Math.min(page, Object.keys(data).length - 1));
  return inputValue;
}
/**
 *
 * @param {Event} event
 */
function GoToPage(event) {
  let parsedInput = Number(event.target.value);
  if (isNaN(parsedInput)) {
    currentPage = 0;
  } else {
    let inputValue = parsedInput - 1;
    console.info("input event data", event);
    currentPage = EnsureInputRange(inputValue);
  }

  UpdateContent();
}

nextElement.addEventListener("click", GoNext);
previousElement.addEventListener("click", GoBack);
currentPageElement.addEventListener("input", GoToPage);
document.addEventListener("keydown", (event) => {
  if (keysNext.includes(event.key)) {
    GoNext();
  } else if (keysPrevious.includes(event.key)) {
    GoBack();
  }
});
await FetchDataAsync();
