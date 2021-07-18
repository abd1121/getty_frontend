
function populate() {

var lis = document.getElementById('social-link-dropdown-options').getElementsByTagName('li');
data=['Instagram','Linked In','Facebook','Website','Twitter']
data2=[]
for(var j=0;j<lis.length;j++) {
      var k=((lis[j].innerHTML).trim()).toString();
      data2.push(k)
  }
var currentSet = new Set(data2);
var i=((data.filter(x => !currentSet.has(x))).toString());
var v=document.getElementsByName(i)[0].value;
if (v=='None')
    v="";
document.getElementById('social-profile-link').value=v.toString();
};

function selectedvalue() {
    var v=(document.getElementById('selected-dropdown-option').innerHTML)
    if (v=="Monthly"){
      document.getElementById('key').value='0';
    }
    if(v=="Weekly"){

         document.getElementById('key').value='1';

    }
    if(v=="Yearly"){

        document.getElementById('key').value='2';
    }
    document.getElementById('sbutton').click()
    // v=document.getElementsByName("csrfmiddlewaretoken")[0].value
    // $.ajax({
    //           url: "/history/",
    //           type: 'POST',
    //           data: { post_id: document.getElementById('key'),csrfmiddlewaretoken:v},
    //           success: function(response){;
    //              console.log('hurry')
    //           }
    //        });
};