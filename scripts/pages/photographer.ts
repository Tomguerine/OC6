import { photographerHeaderTemplate } from "../templates/photographerHeader.js";
import { mediaTemplate } from "../templates/media.js";
import { closeModal, displayModal } from "../utils/contactForm.js";

type Photographer = {
  name: string;
  id: number;
  city: string;
  country: string;
  tagline: string;
  price: number;
  portrait: string;
};

export type Media = {
  id: number;
  photographerId: number;
  title: string;
  image?: string;
  video?: string;
  likes: number;
  date?: string;
};

const urlParams = new URLSearchParams(window.location.search);
const photographerId = urlParams.get("id");

function createSortSection(): HTMLElement {
  const sortSection = document.createElement("div");
  sortSection.classList.add("sort-section");

  const sortButton = document.createElement("button");
  sortButton.textContent = "Trier par";

  const sortMenu = document.createElement("ul");
  sortMenu.classList.add("sort-menu");

  const options = ["Popularité", "Date", "Titre"];
  options.forEach((option) => {
    const li = document.createElement("li");
    li.textContent = option;

    li.addEventListener("click", () => {
      console.log(`Trié par : ${option}`);
      sortMedia(option);
      sortMenu.classList.remove("open");
    });

    sortMenu.appendChild(li);
  });

  const closeMenu = document.createElement("span");
  closeMenu.classList.add("close-menu");
  closeMenu.textContent = "▲";
  closeMenu.addEventListener("click", () => sortMenu.classList.remove("open"));
  sortMenu.appendChild(closeMenu);

  sortButton.addEventListener("click", () => sortMenu.classList.toggle("open"));

  sortSection.appendChild(sortButton);
  sortSection.appendChild(sortMenu);

  return sortSection;
}

function sortMedia(criteria: string) {
  const gallery = document.querySelector(".photographer-gallery")!;
  const mediaCards = Array.from(
    gallery.querySelectorAll(".media-card")
  ) as HTMLElement[];

  const sortedCards = mediaCards.sort((a, b) => {
    const likesA = parseInt(
      a.querySelector(".like-container span")!.textContent!
    );
    const likesB = parseInt(
      b.querySelector(".like-container span")!.textContent!
    );

    const titleA = a.querySelector("h3")!.textContent!;
    const titleB = b.querySelector("h3")!.textContent!;

    if (criteria === "Popularité") {
      return likesB - likesA;
    } else if (criteria === "Date") {
      const dateA = new Date(a.getAttribute("data-date")!);
      const dateB = new Date(b.getAttribute("data-date")!);
      return dateB.getTime() - dateA.getTime();
    } else if (criteria === "Titre") {
      return titleA.localeCompare(titleB);
    }

    return 0;
  });

  gallery.innerHTML = "";
  sortedCards.forEach((card) => gallery.appendChild(card));
}

function handleFormSubmit(event: Event): void {
  event.preventDefault();

  const form = document.getElementById("contact-form") as HTMLFormElement;
  const formData = new FormData(form);

  console.log("Données du formulaire :");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  closeModal(); // Ferme la modale après la soumission
}

async function init() {
  if (!photographerId) {
    console.error("Pas d'id de photographe dans l'URL");
    return;
  }

  const response = await fetch("data/photographers.json");
  const data = await response.json();
  const { photographers, media } = data;

  const selectedPhotographer: Photographer = photographers.find(
    (p: Photographer) => p.id === parseInt(photographerId)
  );

  if (selectedPhotographer) {
    const mainContainer = document.querySelector("main")!;

    // Ajouter l'entête du photographe
    const photographerHeader = photographerHeaderTemplate(selectedPhotographer);
    mainContainer.insertBefore(photographerHeader, mainContainer.firstChild);

    // Ajouter la section de tri
    const sortSection = createSortSection();
    mainContainer.insertBefore(
      sortSection,
      mainContainer.querySelector(".photographer-gallery")
    );

    // Ajouter les médias
    const gallery = document.createElement("div");
    gallery.classList.add("photographer-gallery");
    mainContainer.appendChild(gallery);

    const photographerMedia = media.filter(
      (m: Media) => m.photographerId === selectedPhotographer.id
    );

    photographerMedia.forEach((mediaItem: Media) => {
      const mediaCard = mediaTemplate(mediaItem, selectedPhotographer.name);
      gallery.appendChild(mediaCard);
    });

    // Ajouter la modale "Contactez-moi"
    document.querySelector(".contact-button")!.addEventListener("click", () => {
      displayModal();
      const modalPhotographerName = document.querySelector(
        ".modal-photographer-name"
      )!;
      modalPhotographerName.textContent = selectedPhotographer.name; // Affiche le nom
    });

    document
      .getElementById("modal-close")!
      .addEventListener("click", closeModal);

    document
      .getElementById("contact-form")!
      .addEventListener("submit", handleFormSubmit);

    // Ajouter la section fixe en bas à droite
    const bottomInfo = document.createElement("div");
    bottomInfo.classList.add("bottom-right-info");
    bottomInfo.innerHTML = `
      <span class="likes-info">
        <span class="likes-count">124</span> <!-- Remplacez par une valeur dynamique si nécessaire -->
        <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.8 4.6c-1.6-1.5-4.2-1.5-5.8 0l-1 1-1-1c-1.6-1.5-4.2-1.5-5.8 0s-1.5 4.2 0 5.8l7 6.8 7-6.8c1.5-1.6 1.5-4.2 0-5.8z"></path>
        </svg>
      </span>
      <span class="daily-price">${selectedPhotographer.price}€/jour</span>
    `;
    document.body.appendChild(bottomInfo);
  } else {
    console.error("Photographe non trouvé pour l'id :", photographerId);
  }
}

init();
