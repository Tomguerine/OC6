// src/pages/index.ts
import { photographerTemplate } from "../templates/photographer.js";

type Photographer = {
  name: string;
  id: number;
  city: string;
  country: string;
  tagline: string;
  price: number;
  portrait: string;
};

async function getPhotographers(): Promise<{ photographers: Photographer[] }> {
  const response = await fetch("data/photographers.json");
  const data = await response.json();
  return data; // {photographers: [...]}
}

function displayData(photographers: Photographer[]): void {
  const photographersSection = document.querySelector(".photographer_section");
  if (!photographersSection) return;

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init(): Promise<void> {
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
