$(".mobile-menu-icon").click(function(){
  $(".side-menu").toggleClass("mobile-sidebar");
});

window.onscroll = function() {myFunction()};

var header = document.getElementById("myHeader");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

       $('#clients').owlCarousel({
            loop:true,
            margin:10,
            nav:false,
            dots:true,
            autoplay:true,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:1,
                    dots:false
                },
                1000:{
                    items:1
                }
            }
        })