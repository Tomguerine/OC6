type Photographer = {
  name: string;
  id: number;
  city: string;
  country: string;
  tagline: string;
  price: number;
  portrait: string;
};

// Récupérer l'ID depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const photographerId = urlParams.get("id");

async function getPhotographers(): Promise<{ photographers: Photographer[] }> {
  const response = await fetch("data/photographers.json");
  const data = await response.json();
  return data;
}

async function init(): Promise<void> {
  if (!photographerId) {
    console.error("Pas d'id de photographe dans l'URL");
    return;
  }

  const { photographers } = await getPhotographers();
  const selectedPhotographer = photographers.find(
    (p) => p.id === parseInt(photographerId)
  );

  if (selectedPhotographer) {
    console.log("Photographe sélectionné :", selectedPhotographer);
    // Plus tard, afficher les données dans le DOM
  } else {
    console.error("Photographe non trouvé pour l'id :", photographerId);
  }
}

init();
