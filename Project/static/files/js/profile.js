var bgColorPalette = document.getElementById("bg-palette-bubble");
var selectedDiv,
  selectedColor = "red",
  fontStyle = "Poppins",
  foreColor = "#0d2a52",
  fontWeight = 400,
  backColor = "#0d2a52";

var picker = document.getElementById("color-picker");
const overlay = document.getElementById("overlaying-container");
const textEditor = document.getElementById("text-editor");
const buttonEditor = document.getElementById("button-editor");
const colors = {
  white: "#fff",
  red: "#f44336",
  blue: "#2196f3",
  green: "#4caf50",
  orange: "#ff9800",
  pink: "#e91e63",
  purple: "#9c27b0",
  indigo: "#3f51b5",
  teal: "#009688",
  brown: "#795548",
  grey: "#9e9e9e",
};

const fonts = {
  poppins: ["Poppins", "sans-serif"],
  roboto: ["Roboto", "sans-serif"],
  "open-sans": ["Open Sans", "sans-serif"],
  montserrat: ["Montserrat", "sans-serif"],
  "bebas-neue": ["Bebas Neue", "cursive"],
};

const fontWeights = {
  normal: 400,
  light: 300,
  "semi-bold": 600,
  bold: 700,
};

const changeBackgroundColor = (color) => {
  selectedDiv.style.backgroundColor = color;
};

const changeForeColor = (color) => {
  selectedDiv.style.color = color;
};

const changeFont = (font) => {
  fontStyle = font;
  selectedDiv.style.fontFamily = fonts[font];
};

const changeFontWeight = (weight) => {
  fontWeight = weight;
  selectedDiv.style.fontWeight = fontWeights[weight];
};
const setDiv = (div) => {
  document.getElementById("overlaying-container").style.display = "block";
  document.getElementById(div).classList.add("selected-div");
  selectedDiv = document.getElementById(div);
};

// For media queries
var mobile = window.matchMedia("(max-width: 600px)");
const isMobileDevice = () => {
  if (mobile.matches) return true;
  else return false;
};
mobile.addListener(isMobileDevice);

/******************************************************************
 *               TOGGLE DROPDOWN OPTIONS
 *          --------------------------------
 * Parameters :
 *      1. ID of arrow tag
 *      2. ID of the dropdown lis
 * Functionality:
 *      - Toggle the dropdown options on tap
 * Returns : Nothing
 ****************************************************************/

const customDropdownToggle = (arrow, lst) => {
  const arr = document.getElementById(arrow);
  const list = document.getElementById(lst);

  if (arr.classList.contains("fa-angle-down")) {
    arr.classList.remove("fa-angle-down");
    arr.classList.add("fa-angle-up");
    var allOptions = document.getElementsByClassName("dropdown-options");
    for (let option of allOptions) {
      if (option.id == lst) {
        option.style.display = "block";
      } else option.style.display = "none";
    }
  } else {
    arr.classList.remove("fa-angle-up");
    arr.classList.add("fa-angle-down");
    list.style.display = "none";
  }
};

/*****************************************************************
 *              SELECT DROPDOWN OPTION FUNCTION
 *          --------------------------------------
 * Parameters :
 *      1. The ID of option that is already selected
 *      2. Option which is to be selected
 *      3. The list of options  - for display purposes
 *      4. ID of Arrow - to turn it up back
 * Functionality:
 *      - selected the clicked option
 *      - Puts already selected option back in the list
 * Returns : Nothing
 ****************************************************************/

const customDropdownSelect = (alredySelected, optiontoSelect, lst, arr) => {
  const selected = document.getElementById(alredySelected);
  const arrow = document.getElementById(arr);
  const op = document.getElementById(optiontoSelect);
  const list = document.getElementById(lst);

  const temp = selected.innerHTML;
  const tClass = selected.className;
  selected.innerHTML = op.innerHTML;
  selected.classList = op.classList;
  op.innerHTML = temp;
  op.className = tClass;

  arrow.classList.remove("fa-angle-up");
  arrow.classList.add("fa-angle-down");
  list.style.display = "none";

  if (alredySelected.includes("fontweight")) {
    changeFontWeight(selected.className);
  } else if (alredySelected.includes("font-")) {
    changeFont(selected.className);
  }
};

