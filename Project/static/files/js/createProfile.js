var currentStep = 0;

const step1 = document.getElementById("add-personal-details");
const step2 = document.getElementById("add-company-details");
const step3 = document.getElementById("add-contact-details");
const step4 = document.getElementById("create-gallery");
const step5 = document.getElementById("customize-qr-code");
const steps = [step1, step2, step3, step4, step5];
const step1Icon = document.getElementById("step-1");
const step2Icon = document.getElementById("step-2");
const step3Icon = document.getElementById("step-3");
const step4Icon = document.getElementById("step-4");
const step5Icon = document.getElementById("step-5");
const loadingBar = document.getElementById("steps-loader");
var selectedColor = "qr-red";
var selectedQr = "qr-without-logo";
const colors2 = {
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
const socialProfiles = {
  Facebook: "fa-facebook-messenger",
  Instagram: "fa-instagram",
  "Linked In": "fa-linkedin",
  Twitter: "fa-twitter",
  Website: "fa-globe",
};
var selectedSocialMedia = "selected-social-link";

var profileImage = 0,
  coverImage,
  companyLogoImage;

/*****************************************************************
 *                NEXT STEP In CREATION
 *          --------------------------------
 * Parameters : Nothing
 * Functionality: Goes to next step screen
 * Returns : Nothing
 ****************************************************************/
const nextStep = () => {
  if (currentStep < 5) {
    steps[currentStep].style.display = "none";
    currentStep++;
    steps[currentStep].style.display = "block";
    document.getElementById("create-getty-profile-area").scrollTop = 0;
    window.scrollTo({top: 0, behavior: 'smooth'});
    barTransition();
  }
  if (currentStep === 4) {
    document.getElementById("next-step-button").style.display = "none";
    // document.getElementById("preview-profile-btn").style.display = "block";
    document.getElementById("save-profile-btn").style.display = "block";
  }
};

/*****************************************************************
 *                PREVIOUS STEP In CREATION
 *          --------------------------------
 * Parameters : Nothing
 * Functionality: Goes to next step screen
 * Returns : Nothing
 ****************************************************************/
const previuosStep = () => {
  if (currentStep > 0) {
    steps[currentStep].style.display = "none";
    currentStep--;
    steps[currentStep].style.display = "block";
    barTransition();
  }
};

/*****************************************************************
 *                PROGRESS BAR TRANSITIONS
 *          --------------------------------
 * Parameters : Nothing
 * Functionality:
 *    - Gives the icons suitable styling
 *    - bar color transition
 * Returns : Nothing
 ****************************************************************/
const barTransition = () => {
  let prevIcon = eval("step" + currentStep + "Icon");
  let currentIcon = eval("step" + (currentStep + 1) + "Icon");
  if (currentIcon.classList.contains("completed")) {
    currentIcon.classList.remove("completed");
  }
  prevIcon.classList.add("completed");
  currentIcon.classList.add("active");
};

/*****************************************************************
 *                UPLOAD IMAGE IN PROFILE CREATION
 *          ----------------------------------------
 * Parameters :
 *    - Event Args
 *    - container ID
 *    - Image holder ID
 *    - div to show on hover ID
 *    - percentage for transforing
 *
 * Functionality:
 *    - Get image from the dialogue and display
 *    - Give appropriate style to div to be hovered
 *    - fade image on hover
 *    - Give option to upload another image
 *
 * Returns : Nothing
 ****************************************************************/
const uploadImageProfileSection = (
  e,
  containerParam,
  imageParam,
  hoverDivParam,
  percent
) => {
  let imageName;
  const container = document.getElementById(containerParam);
  const image = document.getElementById(imageParam);
  const hoverDiv = document.getElementById(hoverDivParam);

  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = (() => {
    return (e) => {
      image.src = e.target.result;
    };
  })(file);
  reader.readAsDataURL(file);

  hoverDiv.style.transition = "0.5 ease";
  hoverDiv.style.transition = "0.5 ease";
  hoverDiv.style.position = "absolute";
  hoverDiv.style.textAlign = "center";
  if (
    hoverDivParam === "upload-cover-picture-area" ||
    hoverDivParam === "upload-promo-video-area"
  )
    hoverDiv.style.width = container.getBoundingClientRect().width + "px";

  image.style.opacity = "1";
  image.style.display = "block";
  image.style.transition = "0.5s ease";
  image.style.backfaceVisibility = "hidden";

  container.addEventListener("mouseenter", () => {
    console.log("hovered");
    const labelOfDiv = hoverDiv.children[2];
    image.style.opacity = "0.3";
    hoverDiv.style.opacity = "0.8";
    hoverDiv.style.backgroundColor = "#1a3148";
    hoverDiv.style.borderRadius = "4px";
    hoverDiv.style.border = "none";
    labelOfDiv.style.color = "white";
    labelOfDiv.style.fontSize = "14px";
  });
  container.addEventListener("mouseleave", () => {
    image.style.opacity = "1";
    hoverDiv.style.opacity = "0";
  });

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  console.log(containerParam, container.getBoundingClientRect().top);
  var top = container.getBoundingClientRect().top + scrollTop - 10;
  hoverDiv.style.top = top + "px";

  const img = hoverDiv.children[1];
  img.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
  img.src = "/static/files/assets/uploadWhite.svg";
};

/*****************************************************************
 *                UPLOAD GALLERY IMAGES
 *          ----------------------------------------
 * Parameters :
 *    - Event args
 *    - Div ID where the images are shown when uploaded
 * Functionality:
 *    - Gives the icons suitable styling
 *    - bar color transition
 * Returns : Nothing
 ****************************************************************/

const uploadToGallery = (e, galleryDiv) => {
  const gallery = document.getElementById(galleryDiv);
  const files = e.target.files;

  console.log(gallery.lastChild);
  if (files) {
    for (let i = 0; i < files.length; i++) {
      var imageTag = document.createElement("img");
      imageTag.classList.add("uploaded-gallery-image");

      let reader = new FileReader();
      reader.onload = (() => {
        return (e) => {
          imageTag.src = e.target.result;
           $('#image_data').append(e.target.result);
           };
      })(files[i]);
      reader.readAsDataURL(files[i]);

      gallery.insertBefore(imageTag, gallery.children[0]);
    }
  }
};

const changeFontWeight = (weight) => {
  selectedDiv.style.fontWeight = fontWeights[weight];
};
const setDiv = (div) => {
  document.getElementById("overlaying-container").style.display = "block";
  document.getElementById(div).classList.add("selected-div");
  selectedDiv = document.getElementById(div);
};

/*****************************************************************
 *                UPLOAD SOCILA LINKS
 *          ----------------------------------------
 * Parameters :
 *    - Event args
 *    - Div ID where the links are shown when uploaded
 * Functionality:
 *    - Gives the icons suitable styling
 * Returns : Nothing
 ****************************************************************/
const addSocialLink = (link, iconsList) => {
  if(document.getElementById('social-profile-link').value!="") {
    const icoList = document.getElementById(iconsList);
    const iconClass = document.getElementById(selectedSocialMedia).innerHTML;
    var div = document.createElement("div");
    var icon = document.createElement("i");
    var cross = document.createElement("i");
    console.log(iconClass.trim())
    if (iconClass.trim() == 'Facebook') {
      v = (document.getElementById('social-profile-link').value);
      console.log(v);
      document.getElementById("facebook").value = v;
    } else if (iconClass.trim() == 'Linked In') {
      v = (document.getElementById('social-profile-link').value);
      document.getElementById("linkedin").value = v;
    } else if (iconClass.trim() == 'Twitter') {
      v = (document.getElementById('social-profile-link').value);
      document.getElementById("twitter").value = v;
    } else if (iconClass.trim() == 'Instagram') {
      v = (document.getElementById('social-profile-link').value);

      document.getElementById("instagram").value = v;
    } else {
      v = (document.getElementById('social-profile-link').value);
      document.getElementById("website").value = v;

    }
    icon.classList.add(socialProfiles[iconClass.trim()]);
    icon.classList.add("s-icon");
    div.classList.add("social-icon");

    if (iconClass.trim() === "Website") icon.classList.add("fas");
    else icon.classList.add("fab");
    div.insertBefore(icon, div.children[0]);

    cross.classList.add("cross-social");
    cross.classList.add("fas");
    cross.classList.add("fa-times-circle");
    div.insertBefore(cross, div.children[0]);

    icoList.insertBefore(div, icoList.children[0]);
  }
};
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

const qrCodeColor = (color, colorId) => {
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};
    if (typeof colours[color.toLowerCase()] != 'undefined') {
      var hex = colours[color.toLowerCase()];
      document.getElementById('qrcolor').value = hex;
    }
    else
  {
    document.getElementById('qrcolor').value = color;
  }


  sColor = document.getElementById(selectedColor);
  if (sColor.className.split(" ").includes("qr-color-selected")) {
    sColor.classList.remove("qr-color-selected");
    sColor.boxShadow = "none";
  }
  selectedColor = colorId;
  sColor = document.getElementById(colorId);
  sColor.classList.add("qr-color-selected");
  if (color === "white") sColor.style.border = "3px solid #E5E5E5";
  if (color.includes("#")) {
    sColor.style.boxShadow = "0px 0px 0px 2px" + color;
    sColor.style.backgroundColor = color;
  } else sColor.style.boxShadow = "0px 0px 0px 2px" + colors2[color];
};

