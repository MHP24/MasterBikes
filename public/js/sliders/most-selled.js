window.addEventListener('load', () => {
    // Products Slider
      new Glider(document.querySelector('#products__container'), {
          slidesToShow: 4,
          slidesToScroll: 2,
          draggable: true,    
          dots: '#products__dots', 
          arrows: {
              prev: '#product--prev',
              next: '#product--next'
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