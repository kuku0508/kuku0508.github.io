(() => {
  const images = document.querySelectorAll(".project .page__content img");
  if (!images.length) return;

  const overlay = document.createElement("div");
  overlay.className = "project-lightbox";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="project-lightbox__dialog" role="dialog" aria-modal="true" aria-label="圖片放大檢視">
      <button class="project-lightbox__close" type="button" aria-label="關閉圖片">×</button>
      <img class="project-lightbox__image" alt="">
      <p class="project-lightbox__caption"></p>
    </div>`;
  document.body.append(overlay);

  const largeImage = overlay.querySelector(".project-lightbox__image");
  const caption = overlay.querySelector(".project-lightbox__caption");
  const closeButton = overlay.querySelector(".project-lightbox__close");
  let previousFocus;
  let previousOverflow;

  const close = () => {
    if (overlay.hidden) return;
    overlay.hidden = true;
    largeImage.removeAttribute("src");
    document.body.style.overflow = previousOverflow;
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  };

  const open = (image) => {
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    largeImage.src = image.currentSrc || image.src;
    largeImage.alt = image.alt || "放大的專案圖片";
    const description = image.closest("figure")?.querySelector("figcaption")?.textContent?.trim() || image.alt?.trim() || "";
    caption.textContent = description;
    caption.hidden = !description;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  };

  images.forEach((image) => {
    if (image.closest("a")) return;
    image.classList.add("project-image-zoomable");
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `放大圖片：${image.alt || "專案圖片"}`);
    image.addEventListener("click", () => open(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(image);
      }
    });
  });

  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener("keydown", (event) => {
    if (overlay.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "Tab") {
      event.preventDefault();
      closeButton.focus();
    }
  });
})();
