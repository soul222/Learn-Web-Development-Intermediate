import AddStoryPresenter from "./AddStoryPresenter";
import * as StoriesAPI from "../../data/api";
import Map from "../../utils/map";
import Camera from "../../utils/camera";
import { convertBase64ToBlob } from "../../utils";
import { generateLoaderAbsoluteTemplate } from "../../template/template";
import Swal from "sweetalert2";

export default class AddStory {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenImage = null;
  #map = null;

  async render() {
    return `    
            <section class="container">
                <div class="new-form__container">
                    <form id="new-form" class="new-form">
                        <div class="form-control">
                          <div id="image-more-info">Image must be in jpg or png format</div>
            
                          <div class="new-form__image__container">
                            <div class="new-form__image__buttons">
                              <button id="image-input-button" class="btn btn-outline" type="button">Browse</button></button>
                              <input
                                id="image-input"
                                class="new-form__image__input"
                                name="image"
                                type="file"
                                accept="image/*"
                                aria-describedby="image-more-info"
                              >
                              <button id="open-image-camera-button" class="btn btn-outline" type="button">
                                Camera
                              </button>
                            </div>
                            <div id="camera-container" class="new-form__camera__container">
                              <video id="camera-video" class="new-form__camera__video">
                                video stream not available.
                              </video>
            
                              <canvas id="camera-canvas" class="new-form__camera__canvas"></canvas>
            
                              <div class="new-form__camera__tools">
                                <select id="camera-select"></select>
                                <div class="new-form__camera__tools_buttons">
                                  <button id="camera-take-button" class="btn" type="button">
                                    Ambil Gambar
                                  </button>
                                </div>
                              </div>
                            </div>
                            <ul id="image-taken" class="new-form__image__outputs"></ul>
                          </div>
                        </div>
                    
                        <div class="form-control">
                            <label for="description-input" class="new-form__description__title"></label>
                        
                            <div class="new-form__description__container">
                                <textarea
                                  id="description-input"
                                  name="description"
                                  placeholder="Descirption"
                                ></textarea>
                            </div>
                        </div>
                        <div class="form-control">    
                          <div class="new-form__location__container">
                            <div class="new-form__location__map__container">
                              <div id="map" class="new-form__location__map"></div>
                              <div id="map-loading-container"></div>
                            </div>
                            <div class="new-form__location__lat-lng">
                              <input type="number" name="lat" value="-6.175389" disabled>
                              <input type="number" name="lon" value="106.827139" disabled>
                            </div>
                          </div>
                        </div>
                        <div class="form-buttons">
                          <span id="submit-button-container">
                            <button class="btn" type="submit">Share</button>
                          </span>
                          <a class="btn btn-outline" href="#/">Cancel</a>
                        </div>
                    </form>
                </div>
            </section>
        `;
  }

  async afterRender() {
    this.#presenter = new AddStoryPresenter({
      view: this,
      model: StoriesAPI,
    });

    this.#presenter.showNewFormMap();
    this.#setupForm();
  }

  #setupForm() {
    this.#form = document.getElementById("new-form");
    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        image: this.#takenImage ? this.#takenImage.blob : null,
        description: this.#form.elements.namedItem("description").value,
        lat: this.#form.elements.namedItem("lat").value,
        lon: this.#form.elements.namedItem("lon").value,
      };

      await this.#presenter.postNewStory(data);
    });

    document
      .getElementById("image-input")
      .addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        await this.#addTakenPicture(file);
        await this.#populateTakenPicture();
      });

    document
      .getElementById("image-input-button")
      .addEventListener("click", () => {
        this.#form.elements.namedItem("image").click();
      });

    const cameraContainer = document.getElementById("camera-container");
    document
      .getElementById("open-image-camera-button")
      .addEventListener("click", async (event) => {
        cameraContainer.classList.toggle("open");

        this.#isCameraOpen = cameraContainer.classList.contains("open");
        if (this.#isCameraOpen) {
          event.currentTarget.textContent = "Tutup Camera";
          this.#setupCamera();
          this.#camera.launch();

          return;
        }

        event.currentTarget.textContent = "Buka Kamera";
        this.#camera.stop();
      });
  }

  async initialMap() {
    this.#map = await Map.build("#map", {
      zoom: 15,
      locate: true,
    });

    const centerCoordinate = this.#map.getCenter();

    this.#updateLatLngInput(
      centerCoordinate.latitude,
      centerCoordinate.longitude
    );

    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.latitude, centerCoordinate.longitude],
      { draggable: true }
    );

    draggableMarker.addEventListener("move", (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });

    this.#map.addMapEventListener("click", (event) => {
      draggableMarker.setLatLng(event.latlng);

      event.sourceTarget.flyTo(event.latlng);
    });
  }

  #updateLatLngInput(lat, long) {
    this.#form.elements.namedItem("lat").value = lat;
    this.#form.elements.namedItem("lon").value = long;
  }

  #setupCamera() {
    if (this.#camera) {
      return;
    }

    this.#camera = new Camera({
      video: document.getElementById("camera-video"),
      cameraSelect: document.getElementById("camera-select"),
      canvas: document.getElementById("camera-canvas"),
    });

    this.#camera.addCheeseButtonListener("#camera-take-button", async () => {
      const image = await this.#camera.takePicture();
      await this.#addTakenPicture(image);
      await this.#populateTakenPicture();
    });
  }

  async #addTakenPicture(image) {
    let blob = image;

    if (image instanceof String) {
      blob = await convertBase64ToBlob(image, "image/png");
    }

    this.#takenImage = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };
  }

  async #populateTakenPicture() {
    if (!this.#takenImage || !this.#takenImage.blob) {
      console.error("Error: Blob tidak tersedia!", this.#takenImage);
      return;
    }

    const imageUrl = URL.createObjectURL(this.#takenImage.blob);
    document.getElementById("image-taken").innerHTML = `
            <li class="new-form__image__outputs-item">
              <button type="button" id="delete-picture-button" class="new-form__image__outputs-item__delete-btn">
                <img src="${imageUrl}" alt="image">
              </button>
            </li>
        `;

    document
      .getElementById("delete-picture-button")
      .addEventListener("click", () => {
        this.#removePicture();
        this.#populateTakenPicture();
      });
  }

  #removePicture() {
    this.#takenImage = null;
  }

  storeSuccessfully(message) {
    console.log(message);
    this.clearForm();

    location.href = "/";
  }

  storeFailed(message) {
    Swal.fire({
      icon: "error",
      title: "Upload Story Gagal",
      text: message,
      confirmButtonText: "Oke",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("User acknowledged the error.");
      }
    });
  }

  clearForm() {
    this.#form.reset();
  }

  showLoadingMap() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoadingMap() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
          <button class="btn" type="submit" disabled>
            <i class="fas fa-spinner loader-button"></i> Buat Story
          </button>
        `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
          <button class="btn" type="submit">Buat Story</button>
        `;
  }
}
