function showToast(message){
  const toast=document.getElementById("toast");
  toast.textContent=message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2500);
}
let currentFilter = "";
let currentSearch = "";

function searchStay() {
  const destination = document
    .getElementById("destination")
    .value
    .trim()
    .toLowerCase();

  const guestsValue = document.getElementById("guests").value;
  const guests = guestsValue ? parseInt(guestsValue) : null;

  if (!destination) {
    showToast("📍 Escribe un destino para comenzar tu búsqueda.");
    document.getElementById("destination").focus();
    return;
  }

  currentSearch = destination;

  applyFilters();

  const destinationName =
    document.getElementById("destination").value.trim();

  showToast(
    `🔎 Buscando alojamientos en ${destinationName}` +
    `${guests ? ` para ${guests} huésped(es)` : ""}...`
  );

  document
    .getElementById("alojamientos")
    .scrollIntoView({ behavior: "smooth" });
}
function setFilter(filter) {
  currentFilter = filter;
  currentSearch = "";

  document.getElementById("destination").value = "";

  applyFilters();

  document
    .getElementById("alojamientos")
    .scrollIntoView({ behavior: "smooth" });

  const visibleCards = [
    ...document.querySelectorAll(".property-card")
  ].filter(card => card.style.display !== "none");

  showToast(
    visibleCards.length
      ? `✨ Mostrando alojamientos: ${filter}`
      : `😅 Todavía no tenemos opciones de ${filter}.`
  );
}
function applyFilters() {
  const cards = [
    ...document.querySelectorAll(".property-card")
  ];

  const guestsValue = document.getElementById("guests").value;
  const guests = guestsValue ? parseInt(guestsValue) : null;

  let found = 0;

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const tags = (card.dataset.tags || "").toLowerCase();

    // Buscar destino
    const matchesSearch =
      !currentSearch || text.includes(currentSearch);

    // Buscar filtro
    let matchesFilter = true;

    if (currentFilter === "económico") {
      const priceText =
        card.querySelector("strong")?.textContent || "";

      const price =
        parseInt(priceText.replace(/\D/g, "")) || 0;

      matchesFilter = price < 50;
    } else if (currentFilter) {
      matchesFilter = tags.includes(currentFilter.toLowerCase());
    }

    // Comprobar cantidad de huéspedes
    let matchesGuests = true;

    if (guests) {
      const guestMatch =
        text.match(/(\d+)\s*huéspedes?/i);

      if (guestMatch) {
        const capacity = parseInt(guestMatch[1]);
        matchesGuests = capacity >= guests;
      }
    }

    const visible =
      matchesSearch &&
      matchesFilter &&
      matchesGuests;

    card.style.display = visible ? "" : "none";

    if (visible) {
      found++;
    }
  });

  if (currentSearch && found === 0) {
    showToast("😕 No encontramos alojamientos para esa búsqueda.");
  }
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
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

if (profileName) {
  profileName.textContent = name;
}

if (profileEmail) {
  profileEmail.textContent = user.email || "Correo no disponible";
}
    const profileAvatar = document.querySelector(".profile-avatar");

if (profileAvatar) {
  profileAvatar.innerHTML = `
    <img src="${avatar}" alt="Foto de perfil"
      style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
  `;
}
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
  const main = document.querySelector("main");

  if (!profile || !main) return;

  const sections = main.querySelectorAll(":scope > section");

  sections.forEach(section => {
    section.style.display = "none";
  });

  profile.style.display = "block";

  const menu = document.getElementById("profileMenu");

  if (menu) {
    menu.classList.remove("show");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
function showHome() {
  const main = document.querySelector("main");
  const sections = main.querySelectorAll(":scope > section");
  const profile = document.getElementById("perfil");

  sections.forEach(section => {
    section.style.display = "";
  });

  if (profile) {
    profile.style.display = "none";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
function toggleEditProfile() {
  const form = document.getElementById("editProfileForm");

  if (!form) return;

  if (form.style.display === "none" || form.style.display === "") {
    const user = netlifyIdentity.currentUser();

    if (user) {
      const name =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "";

      document.getElementById("editName").value = name;
      document.getElementById("editPhone").value =
        user.user_metadata?.phone || "";
      document.getElementById("editBio").value =
        user.user_metadata?.bio || "";
    }

    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
}

function saveProfileChanges() {
  const user = netlifyIdentity.currentUser();

  if (!user) {
    showToast("⚠️ Debes iniciar sesión para guardar cambios.");
    return;
  }

  const name = document.getElementById("editName").value.trim();
  const phone = document.getElementById("editPhone").value.trim();
  const bio = document.getElementById("editBio").value.trim();

  user.update({
    data: {
      ...user.user_metadata,
      full_name: name,
      phone: phone,
      bio: bio
    }
  })
  .then(updatedUser => {
    document.getElementById("profileName").textContent =
      updatedUser.user_metadata?.full_name || name || "Usuario";

    document.getElementById("profilePhone").textContent =
      updatedUser.user_metadata?.phone || "No agregado";

    document.getElementById("profileBio").textContent =
      updatedUser.user_metadata?.bio || "Cuéntanos un poco sobre ti.";

    showToast("✅ ¡Perfil actualizado!");

    const form = document.getElementById("editProfileForm");

    if (form) {
      form.style.display = "none";
    }

    updateUserInterface(updatedUser);
  })
  .catch(error => {
    console.error(error);
    showToast("❌ No se pudieron guardar los cambios.");
  });
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
function toggleDarkMode() {
  const enabled = document.body.classList.toggle("dark-mode");

  const text = document.getElementById("darkModeText");

  if (text) {
    text.textContent = enabled
      ? "Desactivar modo oscuro"
      : "Activar modo oscuro";
  }

  showToast(
    enabled
      ? "🌙 Modo oscuro activado"
      : "☀️ Modo claro activado"
  );
}
