async function NepaliDate({ select, formatString = "dd-mm-yyyy" }) {
  if (!select) {
    console.warn(
      "Send select and formatString as the arguement of NepaliDate function. Send the selector for the input box you want to select in select arguement and send the formatString arguement as the way you want to format the string"
    );
  }
  let currentActiveDate, prevActiveDate;
  let nepaliDate;
  let currentYear = 2076;
  let currentMonth = 3;
  let monthData;
  const MONTHS = [
    "Baishakh",
    "Jestha",
    "Ashadh",
    "Shrawan",
    "Bhadra",
    "Ashwin",
    "Kartik",
    "Mangsir",
    "Poush",
    "Magh",
    "Falgun",
    "Chaitra"
  ];
  const BAAR = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
  const START_YEAR = 1970;
  const END_YEAR = 2078;

  function createCalender() {
    let ndc = document.createElement("div");
    let yc = document.createElement("div");
    let y = document.createElement("div");
    let sy = document.createElement("select");
    let sm = document.createElement("select");
    let d = document.createElement("div");
    let dh = document.createElement("div");
    let dc = document.createElement("div");

    //setting attributes
    ndc.className = "nepali-date-container";
    yc.className = "year-container";
    y.className = "year";
    sy.id = "year";
    sy.name = "year";
    sm.id = "month";
    sm.name = "month";
    d.className = "days";
    dh.className = "day-header";
    dc.className = "day-container";

    //setting elements
    BAAR.forEach(b => {
      let baar = document.createElement("div");
      baar.className = "baar";
      baar.appendChild(document.createTextNode(b));
      dh.appendChild(baar);
    });

    d.appendChild(dh);
    d.appendChild(dc);

    MONTHS.forEach(m => {
      let month = document.createElement("option");
      month.value = m;
      month.innerText = m;
      sm.appendChild(month);
    });

    for (let y = START_YEAR; y < END_YEAR; y++) {
      let year = document.createElement("option");
      year.value = y;
      year.innerText = y;
      sy.appendChild(year);
    }

    y.appendChild(sy);
    yc.appendChild(y);
    yc.appendChild(sm);
    ndc.appendChild(yc);
    ndc.appendChild(d);
    insertAfter(ndc, nepaliDateInput);
  }

  //get calender data
  let res = await fetch(
    `https://raw.githubusercontent.com/asimdahall/Nepali-date-api/master/nepalidata.json`
  );
  let data = await res.json();
  nepaliDate = data;

  //selectors
  let nepaliDateInput = document.querySelector(select);
  createCalender();
  let year = document.querySelector("#year");
  let month = document.querySelector("#month");
  let dateContainer = document.querySelector(".nepali-date-container");
  let dayContainer = document.querySelector(".day-container");

  //event listeners
  year.addEventListener("change", getDate);
  month.addEventListener("change", getDate);
  nepaliDateInput.addEventListener("focus", showDateContainer);
  document.addEventListener("click", hideDateContainer);
  //value assign
  year.value = new Date().getFullYear() + 57;

  //function call

  getDate();

  //functions
  function getDate(e) {
    currentYear = year.value;

    currentMonth = month.value;
    findMonth(findYear(currentYear));
    renderMonth();
  }

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function findYear(year) {
    let y = nepaliDate.find(date => Object.keys(date)[0] == year)[year];

    return y;
  }

  function findMonth(monthArr) {
    monthData = monthArr.find(month => Object.keys(month)[0] == currentMonth)[
      currentMonth
    ];
  }
  function getFullDate(e) {
    let day = e.target.textContent;

    if (!day) return;

    prevActiveDate = currentActiveDate;
    currentActiveDate = e.target;
    if (prevActiveDate) {
      prevActiveDate.classList.remove("active");
    }

    e.target.classList.add("active");

    let month = String(MONTHS.indexOf(currentMonth) + 1);
    let res = formatString
      .replace("dd", day.length === 1 ? 0 + day : day)
      .replace("yyyy", currentYear)
      .replace("mm", month.length === 1 ? 0 + month : month);
    nepaliDateInput.value = res;
  }

  function renderMonth() {
    dayContainer.innerHTML = "";
    monthData.forEach(month => {
      let div = document.createElement("div");
      div.addEventListener("click", getFullDate);
      div.className = "day";
      div.appendChild(document.createTextNode(month.date_np));
      dayContainer.appendChild(div);
    });
  }

  function showDateContainer() {
    dateContainer.style.display = "block";
  }

  function hideDateContainer(e) {
    if (e.target === nepaliDateInput || dateContainer.contains(e.target))
      return;
    dateContainer.style.display = "none";
  }
}