/*****************************************************************
 *              BACKGROUND PICKER OPENER EVENT
 *          --------------------------------------
 * Parameters :
 *      - The ID of div whose colors are to be changed
 * Functionality:
 *      - Selects the div to be edited
 *      - shows the edit bubble on position
 * Returns : Nothing
 ****************************************************************/

const pickerEvent = (divId) => {
  const div = document.getElementById(divId);
  const pos = div.getBoundingClientRect(),
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  setDiv(divId);

  console.log(bgColorPalette.clientHeight);
  bgColorPalette.style.position = "absolute";
  bgColorPalette.style.display = "flex";
  bgColorPalette.style.top =
    pos.top + scrollTop - bgColorPalette.clientHeight + "px";
  bgColorPalette.style.right = "50px";
};

/*****************************************************************
 *              BACKGROUND COLOR PICKER EVENT
 *          --------------------------------------
 * Parameters :
 *      - The ID of div whose colors are to be changed
 * Functionality:
 *      - Selects the div to be edited
 *      - shows the edit bubble on position
 * Returns : Nothing
 ****************************************************************/
const selectBgColor = (color, colorId) => {
  sColor = document.getElementById(selectedColor);
  selectedColor = colorId;

  if (sColor.className.split(" ").includes("color-selected"))
    sColor.classList.remove("color-selected");

  sColor = document.getElementById(colorId);

  sColor.classList.add("color-selected");
  if (color === "white") sColor.style.border = "3px solid #E5E5E5";

  if (!color.includes("#")) color = colors[color];
  else sColor.style.backgroundColor = color;

  sColor.style.boxShadow = "0px 0px 0px 2px" + color;
  backColor = color;
  changeBackgroundColor(color);
};

/*****************************************************************
 *              ForeGround COLOR PICKER EVENT
 *          --------------------------------------
 * Parameters :
 *      - The ID of div whose colors are to be changed
 * Functionality:
 *      - Selects the div to be edited
 *      - shows the edit bubble on position
 * Returns : Nothing
 ****************************************************************/
const selectForeColor = (color, colorId) => {
  sColor = document.getElementById(selectedColor);
  selectedColor = colorId;

  if (sColor)
    if (sColor.className.split(" ").includes("color-selected"))
      sColor.classList.remove("color-selected");

  sColor = document.getElementById(colorId);
  sColor.classList.add("color-selected");
  if (color === "white") sColor.style.border = "3px solid #E5E5E5";

  if (!color.includes("#")) color = colors[color];
  else sColor.style.color = color;

  sColor.style.boxShadow = "0px 0px 0px 2px" + color;
  foreColor = color;
  changeForeColor(color);
};

/*****************************************************************
 *              SELECT INDIVIDUAL ELEMENT
 *          --------------------------------------
 * Parameters :
 *      -
 * Functionality:
 *      -
 * Returns : Nothing
 ****************************************************************/
const selectTextElement = (element) => {
  setDiv(element);
  const el = document.getElementById(element);

  const ePos = el.getBoundingClientRect(),
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  console.log(ePos);
  overlay.style.display = "block";
  document.getElementById(element).classList.add("selected-element");
  textEditor.style.display = "flex";
  textEditor.style.top =
    ePos.top -
    textEditor.clientHeight +
    // / 2 + ePos.height / 2
    scrollTop +
    "px";
  textEditor.style.left =
    ePos.left - (textEditor.clientWidth - ePos.width) / 2 + "px";
};

/*****************************************************************
 *              SELECT BUTTON ELEMENT
 *          --------------------------------------
 * Parameters :
 *      -
 * Functionality:
 *      -
 * Returns : Nothing
 ****************************************************************/
const selectButtonElement = (element) => {
  setDiv(element);
  const el = document.getElementById(element);

  const ePos = el.getBoundingClientRect(),
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  console.log(ePos);
  overlay.style.display = "block";
  document.getElementById(element).classList.add("selected-button");
  buttonEditor.style.display = "flex";
  buttonEditor.style.top =
    ePos.top -
    buttonEditor.clientHeight / 2 +
    ePos.height / 2 +
    scrollTop +
    "px";
  buttonEditor.style.left = ePos.left - buttonEditor.clientWidth - 30 + "px";
};

