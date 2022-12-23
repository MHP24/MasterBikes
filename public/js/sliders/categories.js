window.addEventListener('load', () => {
  // Categories Slider
    new Glider(document.querySelector('#categories__container'), {
        slidesToShow: 4,
        slidesToScroll: 2,
        draggable: true,    
        dots: '#categories__dots', 
        arrows: {
            prev: '#category--prev',
            next: '#category--next'
        },
        responsive: [
            {
              breakpoint: 300,
              settings: {
                slidesToShow: 'auto',
                slidesToScroll: 'auto',
                itemWidth: 250,
                duration: 0.25
              }
            },{
              breakpoint: 1024,
              settings: {
                slidesToShow: 'auto',
                slidesToScroll: 3,
                itemWidth: 250,
                duration: 0.25
              }
            }
          ]
    });
});