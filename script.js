let projects = [];

// Load JSON content first
fetch("content.json")
  .then(response => response.json())
  .then(data => {
    projects = data.projects;
    initializeProjects();
  })
  .catch(error => {
    console.error("Error loading content.json", error);
  });

// DOM elements
let titlesList, imageContainer, leftHit, rightHit, pagination, paginationText, paginationCycle;
let currentProject = null;
let currentIndex = 0;

function initializeProjects() {
  titlesList = document.querySelector(".project-titles-list");
  imageContainer = document.querySelector(".image-container");
  leftHit = document.querySelector(".left-hit");
  rightHit = document.querySelector(".right-hit");
  pagination = document.querySelector(".pagination");
  paginationText = document.querySelector(".pagination .text");
  paginationCycle = document.querySelector(".pagination .cycle");

  pagination.style.display = "none";

  projects.forEach((project, index) => {
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project-name");

    const title = document.createElement("h1");
    title.classList.add("exhibit-name");
    // title.classList.add(`${project.name}`);
    title.textContent = project.name;

    const date = document.createElement("h1");
    date.classList.add("date");
    date.textContent = project.date;

    projectDiv.appendChild(title);
    projectDiv.appendChild(date);
    titlesList.appendChild(projectDiv);

  projectDiv.addEventListener("click", () => {
    if (currentProject === index) {
      imageContainer.innerHTML = "";
      pagination.style.display = "none";
      currentProject = null;
      projectDiv.classList.remove("grey");
      return;
    }

    currentProject = index;
    currentIndex = 0;

    // remove grey from all project titles first
    document.querySelectorAll(".project-name").forEach(el => el.classList.remove("grey"));

    projectDiv.classList.add("grey");
    displayImage();
  });


  });

  rightHit.addEventListener("click", nextImage);
  leftHit.addEventListener("click", prevImage);
}

function displayImage() {
  const project = projects[currentProject];

  imageContainer.innerHTML = "";

  const folder = project.folder.endsWith("/") ? project.folder : project.folder + "/";
  const currentFile = project.images[currentIndex];
  const fullPath = folder + currentFile;

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

  pagination.style.display = "flex";

  const pdfIndex = project.images.findIndex(f => f.toLowerCase().endsWith(".pdf"));

  if (pdfIndex !== -1) {
    const pdfFile = folder + project.images[pdfIndex];
    paginationText.innerHTML = `
      <a href="#" class="press-link">Press</a>
      <a href="${pdfFile}" download class="download-icon" title="Download PDF">
        <img src="./assets/dev-files/download.png">
      </a>
    `;
  } else {
    paginationText.innerHTML = "";
  }

  paginationCycle.textContent = `${currentIndex + 1} / ${project.images.length}`;

  const pressLink = document.querySelector(".press-link");
  if (pressLink) {
    pressLink.addEventListener("click", (e) => {
      e.preventDefault();
      currentIndex = pdfIndex;
      displayImage();
    });
  }
}

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

