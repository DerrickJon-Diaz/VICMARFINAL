// Local replacement for Base44 SDK
// This provides mock data and local storage-based functionality

// Import property images
import duplexDeluxeImg from '@/images/properties/Duplex Deluxe Updated.jpg';
import duplexPremiereImg from '@/images/properties/Duplex Premiere Updated.jpg';
import triplexImg from '@/images/properties/Triplex.png';
import cornerUnitImg from '@/images/properties/Corner Unit.png';
import rowhouseEconomicImg from '@/images/properties/Rowhouse Economic Updated.jpg';
import rowhouseCompoundImg from '@/images/properties/Rowhouse Compound.png';
import rowhouseSocializedImg from '@/images/properties/Rowhouse Socialized.png';

// Import interior images
import duplexInt1 from '@/images/properties/Interior/duplex_img1.png';
import duplexInt2 from '../../images/BEDROOM SCENE 2 UP.png';
import duplexInt3 from '../../images/bintana.png';
import duplexInt4 from '@/images/properties/Interior/duplex_img4.png';
import duplexInt5 from '@/images/properties/Interior/duplex_img5.png';
import duplexBedroomUp1 from '../../images/BEDROOM SCENE 1 UP.png';
import duplexBedroomUp2 from '../../images/BEDROOM SCENE 2 UP.png';
import duplexBitana from '../../images/bintana.png';
import duplexImg3 from '@/images/properties/Interior/duplex_img3.png';
import duplexImg5 from '@/images/properties/Interior/duplex_img5.png';
import compoundInt1 from '@/images/properties/Interior/compound_img1.png';
import compoundInt2 from '@/images/properties/Interior/compound_img2.png';
import compoundInt3 from '@/images/properties/Interior/compound_img3.png';
import compoundInt4 from '@/images/properties/Interior/compound_img4.png';
import compoundInt5 from '@/images/properties/Interior/compound_img5.png';
import socializedInt1 from '@/images/properties/Interior/socialized_img1.png';
import socializedInt2 from '@/images/properties/Interior/socialized_img2.png';
import socializedInt3 from '@/images/properties/Interior/socialized_img3.png';
import socializedInt4 from '@/images/properties/Interior/socialized_img4.png';
import socializedInt5 from '@/images/properties/Interior/socialized_img5.png';
import rowhouseInt1 from '../../Interior Images/ROWHOUSE LIVING AREA.png';
import rowhouseInt2 from '../../Interior Images/ROWHOUSE KITCHEN AREA.png';
import rowhouseInt3 from '../../Interior Images/ROWHOUSE DINING AREA.png';
import rowhouseInt4 from '../../Interior Images/ROWHOUSE BEDROOM SCENE 1 UP.png';
import rowhouseInt5 from '../../Interior Images/ROWHOUSE BEDROOM SCENE 2 UP.png';
import triplexIntA from '../../images/TRIPLEX A.jpg';
import triplexIntB from '../../images/TRIPLEX B.jpg';
import triplexIntC from '../../images/TRIPLEX C.jpg';
// Import floor plan images
import duplexDeluxeGF from '../../FloorPlan Image/Duplex Original Deluxe GF  GF.png';
import duplexDeluxeSF from '../../FloorPlan Image/Duplex Deluxe Original SF.png';
import duplexPremiereGF from '@/images/floor_plan/Duplex-Unit-Premiere-GF new.jpg';
import duplexPremiereSF from '@/images/floor_plan/Duplex-Unit-Premiere-SF new.jpg';
import triplexEndAGF from '@/images/floor_plan/Triplex-End-Unit-A-GF new.jpg';
import triplexEndASF from '@/images/floor_plan/Triplex-End-Unit-A-SF new.jpg';
import triplexCenterGF from '@/images/floor_plan/Triplex-Center-Unit-GF new.jpg';
import triplexCenterSF from '@/images/floor_plan/Triplex-Center-Unit-SF new.jpg';
import triplexEndBGF from '@/images/floor_plan/Triplex-End-Unit-B-GF new.jpg';
import triplexEndBSF from '@/images/floor_plan/Triplex-End-Unit-B-SF new.jpg';
import economicGF from '@/images/floor_plan/Economic-Unit-GF new.jpg';
import economicSF from '@/images/floor_plan/Economic-Unit-SF new.jpg';
import compoundGF from '@/images/floor_plan/Compound-Unit-GF new.jpg';
import compoundLoft from '@/images/floor_plan/Compound-Unit-Loft new.jpg';
import socializedGF from '@/images/floor_plan/Rowhouse-Socialized-Unit-GF new.jpg';

