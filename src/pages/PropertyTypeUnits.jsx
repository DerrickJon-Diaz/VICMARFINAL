import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createPageUrl } from "../utils";
import {
  getPropertiesWithLivePrices,
  subscribeToPropertyPriceOverrides,
} from "@/lib/propertyPriceService";
import { resolvePropertyPanoramaSources } from "@/lib/panoramaTour";
import PanoramaViewer from "@/components/shared/PanoramaViewer";
import fallbackPropertyImage from "@/images/hero-properties.jpg";
import duplexDeluxeImage from "../../FloorPlan Image/Duplex Deluxe Typical 1 up.png";
import duplexPremiereImage from "../../FloorPlan Image/Duplex Premiere Final 1.jpg";
import rowhouseEconomicImage from "../../FloorPlan Image/Economic Unit Final 1 up.png";
import rowhouseCompoundImage from "@/images/properties/Rowhouse Compound.png";
import triplexAImage from "../../FloorPlan Image/TRIPLEX A up.png";
import triplexBImage from "../../FloorPlan Image/TRIPLEX B up.png";
import triplexCImage from "../../FloorPlan Image/TRIPLEX C up.png";

const TYPE_META = {
  duplex: {
    label: "Duplex Units",
    description: "Browse available duplex units with key information visible right away.",
  },
  triplex: {
    label: "Triplex Units",
    description: "Browse available triplex units with key information visible right away.",
  },
  rowhouse: {
    label: "Rowhouse Units",
    description: "Browse available rowhouse units with key information visible right away.",
  },
};

const TYPE_LABELS = {
  duplex: "Duplex",
  triplex: "Triplex",
  rowhouse: "Rowhouse",
};

const IMAGE_DISCLAIMER_TEXT = "Disclaimer: This image is an artist's perspective and is intended for illustration purposes only.";

function ImageDisclaimer() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-2 pb-2 pt-8 sm:px-3 sm:pb-3 sm:pt-10">
      <p className="rounded-md border border-white/25 bg-black/80 px-3 py-2 text-[11px] sm:text-sm font-semibold leading-relaxed text-white shadow-[0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-[1px]">
        {IMAGE_DISCLAIMER_TEXT}
      </p>
    </div>
  );
}

function getSplitUnitGuideConfig(property) {
  if (!property) {
    return null;
  }

  const propertyType = String(property.property_type ?? "").toLowerCase();
  const title = String(property.title ?? "").toLowerCase();
  const isDuplex = propertyType === "duplex" || title.includes("duplex");

  if (!isDuplex) {
    return null;
  }

  const isDeluxe = title.includes("deluxe");
  const isPremiere = title.includes("premiere");

  return {
    leftLabel: "Deluxe",
    rightLabel: "Premiere",
    selectedSide: isDeluxe ? "left" : isPremiere ? "right" : null,
  };
}

function SplitUnitGuideOverlay({ config }) {
  const selectedSide = config?.selectedSide ?? null;
  const leftLabel = config?.leftLabel ?? "Left Unit";
  const rightLabel = config?.rightLabel ?? "Right Unit";

  const leftSideClass = selectedSide === "left"
    ? "bg-emerald-500/18"
    : selectedSide === "right"
      ? "bg-slate-950/40"
      : "bg-slate-950/25";

  const rightSideClass = selectedSide === "right"
    ? "bg-emerald-500/18"
    : selectedSide === "left"
      ? "bg-slate-950/40"
      : "bg-slate-950/25";

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
      <div className={`absolute inset-y-0 left-0 w-1/2 ${leftSideClass}`} />
      <div className={`absolute inset-y-0 right-0 w-1/2 ${rightSideClass}`} />

      <div className={`absolute bottom-2 left-2 rounded-full text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide shadow-sm ${selectedSide === "left" ? "bg-emerald-600/95" : "bg-slate-600/95"}`}>
        {leftLabel}
      </div>
      <div className={`absolute bottom-2 right-2 rounded-full text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide shadow-sm ${selectedSide === "right" ? "bg-emerald-600/95" : "bg-slate-600/95"}`}>
        {rightLabel}
      </div>
    </div>
  );
}

function getPropertyImages(property) {
  const images = [
    property.main_image,
    property.images?.main,
    ...(Array.isArray(property.gallery_images) ? property.gallery_images : []),
    ...(Array.isArray(property.images?.interior) ? property.images.interior : []),
    ...(Array.isArray(property.images?.exterior) ? property.images.exterior : []),
    ...(Array.isArray(property.interior) ? property.interior : []),
    ...(Array.isArray(property.exterior) ? property.exterior : []),
  ].filter(Boolean);

  return [...new Set(images)].length > 0 ? [...new Set(images)] : [fallbackPropertyImage];
}

