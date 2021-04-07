
$("#toggle-password1").click(function() {

$(this).toggleClass("fa-eye fa-eye-slash");
var input = $($(this).attr("toggle"));
if (input.attr("type") == "password") {
  input.attr("type", "text");
} else {
  input.attr("type", "password");
}
});

$("#toggle-password2").click(function () {

    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});

function getAge() {
    var dateString = document.getElementById("date").value;
    if(dateString !="")
    {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        var da = today.getDate() - birthDate.getDate();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if(m<0){
            m +=12;
        }
        if(da<0){
            da +=30;
        }
    
      if(age < 16 || age > 75)
    {
    req.flash("error","Age "+ age +" is restrict"); 
    
     }
    //   else {
    
    // alert("Age "+age+" is allowed");

    // }
    // } else {
    // alert("please provide your date of birth");
    // }
}
}
 $(function () {
       $('[data-toggle="tooltip"]').tooltip()
 })    


  