// Import 360 panorama images
import panoramaDuplexDeluxe from '@/images/360/360-Duplex-Deluxe.jpg';
import panoramaDuplexPremiere from '@/images/360/360-Duplex-Primere.jpg';
import panoramaCornerUnit from '@/images/360/360-Corner-Unit.jpg';
import duplexInteriorScene1 from '../../360/360 DUPLEX SCENE 1.jpg';
import duplexInteriorScene2 from '../../360/360 duplex scene 2.jpg';
import duplexInteriorMasterBedroomScene from '../../360/360 MASTER BEDROOM SCENE 1.jpg';
import duplexInteriorMainScene from '../../360/DUPLEX INTERIOR 360.jpg';

// Sample property data for the real estate app - based on actual Vicmar Homes data
const mockProperties = [
  {
    id: "duplex-unit-deluxe",
    title: "Single Attached Duplex (Deluxe)",
    property_type: "duplex",
    price: 2500000,
    location: "Batangas",
    description: "A spacious duplex deluxe unit featuring modern architecture with 1 family area (optional 3 bedrooms) and 1 bathroom (optional 2 bathrooms). Perfect for growing families who want quality living spaces with premium finishes. Includes living area, dining area, kitchen, study area, and balcony.",
    bedrooms: { default: 1, options: [3] },
    familyarea: { default: 1, options: [1] },
    bathrooms: { default: 1, options: [2] },
    floor_area: 59.32,
    lot_area: 66,
    status: "available",
    main_image: duplexDeluxeImg,
    gallery_images: [duplexBitana, duplexBedroomUp1, duplexBedroomUp2, duplexImg3, duplexImg5],
    panorama_image: panoramaDuplexDeluxe,
    panorama_interior_places: [
      { id: 'living-area', label: 'Living Area', src: duplexInteriorMainScene },
      { id: 'interior-scene-1', label: 'Interior Scene 1', src: duplexInteriorScene1 },
      { id: 'interior-scene-2', label: 'Interior Scene 2', src: duplexInteriorScene2 },
      { id: 'master-bedroom', label: 'Master Bedroom', src: duplexInteriorMasterBedroomScene },
    ],
    floor_plans: {
      groundFloor: { image: duplexDeluxeGF, label: "Ground Floor" },
      secondFloor: { image: duplexDeluxeSF, label: "Second Floor" }
    },
    amenities: ["Porch", "Foyer", "Living Area", "Dining Area", "Kitchen", "Study Area", "Balcony"],
    created_date: "2025-12-15T10:00:00Z"
  },
  {
    id: "duplex-unit-premiere",
    title: "Single Attached Duplex (Premiere)",
    property_type: "duplex",
    price: 2800000,
    location: "Batangas",
    description: "The Premier Duplex represents the pinnacle of residential design, featuring sophisticated architecture with a primary configuration of 1 bedroom and 2 bathrooms. The flexible floor plan accommodates expanded family layouts with (optional: 3 bedrooms with 2 bathrooms or 2 bedrooms with 2 bathrooms). Defined by premium finishes, meticulous craftsmanship, and expansive living spaces, this residence embodies architectural excellence and contemporary luxury for the discerning homeowner.",
    bedrooms: { default: 1, options: [3, 2] },
    bathrooms: { default: 2, options: [2] },
    floor_area: 59.32,
    lot_area: 66,
    status: "available",
    main_image: duplexPremiereImg,
    gallery_images: [duplexBitana, duplexBedroomUp1, duplexBedroomUp2, duplexImg3, duplexImg5],
    panorama_image: panoramaDuplexPremiere,
    panorama_interior_places: [
      { id: 'living-area', label: 'Living Area', src: duplexInteriorMainScene },
      { id: 'interior-scene-1', label: 'Interior Scene 1', src: duplexInteriorScene1 },
      { id: 'interior-scene-2', label: 'Interior Scene 2', src: duplexInteriorScene2 },
      { id: 'master-bedroom', label: 'Master Bedroom', src: duplexInteriorMasterBedroomScene },
    ],
    floor_plans: {
      groundFloor: { image: duplexPremiereGF, label: "Ground Floor" },
      secondFloor: { image: duplexPremiereSF, label: "Second Floor" }
    },
    amenities: ["Porch", "Foyer", "Living Area", "Dining Area", "Kitchen", "Study Area", "Balcony"],
    created_date: "2025-12-10T10:00:00Z"
  },
  {
    id: "triplex-end-unit-a",
    title: "Triplex (End Unit)",
    property_type: "triplex",
    price: 2200000,
    location: "Batangas",
    description: "Corner triplex end unit with extra natural lighting and ventilation. Features 1 (optional 3 bedrooms) and 1 bathroom (optional 2 bathrooms) with a practical layout perfect for families. End unit advantage provides more privacy and outdoor space.",
    bedrooms: { default: 1, options: [3] },
    bathrooms: { default: 1, options: [2] },
    floor_area: 59.32,
    lot_area: 66,
    status: "available",
    main_image: triplexImg,
    gallery_images: [],
    panorama_image: panoramaCornerUnit,
    floor_plans: {
      groundFloor: { image: triplexEndAGF, label: "Ground Floor" },
      secondFloor: { image: triplexEndASF, label: "Second Floor" }
    },
    amenities: ["Porch", "Foyer", "Living Area", "Dining Area", "Kitchen", "Study Area", "Balcony"],
    created_date: "2025-12-08T10:00:00Z"
  },
  {
    id: "triplex-center-unit",
    title: "Triplex (Center Unit)",
    property_type: "triplex",
    price: 1900000,
    location: "Batangas",
    description: "Affordable triplex center unit with efficient layout. Features 1 bedroom (optional 3 bedrooms) and 1 bathroom (optional 2 bathrooms). Compact design maximizes living space while maintaining comfort and functionality for modern families.",
    bedrooms: { default: 1, options: [3] },
    bathrooms: { default: 1, options: [2] },
    floor_area: 65.30,
    lot_area: 44.33,
    status: "available",
    // use cornerUnitImg for visual variation in listings
    main_image: cornerUnitImg,
    gallery_images: [],
    floor_plans: {
      groundFloor: { image: triplexCenterGF, label: "Ground Floor" },
      secondFloor: { image: triplexCenterSF, label: "Second Floor" }
    },
    amenities: ["Porch", "Foyer", "Living Area", "Dining Area", "Kitchen", "Study Area", "Balcony"],
    created_date: "2025-12-05T10:00:00Z"
  },
  {
    id: "triplex-end-unit-b",
    title: "Triplex (End Unit)",
    property_type: "triplex",
    price: 2200000,
    location: "Batangas",
    description: "Corner triplex end unit on the opposite side. Features 1 bedroom (optional 3 bedrooms) and 1 bathroom (optional 2 bathrooms) with excellent cross-ventilation. End unit design provides additional windows and natural light throughout the home.",
    bedrooms: { default: 1, options: [3] },
    bathrooms: { default: 1, options: [2] },
    floor_area: 59.32,
    lot_area: 66,
    status: "reserved",
    // use a different main image to avoid identical cards
    main_image: cornerUnitImg,
    gallery_images: [],
    floor_plans: {
      groundFloor: { image: triplexEndBGF, label: "Ground Floor" },
      secondFloor: { image: triplexEndBSF, label: "Second Floor" }
    },
    amenities: ["Porch", "Foyer", "Living Area", "Dining Area", "Kitchen", "Study Area", "Balcony"],
    created_date: "2025-12-01T10:00:00Z"
  },
  {
    id: "rowhouse-economic-unit",
    title: "Rowhouse (Economic Unit)",
    property_type: "rowhouse",
    price: 1500000,
    location: "Batangas",
    description: "Budget-friendly rowhouse economic unit perfect for first-time homebuyers. Features practical layout with living area, dining, kitchen, and bedroom spaces. An affordable entry point to homeownership.",
    bedrooms: 1,
    bathrooms: 1,
    floor_area: 59.32,
    lot_area: 44,
    status: "available",
    main_image: rowhouseEconomicImg,
    gallery_images: [rowhouseInt1, rowhouseInt2, rowhouseInt3, rowhouseInt4, rowhouseInt5],
    floor_plans: {
      groundFloor: { image: economicGF, label: "Ground Floor" },
      secondFloor: { image: economicSF, label: "Second Floor" }
    },
    amenities: ["Porch", "Foyer", "Living Area", "Dining Area", "Kitchen", "Study Area", "Balcony"],
    created_date: "2025-11-28T10:00:00Z"
  },
  {
    id: "rowhouse-compound-unit",
    title: "Rowhouse (Compound Unit)",
    property_type: "rowhouse",
    price: 1200000,
    location: "Batangas",
    description: "Compact rowhouse compound unit with loft-style design. Features open-plan living on the ground floor with a bedroom loft above. Ideal for singles, couples, or small families looking for affordable housing.",
    bedrooms: 1,
    bathrooms: 1,
    floor_area: 50.51,
    lot_area: 40.58,
    status: "available",
    main_image: rowhouseCompoundImg,
    gallery_images: [compoundInt1, compoundInt2, compoundInt3, compoundInt4, compoundInt5],
    floor_plans: {
      groundFloor: { image: compoundGF, label: "Ground Floor" },
      secondFloor: { image: compoundLoft, label: "Loft" }
    },
    amenities: ["Living Area", "Dining Area", "Kitchen", "Study", "Hallway"],
    created_date: "2025-11-25T10:00:00Z"
  },
  {
    id: "rowhouse-socialized-unit",
    title: "Rowhouse (Socialized Unit)",
    property_type: "rowhouse",
    price: 800000,
    location: "Batangas",
    description: "Most affordable socialized housing unit designed for low-income families. Single-floor living (optional 1 loft/second floor) with essential spaces including living area, dining, kitchen, bedroom, and bathroom. Government housing program eligible.",
    bedrooms: 1,
    bathrooms: 1,
    floor_area: 33.84,
    lot_area: 44.30,
    status: "available",
    main_image: rowhouseSocializedImg,
    gallery_images: [socializedInt1, socializedInt2, socializedInt3, socializedInt4, socializedInt5],
    floor_plans: {
      groundFloor: { image: socializedGF, label: "Ground Floor" }
    },
    amenities: ["Porch", "Foyer", "Living Area", "Dining Area", "Kitchen", "Bedroom"],
    created_date: "2025-11-20T10:00:00Z"
  }
];