/*****************************************************************
 *              SAVE THE PROPERTIES OF TEXT
 *          --------------------------------------
 * Parameters :
 *      -
 * Functionality:
 *      -
 * Returns : Nothing
 ****************************************************************/
const saveTextProperties = () => {
    var al=document.getElementById('apply-to-all-text').checked;
    st="font-family:"+selectedDiv.style.fontFamily.toString().split('"').join('')+";color:"+selectedDiv.style.color+";font-weight:"+selectedDiv.style.fontWeight+";"
    v=document.getElementsByName("csrfmiddlewaretoken")[0].value
    $.ajax({

              url: "/design/",
              type: 'POST',
              data: { post_id: selectedDiv.id,nature:'text',Al:al,'st':st,csrfmiddlewaretoken:v},
              success: function(response){
                 console.log('hurry');
              }
           });


    st=getComputedStyle(selectedDiv)
    console.log(st.fontFamily);
    overlay.style.display = "none";
    textEditor.style.display = "none";
    selectedDiv.classList.remove("selected-element");
    resetProperties();
};

/*****************************************************************
 *              BACKGROUND COLOR PICKER EVENT
 *          --------------------------------------
 * Parameters :
 *      -
 * Functionality:
 *      -
 * Returns : Nothing
 ****************************************************************/
const saveBgProperties = () => {

    var al='false';
    st="background-color:"+selectedDiv.style.backgroundColor +";"
    console.log(selectedDiv.id)
    v=document.getElementsByName("csrfmiddlewaretoken")[0].value
    $.ajax({

              url: "/design/",
              type: 'POST',
              data: { post_id: selectedDiv.id,nature:'back',Al:al,'st':st,csrfmiddlewaretoken:v},
              success: function(response){
                 alert('Style Update Sucessfully')
              }
           });

  selectedDiv.classList.remove("selected-div");
  bgColorPalette.style.display = "none";
  overlay.style.display = "none";
  resetProperties();
};

const saveButtonProperties = () => {
    al=document.getElementById('apply-to-all-buttons').checked;
    console.log(al)
    st=""
    st="font-family:"+selectedDiv.style.fontFamily.toString().split('"').join('')+";color:"+selectedDiv.style.color+";font-weight:"+selectedDiv.style.fontWeight+";background-color:"+selectedDiv.style.backgroundColor+";"
    v=document.getElementsByName("csrfmiddlewaretoken")[0].value
    $.ajax({

              url: "/design/",
              type: 'POST',
              data: { post_id: selectedDiv.id,nature:'button',Al:al,'st':st,csrfmiddlewaretoken:v},
              success: function(response){
                 alert('Style Update Sucessfully')
              }
           });


  buttonEditor.style.display = "none";
  selectedDiv.classList.remove("selected-button");
  overlay.style.display = "none";
  resetProperties();
};

const resetProperties = () => {
  fontStyle = "Poppins";
  foreColor = "#0d2a52";
  fontWeight = 400;
  backColor = "#0d2a52";
};
const applyToAllButtons = () => {
  var buttons = document.getElementsByClassName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.backgroundColor = backColor;
    buttons[i].style.color = foreColor;
    buttons[i].style.fontFamily = fontStyle;
    buttons[i].style.fontWeight = fontWeight;

  }
};

const applyToAllText = () => {
  var texts = document.getElementsByClassName("text");
  for (let i = 0; i < texts.length; i++) {
    texts[i].style.color = foreColor;
    texts[i].style.fontFamily = fontStyle;
    texts[i].style.fontWeight = fontWeight;
  }
};

// bg color picker
document.getElementById("color-picker-1").addEventListener("input", (e) => {
  selectBgColor(e.target.value, "color-picker-1");
});

// text color picker
document.getElementById("color-picker-2").addEventListener("input", (e) => {
  selectForeColor(e.target.value, "color-picker-2");
});

// button bg color picker
document.getElementById("color-picker-3").addEventListener("input", (e) => {
  selectBgColor(e.target.value, "color-picker-3");
});

// button fore color picker
document.getElementById("color-picker-4").addEventListener("input", (e) => {
  selectForeColor(e.target.value, "color-picker-4");
});
