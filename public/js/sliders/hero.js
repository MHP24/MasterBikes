window.addEventListener('load', () => {
  new Glider(document.querySelector('.hero__cards'), {
    slidesToShow: 1,
    dots: '#hero__dots',
    arrows: {
      prev: '#hero--prev',
      next: '#hero--next'
    }
  });
});