// Local storage keys
const STORAGE_KEYS = {
  USER: 'vicmar_user',
  AUTH_SESSION: 'vicmar_auth_session',
  INQUIRIES: 'vicmar_inquiries'
};

// Helper to get data from localStorage
/**
 * @param {string} key
 * @param {any} [defaultValue]
 * @returns {any}
 */
const getStoredData = (key = '', defaultValue = undefined) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper to save data to localStorage
/**
 * @param {string} key
 * @param {any} data
 */
const saveStoredData = (key = '', data = null) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

// Generate unique ID
const generateId = () => {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// Auth functions
const auth = {
  // Get current user - returns null if not logged in
  me: async () => {
    const user = getStoredData(STORAGE_KEYS.USER);
    if (user) {
      return user;
    }
    // Simulate not authenticated error
    const error = { message: 'Not authenticated', status: 401 };
    throw error;
  },

  // Logout user
  logout: (redirectUrl = null) => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  },

  // Redirect to login - for local dev, we'll just log it
  redirectToLogin: (returnUrl = null) => {
    console.log('Redirect to login requested. Return URL:', returnUrl);
    // In a real implementation, you'd redirect to a login page
    // For now, just reload the page
    window.location.href = '/';
  }
};

// Entity operations
/**
 * @param {string} entityName
 * @param {any[]} [mockData]
 */
