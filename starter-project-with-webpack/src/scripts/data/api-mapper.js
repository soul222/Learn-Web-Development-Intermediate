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
