function setActiveNav(page) {
  addNavbarCSS();

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    const activeLink = document.getElementById(page + '-link');
    if (activeLink) {
      activeLink.classList.add('active'); 
    }
}


function addNavbarCSS() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'components/navbar/navbar.css';
  document.head.appendChild(link);  
}