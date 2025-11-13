// --- Example data ---
const projects = [
  {
    name: "suspiro trampa",
    folder: "assets/EE1/photos/",
    images: [
      "DSC_1317.png",
      "DSC_1324.png",
      "DSC_1463.png",
      "DSC_1479.png",
      "ESPACIO ENREDO 001_SUSPIROTRAMPRESS RELEASE.pdf" // stays in cycle
    ],
    date: "12 05 2024"
  },
  {
    name: "una piedra en el camino",
    folder: "assets/EE2/photos/",
    images: ["EspacioEnredo-001W.jpg",
      "EspacioEnredo-002W.jpg",
      "EspacioEnredo-003bW.jpg",
      "EspacioEnredo-003W.jpg",
      "EspacioEnredo-004W.jpg",
      "EspacioEnredo-005W.jpg",
      "EspacioEnredo-006W.jpg",
      "EspacioEnredo-007W.jpg", 
        "EspacioEnredo-008W.jpg", 
        "EspacioEnredo-009W.jpg", 
        "ESPACIO ENREDO_PRESS RELEASE_SURFICIAL GEOLOGY.pdf"
    ],
    date: "05 01 2025"
  }
];

// --- DOM elements ---
const titlesList = document.querySelector(".project-titles-list");
const imageContainer = document.querySelector(".image-container");
const leftHit = document.querySelector(".left-hit");
const rightHit = document.querySelector(".right-hit");
const pagination = document.querySelector(".pagination");
const paginationText = document.querySelector(".pagination .text");
const paginationCycle = document.querySelector(".pagination .cycle");

let currentProject = null;
let currentIndex = 0;

// --- Hide pagination by default ---
pagination.style.display = "none";

// --- Create title + date elements ---
projects.forEach((project, index) => {
  const projectDiv = document.createElement("div");
  projectDiv.classList.add("project-name");

  const title = document.createElement("h1");
  title.classList.add("exhibit-name");
  title.textContent = project.name;

  const date = document.createElement("h1");
  date.classList.add("date");
  date.textContent = project.date;

  projectDiv.appendChild(title);
  projectDiv.appendChild(date);
  titlesList.appendChild(projectDiv);

  // --- When project title clicked ---
  projectDiv.addEventListener("click", () => {
    // Toggle off if same project clicked
    if (currentProject === index) {
      imageContainer.innerHTML = "";
      pagination.style.display = "none";
      currentProject = null;
      projectDiv.classList.remove("grey");

      return;
    }

    currentProject = index;
    currentIndex = 0;
    projectDiv.classList.add("grey");
    displayImage();
  });
});



function displayImage() {
  const project = projects[currentProject];

  imageContainer.innerHTML = ""; // clear old


  const folder = project.folder.endsWith("/") ? project.folder : project.folder + "/";
  const currentFile = project.images[currentIndex];
  const fullPath = folder + currentFile;

  // --- Handle image vs PDF ---
  if (currentFile.toLowerCase().endsWith(".pdf")) {
    const pdfEmbed = document.createElement("embed");
    pdfEmbed.src = fullPath;
    pdfEmbed.type = "application/pdf";
    pdfEmbed.width = "700px";
    pdfEmbed.height = "100%";
    pdfEmbed.classList.add("pdf-viewer");
    imageContainer.appendChild(pdfEmbed);
  } else {
    const img = document.createElement("img");
    img.src = fullPath;
    img.alt = project.name;
    imageContainer.appendChild(img);
  }

  // --- Show pagination ---
  pagination.style.display = "flex";

  // --- Update text + counter ---
  const pdfIndex = project.images.findIndex((file) =>
    file.toLowerCase().endsWith(".pdf")
  );

  if (pdfIndex !== -1) {
    const pdfFile = folder + project.images[pdfIndex];
    paginationText.innerHTML = `
      <a href="#" class="grey press-link">Press</a>
      <a href="${pdfFile}" download class="grey download-icon" title="Download PDF"><img src="assets/dev/download.png"></a>
    `;
  } else {
    paginationText.innerHTML = "";
  }

  paginationCycle.textContent = `${currentIndex + 1} / ${project.images.length}`;

  // --- "press release" link jumps to PDF ---
  const pressLink = document.querySelector(".press-link");
  if (pressLink) {
    pressLink.addEventListener("click", (e) => {
      e.preventDefault();
      currentIndex = pdfIndex;
      displayImage();
    });
  }
}


// --- Navigation (next/prev) ---
function nextImage() {
  if (currentProject === null) return;
  const project = projects[currentProject];
  currentIndex = (currentIndex + 1) % project.images.length;
  displayImage();
}

function prevImage() {
  if (currentProject === null) return;
  const project = projects[currentProject];
  currentIndex = (currentIndex - 1 + project.images.length) % project.images.length;
  displayImage();
}

// --- Event listeners ---
rightHit.addEventListener("click", nextImage);
leftHit.addEventListener("click", prevImage);
