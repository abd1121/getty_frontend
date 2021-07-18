const imageResult = document.getElementById('imageResult')
const imageForm = document.getElementById('myform')
const confirmBtn = document.getElementById('confirm-btn')
const input1 = document.getElementById('upload')

const csrf = document.getElementsByName('csrfmiddlewaretoken')

document.getElementById("dimi").addEventListener('load', ()=>{
   document.getElementById("choose").style.display='none';
      document.getElementById("cap").style.display='none';
      document.getElementById("retake").style.display='block';
    confirmBtn.classList.remove('not-visible')
    // const img_data = imageResult.src
    // const url =
    //
    // imageResult.src=url
    var $image = $('#imageResult')
    console.log($image)

     $image.cropper({
     
                     crop: function(event) {

                            console.log(event.detail.x);
                            console.log(event.detail.y);
                            console.log(event.detail.width);
                            console.log(event.detail.height);
                            console.log(event.detail.rotate);
                            console.log(event.detail.scaleX);
                            console.log(event.detail.scaleY);
                        }


  });


   var cropper = $image.data('cropper');

    confirmBtn.addEventListener('click', ()=>{
        cropper.getCroppedCanvas().toBlob((blob) => {
            console.log('confirmed')
            const fd = new FormData(imageForm);
            fd.append('csrfmiddlewaretoken', csrf[0].value)
            fd.append('file', blob, 'my-image.png');
           console.log('Blob - ', blob)
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
    var base64String = reader.result;
    console.log('Base64 String - ', base64String);
      $('#data2')
                .attr('value', base64String);
         $('#check')
                .attr('value', 1);
         document.getElementById('myform').submit();
        }
        })
    })
})