/*****************************************************************
 *              SELECT QR CODE FUNCTION
 *          --------------------------------------
 * Parameters :
 *      - The ID of div which is selected
 * Functionality:
 *      - Selects the div clicked
 * Returns : Nothing
 ****************************************************************/

const selectQRCode = (qrID) => {
  selectedQr = qrID;
  const qr = document.getElementById(qrID);
  const img = document.getElementById("upload-qr-logo-a");
  if (qrID === "qr-without-logo") {
    document
      .getElementById("qr-with-logo")
      .classList.remove("selected-qr-code");
    img.style.display = "none";
    document.getElementById('qrtype').value="0"
    document.getElementById('upload-qr-logo').required=false;

  } else {
    document
      .getElementById("qr-without-logo")
      .classList.remove("selected-qr-code");
    img.style.display = "block";

     document.getElementById('qrtype').value="1"
    if(document.getElementById('imgalready')=="0") {
      document.getElementById('upload-qr-logo').required = true;
    }
  }
  qr.classList.add("selected-qr-code");

};

/*****************************************************************
 *                       DOCUMENT CALLS
 ****************************************************************/
document.getElementById("next-step-button").addEventListener("click", () => {
  nextStep();
});

document
  .getElementById("back-to-previous-step")
  .addEventListener("click", () => {
    previuosStep();
  });

