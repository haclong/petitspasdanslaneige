/* Toggle (mobile) side menu events */
function togglenav() {
  document.querySelector('#nav').classList.toggle('open');
}
document.querySelector('#mobile-nav-trigger').addEventListener('click', togglenav);
document.querySelector('#mobile-nav-close').addEventListener('click', togglenav);

/* Toggle go-to-top button events */
function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&     
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
function checkscroll(probe) {
  if (isElementInViewport(document.getElementById(probe))) {
    document.querySelector('#scrolltop').classList.remove('visible');
  } else {
    document.querySelector('#scrolltop').classList.add('visible');
  }
}
function gototop() {
  window.scrollTo(0, 0);
}