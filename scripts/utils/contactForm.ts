// src/utils/contactForm.ts

function displayModal(): void {
  const modal = document.getElementById("contact_modal");
  if (modal instanceof HTMLElement) {
    modal.style.display = "block";
  }
}

function closeModal(): void {
  const modal = document.getElementById("contact_modal");
  if (modal instanceof HTMLElement) {
    modal.style.display = "none";
  }
}

export { displayModal, closeModal };