// Profile picture upload
document
  .getElementById("upload-profile-image")
  .addEventListener("change", (event) => {
    uploadImageProfileSection(
      event,
      "upload-profile-image-a",
      "uploaded-profile-image",
      "upload-profile-picture-area",
      50
    );
    // document.getElementById("uploaded-profile-image").src = profileImage;
  });

// cover picture upload
document
  .getElementById("upload-cover-image")
  .addEventListener("change", (e) => {
    uploadImageProfileSection(
      e,
      "upload-cover-image-a",
      "uploaded-cover-image",
      "upload-cover-picture-area",
      50
    );
  });

// company logo upload
document
  .getElementById("upload-company-logo")
  .addEventListener("change", (e) => {
    uploadImageProfileSection(
      e,
      "upload-company-logo-a",
      "uploaded-company-logo",
      "upload-company-logo-area",
      50
    );
  });

document
  .getElementById("upload-promo-video")
  .addEventListener("change", (e) => {
    uploadImageProfileSection(
      e,
      "upload-promo-video-a",
      "uploaded-promo-video",
      "upload-promo-video-area",
      90
    );
  });

document
  .getElementById("upload-gallery-image")
  .addEventListener("change", (e) => {
    uploadToGallery(e, "upload-gallery-images-a");
  });

document.getElementById("upload-qr-logo").addEventListener("change", (e) => {
  uploadImageProfileSection(
    e,
    "upload-qr-logo-a",
    "uploaded-qr-logo",
    "upload-qr-logo-area",
    125
  );
});

document.getElementById("color-picker-qr").addEventListener("input", (e) => {
  qrCodeColor(e.target.value, "color-picker-qr-a");
});