function resolveUnitTypeImage(property) {
  const propertyId = String(property?.id ?? "").toLowerCase();
  const propertyType = String(property?.property_type ?? "").toLowerCase();
  const title = String(property?.title ?? "").toLowerCase();

  if (propertyType === "duplex") {
    if (title.includes("deluxe")) {
      return duplexDeluxeImage;
    }

    if (title.includes("premiere")) {
      return duplexPremiereImage;
    }
  }

  if (propertyType === "rowhouse") {
    if (title.includes("economic")) {
      return rowhouseEconomicImage;
    }

    if (title.includes("compound")) {
      return rowhouseCompoundImage;
    }

  }

  if (propertyType === "triplex") {
    if (propertyId.includes("triplex-end-unit-a") || title.includes("end unit a")) {
      return triplexAImage;
    }

    if (propertyId.includes("triplex-center-unit") || title.includes("center unit")) {
      return triplexCImage;
    }

    if (propertyId.includes("triplex-end-unit-b") || title.includes("end unit b")) {
      return triplexBImage;
    }
  }

  return null;
}

function getExteriorImage(property) {
  return resolveUnitTypeImage(property) || getPropertyImages(property)[0] || fallbackPropertyImage;
}

function getExteriorImages(property) {
  const unitTypeImage = resolveUnitTypeImage(property);
  const exteriorImages = [
    unitTypeImage,
    property.main_image,
    property.images?.main,
    ...(Array.isArray(property.images?.exterior) ? property.images.exterior : []),
    ...(Array.isArray(property.exterior) ? property.exterior : []),
  ].filter(Boolean);

  return exteriorImages.length > 0 ? [...new Set(exteriorImages)] : [fallbackPropertyImage];
}

function getInteriorImages(property) {
  const propertyType = String(property?.property_type ?? "").toLowerCase();
  if (propertyType === "triplex") {
    return [];
  }

  const interiorImages = [
    ...(Array.isArray(property.images?.interior) ? property.images.interior : []),
    ...(Array.isArray(property.interior) ? property.interior : []),
  ].filter(Boolean);

  if (interiorImages.length > 0) {
    return [...new Set(interiorImages)];
  }

  return getPropertyImages(property).slice(1);
}

function getInteriorImageLabel(image, fallbackIndex = 0) {
  const source = String(image || "").toLowerCase();

  if (source.includes("duplex_img3") || source.includes("socialized_img4")) {
    return "Kitchen Area";
  }

  if (source.includes("duplex_img4")) {
    return "Living Room 2";
  }

  if (source.includes("duplex_img5")) {
    return "Living Room 1";
  }

  if (source.includes("socialized_img5")) {
    return "Dining Area";
  }

  if (source.includes("compound_img")) {
    return "Loft Bedroom";
  }

  if (source.includes("duplex_img") || source.includes("socialized_img")) {
    return "Bedroom";
  }

  return `Interior ${fallbackIndex + 1}`;
}

function getGalleryImages(property, galleryScope = "interior") {
  if (galleryScope === "exterior") {
    return getExteriorImages(property);
  }

  if (galleryScope === "all") {
    return [...new Set([
      ...getExteriorImages(property),
      ...getInteriorImages(property),
    ])];
  }

  return getInteriorImages(property);
}

function getFloorPlans(property) {
  const plans = property.floor_plans ?? {};
  const preferredOrder = ["groundFloor", "secondFloor"];
  const result = [];

  preferredOrder.forEach((key) => {
    if (plans[key]) {
      result.push({ key, ...plans[key] });
    }
  });

  Object.entries(plans).forEach(([key, plan]) => {
    if (preferredOrder.includes(key)) {
      return;
    }

    result.push({ key, ...plan });
  });

  return result;
}

function getPlanAreas(plan) {
  if (!plan) {
    return [];
  }

  if (Array.isArray(plan.areas)) {
    return plan.areas;
  }

  if (Array.isArray(plan.areaDetails)) {
    return plan.areaDetails;
  }

  return [];
}

function getUnitVariantLabel(property) {
  const title = String(property?.title ?? "").toLowerCase();

  if (title.includes("deluxe")) {
    return "Deluxe";
  }

  if (title.includes("premiere")) {
    return "Premiere";
  }

  return "Unit";
}

