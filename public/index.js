console.log("js is working")
$(function() {
    $('.lazy').Lazy({
        // your configuration goes here
        scrollDirection: 'vertical',
        effect: 'fadeIn', 
        effectTime: 300,
        chainable:true,
        visibleOnly: true,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
    });
});

// var scrollPosition

// $(window).on('scroll', function() {
//   scrollPosition= $(this).scrollTop()
//    console.log(scrollPosition) 
//    return scrollPosition
// });

// $(function() {
//     $(window).unload(function() {
//        localStorage.setItem("scrollPosition", scrollPosition);
//     });
//     if(localStorage.scrollPosition) {
//        $(scrollPosition).scrollTop(localStorage.getItem("scrollPosition"));
//     }
//  });

//  $(document).ready(function(){
//     $(this).scrollTop(localStorage.getItem("scrollPosition"));
// });


// $(".likeButt").click(function(event){
//     event.preventDefault();
//     const linkName = $(this).attr("value")
//     $.post("/like",
//     {"name":linkName},
//     function(data, status){
//         $(this).toastr({
//             text_heading: 'MuhWalls 2',
//             text_body: data,
//             align: 'center',
//             status: status
//           });

         
//     });


//   });

//   $(".likeButt").click(function(){
//     const linkNameG = $(this).attr("value")
// //    const lID =  JSON.stringify(`yay${linkNameG}`);
//     setTimeout(() => {
//   $.get( "/piclike", {"name":linkNameG}, function( data ) {
//     // $( ".result" ).html( data );
//     document.getElementById("yay"+linkNameG).innerHTML = "Likes:"+data;
//     // console.log(lID,  data)
        
// });
// }, 1500);
// })

// $(".dLikeButt").click(function(event){
//     event.preventDefault();
//     const linkNameD = $(this).attr("value")
//     console.log(linkNameD)
//     $.post("/dlike",
//     {"name":linkNameD},
//     function(data, status){
//         $(this).toastr({
//             text_heading: 'MuhWalls 2',
//             text_body: data,
//             align: 'center',
//             status: status
//           });

         
//     });


//   });

//   $(".dLikeButt").click(function(){
//     const linkNameDD = $(this).attr("value")
// //    const lID =  JSON.stringify(`yay${linkNameG}`);
//     setTimeout(() => {
//   $.get( "/picdLike", {"name":linkNameDD}, function( data ) {
//     // $( ".result" ).html( data );
//     document.getElementById("nay"+linkNameDD).innerHTML = "Bads:"+data;
//     // console.log(lID,  data)
        
// });
// }, 1500);
// })

//   $("a[href='#top']").click(function() {
//     $("html, body").animate({ scrollTop: 0 }, "fast");
//     return false;
//   });

