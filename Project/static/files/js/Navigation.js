    const dashboardBtn = document.getElementById("dashboard-nav");
    const scanBtn = document.getElementById("scan-card-nav");
    const dashboard = document.getElementById("dashboard-area");
    const scanScreen = document.getElementById("scan-card-area");
    const createGettyProfile = document.getElementById("create-getty-profile-area");
    const createProfileBtn = document.getElementById("create-new-profile-button");
    const scanningArea = document.getElementById("scanning-screen-area");
    const scanningCompleted = document.getElementById("scanning-completed-screen");
    const backToScan = document.getElementById("back-to-scan-card");
    const nav = document.getElementById("nav-menu");
    if (dashboardBtn)
      dashboardBtn.addEventListener("click", () => {
        dashboardBtn.classList.add("nav-bar-element-selected");
        scanBtn.classList.remove("nav-bar-element-selected");
        scanBtn.classList.add("nav-bar-element");
        scanScreen.style.display = "none";
        dashboard.style.display = "flex";
        scanningArea.style.display = "none";
        scanningCompleted.style.display = "none";
        createGettyProfile.style.display = "none";
        if (isMobileDevice()) {
          closeNav();
          document.getElementById("dropdown-options").style.display = "none";
        }
      });
    if (scanBtn)
      scanBtn.addEventListener("click", () => {
        scanBtn.classList.add("nav-bar-element-selected");
        dashboardBtn.classList.remove("nav-bar-element-selected");
        dashboardBtn.classList.add("nav-bar-element");
        scanScreen.style.display = "flex";
        dashboard.style.display = "none";
        scanningArea.style.display = "none";
        scanningCompleted.style.display = "none";
        createGettyProfile.style.display = "none";
        if (isMobileDevice()) {
          closeNav();
        }
      });
    if (createProfileBtn)
      createProfileBtn.addEventListener("click", () => {
        scanScreen.style.display = "none";
        dashboard.style.display = "none";
        scanningArea.style.display = "none";
        scanBtn.classList.remove("nav-bar-element-selected");
        dashboardBtn.classList.remove("nav-bar-element-selected");
        scanningCompleted.style.display = "none";
        createGettyProfile.style.display = "flex";
        if (isMobileDevice()) {
          closeNav();
        }
      });
    if (backToScan)
      backToScan.addEventListener("click", () => {
        scanningArea.style.display = "flex";
        scanningCompleted.style.display = "none";
      });
    if (backBtn)
      backBtn.addEventListener("click", () => {
        scanScreen.style.display = "flex";
        scanningArea.style.display = "none";
        scanningLoader.style.display = "none";
        img.style.filter = "none";
        bar.style.display = "none";
        startScanBtn.disabled = false;
        startScanBtn.style.backgroundColor = rs.getPropertyValue("--dark-blue");
      });
    if (uploadButton)
      uploadButton.addEventListener("click", () => {
        cropModal.style.display = "none";
        scanScreen.style.display = "none";
        scanningArea.style.display = "flex";
        document.getElementById("to-be-scanned-img").src = uploadedImage;
      });
    if (nav)
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
