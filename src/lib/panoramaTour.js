function toNonEmptyString(value) {
  return typeof value === "string" && value.trim() ? value : "";
}

function pickFirst(...candidates) {
  return candidates.map(toNonEmptyString).find(Boolean) || "";
}

function humanizeLabel(rawLabel, fallbackLabel = "View") {
  const source = toNonEmptyString(rawLabel)
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!source) {
    return fallbackLabel;
  }

  return source
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toPanoramaPlace(entry, index, fallbackPrefix = "View") {
  if (typeof entry === "string") {
    const src = toNonEmptyString(entry);
    if (!src) {
      return null;
    }

    const fallbackLabel = `${fallbackPrefix} ${index + 1}`;
    return {
      id: `${fallbackPrefix.toLowerCase()}-${index + 1}`,
      label: humanizeLabel(src.split("/").pop(), fallbackLabel),
      src,
    };
  }

  if (!entry || typeof entry !== "object") {
    return null;
  }

  const src = pickFirst(entry.src, entry.image, entry.url, entry.path, entry.panorama, entry.value);
  if (!src) {
    return null;
  }

  const fallbackLabel = `${fallbackPrefix} ${index + 1}`;
  const label = humanizeLabel(
    pickFirst(entry.label, entry.name, entry.title, entry.place, entry.room),
    fallbackLabel,
  );

  return {
    id: pickFirst(entry.id, entry.key) || `${fallbackPrefix.toLowerCase()}-${index + 1}`,
    label,
    src,
  };
}

function normalizePanoramaPlaces(rawValue, fallbackPrefix = "View") {
  if (Array.isArray(rawValue)) {
    return rawValue
      .map((entry, index) => toPanoramaPlace(entry, index, fallbackPrefix))
      .filter(Boolean);
  }

  if (rawValue && typeof rawValue === "object") {
    return Object.entries(rawValue)
      .map(([key, value], index) => {
        if (typeof value === "string") {
          const src = toNonEmptyString(value);
          if (!src) {
            return null;
          }

          return {
            id: `${fallbackPrefix.toLowerCase()}-${index + 1}`,
            label: humanizeLabel(key, `${fallbackPrefix} ${index + 1}`),
            src,
          };
        }

        if (value && typeof value === "object") {
          return toPanoramaPlace({ ...value, label: pickFirst(value.label, key) }, index, fallbackPrefix);
        }

        return null;
      })
      .filter(Boolean);
  }

  const singlePlace = toPanoramaPlace(rawValue, 0, fallbackPrefix);
  return singlePlace ? [singlePlace] : [];
}

function uniquePlaces(places) {
  const seen = new Set();
  const result = [];

  places.forEach((place) => {
    if (!place?.src || seen.has(place.src)) {
      return;
    }

    seen.add(place.src);
    result.push(place);
  });

  return result;
}

export function resolvePropertyPanoramaSources(property = {}) {
  const exteriorSingle = pickFirst(
    property.panorama_exterior_image,
    property.panoramaExteriorImage,
    property.panorama_image,
    property.panoramaImage,
  );

  const interiorSingle = pickFirst(
    property.panorama_interior_image,
    property.panoramaInteriorImage,
  );

  const exteriorPlaces = uniquePlaces([
    ...normalizePanoramaPlaces(property.panorama_exterior_places, "Exterior"),
    ...normalizePanoramaPlaces(property.panoramaExteriorPlaces, "Exterior"),
    ...normalizePanoramaPlaces(property.panorama_exterior_images, "Exterior"),
    ...normalizePanoramaPlaces(property.panoramaExteriorImages, "Exterior"),
    ...normalizePanoramaPlaces(property.exterior_360, "Exterior"),
    ...normalizePanoramaPlaces(property.exterior360, "Exterior"),
    ...normalizePanoramaPlaces(property.panorama_exterior_map, "Exterior"),
    ...normalizePanoramaPlaces(property.panoramaExteriorMap, "Exterior"),
    ...normalizePanoramaPlaces(exteriorSingle, "Exterior"),
  ]);

  const interiorPlaces = uniquePlaces([
    ...normalizePanoramaPlaces(property.panorama_interior_places, "Interior"),
    ...normalizePanoramaPlaces(property.panoramaInteriorPlaces, "Interior"),
    ...normalizePanoramaPlaces(property.panorama_interior_images, "Interior"),
    ...normalizePanoramaPlaces(property.panoramaInteriorImages, "Interior"),
    ...normalizePanoramaPlaces(property.interior_360, "Interior"),
    ...normalizePanoramaPlaces(property.interior360, "Interior"),
    ...normalizePanoramaPlaces(property.panorama_interior_map, "Interior"),
    ...normalizePanoramaPlaces(property.panoramaInteriorMap, "Interior"),
    ...normalizePanoramaPlaces(interiorSingle, "Interior"),
  ]);

  const exterior = exteriorPlaces[0]?.src || "";
  const interior = interiorPlaces[0]?.src || "";

  return {
    exterior,
    interior,
    exteriorPlaces,
    interiorPlaces,
    hasExterior: Boolean(exterior),
    hasInterior: Boolean(interior),
    hasAny: Boolean(exterior || interior),
  };
}
