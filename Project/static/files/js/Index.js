    const colors = document.querySelector(":root");
    const cropModal = document.getElementById("crop-picture-modal");
    const closeBtn = document.getElementById("close-crop-modal");
    const retakeBtn = document.getElementById("retake-button");
    const startScanBtn = document.getElementById("start-scanning-button");
    const closeScanning = document.getElementById("cross-scanning-button");
    const scanningLoader = document.getElementById("scanning-loader");
    const filename = document.getElementById("filename");
    const backBtn = document.getElementById("back-to-select-card");
    const img = document.getElementById("to-be-scanned-img");
    const bar = document.getElementById("scanner-bar");
    const scanArea = document.getElementById("scanning-area");
    const progressBar = document.getElementById("scanning-progress-bar");
    const uploadImage = document.getElementById("uploadedCard");
    const uploadButton = document.getElementById("crop-and-upload-button");
    const vcfModal = document.getElementById("download-vcf-modal");


    const rs = getComputedStyle(colors);
// The Image Uploaded by the user will be stored
// in this variable.
    var uploadedImage;

    /*****************************************************************
     *                UPLOAD IMAGE FUNCTION
     *          --------------------------------
     * Parameters : Event Args
     * Functionality: Uploads Image from the gallery
     * Returns : Nothing
     ****************************************************************/
    const uploadImageMethod = (e) => {
      if (isMobileDevice()) {
        const modalControl = document.getElementById("crop-modal-controls");
        modalControl.style.flexDirection = "column";
        modalControl.style.width = "300px";
        modalControl.style.height = "auto";
      }
      cropModal.style.display = "block";
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = ((file1) => {
        return (e) => {
          document.getElementById("uploaded-image").src = e.target.result;
          uploadedImage = e.target.result;
          $('#dimi').attr('src', e.target.result);
        };
      })(file);
      reader.readAsDataURL(file);
    };

    /*****************************************************************
     *            START SCANNING CARD FUNCTION
     *          --------------------------------
     * Parameters : None
     * Functionality: Animates the scanning bars
     * Returns : Nothing
     ****************************************************************/
    const startScanning = () => {
      scanningLoader.style.display = "block";
      filename.innerHTML = uploadImage.value.split("\\").pop().split("/").pop();
      img.style.filter = "blur(6px)";
      bar.style.display = "block";
      bar.scrollIntoView();
      startScanBtn.disabled = true;
      startScanBtn.style.backgroundColor = "grey";
      var loaded = 0,
          barLoaded = 0;
      var iter = 0;
      // Change this time interval according to loading time
      var timeInterval = 50;
      let goingUp = false;

      const position = img.getBoundingClientRect(),
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      document.getElementById("scanning-area").style.width =
          img.offsetWidth + 30 + "px";
      // Animation Logic
      if (iter == 0) {
        iter = 1;
        var id = setInterval(() => {
          if (loaded >= 100) {
            // clearInterval(id);
            // iter = 0;
            // scanningArea.style.display = "none";
            // scanningCompleted.style.display = "flex";
          } else {
            loaded++;
            barLoaded++;
            progressBar.style.width = loaded + "%";
            if (
                bar.getBoundingClientRect().top >= position.top &&
                bar.getBoundingClientRect().bottom < position.bottom
            ) {
              bar.style.top = position.top + scrollTop + barLoaded * 10 + "px";
            } else {
              barLoaded = 0;
              bar.style.top = position.top + scrollTop - barLoaded * 10 + "px";
            }
          }
        }, timeInterval);
      }
    };

    /*****************************************************************
     *            STOP SCANNING CARD FUNCTION
     *          --------------------------------
     * Parameters : None
     * Functionality: Stops Animation and displys next screen
     * Returns : Nothing
     ****************************************************************/
    const stopScanning = () => {
      scanningLoader.style.display = "none";
      img.style.filter = "none";
      bar.style.display = "none";
      startScanBtn.disabled = false;
      startScanBtn.style.backgroundColor = rs.getPropertyValue("--dark-blue");
    };

    /*****************************************************************
     *              COPY INPUT FIELDS FUNCTION
     *          --------------------------------
     * Parameters : HTML DOM Element
     * Functionality:
     *    - Copy Text to clipboard
     *    - Gets the position of current input element
     *      and displays copied confirmation message.
     * Returns : Nothing
     ****************************************************************/
    const copyText = (element) => {
      // Remove existing copied effect
      const copyElements = [
        "copy-name",
        "copy-description",
        "copy-contact",
        "copy-address",
        "copy-mail",
      ];
      copyElements.map((e) => {
        document.getElementById(e).style.backgroundColor = "transparent";
      });

      // Copy to clipboard
      const copyBtn = document.getElementById("copy-" + element);
      const target = document.getElementById(element);

      if (element === "description") {
      } else if (target) {
        const el = document.createElement("textarea");
        el.value = target.innerText;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }

      // Style changes on copying
      const position = copyBtn.getBoundingClientRect(),
          scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // button style
      copyBtn.style.backgroundColor = "#deefff";
      copyBtn.style.borderRadius = "4px";
      copyBtn.style.border = "none";

      // notification for copied
      if (!isMobileDevice()) {
        const msgBox = document.getElementById("copied-successfully-msg");
        msgBox.style.display = "block";
        msgBox.style.top = position.top + scrollTop + "px";
        msgBox.style.left =
            position.left + scrollLeft + copyBtn.offsetWidth + 10 + "px";
      }
    };

    /*****************************************************************
     *              SELECT DROPDOWN OPTION FUNCTION
     *          --------------------------------------
     * Parameters : HTML DOM Element
     * Functionality:
     *    - selected the cliacked option od dashboard
     *    - Puts already selected option back in the list
     * Returns : Nothing
     ****************************************************************/
    const selectOption = (option) => {
      console.log(option);
      const selected = document.getElementById("selected-dropdown-option");
      const temp = selected.innerHTML;
      selected.innerHTML = option.innerHTML;
      option.innerHTML = temp;
      document.getElementById("dropdown-options").style.display = "none";

      document.getElementById("dropdown-arrow").style.transform = "rotate(270deg)";
    };

    /*****************************************************************
     *              IS MOBILE DEVICE FUNCTION
     *          --------------------------------------
     * Parameters : None
     * Functionality:
     *    - Checks if the target device is mobile phone
     * Returns : true if device is mobile, false otherwise
     ****************************************************************/
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
     * Parameters : None
     * Functionality:
     *    - Select the option from the dropdown
     * Returns : Nothing
     ****************************************************************/
    const toggleDropdownOptions = (arrow, options, arg) => {
      if (options.style.display === "none" || options.style.display === "") {
        arrow.style.transform = "rotate(90deg)";
        options.style.display = "block";
        if (arg === "navbar") {
          document.getElementById("nav-dropdown").style.backgroundColor =
              "rgba(222, 239, 255, 0.3)";
        }
      } else {
        arrow.style.transform = "rotate(270deg)";
        options.style.display = "none";
        if (arg === "navbar") {
          document.getElementById("nav-dropdown").style.backgroundColor =
              "transparent";
        }
      }
    };

    if (uploadImage)
      uploadImage.addEventListener("change", (e) => {
        uploadImageMethod(e);
      });


    if (closeBtn)
      closeBtn.addEventListener("click", () => {
        cropModal.style.display = "none";
      });

    if (retakeBtn)
      retakeBtn.addEventListener("click", () => {
        console.log("Hello");
        cropModal.style.display = "none";
      });

    if (startScanBtn)
      startScanBtn.addEventListener("click", () => {
        startScanning();
      });

    if (closeScanning)
      closeScanning.addEventListener("click", () => {
        stopScanning();
      });

    if (document.getElementById("donot-download-vcf-button"))
      document
          .getElementById("donot-download-vcf-button")
          .addEventListener("click", (event) => {
            vcfModal.style.display = "none";
          });

    if (document.getElementById("download-vcf-button"))
      document
          .getElementById("download-vcf-button")
          .addEventListener("click", (event) => {
            vcfModal.style.display = "flex";
          });

    if (document.getElementById("dropdown-option-1"))
      document
          .getElementById("dropdown-option-1")
          .addEventListener("click", () =>
              selectOption(document.getElementById("dropdown-option-1"))
          );

    if (document.getElementById("dropdown-option-2"))
      document
          .getElementById("dropdown-option-2")
          .addEventListener("click", () =>
              selectOption(document.getElementById("dropdown-option-2"))
          );

    if (document.getElementById("dropdown-main"))
      document
          .getElementById("dropdown-main")
          .addEventListener("click", () =>
              toggleDropdownOptions(
                  document.getElementById("dropdown-arrow"),
                  document.getElementById("dropdown-options")
              )
          );

    if (document.getElementById("my-profile-button"))
      document.getElementById("my-profile-button").addEventListener("click", () => {
        toggleDropdownOptions(
            document.getElementById("nav-dropdown-arrow"),
            document.getElementById("nav-dropdown-list"),
            "navbar"
        );
      });
