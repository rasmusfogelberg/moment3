const hamburger = document.querySelector(".burgeru");
const navMenu = document.querySelector(".nav-menu");
const link = document.querySelectorAll(".nav-link");
const header = document.querySelector(".header");
const sticky = header.offsetTop;

window.onscroll = () => stickyHeader();

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

link.forEach((item) => {
  item.addEventListener("click", closeMenu);
});

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

function stickyHeader() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}