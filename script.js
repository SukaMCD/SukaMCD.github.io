$(document).ready(function(){
    $(".button").click(function(){
        var value =$(this).attr("data-filter");
        if(value=="all"){
            $(".filter").show("100");
        }
        else{
            $(".filter").not("."+value).hide("1000");
            $(".filter").filter("."+value).show("1000");
        }
        $("ul .button").click(function(){
            $(this).addClass('active').siblings().removeClass('active');
        })
    })
})


document.addEventListener("DOMContentLoaded", function() {
  emailjs.init("U85vb-TLi4QCplmwy");

  const form = document.getElementById("contact-form");
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    emailjs.sendForm('service_i0zo3zo', 'template_m8ajqzd', this)
      .then(function() {
        alert("Message sent successfully!");
        form.reset();
      }, function(error) {
        alert("Failed to send message: " + JSON.stringify(error));
      });
  });
});
