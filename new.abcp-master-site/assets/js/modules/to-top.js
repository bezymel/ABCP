const toTop = document.querySelector('.to-top');

const toggleToTop = () => {
  toTop.classList.toggle('visible', window.scrollY > 400);
};

window.addEventListener('scroll', toggleToTop, { passive: true });
toggleToTop(); // учесть случай, когда страница открыта уже с прокруткой