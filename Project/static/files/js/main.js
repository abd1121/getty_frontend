
document.getElementById("dimi").addEventListener('load', ()=> {
    // document.getElementById("choose").style.display='none';
    //    document.getElementById("cap").style.display='none';
    //    document.getElementById("retake").style.display='block';
    //  confirmBtn.classList.remove('not-visible')
    // const img_data = imageResult.src
    // const url =
    //
    // imageResult.src=url
    var $image = $('#uploaded-image')
    console.log($image)

    $image.cropper({

        crop: function (event) {

            // console.log(event.detail.x);
            // console.log(event.detail.y);
            // console.log(event.detail.width);
            // console.log(event.detail.height);
            // console.log(event.detail.rotate);
            // console.log(event.detail.scaleX);
            // console.log(event.detail.scaleY);
        }

    });
    var cropper = $image.data('cropper');

    document.getElementById("crop-and-upload-button").addEventListener('click', () => {
        cropper.getCroppedCanvas().toBlob((blob) => {
            const imageForm = document.getElementById('scanform')
            const fd = new FormData(imageForm);
            // fd.append('csrfmiddlewaretoken', csrf[0].value)
            fd.append('file', blob, 'my-image.png');
            // console.log('Blob - ', blob)
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                var base64String = reader.result;
                $('#to-be-scanned-img')
                          .attr('src', base64String);
                 $('#data')
                          .attr('value', base64String);
            }
        })
    });

$('#start-scanning-button').click(function(event) {
    event.preventDefault();
    const token = document.getElementsByName("csrfmiddlewaretoken");
     var myform = document.getElementById("scanform");
    var fd = new FormData(myform );
   $.ajax({
        url : "/home/", // the endpoint
        type : "POST", // http method
        data : fd, // data sent with the post request
        headers: {
                        'X-CSRFToken': token[0].value
                   },
       contentType: false,
       processData: false,
       cache: false,
        // handle a successful response

        success : function(data) {
            document.getElementById('description').innerHTML=data['Description']
            document.getElementById('des').value=data['Description'].toString()
            document.getElementById('name').innerHTML=data['Name']
            document.getElementById('na').value=data['Name'].toString()
            document.getElementById('contact').innerHTML=data['Contact']
             document.getElementById('con').value=data['Contact'].toString()
            document.getElementById('address').innerHTML=data['Address']
             document.getElementById('add').value=data['Address'].toString()
            document.getElementById('mail').innerHTML=data['Email']
            document.getElementById('em').value=data['Email'].toString()

            //Visualization
            scanningArea.style.display = "none";
            scanningCompleted.style.display = "flex";
        },
        // handle a non-successful response
        error : function(errmsg) {
              alert('Bug Found')
        }
    });
});


    });

 function display(event) {
        event.preventDefault();
        Webcam.set({
            width: 250,
            height: 250,
            image_format: 'jpeg',
            jpeg_quality: 200
        });
        Webcam.attach('#controls');

        document.getElementById("camb").style.display = 'none';
        document.getElementById("btns").style.display = 'block';
        document.getElementById("controls").style.display = "block";

    }

    function take_snapshot() {
			Webcam.snap( function(data_uri) {
               document.getElementById("crop-picture-modal").style.display='block';
                $('#uploaded-image').attr('src',data_uri)
               $('#dimi')
                .attr('src',data_uri );

			} );


 }
