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
