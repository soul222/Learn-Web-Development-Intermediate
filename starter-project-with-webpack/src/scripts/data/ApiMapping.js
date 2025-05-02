import Map from "../utils/map";

export async function storyMapper(story) {
  const lat = story.lat ?? null;
  const lon = story.lon ?? null;

  let placeName = "Lokasi tidak ada";
  if (lat !== null && lon !== null) {
    placeName = await Map.getPlaceNameByCoordinate(lat, lon);
  }

  return {
    ...story,
    location: {
      latitude: lat,
      longitude: lon,
      placeName: placeName,
    },
  };
}

export async function storiesMapper(stories) {
  const mappedStories = await Promise.all(
    stories.map(async (story) => {
      return await storyMapper(story);
    })
  );

  return mappedStories;
}

export async function apiResponseMapper(apiResponse) {
  if (!apiResponse.listStory || apiResponse.error) {
    return apiResponse;
  }

  const mappedStories = await storiesMapper(apiResponse.listStory);

  return {
    ...apiResponse,
    listStory: mappedStories,
  };
}