const createEntityOperations = (entityName = '', mockData = []) => {
  const storageKey = `vicmar_${entityName.toLowerCase()}`;
  const mockDataById = Array.isArray(mockData)
    ? mockData.reduce((acc, item) => {
      if (item?.id) {
        acc[item.id] = item;
      }
      return acc;
    }, {})
    : {};

  /** @param {any} item */
  const withMockDefaults = (item) => {
    if (!item || typeof item !== 'object') {
      return item;
    }

    const defaults = item.id ? mockDataById[item.id] : null;
    if (!defaults) {
      return item;
    }

    return {
      ...defaults,
      ...item,
      main_image: defaults.main_image ?? item.main_image,
      gallery_images: defaults.gallery_images ?? item.gallery_images,
      images: defaults.images ?? item.images,
      floor_plans: defaults.floor_plans ?? item.floor_plans,
      panorama_image: defaults.panorama_image ?? item.panorama_image,
      panorama_interior_places: defaults.panorama_interior_places ?? item.panorama_interior_places,
    };
  };
  
  // Initialize with mock data if no stored data exists
  // Initialize with mock data. In development always refresh stored data so
  // changes to this mock file are reflected immediately in the running app.
  const isDevEnv = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isDevEnv) {
    if (mockData.length > 0) {
      saveStoredData(storageKey, mockData);
    }
  } else if (!getStoredData(storageKey) && mockData.length > 0) {
    saveStoredData(storageKey, mockData);
  }

  return {
    // List entities with optional sorting and limit
    list: async (sortField = null, limit = null) => {
      // Prefer in-file mock data when running in development so changes
      // to this file are reflected immediately and don't get masked by
      // stale localStorage values.
      const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      let data = isDev ? mockData : getStoredData(storageKey, mockData);
      data = Array.isArray(data) ? data.map(withMockDefaults) : [];
      
      // Sort if specified
      if (sortField) {
        const normalizedSortField = String(sortField);
        const descending = normalizedSortField.startsWith('-');
        const field = descending ? normalizedSortField.slice(1) : normalizedSortField;
        
        data = [...data].sort((a, b) => {
          const aVal = a[field];
          const bVal = b[field];
          
          if (field.includes('date')) {
            return descending 
              ? new Date(bVal).getTime() - new Date(aVal).getTime()
              : new Date(aVal).getTime() - new Date(bVal).getTime();
          }
          
          if (typeof aVal === 'number') {
            return descending ? bVal - aVal : aVal - bVal;
          }
          
          return descending 
            ? String(bVal).localeCompare(String(aVal))
            : String(aVal).localeCompare(String(bVal));
        });
      }
      
      // Limit if specified
      if (limit && limit > 0) {
        data = data.slice(0, limit);
      }
      
      return data;
    },

    // Filter entities by criteria
    filter: async (criteria = {}) => {
      const data = getStoredData(storageKey, mockData);
      const hydratedData = Array.isArray(data) ? data.map(withMockDefaults) : [];
      
      return hydratedData.filter(item => {
        return Object.entries(criteria).every(([key, value]) => {
          return item[key] === value;
        });
      });
    },

    // Get single entity by ID
    get: async (id = '') => {
      const data = getStoredData(storageKey, mockData);
      const hydratedData = Array.isArray(data) ? data.map(withMockDefaults) : [];
      return hydratedData.find(item => item.id === id) || null;
    },

    // Create new entity
    create: async (entityData = {}) => {
      const data = getStoredData(storageKey, []);
      const entities = Array.isArray(data) ? data : [];
      const newEntity = {
        id: generateId(),
        ...entityData,
        created_date: new Date().toISOString()
      };
      entities.push(newEntity);
      saveStoredData(storageKey, entities);
      return newEntity;
    },

    // Update entity
    update: async (id = '', updates = {}) => {
      const data = getStoredData(storageKey, []);
      const entities = Array.isArray(data) ? data : [];
      const index = entities.findIndex(item => item.id === id);
      if (index !== -1) {
        entities[index] = { ...entities[index], ...updates };
        saveStoredData(storageKey, entities);
        return entities[index];
      }
      throw new Error('Entity not found');
    },

    // Delete entity
    delete: async (id = '') => {
      const data = getStoredData(storageKey, []);
      const entities = Array.isArray(data) ? data : [];
      const filtered = entities.filter(item => item.id !== id);
      saveStoredData(storageKey, filtered);
      return { success: true };
    }
  };
};

// App logging (no-op for local development)
const appLogs = {
  logUserInApp: async (pageName = '') => {
    console.log(`[Navigation] User visited: ${pageName}`);
    return { success: true };
  }
};

// Main base44 client object
export const base44 = {
  auth,
  entities: {
    Property: createEntityOperations('Property', mockProperties),
    Inquiry: createEntityOperations('Inquiry', [])
  },
  appLogs
};

export default base44;

