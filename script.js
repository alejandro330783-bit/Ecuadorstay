function showToast(message){
  const toast=document.getElementById("toast");
  toast.textContent=message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2500);
}
function searchStay(){
  const destination=document.getElementById("destination").value.trim();
  const guests=document.getElementById("guests").value;
  if(!destination){
    showToast("📍 Escribe un destino para comenzar tu búsqueda.");
    document.getElementById("destination").focus();
    return;
  }
  showToast(`🔎 Buscando alojamientos en ${destination}${guests ? ` para ${guests} huésped(es)` : ""}...`);
  document.getElementById("alojamientos").scrollIntoView({behavior:"smooth"});
}
function setFilter(filter){
  const cards=[...document.querySelectorAll(".property-card")];
  let found=0;
  cards.forEach(card=>{
    const visible=filter==="económico" ? parseInt(card.querySelector("strong").textContent.replace(/\D/g,""))<50 : card.dataset.tags.includes(filter);
    card.style.display=visible?"block":"none";
    if(visible) found++;
  });
  showToast(found ? `✨ Mostrando alojamientos: ${filter}` : `😅 Todavía no tenemos opciones de ${filter}.`);
  document.getElementById("alojamientos").scrollIntoView({behavior:"smooth"});
}
function toggleMenu(){
  const nav=document.querySelector(".navbar nav");
  nav.style.display=nav.style.display==="flex"?"none":"flex";
  if(nav.style.display==="flex"){
    nav.style.position="absolute";nav.style.top="66px";nav.style.left="0";nav.style.right="0";
    nav.style.background="#fff";nav.style.padding="18px";nav.style.flexDirection="column";nav.style.gap="14px";
    nav.style.boxShadow="0 8px 20px #0002";
  }
}
document.querySelectorAll(".property-img button").forEach(btn=>{
  btn.addEventListener("click",e=>{
    e.stopPropagation();
    btn.textContent=btn.textContent==="♡"?"♥":"♡";
    showToast(btn.textContent==="♥"?"❤️ Añadido a favoritos":"Eliminado de favoritos");
  });
});
// ===============================
// ECUADORSTAY - SESIÓN DE USUARIO
// ===============================

function updateUserInterface(user) {
  const navActions = document.querySelector(".nav-actions");

  if (!navActions) return;

  if (user) {
    const name =
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Usuario";

    const avatar =
      user.user_metadata?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=087f69&color=fff`;

    navActions.innerHTML = `
      <div class="user-profile">
        <button class="profile-button" onclick="toggleProfileMenu()">
          <img src="${avatar}" alt="Foto de perfil">
          <span>${name}</span>
          <span class="profile-arrow">⌄</span>
        </button>

        <div id="profileMenu" class="profile-menu">
          <div class="profile-menu-header">
            <strong>${name}</strong>
            <small>${user.email || ""}</small>
          </div>

         <button onclick="showProfile()">
  👤 Mi perfil
</button>

          <button onclick="showToast('🏠 Mis alojamientos próximamente')">
            🏠 Mis alojamientos
          </button>

          <button onclick="showToast('❤️ Tus favoritos próximamente')">
            ❤️ Favoritos
          </button>

          <button onclick="showToast('📅 Tus reservas próximamente')">
            📅 Mis reservas
          </button>

          <button onclick="showToast('⚙️ Configuración próximamente')">
            ⚙️ Configuración
          </button>

          <button onclick="logoutUser()" class="logout-button">
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
    `;
  } else {
    navActions.innerHTML = `
      <button class="icon-btn" aria-label="Favoritos">♡</button>

      <button class="outline-btn" onclick="netlifyIdentity.open('login')">
        Iniciar sesión
      </button>

      <button class="primary-btn" onclick="netlifyIdentity.open('signup')">
        Crear cuenta
      </button>
    `;
  }
}

function toggleProfileMenu() {
  const menu = document.getElementById("profileMenu");

  if (menu) {
    menu.classList.toggle("show");
  }
}
function showProfile() {
  const profile = document.getElementById("perfil");

  if (!profile) return;

  profile.scrollIntoView({ behavior: "smooth" });

  const menu = document.getElementById("profileMenu");

  if (menu) {
    menu.classList.remove("show");
  }
}
function logoutUser() {
  netlifyIdentity.logout();
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof netlifyIdentity === "undefined") return;

  netlifyIdentity.on("init", user => {
    updateUserInterface(user);
  });

  netlifyIdentity.on("login", user => {
    updateUserInterface(user);
    showToast("👋 ¡Bienvenido a EcuadorStay!");
    netlifyIdentity.close();
  });

  netlifyIdentity.on("logout", () => {
    updateUserInterface(null);
    showToast("👋 Sesión cerrada correctamente.");
  });
});
