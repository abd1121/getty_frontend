const dashBtn = document.getElementById("dashboard-admin-nav");
const scanHistoryBtn = document.getElementById("scan-history-nav");
const usersBtn = document.getElementById("users-nav");
const nav = document.getElementById("nav-menu");
const adminDashTab = document.getElementById("admin-dashboard-area");
const usersTab = document.getElementById("users-area");
const scanHistoryTab = document.getElementById("scan-history-area");
var v1=document.getElementById('count_value1').value
var v2=document.getElementById('count_value2').value
var v3=document.getElementById('count_value3').value
var v4=document.getElementById('count_value4').value
var v5=document.getElementById('count_value5').value
var v6=document.getElementById('count_value6').value
var v7=document.getElementById('count_value7').value
var v8=document.getElementById('count_value8').value
var v9=document.getElementById('count_value9').value
var v10=document.getElementById('count_value10').value
var v11=document.getElementById('count_value11').value
var v12=document.getElementById('count_value12').value

const usersAnalytics = [v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12];
console.log(document.getElementById('count_value1').value)
const regUsers = document.getElementById('mcv').value;
const regU = document.getElementById('smv').value;
const regProfiles = document.getElementById('mcv').value;
const regP = document.getElementById('spv').value;


const clearPane = () => {
  if (dashBtn.classList.contains("nav-bar-element-selected"))
    dashBtn.classList.remove("nav-bar-element-selected");
  else if (scanHistoryBtn.classList.contains("nav-bar-element-selected"))
    scanHistoryBtn.classList.remove("nav-bar-element-selected");
  else if (usersBtn.classList.contains("nav-bar-element-selected"))
    usersBtn.classList.remove("nav-bar-element-selected");
  scanHistoryTab.style.display = "none";
  adminDashTab.style.display = "none";
  usersTab.style.display = "none";

  if (isMobileDevice()) {
    closeNav();
  }
};

nav.addEventListener("click", (e) => {
  const navDisplay = document.getElementById("navigation-bar");
  if (
    navDisplay.style.visibility === "hidden" ||
    navDisplay.style.visibility === ""
  ) {
    openNav();
  } else {
    closeNav();
  }
});

const openNav = () => {
  const navDisplay = document.getElementById("navigation-bar");
  nav.innerHTML = "\u2716";
  navDisplay.style.width = " 75%";
  navDisplay.style.visibility = "visible";
};
const closeNav = () => {
  const navDisplay = document.getElementById("navigation-bar");
  nav.innerHTML = "|||";
  navDisplay.style.width = "40%";
  navDisplay.style.transition = "width 1s ease";
  navDisplay.style.visibility = "hidden";
};


scanHistoryBtn.addEventListener("click", () => {
  clearPane();
  scanHistoryTab.style.display = "flex";
  scanHistoryBtn.classList.add("nav-bar-element-selected");
});

dashBtn.addEventListener("click", () => {
  clearPane();
  adminDashTab.style.display = "flex";
  dashBtn.classList.add("nav-bar-element-selected");
});

usersBtn.addEventListener("click", () => {
  clearPane();
  usersTab.style.display = "flex";
  usersBtn.classList.add("nav-bar-element-selected");
});
usersAnalytics.map((fig, idx) => {

  var bar = document.getElementById(`graph-bar${idx + 1}`);
  bar.style.background = `linear-gradient(#1a3148 0% ${fig}%, #f2f6f8 ${fig}%)`;
});


document.getElementById("pie-percent1").innerHTML = `${regU}%`;
document.getElementById("pie-percent2").innerHTML = `${regP}%`;

document.getElementById(
  "pie1"
).style.backgroundImage = `conic-gradient(#86e8e2 ${
  regUsers - regUsers / 2
}%, #46dbd2 ${regUsers - regUsers / 2}% ${regUsers}%, #d0f6f4 0)`;

document.getElementById(
  "pie2"
).style.backgroundImage = `conic-gradient(#b989f5 ${
  regProfiles - regProfiles / 2
}%, #944bf0 ${regProfiles - regProfiles / 2}% ${regProfiles}%, #e4d2fb 0)`;
