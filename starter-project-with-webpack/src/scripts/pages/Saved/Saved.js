import {
  generateLoaderAbsoluteTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
  generateStoryItemTemplate,
} from "../../template/template";
import SavedPagePresenter from "./SavedPresenter";
import Database from "../../data/database";

export default class Saved {
  #presenter;

  async render() {
    return `
            <section class="container">
                <h1 class="section-title">Saved <i class="fas fa-bookmark"></i></h1>
         
                <div class="stories-list__container">
                  <div id="stories-list"></div>
                  <div id="stories-list-loading-container"></div>
                </div>
            </section>
        `;
  }

  async afterRender() {
    this.#presenter = new SavedPagePresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.initialBookmarkStories();
  }

  populateBookmarkStories(message, listStory) {
    if (listStory.length <= 0) {
      this.populateBookmarkedStoriesListEmpty();
      return;
    }

    const html = listStory.reduce((acc, story) => {
      const coordinate = {
        latitude: story.lat,
        longitude: story.lon,
      };

      console.log(coordinate);

      return acc.concat(
        generateStoryItemTemplate({
          id: story.id,
          name: story.name,
          description: story.description,
          photoUrl: story.photoUrl,
          createdAt: story.createdAt,
          location: { latitude: story.lat, longitude: story.lon },
        })
      );
    }, "");

    document.getElementById("stories-list").innerHTML = `
          <div class="stories-list">${html}</div>
        `;
  }

  populateBookmarkedStoriesListEmpty() {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListEmptyTemplate();
  }

  populateBookmarkedStoriesError(message) {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListErrorTemplate(message);
  }

  showStoriesListLoading() {
    document.getElementById("stories-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoreListLoading() {
    document.getElementById("stories-list-loading-container").innerHTML = "";
  }
}