function getTourPlacesByType(sources, tourType) {
  if (!sources) {
    return [];
  }

  return tourType === "interior"
    ? (Array.isArray(sources.interiorPlaces) ? sources.interiorPlaces : [])
    : (Array.isArray(sources.exteriorPlaces) ? sources.exteriorPlaces : []);
}

function getDefaultTourPlaceId(sources, tourType) {
  return getTourPlacesByType(sources, tourType)[0]?.id || "";
}

function getActiveTourSource(sources, tourType, activePlaceId) {
  const places = getTourPlacesByType(sources, tourType);
  const matchedPlace = places.find((place) => place.id === activePlaceId);

  if (matchedPlace?.src) {
    return matchedPlace.src;
  }

  if (places[0]?.src) {
    return places[0].src;
  }

  return tourType === "interior" ? sources?.interior || "" : sources?.exterior || "";
}

export default function PropertyTypeUnits() {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedType = String(urlParams.get("type") ?? "").toLowerCase();
  const selectedUnit = String(urlParams.get("unit") ?? "").trim().toLowerCase();
  const queryClient = useQueryClient();
  const hasAutoScrolledRef = useRef(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [galleryModalState, setGalleryModalState] = useState(null);
  const [floorPlanModalState, setFloorPlanModalState] = useState(null);
  const [tourModalProperty, setTourModalProperty] = useState(null);
  const [activeTourType, setActiveTourType] = useState("exterior");
  const [activeTourPlaceId, setActiveTourPlaceId] = useState("");

  const { data: allProperties = [], isLoading } = useQuery({
    queryKey: ["properties-by-type", selectedType],
    queryFn: () => getPropertiesWithLivePrices("-created_date"),
  });

  useEffect(() => {
    const unsubscribe = subscribeToPropertyPriceOverrides(
      () => {
        queryClient.invalidateQueries({ queryKey: ["properties-by-type", selectedType] });
      },
      (error) => {
        console.error(error);
      },
    );

    return unsubscribe;
  }, [queryClient, selectedType]);

  const meta = TYPE_META[selectedType] ?? {
    label: "Property Units",
    description: "Choose a unit variant and open its details.",
  };

  const filteredProperties = useMemo(() => {
    if (!selectedType) {
      return [];
    }

    return allProperties.filter((property) => property.property_type === selectedType);
  }, [allProperties, selectedType]);

  // For triplex type, enforce ordering A -> B -> C and normalized display titles
  const orderedProperties = useMemo(() => {
    if (selectedType !== "triplex") return filteredProperties;

    const byId = new Map(filteredProperties.map((p) => [String(p.id || "").toLowerCase(), p]));
    const a = byId.get("triplex-end-unit-a");
    const b = byId.get("triplex-end-unit-b");
    const c = byId.get("triplex-center-unit");

    const result = [];
    // desired order: End Unit A, Center Unit, End Unit B
    if (a) result.push(a);
    if (c) result.push(c);
    if (b) result.push(b);

    // append any remaining items in original order
    for (const p of filteredProperties) {
      const id = String(p.id || "").toLowerCase();
      if (id !== "triplex-end-unit-a" && id !== "triplex-end-unit-b" && id !== "triplex-center-unit") {
        result.push(p);
      }
    }

    return result;
  }, [filteredProperties, selectedType]);

  useEffect(() => {
    hasAutoScrolledRef.current = false;
  }, [selectedType, selectedUnit]);

  useEffect(() => {
    if (hasAutoScrolledRef.current || !selectedUnit || isLoading || filteredProperties.length === 0) {
      return;
    }

    const normalizedTarget = selectedUnit.replace(/\s+/g, "-");
    const matchedProperty = filteredProperties.find((property) => {
      const id = String(property?.id ?? "").toLowerCase();
      const title = String(property?.title ?? "").toLowerCase();
      const titleSlug = title.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      return id === normalizedTarget || id.includes(normalizedTarget) || titleSlug.includes(normalizedTarget);
    });

    if (!matchedProperty) {
      return;
    }

    const elementId = `unit-${String(matchedProperty.id ?? "").toLowerCase()}`;
    const unitElement = document.getElementById(elementId);

    if (!unitElement) {
      return;
    }

    requestAnimationFrame(() => {
      unitElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      // Add extra scroll offset for better visibility
      setTimeout(() => {
        window.scrollBy({ top: 20, behavior: "smooth" });
      }, 600);
      hasAutoScrolledRef.current = true;
    });
  }, [filteredProperties, isLoading, selectedUnit]);

  const unitGridClassName = useMemo(() => {
    return "grid gap-8 grid-cols-1 max-w-6xl mx-auto";
  }, []);

  function getFeatureValue(source) {
    if (source === null || source === undefined || source === "") return null;
    if (typeof source === "object") {
      // Prefer explicit `default` when present; fall back to first valid option.
      if (source.default !== null && source.default !== undefined && source.default !== "") {
        return source.default;
      }

      if (Array.isArray(source.options) && source.options.length > 0) {
        const optionValue = source.options.find((option) => option !== null && option !== undefined && String(option).trim() !== "");
        if (optionValue !== undefined) return optionValue;
      }

      return null;
    }
    return source;
  }

  function buildFeatureItems(property) {
    const info = property?.info ?? property ?? {};
    const hasFamilyArea = info.familyarea !== undefined && info.familyarea !== null;
    const bedrooms = getFeatureValue(info.bedrooms ?? info.familyarea);
    const bathrooms = getFeatureValue(info.bathrooms ?? info.bathrooms);
    const floorArea = info.floorArea ?? info.floor_area ?? property.floor_area ?? property.floorArea;
    const lotArea = info.lotArea ?? info.lot_area ?? property.lot_area ?? property.lotArea;

    const items = [];
    if (bedrooms !== null && bedrooms !== undefined && bedrooms !== "") {
      if (hasFamilyArea) {
        items.push(`${bedrooms} Family Area`);
      } else {
        items.push(`${bedrooms} Bedroom${Number(bedrooms) === 1 ? "" : "s"}`);
      }
    }

    if (bathrooms !== null && bathrooms !== undefined && bathrooms !== "") {
      items.push(`${bathrooms} Toilet${Number(bathrooms) === 1 ? "&Bath" : "s & Baths"}`);
    }

    if (floorArea) items.push(`${floorArea} sqm floor area`);
    if (lotArea) items.push(`${lotArea} sqm lot area`);

    return items;
  }

  const openImageZoom = ({
    images = [],
    imageLabels = [],
    startIndex = 0,
    titlePrefix = "",
    imageLabel = "Photo",
    includeIndex = false,
    overlayConfig = null,
  }) => {
    const uniqueImages = [...new Set((Array.isArray(images) ? images : []).filter(Boolean))];
    if (uniqueImages.length === 0) {
      return;
    }

    const boundedIndex = Math.min(Math.max(startIndex, 0), uniqueImages.length - 1);
    const normalizedImageLabels = Array.isArray(imageLabels)
      ? uniqueImages.map((image, index) => {
        const originalIndex = images.findIndex((candidate) => candidate === image);
        if (originalIndex === -1) {
          return getInteriorImageLabel(image, index);
        }

        return imageLabels[originalIndex] || getInteriorImageLabel(image, originalIndex);
      })
      : [];

    setZoomedImage({
      images: uniqueImages,
      imageLabels: normalizedImageLabels,
      currentIndex: boundedIndex,
      titlePrefix,
      imageLabel,
      includeIndex,
      overlayConfig,
    });
  };

  const getZoomedImageTitle = (viewerState) => {
    if (!viewerState) {
      return "Image preview";
    }

    const prefix = String(viewerState.titlePrefix || "").trim();
    const dynamicLabel = Array.isArray(viewerState.imageLabels)
      ? viewerState.imageLabels[viewerState.currentIndex]
      : "";
    const label = String(dynamicLabel || viewerState.imageLabel || "Photo").trim();
    const shouldShowIndex = Boolean(viewerState.includeIndex);
    const indexLabel = shouldShowIndex ? ` ${Number(viewerState.currentIndex ?? 0) + 1}` : "";

    return `${prefix ? `${prefix} ` : ""}${label}${indexLabel}`.trim();
  };

  const changeZoomedImage = (step) => {
    setZoomedImage((current) => {
      if (!current?.images?.length || current.images.length < 2) {
        return current;
      }

      const nextIndex = (current.currentIndex + step + current.images.length) % current.images.length;
      return { ...current, currentIndex: nextIndex };
    });
  };

  const openGalleryModal = (property, galleryScope = "interior", startIndex = 0) => {
    if (!property) {
      return;
    }

    const images = getGalleryImages(property, galleryScope);
    if (images.length === 0) {
      return;
    }

    setGalleryModalState({
      property,
      galleryScope,
      images,
      currentIndex: Math.min(Math.max(startIndex, 0), images.length - 1),
    });
  };

  const openFloorPlanModal = (property, plan) => {
    if (!property || !plan?.image) {
      return;
    }

    setFloorPlanModalState({
      property,
      plan,
      splitGuideConfig: getSplitUnitGuideConfig(property),
    });
  };

  const openTourModal = (property, tourType) => {
    if (!property) {
      return;
    }

    const sources = resolvePropertyPanoramaSources(property);
    if (!sources.hasAny) {
      return;
    }

    const initialTourType = tourType === "interior" && sources.hasInterior
      ? "interior"
      : sources.hasExterior
        ? "exterior"
        : "interior";

    setActiveTourType(initialTourType);
    setActiveTourPlaceId(getDefaultTourPlaceId(sources, initialTourType));
    setTourModalProperty(property);
  };

  const activeTourSources = tourModalProperty ? resolvePropertyPanoramaSources(tourModalProperty) : null;
  const activeTourPlaces = getTourPlacesByType(activeTourSources, activeTourType);
  const activeTourSource = getActiveTourSource(activeTourSources, activeTourType, activeTourPlaceId);

  useEffect(() => {
    if (!activeTourSources) {
      return;
    }

    const places = getTourPlacesByType(activeTourSources, activeTourType);
    const isActivePlaceValid = places.some((place) => place.id === activeTourPlaceId);

    if (!isActivePlaceValid) {
      setActiveTourPlaceId(places[0]?.id || "");
    }
  }, [activeTourSources, activeTourType, activeTourPlaceId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="bg-[#15803d] py-7 md:py-8 px-4 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto page-header text-center flex flex-col items-center">
          <Link to={createPageUrl("Properties")} className="self-start inline-flex items-center mb-3 text-white/85 hover:text-white text-xs sm:text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
          <p className="text-[#86efac] text-[11px] font-semibold uppercase tracking-widest mb-1.5">Unit Variants</p>
          <h1 className="text-xl md:text-2xl font-bold text-white mb-1">{meta.label}</h1>
          <p className="text-gray-200 text-xs md:text-sm max-w-2xl mx-auto text-justify">{meta.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg mb-3">No units found for this category.</p>
            <Link to={createPageUrl("Properties")}>
              <Button variant="outline">Back to Properties</Button>
            </Link>
          </div>
        ) : (
          <div className={unitGridClassName}>
            {orderedProperties.map((property) => {
              const splitGuideConfig = getSplitUnitGuideConfig(property);
              const exteriorImage = getExteriorImage(property);
              const interiorImages = getInteriorImages(property);
              const isTriplex = String(property?.property_type ?? "").toLowerCase() === "triplex";
              const tourSources = resolvePropertyPanoramaSources(property);
              const unitVariantLabel = getUnitVariantLabel(property);
              const tourButtons = [
                tourSources.hasExterior
                  ? { label: "360 Exterior Tour", tour: "exterior", variant: "default" }
                  : null,
                tourSources.hasInterior
                  ? { label: "360 Interior Tour", tour: "interior", variant: "outline" }
                  : null,
              ].filter(Boolean);
              const floorPlans = getFloorPlans(property);

              return (
              <article
                key={property.id}
                id={`unit-${String(property.id ?? "").toLowerCase()}`}
                className="group bg-white border border-slate-200/70 rounded-[28px] p-4 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{unitVariantLabel}</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />
                  <span className="text-slate-400">{property.location || TYPE_LABELS[property.property_type] || "Unit"}</span>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="space-y-4">
                    <div className="relative rounded-2xl border border-slate-200 bg-slate-100 p-3 overflow-hidden">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => openImageZoom({
                            images: [exteriorImage],
                            startIndex: 0,
                            titlePrefix: property.title,
                            imageLabel: "Exterior",
                            includeIndex: false,
                            overlayConfig: splitGuideConfig,
                          })}
                          className="w-full h-full"
                          aria-label={`Zoom exterior image of ${property.title}`}
                        >
                          <img
                            src={exteriorImage}
                            alt={property.title}
                            className="w-full h-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.01]"
                          />
                        </button>
                      </div>
                      <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-2">
                        <Badge variant="outline" className="bg-white/90 text-[#15803d] border-[#15803d]/30">
                          {TYPE_LABELS[property.property_type] || property.property_type}
                        </Badge>
                      </div>
                    </div>

                    {interiorImages.length > 0 ? (
                      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Interior Views</p>
                            <h3 className="text-sm font-bold text-slate-900">Interior gallery</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => openGalleryModal(property, "interior")}
                            className="text-xs font-semibold text-[#15803d] hover:text-[#166534] transition-colors"
                          >
                            View All Photos
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {interiorImages.slice(0, 6).map((image, index) => (
                            <button
                              key={`${property.id}-interior-${index}`}
                              type="button"
                              onClick={() => openImageZoom({
                                images: interiorImages,
                                imageLabels: interiorImages.map((interiorImage, imageIndex) => getInteriorImageLabel(interiorImage, imageIndex)),
                                startIndex: index,
                                titlePrefix: property.title,
                                imageLabel: "Interior",
                                includeIndex: false,
                              })}
                              className="rounded-xl overflow-hidden border border-slate-200 bg-white aspect-[4/3]"
                              aria-label={`Open interior image ${index + 1} of ${property.title}`}
                            >
                              <img src={image} alt={`Interior ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </section>
                    ) : isTriplex ? (
                      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Interior Views</p>
                            <h3 className="text-sm font-bold text-slate-900">Interior gallery</h3>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-slate-500">No interior image available</p>
                      </section>
                    ) : null}
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          {/* Normalize triplex unit display names to include A/B/C when possible */}
                          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                            {(() => {
                              const id = String(property?.id ?? "").toLowerCase();
                              if (id.includes("triplex-end-unit-a")) return "Triplex (End Unit A)";
                              if (id.includes("triplex-center-unit")) return "Triplex (Center Unit)";
                              if (id.includes("triplex-end-unit-b")) return "Triplex (End Unit B)";
                              return property.title || property.name || property.id;
                            })()}
                          </h2>
                          {property.location ? (
                            <p className="text-sm text-slate-500 flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              {property.location}
                            </p>
                          ) : null}
                        </div>
                      </div>

                    </div>

                    {property.description ? (
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Description</p>
                        <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line text-justify">{property.description}</p>
                      </div>
                    ) : null}

                    {tourButtons.length > 0 ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">360 Tours</p>
                        <div className="flex flex-wrap gap-2.5">
                          {tourButtons.map((buttonConfig) => (
                            <Button
                              type="button"
                              key={`${property.id}-${buttonConfig.tour}`}
                              variant={buttonConfig.variant === "default" ? "default" : "outline"}
                              className={buttonConfig.variant === "default" ? "bg-[#15803d] hover:bg-[#166534] text-white" : "border-[#15803d]/25 text-[#15803d] hover:bg-[#f0fdf4]"}
                              onClick={() => openTourModal(property, buttonConfig.tour)}
                            >
                              {buttonConfig.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {property.description ? null : (
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm text-slate-600">No description is available for this unit.</p>
                      </div>
                    )}

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Features</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-700">
                        {buildFeatureItems(property).map((item, idx) => (
                          <p key={idx} className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">{item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {floorPlans.length > 0 ? (
                  <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Floor Plans</p>
                        <h3 className="text-lg font-bold text-slate-900">Layout details</h3>
                      </div>
                      <span className="text-xs text-slate-500">Tap to zoom</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {floorPlans.map((plan) => {
                        const planAreas = getPlanAreas(plan);

                        return (
                          <div key={plan.key} className="rounded-2xl border border-slate-200 bg-white p-3">
                            <div className="relative rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
                              <button
                                type="button"
                                onClick={() => openFloorPlanModal(property, plan)}
                                className="block w-full"
                                aria-label={`Open ${plan.label || "Floor Plan"} of ${property.title}`}
                              >
                                <img
                                  src={plan.image}
                                  alt={plan.label || "Floor Plan"}
                                  className="block w-full h-auto max-h-[520px] object-contain cursor-zoom-in"
                                />
                              </button>
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-slate-800 truncate">{plan.label || "Floor Plan"}</p>
                              {planAreas.length > 0 ? <span className="text-[11px] text-slate-500">{planAreas.length} areas</span> : null}
                            </div>
                            {planAreas.length > 0 ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {planAreas.slice(0, 6).map((area, index) => (
                                  <span key={`${plan.key}-area-${index}`} className="text-[11px] rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-600">
                                    {area.name}: {area.area} sqm
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {property.features?.length > 0 ? (
                  <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Features and Inclusions</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {property.features.map((feature, index) => (
                        <div key={`${property.id}-feature-${index}`} className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5">
                          <span className="mt-0.5 w-5 h-5 rounded-full bg-[#15803d] inline-flex items-center justify-center flex-shrink-0">
                            <span className="w-2 h-2 rounded-full bg-white" />
                          </span>
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </article>
              );
            })}
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(zoomedImage)}
        onOpenChange={(open) => {
          if (!open) {
            setZoomedImage(null);
          }
        }}
      >
        <DialogContent className="max-w-5xl w-[96vw] max-h-[92dvh] !p-0 gap-0 overflow-hidden bg-white/95 border-slate-200 shadow-2xl backdrop-blur-xl">
          {zoomedImage ? (
            <div className="flex max-h-[92dvh] w-full flex-col">
              {(() => {
                const zoomedTitle = getZoomedImageTitle(zoomedImage);
                const currentImage = zoomedImage.images?.[zoomedImage.currentIndex] || "";
                const canNavigate = (zoomedImage.images?.length || 0) > 1;
                const showInteriorDisclaimer = zoomedImage.imageLabel === "Interior";

                return (
                  <>
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 text-slate-900">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Photo Viewer</p>
                  <h2 className="text-lg font-bold truncate">{zoomedTitle}</h2>
                </div>
                {canNavigate ? <p className="text-xs text-slate-500">{zoomedImage.currentIndex + 1} / {zoomedImage.images.length}</p> : null}
              </div>
              <div className="relative min-h-0 overflow-hidden bg-slate-100 p-3 sm:p-4">
                <img
                  src={currentImage}
                  alt={zoomedTitle}
                  className="mx-auto block h-auto w-auto max-h-full max-w-full object-contain"
                />
                {zoomedImage.overlayConfig ? <SplitUnitGuideOverlay config={zoomedImage.overlayConfig} /> : null}
                {showInteriorDisclaimer ? <ImageDisclaimer /> : null}

                {canNavigate ? (
                  <>
                    <button
                      type="button"
                      onClick={() => changeZoomedImage(-1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 text-slate-700 border border-slate-200 shadow-md hover:bg-white flex items-center justify-center transition-colors"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => changeZoomedImage(1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 text-slate-700 border border-slate-200 shadow-md hover:bg-white flex items-center justify-center transition-colors"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                ) : null}
              </div>
                  </>
                );
              })()}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(galleryModalState)}
        onOpenChange={(open) => {
          if (!open) {
            setGalleryModalState(null);
          }
        }}
      >
        <DialogContent className="max-w-5xl w-[96vw] max-h-[92dvh] !p-0 gap-0 overflow-hidden bg-white/95 border-slate-200 shadow-2xl backdrop-blur-xl">
          {galleryModalState ? (
            <div className="grid max-h-[92dvh] w-full grid-rows-[auto,1fr,auto]">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 text-slate-900">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Photo Gallery</p>
                  <h2 className="text-lg font-bold">
                    {galleryModalState.galleryScope === "exterior" ? "Exterior Photos" : "Interior Photos"}
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  {galleryModalState.currentIndex + 1} / {galleryModalState.images.length}
                </p>
              </div>

              <div className="relative flex-1 min-h-0 overflow-hidden bg-slate-100 p-3 sm:p-4">
                {(() => {
                  const showInteriorDisclaimer = galleryModalState.galleryScope === "interior";

                  return (
                    <>
                <img
                  src={galleryModalState.images[galleryModalState.currentIndex]}
                  alt={`${galleryModalState.property.title} gallery`}
                  className="mx-auto block h-auto w-auto max-h-full max-w-full object-contain"
                  draggable={false}
                />
                {showInteriorDisclaimer ? <ImageDisclaimer /> : null}

                {galleryModalState.images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setGalleryModalState((current) => current ? { ...current, currentIndex: (current.currentIndex - 1 + current.images.length) % current.images.length } : current)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 text-slate-700 border border-slate-200 shadow-md hover:bg-white flex items-center justify-center transition-colors"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryModalState((current) => current ? { ...current, currentIndex: (current.currentIndex + 1) % current.images.length } : current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 text-slate-700 border border-slate-200 shadow-md hover:bg-white flex items-center justify-center transition-colors"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                ) : null}
                    </>
                  );
                })()}
              </div>

              {galleryModalState.images.length > 1 ? (
                <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {galleryModalState.images.map((image, index) => (
                      <button
                        key={`${galleryModalState.property.id}-gallery-${index}`}
                        type="button"
                        onClick={() => setGalleryModalState((current) => current ? { ...current, currentIndex: index } : current)}
                        className={`flex-shrink-0 h-16 w-24 overflow-hidden rounded-lg border-2 bg-white transition-all ${index === galleryModalState.currentIndex ? "border-[#16a34a] ring-2 ring-[#16a34a]/20" : "border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-300"}`}
                        aria-label={`Open photo ${index + 1}`}
                      >
                        <img src={image} alt="" className="h-full w-full object-contain bg-white" draggable={false} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(floorPlanModalState)}
        onOpenChange={(open) => {
          if (!open) {
            setFloorPlanModalState(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl w-[96vw] max-h-[92dvh] !p-0 gap-0 overflow-hidden bg-white/95 border-slate-200 shadow-2xl backdrop-blur-xl">
          {floorPlanModalState ? (
            <div className="flex max-h-[92dvh] w-full flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 text-slate-900">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Floor Plan</p>
                  <h2 className="text-lg font-bold">{floorPlanModalState.plan.label || "Floor Plan"}</h2>
                </div>
              </div>

              <div className="relative flex-1 min-h-0 overflow-auto bg-slate-100 p-3 sm:p-4">
                <img
                  src={floorPlanModalState.plan.image}
                  alt={floorPlanModalState.plan.label || "Floor Plan"}
                  className="mx-auto block h-auto w-auto max-h-full max-w-full object-contain"
                />
                {floorPlanModalState.splitGuideConfig ? <SplitUnitGuideOverlay config={floorPlanModalState.splitGuideConfig} /> : null}
              </div>

              {floorPlanModalState.property.floor_plans && Object.keys(floorPlanModalState.property.floor_plans).length > 1 ? (
                <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    {floorPlanModalState.property.floor_plans.groundFloor ? (
                      <Button
                        variant={floorPlanModalState.plan === floorPlanModalState.property.floor_plans.groundFloor ? "default" : "outline"}
                        onClick={() => setFloorPlanModalState((current) => current ? { ...current, plan: current.property.floor_plans.groundFloor } : current)}
                        className="flex-1"
                      >
                        {floorPlanModalState.property.floor_plans.groundFloor.label || "Ground Floor"}
                      </Button>
                    ) : null}
                    {floorPlanModalState.property.floor_plans.secondFloor ? (
                      <Button
                        variant={floorPlanModalState.plan === floorPlanModalState.property.floor_plans.secondFloor ? "default" : "outline"}
                        onClick={() => setFloorPlanModalState((current) => current ? { ...current, plan: current.property.floor_plans.secondFloor } : current)}
                        className="flex-1"
                      >
                        {floorPlanModalState.property.floor_plans.secondFloor.label || "Second Floor"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(tourModalProperty)}
        onOpenChange={(open) => {
          if (!open) {
            setTourModalProperty(null);
            setActiveTourType("exterior");
            setActiveTourPlaceId("");
          }
        }}
      >
        <DialogContent className="max-w-6xl w-[96vw] h-[92vh] !p-0 gap-0 overflow-hidden bg-white">
          {tourModalProperty ? (
            <div className="h-full flex flex-col min-h-0">
              <div className="px-5 py-4 border-b border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">360 Tour</p>
                    <h2 className="text-lg font-bold text-slate-900">{tourModalProperty.title}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2 pr-10 md:pr-14">
                    <Button
                      type="button"
                      variant={activeTourType === "exterior" ? "default" : "outline"}
                      className={activeTourType === "exterior" ? "bg-[#15803d] hover:bg-[#166534] text-white" : "border-[#15803d]/25 text-[#15803d] hover:bg-[#f0fdf4]"}
                      onClick={() => {
                        setActiveTourType("exterior");
                        setActiveTourPlaceId(getDefaultTourPlaceId(activeTourSources, "exterior"));
                      }}
                      disabled={!activeTourSources?.hasExterior}
                    >
                      Exterior
                    </Button>
                    <Button
                      type="button"
                      variant={activeTourType === "interior" ? "default" : "outline"}
                      className={activeTourType === "interior" ? "bg-[#15803d] hover:bg-[#166534] text-white" : "border-[#15803d]/25 text-[#15803d] hover:bg-[#f0fdf4]"}
                      onClick={() => {
                        setActiveTourType("interior");
                        setActiveTourPlaceId(getDefaultTourPlaceId(activeTourSources, "interior"));
                      }}
                      disabled={!activeTourSources?.hasInterior}
                    >
                      Interior
                    </Button>
                  </div>
                </div>

                {activeTourType === "interior" && activeTourPlaces.length > 1 ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2 pr-10 md:pr-14">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Interior Spots</span>
                    {activeTourPlaces.map((place) => (
                      <Button
                        key={place.id}
                        type="button"
                        variant={activeTourPlaceId === place.id ? "default" : "outline"}
                        className={activeTourPlaceId === place.id ? "bg-[#15803d] hover:bg-[#166534] text-white" : "border-[#15803d]/25 text-[#15803d] hover:bg-[#f0fdf4]"}
                        onClick={() => setActiveTourPlaceId(place.id)}
                      >
                        {place.label}
                      </Button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex-1 min-h-0 bg-slate-950">
                {activeTourSource ? (
                  <PanoramaViewer src={activeTourSource} alt={`360° ${activeTourType} view of ${tourModalProperty.title}`} />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-slate-200">
                    No 360 image found for this unit.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
