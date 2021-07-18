const shareButton = document.querySelector('.share-button');
const shareDialog = document.querySelector('.share-dialog');
const closeButton = document.querySelector('.close-button');

shareButton.addEventListener('click', event => {
  if (navigator.share) {
   navigator.share({
      title: 'Share Link',
      url: ''
    }).then(() => {
      console.log('Thanks for sharing!');
    })
    .catch(console.error);
   console.log(`Couldn't share because of`, err.message);
    } else {
        alert("Your Connection is not Secure");
    }
});

closeButton.addEventListener('click', event => {
  shareDialog.classList.remove('is-open');
});


function send_email() {
    if (document.getElementById('sender-name').value!=""  && document.getElementById('sender-email').value!="" && document.getElementById('sender-message').value!="") {
        var original = document.getElementById('formdata')
        var fd = new FormData(original);
        document.getElementById('send-msg-btn').disabled = true;
        $.ajax({
            type: "POST",
            url: "/email",
            data: fd,
            cache: false,
            processData: false,
            contentType: false,
            success: function (result) {
                alert(result);
                original.reset();
                document.getElementById('send-msg-btn').disabled = false;
            },
            error: function (result) {
                alert(result);
                document.getElementById('submit').disabled = false;
            }
        });
    }

else
    {

alert('Warning: Name, Email and Message are necessary fields')
    }
}


function myqr() {
var qrWidth = 200;
    var qrHeight = 200;
    var logoQrWidth = qrWidth / 4;
    var logoQrHeight = qrHeight / 4;

    $('#Code').qrcode({
        render: "canvas",    //Set the rendering method, there are table and canvas
        text: document.getElementById("qrlink").value,
        width: qrWidth, //The width of the QR code
        height: qrHeight, //The height of the QR code
        foreground: document.getElementById("qrcolor").value,
    });
    if(document.getElementById("qrtype").value == "1") {
        $("#Code canvas")[0].getContext('2d').drawImage($("#qrlogo")[0], (qrWidth - logoQrWidth) / 2, (qrHeight - logoQrHeight) / 2, logoQrWidth, logoQrHeight);
    }
 var someimage = document.getElementById("Code").getElementsByTagName('canvas');
 var d=someimage[0].toDataURL();
 document.getElementById("dqr").href=d;
 document.getElementById("dqr").click();
 //Count increment of QR
 document.getElementById("qr_count_form").submit();
}

