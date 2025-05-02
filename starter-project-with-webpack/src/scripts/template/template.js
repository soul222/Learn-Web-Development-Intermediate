import { showFormattedDate } from "../utils";

export function generateLoaderTemplate() {
  return `
        <div class="loader"></div>
    `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
        <div class="loader loader-absolute"></div>
    `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
        <li id="push-notification-tools" class="push-notification-tools"></li>
    `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
        <li id="push-notification-tools" class="push-notification-tools"></li>
        <li> <a id="bookmark-button" class="btn bookmark-button" href="#/bookmark">Story Tersimpan</a></li>
        <li> <a id="new-story-button" class="btn new-story-button" href="#/new">Add Story <i class="fas fa-plus"></i></a></li>
        <li> <a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
    `;
}

export function generateStoriesListEmptyTemplate() {
  return `
        <div id="stories-list-empty" class="stories-list__empty">
          <h2>Unfortunately, there's no story available at the moment.</h2>
          <p>Right now, no story is showing.</p>
        </div>
    `;
}

export function generateStoriesListErrorTemplate(message) {
  return `
        <div id="stories-list-error" class="stories-list__error">
          <h2>Sorry, there was a problem retrieving the story list.</h2>
          <p>${
            message ? message : "Use a different network."
          }</p>
        </div>
    `;
}

export function generateStoryItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  location,
}) {
  return `
      <div tabindex="0" class="story-item" data-storyid="${id}">
        <div class="story-item__header">
          <div class="story-item__profile">
            <div class="profile-icon">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="profile-info">
              <h3 class="profile-name">${name}</h3>
                <div class="profile-location"> 
                ${location.placeName ?? "Lokasi tidak ada"}
                </div>
            </div>
          </div>
          </div>
          
          <div class="story-item__image-container">
          <img class="story-item__image" src="${photoUrl}" alt="${name}">
          </div>
          
          <div class="story-item__body">
          <div id="story-description" class="story-item__description">
          <b>${name}</b> ${description}
          <div class="story-item__time">
            <span>${showFormattedDate(createdAt, "id-ID")}</span>
          </div>
          
          </div>
          
          <a class="btn story-item__read-more" href="#/story/${id}">
            More <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
  `;
}

export function generateStoryDetailTemplate({
  image,
  description,
  location,
  authorName,
  createdAt,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, "id-ID");
  const imageHtml = generateImageDetailTemplate(image);

  return `
    <div class="container">
      <div class="story-detail__body__map__container">
            <div class="story-detail__map__container">
              <div id="map" class="story-detail__map"></div>
              <div id="map-loading-container"></div>
            </div>
      </div>
        <div class="story-item__header">
    <div class="story-item__profile">
      <div class="profile-icon">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="profile-info">
        <div class="profile-name">
          <div id="author" class="story-detail__author" data-value="${authorName}"></div>
          <i class="fas fa-circle" id="circle"></i>
           <div id="location-place-name" class="story-detail__location__place-name" data-value="${
             location.placeName
           }"></div>
        </div>
          <div class="profile-location"> 
            <div id="location-latitude" class="story-detail__location__latitude" data-value="${
              location.latitude ?? "Latitude tidak ada"
            }">Latitude:</div>
                <div id="location-longitude" class="story-detail__location__longitude" data-value="${
                  location.longitude ?? "Longitude tidak ada"
                }">Longitude:</div>
          </div>
      </div>
    </div>
    </div>
      <div class="story-detail__images__container">
          <div id="image" class="story-detail__image">${imageHtml}</div>
      </div>
  </div>
  
  <div class="container">
      <div class="story-detail__body">  
        <div class="story-detail__body__description__container">
          <div id="description" class="story-detail__description__body">
            <b>${authorName}</b> ${description}
          </div>
           <div id="createdat" class="story-detail__createdat" data-value="${createdAtFormatted}"></div>
        </div>
         <hr>
         <div class="story-detail__body__actions__container">
           <div class="story-detail__actions__buttons">
             <div id="save-actions-container"></div>
           </div>
         </div>
      </div>
  </div>
    `;
}

export function generateImageDetailTemplate(imageUrl = null, alt = "") {
  if (!imageUrl) {
    return `<img class="story-detail__image" src="" alt="Placeholder Image">`;
  }

  return `
        <img class="story-detail__image" src="${imageUrl}" alt="${alt}">
    `;
}

export function generateStoryDetailErrorTemplate(message) {
  return `
    <div id="story-detail-error" class="story-detail__error">
      <h2>Sorry, there was an error in picking up the story details.</h2>
      <p>${
        message ? message : "Use a different network."
      }</p>
    </div>
  `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}

export function generateSaveStoryButtonTemplate() {
  return `
    <button id="story-detail-save" class="btn btn-transparent">
      Save <i class="far fa-bookmark"></i>
    </button>
  `;
}

export function generateRemoveStoryButtonTemplate() {
  return `
    <button id="story-detail-remove" class="btn btn-transparent">
      Remove <i class="fas fa-bookmark"></i>
    </button>
  `;
}
