import HomePresenter from "./HomePresenter";
import * as StoriesAPI from "../../data/api";
import { apiResponseMapper } from "../../data/ApiMapping";
import {
  generateLoaderAbsoluteTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
  generateStoryItemTemplate,
} from "../../template/template";

export default class Home {
  #presenter;

  async render() {
    return `
      <section class="container">
        <div class="stories-list__container">
            <div id="stories-list"></div>
            <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoriesAPI,
    });

    await this.#presenter.initialStories();
  }

  async populateStoriesList(message, listStory) {
    if (listStory.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const mappedResponse = await apiResponseMapper({
      listStory: listStory,
      message: message,
    });

    const mappedStories = mappedResponse.listStory;

    const html = mappedStories.reduce((acc, story) => {
      return acc.concat(
        generateStoryItemTemplate({
          id: story.id,
          name: story.name,
          description: story.description,
          photoUrl: story.photoUrl,
          createdAt: story.createdAt,
          location: story.location,
        })
      );
    }, "");

    document.getElementById("stories-list").innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  populateStoriesListEmpty() {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListErrorTemplate(message);
  }

  showLoading() {
    document.getElementById("stories-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById("stories-list-loading-container").innerHTML = "";
  }
}
