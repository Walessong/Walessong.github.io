(()=>{var i=class{constructor(){this.init()}init(){this.setupMouseTracking(),this.setupScrollEffects(),this.setupNavigationAnimations(),this.setupMobileMenuEnhancements()}setupMouseTracking(){document.querySelectorAll(".nav-link").forEach(e=>{e.addEventListener("mousemove",s=>{let n=e.getBoundingClientRect(),o=s.clientX-n.left,l=s.clientY-n.top;e.style.setProperty("--mouse-x",`${o}px`),e.style.setProperty("--mouse-y",`${l}px`)})})}setupScrollEffects(){let t=!1,e=()=>{let n=document.querySelector(".site-header");window.scrollY>24?n.classList.add("is-scrolled"):n.classList.remove("is-scrolled"),t=!1},s=()=>{t||(requestAnimationFrame(e),t=!0)};window.addEventListener("scroll",s,{passive:!0})}setupNavigationAnimations(){document.querySelectorAll(".nav-link").forEach((e,s)=>{e.style.animationDelay=`${s*.1}s`,e.addEventListener("mouseenter",()=>{this.addHoverEffects(e)}),e.addEventListener("mouseleave",()=>{this.removeHoverEffects(e)})})}addHoverEffects(t){let e=document.createElement("div");e.className="hover-glow",t.appendChild(e),this.createRippleEffect(t)}removeHoverEffects(t){let e=t.querySelector(".hover-glow");e&&e.remove()}createRippleEffect(t){let e=document.createElement("div");e.className="ripple-effect",e.style.cssText=`
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;let s=t.getBoundingClientRect(),n=Math.max(s.width,s.height),o=s.width/2-n/2,l=s.height/2-n/2;e.style.width=e.style.height=n+"px",e.style.left=o+"px",e.style.top=l+"px",t.appendChild(e),setTimeout(()=>{e.parentNode&&e.remove()},600)}setupMobileMenuEnhancements(){let t=document.getElementById("mobile-menu-toggle"),e=document.getElementById("mobile-menu");t&&e&&(t.addEventListener("click",()=>{this.toggleMobileMenu(e,t)}),e.querySelectorAll("a").forEach(n=>{n.addEventListener("click",()=>{setTimeout(()=>{this.closeMobileMenu(e,t)},100)})}))}toggleMobileMenu(t,e){t.classList.contains("hidden")?this.openMobileMenu(t,e):this.closeMobileMenu(t,e)}openMobileMenu(t,e){t.classList.remove("hidden"),e.setAttribute("aria-expanded","true"),t.style.animation="slideInFromTop 0.3s ease-out",t.querySelectorAll(".dropdown-item").forEach((n,o)=>{n.style.animationDelay=`${o*.05}s`,n.style.animation="fadeInScale 0.3s ease-out both"})}closeMobileMenu(t,e){t.classList.add("hidden"),e.setAttribute("aria-expanded","false"),t.style.animation="",t.querySelectorAll(".dropdown-item").forEach(n=>{n.style.animation=""})}setupKeyboardNavigation(){document.querySelectorAll(".nav-link").forEach(e=>{e.addEventListener("keydown",s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),e.click())})})}},c=()=>{let a=document.createElement("style");a.textContent=`
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
  `,document.head.appendChild(a)};document.addEventListener("DOMContentLoaded",()=>{c(),new i});window.NavigationEnhancements=i;})();
