/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Compass, 
  MapPin, 
  Search, 
  Navigation, 
  Layers, 
  Crosshair, 
  X, 
  Map as MapIcon,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Plus,
  Minus,
  Users,
  Briefcase,
  Home,
  User,
  Star,
  DollarSign,
  Clock,
  Building,
  Upload,
  FileText,
  Trash2,
  Camera,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Settings,
  Volume2,
  RotateCcw,
  Download,
  ExternalLink,
  Lock,
  Unlock,
  Edit3,
  Share2,
  Globe,
  CreditCard,
  Zap,
  Building2,
  Copy,
  Check,
  Receipt,
  Maximize2,
  Filter,
  ZoomIn,
  Wifi,
  Battery,
  Smartphone,
  Grid,
  BarChart3,
  TrendingUp,
  PieChart,
  Sliders,
  ShieldAlert,
  Activity,
  Wrench,
  Award,
  History,
  LogOut,
  VolumeX,
  UserX,
  AlertTriangle,
  PlusCircle,
  MessageSquare
} from 'lucide-react';

// Fix for default marker icon not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Reusable Flat Icon component
const FlatIcon = ({ icon: Icon, className = "" }: { icon: any; className?: string }) => (
  <div className={`flat-icon ${className}`}>
    <Icon className="w-5 h-5 text-gray-700" />
  </div>
);

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to create dynamic user profile picture map marker
const createUserProfileMarkerIcon = (avatarUrl: string, name: string, isVerified?: boolean) => {
  const initial = (name || 'User').charAt(0).toUpperCase();
  const safeAvatar = avatarUrl ? avatarUrl.replace(/"/g, '&quot;') : '';
  const safeName = (name || 'User').replace(/"/g, '&quot;');

  return L.divIcon({
    className: 'custom-user-profile-marker',
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:scale-110">
        <!-- Pulsing Ring Background -->
        <div class="absolute -top-1 w-12 h-12 bg-blue-500 rounded-full opacity-45 animate-ping"></div>
        
        <!-- Profile Picture Outer Frame -->
        <div class="relative w-12 h-12 rounded-full ring-4 ring-white shadow-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center overflow-hidden border-2 border-blue-500">
          ${
            safeAvatar 
              ? `<img src="${safeAvatar}" alt="${safeName}" class="w-full h-full object-cover rounded-full" />`
              : `<span class="text-white font-extrabold text-base uppercase">${initial}</span>`
          }
          <!-- Green Verified Badge -->
          ${isVerified ? `<span class="absolute top-0 right-0 w-4 h-4 bg-emerald-500 text-white font-black rounded-full border-2 border-white flex items-center justify-center text-[10px] shadow-md z-10">✓</span>` : ''}
          <!-- Online status dot -->
          <span class="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></span>
        </div>
        
        <!-- Pointer Tip Triangle -->
        <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-blue-600 -mt-0.5 filter drop-shadow-md"></div>
      </div>
    `,
    iconSize: [48, 56],
    iconAnchor: [24, 56],
    popupAnchor: [0, -56]
  });
};

// Helper to create Live Seeker For Hire map marker with profile picture and radar
const createLiveSeekerMarkerIcon = (avatarUrl: string, name: string, isVerified?: boolean) => {
  const initial = (name || 'Seeker').charAt(0).toUpperCase();
  const safeAvatar = avatarUrl ? avatarUrl.replace(/"/g, '&quot;') : '';
  const safeName = (name || 'Seeker').replace(/"/g, '&quot;');

  return L.divIcon({
    className: 'custom-live-seeker-marker',
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:scale-110">
        <!-- Radar Pulse -->
        <div class="absolute -top-1 w-14 h-14 bg-purple-500 rounded-full opacity-50 animate-ping"></div>
        
        <!-- For Hire Badge Top Pill -->
        <div class="z-20 -mb-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[9px] shadow-md border border-white uppercase tracking-wider flex items-center gap-0.5 animate-bounce">
          <span>✨ FOR HIRE</span>
        </div>

        <!-- Profile Picture Outer Frame -->
        <div class="relative w-12 h-12 rounded-full ring-4 ring-purple-500 shadow-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center overflow-hidden border-2 border-white">
          ${
            safeAvatar 
              ? `<img src="${safeAvatar}" alt="${safeName}" class="w-full h-full object-cover rounded-full" />`
              : `<span class="text-white font-extrabold text-base uppercase">${initial}</span>`
          }
          <!-- Green Verified Badge -->
          ${isVerified ? `<span class="absolute top-0 right-0 w-4 h-4 bg-emerald-500 text-white font-black rounded-full border-2 border-white flex items-center justify-center text-[10px] shadow-md z-10">✓</span>` : ''}
          <!-- Green Active Online Indicator -->
          <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></span>
        </div>
        
        <!-- Pointer Tip Triangle -->
        <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-purple-600 -mt-0.5 filter drop-shadow-md"></div>
      </div>
    `,
    iconSize: [64, 70],
    iconAnchor: [32, 70],
    popupAnchor: [0, -70]
  });
};

// Helper to create Seeker map marker
const createSeekerMarkerIcon = (title: string, role: string) => {
  return L.divIcon({
    className: 'custom-seeker-marker',
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:scale-110">
        <div class="px-2.5 py-1 rounded-full bg-purple-600 text-white font-bold text-[10px] shadow-lg border-2 border-white flex items-center gap-1">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span class="truncate max-w-[80px]">${title}</span>
        </div>
        <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-purple-600"></div>
      </div>
    `,
    iconSize: [100, 32],
    iconAnchor: [50, 32],
    popupAnchor: [0, -32]
  });
};

// Helper to create Moving Seeker Active Navigation Marker
const createMovingSeekerMarkerIcon = (avatarUrl: string, name: string, trade: string) => {
  const initial = (name || 'S').charAt(0).toUpperCase();
  const safeAvatar = avatarUrl ? avatarUrl.replace(/"/g, '&quot;') : '';
  return L.divIcon({
    className: 'custom-moving-seeker-marker',
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer animate-in zoom-in-50 duration-200">
        <div class="absolute -inset-3 bg-purple-500/30 rounded-full animate-ping pointer-events-none"></div>
        <div class="absolute -inset-1.5 bg-purple-500/40 rounded-full animate-pulse pointer-events-none"></div>
        <div class="relative bg-gradient-to-tr from-purple-700 via-indigo-700 to-purple-900 border-2 border-white rounded-2xl px-2 py-1 shadow-2xl flex items-center gap-1.5 text-white">
          <div class="w-6 h-6 rounded-full overflow-hidden border border-white/80 bg-purple-900 shrink-0 flex items-center justify-center font-black text-[9px]">
            ${safeAvatar ? `<img src="${safeAvatar}" class="w-full h-full object-cover" />` : initial}
          </div>
          <div class="text-left leading-tight">
            <span class="text-[9px] font-black block truncate max-w-[70px]">${name}</span>
            <span class="text-[7.5px] text-amber-300 font-bold block truncate max-w-[70px]">🚗 ${trade || 'Seeker'}</span>
          </div>
        </div>
        <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-purple-800"></div>
      </div>
    `,
    iconSize: [110, 42],
    iconAnchor: [55, 42],
    popupAnchor: [0, -42]
  });
};

// Helper to create GiG map marker
const createGigMarkerIcon = (pay: string, title: string) => {
  return L.divIcon({
    className: 'custom-gig-marker',
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:scale-110">
        <div class="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] shadow-lg border-2 border-white flex items-center gap-1">
          <span>⚡ ${pay}</span>
        </div>
        <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-amber-500"></div>
      </div>
    `,
    iconSize: [80, 32],
    iconAnchor: [40, 32],
    popupAnchor: [0, -32]
  });
};

// Helper to create Tenant map marker
const createTenantMarkerIcon = (price: string) => {
  return L.divIcon({
    className: 'custom-tenant-marker',
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:scale-110">
        <div class="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] shadow-lg border-2 border-white flex items-center gap-1">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>${price}</span>
        </div>
        <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-emerald-600"></div>
      </div>
    `,
    iconSize: [80, 32],
    iconAnchor: [40, 32],
    popupAnchor: [0, -32]
  });
};
const customPinIcon = L.divIcon({
  className: 'custom-pin-marker',
  html: `
    <div class="relative flex items-end justify-center w-8 h-10">
      <div class="absolute w-3 h-3 bg-red-600 rounded-full opacity-20 blur-[1px] bottom-0 translate-y-1 scale-x-150"></div>
      <svg class="w-8 h-10 text-red-500 filter drop-shadow-md transition-transform duration-200 hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="currentColor" fill-opacity="0.25"></path>
        <circle cx="12" cy="10" r="3" fill="white"></circle>
      </svg>
    </div>
  `,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
});

// Map styles configs
const MAP_THEMES = [
  {
    id: 'osm-standard',
    name: 'Street Classic',
    description: 'Detailed default OSM map style',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '',
  },
  {
    id: 'esri-satellite',
    name: 'Satellite View',
    description: 'High-resolution Esri Earth satellite imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '',
  }
];

// Profile Avatar Presets
const AVATAR_PRESETS = [
  { id: '1', name: 'Explorer', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Nomad', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Traveler', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: '4', name: 'Cyber', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: '5', name: 'Pilot', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { id: '6', name: 'Adventurer', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
];

// Coordinate Validator to prevent Leaflet NaN object crashes
function isValidCoordinate(lat: any, lng: any): boolean {
  if (typeof lat === 'undefined' || typeof lng === 'undefined' || lat === null || lng === null) {
    return false;
  }
  const numLat = Number(lat);
  const numLng = Number(lng);
  return (
    !isNaN(numLat) &&
    !isNaN(numLng) &&
    isFinite(numLat) &&
    isFinite(numLng) &&
    numLat >= -90 &&
    numLat <= 90 &&
    numLng >= -180 &&
    numLng <= 180
  );
}

// Map handler component to access leaflet map instance and respond to actions
interface MapControllerProps {
  onMapClick: (lat: number, lng: number) => void;
  flyToLocation: { lat: number; lng: number; zoom?: number } | null;
  setFlyToLocation: (val: null) => void;
  userPosition: [number, number] | null;
  autoCenter: boolean;
  setAutoCenter: (val: boolean) => void;
  zoomTrigger: number;
  setZoomTrigger: (val: number) => void;
}

function MapController({ 
  onMapClick, 
  flyToLocation, 
  setFlyToLocation, 
  userPosition,
  autoCenter,
  setAutoCenter,
  zoomTrigger,
  setZoomTrigger 
}: MapControllerProps) {
  const map = useMap();

  // Listen to map click and user interaction events safely
  useMapEvents({
    click(e) {
      if (e?.latlng && isValidCoordinate(e.latlng.lat, e.latlng.lng)) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
    dragstart() {
      setAutoCenter(false);
    }
  });

  // Handle programmatically triggered zoom in/out actions
  useEffect(() => {
    if (zoomTrigger !== 0) {
      if (zoomTrigger > 0) {
        map.zoomIn();
      } else if (zoomTrigger < 0) {
        map.zoomOut();
      }
      setZoomTrigger(0);
    }
  }, [zoomTrigger, map, setZoomTrigger]);

  // Handle programmatically triggered flyTo actions safely
  useEffect(() => {
    if (flyToLocation && isValidCoordinate(flyToLocation.lat, flyToLocation.lng)) {
      try {
        map.flyTo([flyToLocation.lat, flyToLocation.lng], flyToLocation.zoom || 18, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      } catch (err) {
        console.warn("Map flyTo error guarded:", err);
      }
      setFlyToLocation(null);
    } else if (flyToLocation) {
      setFlyToLocation(null);
    }
  }, [flyToLocation, map, setFlyToLocation]);

  // Keep centered on user location if autoCenter mode is enabled safely
  useEffect(() => {
    if (autoCenter && userPosition && isValidCoordinate(userPosition[0], userPosition[1])) {
      try {
        map.panTo(userPosition);
      } catch (err) {
        console.warn("Map panTo error guarded:", err);
      }
    }
  }, [userPosition, autoCenter, map]);

  return null;
}

export default function App() {
  // Geolocation States
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [geoState, setGeoState] = useState<'idle' | 'locating' | 'found' | 'error'>('idle');
  const [geoErrorMsg, setGeoErrorMsg] = useState<string>('');
  const [autoCenter, setAutoCenter] = useState<boolean>(true);
  const [showPinpointer, setShowPinpointer] = useState<boolean>(true);
  const [exactLocationPinnedEnabled, setExactLocationPinnedEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('timegig_exact_location_pinned_enabled');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  useEffect(() => {
    try {
      localStorage.setItem('timegig_exact_location_pinned_enabled', String(exactLocationPinnedEnabled));
    } catch (e) {}
  }, [exactLocationPinnedEnabled]);

  // User Profile States (Persisted in localStorage so account verification is remembered)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('timegig_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.activityHistory || !Array.isArray(parsed.activityHistory) || parsed.activityHistory.length === 0) {
          parsed.activityHistory = [
            {
              id: 'act-1',
              title: 'Daily Check-in & GPS Sync',
              category: 'system',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              dateFormatted: 'Today, 08:30',
              details: 'Logged into Timegig workspace. Calibrated GPS coordinates & live radius.',
              badge: 'Active'
            },
            {
              id: 'act-2',
              title: 'Broadcasting Available for Hire',
              category: 'profile',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              dateFormatted: 'Today, 07:15',
              details: 'Turned ON "Appear to Get Hired" broadcast on map for nearby job requests.',
              badge: 'Live Map'
            },
            {
              id: 'act-3',
              title: 'Completed DB Board Wiring GiG',
              category: 'gig',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              dateFormatted: 'Yesterday, 16:45',
              details: 'Completed electrical repair task for Client. Earned R 350/hr with 5-star rating.',
              badge: 'Earned R 350'
            },
            {
              id: 'act-4',
              title: 'Profile Pass Subscription Paid',
              category: 'payment',
              timestamp: new Date(Date.now() - 172800000).toISOString(),
              dateFormatted: '23 Sep, 11:20',
              details: 'Proof of Payment bank deposit verified. Active Profile Monthly Pass unlocked.',
              badge: 'Verified'
            }
          ];
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Failed to read userProfile from localStorage", e);
    }
    return {
      firstName: 'Timegig',
      middleName: '',
      surname: 'Explorer',
      dob: '1996-05-15',
      contactNumber: '+1 (555) 234-5678',
      email: 'timegig2026@gmail.com',
      address: '100 Market St, San Francisco, CA',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      idDocumentName: '',
      idDocumentUrl: '',
      socialLinks: [
        { id: '1', platform: 'LinkedIn', url: 'https://linkedin.com/in/timegig' },
        { id: '2', platform: 'Twitter', url: 'https://x.com/timegig' }
      ],
      verificationStatus: 'unverified' as 'unverified' | 'under_review' | 'verified',
      lastAvatarChangeDate: '',
      isSubscribed: true,
      subscriptionAmount: 9.99,
      subscriptionRenewalDate: '2026-10-25',
      subscriptionStartDate: new Date().toISOString(),
      subscriptionPlan: 'Active Profile Monthly Pass',
      paymentStatus: 'paid' as 'unpaid' | 'under_review' | 'paid',
      popDocumentName: '',
      popDocumentUrl: '',
      popSubmittedAt: '',
      seekerTradeType: 'Electrician',
      seekerTradeCustom: '',
      seekerTradeExperienceYears: '3-5 Years',
      seekerHourlyRate: 'R 250/hr',
      seekerBioSummary: 'Certified electrician specializing in domestic wiring, solar backups, fault diagnostics, and panel maintenance.',
      seekerWorkExperiences: [
        {
          id: 'exp-1',
          companyOrProject: 'Apex Electrical Solutions',
          roleTitle: 'Residential & Commercial Electrician',
          duration: '2022 - 2025',
          description: 'Wiring installations, circuit breaker maintenance, fault finding and issuing certificates of compliance.'
        },
        {
          id: 'exp-2',
          companyOrProject: 'Metro Infrastructure Contracting',
          roleTitle: 'Apprentice Electrician & Panel Builder',
          duration: '2020 - 2022',
          description: 'Assisted senior master electricians on commercial wiring, conduit bending, and transformer installations.'
        }
      ],
      activityHistory: [
        {
          id: 'act-1',
          title: 'Daily Check-in & GPS Sync',
          category: 'system',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          dateFormatted: 'Today, 08:30',
          details: 'Logged into Timegig workspace. Calibrated GPS coordinates & live radius.',
          badge: 'Active'
        },
        {
          id: 'act-2',
          title: 'Broadcasting Available for Hire',
          category: 'profile',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          dateFormatted: 'Today, 07:15',
          details: 'Turned ON "Appear to Get Hired" broadcast on map for nearby job requests.',
          badge: 'Live Map'
        },
        {
          id: 'act-3',
          title: 'Completed DB Board Wiring GiG',
          category: 'gig',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          dateFormatted: 'Yesterday, 16:45',
          details: 'Completed electrical repair task for Client. Earned R 350/hr with 5-star rating.',
          badge: 'Earned R 350'
        },
        {
          id: 'act-4',
          title: 'Profile Pass Subscription Paid',
          category: 'payment',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          dateFormatted: '23 Sep, 11:20',
          details: 'Proof of Payment bank deposit verified. Active Profile Monthly Pass unlocked.',
          badge: 'Verified'
        }
      ]
    };
  });

  // Helper to calculate 30-day subscription active window (switch stays ON for 30 days)
  const getSubscriptionWindowStatus = () => {
    const startDate = userProfile.subscriptionStartDate
      ? new Date(userProfile.subscriptionStartDate).getTime()
      : new Date().getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 30 - diffDays);
    // Switch stays ON for 30 days when subscribed or during 30-day window
    const isSubscribedOn = userProfile.isSubscribed || diffDays < 30;

    return {
      diffDays,
      daysRemaining,
      isSubscribedOn
    };
  };

  // Helper to check 30-day profile picture change restriction
  const getAvatarChangeLockStatus = () => {
    if (!userProfile.lastAvatarChangeDate) return { isLocked: false, daysRemaining: 0 };
    const lastChange = new Date(userProfile.lastAvatarChangeDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - lastChange) / (1000 * 60 * 60 * 24));
    if (diffDays < 30) {
      return { isLocked: true, daysRemaining: 30 - diffDays };
    }
    return { isLocked: false, daysRemaining: 0 };
  };

  // Helper to trigger browser download for uploaded files
  const downloadDocumentFile = (url: string, filename: string) => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'document_file';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Save profile state to localStorage whenever userProfile changes
  useEffect(() => {
    try {
      localStorage.setItem('timegig_user_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.warn("Failed to write userProfile to localStorage", e);
    }
  }, [userProfile]);

  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [profileActiveTab, setProfileActiveTab] = useState<'profile' | 'history'>('profile');
  const [viewingUserProfile, setViewingUserProfile] = useState<any | null>(null);
  const [settingsActiveTab, setSettingsActiveTab] = useState<'general' | 'account'>('general');
  const [showAddActivityForm, setShowAddActivityForm] = useState<boolean>(false);
  const [newActivityTitle, setNewActivityTitle] = useState<string>('');
  const [newActivityCategory, setNewActivityCategory] = useState<'gig' | 'hire' | 'profile' | 'payment' | 'system' | 'custom'>('custom');
  const [newActivityDetails, setNewActivityDetails] = useState<string>('');

  // Helper to log user everyday activities into profile history
  const logEverydayActivity = (
    title: string,
    category: 'gig' | 'hire' | 'profile' | 'payment' | 'system' | 'custom',
    details: string,
    badge?: string
  ) => {
    const now = new Date();
    const dateFormatted = new Intl.DateTimeFormat('en-ZA', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(now);

    const newAct = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      category,
      timestamp: now.toISOString(),
      dateFormatted,
      details,
      badge
    };

    setUserProfile((prev: any) => ({
      ...prev,
      activityHistory: [newAct, ...(prev.activityHistory || [])]
    }));
  };

  // Seekers Board Filter & Search States
  const [selectedTradeFilter, setSelectedTradeFilter] = useState<string>('All Trades');
  const [seekerSearchQuery, setSeekerSearchQuery] = useState<string>('');

  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [showReviewPopup, setShowReviewPopup] = useState<boolean>(false);
  const [showBankTransferModal, setShowBankTransferModal] = useState<boolean>(false);
  const [showPopReviewPopup, setShowPopReviewPopup] = useState<boolean>(false);
  const [inspectingPopPayment, setInspectingPopPayment] = useState<boolean>(false);
  const [popContactSearch, setPopContactSearch] = useState<string>('');
  const [popStatusFilter, setPopStatusFilter] = useState<'all' | 'under_review' | 'paid' | 'unpaid'>('all');
  const [fullScreenMediaModal, setFullScreenMediaModal] = useState<{
    isOpen: boolean;
    title: string;
    logoUrl: string;
    popUrl: string;
    popName: string;
    userName: string;
    email: string;
    phone: string;
    activeTab: 'both' | 'logo' | 'pop';
  } | null>(null);
  const [uploadedPopName, setUploadedPopName] = useState<string>('');
  const [uploadedPopUrl, setUploadedPopUrl] = useState<string>('');
  const [isSubmittingPop, setIsSubmittingPop] = useState<boolean>(false);
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('timegig_sound_enabled');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  useEffect(() => {
    try {
      localStorage.setItem('timegig_sound_enabled', String(soundEnabled));
    } catch (e) {}
  }, [soundEnabled]);

  // Account Disabled state (persisted)
  const [isAccountDisabled, setIsAccountDisabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('timegig_account_disabled') === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('timegig_account_disabled', String(isAccountDisabled));
    } catch (e) {}
  }, [isAccountDisabled]);

  // Logged Out state (persisted)
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(() => {
    try {
      return localStorage.getItem('timegig_is_logged_out') === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('timegig_is_logged_out', String(isLoggedOut));
    } catch (e) {}
  }, [isLoggedOut]);

  const [showDisableConfirmModal, setShowDisableConfirmModal] = useState<boolean>(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);
  const [tenantSubTab, setTenantSubTab] = useState<'verification' | 'userpop'>('verification');
  const [inspectingApplicant, setInspectingApplicant] = useState<boolean>(false);

  // Tenant Banking Info & Subscription Fee Config (Persisted in localStorage)
  const [tenantBankDetails, setTenantBankDetails] = useState(() => {
    try {
      const saved = localStorage.getItem('timegig_tenant_bank_details');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to read tenantBankDetails from localStorage", e);
    }
    return {
      bankName: 'Global Community Bank',
      accountName: 'TimeGig Subscriptions',
      accountNumber: '9876-5432-1098-7654',
      swiftCode: 'TGGBZA22',
      referencePrefix: 'POP-',
      monthlyFeeRands: 180,
      monthlyFeeUsd: 9.99,
      tenantMonthlyFeeRands: 299.99,
      tenantMonthlyFeeUsd: 16.50,
      userMonthlyFeeRands: 180,
      userMonthlyFeeUsd: 9.99
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('timegig_tenant_bank_details', JSON.stringify(tenantBankDetails));
    } catch (e) {
      console.warn("Failed to write tenantBankDetails to localStorage", e);
    }
  }, [tenantBankDetails]);

  // Persistent Gigs Profit Tracking State
  const [totalGigsProfitRands, setTotalGigsProfitRands] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('timegig_total_gigs_profit_rands');
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 1450.00;
  });

  const [completedGigsCount, setCompletedGigsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('timegig_completed_gigs_count');
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 5;
  });

  useEffect(() => {
    try {
      localStorage.setItem('timegig_total_gigs_profit_rands', String(totalGigsProfitRands));
    } catch (e) {}
  }, [totalGigsProfitRands]);

  useEffect(() => {
    try {
      localStorage.setItem('timegig_completed_gigs_count', String(completedGigsCount));
    } catch (e) {}
  }, [completedGigsCount]);

  const [showTenantOverviewModal, setShowTenantOverviewModal] = useState<boolean>(false);
  const [showTeamInviteModal, setShowTeamInviteModal] = useState<boolean>(false);
  const [teamInvitesCount, setTeamInvitesCount] = useState<number>(0);
  const [showTenantSubfeeModal, setShowTenantSubfeeModal] = useState<boolean>(false);
  const [showTenantActivitiesModal, setShowTenantActivitiesModal] = useState<boolean>(false);
  const [savedTenantProfit, setSavedTenantProfit] = useState(() => {
    try {
      const saved = localStorage.getItem('timegig_saved_tenant_profit');
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 15250.00;
  });
  const [currentProfitBalance, setCurrentProfitBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('timegig_current_profit_balance');
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return (tenantBankDetails.tenantMonthlyFeeRands || 299.99) * 85;
  });

  useEffect(() => {
    try {
      localStorage.setItem('timegig_saved_tenant_profit', String(savedTenantProfit));
    } catch (e) {}
  }, [savedTenantProfit]);

  useEffect(() => {
    try {
      localStorage.setItem('timegig_current_profit_balance', String(currentProfitBalance));
    } catch (e) {}
  }, [currentProfitBalance]);

  // Subfee form editing states (Admin can change both tenant and user subscription fees)
  const [editTenantFeeRands, setEditTenantFeeRands] = useState<number>(tenantBankDetails.tenantMonthlyFeeRands || 299.99);
  const [editTenantFeeUsd, setEditTenantFeeUsd] = useState<number>(tenantBankDetails.tenantMonthlyFeeUsd || 16.50);
  const [editUserFeeRands, setEditUserFeeRands] = useState<number>(tenantBankDetails.userMonthlyFeeRands || tenantBankDetails.monthlyFeeRands || 180);
  const [editUserFeeUsd, setEditUserFeeUsd] = useState<number>(tenantBankDetails.userMonthlyFeeUsd || tenantBankDetails.monthlyFeeUsd || 9.99);
  const [editBankName, setEditBankName] = useState<string>(tenantBankDetails.bankName);
  const [editAccountName, setEditAccountName] = useState<string>(tenantBankDetails.accountName);
  const [editAccountNumber, setEditAccountNumber] = useState<string>(tenantBankDetails.accountNumber);
  const [editSwiftCode, setEditSwiftCode] = useState<string>(tenantBankDetails.swiftCode);
  const [editRefPrefix, setEditRefPrefix] = useState<string>(tenantBankDetails.referencePrefix);
  const [isSavingSubfee, setIsSavingSubfee] = useState<boolean>(false);

  // Save Tenant & User Subfee and Banking Configuration
  const handleSaveSubfeeSettings = () => {
    setIsSavingSubfee(true);
    playReviewChime();
    setTimeout(() => {
      const updated = {
        bankName: editBankName.trim() || 'Global Community Bank',
        accountName: editAccountName.trim() || 'TimeGig Subscriptions',
        accountNumber: editAccountNumber.trim() || '9876-5432-1098-7654',
        swiftCode: editSwiftCode.trim() || 'TGGBZA22',
        referencePrefix: editRefPrefix.trim() || 'POP-',
        tenantMonthlyFeeRands: Number(editTenantFeeRands) > 0 ? Number(editTenantFeeRands) : 299.99,
        tenantMonthlyFeeUsd: Number(editTenantFeeUsd) > 0 ? Number(editTenantFeeUsd) : 16.50,
        userMonthlyFeeRands: Number(editUserFeeRands) > 0 ? Number(editUserFeeRands) : 180,
        userMonthlyFeeUsd: Number(editUserFeeUsd) > 0 ? Number(editUserFeeUsd) : 9.99,
        monthlyFeeRands: Number(editUserFeeRands) > 0 ? Number(editUserFeeRands) : 180,
        monthlyFeeUsd: Number(editUserFeeUsd) > 0 ? Number(editUserFeeUsd) : 9.99
      };
      setTenantBankDetails(updated);
      setIsSavingSubfee(false);
      setShowTenantSubfeeModal(false);
    }, 600);
  };
  const [editFirstName, setEditFirstName] = useState(userProfile.firstName);
  const [editMiddleName, setEditMiddleName] = useState(userProfile.middleName);
  const [editSurname, setEditSurname] = useState(userProfile.surname);
  const [editDob, setEditDob] = useState(userProfile.dob);
  const [editContactNumber, setEditContactNumber] = useState(userProfile.contactNumber);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editAddress, setEditAddress] = useState(userProfile.address);
  const [editAvatarUrl, setEditAvatarUrl] = useState(userProfile.avatarUrl);
  const [editIdDocName, setEditIdDocName] = useState(userProfile.idDocumentName);
  const [editIdDocUrl, setEditIdDocUrl] = useState(userProfile.idDocumentUrl);
  const [editSocialLinks, setEditSocialLinks] = useState(userProfile.socialLinks);
  const [editSeekerTradeType, setEditSeekerTradeType] = useState<string>(userProfile.seekerTradeType || 'Electrician');
  const [editSeekerTradeCustom, setEditSeekerTradeCustom] = useState<string>(userProfile.seekerTradeCustom || '');
  const [editSeekerTradeExperienceYears, setEditSeekerTradeExperienceYears] = useState<string>(userProfile.seekerTradeExperienceYears || '3-5 Years');
  const [editSeekerHourlyRate, setEditSeekerHourlyRate] = useState<string>(userProfile.seekerHourlyRate || 'R 250/hr');
  const [editSeekerBioSummary, setEditSeekerBioSummary] = useState<string>(userProfile.seekerBioSummary || '');
  const [editSeekerWorkExperiences, setEditSeekerWorkExperiences] = useState<any[]>(
    userProfile.seekerWorkExperiences || [
      {
        id: 'exp-1',
        companyOrProject: 'Apex Electrical Solutions',
        roleTitle: 'Residential & Commercial Electrician',
        duration: '2022 - 2025',
        description: 'Wiring installations, circuit breaker maintenance, fault finding and issuing certificates of compliance.'
      }
    ]
  );
  const [isSubmittingProfile, setIsSubmittingProfile] = useState<boolean>(false);

  // Add new Work Experience item
  const addWorkExperience = () => {
    setEditSeekerWorkExperiences(prev => [
      ...prev,
      {
        id: 'exp-' + Date.now(),
        companyOrProject: '',
        roleTitle: '',
        duration: '',
        description: ''
      }
    ]);
  };

  // Remove Work Experience item
  const removeWorkExperience = (id: string) => {
    setEditSeekerWorkExperiences(prev => prev.filter(item => item.id !== id));
  };

  // Update specific field in Work Experience item
  const updateWorkExperience = (id: string, field: string, value: string) => {
    setEditSeekerWorkExperiences(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Helper to construct full display name
  const getFullName = (profile: typeof userProfile) => {
    return [profile.firstName, profile.middleName, profile.surname].filter(Boolean).join(' ') || 'Explorer';
  };

  // Face Photo File Upload Handler (Restricted to once every 30 days)
  const handleFacePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lockStatus = getAvatarChangeLockStatus();
    if (lockStatus.isLocked) {
      alert(`Profile picture is locked. You can change your avatar once every 30 days. Next change available in ${lockStatus.daysRemaining} days.`);
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ID Document File Upload Handler
  const handleIdDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditIdDocName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditIdDocUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new Social Media link
  const addSocialLink = () => {
    setEditSocialLinks((prev: any[]) => [
      ...prev,
      { id: Date.now().toString(), platform: 'LinkedIn', url: '' }
    ]);
  };

  // Remove Social Media link
  const removeSocialLink = (id: string) => {
    setEditSocialLinks((prev: any[]) => prev.filter((item: any) => item.id !== id));
  };

  // Play audio chime when review submission succeeds
  const playReviewChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.15);
      gain2.gain.setValueAtTime(0.2, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.7);
    } catch (err) {
      console.warn("Chime sound error:", err);
    }
  };

  // Submit or Save Profile Changes
  const submitProfileForReview = () => {
    setIsSubmittingProfile(true);
    playReviewChime();

    const isNewAvatar = editAvatarUrl !== userProfile.avatarUrl;
    const newAvatarDate = isNewAvatar ? new Date().toISOString() : (userProfile.lastAvatarChangeDate || '');

    setTimeout(() => {
      setIsSubmittingProfile(false);
      setUserProfile((prev: any) => ({
        ...prev,
        firstName: editFirstName.trim() || 'Explorer',
        middleName: editMiddleName.trim(),
        surname: editSurname.trim(),
        dob: editDob,
        contactNumber: editContactNumber.trim(),
        email: editEmail.trim(),
        address: editAddress.trim() || userAddress || '',
        avatarUrl: editAvatarUrl,
        idDocumentName: editIdDocName,
        idDocumentUrl: editIdDocUrl,
        socialLinks: editSocialLinks.filter((l: any) => l.url.trim() !== ''),
        seekerTradeType: editSeekerTradeType,
        seekerTradeCustom: editSeekerTradeCustom.trim(),
        seekerTradeExperienceYears: editSeekerTradeExperienceYears,
        seekerHourlyRate: editSeekerHourlyRate.trim(),
        seekerBioSummary: editSeekerBioSummary.trim(),
        seekerWorkExperiences: editSeekerWorkExperiences.filter((e: any) => e.companyOrProject.trim() !== '' || e.roleTitle.trim() !== ''),
        verificationStatus: prev.verificationStatus === 'verified' ? 'verified' : 'under_review',
        lastAvatarChangeDate: newAvatarDate
      }));
      
      setIsEditingProfile(false);
      if (userProfile.verificationStatus !== 'verified') {
        setShowProfileModal(false);
        setShowReviewPopup(true);
      }
    }, 1200);
  };

  // Proof of Payment File Upload Handler
  const handlePopFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedPopName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUploadedPopUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Proof of Payment Handler
  const submitProofOfPayment = () => {
    if (!uploadedPopUrl) {
      alert("Please select and upload your Proof of Payment file from your device first.");
      return;
    }
    setIsSubmittingPop(true);
    playReviewChime();

    setTimeout(() => {
      setIsSubmittingPop(false);
      setUserProfile((prev: any) => ({
        ...prev,
        paymentStatus: 'under_review',
        popDocumentName: uploadedPopName,
        popDocumentUrl: uploadedPopUrl,
        popSubmittedAt: new Date().toISOString()
      }));
      setShowBankTransferModal(false);
      setShowPopReviewPopup(true);
    }, 1200);
  };

  // Address and Interaction States
  const [userAddress, setUserAddress] = useState<string>('');
  const [userSuburb, setUserSuburb] = useState<string>('');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);
  const [clickedPos, setClickedPos] = useState<[number, number] | null>(null);
  const [clickedAddress, setClickedAddress] = useState<string>('');
  const [isGeocodingClicked, setIsGeocodingClicked] = useState<boolean>(false);

  // Helper to extract clean location / suburb from user geocoding or profile
  const getUserLocationOrSuburb = () => {
    if (userSuburb) return userSuburb;
    if (userAddress) {
      const parts = userAddress.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (parts.length >= 3) {
        return parts.slice(1, 3).join(', ');
      }
      return userAddress;
    }
    if (userProfile.address) {
      const parts = String(userProfile.address).split(',').map((s: string) => s.trim()).filter(Boolean);
      if (parts.length >= 2) return parts.slice(0, 2).join(', ');
      return userProfile.address;
    }
    return 'Sandton, Johannesburg';
  };

  // Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(true);

  // Map settings & Routing
  const [activeTheme, setActiveTheme] = useState<typeof MAP_THEMES[0]>(MAP_THEMES[0]);
  const [showThemePanel, setShowThemePanel] = useState<boolean>(false);
  const [flyToTrigger, setFlyToTrigger] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [zoomTrigger, setZoomTrigger] = useState<number>(0);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [routeDetails, setRouteDetails] = useState<{ distance: string; duration: string } | null>(null);

  // Calculate driving navigation route from user position to destination
  const calculateRouteTo = async (destLat: number, destLng: number) => {
    if (!isValidCoordinate(destLat, destLng)) return;

    if (!userPos || !isValidCoordinate(userPos[0], userPos[1])) {
      setRoutePoints([]);
      setRouteDetails(null);
      return;
    }

    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userPos[1]},${userPos[0]};${destLng},${destLat}?overview=full&geometries=geojson`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords: [number, number][] = route.geometry.coordinates.map((pt: [number, number]) => [pt[1], pt[0]]);
          setRoutePoints(coords);
          
          const distKm = (route.distance / 1000).toFixed(1);
          const durMin = Math.round(route.duration / 60);
          setRouteDetails({
            distance: `${distKm} km`,
            duration: `${durMin} min`
          });
          return;
        }
      }
    } catch (err) {
      console.warn("OSRM routing failed, drawing direct path...", err);
    }

    // Straight line fallback
    setRoutePoints([userPos, [destLat, destLng]]);
    const dx = destLat - userPos[0];
    const dy = destLng - userPos[1];
    const estDist = (Math.sqrt(dx * dx + dy * dy) * 111).toFixed(1);
    setRouteDetails({ distance: `~${estDist} km`, duration: 'Direct Route' });
  };

  // Bottom Menu Feature State & Scroll Ref
  type BottomTab = 'seekers' | 'gigs' | 'tenant' | 'admin' | 'profile' | 'settings' | null;
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTab>(null);
  const [seekerAppearOnMap, setSeekerAppearOnMap] = useState<boolean>(false);
  const [tenantIsActive, setTenantIsActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('timegig_tenant_is_active');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return true;
  });
  const [showTenantActivationModal, setShowTenantActivationModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('timegig_tenant_is_active', JSON.stringify(tenantIsActive));
    } catch (e) {}
  }, [tenantIsActive]);

  const menuScrollRef = useRef<HTMLDivElement>(null);

  // Helper to calculate approximate distance from user GPS
  const calculateDistanceText = (lat: number, lng: number) => {
    if (!userPos || !isValidCoordinate(userPos[0], userPos[1])) return 'Nearby Area';
    const R = 6371; // km
    const dLat = (lat - userPos[0]) * Math.PI / 180;
    const dLon = (lng - userPos[1]) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userPos[0] * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    if (d < 1) return `${Math.max(120, Math.round(d * 1000))} m away`;
    return `${d.toFixed(1)} km away`;
  };

  // Feature listings state (Populated with verified registered trade seekers)
  const [businessesListings, setBusinessesListings] = useState([
    {
      id: 'b1',
      name: 'Sandton Electrical Supplies',
      category: 'Electrician',
      rating: '4.8',
      reviews: 120,
      lat: 20.005,
      lng: 0.015,
      avatar: 'https://images.unsplash.com/photo-1581092160607-ee2253139366?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'b2',
      name: 'Vance Plumbing Services',
      category: 'Plumber',
      rating: '4.7',
      reviews: 85,
      lat: 20.015,
      lng: 0.025,
      avatar: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=150&auto=format&fit=crop&q=80'
    }
  ]);
  const [seekersListings, setSeekersListings] = useState([
    {
      id: 's1',
      name: 'Thabo Khumalo',
      role: 'Master Electrician & DB Specialist',
      trade: 'Electrician',
      hourly: 'R 280/hr',
      rating: '4.9',
      reviews: 42,
      contact: '+27 (0) 82 456 7890',
      lat: 20.006,
      lng: 0.012,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    {
      id: 's2',
      name: 'Nadia Adams',
      role: 'Certified Plumber & Sanitation',
      trade: 'Plumber',
      hourly: 'R 250/hr',
      rating: '4.8',
      reviews: 36,
      contact: '+27 (0) 71 345 6789',
      lat: 19.994,
      lng: -0.009,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    {
      id: 's3',
      name: 'Johan van Zyl',
      role: 'Solar & Power Backup Installer',
      trade: 'Solar Technician',
      hourly: 'R 320/hr',
      rating: '5.0',
      reviews: 58,
      contact: '+27 (0) 83 987 6543',
      lat: 20.015,
      lng: -0.014,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    {
      id: 's4',
      name: 'Bongani Sithole',
      role: 'General Handyman & Maintenance',
      trade: 'Handyman',
      hourly: 'R 200/hr',
      rating: '4.7',
      reviews: 29,
      contact: '+27 (0) 76 543 2109',
      lat: 19.988,
      lng: 0.021,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    {
      id: 's5',
      name: 'Siphiwe Dlamini',
      role: 'Structural Welder & Gate Fabricator',
      trade: 'Welder',
      hourly: 'R 310/hr',
      rating: '4.9',
      reviews: 24,
      contact: '+27 (0) 78 654 3210',
      lat: 20.009,
      lng: -0.005,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    {
      id: 's6',
      name: 'Kevin Naidoo',
      role: 'Master Carpenter & Built-in Cupboards',
      trade: 'Carpenter',
      hourly: 'R 290/hr',
      rating: '4.8',
      reviews: 47,
      contact: '+27 (0) 84 321 0987',
      lat: 19.998,
      lng: 0.018,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    {
      id: 's7',
      name: 'Naledi Mokoena',
      role: 'Professional Painter & Waterproofing',
      trade: 'Painter',
      hourly: 'R 220/hr',
      rating: '4.9',
      reviews: 31,
      contact: '+27 (0) 72 109 8765',
      lat: 20.012,
      lng: 0.008,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    {
      id: 's8',
      name: 'Tariro Moyo',
      role: 'HVAC, Refrigeration & Cold Room Tech',
      trade: 'HVAC',
      hourly: 'R 340/hr',
      rating: '5.0',
      reviews: 52,
      contact: '+27 (0) 81 234 5678',
      lat: 19.991,
      lng: -0.019,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    }
  ]);

  // Adjust seekers dynamically relative to user GPS location whenever userPos is known
  useEffect(() => {
    if (userPos && isValidCoordinate(userPos[0], userPos[1])) {
      setSeekersListings(prev => [
        { ...prev[0], lat: Number((userPos[0] + 0.006).toFixed(5)), lng: Number((userPos[1] + 0.005).toFixed(5)) },
        { ...prev[1], lat: Number((userPos[0] - 0.005).toFixed(5)), lng: Number((userPos[1] - 0.006).toFixed(5)) },
        { ...prev[2], lat: Number((userPos[0] + 0.004).toFixed(5)), lng: Number((userPos[1] - 0.007).toFixed(5)) },
        { ...prev[3], lat: Number((userPos[0] - 0.006).toFixed(5)), lng: Number((userPos[1] + 0.004).toFixed(5)) },
        { ...prev[4], lat: Number((userPos[0] + 0.008).toFixed(5)), lng: Number((userPos[1] - 0.002).toFixed(5)) },
        { ...prev[5], lat: Number((userPos[0] - 0.003).toFixed(5)), lng: Number((userPos[1] + 0.009).toFixed(5)) },
        { ...prev[6], lat: Number((userPos[0] + 0.002).toFixed(5)), lng: Number((userPos[1] + 0.008).toFixed(5)) },
        { ...prev[7], lat: Number((userPos[0] - 0.007).toFixed(5)), lng: Number((userPos[1] - 0.008).toFixed(5)) }
      ]);
    }
  }, [userPos]);

  // Lady Voice Speech Synthesis Helper (Web Speech API)
  const speakLadyVoice = (text: string) => {
    if (!soundEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      const femaleVoice = voices.find(v =>
        v.lang.startsWith('en') && (
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('google uk english female') ||
          v.name.toLowerCase().includes('google us english') ||
          v.name.toLowerCase().includes('serena') ||
          v.name.toLowerCase().includes('susan') ||
          v.name.toLowerCase().includes('moira')
        )
      ) || voices.find(v => v.lang.startsWith('en'));

      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.pitch = 1.18; // Pleasant and clear female voice
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error", err);
    }
  };

  // Active Gig & Hiring State Interface
  interface ActiveGigSession {
    seekerId: string;
    seekerName: string;
    seekerAvatar: string;
    seekerTrade: string;
    seekerRate: string;
    seekerContact: string;
    seekerOrigin: [number, number];
    seekerCurrentPos: [number, number];
    userTargetPos: [number, number];
    status: 'requesting' | 'guiding' | 'arrived' | 'completed' | 'declined';
    countdown: number; // 60s countdown
    route: [number, number][];
    routeIndex: number;
    distance: string;
    eta: string;
    startTime: number;
    elapsedSeconds: number;
    rating: number;
  }

  const [activeGigSession, setActiveGigSession] = useState<ActiveGigSession | null>(null);
  const [showGigSummaryModal, setShowGigSummaryModal] = useState<boolean>(false);
  const [lastCompletedGig, setLastCompletedGig] = useState<ActiveGigSession | null>(null);

  // Start Hiring Seeker Flow (Opens 60-Second Circular Countdown Loading)
  const startHiringFlow = (seeker: any) => {
    playReviewChime();
    const userDest: [number, number] = userPos && isValidCoordinate(userPos[0], userPos[1])
      ? userPos
      : [seeker.lat - 0.004, seeker.lng - 0.003];

    setActiveGigSession({
      seekerId: seeker.id || 's1',
      seekerName: seeker.name || 'Trade Seeker',
      seekerAvatar: seeker.avatar || '',
      seekerTrade: seeker.trade || seeker.role || 'Specialist',
      seekerRate: seeker.hourly || 'R 250/hr',
      seekerContact: seeker.contact || '+27 71 000 0000',
      seekerOrigin: [seeker.lat, seeker.lng],
      seekerCurrentPos: [seeker.lat, seeker.lng],
      userTargetPos: userDest,
      status: 'requesting',
      countdown: 60,
      route: [],
      routeIndex: 0,
      distance: 'Calculating...',
      eta: 'Calculating...',
      startTime: Date.now(),
      elapsedSeconds: 0,
      rating: 5
    });
  };

  // Function called when Seeker Accepts Gig Request
  const acceptGigBySeeker = async () => {
    if (!activeGigSession) return;

    // 1. Lady voice announcement: "Start gig."
    speakLadyVoice("Start gig.");
    playReviewChime();

    const origin = activeGigSession.seekerOrigin;
    const dest = activeGigSession.userTargetPos;

    // Compute route points
    let points: [number, number][] = [];
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const coords: [number, number][] = data.routes[0].geometry.coordinates.map((pt: [number, number]) => [pt[1], pt[0]]);
          if (coords.length > 1) {
            points = coords;
          }
        }
      }
    } catch (e) {
      console.warn("OSRM routing fallback", e);
    }

    if (points.length < 2) {
      for (let i = 0; i <= 14; i++) {
        const t = i / 14;
        points.push([
          origin[0] + (dest[0] - origin[0]) * t,
          origin[1] + (dest[1] - origin[1]) * t
        ]);
      }
    }

    setRoutePoints(points);
    setRouteDetails({ distance: '1.2 km', duration: '3 mins' });

    setActiveGigSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'guiding',
        route: points,
        routeIndex: 0,
        distance: '1.2 km',
        eta: '3 mins',
        startTime: Date.now()
      };
    });

    setFlyToTrigger({
      lat: (origin[0] + dest[0]) / 2,
      lng: (origin[1] + dest[1]) / 2,
      zoom: 15
    });
  };

  // 1. 60-Second Circular Countdown Timer during 'requesting'
  useEffect(() => {
    if (!activeGigSession || activeGigSession.status !== 'requesting') return;

    const interval = setInterval(() => {
      setActiveGigSession(prev => {
        if (!prev || prev.status !== 'requesting') return prev;
        if (prev.countdown <= 1) {
          clearInterval(interval);
          alert("Seeker request timed out after 60 seconds.");
          return null;
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);

    // Simulated acceptance after ~4.5 seconds for instant delightful testing
    const autoAcceptTimer = setTimeout(() => {
      acceptGigBySeeker();
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(autoAcceptTimer);
    };
  }, [activeGigSession?.status]);

  // 2. Seeker Movement along Route during 'guiding'
  useEffect(() => {
    if (!activeGigSession || activeGigSession.status !== 'guiding' || !activeGigSession.route.length) return;

    const moveInterval = setInterval(() => {
      setActiveGigSession(prev => {
        if (!prev || prev.status !== 'guiding') return prev;
        const nextIndex = prev.routeIndex + 1;

        if (nextIndex >= prev.route.length) {
          clearInterval(moveInterval);
          // ARRIVED AT GIG!
          speakLadyVoice("Arrived at gig.");
          playReviewChime();

          return {
            ...prev,
            status: 'arrived',
            seekerCurrentPos: prev.userTargetPos,
            routeIndex: prev.route.length - 1
          };
        }

        const currentCoord = prev.route[nextIndex];
        const remainingPct = 1 - (nextIndex / prev.route.length);
        const remDist = (remainingPct * 1.2).toFixed(1);
        const remMins = Math.max(1, Math.ceil(remainingPct * 3));

        return {
          ...prev,
          seekerCurrentPos: currentCoord,
          routeIndex: nextIndex,
          distance: `${remDist} km`,
          eta: `${remMins} min`
        };
      });
    }, 1200);

    return () => clearInterval(moveInterval);
  }, [activeGigSession?.status, activeGigSession?.route]);

  // 3. Gig Elapsed Time counter during 'arrived' (In Progress)
  useEffect(() => {
    if (!activeGigSession || activeGigSession.status !== 'arrived') return;
    const timer = setInterval(() => {
      setActiveGigSession(prev => prev ? { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 } : null);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeGigSession?.status]);

  // 4. User Only Action: Complete Gig
  const handleUserCompleteGig = () => {
    if (!activeGigSession) return;
    speakLadyVoice("Gig completed. Thank you!");
    playReviewChime();

    // Calculate gig profit amount from rate (e.g., 'R 280/hr' -> 280)
    const rateNum = parseFloat(activeGigSession.seekerRate.replace(/[^0-9.]/g, '')) || 250;
    setTotalGigsProfitRands(prev => prev + rateNum);
    setCompletedGigsCount(prev => prev + 1);

    setLastCompletedGig(activeGigSession);
    logEverydayActivity("Completed GiG Task", "gig", `Finished working on "${activeGigSession.seekerTrade}" for ${activeGigSession.seekerName}.`, `Earned ${activeGigSession.seekerRate}`);
    setShowGigSummaryModal(true);
    setActiveGigSession(null);
    setRoutePoints([]);
    setRouteDetails(null);
  };

  // Created GiGs List State (Persisted in localStorage)
  const [gigsListings, setGigsListings] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('timegig_created_gigs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'gig-1',
        title: 'Emergency: Faulty Circuit Breaker & DB Board',
        category: 'Electrician',
        rate: 'R 350/hr',
        description: 'Main tripping on DB board in kitchen and dining room. Needs urgent certified electrician inspection.',
        location: 'Sandton, Johannesburg',
        lat: 20.008,
        lng: 0.018,
        creatorName: 'Thabo Mokoena',
        creatorContact: '+27 (0) 82 345 6789',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        creatorId: 'user-thabo',
        createdAt: '1 hour ago',
        applicantsCount: 12,
        status: 'open'
      },
      {
        id: 'gig-2',
        title: 'Burst Geyser / Pipe Valve Replacement',
        category: 'Plumber',
        rate: 'R 400/hr',
        description: 'Hot water pipe leaking under kitchen counter. Requires copper pipe fitting replacement and pressure check.',
        location: 'Rosebank, Johannesburg',
        lat: 19.992,
        lng: -0.012,
        creatorName: 'Kagiso Ndlovu',
        creatorContact: '+27 (0) 79 123 4567',
        creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        creatorId: 'user-kagiso',
        createdAt: '3 hours ago',
        applicantsCount: 8,
        status: 'open'
      },
      {
        id: 'gig-3',
        title: 'Solar Inverter Backup Battery Installation',
        category: 'Solar & Backup Power',
        rate: 'R 550/hr',
        description: 'Need certified technician to connect 5kW Deye inverter to 10kWh lithium battery bank with changeover switch.',
        location: 'Centurion, Pretoria',
        lat: 20.018,
        lng: -0.015,
        creatorName: 'Annelize Marais',
        creatorContact: '+27 (0) 83 765 4321',
        creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        creatorId: 'user-annelize',
        createdAt: 'Yesterday',
        applicantsCount: 15,
        status: 'open'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('timegig_created_gigs', JSON.stringify(gigsListings));
    } catch (e) {}
  }, [gigsListings]);

  // Adjust open sample gigs relative to user GPS location
  useEffect(() => {
    if (userPos && isValidCoordinate(userPos[0], userPos[1])) {
      setGigsListings(prev => {
        return prev.map((gig, idx) => {
          if (gig.creatorId === 'me') return gig;
          const offsetLat = idx === 0 ? 0.007 : idx === 1 ? -0.006 : 0.005;
          const offsetLng = idx === 0 ? 0.008 : idx === 1 ? -0.007 : -0.008;
          return {
            ...gig,
            lat: Number((userPos[0] + offsetLat).toFixed(5)),
            lng: Number((userPos[1] + offsetLng).toFixed(5))
          };
        });
      });
    }
  }, [userPos]);

  // Cleanup expired gigs every minute
  useEffect(() => {
    const checkExpiry = () => {
      const now = new Date();
      setGigsListings(prev => {
        const filtered = prev.filter(gig => {
          if (!gig.expiryAt) return true;
          return new Date(gig.expiryAt) > now;
        });
        if (filtered.length !== prev.length) return filtered;
        return prev;
      });
    };
    const timer = setInterval(checkExpiry, 60000);
    checkExpiry();
    return () => clearInterval(timer);
  }, []);

  // Create GiG modal & form states
  const [showCreateGigModal, setShowCreateGigModal] = useState<boolean>(false);
  const [newGigTitle, setNewGigTitle] = useState<string>('');
  const [newGigCategory, setNewGigCategory] = useState<string>('Electrician');
  const [newGigRate, setNewGigRate] = useState<string>('R 350/hr');
  const [newGigDescription, setNewGigDescription] = useState<string>('');
  const [newGigLocation, setNewGigLocation] = useState<string>('');
  const [newGigContact, setNewGigContact] = useState<string>('');
  const [newGigExpiryAt, setNewGigExpiryAt] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [isPublishingGig, setIsPublishingGig] = useState<boolean>(false);
  const [autoAddUserLocation, setAutoAddUserLocation] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('timegig_auto_add_gig_location');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });
  const [isDetectingGigLocation, setIsDetectingGigLocation] = useState<boolean>(false);

  // Automatically detect and fill user's Location / Suburb
  const handleAutoFillLocation = () => {
    setIsDetectingGigLocation(true);
    playReviewChime();
    locateUser();
    setTimeout(() => {
      const loc = getUserLocationOrSuburb();
      setNewGigLocation(loc);
      setIsDetectingGigLocation(false);
      speakLadyVoice("Location added.");
    }, 500);
  };

  // Open Create GiG Modal with auto-added location
  const openCreateGigModal = () => {
    setShowCreateGigModal(true);
    if (autoAddUserLocation) {
      const loc = getUserLocationOrSuburb();
      if (loc) {
        setNewGigLocation(loc);
      } else {
        locateUser();
      }
    }
  };

  // Keep location pre-filled when auto-add is active
  useEffect(() => {
    if (showCreateGigModal && autoAddUserLocation && !newGigLocation) {
      const loc = getUserLocationOrSuburb();
      if (loc) setNewGigLocation(loc);
    }
  }, [showCreateGigModal, autoAddUserLocation, userAddress, userSuburb]);

  // Publish New GiG Handler
  const handlePublishNewGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGigTitle.trim()) {
      alert("Please provide a title for your GiG.");
      return;
    }
    setIsPublishingGig(true);
    playReviewChime();

    setTimeout(() => {
      const gigLat = userPos && isValidCoordinate(userPos[0], userPos[1]) ? userPos[0] : 20.005;
      const gigLng = userPos && isValidCoordinate(userPos[0], userPos[1]) ? userPos[1] : 0.005;

      const detectedLoc = getUserLocationOrSuburb();
      const gigLocationFinal = newGigLocation.trim() || (autoAddUserLocation ? detectedLoc : '') || userAddress || 'Sandton, Johannesburg';

      const createdGig = {
        id: `gig-user-${Date.now()}`,
        title: newGigTitle.trim(),
        category: newGigCategory,
        rate: newGigRate.trim() || 'R 300/hr',
        description: newGigDescription.trim() || 'General trade task requiring assistance.',
        location: gigLocationFinal,
        lat: Number(gigLat.toFixed(5)),
        lng: Number(gigLng.toFixed(5)),
        creatorName: getFullName(userProfile),
        creatorContact: newGigContact.trim() || userProfile.contactNumber || '+27 71 000 0000',
        creatorAvatar: userProfile.avatarUrl || '',
        creatorId: 'me',
        createdAt: 'Just now',
        expiryAt: newGigExpiryAt || '', // Set by user
        applicantsCount: Math.floor(Math.random() * 3), // Initial mock count
        status: 'open'
      };

      setGigsListings(prev => [createdGig, ...prev]);
      logEverydayActivity("Posted New GiG", "gig", `Published "${newGigTitle}" for ${newGigCategory} category.`, "New Post");
      setIsPublishingGig(false);
      setShowCreateGigModal(false);
      speakLadyVoice("GiG posted successfully. Seekers can now apply.");

      // Reset form
      setNewGigTitle('');
      setNewGigDescription('');
    }, 600);
  };

  // Apply to GiG (Uses exact same interactive flow as Seekers feature)
  const applyToGig = (gig: any) => {
    playReviewChime();
    const userDest: [number, number] = [gig.lat, gig.lng];

    setActiveGigSession({
      seekerId: gig.id,
      seekerName: gig.creatorName,
      seekerAvatar: gig.creatorAvatar,
      seekerTrade: `${gig.category} GiG: ${gig.title}`,
      seekerRate: gig.rate,
      seekerContact: gig.creatorContact,
      seekerOrigin: userPos && isValidCoordinate(userPos[0], userPos[1]) ? userPos : [gig.lat - 0.005, gig.lng - 0.004],
      seekerCurrentPos: userPos && isValidCoordinate(userPos[0], userPos[1]) ? userPos : [gig.lat - 0.005, gig.lng - 0.004],
      userTargetPos: userDest,
      status: 'requesting',
      countdown: 60,
      route: [],
      routeIndex: 0,
      distance: 'Calculating...',
      eta: 'Calculating...',
      startTime: Date.now(),
      elapsedSeconds: 0,
      rating: 5
    });

    setActiveBottomTab(null);
  };

  // Cancel GiG with Reason Flow (Both User & GiG Creator can cancel, reason sent to each other)
  const [showCancelGigModal, setShowCancelGigModal] = useState<boolean>(false);
  const [cancelParty, setCancelParty] = useState<'user' | 'creator'>('user');
  const [cancelingGigItem, setCancelingGigItem] = useState<any | null>(null);
  const [cancelReasonPreset, setCancelReasonPreset] = useState<string>('Emergency / Schedule conflict');
  const [cancelCustomReason, setCancelCustomReason] = useState<string>('');
  const [gigCancellationNotice, setGigCancellationNotice] = useState<{
    canceledBy: string;
    targetParty: string;
    reason: string;
    gigTitle: string;
    timestamp: string;
  } | null>(null);

  const handleConfirmCancelGig = () => {
    const finalReason = cancelCustomReason.trim() || cancelReasonPreset;
    if (!finalReason) {
      alert("Please provide a reason for canceling the GiG.");
      return;
    }

    const title = cancelingGigItem?.title || activeGigSession?.seekerTrade || 'Active GiG';
    const canceledByLabel = cancelParty === 'user' ? 'Applicant / Seeker' : 'GiG Creator / Employer';
    const targetPartyLabel = cancelParty === 'user' ? 'GiG Creator / Employer' : 'Applicant / Seeker';

    speakLadyVoice("Gig canceled.");
    playReviewChime();

    // If gig creator canceled an existing listing, remove it from open listings
    if (cancelingGigItem) {
      setGigsListings(prev => prev.filter(g => g.id !== cancelingGigItem.id));
    }

    setGigCancellationNotice({
      canceledBy: canceledByLabel,
      targetParty: targetPartyLabel,
      reason: finalReason,
      gigTitle: title,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setActiveGigSession(null);
    setRoutePoints([]);
    setRouteDetails(null);
    setShowCancelGigModal(false);
    setCancelCustomReason('');
    setCancelingGigItem(null);
  };
  const [tenantListings, setTenantListings] = useState([
    {
      id: 't1',
      name: 'Samantha Vance',
      title: 'Luxury 2-Bed Apartment in Sandton',
      price: 'R 12,500/mo',
      location: 'Sandton, Johannesburg',
      lat: 20.01,
      lng: 0.02,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      subscriptionPlan: 'R299.99/mo Active',
      totalUsers: 38,
      isActive: true
    },
    {
      id: 't2',
      name: 'David Mabaso',
      title: 'Modern Studio Loft in Rosebank',
      price: 'R 8,500/mo',
      location: 'Rosebank, Johannesburg',
      lat: 19.99,
      lng: -0.01,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      subscriptionPlan: 'R299.99/mo Active',
      totalUsers: 24,
      isActive: true
    },
    {
      id: 't3',
      name: 'Lerato Khumalo',
      title: 'Spacious 3-Bed Family Home',
      price: 'R 18,000/mo',
      location: 'Green Point, Cape Town',
      lat: 20.02,
      lng: -0.03,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      subscriptionPlan: 'R299.99/mo Active',
      totalUsers: 45,
      isActive: true
    },
    {
      id: 't4',
      name: 'Sipho Ndlovu',
      title: 'Executive High-Rise Suite',
      price: 'R 14,000/mo',
      location: 'Menlyn, Pretoria',
      lat: 20.03,
      lng: 0.01,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      subscriptionPlan: 'R299.99/mo Active',
      totalUsers: 19,
      isActive: true
    },
    {
      id: 't5',
      name: 'Keisha Petersen',
      title: 'Oceanfront Luxury Studio',
      price: 'R 11,200/mo',
      location: 'Umhlanga, Durban',
      lat: 19.98,
      lng: 0.03,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      subscriptionPlan: 'R299.99/mo Active',
      totalUsers: 31,
      isActive: true
    }
  ]);

  // Toggle tenant active / unactive status handler
  const toggleTenantActive = (tenantId: string) => {
    playReviewChime();
    setTenantListings(prev =>
      prev.map(tenant => {
        if (tenant.id === tenantId) {
          const nextActive = !tenant.isActive;
          return {
            ...tenant,
            isActive: nextActive,
            subscriptionPlan: nextActive ? 'R299.99/mo Active' : 'Unactive'
          };
        }
        return tenant;
      })
    );
  };

  // Pending verification and POP counts for tenant notification badges
  const pendingVerificationCount = userProfile.verificationStatus === 'under_review' ? 1 : 0;
  const pendingPopCount = userProfile.paymentStatus === 'under_review' ? 1 : 0;

  // Direct user straight to exact location on map
  const handleLocationButtonClick = () => {
    setShowPinpointer(true);
    setAutoCenter(true);
    setClickedPos(null);
    setClickedAddress('');
    setRoutePoints([]);
    setRouteDetails(null);
    locateUser();
    if (userPos && isValidCoordinate(userPos[0], userPos[1])) {
      setFlyToTrigger({ lat: userPos[0], lng: userPos[1], zoom: 17 });
    }
  };

  // Search input element reference for focus/unfocus behaviour
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fallback to IP Geolocation if browser GPS permissions are denied or fail
  const fallbackToIp = async (reason: string) => {
    // Attempt 1: GeoJS
    try {
      const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
      if (response.ok) {
        const data = await response.json();
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        if (isValidCoordinate(lat, lng)) {
          setUserPos([lat, lng]);
          setAccuracy(15000);
          setGeoState('found');
          setShowPinpointer(true);
          setFlyToTrigger({ lat, lng, zoom: 11 });
          setUserAddress(
            [data.city, data.region, data.country].filter(Boolean).join(', ')
          );
          return;
        }
      }
    } catch (err) {
      console.warn("GeoJS IP lookup failed", err);
    }

    // Attempt 2: ipapi.co
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        if (isValidCoordinate(lat, lng)) {
          setUserPos([lat, lng]);
          setAccuracy(12000);
          setGeoState('found');
          setShowPinpointer(true);
          setFlyToTrigger({ lat, lng, zoom: 11 });
          setUserAddress(
            [data.city, data.region, data.country_name].filter(Boolean).join(', ')
          );
          return;
        }
      }
    } catch (err) {
      console.warn("ipapi lookup failed", err);
    }

    setGeoState('error');
    setGeoErrorMsg(`${reason}`);
  };

  // Request browser location
  const locateUser = () => {
    if (!navigator.geolocation) {
      fallbackToIp('Browser does not support direct GPS geolocation.');
      return;
    }

    setGeoState('locating');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position && position.coords) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const acc = position.coords.accuracy;
          
          if (isValidCoordinate(lat, lng)) {
            setUserPos([lat, lng]);
            setAccuracy(acc || 100);
            setGeoState('found');
            setShowPinpointer(true);
            setFlyToTrigger({ lat, lng, zoom: 15 });
            fetchAddress(lat, lng, true);
            return;
          }
        }
        fallbackToIp('Received invalid coordinates from browser GPS.');
      },
      (error) => {
        console.warn("Geolocation warning - Code:", error?.code, "Message:", error?.message || 'Permission denied/blocked');
        let errorReason = 'GPS location unavailable.';
        if (error?.code === 1) {
          errorReason = 'GPS permission was denied or blocked by sandbox iframe restrictions.';
        } else if (error?.code === 2) {
          errorReason = 'GPS location info is currently unavailable.';
        } else if (error?.code === 3) {
          errorReason = 'GPS location request timed out.';
        }
        
        fallbackToIp(errorReason);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Automatically trigger location pinpointing on app mount
  useEffect(() => {
    locateUser();
    
    // Setup background accuracy watch if supported
    let id: number | null = null;
    if (navigator.geolocation) {
      id = navigator.geolocation.watchPosition(
        (position) => {
          if (position && position.coords) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const acc = position.coords.accuracy;

            if (isValidCoordinate(lat, lng)) {
              setUserPos([lat, lng]);
              setAccuracy(acc || 100);
              setGeoState('found');
            }
          }
        },
        (error) => {
          console.warn("Background watch position disabled/error:", error?.message || 'Unavailable');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }

    return () => {
      if (id !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, []);

  // Trigger geocoding upon finding userPos
  useEffect(() => {
    if (userPos && isValidCoordinate(userPos[0], userPos[1]) && !userAddress && !isReverseGeocoding) {
      fetchAddress(userPos[0], userPos[1], true);
    }
  }, [userPos]);

  // General Reverse Geocoding via Nominatim & BigDataCloud
  const fetchAddress = async (lat: number, lng: number, isUser: boolean) => {
    if (!isValidCoordinate(lat, lng)) return;

    const targetSetAddress = isUser ? setUserAddress : setClickedAddress;
    const targetSetLoading = isUser ? setIsReverseGeocoding : setIsGeocodingClicked;

    targetSetLoading(true);

    // Provider 1: Nominatim (no headers to prevent browser CORS OPTIONS rejection)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          targetSetAddress(data.display_name);
          if (isUser && data.address) {
            const sub = data.address.suburb || data.address.neighbourhood || data.address.residential || data.address.quarter || data.address.subdivision || data.address.city_district;
            const city = data.address.city || data.address.town || data.address.municipality || data.address.village;
            const prov = data.address.state || data.address.province;
            const locality = [sub, city, prov].filter(Boolean).join(', ') || [sub, city].filter(Boolean).join(', ') || data.display_name;
            if (locality) setUserSuburb(locality);
          }
          targetSetLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Nominatim reverse geocode failed, trying BigDataCloud fallback...", err);
    }

    // Provider 2: BigDataCloud Reverse Geocode Client (Free, no API key, CORS enabled)
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      if (response.ok) {
        const data = await response.json();
        const parts = [
          data.locality || data.city,
          data.principalSubdivision,
          data.countryName
        ].filter(Boolean);

        if (parts.length > 0) {
          targetSetAddress(parts.join(', '));
          if (isUser) {
            const sub = data.locality || data.city;
            const prov = data.principalSubdivision;
            const locality = [sub, prov].filter(Boolean).join(', ');
            if (locality) setUserSuburb(locality);
          }
          targetSetLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("BigDataCloud reverse geocode failed", err);
    }

    targetSetAddress(`Location details unavailable`);
    targetSetLoading(false);
  };

  // Click on map to pinpoint or reverse geocode
  const handleMapClick = (lat: number, lng: number) => {
    if (!exactLocationPinnedEnabled) return;
    if (!isValidCoordinate(lat, lng)) return;
    setClickedPos([lat, lng]);
    setClickedAddress('Loading location details...');
    fetchAddress(lat, lng, false);
  };

  // Return to user exact GPS location handler
  const handleReturnToMyExactLocation = () => {
    playReviewChime();
    setShowPinpointer(true);
    setClickedPos(null);
    setClickedAddress('');
    setRoutePoints([]);
    setRouteDetails(null);
    setAutoCenter(true);
    locateUser();
    if (userPos && isValidCoordinate(userPos[0], userPos[1])) {
      setFlyToTrigger({ lat: userPos[0], lng: userPos[1], zoom: 17 });
    }
  };

  // Search Address/Home number/Street/Location/Province using OSM Nominatim and Photon Search API
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);

    let mappedResults: any[] = [];

    // Attempt 1: OSM Nominatim with full address components
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&dedupe=1&limit=10&q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          mappedResults = data
            .map((item: any) => {
              const addr = item.address || {};
              const house = addr.house_number || addr.building || '';
              const road = addr.road || addr.street || addr.pedestrian || '';
              const suburb = addr.suburb || addr.neighbourhood || addr.city_district || '';
              const city = addr.city || addr.town || addr.village || addr.municipality || '';
              const province = addr.state || addr.province || addr.region || '';
              const country = addr.country || '';

              const titleParts = [house, road, suburb || city].filter(Boolean);
              const title = titleParts.length > 0 ? titleParts.join(' ') : item.name || 'Location';

              const subParts = [city !== suburb ? city : '', province, country].filter(Boolean);
              const subtitle = subParts.join(', ');

              return {
                place_id: item.place_id,
                name: title,
                subtitle: subtitle,
                display_name: item.display_name,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon)
              };
            })
            .filter((item: any) => isValidCoordinate(item.lat, item.lon));
        }
      }
    } catch (err) {
      console.warn("Nominatim search error, trying Photon fallback...", err);
    }

    // Attempt 2: Photon Komoot API fallback (High-precision OSM geocoding)
    if (mappedResults.length === 0) {
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.features && data.features.length > 0) {
            mappedResults = data.features
              .map((feat: any, idx: number) => {
                const props = feat.properties || {};
                const coords = feat.geometry?.coordinates || [0, 0];
                const house = props.housenumber || '';
                const street = props.street || props.name || '';
                const city = props.city || props.district || '';
                const state = props.state || '';
                const country = props.country || '';

                const titleParts = [house, street, city].filter(Boolean);
                const title = titleParts.length > 0 ? titleParts.join(' ') : props.name || 'Location';
                const subtitle = [state, country].filter(Boolean).join(', ');
                const fullDisplay = [house, street, city, state, country].filter(Boolean).join(', ');

                return {
                  place_id: props.osm_id || idx,
                  name: title,
                  subtitle: subtitle,
                  display_name: fullDisplay || props.name || 'Location',
                  lat: parseFloat(coords[1]),
                  lon: parseFloat(coords[0])
                };
              })
              .filter((item: any) => isValidCoordinate(item.lat, item.lon));
          }
        }
      } catch (err) {
        console.warn("Photon search failed", err);
      }
    }

    setIsSearching(false);

    if (mappedResults.length > 0) {
      setSearchResults(mappedResults);
      setShowSearchDropdown(false);
      // Immediately take user straight to the exact location searched for!
      selectSearchResult(mappedResults[0]);
    } else {
      setSearchResults([]);
      alert(`No exact location match found for "${query}". Please check the street name, number, or province.`);
    }
  };

  // Perform a flight directly to exact searched home number / street / location / province
  const selectSearchResult = (item: any) => {
    const lat = Number(item.lat);
    const lng = Number(item.lon);

    if (!isValidCoordinate(lat, lng)) return;
    
    // Stop auto-centering on user position so map stays locked on the exact searched location
    setAutoCenter(false);

    // Put a pin where searched if exactLocationPinnedEnabled
    if (exactLocationPinnedEnabled) {
      setClickedPos([lat, lng]);
      setClickedAddress(item.display_name || item.name || 'Selected exact location');
      // Calculate route directions from current GPS location
      calculateRouteTo(lat, lng);
    }
    
    // Pan and zoom straight to exact location with high-precision street level zoom
    setFlyToTrigger({ lat, lng, zoom: 18 });
    setShowSearchDropdown(false);
    setSearchQuery(item.name || item.display_name || '');
  };

  // Real-time debounced address suggestion search as user types
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) return;

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&dedupe=1&limit=6&q=${encodeURIComponent(q)}`
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data
              .map((item: any) => {
                const addr = item.address || {};
                const house = addr.house_number || addr.building || '';
                const road = addr.road || addr.street || addr.pedestrian || '';
                const suburb = addr.suburb || addr.neighbourhood || addr.city_district || '';
                const city = addr.city || addr.town || addr.village || addr.municipality || '';
                const province = addr.state || addr.province || addr.region || '';
                const country = addr.country || '';

                const titleParts = [house, road, suburb || city].filter(Boolean);
                const title = titleParts.length > 0 ? titleParts.join(' ') : item.name || 'Location';
                const subParts = [city !== suburb ? city : '', province, country].filter(Boolean);
                const subtitle = subParts.join(', ');

                return {
                  place_id: item.place_id,
                  name: title,
                  subtitle: subtitle,
                  display_name: item.display_name,
                  lat: parseFloat(item.lat),
                  lon: parseFloat(item.lon)
                };
              })
              .filter((item: any) => isValidCoordinate(item.lat, item.lon));

            if (mapped.length > 0) {
              setSearchResults(mapped);
              setShowSearchDropdown(true);
            }
          }
        }
      } catch (err) {
        // silent fallback
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans text-slate-800 bg-slate-950">
      
      {/* Profile & ID Verification Modal (Compact / Smaller View) */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 max-w-sm w-full max-h-[85vh] overflow-y-auto p-4 text-slate-800">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 gap-2">
              <div className="overflow-hidden">
                <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white glossy-3d-container shrink-0">
                    <FlatIcon icon={ShieldCheck} className="w-8 h-8" />
                  </div>
                  <span>{(viewingUserProfile || userProfile).verificationStatus === 'verified' && !isEditingProfile ? (viewingUserProfile ? 'User Profile' : 'Verified Profile') : 'Profile & Verification'}</span>
                </h2>
                <p className="text-[9.5px] text-slate-500 mt-0.5 font-medium truncate">
                  {(viewingUserProfile || userProfile).verificationStatus === 'verified' && !isEditingProfile ? (viewingUserProfile ? 'Verified Seeker Details' : 'Credentials & earnings') : 'Update info & credentials'}
                </p>
              </div>

              {/* Profile Top Corner: Gigs Profit Badge & Close */}
              <div className="flex items-center gap-1.5 shrink-0">
                {!viewingUserProfile && (
                  <div 
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-300/80 px-2 py-0.5 rounded-xl shadow-2xs"
                    title="Total Profit Earned from Completed Gigs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                    <div className="text-right leading-none">
                      <span className="text-[7px] font-black uppercase tracking-wider text-amber-800 block">Gigs Profit</span>
                      <span className="text-[10.5px] font-black text-emerald-700 font-mono block mt-0.5">
                        R {totalGigsProfitRands.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => {
                    setShowProfileModal(false);
                    setIsEditingProfile(false);
                    setViewingUserProfile(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Alert Banner */}
            {!viewingUserProfile && userProfile.verificationStatus === 'under_review' && (
              <div className="mt-2.5 bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-[11px] font-bold text-amber-900">Verification Under Review</h4>
                  <p className="text-[10px] text-amber-800 font-medium mt-0.5 leading-tight">
                    Review takes 15 to 25 minutes.
                  </p>
                </div>
              </div>
            )}

            {/* Profile Navigation Tabs */}
            {!viewingUserProfile && (
              <div className="flex items-center gap-1.5 mt-3 mb-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
                <button
                  onClick={() => setProfileActiveTab('profile')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-1.5 ${
                    profileActiveTab === 'profile' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FlatIcon icon={User} className="w-8 h-8" />
                  <span>PROFILE</span>
                </button>
                <button
                  onClick={() => setProfileActiveTab('history')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-1.5 ${
                    profileActiveTab === 'history' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FlatIcon icon={Clock} className="w-8 h-8" />
                  <span>HISTORY</span>
                </button>
              </div>
            )}

            {profileActiveTab === 'history' && !viewingUserProfile ? (
              <div className="space-y-3 my-2 animate-in slide-in-from-right-4 duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-purple-600" />
                    <span>Everyday Activity History</span>
                  </h3>
                  <button
                    onClick={() => setShowAddActivityForm(!showAddActivityForm)}
                    className="text-[9px] font-black text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <FlatIcon icon={Plus} className="w-7 h-7" />
                    <span>LOG ACTIVITY</span>
                  </button>
                </div>

                {showAddActivityForm && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Manual Activity Log</span>
                      <button onClick={() => setShowAddActivityForm(false)} className="text-slate-400 p-0.5"><X className="w-3 h-3" /></button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Activity Title (e.g. Morning Site Visit)"
                        value={newActivityTitle}
                        onChange={(e) => setNewActivityTitle(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <select
                        value={newActivityCategory}
                        onChange={(e) => setNewActivityCategory(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800"
                      >
                        <option value="custom">Custom Activity</option>
                        <option value="gig">Gig Related</option>
                        <option value="hire">Hiring & Recruitment</option>
                        <option value="payment">Financial & Payment</option>
                        <option value="system">System & Workspace</option>
                      </select>
                      <textarea
                        placeholder="Activity details & notes..."
                        value={newActivityDetails}
                        onChange={(e) => setNewActivityDetails(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-600 focus:outline-none"
                        rows={2}
                      />
                      <button
                        onClick={() => {
                          if (!newActivityTitle.trim()) return;
                          logEverydayActivity(newActivityTitle, newActivityCategory, newActivityDetails, "Manual Log");
                          setNewActivityTitle('');
                          setNewActivityDetails('');
                          setShowAddActivityForm(false);
                          playReviewChime();
                          speakLadyVoice("Activity logged to history.");
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2 rounded-xl text-[10px] transition-all shadow-md shadow-blue-500/20 active:scale-95"
                      >
                        SAVE TO HISTORY
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1">
                  {userProfile.activityHistory && userProfile.activityHistory.length > 0 ? (
                    userProfile.activityHistory.map((act: any) => (
                      <div key={act.id} className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl flex gap-3 group relative transition-all hover:bg-slate-100/60">
                        <div className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center glossy-3d-container shadow-sm ${
                          act.category === 'gig' ? 'bg-amber-500 text-white' :
                          act.category === 'hire' ? 'bg-purple-600 text-white' :
                          act.category === 'payment' ? 'bg-emerald-500 text-white' :
                          act.category === 'profile' ? 'bg-blue-600 text-white' :
                          act.category === 'system' ? 'bg-slate-500 text-white' :
                          'bg-indigo-600 text-white'
                        }`}>
                          {act.category === 'gig' ? <FlatIcon icon={Briefcase} className="w-9 h-9" /> :
                           act.category === 'hire' ? <FlatIcon icon={Plus} className="w-9 h-9" /> :
                           act.category === 'payment' ? <FlatIcon icon={CreditCard} className="w-9 h-9" /> :
                           act.category === 'profile' ? <FlatIcon icon={User} className="w-9 h-9" /> :
                           act.category === 'system' ? <FlatIcon icon={Settings} className="w-9 h-9" /> :
                           <FlatIcon icon={PieChart} className="w-9 h-9" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <h4 className="text-[11px] font-black text-slate-900 truncate leading-tight">{act.title}</h4>
                            <span className="text-[8.5px] font-black text-slate-400 whitespace-nowrap">{act.dateFormatted}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-2 leading-relaxed">{act.details}</p>
                          {act.badge && (
                            <span className={`inline-block mt-1.5 px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider ${
                              act.category === 'gig' ? 'bg-amber-100 text-amber-700' :
                              act.category === 'payment' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-slate-200 text-slate-600'
                            }`}>
                              {act.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                      <History className="w-10 h-10 mb-2 stroke-[1.5]" />
                      <p className="text-xs font-bold">No Activity Yet</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Facebook-Style Verified User Profile Card (Compact) */
              (viewingUserProfile || userProfile).verificationStatus === 'verified' && !isEditingProfile ? (
                <div className="space-y-3 my-2 animate-in slide-in-from-left-4 duration-200">
                  
                  {/* 1. Header: Avatar, Verified Badge, Name & Actions */}
                  <div className="flex flex-col items-center text-center pb-3 border-b border-slate-100">
                  <div className="relative w-16 h-16 rounded-full border-2 border-white shadow-lg ring-2 ring-emerald-500/30 overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center my-0.5">
                    {(viewingUserProfile || userProfile).avatarUrl ? (
                      <img src={(viewingUserProfile || userProfile).avatarUrl} alt={getFullName(viewingUserProfile || userProfile)} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-black text-xl">{((viewingUserProfile || userProfile).firstName || 'U').charAt(0).toUpperCase()}</span>
                    )}
                    
                    {/* Green Verified Badge */}
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 text-white rounded-full border border-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-white fill-white text-emerald-600" />
                    </span>
                  </div>

                  <h2 className="text-sm font-extrabold text-slate-900 mt-1 flex items-center gap-1">
                    <span>{getFullName(viewingUserProfile || userProfile)}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 text-white shrink-0" />
                  </h2>

                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full mt-0.5 border border-emerald-200/80">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Profile</span>
                  </div>

                  {/* 30-Day Avatar Lock Indicator (Only for own profile) */}
                  {!viewingUserProfile && getAvatarChangeLockStatus().isLocked && (
                    <div className="mt-1.5 text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-amber-600" />
                      <span>Avatar locked ({getAvatarChangeLockStatus().daysRemaining} days left)</span>
                    </div>
                  )}

                  {!viewingUserProfile && (
                    <div className="flex items-center gap-1.5 mt-2.5 w-full">
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-1.5 rounded-lg text-[11px] transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>

                      <div className="bg-slate-100 text-slate-700 px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        <span>Locked</span>
                      </div>
                    </div>
                  )}

                  {viewingUserProfile && (
                    <div className="flex items-center gap-1.5 mt-2.5 w-full">
                      <a
                        href={`tel:${viewingUserProfile.contactNumber}`}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-1.5 rounded-lg text-[11px] transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Seeker</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Monthly Active Profile Subscription Switch Card (Only for own profile) */}
                {!viewingUserProfile && (() => {
                  const subWindow = getSubscriptionWindowStatus();
                  const isSubOn = userProfile.isSubscribed && subWindow.isSubscribedOn;
                  return (
                    <div className={`p-2.5 rounded-xl border transition-all text-xs ${
                      isSubOn
                        ? 'bg-slate-900 border-slate-800 text-white shadow-md'
                        : 'bg-amber-50 border-amber-200 text-slate-900'
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className={`p-1.5 rounded-xl shrink-0 ${
                            isSubOn ? 'bg-blue-600 text-white' : 'bg-amber-100 text-amber-700'
                          }`}>
                            <CreditCard className="w-3.5 h-3.5" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-1.5">
                              <h4 className={`text-[10px] font-extrabold uppercase tracking-wider truncate ${
                                isSubOn ? 'text-white' : 'text-slate-900'
                              }`}>
                                Monthly Subscription
                              </h4>
                              <span className={`text-[8px] font-black px-1.5 py-0.2 rounded ${
                                isSubOn
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-amber-200 text-amber-900'
                              }`}>
                                {isSubOn ? 'ON' : 'OFF'}
                              </span>
                            </div>
                            <p className={`text-[10px] font-medium truncate mt-0.5 ${
                              isSubOn ? 'text-slate-300' : 'text-slate-600'
                            }`}>
                              {isSubOn
                                ? `R ${tenantBankDetails.monthlyFeeRands.toFixed(2)} ($${tenantBankDetails.monthlyFeeUsd.toFixed(2)})/mo • Active (${subWindow.daysRemaining} days remaining)`
                                : `R ${tenantBankDetails.monthlyFeeRands.toFixed(2)} ($${tenantBankDetails.monthlyFeeUsd.toFixed(2)})/mo to activate`
                              }
                            </p>
                          </div>
                        </div>

                        {/* Subscription ON/OFF Toggle Switch Icon Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!isSubOn || userProfile.paymentStatus !== 'paid') {
                              setShowBankTransferModal(true);
                            } else {
                              setUserProfile((prev: any) => ({ ...prev, isSubscribed: false, paymentStatus: 'unpaid' }));
                            }
                          }}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out ${
                            isSubOn && userProfile.paymentStatus === 'paid' ? 'bg-emerald-500' : userProfile.paymentStatus === 'under_review' ? 'bg-amber-500' : 'bg-slate-300'
                          }`}
                        >
                          <span className="sr-only">Toggle Subscription</span>
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[7px] font-black ${
                              isSubOn && userProfile.paymentStatus === 'paid' ? 'translate-x-4 text-emerald-600' : userProfile.paymentStatus === 'under_review' ? 'translate-x-4 text-amber-600' : 'translate-x-0 text-slate-400'
                            }`}
                          >
                            {isSubOn && userProfile.paymentStatus === 'paid' ? 'ON' : userProfile.paymentStatus === 'under_review' ? 'REV' : 'OFF'}
                          </span>
                        </button>
                      </div>

                      {/* Inactive Alert Banner */}
                      {(!isSubOn || userProfile.paymentStatus !== 'paid') && (
                        <div className="mt-2 pt-2 border-t border-amber-200/80 flex items-center justify-between text-[10px] gap-1.5">
                          <span className="text-[10px] text-amber-900 font-bold truncate">
                            {userProfile.paymentStatus === 'under_review' ? 'POP under review' : 'Bank transfer required'}
                          </span>

                          <button
                            type="button"
                            onClick={() => setShowBankTransferModal(true)}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-2 py-1 rounded-lg text-[9px] transition-all shrink-0"
                          >
                            <span>{userProfile.paymentStatus === 'under_review' ? 'View Proof' : 'Pay $9.99'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 2. Info Section */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-2 text-[11px] font-semibold text-slate-700">
                  <span className="text-[10px] font-extrabold text-slate-900 block uppercase tracking-wider">About & Credentials</span>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-slate-800 truncate">{(viewingUserProfile || userProfile).address || (viewingUserProfile ? 'Hidden for privacy' : userAddress) || 'Address on record'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-slate-800">{(viewingUserProfile || userProfile).contactNumber || '+1 (555) 234-5678'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="text-slate-800 truncate">{(viewingUserProfile || userProfile).email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-slate-800">{(viewingUserProfile || userProfile).dob === 'Hidden' ? 'Verified Seeker' : `Born ${(viewingUserProfile || userProfile).dob}`}</span>
                    </div>
                  </div>

                  {/* Social Media Links Pills */}
                  {(viewingUserProfile || userProfile).socialLinks && (viewingUserProfile || userProfile).socialLinks.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-200/60 flex flex-wrap gap-1">
                      {(viewingUserProfile || userProfile).socialLinks.map((link: any) => (
                        <a
                          key={link.id}
                          href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 rounded-md px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Globe className="w-2.5 h-2.5 text-blue-500" />
                          <span>{link.platform}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Trade Work & Seeker Profile Section */}
                <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200/90 space-y-2.5 text-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-purple-600" />
                      Trade Work & Seeker Skills
                    </span>
                    <span className="text-[9px] bg-purple-600 text-white font-extrabold px-2 py-0.5 rounded-full">
                      {(viewingUserProfile || userProfile).seekerTradeType || 'Electrician'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-purple-100 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900">
                        {(viewingUserProfile || userProfile).seekerTradeCustom || (viewingUserProfile || userProfile).seekerTradeType || 'Electrician'}
                      </span>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {(viewingUserProfile || userProfile).seekerHourlyRate || 'R 250/hr'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" />
                        {(viewingUserProfile || userProfile).seekerTradeExperienceYears || '3-5 Years'} Experience
                      </span>
                    </div>

                    {(viewingUserProfile || userProfile).seekerBioSummary && (
                      <p className="text-[10px] text-slate-600 pt-1 border-t border-slate-100 italic">
                        "{(viewingUserProfile || userProfile).seekerBioSummary}"
                      </p>
                    )}
                  </div>

                  {/* Previous Work Experiences List */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1">
                      <History className="w-3 h-3 text-purple-600" />
                      Previous Work Experiences ({(viewingUserProfile || userProfile).seekerWorkExperiences?.length || 0})
                    </span>

                    {(viewingUserProfile || userProfile).seekerWorkExperiences && (viewingUserProfile || userProfile).seekerWorkExperiences.length > 0 ? (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                        {(viewingUserProfile || userProfile).seekerWorkExperiences.map((exp: any, idx: number) => (
                          <div key={exp.id || idx} className="bg-white p-2 rounded-lg border border-purple-100 text-[10px] space-y-0.5 shadow-2xs">
                            <div className="flex items-center justify-between font-bold">
                              <span className="text-slate-900">{exp.roleTitle || 'Trade Specialist'}</span>
                              <span className="text-slate-400 font-mono text-[9px]">{exp.duration || 'Past Project'}</span>
                            </div>
                            <p className="text-purple-700 font-semibold">{exp.companyOrProject}</p>
                            {exp.description && (
                              <p className="text-slate-500 text-[9.5px] leading-tight pt-0.5">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 italic">No previous experiences logged.</p>
                    )}
                  </div>
                </div>

                {/* 4. Uploaded Documents Visible & Downloadable */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-900 block uppercase tracking-wider flex items-center justify-between">
                    <span>Uploaded Documents</span>
                    <Lock className="w-3 h-3 text-emerald-600" />
                  </span>

                  {/* Face Photo File */}
                  <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-8 h-8 rounded overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                        {(viewingUserProfile || userProfile).avatarUrl ? (
                          <img src={(viewingUserProfile || userProfile).avatarUrl} alt="Face Photo" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-4 h-4 text-slate-400 m-auto mt-1" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[11px] font-bold text-slate-900 block truncate">Face Photo</span>
                        <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => downloadDocumentFile((viewingUserProfile || userProfile).avatarUrl, 'verified_face_photo.jpg')}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded text-[10px] transition-colors shrink-0"
                    >
                      Download
                    </button>
                  </div>

                  {/* Government ID Document File (Only for own profile or admin/tenant) */}
                  {(!viewingUserProfile || userProfile.email === 'timegig2026@gmail.com') && (
                    <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0 text-purple-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[11px] font-bold text-slate-900 truncate block">
                            {(viewingUserProfile || userProfile).idDocumentName || 'Government_ID.pdf'}
                          </span>
                          <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => downloadDocumentFile((viewingUserProfile || userProfile).idDocumentUrl, (viewingUserProfile || userProfile).idDocumentName || 'verified_government_id.pdf')}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded text-[10px] transition-colors shrink-0"
                      >
                        Download
                      </button>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              /* Profile Editing Form View (Compact) */
              <div className="space-y-3 mt-3">
                
                {/* 1. Face Photo Upload */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    Face Photo Upload
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full ring-2 ring-white shadow-sm bg-blue-600 flex items-center justify-center overflow-hidden shrink-0">
                      {editAvatarUrl ? (
                        <img src={editAvatarUrl} alt="Face photo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-black text-sm">{(editFirstName || 'U').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <label className="inline-flex items-center gap-1.5 font-bold px-2.5 py-1.5 rounded-lg text-[10px] bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 cursor-pointer active:scale-95 transition-colors shadow-sm">
                        <Upload className="w-3 h-3" />
                        <span>Upload Face Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          disabled={getAvatarChangeLockStatus().isLocked}
                          onChange={handleFacePhotoUpload}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. Upload ID Documents */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    Government ID Document
                  </label>

                  {editIdDocName ? (
                    <div className="bg-white border border-purple-200 p-2 rounded-lg flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-800 truncate">{editIdDocName}</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setEditIdDocName('');
                          setEditIdDocUrl('');
                        }}
                        className="text-slate-400 hover:text-red-500 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-1.5 p-2 border border-dashed border-slate-300 hover:border-purple-400 rounded-lg bg-white cursor-pointer transition-colors text-[10px] font-bold text-slate-700">
                      <Upload className="w-3.5 h-3.5 text-purple-500" />
                      <span>Choose ID File from Device</span>
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={handleIdDocUpload}
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>

                {/* 3. Personal Info Form Fields */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-900 block uppercase tracking-wider">Personal Information</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">First Name *</label>
                      <input
                        type="text"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Middle Name</label>
                      <input
                        type="text"
                        value={editMiddleName}
                        onChange={(e) => setEditMiddleName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="David"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Surname *</label>
                    <input
                      type="text"
                      value={editSurname}
                      onChange={(e) => setEditSurname(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Smith"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Date of Birth</label>
                      <input
                        type="date"
                        value={editDob}
                        onChange={(e) => setEditDob(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Contact Phone</label>
                      <input
                        type="tel"
                        value={editContactNumber}
                        onChange={(e) => setEditContactNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="+1 555-000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Email Address</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="example@mail.com"
                    />
                  </div>
                </div>

                {/* 4. Trade Work & Seeker Skills Configuration */}
                <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-purple-600" />
                      Trade Work Selection (Seeker)
                    </span>
                    <span className="text-[9px] bg-purple-200 text-purple-900 font-bold px-1.5 py-0.2 rounded">
                      Job Category
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Choose Your Trade Work *
                    </label>
                    <select
                      value={editSeekerTradeType}
                      onChange={(e) => setEditSeekerTradeType(e.target.value)}
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                    >
                      <option value="Electrician">Electrician / Electrical Technician</option>
                      <option value="Plumber">Plumber / Plumbing & Sanitation</option>
                      <option value="Carpenter">Carpenter / Woodworking & Cabinetry</option>
                      <option value="Painter & Decorator">Painter & Decorator</option>
                      <option value="Welder & Boilermaker">Welder & Boilermaker / Fabrication</option>
                      <option value="Mason & Bricklayer">Mason / Bricklayer / Plastering</option>
                      <option value="Handyman & Maintenance">Handyman & General Maintenance</option>
                      <option value="Appliance Repair">Appliance Repair (Fridges, Washing Machines, Stoves)</option>
                      <option value="HVAC & Refrigeration">HVAC / Air Conditioning & Refrigeration</option>
                      <option value="Motor Mechanic">Motor Mechanic & Auto Electrician</option>
                      <option value="Roofer & Waterproofing">Roofer / Waterproofing & Gutters</option>
                      <option value="Tiler & Flooring">Tiler / Flooring Specialist</option>
                      <option value="Landscaper & Gardener">Landscaper / Gardener / Tree Felling</option>
                      <option value="Locksmith & Security">Locksmith & Security Installations</option>
                      <option value="Solar & Backup Power">Solar & Backup Power Installer</option>
                      <option value="IT & CCTV Technician">IT / Network Cabling & CCTV Tech</option>
                      <option value="Other Custom Trade">Other Custom Trade...</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                        Experience Level
                      </label>
                      <select
                        value={editSeekerTradeExperienceYears}
                        onChange={(e) => setEditSeekerTradeExperienceYears(e.target.value)}
                        className="w-full bg-white border border-purple-200 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="< 1 Year (Junior)">&lt; 1 Year (Junior)</option>
                        <option value="1-2 Years">1-2 Years Experience</option>
                        <option value="3-5 Years">3-5 Years (Intermediate)</option>
                        <option value="5-10 Years">5-10 Years (Senior)</option>
                        <option value="10+ Years (Master)">10+ Years (Master / Contractor)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                        Target Hourly Rate
                      </label>
                      <input
                        type="text"
                        value={editSeekerHourlyRate}
                        onChange={(e) => setEditSeekerHourlyRate(e.target.value)}
                        placeholder="e.g. R 250/hr"
                        className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      Specialization / Custom Title
                    </label>
                    <input
                      type="text"
                      value={editSeekerTradeCustom}
                      onChange={(e) => setEditSeekerTradeCustom(e.target.value)}
                      placeholder="e.g. Certified High-Voltage & Solar Electrician"
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      Trade Summary / Bio
                    </label>
                    <textarea
                      rows={2}
                      value={editSeekerBioSummary}
                      onChange={(e) => setEditSeekerBioSummary(e.target.value)}
                      placeholder="Brief overview of tools, certifications, and trade capabilities..."
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* 5. Previous Work Experiences Section */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-indigo-600" />
                      Previous Work Experiences
                    </span>

                    <button
                      type="button"
                      onClick={addWorkExperience}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-colors active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Experience</span>
                    </button>
                  </div>

                  {editSeekerWorkExperiences.length === 0 ? (
                    <div className="text-center py-3 border border-dashed border-slate-300 rounded-lg bg-white">
                      <p className="text-[11px] text-slate-400 font-medium">No past work experiences added yet.</p>
                      <button
                        type="button"
                        onClick={addWorkExperience}
                        className="mt-1 text-[10px] text-indigo-600 font-bold hover:underline"
                      >
                        + Add your first past project or employer
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                      {editSeekerWorkExperiences.map((exp: any, index: number) => (
                        <div key={exp.id || index} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5 relative group">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                            <span className="text-[10px] font-extrabold text-indigo-900">
                              Experience #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeWorkExperience(exp.id)}
                              className="text-slate-400 hover:text-red-600 p-0.5 rounded transition-colors"
                              title="Delete experience"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-600 mb-0.5">Company / Project *</label>
                              <input
                                type="text"
                                value={exp.companyOrProject}
                                onChange={(e) => updateWorkExperience(exp.id, 'companyOrProject', e.target.value)}
                                placeholder="e.g. Apex Electrical"
                                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-medium text-slate-800"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-slate-600 mb-0.5">Role / Title *</label>
                              <input
                                type="text"
                                value={exp.roleTitle}
                                onChange={(e) => updateWorkExperience(exp.id, 'roleTitle', e.target.value)}
                                placeholder="e.g. Master Electrician"
                                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-medium text-slate-800"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5">
                            <div className="col-span-1">
                              <label className="block text-[9px] font-bold text-slate-600 mb-0.5">Duration</label>
                              <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => updateWorkExperience(exp.id, 'duration', e.target.value)}
                                placeholder="2021 - 2024"
                                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-medium text-slate-800"
                              />
                            </div>

                            <div className="col-span-2">
                              <label className="block text-[9px] font-bold text-slate-600 mb-0.5">Key Duties / Work Done</label>
                              <input
                                type="text"
                                value={exp.description}
                                onChange={(e) => updateWorkExperience(exp.id, 'description', e.target.value)}
                                placeholder="Rewiring, panel repair, solar..."
                                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-medium text-slate-800"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  {userProfile.verificationStatus === 'verified' && (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition-colors"
                    >
                      Back
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isSubmittingProfile}
                    onClick={submitProfileForReview}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] transition-all shadow-sm active:scale-95 flex items-center gap-1.5 disabled:opacity-60"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{userProfile.verificationStatus === 'verified' ? 'Save Changes' : 'Submit Verification'}</span>
                  </button>
                </div>

              </div>
            )
          )}

          </div>
        </div>
      )}

      {/* Team Invite Referral Modal */}
      {showTeamInviteModal && (
        <div className="fixed inset-0 z-[2800] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-sm w-full p-6 text-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white glossy-3d-container">
                  <Users className="w-6 h-6 icon-shadow-3d" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Invite Your Team</h3>
              </div>
              <button onClick={() => setShowTeamInviteModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Your Team Referral Link</span>
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-inner">
                  <span className="text-[11px] font-bold text-blue-600 truncate">
                    {`https://timegig.app/join/${userProfile.firstName.toLowerCase()}-${userProfile.email.split('@')[0].slice(-4)}`}
                  </span>
                  <button 
                    onClick={() => {
                      const link = `https://timegig.app/join/${userProfile.firstName.toLowerCase()}-${userProfile.email.split('@')[0].slice(-4)}`;
                      navigator.clipboard.writeText(link);
                      playReviewChime();
                      speakLadyVoice("Referral link copied.");
                    }}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-3">
                  Share this link with potential team members.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-blue-900">Team Size Limit</span>
                  <p className="text-[10px] text-blue-700 font-medium">Max 10 team members allowed.</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-blue-600">{teamInvitesCount} / 10</span>
                  <div className="w-20 h-1.5 bg-blue-200 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(teamInvitesCount / 10) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (teamInvitesCount >= 10) {
                    alert("Team limit reached. You can only invite up to 10 members.");
                    return;
                  }
                  setTeamInvitesCount(prev => prev + 1);
                  playReviewChime();
                  speakLadyVoice("New team member invited simulation.");
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-2xl text-xs transition-all shadow-lg active:scale-95"
              >
                INVITE NEW MEMBER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Review Submission Popup on Main Map Screen */}
      {showReviewPopup && (
        <div className="fixed inset-0 z-[2500] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-sm w-full p-6 text-center text-slate-800">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50 shadow-inner">
              <Clock className="w-8 h-8 animate-pulse stroke-[2.2]" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900">Verification Under Review</h3>
            <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
              Your profile details and ID documents have been submitted. Review takes about <span className="font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">15 to 25 minutes</span>.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mt-4 text-left space-y-1.5 text-[11px] text-slate-600 font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-400">Applicant:</span>
                <span className="text-slate-800 font-bold">{getFullName(userProfile)}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-400 shrink-0">Address:</span>
                <span className="text-slate-800 truncate font-semibold">{userProfile.address || userAddress || 'Address logged'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-1.5 mt-1.5">
                <span className="text-slate-400">Status:</span>
                <span className="text-amber-600 font-black uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block" />
                  Pending Review
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewPopup(false)}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-blue-500/20"
            >
              Return to Map Screen
            </button>
          </div>
        </div>
      )}

      {/* Bank Transfer & Proof of Payment Upload Modal */}
      {showBankTransferModal && (
        <div className="fixed inset-0 z-[2600] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-md w-full p-6 text-slate-800 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white glossy-3d-container shrink-0">
                  <Building2 className="w-6 h-6 icon-shadow-3d" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Bank Transfer Payment</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Monthly Profile Fee: <span className="font-extrabold text-emerald-700">R {(tenantBankDetails.userMonthlyFeeRands || tenantBankDetails.monthlyFeeRands || 180).toFixed(2)} (${(tenantBankDetails.userMonthlyFeeUsd || tenantBankDetails.monthlyFeeUsd || 9.99).toFixed(2)} USD)</span></p>
                </div>
              </div>

              <button 
                onClick={() => setShowBankTransferModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* 1. Official Bank Account Details Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    Official Deposit Bank Account
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded-md border border-emerald-500/30">Verified Account</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Bank Name</span>
                    <span className="text-white font-bold">{tenantBankDetails.bankName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Account Name</span>
                    <span className="text-white font-bold truncate block">{tenantBankDetails.accountName}</span>
                  </div>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-2.5 flex items-center justify-between border border-slate-700/80">
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono uppercase block">Account Number</span>
                    <span className="text-sm font-mono font-black text-emerald-400 tracking-wider">{tenantBankDetails.accountNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(tenantBankDetails.accountNumber.replace(/[^0-9A-Za-z]/g, ''));
                      setCopiedAccount(true);
                      setTimeout(() => setCopiedAccount(false), 2000);
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white p-2 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">SWIFT / Routing</span>
                    <span className="text-slate-200 font-mono font-bold">{tenantBankDetails.swiftCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Payment Reference</span>
                    <span className="text-amber-400 font-mono font-extrabold">{`${tenantBankDetails.referencePrefix}${userProfile.email.split('@')[0].toUpperCase()}`}</span>
                  </div>
                </div>
              </div>

              {/* 2. Proof of Payment Document Upload Section */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    Upload Proof of Payment Document
                  </span>
                  <span className="text-[10px] text-amber-700 font-extrabold bg-amber-100 px-2 py-0.5 rounded-full">Required</span>
                </label>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  After completing the bank transfer, upload your deposit receipt, bank app screenshot, or payment PDF from your device.
                </p>

                {uploadedPopName ? (
                  <div className="bg-white border border-emerald-300 p-3 rounded-xl flex items-center justify-between gap-2 shadow-sm">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-slate-900 truncate block">{uploadedPopName}</span>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Ready for submission
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUploadedPopName('');
                        setUploadedPopUrl('');
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl bg-white cursor-pointer transition-colors group">
                    <Upload className="w-7 h-7 text-emerald-500 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-slate-800">Upload Receipt or Screenshot from Device</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, PDF receipts supported</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handlePopFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowBankTransferModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmittingPop || !uploadedPopUrl}
                onClick={submitProofOfPayment}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingPop ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting Payment...</span>
                  </>
                ) : (
                  <>
                    <Receipt className="w-4 h-4" />
                    <span>Submit Proof of Payment</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Proof of Payment Submitted Notification Popup */}
      {showPopReviewPopup && (
        <div className="fixed inset-0 z-[2700] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-sm w-full p-6 text-center text-slate-800">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50 shadow-inner">
              <Clock className="w-8 h-8 animate-pulse stroke-[2.2]" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900">Proof of Payment Submitted</h3>
            <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
              Your bank transfer proof of payment has been received. Review and subscription activation takes <span className="font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">15 to 25 minutes</span>.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mt-4 text-left space-y-1.5 text-[11px] text-slate-600 font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-400">Account User:</span>
                <span className="text-slate-800 font-bold">{getFullName(userProfile)}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-400 shrink-0">Receipt File:</span>
                <span className="text-slate-800 truncate font-semibold">{userProfile.popDocumentName || uploadedPopName || 'receipt_file.jpg'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-1.5 mt-1.5">
                <span className="text-slate-400">Tenant Review:</span>
                <span className="text-amber-600 font-black uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block" />
                  15-25 Min Verification
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowPopReviewPopup(false)}
              className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              Done & Return to Map
            </button>
          </div>
        </div>
      )}

      {/* Disable Account Confirmation Modal */}
      {showDisableConfirmModal && (
        <div className="fixed inset-0 z-[2800] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center text-slate-800">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3.5 ring-8 ring-amber-50">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Disable Your Account?</h3>
            <p className="text-xs text-slate-600 font-medium mt-1.5 leading-relaxed">
              Disabling your account will temporarily deactivate your profile, pause live map broadcasts, and hide your gigs. You can re-enable your account anytime with one click in Settings.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button
                type="button"
                onClick={() => setShowDisableConfirmModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAccountDisabled(true);
                  setShowDisableConfirmModal(false);
                  playReviewChime();
                  speakLadyVoice("Account disabled.");
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-rose-600/20"
              >
                Confirm & Disable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Logged Out Screen */}
      {isLoggedOut && (
        <div className="fixed inset-0 z-[4000] bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-sm w-full p-6 text-center text-slate-800">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 ring-8 ring-blue-50/50 shadow-inner">
              <LogOut className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Logged Out</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              You have safely logged out of Timegig. Click below to log back in to your active account.
            </p>
            <div className="my-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5 text-left">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 text-white font-black flex items-center justify-center shrink-0">
                {userProfile.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt={getFullName(userProfile)} className="w-full h-full object-cover" />
                ) : (
                  getFullName(userProfile).charAt(0)
                )}
              </div>
              <div className="overflow-hidden min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{getFullName(userProfile)}</h4>
                <p className="text-[10px] text-slate-500 truncate">{userProfile.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsLoggedOut(false);
                playReviewChime();
                speakLadyVoice("Welcome back to Timegig.");
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-black rounded-xl text-xs transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Log Back In</span>
            </button>
          </div>
        </div>
      )}

      {/* Account Disabled Sticky Notification Header Banner */}
      {isAccountDisabled && !isLoggedOut && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1150] pointer-events-auto w-full max-w-md px-4 animate-in slide-in-from-top-3 duration-200">
          <div className="bg-amber-500 text-slate-950 p-2.5 px-4 rounded-2xl shadow-2xl border-2 border-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0 animate-bounce" />
              <span className="text-xs font-black">Your account is currently disabled</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAccountDisabled(false);
                playReviewChime();
                speakLadyVoice("Account reactivated.");
              }}
              className="bg-slate-950 hover:bg-slate-800 text-white font-extrabold px-3 py-1 rounded-xl text-[11px] shrink-0 active:scale-95 transition-transform"
            >
              Reactivate
            </button>
          </div>
        </div>
      )}

      {/* Create a GiG Modal */}
      {showCreateGigModal && (
        <div className="fixed inset-0 z-[2900] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-md w-full p-6 text-slate-800 my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white glossy-3d-container flex items-center justify-center shadow-md shrink-0">
                  <Briefcase className="w-5 h-5 icon-shadow-3d" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Create & Publish a GiG</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Post a job for verified trade seekers to apply</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateGigModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishNewGig} className="space-y-3.5 my-4">
              {/* GiG Title */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                  GiG Title / Task Summary *
                </label>
                <input
                  type="text"
                  required
                  value={newGigTitle}
                  onChange={(e) => setNewGigTitle(e.target.value)}
                  placeholder="e.g. Repair Kitchen DB Board & Circuit Breaker"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Category & Hourly / Fixed Rate */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-700 mb-1">
                    Trade Specialization *
                  </label>
                  <select
                    value={newGigCategory}
                    onChange={(e) => setNewGigCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter & Woodwork">Carpenter</option>
                    <option value="Painter & Decorator">Painter</option>
                    <option value="Handyman & Maintenance">Handyman</option>
                    <option value="Solar & Backup Power">Solar & Power</option>
                    <option value="HVAC & Refrigeration">HVAC / Aircon</option>
                    <option value="Motor Mechanic">Mechanic</option>
                    <option value="Locksmith & Security">Locksmith</option>
                    <option value="Tiler & Flooring">Tiler / Flooring</option>
                    <option value="General Trade">Other Trade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-700 mb-1">
                    Offered Rate / Budget *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGigRate}
                    onChange={(e) => setNewGigRate(e.target.value)}
                    placeholder="e.g. R 350/hr or R 1,200 Fixed"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* GiG Description */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-700 mb-1">
                  Job Description & Details
                </label>
                <textarea
                  rows={3}
                  value={newGigDescription}
                  onChange={(e) => setNewGigDescription(e.target.value)}
                  placeholder="Describe the problem, materials on site, tools needed, and specific requirements..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Location & Contact */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-extrabold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>Location / Suburb *</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoFillLocation}
                        disabled={isDetectingGigLocation}
                        className="text-[9px] text-amber-700 hover:text-amber-800 font-bold flex items-center gap-0.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-1.5 py-0.5 rounded-md transition-colors"
                        title="Auto-detect current location / suburb"
                      >
                        {isDetectingGigLocation ? (
                          <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-600" />
                        ) : (
                          <Crosshair className="w-2.5 h-2.5 text-amber-600" />
                        )}
                        <span>Detect</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={newGigLocation}
                        onChange={(e) => setNewGigLocation(e.target.value)}
                        placeholder={getUserLocationOrSuburb() || "e.g. Sandton, Johannesburg"}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-7 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleAutoFillLocation}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors"
                        title="Auto-fill my location / suburb"
                      >
                        <Navigation className="w-3 h-3 rotate-45" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="text"
                      value={newGigContact}
                      onChange={(e) => setNewGigContact(e.target.value)}
                      placeholder={userProfile.contactNumber || "+27 71 000 0000"}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-700 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-600 shrink-0" />
                      GiG Expiry (Map) *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={newGigExpiryAt}
                      onChange={(e) => setNewGigExpiryAt(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[10px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Automatic Location / Suburb Detection Switch */}
                <div className="flex items-center justify-between p-2.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-extrabold text-amber-950 block leading-tight">
                          Automatically add my Location / Suburb
                        </span>
                        <span className={`text-[8.5px] font-black uppercase px-1.5 py-0.2 rounded ${autoAddUserLocation ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          {autoAddUserLocation ? 'ON' : 'OFF'}
                        </span>
                      </div>
                      <span className="text-[9.5px] text-amber-800 font-medium truncate block mt-0.5">
                        {userAddress || userSuburb ? `Detected: ${getUserLocationOrSuburb()}` : 'Automatically adds GPS location to new gigs'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const next = !autoAddUserLocation;
                      setAutoAddUserLocation(next);
                      try {
                        localStorage.setItem('timegig_auto_add_gig_location', String(next));
                      } catch (err) {}
                      if (next) {
                        const loc = getUserLocationOrSuburb();
                        setNewGigLocation(loc);
                        playReviewChime();
                        speakLadyVoice("Location added.");
                      }
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out shadow-inner ${
                      autoAddUserLocation ? 'bg-amber-600' : 'bg-slate-300'
                    }`}
                    title="Toggle automatic location / suburb detection for gigs"
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        autoAddUserLocation ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateGigModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPublishingGig}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-95 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-amber-500/25 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isPublishingGig ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  <span>Publish GiG</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel GiG with Reason Modal (Both User & Creator can cancel and send reason) */}
      {showCancelGigModal && (
        <div className="fixed inset-0 z-[3300] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-md w-full p-6 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-base font-extrabold text-slate-900">Cancel GiG</h3>
                  <p className="text-[11px] text-slate-500 font-medium truncate max-w-[260px]">
                    {cancelingGigItem?.title || activeGigSession?.seekerTrade || 'Active GiG Session'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowCancelGigModal(false);
                  setCancelingGigItem(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 my-4">
              {/* Canceling Party Selection */}
              <div>
                <label className="block text-[10.5px] font-extrabold text-slate-700 mb-1.5">
                  Who is canceling this GiG?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCancelParty('user')}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                      cancelParty === 'user' 
                        ? 'bg-purple-50 text-purple-800 border-purple-300 ring-2 ring-purple-500/20' 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    👤 Applicant / Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setCancelParty('creator')}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                      cancelParty === 'creator' 
                        ? 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-500/20' 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    💼 GiG Creator / Employer
                  </button>
                </div>
              </div>

              {/* Preset Reason Chips */}
              <div>
                <label className="block text-[10.5px] font-extrabold text-slate-700 mb-1.5">
                  Select Reason *
                </label>
                <div className="space-y-1.5">
                  {[
                    'Emergency / Schedule conflict',
                    'Found alternative technician / solved',
                    'Location unreachable or incorrect address',
                    'Disagreement on scope of work / rate',
                    'Unforeseen delay or equipment issue'
                  ].map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => {
                        setCancelReasonPreset(reason);
                        setCancelCustomReason('');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                        cancelReasonPreset === reason && !cancelCustomReason
                          ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      <span>{reason}</span>
                      {cancelReasonPreset === reason && !cancelCustomReason && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Reason Textarea */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                  Or write custom reason sent to {cancelParty === 'user' ? 'GiG Creator' : 'Applicant'}:
                </label>
                <textarea
                  rows={2}
                  value={cancelCustomReason}
                  onChange={(e) => setCancelCustomReason(e.target.value)}
                  placeholder="Additional explanation sent directly to the other party..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[10.5px] text-amber-900 font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Reason will be transmitted directly to the {cancelParty === 'user' ? 'GiG Creator' : 'Applicant'}.
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCancelGigModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelGig}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Cancel GiG & Send Reason</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GiG Cancellation Notification Alert Modal */}
      {gigCancellationNotice && (
        <div className="fixed inset-0 z-[3400] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-sm w-full p-6 text-center text-slate-800">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner ring-8 ring-rose-50">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">GiG Canceled</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Canceled by <span className="font-bold text-slate-800">{gigCancellationNotice.canceledBy}</span> at {gigCancellationNotice.timestamp}
            </p>

            <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3.5 my-4 text-left space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-[10px] text-rose-800 font-bold">
                <span className="uppercase tracking-wider">Reason Sent to {gigCancellationNotice.targetParty}:</span>
              </div>
              <p className="font-semibold text-rose-950 text-[11.5px] italic">
                "{gigCancellationNotice.reason}"
              </p>
            </div>

            <button
              type="button"
              onClick={() => setGigCancellationNotice(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
            >
              Dismiss Notice
            </button>
          </div>
        </div>
      )}

      {/* Full-Screen Tenant Admin Profile & ID Inspection Review Modal */}
      {inspectingApplicant && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-xl w-full p-6 text-slate-800 my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white glossy-3d-container shrink-0">
                  <ShieldCheck className="w-6 h-6 icon-shadow-3d" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Tenant Verification Inspector</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Review submitted face photo, ID documents and personal credentials</p>
                </div>
              </div>
              <button 
                onClick={() => setInspectingApplicant(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 mt-4">
              
              {/* 1. Full Size Face Photo Preview */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                  <Camera className="w-4 h-4 text-blue-600" /> Full-Screen Face Photo
                </span>
                <div className="relative w-28 h-28 rounded-full ring-4 ring-white shadow-xl bg-blue-600 flex items-center justify-center overflow-hidden border-2 border-blue-500 my-1">
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt="Face photo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-black text-3xl">{(userProfile.firstName || 'U').charAt(0).toUpperCase()}</span>
                  )}
                  {userProfile.verificationStatus === 'verified' && (
                    <span className="absolute top-1 right-1 w-6 h-6 bg-emerald-500 text-white rounded-full border-2 border-white flex items-center justify-center text-xs font-black shadow-md">✓</span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-900 mt-2 flex items-center gap-1">
                  {getFullName(userProfile)}
                  {userProfile.verificationStatus === 'verified' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </span>
              </div>

              {/* 2. Full Size Uploaded ID Document */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 mb-2 block flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-600" /> Uploaded Government ID Document
                </span>

                {userProfile.idDocumentUrl || userProfile.idDocumentName ? (
                  <div className="bg-white border border-purple-200 rounded-xl p-3 flex flex-col items-center gap-2">
                    {userProfile.idDocumentUrl && userProfile.idDocumentUrl.startsWith('data:image') ? (
                      <img 
                        src={userProfile.idDocumentUrl} 
                        alt="Uploaded ID Document" 
                        className="w-full max-h-48 object-contain rounded-lg border border-slate-100 shadow-inner"
                      />
                    ) : (
                      <div className="py-6 flex flex-col items-center text-purple-700">
                        <FileText className="w-12 h-12 text-purple-500 mb-1.5 stroke-[1.5]" />
                        <span className="text-xs font-bold">{userProfile.idDocumentName || 'ID_Document_Attached.pdf'}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Verified Document File</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white border border-dashed border-slate-300 rounded-xl p-4 text-center text-slate-500 text-xs font-medium">
                    No custom ID document uploaded yet (Default Demo Document)
                  </div>
                )}
              </div>

              {/* 3. Applicant Personal Credentials Table */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="text-xs font-extrabold text-slate-900 block uppercase tracking-wider mb-2">Applicant Metadata</span>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-medium">First Name</span>
                    <span className="font-bold text-slate-800">{userProfile.firstName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Middle Name</span>
                    <span className="font-bold text-slate-800">{userProfile.middleName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Surname</span>
                    <span className="font-bold text-slate-800">{userProfile.surname}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Date of Birth</span>
                    <span className="font-bold text-slate-800">{userProfile.dob}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Contact Phone</span>
                    <span className="font-bold text-slate-800">{userProfile.contactNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Email</span>
                    <span className="font-bold text-slate-800 truncate block">{userProfile.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-slate-400 block font-medium text-[11px]">Residential Address</span>
                  <span className="font-bold text-slate-800 text-[11px]">{userProfile.address || userAddress || 'Address on record'}</span>
                </div>
              </div>

            </div>

            {/* Modal Decision Footer (Approve / Reject) */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setUserProfile((prev: any) => ({ ...prev, verificationStatus: 'unverified' }));
                  setInspectingApplicant(false);
                }}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-red-200"
              >
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Reject Application</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserProfile((prev: any) => ({ ...prev, verificationStatus: 'verified' }));
                  setInspectingApplicant(false);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Verify User</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Full-Screen Tenant Admin Proof of Payment (POP) Inspection Modal */}
      {inspectingPopPayment && (
        <div className="fixed inset-0 z-[3100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-lg w-full p-6 text-slate-800 my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white glossy-3d-container shrink-0">
                  <Receipt className="w-6 h-6 icon-shadow-3d" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">UserPoP Inspector</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Review submitted bank transfer deposit receipt & activate profile</p>
                </div>
              </div>
              <button 
                onClick={() => setInspectingPopPayment(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              
              {/* 1. Applicant Profile Summary */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden shrink-0">
                    {userProfile.avatarUrl ? (
                      <img src={userProfile.avatarUrl} alt={getFullName(userProfile)} className="w-full h-full object-cover" />
                    ) : (
                      getFullName(userProfile).charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      {getFullName(userProfile)}
                      {userProfile.verificationStatus === 'verified' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500">{userProfile.email} • {userProfile.contactNumber}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                  userProfile.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {userProfile.paymentStatus === 'paid' ? 'PAID' : 'PAYMENT REVIEW'}
                </span>
              </div>

              {/* 2. Uploaded Proof of Payment File Card */}
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-extrabold text-amber-900 block uppercase tracking-wider flex items-center justify-between">
                  <span>Uploaded Proof of Payment File</span>
                  <Receipt className="w-4 h-4 text-amber-600" />
                </span>

                {userProfile.popDocumentUrl ? (
                  <div className="bg-white border border-amber-200 rounded-xl p-3 flex flex-col gap-3">
                    {/* Image preview if image */}
                    {userProfile.popDocumentUrl.startsWith('data:image') && (
                      <div 
                        onClick={() => {
                          setFullScreenMediaModal({
                            isOpen: true,
                            title: "Uploaded Proof of Payment File",
                            logoUrl: userProfile.avatarUrl,
                            popUrl: userProfile.popDocumentUrl,
                            popName: userProfile.popDocumentName || 'payment_receipt.jpg',
                            userName: getFullName(userProfile),
                            email: userProfile.email,
                            phone: userProfile.contactNumber,
                            activeTab: 'pop'
                          });
                        }}
                        className="w-full h-48 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity relative group"
                        title="Click to view full screen"
                      >
                        <img src={userProfile.popDocumentUrl} alt="Proof of Payment Receipt" className="w-full h-full object-contain" />
                        <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="w-3 h-3" /> Full Screen
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {userProfile.popDocumentName || 'bank_transfer_receipt.jpg'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Ref: {`${tenantBankDetails.referencePrefix}${userProfile.email.split('@')[0].toUpperCase()}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setFullScreenMediaModal({
                              isOpen: true,
                              title: "Uploaded Proof of Payment File",
                              logoUrl: userProfile.avatarUrl,
                              popUrl: userProfile.popDocumentUrl,
                              popName: userProfile.popDocumentName || 'payment_receipt.jpg',
                              userName: getFullName(userProfile),
                              email: userProfile.email,
                              phone: userProfile.contactNumber,
                              activeTab: 'pop'
                            });
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 shadow-sm active:scale-95"
                          title="View Proof of Payment File in Full Screen"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Full Screen</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => window.open(userProfile.popDocumentUrl, '_blank')}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Document in New Window"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => downloadDocumentFile(userProfile.popDocumentUrl, userProfile.popDocumentName || 'payment_receipt.pdf')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-amber-200 rounded-xl p-4 text-center text-xs text-amber-900 font-semibold">
                    Default Bank Transfer Receipt File submitted.
                  </div>
                )}
              </div>

              {/* 3. Transaction Details Grid */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs font-semibold space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Plan:</span>
                  <span className="text-slate-800 font-bold">$9.99 / Month Active Profile Pass</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deposit Bank:</span>
                  <span className="text-slate-800 font-bold">Global Community Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Number:</span>
                  <span className="text-slate-800 font-mono font-bold">9876-5432-1098-7654</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reference Code:</span>
                  <span className="text-amber-700 font-mono font-black">{`POP-${userProfile.email.split('@')[0].toUpperCase()}`}</span>
                </div>
              </div>

            </div>

            {/* Modal Decision Footer (Approve / Reject) */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setUserProfile((prev: any) => ({ ...prev, paymentStatus: 'unpaid', isSubscribed: false }));
                  setInspectingPopPayment(false);
                }}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-red-200"
              >
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Reject Payment</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserProfile((prev: any) => ({ ...prev, paymentStatus: 'paid', isSubscribed: true }));
                  setTenantIsActive(true);
                  setInspectingPopPayment(false);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Activate Pass</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Full-Screen / Large Tenant Overview Modal (Total Profit in Rands & Total Users) */}
      {showTenantOverviewModal && (
        <div className="fixed inset-0 z-[2800] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-lg w-full p-6 text-slate-800 my-auto max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white glossy-3d-container flex items-center justify-center shadow-md shrink-0">
                  <BarChart3 className="w-5 h-5 icon-shadow-3d" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Tenant Overview & Profit</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Real-time subscription metrics & user analytics</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTenantOverviewModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              
              {/* 1. Main Highlight: Total Subscription Profit in Rands (ZAR / R) */}
              <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white p-5 rounded-3xl shadow-xl relative overflow-hidden border border-purple-800/40">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingUp className="w-32 h-32 text-purple-400" />
                </div>

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300 bg-purple-900/60 px-2.5 py-0.5 rounded-full border border-purple-700/50 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      Subscription Revenue
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +18.4% this month
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-300 block font-semibold">Total Subscription Profit (Rands)</span>
                    <span className="text-2xl md:text-3xl font-black text-amber-400 tracking-tight block mt-0.5 font-sans">
                      R {(tenantBankDetails.monthlyFeeRands * 85).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-purple-800/50 grid grid-cols-2 gap-2 text-[10px] font-medium text-slate-300">
                    <div>
                      <span className="text-slate-400 block">Monthly Rate per User:</span>
                      <span className="font-bold text-white">R {tenantBankDetails.monthlyFeeRands.toFixed(2)} (${tenantBankDetails.monthlyFeeUsd.toFixed(2)})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Active Paid Subscribers:</span>
                      <span className="font-bold text-emerald-400">85 Active Users</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Total Users Card */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    Total Users Breakdown
                  </span>
                  <span className="text-xs font-black text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    124 Total Users
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Paid Subscribers</span>
                    <span className="text-lg font-black text-emerald-600 block mt-0.5">85 Users</span>
                    <span className="text-[9px] text-slate-400 font-medium">68.5% of total base</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Verified Accounts</span>
                    <span className="text-lg font-black text-blue-600 block mt-0.5">98 Users</span>
                    <span className="text-[9px] text-slate-400 font-medium">ID verified & approved</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">In Verification Review</span>
                    <span className="text-lg font-black text-amber-600 block mt-0.5">14 Users</span>
                    <span className="text-[9px] text-slate-400 font-medium">Pending 15-25 min check</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Unverified / Guest</span>
                    <span className="text-lg font-black text-slate-600 block mt-0.5">12 Users</span>
                    <span className="text-[9px] text-slate-400 font-medium">Require document upload</span>
                  </div>
                </div>

                {/* Progress bar visual distribution */}
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                    <span>User Verification Ratio</span>
                    <span className="text-emerald-700">79% Verified</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: '68%' }} title="Paid Active (68%)" />
                    <div className="bg-blue-500 h-full" style={{ width: '11%' }} title="Verified Unpaid (11%)" />
                    <div className="bg-amber-500 h-full" style={{ width: '11%' }} title="Under Review (11%)" />
                    <div className="bg-slate-400 h-full" style={{ width: '10%' }} title="Unverified (10%)" />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowTenantOverviewModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Close Overview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tenant Activities Modal */}
      {showTenantActivitiesModal && (
        <div className="fixed inset-0 z-[2900] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-lg w-full p-6 text-slate-800 my-auto max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-700 text-white glossy-3d-container flex items-center justify-center shadow-md shrink-0">
                  <Activity className="w-5 h-5 icon-shadow-3d" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Tenant Activities & Profit</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Manage monthly total profit, save archives & reset balance</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTenantActivitiesModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              
              {/* Total Users Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">Tenants Total Users</span>
                  <span className="text-xl font-black text-slate-900 mt-0.5 block">124 Total Users</span>
                  <span className="text-[10px] text-blue-600 font-semibold">85 Active Paid Subscribers • 39 Free/In Review</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              {/* Monthly Profit Card */}
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Monthly Total Profit (Rands)
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded-md border border-emerald-500/30">Active Period</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-2xl md:text-3xl font-black text-amber-400 tracking-tight font-sans">
                    R {currentProfitBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">(${ (currentProfitBalance / 18).toFixed(2) } USD)</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span>Saved Historical Profit:</span>
                  <span className="font-mono font-bold text-emerald-400">R {savedTenantProfit.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Action Buttons: Save Profit & Reset Profit Balance */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    playReviewChime();
                    setSavedTenantProfit(prev => prev + currentProfitBalance);
                    alert(`Successfully saved R ${currentProfitBalance.toFixed(2)} to historical profit archives.`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to reset the current profit balance to R 0.00?")) {
                      playReviewChime();
                      setCurrentProfitBalance(0);
                    }
                  }}
                  className="bg-red-50 hover:bg-red-100 active:scale-95 text-red-700 border border-red-200 font-extrabold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Balance</span>
                </button>
              </div>

              {/* Registered Tenants List with Profile Picture Logos */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Building className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Active Tenants Directory
                      </h3>
                      <p className="text-[10px] text-slate-500">Tenants profiles, total users & account activation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                      {tenantListings.filter(t => t.isActive).length} Active
                    </span>
                    {tenantListings.some(t => !t.isActive) && (
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-full">
                        {tenantListings.filter(t => !t.isActive).length} Unactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Scrollable Tenants List */}
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {tenantListings.map((tenant) => (
                    <div
                      key={tenant.id}
                      className={`bg-white rounded-2xl p-3 border transition-all flex items-center justify-between gap-3 group ${
                        tenant.isActive
                          ? 'border-slate-200/90 hover:border-indigo-400 hover:shadow-md'
                          : 'border-rose-200 bg-rose-50/20 opacity-85'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Profile Picture Logo Attached */}
                        <div className="relative shrink-0">
                          <img
                            src={tenant.avatar}
                            alt={tenant.name}
                            className={`w-12 h-12 rounded-full object-cover border-2 shadow-sm transition-transform ${
                              tenant.isActive
                                ? 'border-indigo-600 group-hover:scale-105'
                                : 'border-rose-400 grayscale'
                            }`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                            }}
                          />
                          {tenant.isVerified && tenant.isActive && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full shadow border-2 border-white" title="Verified Tenant">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {!tenant.isActive && (
                            <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white p-0.5 rounded-full shadow border-2 border-white" title="Account Unactive">
                              <XCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Tenant Info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-black text-slate-900 truncate">
                              {tenant.name}
                            </h4>
                            {tenant.isActive ? (
                              <span className="inline-flex items-center text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[9px] font-extrabold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-md">
                                Unactive
                              </span>
                            )}

                            {/* Tenant Total Users Attached */}
                            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/80 px-1.5 py-0.5 rounded-md">
                              <Users className="w-2.5 h-2.5 text-blue-600" />
                              <span>{tenant.totalUsers} Total Users</span>
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 truncate font-semibold mt-0.5">
                            {tenant.title}
                          </p>

                          <div className="flex items-center gap-2.5 text-[10px] text-slate-500 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 font-medium text-slate-600">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                              {tenant.location}
                            </span>
                            <span className="font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                              {tenant.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Action Controls: Activate/Deactivate & Locate Button */}
                      <div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0">
                        {/* Admin Make Tenant Account Unactive / Active Button */}
                        <button
                          type="button"
                          onClick={() => toggleTenantActive(tenant.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold transition-all flex items-center gap-1 shadow-sm active:scale-95 border ${
                            tenant.isActive
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                          }`}
                          title={tenant.isActive ? "Make tenant account unactive" : "Make tenant account active"}
                        >
                          {tenant.isActive ? (
                            <>
                              <Lock className="w-3 h-3 text-rose-600" />
                              <span>Make Unactive</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3 text-emerald-600" />
                              <span>Make Active</span>
                            </>
                          )}
                        </button>

                        {/* Map Focus Action Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setFlyToTrigger({ lat: tenant.lat, lng: tenant.lng, zoom: 16 });
                            setShowTenantActivitiesModal(false);
                            setActiveBottomTab('tenant');
                          }}
                          className="px-2 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-xl transition-all text-xs font-bold flex items-center gap-1 border border-indigo-200 hover:border-indigo-600 shadow-sm active:scale-95"
                          title="Locate and center on map"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Locate</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowTenantActivitiesModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Close Tenant Activities
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Subfee & Tenant Banking Information Setup Modal */}
      {showTenantSubfeeModal && (
        <div className="fixed inset-0 z-[2800] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-md w-full p-6 text-slate-800 my-auto max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white glossy-3d-container flex items-center justify-center shadow-md shrink-0">
                  <CreditCard className="w-5 h-5 icon-shadow-3d" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Subscription & Banking Setup</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Admin controls for Tenant, User subscription fees & Banking</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTenantSubfeeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              
              {/* 1. Tenant Monthly Subscription Fee Configuration */}
              <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-700" />
                    Tenant Subscription
                  </span>
                  <span className="text-[9px] font-black uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                    Tenant Pass
                  </span>
                </div>
                <p className="text-[10.5px] text-emerald-800 font-medium">
                  Monthly fee paid by property tenants and landlords for platform listing activation and TenantPoP pass.
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-emerald-900 mb-1">
                      Tenant Fee in Rands (R) *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-slate-400 text-xs font-bold">R</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editTenantFeeRands}
                        onChange={(e) => setEditTenantFeeRands(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-emerald-300 rounded-xl pl-7 pr-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="299.99"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-emerald-900 mb-1">
                      Tenant Fee in USD ($)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-slate-400 text-xs font-bold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editTenantFeeUsd}
                        onChange={(e) => setEditTenantFeeUsd(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-emerald-300 rounded-xl pl-7 pr-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="16.50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. User & Seeker Monthly Subscription Fee Configuration */}
              <div className="bg-blue-50/70 border border-blue-200/90 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-700" />
                    User / Seeker Subscription Fee (Admin)
                  </span>
                  <span className="text-[9px] font-black uppercase bg-blue-200 text-blue-900 px-2 py-0.5 rounded-md">
                    Seeker Profile
                  </span>
                </div>
                <p className="text-[10.5px] text-blue-800 font-medium">
                  Monthly fee paid by trade seekers and users to broadcast on the live map and maintain active profile status.
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-blue-900 mb-1">
                      User Fee in Rands (R) *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-slate-400 text-xs font-bold">R</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editUserFeeRands}
                        onChange={(e) => setEditUserFeeRands(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-blue-300 rounded-xl pl-7 pr-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="180.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-blue-900 mb-1">
                      User Fee in USD ($)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-slate-400 text-xs font-bold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editUserFeeUsd}
                        onChange={(e) => setEditUserFeeUsd(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-blue-300 rounded-xl pl-7 pr-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="9.99"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Official Deposit Banking Information Setup */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  Official Deposit Banking Information
                </span>
                <p className="text-[10px] text-slate-500 font-medium">
                  Official bank details where tenants and users deposit their monthly subscription payments.
                </p>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Bank Name *</label>
                    <input
                      type="text"
                      value={editBankName}
                      onChange={(e) => setEditBankName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. First National Bank / Global Community Bank"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Account Holder / Name *</label>
                    <input
                      type="text"
                      value={editAccountName}
                      onChange={(e) => setEditAccountName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. TimeGig Subscriptions"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Account / IBAN Number *</label>
                      <input
                        type="text"
                        value={editAccountNumber}
                        onChange={(e) => setEditAccountNumber(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="9876-5432-1098-7654"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">SWIFT / Branch Code</label>
                      <input
                        type="text"
                        value={editSwiftCode}
                        onChange={(e) => setEditSwiftCode(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="FIRNZAJJ / TGGBUS33"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Payment Reference Prefix</label>
                    <input
                      type="text"
                      value={editRefPrefix}
                      onChange={(e) => setEditRefPrefix(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="POP-"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowTenantSubfeeModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSavingSubfee}
                onClick={handleSaveSubfeeSettings}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isSavingSubfee ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Saving Banking & Fee...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Banking & Fee Settings</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tenant Activation Modal (R299.99 Monthly Fee & POP Upload) */}
      {showTenantActivationModal && (
        <div className="fixed inset-0 z-[2850] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-lg w-full p-6 text-slate-800 my-auto max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Tenant Feature Activation & Payment</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Pay R {(tenantBankDetails.tenantMonthlyFeeRands || 299.99).toFixed(2)} (${(tenantBankDetails.tenantMonthlyFeeUsd || 16.50).toFixed(2)} USD) monthly fee & upload proof of payment</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTenantActivationModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              
              {/* Fee & Bank Deposit Card */}
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-4 rounded-2xl shadow-xl space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    Monthly Activation Fee: R {(tenantBankDetails.tenantMonthlyFeeRands || 299.99).toFixed(2)} (${(tenantBankDetails.tenantMonthlyFeeUsd || 16.50).toFixed(2)} USD)
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded-md border border-emerald-500/30">Required</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Bank Name</span>
                    <span className="text-white font-bold">{tenantBankDetails.bankName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Account Name</span>
                    <span className="text-white font-bold truncate block">{tenantBankDetails.accountName}</span>
                  </div>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-2.5 flex items-center justify-between border border-slate-700/80">
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono uppercase block">Activation Account Number</span>
                    <span className="text-sm font-mono font-black text-emerald-400 tracking-wider">{tenantBankDetails.accountNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(tenantBankDetails.accountNumber.replace(/[^0-9A-Za-z]/g, ''));
                      setCopiedAccount(true);
                      setTimeout(() => setCopiedAccount(false), 2000);
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white p-2 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">SWIFT / Routing</span>
                    <span className="text-slate-200 font-mono font-bold">{tenantBankDetails.swiftCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Payment Reference</span>
                    <span className="text-amber-400 font-mono font-extrabold">{`${tenantBankDetails.referencePrefix}ACT-${userProfile.email.split('@')[0].toUpperCase()}`}</span>
                  </div>
                </div>
              </div>

              {/* Upload Proof of Payment Document Section */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    Upload Proof of Payment Document (for TenantPoP)
                  </span>
                  <span className="text-[10px] text-amber-700 font-extrabold bg-amber-100 px-2 py-0.5 rounded-full">Required</span>
                </label>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Upload your bank transfer receipt or payment screenshot from your device so Admin can receive and verify it in TenantPoP.
                </p>

                {uploadedPopName ? (
                  <div className="bg-white border border-emerald-300 p-3 rounded-xl flex items-center justify-between gap-2 shadow-sm">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-slate-900 truncate block">{uploadedPopName}</span>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Ready for submission
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUploadedPopName('');
                        setUploadedPopUrl('');
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl bg-white cursor-pointer transition-colors group">
                    <Upload className="w-7 h-7 text-emerald-500 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-slate-800">Upload Receipt or Screenshot from Device</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, PDF receipts supported</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handlePopFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-semibold">
                <span>Activation Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${tenantIsActive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {tenantIsActive ? 'ACTIVE (PAID)' : userProfile.paymentStatus === 'under_review' ? 'PENDING ADMIN REVIEW (TENANTPOP)' : 'INACTIVE (REQUIRES ACTIVATION)'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowTenantActivationModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmittingPop || !uploadedPopUrl}
                onClick={() => {
                  if (!uploadedPopUrl) {
                    alert("Please upload your Proof of Payment document from your device first.");
                    return;
                  }
                  setIsSubmittingPop(true);
                  playReviewChime();

                  setTimeout(() => {
                    setIsSubmittingPop(false);
                    setUserProfile((prev: any) => ({
                      ...prev,
                      paymentStatus: 'under_review',
                      popDocumentName: uploadedPopName,
                      popDocumentUrl: uploadedPopUrl,
                      popSubmittedAt: new Date().toISOString()
                    }));
                    setShowTenantActivationModal(false);
                    setShowPopReviewPopup(true);
                  }, 1200);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingPop ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting POP...</span>
                  </>
                ) : (
                  <>
                    <Receipt className="w-4 h-4" />
                    <span>Submit Proof of Payment for TenantPoP</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Full-Screen Media & Document Lightbox Modal for Tenant */}
      {fullScreenMediaModal && fullScreenMediaModal.isOpen && (
        <div className="fixed inset-0 z-[3500] bg-slate-950/95 backdrop-blur-xl text-white flex flex-col p-4 md:p-6 animate-in fade-in zoom-in-95 duration-200 overflow-hidden w-screen h-screen">
          
          {/* Top Full Screen Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800/80 gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-white font-black text-base flex items-center justify-center shadow-lg ring-2 ring-amber-400/40 shrink-0">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-extrabold text-white flex items-center gap-2">
                  <span>{fullScreenMediaModal.title}</span>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Full Screen Inspector
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                  <span>{fullScreenMediaModal.userName}</span> •
                  <span>{fullScreenMediaModal.email}</span> •
                  <span>{fullScreenMediaModal.phone}</span>
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setFullScreenMediaModal(prev => prev ? { ...prev, activeTab: 'both' } : null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  fullScreenMediaModal.activeTab === 'both' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Split View (Both)
              </button>
              <button
                onClick={() => setFullScreenMediaModal(prev => prev ? { ...prev, activeTab: 'logo' } : null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  fullScreenMediaModal.activeTab === 'logo' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                User Logo Full Screen
              </button>
              <button
                onClick={() => setFullScreenMediaModal(prev => prev ? { ...prev, activeTab: 'pop' } : null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  fullScreenMediaModal.activeTab === 'pop' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Proof of Payment Full Screen
              </button>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {userProfile.paymentStatus !== 'paid' && (
                <button
                  onClick={() => {
                    setUserProfile((prev: any) => ({ ...prev, paymentStatus: 'paid', isSubscribed: true }));
                    setTenantIsActive(true);
                    setFullScreenMediaModal(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Activate Pass</span>
                </button>
              )}

              <button
                onClick={() => setFullScreenMediaModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2.5 rounded-2xl transition-colors border border-slate-700"
                title="Close Full Screen View"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Full Screen Main Content Display Area */}
          <div className="flex-1 overflow-hidden pt-4 flex flex-col md:flex-row gap-4">
            
            {/* Panel 1: User Logo / Face Avatar */}
            {(fullScreenMediaModal.activeTab === 'both' || fullScreenMediaModal.activeTab === 'logo') && (
              <div className={`flex-1 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden group ${
                fullScreenMediaModal.activeTab === 'both' ? 'w-full md:w-1/2' : 'w-full h-full'
              }`}>
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/60 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    User Logo & Face Avatar
                  </span>
                </div>

                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-white/20 shadow-2xl ring-8 ring-blue-500/20 overflow-hidden bg-slate-800 flex items-center justify-center my-auto transition-transform group-hover:scale-105 duration-300">
                  {fullScreenMediaModal.logoUrl ? (
                    <img
                      src={fullScreenMediaModal.logoUrl}
                      alt={fullScreenMediaModal.userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl font-black text-white">{fullScreenMediaModal.userName.charAt(0).toUpperCase()}</span>
                  )}
                  {userProfile.verificationStatus === 'verified' && (
                    <span className="absolute bottom-2 right-2 w-10 h-10 bg-emerald-500 text-white rounded-full border-2 border-white flex items-center justify-center shadow-xl">
                      <CheckCircle2 className="w-6 h-6 fill-white text-emerald-600" />
                    </span>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <h3 className="text-lg font-black text-white">{fullScreenMediaModal.userName}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{fullScreenMediaModal.email}</p>
                  
                  {fullScreenMediaModal.logoUrl && (
                    <button
                      onClick={() => downloadDocumentFile(fullScreenMediaModal.logoUrl, `${fullScreenMediaModal.userName}_logo.jpg`)}
                      className="mt-3 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Logo Image</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Panel 2: Proof of Payment Document */}
            {(fullScreenMediaModal.activeTab === 'both' || fullScreenMediaModal.activeTab === 'pop') && (
              <div className={`flex-1 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden ${
                fullScreenMediaModal.activeTab === 'both' ? 'w-full md:w-1/2' : 'w-full h-full'
              }`}>
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/60 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-amber-400" />
                    Proof of Payment Document
                  </span>
                </div>

                {fullScreenMediaModal.popUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center my-auto overflow-hidden pt-8">
                    {fullScreenMediaModal.popUrl.startsWith('data:image') ? (
                      <div className="w-full flex-1 max-h-[70vh] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-2 flex items-center justify-center shadow-2xl">
                        <img
                          src={fullScreenMediaModal.popUrl}
                          alt="Proof of Payment Document"
                          className="max-w-full max-h-full object-contain rounded-xl"
                        />
                      </div>
                    ) : (
                      <div className="w-full flex-1 max-h-[70vh] rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center text-slate-300 text-center">
                        <FileText className="w-16 h-16 text-amber-400 mb-3" />
                        <span className="text-sm font-bold text-white block">{fullScreenMediaModal.popName}</span>
                        <span className="text-xs text-slate-400 mt-1">Official Document File</span>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between w-full pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-white block truncate">{fullScreenMediaModal.popName}</span>
                        <span className="text-[10px] text-amber-400 font-mono">Ref: {`POP-${fullScreenMediaModal.email.split('@')[0].toUpperCase()}`}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(fullScreenMediaModal.popUrl, '_blank')}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-xl text-xs font-bold transition-colors border border-slate-700 flex items-center gap-1"
                          title="Open Document in New Window"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>New Window</span>
                        </button>

                        <button
                          onClick={() => downloadDocumentFile(fullScreenMediaModal.popUrl, fullScreenMediaModal.popName)}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Document</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="my-auto text-center p-8 bg-slate-950 rounded-2xl border border-slate-800 max-w-md">
                    <Receipt className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-white">Default Payment Deposit Receipt</h4>
                    <p className="text-xs text-slate-400 mt-1">Bank transfer proof of payment record submitted by user.</p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* 60-Second Circular Countdown Loading Modal (Waiting for Seeker to Accept) */}
      {activeGigSession && activeGigSession.status === 'requesting' && (
        <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-sm w-full p-6 text-center text-slate-800 relative overflow-hidden">
            
            {/* Top Close / Cancel */}
            <button
              onClick={() => setActiveGigSession(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              title="Cancel Request"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Circular Countdown Timer (SVG Progress Ring) */}
            <div className="relative w-32 h-32 mx-auto my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-100"
                  strokeWidth="7"
                  fill="transparent"
                />
                {/* Dynamic Progress Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-purple-600 transition-all duration-1000 ease-linear"
                  strokeWidth="7"
                  strokeDasharray={263.89}
                  strokeDashoffset={263.89 * (1 - activeGigSession.countdown / 60)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Seeker Center Avatar with Pulsing Ping & Seconds */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-purple-600 shadow-md">
                  {activeGigSession.seekerAvatar ? (
                    <img src={activeGigSession.seekerAvatar} alt={activeGigSession.seekerName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-purple-600 text-white font-black flex items-center justify-center text-base">
                      {activeGigSession.seekerName.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="mt-1 text-xs font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full shadow-2xs">
                  {activeGigSession.countdown}s
                </span>
              </div>
            </div>

            <h3 className="text-base font-black text-slate-900 mt-2">Connecting to Seeker</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Waiting for <span className="font-bold text-purple-700">{activeGigSession.seekerName}</span> ({activeGigSession.seekerTrade}) to accept gig...
            </p>

            {/* Seeker Details Card */}
            <div className="bg-slate-50 border border-purple-100 rounded-2xl p-3 my-3 text-left space-y-1 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Trade Specialization:</span>
                <span className="text-slate-800 font-extrabold">{activeGigSession.seekerTrade}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Target Hourly Rate:</span>
                <span className="text-purple-700 font-black">{activeGigSession.seekerRate}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200/60 pt-1 mt-1">
                <span className="text-slate-400 font-medium">Status:</span>
                <span className="text-amber-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  Awaiting Acceptance (60s)
                </span>
              </div>
            </div>

            {/* Action Buttons: Instant Accept for Testing & Cancel */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={acceptGigBySeeker}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Accept Request Now</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowCancelGigModal(true);
                  setCancelParty('user');
                }}
                className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
                title="Cancel GiG and send reason"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel GiG</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Live Navigation Floating Top HUD (Seeker being directed to user's exact location) */}
      {activeGigSession && activeGigSession.status === 'guiding' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1500] pointer-events-auto w-full max-w-sm px-4 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-purple-500/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-purple-600 shrink-0 border border-purple-400">
                <img src={activeGigSession.seekerAvatar} alt={activeGigSession.seekerName} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full animate-ping" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800">
                    Live Guidance
                  </span>
                  <span className="text-xs font-black truncate">{activeGigSession.seekerName}</span>
                </div>
                <p className="text-[11px] text-purple-200 font-medium truncate mt-0.5">
                  Directing to your exact location • <span className="font-bold text-white">{activeGigSession.distance} ({activeGigSession.eta})</span>
                </p>
              </div>
            </div>

            {/* Action buttons: Cancel GiG with reason & Quick Skip */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowCancelGigModal(true);
                  setCancelParty('user');
                }}
                className="px-2 py-1.5 bg-rose-900/70 hover:bg-rose-900 text-rose-200 border border-rose-700/60 font-bold text-[9.5px] rounded-xl shrink-0 transition-colors"
                title="Cancel GiG and send reason"
              >
                Cancel GiG
              </button>

              <button
                type="button"
                onClick={() => {
                  speakLadyVoice("Arrived at gig.");
                  playReviewChime();
                  setActiveGigSession(prev => prev ? {
                    ...prev,
                    status: 'arrived',
                    seekerCurrentPos: prev.userTargetPos
                  } : null);
                }}
                className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-extrabold text-[10px] rounded-xl shrink-0 transition-transform shadow-sm"
                title="Fast forward to arrival"
              >
                Skip to Arrival
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seeker Arrived Active Gig HUD (ONLY USER CAN CLICK ON GIG COMPLETED) */}
      {activeGigSession && activeGigSession.status === 'arrived' && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[1500] pointer-events-auto w-full max-w-md px-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white/95 backdrop-blur-md text-slate-900 p-4 rounded-3xl shadow-2xl border-2 border-emerald-500 ring-4 ring-emerald-500/20">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                  Seeker Arrived • Gig Active
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {Math.floor(activeGigSession.elapsedSeconds / 60).toString().padStart(2, '0')}:
                  {(activeGigSession.elapsedSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img src={activeGigSession.seekerAvatar} alt={activeGigSession.seekerName} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500 shrink-0" />
                <div className="overflow-hidden">
                  <h4 className="text-sm font-black text-slate-900 truncate">{activeGigSession.seekerName}</h4>
                  <p className="text-xs text-purple-700 font-bold truncate">{activeGigSession.seekerTrade}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Rate: {activeGigSession.seekerRate}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Est. Total</span>
                <span className="text-base font-black text-emerald-700">
                  {activeGigSession.seekerRate}
                </span>
              </div>
            </div>

            {/* ONLY USER CAN CLICK GIG COMPLETED NOTICE & ACTION */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 mb-3 text-center">
              <p className="text-[11px] font-extrabold text-amber-900 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Only user can click on Gig Completed</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCancelGigModal(true);
                  setCancelParty('user');
                }}
                className="px-3 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-2xl text-xs transition-colors border border-rose-200 flex items-center justify-center gap-1 shrink-0"
                title="Cancel GiG and send reason"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Cancel GiG</span>
              </button>

              <button
                type="button"
                onClick={handleUserCompleteGig}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white font-black rounded-2xl text-sm transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-white fill-white text-emerald-600" />
                <span>Gig Completed</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gig Completed Summary & Rating Receipt Modal */}
      {showGigSummaryModal && lastCompletedGig && (
        <div className="fixed inset-0 z-[3200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-sm w-full p-6 text-center text-slate-800">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 ring-8 ring-emerald-50 shadow-inner">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h3 className="text-lg font-black text-slate-900">Gig Successfully Completed!</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Thank you for using Timegig. The seeker's job is marked complete.
            </p>

            {/* Receipt Breakdown Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 my-3 text-left space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Seeker:</span>
                <span className="text-slate-900 font-bold">{lastCompletedGig.seekerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Trade Service:</span>
                <span className="text-purple-700 font-extrabold">{lastCompletedGig.seekerTrade}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Time Elapsed:</span>
                <span className="font-mono font-bold text-slate-800">
                  {Math.floor(lastCompletedGig.elapsedSeconds / 60)}m {lastCompletedGig.elapsedSeconds % 60}s
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200/60 pt-1.5 mt-1.5">
                <span className="text-slate-900 font-extrabold">Final Rate / Total:</span>
                <span className="text-emerald-700 font-black text-sm">{lastCompletedGig.seekerRate}</span>
              </div>
            </div>

            {/* 5-Star Rating */}
            <div className="my-2">
              <span className="text-[11px] font-bold text-slate-600 block mb-1">Rate Seeker's Work:</span>
              <div className="flex items-center justify-center gap-1.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setLastCompletedGig(prev => prev ? { ...prev, rating: star } : null)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= (lastCompletedGig.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowGigSummaryModal(false);
                setLastCompletedGig(null);
              }}
              className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold py-3 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              Close & Finalize Receipt
            </button>
          </div>
        </div>
      )}

      {/* 2. Floating Live Search Bar */}
      <div 
        ref={searchContainerRef}
        className="absolute top-4 right-4 z-[1000] pointer-events-auto flex flex-col items-end"
      >
        {!isSearchExpanded ? (
          <button
            onClick={() => setIsSearchExpanded(true)}
            className="w-11 h-11 bg-white rounded-2xl glossy-3d-container shadow-xl border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all duration-200 active:scale-90"
            title="Search map"
          >
            <FlatIcon icon={Search} className="w-9 h-9" />
          </button>
        ) : (
          <div className="w-full max-w-sm px-4 md:px-0 animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  autoFocus
                  placeholder="Type home number, street, location, province..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!e.target.value) {
                      setSearchResults([]);
                      setShowSearchDropdown(false);
                    }
                  }}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowSearchDropdown(true);
                  }}
                  className="w-full bg-white/95 backdrop-blur-md text-sm text-slate-800 placeholder-slate-400 pl-11 pr-24 py-3 rounded-2xl shadow-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute left-4 text-slate-400">
                  <FlatIcon icon={Search} className="w-8 h-8" />
                </div>
                <div className="absolute right-2.5 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        setShowSearchDropdown(false);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-700 text-white rounded-xl glossy-3d-container shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50"
                    title="Search Address"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4 rotate-45 icon-shadow-3d" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchExpanded(false);
                      setShowSearchDropdown(false);
                    }}
                    className="w-10 h-10 bg-white text-slate-400 hover:text-slate-600 rounded-xl glossy-3d-container shadow-md transition-all duration-200 active:scale-95"
                    title="Collapse Search Bar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Search Results Dropdown with Home number, street, location & province */}
            {showSearchDropdown && (searchResults.length > 0 || isSearching) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden z-[1000] max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                {isSearching ? (
                  <div className="flex items-center justify-center py-6 text-slate-500 text-sm">
                    <Loader2 className="w-5 h-5 animate-spin mr-2 text-blue-500" />
                    Locating address & coordinates...
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {searchResults.map((item, index) => (
                      <li key={item.place_id || index}>
                        <button
                          type="button"
                          onClick={() => selectSearchResult(item)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50/50 flex items-start gap-3 transition-colors duration-150 text-xs text-slate-700 font-medium group"
                        >
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 glossy-3d-container group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
              <FlatIcon icon={Search} className="w-7 h-7" />
            </div>
                          <div className="overflow-hidden min-w-0">
                            <p className="font-extrabold text-slate-900 truncate leading-snug">{item.name || 'Location'}</p>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">{item.subtitle || item.display_name}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 ml-auto shrink-0 self-center group-hover:text-blue-600 transition-colors" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Searched Location Return-to-Exact-Location Bar */}
      {exactLocationPinnedEnabled && clickedPos && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1100] pointer-events-auto w-full max-w-md px-4 animate-in slide-in-from-top-4 duration-200">
          <div className="bg-white/95 backdrop-blur-md p-2.5 px-3.5 rounded-2xl shadow-2xl border border-blue-500/40 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 overflow-hidden">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 animate-bounce" />
              <div className="overflow-hidden">
                <span className="text-[8px] font-black uppercase tracking-wider text-rose-600 block leading-none">Exact Location Pinned</span>
                <p className="text-xs font-extrabold text-slate-900 truncate max-w-[180px] sm:max-w-[240px] leading-tight mt-0.5">{clickedAddress}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReturnToMyExactLocation}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 shrink-0 transition-transform"
              title="Return back to your exact GPS location"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Back to My Location</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Floating Tool & Layer Sidebar */}
      <div className="absolute right-4 top-20 z-[1000] flex flex-col gap-2.5 pointer-events-auto">
        {/* User Location Floating Button (On top of Map Theme Styles) */}
        <button
          onClick={handleLocationButtonClick}
          title="Fly straight to my exact GPS location"
          className={`flex items-center justify-center w-11 h-11 rounded-2xl glossy-3d-container shadow-lg border transition-all duration-200 active:scale-90 ${
            showPinpointer && userPos
              ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700'
              : 'bg-white text-slate-700 border-slate-200/80'
          }`}
        >
          {geoState === 'locating' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Crosshair className={`w-5 h-5 icon-shadow-3d ${showPinpointer && userPos ? 'scale-110' : ''}`} />
          )}
        </button>

        {/* Map Styles Layer Config Selector Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowThemePanel(!showThemePanel)}
            title="Toggle map styles"
            className={`flex items-center justify-center w-11 h-11 rounded-2xl glossy-3d-container shadow-lg border transition-all duration-200 active:scale-90 ${
              showThemePanel 
                ? 'bg-slate-900 text-white border-slate-800' 
                : 'bg-white text-slate-700 border-slate-200/80'
            }`}
          >
            <FlatIcon icon={FileText} className="w-9 h-9" />
          </button>

          {/* Dynamic Map Theme Selection Drawer */}
          {showThemePanel && (
            <div className="absolute right-14 top-0 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-200/80 w-64 animate-in slide-in-from-right-3 fade-in duration-200 z-[1000]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapIcon className="w-3.5 h-3.5 text-blue-500" />
                  Map Theme Styles
                </span>
                <button 
                  onClick={() => setShowThemePanel(false)}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {MAP_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme)}
                    className={`text-left px-3 py-2 rounded-xl transition-all duration-150 flex items-start flex-col ${
                      activeTheme.id === theme.id
                        ? 'bg-blue-50 border border-blue-200 text-blue-900'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight flex items-center justify-between w-full">
                      {theme.name}
                      {activeTheme.id === theme.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      {theme.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Zoom Feature (+ / -) directly under Map Theme Styles */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => setZoomTrigger(1)}
            title="Zoom In"
            className="flex items-center justify-center w-11 h-11 bg-white text-slate-700 rounded-2xl glossy-3d-container shadow-lg border border-slate-200/80 transition-all duration-200 active:scale-90"
          >
            <Plus className="w-5 h-5 icon-shadow-3d" />
          </button>
          <button
            onClick={() => setZoomTrigger(-1)}
            title="Zoom Out"
            className="flex items-center justify-center w-11 h-11 bg-white text-slate-700 rounded-2xl glossy-3d-container shadow-lg border border-slate-200/80 transition-all duration-200 active:scale-90"
          >
            <Minus className="w-5 h-5 icon-shadow-3d" />
          </button>
        </div>
      </div>

      {/* 5. Bottom Sliding Feature Menu Bar (White background, non-floating, label under icon) */}
      <div className="fixed bottom-0 left-0 right-0 z-[1100] w-full bg-white border-t border-slate-200/90 shadow-2xl px-2 py-2 flex flex-col items-center pointer-events-auto">
        
        {/* Seekers Feature Drawer with Full Screen Experience */}
        {activeBottomTab === 'seekers' && (
          <div className="mb-2 bg-white p-3 md:p-4 rounded-3xl shadow-2xl border border-slate-200/90 w-[96vw] max-w-4xl text-center animate-in slide-in-from-bottom-2 fade-in duration-200 ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white glossy-3d-container shrink-0">
                  <Users className="w-4 h-4 icon-shadow-3d" />
                </div>
                <h3 className="text-sm font-black text-purple-700 uppercase tracking-wider">Seekers • Hire Me Board</h3>
              </div>
              <button 
                onClick={() => setActiveBottomTab(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                title="Close Seekers"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 h-full max-h-[65vh] overflow-hidden">
              {/* Left Column: My Status & Broadcast */}
              <div className="md:col-span-4 space-y-3">
                {/* Seeker Profile Card Header */}
                <div className="flex items-center justify-between gap-1.5 bg-slate-50 p-2 rounded-2xl border border-slate-100 text-left shadow-sm">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="relative w-10 h-10 rounded-2xl ring-2 ring-purple-500/20 overflow-hidden shrink-0 bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm glossy-3d-container shadow-sm">
                      {userProfile.avatarUrl ? (
                        <img src={userProfile.avatarUrl} alt={getFullName(userProfile)} className="w-full h-full object-cover" />
                      ) : (
                        getFullName(userProfile).charAt(0).toUpperCase()
                      )}
                      {userProfile.verificationStatus === 'verified' && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <h4 className="text-xs font-black text-slate-900 truncate leading-none">{getFullName(userProfile)}</h4>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100/60 px-1.5 py-0.5 rounded inline-block truncate mt-1">
                        {userProfile.seekerTradeType || 'Electrician'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full ${
                      seekerAppearOnMap 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${seekerAppearOnMap ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      {seekerAppearOnMap ? 'LIVE' : 'OFF'}
                    </span>
                  </div>
                </div>

                {/* Broadcast Toggle */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  seekerAppearOnMap 
                    ? 'bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white border-purple-800 shadow-lg' 
                    : 'bg-slate-50 border-slate-200/90 text-slate-800'
                }`}>
                  <div className="flex flex-col items-center justify-center text-center gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center glossy-3d-container ${seekerAppearOnMap ? 'bg-amber-500 text-white' : 'bg-purple-600 text-white'}`}>
                        <Zap className={`w-4 h-4 icon-shadow-3d ${seekerAppearOnMap ? 'animate-pulse' : ''}`} />
                      </div>
                      <span className={`text-xs font-black uppercase tracking-wider ${seekerAppearOnMap ? 'text-white' : 'text-slate-900'}`}>
                        Appear to Get Hired
                      </span>
                    </div>

                    <p className={`text-[10px] font-medium leading-relaxed ${seekerAppearOnMap ? 'text-purple-200' : 'text-slate-500'}`}>
                      {seekerAppearOnMap 
                        ? "Your profile is broadcasting live on the map to nearby employers." 
                        : "Turn ON to broadcast your trade profile on the map."}
                    </p>

                    {/* Sleek Interactive Button instead of switch */}
                    <div className="flex items-center justify-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          playReviewChime();
                          const nextState = !seekerAppearOnMap;
                          setSeekerAppearOnMap(nextState);

                          if (nextState) {
                            locateUser();
                            if (userPos && isValidCoordinate(userPos[0], userPos[1])) {
                              setFlyToTrigger({ lat: userPos[0], lng: userPos[1], zoom: 16 });
                            }
                            logEverydayActivity("Started Map Broadcast", "profile", "Activated 'Appear to Get Hired' visibility on the live map.", "Live Broadcast");
                          } else {
                            logEverydayActivity("Stopped Map Broadcast", "profile", "Deactivated trade visibility from the live map.", "Offline");
                          }
                        }}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                          seekerAppearOnMap 
                            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20' 
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                        }`}
                      >
                        {seekerAppearOnMap ? (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>STOP BROADCASTING</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 fill-white" />
                            <span>START BROADCASTING</span>
                          </>
                        )}
                      </button>
                    </div>

                    {seekerAppearOnMap && (
                      <button
                        type="button"
                        onClick={() => {
                          if (userPos && isValidCoordinate(userPos[0], userPos[1])) {
                            setFlyToTrigger({ lat: userPos[0], lng: userPos[1], zoom: 16 });
                          } else {
                            locateUser();
                          }
                        }}
                        className="w-full mt-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[10px] font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Crosshair className="w-3 h-3" />
                        <span>Re-Center Map Broadcast</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Nearby Seekers List */}
              <div className="md:col-span-8 flex flex-col text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Nearby Verified Seekers for Hire
                  </span>
                  <div className="flex items-center gap-2">
                     {/* Trade Filter Dropdown */}
                     <select
                        value={selectedTradeFilter}
                        onChange={(e) => setSelectedTradeFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-[9px] font-black text-slate-600 focus:outline-none"
                     >
                        <option value="All Trades">All Trades</option>
                        <option value="Electrician">Electricians</option>
                        <option value="Plumber">Plumbers</option>
                        <option value="Handyman">Handymen</option>
                        <option value="Solar">Solar Techs</option>
                     </select>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 pb-2 custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {seekersListings
                      .filter(s => selectedTradeFilter === 'All Trades' || s.trade.includes(selectedTradeFilter))
                      .map((seeker) => (
                      <div 
                        key={seeker.id} 
                        onClick={() => {
                          setViewingUserProfile({
                            firstName: seeker.name.split(' ')[0],
                            middleName: '',
                            surname: seeker.name.split(' ').slice(1).join(' '),
                            dob: 'Hidden',
                            contactNumber: '+27 (0) ' + (Math.floor(Math.random() * 90000000) + 10000000),
                            email: seeker.name.toLowerCase().replace(' ', '.') + '@gmail.com',
                            address: 'Hidden',
                            avatarUrl: seeker.avatar,
                            verificationStatus: 'verified',
                            seekerTradeType: seeker.trade.split(' • ')[0] || seeker.trade,
                            seekerTradeExperienceYears: seeker.reviews + ' Reviews',
                            seekerHourlyRate: seeker.hourly,
                            seekerBioSummary: `Verified ${seeker.trade} seeker with a rating of ${seeker.rating} and ${seeker.reviews} completed jobs.`,
                            seekerWorkExperiences: [
                              {
                                id: 'mock-1',
                                companyOrProject: 'Verified Projects',
                                roleTitle: seeker.trade,
                                duration: '2022 - 2025',
                                description: 'Consistently delivered high-quality trade services to clients in the region.'
                              }
                            ],
                            activityHistory: []
                          });
                          setShowProfileModal(true);
                        }}
                        className="bg-white hover:bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-start gap-3 transition-all group hover:shadow-md hover:border-purple-200 cursor-pointer"
                      >
                        <div className="relative shrink-0">
                          <img src={seeker.avatar} alt={seeker.name} className="w-11 h-11 rounded-2xl object-cover shadow-sm ring-1 ring-slate-100" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <h5 className="text-[11px] font-black text-slate-900 truncate leading-none">{seeker.name}</h5>
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">{seeker.hourly}</span>
                          </div>
                          <p className="text-[10px] text-purple-700 font-bold mt-1 truncate">{seeker.trade}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                              <span className="text-[9px] font-black text-slate-600">{seeker.rating}</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold">•</span>
                            <span className="text-[9px] text-slate-400 font-bold">{seeker.reviews} reviews</span>
                            <span className="text-[9px] text-slate-400 font-bold">•</span>
                            <span className="text-[9px] text-blue-600 font-bold">{calculateDistanceText(seeker.lat, seeker.lng)}</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => startHiringFlow(seeker)}
                            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-[10px] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-purple-500/10"
                          >
                            <Zap className="w-3 h-3" />
                            <span>HIRE NOW</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeBottomTab === 'gigs' && (
          <div className="mb-2 bg-white p-4 rounded-3xl shadow-2xl border border-slate-200/90 max-w-fit w-full text-slate-800 animate-in slide-in-from-bottom-2 fade-in duration-200 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-100 gap-6">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>GiGs</span>
              </span>
              <button 
                onClick={() => setActiveBottomTab(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

              <button
                type="button"
                onClick={openCreateGigModal}
                className="w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-700 active:scale-90 text-white glossy-3d-container shadow-xl shadow-amber-500/30 group ring-4 ring-white rounded-3xl"
                title="Create a GiG"
              >
                <Plus className="w-10 h-10 stroke-[3.5] group-hover:scale-110 transition-transform icon-shadow-3d" />
              </button>
            
            <span className="text-[9px] font-black text-amber-900 mt-3 uppercase tracking-tighter opacity-80">Post a new GiG</span>
          </div>
        )}

        {activeBottomTab === 'tenant' && (
          <div className="mb-2 bg-white p-3 rounded-2xl shadow-2xl border border-slate-200/90 max-w-fit inline-flex flex-col items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <div className="w-full flex items-center justify-between gap-6 pb-1 border-b border-slate-100">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider flex items-center gap-1">
                <Home className="w-3 h-3 text-emerald-600" />
                Tenant Features
              </span>
              <button 
                onClick={() => setActiveBottomTab(null)} 
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Phone Menu Style Feature Icons */}
            <div className="flex items-center gap-4 px-2 py-1">
              {/* Verification Feature Icon */}
              <button
                onClick={() => setInspectingApplicant(true)}
                className="relative flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="Open Tenant Verification Inspector"
              >
                {pendingVerificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-black rounded-full text-[9px] flex items-center justify-center shadow-md animate-pulse z-10">
                    {pendingVerificationCount}
                  </span>
                )}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-800 text-white glossy-3d-container group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <ShieldCheck className="w-5 h-5 icon-shadow-3d" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Verification</span>
              </button>

              {/* UserPoP Feature Icon (Changed from TenantPoP) */}
              <button
                onClick={() => setInspectingPopPayment(true)}
                className="relative flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="Open UserPoP Inspector (Proof of Payment)"
              >
                {pendingPopCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-black rounded-full text-[9px] flex items-center justify-center shadow-md animate-pulse z-10">
                    {pendingPopCount}
                  </span>
                )}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-700 text-white glossy-3d-container group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <Receipt className="w-5 h-5 icon-shadow-3d" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">UserPoP</span>
              </button>

              {/* Overview Feature Icon */}
              <button
                onClick={() => setShowTenantOverviewModal(true)}
                className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="Open Tenant Overview & Subscription Profit"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-800 text-white glossy-3d-container group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <BarChart3 className="w-5 h-5 icon-shadow-3d" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Overview</span>
              </button>

              {/* Subfee Feature Icon */}
              <button
                onClick={() => {
                  setEditTenantFeeRands(tenantBankDetails.tenantMonthlyFeeRands || 299.99);
                  setEditTenantFeeUsd(tenantBankDetails.tenantMonthlyFeeUsd || 16.50);
                  setEditUserFeeRands(tenantBankDetails.userMonthlyFeeRands || tenantBankDetails.monthlyFeeRands || 180);
                  setEditUserFeeUsd(tenantBankDetails.userMonthlyFeeUsd || tenantBankDetails.monthlyFeeUsd || 9.99);
                  setEditBankName(tenantBankDetails.bankName);
                  setEditAccountName(tenantBankDetails.accountName);
                  setEditAccountNumber(tenantBankDetails.accountNumber);
                  setEditSwiftCode(tenantBankDetails.swiftCode);
                  setEditRefPrefix(tenantBankDetails.referencePrefix);
                  setShowTenantSubfeeModal(true);
                }}
                className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="Configure Subscription Fee & Banking Info"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-800 text-white glossy-3d-container group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <CreditCard className="w-5 h-5 icon-shadow-3d" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Subfee</span>
              </button>

              {/* Team Invite Feature Icon */}
              <button
                onClick={() => setShowTeamInviteModal(true)}
                className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="Invite Users to Your Team"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-700 text-white glossy-3d-container group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <Plus className="w-5 h-5 icon-shadow-3d" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Invite Team</span>
              </button>

              {/* Activation Feature Icon */}
              <button
                onClick={() => setShowTenantActivationModal(true)}
                className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="Pay R299.99 Monthly Tenant Activation Fee"
              >
                <div className={`w-11 h-11 rounded-2xl ${tenantIsActive ? 'bg-gradient-to-br from-emerald-500 to-emerald-800 shadow-emerald-500/20' : 'bg-gradient-to-br from-amber-400 to-amber-700 shadow-amber-500/20 animate-bounce'} text-white glossy-3d-container group-hover:shadow-lg group-hover:scale-105 transition-all`}>
                  <Zap className="w-5 h-5 icon-shadow-3d" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Activation</span>
              </button>
            </div>

            {/* Tenant Listings List with Profile Picture Logo Attached */}
            <div className="mt-2 pt-2 border-t border-slate-100 w-full max-w-sm space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">Registered Tenants ({tenantListings.length})</span>
              {tenantListings.map((tenant) => (
                <div
                  key={tenant.id}
                  onClick={() => {
                    setFlyToTrigger({ lat: tenant.lat, lng: tenant.lng, zoom: 16 });
                  }}
                  className="bg-slate-50 hover:bg-slate-100 p-2 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="relative w-9 h-9 rounded-full ring-2 ring-emerald-500 overflow-hidden bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      {tenant.avatar ? (
                        <img src={tenant.avatar} alt={tenant.name} className="w-full h-full object-cover" />
                      ) : (
                        tenant.name.charAt(0).toUpperCase()
                      )}
                      {tenant.isVerified && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                        <span>{tenant.name}</span>
                        {tenant.isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate font-medium">{tenant.title}</p>
                      <p className="text-[9px] text-slate-400 truncate font-mono">{tenant.location}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-emerald-700 block">{tenant.price}</span>
                    <span className="text-[9px] text-blue-600 font-bold group-hover:underline">View Map</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Feature Drawer (Same features as Tenant without Activation) */}
        {activeBottomTab === 'admin' && (
          <div className="mb-2 bg-white p-3 rounded-2xl shadow-2xl border border-slate-200/90 max-w-fit inline-flex flex-col items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <div className="w-full flex items-center justify-between gap-6 pb-1 border-b border-slate-100">
              <span className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-blue-600" />
                Admin Controls
              </span>
              <button 
                onClick={() => setActiveBottomTab(null)} 
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Phone Menu Style Feature Icons (Tenant verification & TenantPoP) */}
            <div className="flex items-center gap-4 px-2 py-1">
              <button
                onClick={() => setInspectingApplicant(true)}
                className="relative flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="Verification"
              >
                {pendingVerificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-black rounded-full text-[9px] flex items-center justify-center shadow-md animate-pulse z-10">
                    {pendingVerificationCount}
                  </span>
                )}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-800 text-white glossy-3d-container group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <ShieldCheck className="w-5 h-5 icon-shadow-3d" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Verification</span>
              </button>

              {/* UserPoP Feature Icon for Admin */}
              <button
                onClick={() => setInspectingPopPayment(true)}
                className="relative flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="Open UserPoP Inspector (Proof of Payment)"
              >
                {pendingPopCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-black rounded-full text-[9px] flex items-center justify-center shadow-md animate-pulse z-10">
                    {pendingPopCount}
                  </span>
                )}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-700 text-white glossy-3d-container group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <Receipt className="w-5 h-5 icon-shadow-3d" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">UserPoP</span>
              </button>

              <button
                onClick={() => setInspectingPopPayment(true)}
                className="relative flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="Open TenantsPoP Inspector"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-700 text-white glossy-3d-container group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <Building2 className="w-5 h-5 icon-shadow-3d" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">TenantsPoP</span>
              </button>

              <button
                onClick={() => setShowTenantOverviewModal(true)}
                className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="Overview"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-800 text-white glossy-3d-container group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <BarChart3 className="w-5 h-5 icon-shadow-3d" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Overview</span>
              </button>

              <button
                onClick={() => {
                  setEditTenantFeeRands(tenantBankDetails.tenantMonthlyFeeRands || 299.99);
                  setEditTenantFeeUsd(tenantBankDetails.tenantMonthlyFeeUsd || 16.50);
                  setEditUserFeeRands(tenantBankDetails.userMonthlyFeeRands || tenantBankDetails.monthlyFeeRands || 180);
                  setEditUserFeeUsd(tenantBankDetails.userMonthlyFeeUsd || tenantBankDetails.monthlyFeeUsd || 9.99);
                  setEditBankName(tenantBankDetails.bankName);
                  setEditAccountName(tenantBankDetails.accountName);
                  setEditAccountNumber(tenantBankDetails.accountNumber);
                  setEditSwiftCode(tenantBankDetails.swiftCode);
                  setEditRefPrefix(tenantBankDetails.referencePrefix);
                  setShowTenantSubfeeModal(true);
                }}
                className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="Subfee"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-800 text-white glossy-3d-container group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <CreditCard className="w-5 h-5 icon-shadow-3d" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Subfee</span>
              </button>

              <button
                onClick={() => setShowTenantActivitiesModal(true)}
                className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="Tenant Activities & Profit"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-indigo-700 text-white glossy-3d-container group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <Activity className="w-5 h-5 icon-shadow-3d" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Activities</span>
              </button>
            </div>
          </div>
        )}

        {/* Settings Feature Drawer (Sliding Feature) */}
        {(activeBottomTab as any) === 'settings' && (
          <div className="fixed inset-0 z-[2000] bg-white text-slate-800 animate-in fade-in slide-in-from-bottom duration-300 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-slate-700 text-white glossy-3d-container">
                  <Settings className="w-6 h-6 icon-shadow-3d" />
                </div>
                <h2 className="text-lg font-black text-slate-900">App & Account Settings</h2>
              </div>
              <button 
                onClick={() => setActiveBottomTab(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Settings Swipe Tabs Header */}
            <div className="px-4 py-3 shrink-0">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/60">
                <button
                  onClick={() => setSettingsActiveTab('general')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    settingsActiveTab === 'general' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>GENERAL</span>
                </button>
                <button
                  onClick={() => setSettingsActiveTab('account')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    settingsActiveTab === 'account' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>ACCOUNT</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-10 custom-scrollbar">
              {settingsActiveTab === 'general' ? (
                <div className="space-y-5 animate-in slide-in-from-left-6 duration-300">
                  {/* Sound & Audio Toggle Card */}
                  <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl glossy-3d-container ${soundEnabled ? 'bg-blue-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {soundEnabled ? <Volume2 className="w-5 h-5 icon-shadow-3d" /> : <VolumeX className="w-5 h-5 icon-shadow-3d" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-800">Sound & Audio</span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium block mt-0.5">
                          Voice announcements and audio chimes
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all shadow-md active:scale-95 ${
                        soundEnabled ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {soundEnabled ? 'TURN OFF' : 'TURN ON'}
                    </button>
                  </div>

                  {/* Exact Location Pinned Toggle Card */}
                  <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl glossy-3d-container ${exactLocationPinnedEnabled ? 'bg-rose-500 text-white' : 'bg-slate-500 text-white'}`}>
                        <MapPin className="w-5 h-5 icon-shadow-3d" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-800">Exact Location Pin</span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium block mt-0.5">
                          Show pinned location banner and marker
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !exactLocationPinnedEnabled;
                        setExactLocationPinnedEnabled(next);
                        if (!next) {
                          setClickedPos(null);
                          setClickedAddress('');
                          setRoutePoints([]);
                          setRouteDetails(null);
                          speakLadyVoice("Exact location pinned turned off.");
                        } else {
                          speakLadyVoice("Exact location pinned turned on.");
                        }
                        playReviewChime();
                      }}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all shadow-md active:scale-95 ${
                        exactLocationPinnedEnabled ? 'bg-rose-600 text-white shadow-rose-500/20' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {exactLocationPinnedEnabled ? 'TURN OFF' : 'TURN ON'}
                    </button>
                  </div>

                  {/* Other App Toggles */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-white glossy-3d-container">
                          <Navigation className="w-6 h-6 text-white rotate-45 icon-shadow-3d" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-800 block">GPS Auto-Center</span>
                          <span className="text-xs text-slate-400 font-medium">Follow live location</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setAutoCenter(!autoCenter)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all shadow-md active:scale-95 ${
                          autoCenter ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {autoCenter ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-700 text-white glossy-3d-container">
                          <RotateCcw className="w-6 h-6 text-white icon-shadow-3d" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-800 block">Auto-Save States</span>
                          <span className="text-xs text-slate-400 font-medium">Save data across reloads</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all shadow-md active:scale-95 ${
                          autoSaveEnabled ? 'bg-purple-600 text-white shadow-purple-500/20' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {autoSaveEnabled ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-in slide-in-from-right-6 duration-300">
                  {/* Persistent Profile Status Card */}
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200/80 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Verification</span>
                      <span className="text-sm font-black text-slate-900 flex items-center gap-2 mt-1">
                        {getFullName(userProfile)}
                        {userProfile.verificationStatus === 'verified' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </span>
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${
                      userProfile.verificationStatus === 'verified'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : userProfile.verificationStatus === 'under_review'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {userProfile.verificationStatus === 'verified' ? 'Verified' : userProfile.verificationStatus === 'under_review' ? 'In Review' : 'Unverified'}
                    </span>
                  </div>

                  {/* Account Management */}
                  <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Account Management
                    </span>
                    {isAccountDisabled ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountDisabled(false);
                          playReviewChime();
                          speakLadyVoice("Account reactivated successfully.");
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Reactivate Account</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowDisableConfirmModal(true)}
                        className="w-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 active:scale-95"
                      >
                        <UserX className="w-4 h-4 text-amber-700" />
                        <span>Disable Account</span>
                      </button>
                    )}
                  </div>

                  {/* Reset Data & Logout Section */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset account and saved profile state to defaults?")) {
                          localStorage.removeItem('timegig_user_profile');
                          window.location.reload();
                        }
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-500" />
                      <span>Reset Saved Profile State</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Are you sure you want to log out of Timegig?")) {
                          setIsLoggedOut(true);
                          setActiveGigSession(null);
                          setActiveBottomTab(null);
                          playReviewChime();
                        }
                      }}
                      className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 text-xs font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                onClick={() => setActiveBottomTab(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl text-sm transition-all shadow-xl active:scale-95"
              >
                DONE
              </button>
            </div>
          </div>
        )}

        {/* Sliding Menu Navigation Bar */}
        {(activeBottomTab as any) !== 'settings' && (
          <div className="w-full max-w-md flex items-center">
            
            {/* Scroll Left Button */}
            <button
              onClick={() => {
                if (menuScrollRef.current) menuScrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
              title="Slide Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Horizontally Scrollable / Sliding Feature Track */}
            <div 
              ref={menuScrollRef}
              className="flex items-center gap-2 overflow-x-auto scroll-smooth no-scrollbar px-1 py-0.5 w-full justify-around"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Seekers Feature */}
              <button
                onClick={() => setActiveBottomTab(activeBottomTab === 'seekers' ? null : 'seekers')}
                className={`flex flex-col items-center justify-center gap-1.5 p-1.5 rounded-2xl transition-all duration-200 shrink-0 whitespace-nowrap active:scale-95 group ${
                  activeBottomTab === 'seekers'
                    ? 'bg-purple-50 text-purple-700 ring-2 ring-purple-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 text-white glossy-3d-container group-hover:scale-105 transition-all flex items-center justify-center">
                  <FlatIcon icon={User} className="w-12 h-12" />
                </div>
                <span className="text-xs leading-none font-bold text-slate-800">Seekers</span>
              </button>

              {/* GiGs Feature */}
              <button
                onClick={() => setActiveBottomTab(activeBottomTab === 'gigs' ? null : 'gigs')}
                className={`relative flex flex-col items-center justify-center gap-1.5 p-1.5 rounded-2xl transition-all duration-200 shrink-0 whitespace-nowrap active:scale-95 group ${
                  activeBottomTab === 'gigs'
                    ? 'bg-amber-50 text-amber-800 ring-2 ring-amber-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 text-white glossy-3d-container group-hover:scale-105 transition-all flex items-center justify-center">
                  <FlatIcon icon={Briefcase} className="w-12 h-12" />
                  {/* Create a GiG Quick Action Badge */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveBottomTab('gigs');
                      openCreateGigModal();
                    }}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-600 text-white rounded-full glossy-3d-container shadow-md border-2 border-white transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                    title="Create a GiG"
                  >
                    <FlatIcon icon={Plus} className="w-7 h-7" />
                  </div>
                </div>
                <span className="text-xs leading-none font-bold text-slate-800">GiGs</span>
              </button>

              {/* Tenant Feature */}
              <button
                onClick={() => setActiveBottomTab(activeBottomTab === 'tenant' ? null : 'tenant')}
                className={`relative flex flex-col items-center justify-center gap-1.5 p-1.5 rounded-2xl transition-all duration-200 shrink-0 whitespace-nowrap active:scale-95 group ${
                  activeBottomTab === 'tenant'
                    ? 'bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {(pendingVerificationCount + pendingPopCount) > 0 && (
                  <span className="absolute top-1 right-2 w-5 h-5 bg-red-600 text-white font-black rounded-full text-[10px] flex items-center justify-center shadow-md animate-pulse z-10">
                    {pendingVerificationCount + pendingPopCount}
                  </span>
                )}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-800 text-white glossy-3d-container group-hover:scale-105 transition-all flex items-center justify-center">
                  <FlatIcon icon={FileText} className="w-12 h-12" />
                </div>
                <span className="text-xs leading-none font-bold text-slate-800">Tenant</span>
              </button>

              {/* Businesses Feature */}
              <button
                onClick={() => setActiveBottomTab(activeBottomTab === 'businesses' ? null : 'businesses')}
                className={`flex flex-col items-center justify-center gap-1.5 p-1.5 rounded-2xl transition-all duration-200 shrink-0 whitespace-nowrap active:scale-95 group ${
                  activeBottomTab === 'businesses'
                    ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white glossy-3d-container group-hover:scale-105 transition-all flex items-center justify-center">
                  <FlatIcon icon={Building2} className="w-12 h-12" />
                </div>
                <span className="text-xs leading-none font-bold text-slate-800">Businesses</span>
              </button>

              {/* Admin Feature */}
              <button
                onClick={() => setActiveBottomTab(activeBottomTab === 'admin' ? null : 'admin')}
                className={`relative flex flex-col items-center justify-center gap-1.5 p-1.5 rounded-2xl transition-all duration-200 shrink-0 whitespace-nowrap active:scale-95 group ${
                  activeBottomTab === 'admin'
                    ? 'bg-blue-50 text-blue-800 ring-2 ring-blue-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {(pendingVerificationCount + pendingPopCount) > 0 && (
                  <span className="absolute top-1 right-2 w-5 h-5 bg-red-600 text-white font-black rounded-full text-[10px] flex items-center justify-center shadow-md animate-pulse z-10">
                    {pendingVerificationCount + pendingPopCount}
                  </span>
                )}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-800 text-white glossy-3d-container group-hover:scale-105 transition-all flex items-center justify-center">
                  <FlatIcon icon={ShieldCheck} className="w-12 h-12" />
                </div>
                <span className="text-xs leading-none font-bold text-slate-800">Admin</span>
              </button>

              {/* Profile Feature */}
              <button
                onClick={() => {
                  setActiveBottomTab('profile');
                  setEditFirstName(userProfile.firstName);
                  setEditMiddleName(userProfile.middleName);
                  setEditSurname(userProfile.surname);
                  setEditDob(userProfile.dob);
                  setEditContactNumber(userProfile.contactNumber);
                  setEditEmail(userProfile.email);
                  setEditAvatarUrl(userProfile.avatarUrl);
                  setEditIdDocName(userProfile.idDocumentName);
                  setEditIdDocUrl(userProfile.idDocumentUrl);
                  setEditSocialLinks(userProfile.socialLinks);
                  setShowProfileModal(true);
                }}
                className={`flex flex-col items-center justify-center gap-1.5 p-1.5 rounded-2xl transition-all duration-200 shrink-0 whitespace-nowrap active:scale-95 group ${
                  activeBottomTab === 'profile'
                    ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-700 text-white glossy-3d-container group-hover:scale-105 transition-all flex items-center justify-center">
                  <FlatIcon icon={User} className="w-12 h-12" />
                </div>
                <span className="text-xs leading-none font-bold text-slate-800">Profile</span>
              </button>

              {/* Settings Feature */}
              <button
                onClick={() => {
                  setActiveBottomTab((activeBottomTab as any) === 'settings' ? null : 'settings');
                }}
                className={`flex flex-col items-center justify-center gap-1.5 p-1.5 rounded-2xl transition-all duration-200 shrink-0 whitespace-nowrap active:scale-95 group ${
                  (activeBottomTab as any) === 'settings'
                    ? 'bg-slate-200 text-slate-900 ring-2 ring-slate-400/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-900 text-white glossy-3d-container group-hover:scale-105 transition-all flex items-center justify-center">
                  <FlatIcon icon={Settings} className="w-12 h-12" />
                </div>
                <span className="text-xs leading-none font-bold text-slate-800">Settings</span>
              </button>

            </div>

            {/* Scroll Right Button */}
            <button
              onClick={() => {
                if (menuScrollRef.current) menuScrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
              title="Slide Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        )}
      </div>

      {/* 6. Central OpenStreetMap Container (attributionControl={false} hides "Leaflet | © OpenStreetMap contributors") */}
      <div className="w-full h-full">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          className="h-full w-full z-10"
          zoomControl={false}
          attributionControl={false}
          scrollWheelZoom={true}
        >
          {/* Dynamic Interactive Layer Provider */}
          <TileLayer
            key={activeTheme.id}
            url={activeTheme.url}
            maxZoom={19}
          />

          {/* Driving / Navigation Polyline Route */}
          {routePoints.length > 0 && (
            <Polyline
              positions={routePoints}
              pathOptions={{
                color: '#2563eb',
                weight: 5,
                opacity: 0.85,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          )}

          {/* Seeker Live On-Map Marker (When seeker switches ON to appear on map to get hired) */}
          {seekerAppearOnMap && userPos && isValidCoordinate(userPos[0], userPos[1]) && (
            <>
              <Circle 
                center={userPos} 
                radius={accuracy || 80} 
                pathOptions={{
                  fillColor: '#9333ea',
                  fillOpacity: 0.18,
                  color: '#a855f7',
                  weight: 2,
                  dashArray: '5, 5'
                }} 
              />
              <Marker 
                position={userPos} 
                icon={createLiveSeekerMarkerIcon(userProfile.avatarUrl, getFullName(userProfile), userProfile.verificationStatus === 'verified')}
              >
                <Popup className="custom-profile-popup rounded-2xl overflow-hidden font-sans border-0 shadow-2xl p-0">
                  <div className="p-2.5 w-56 bg-white font-sans text-slate-800">
                    {/* Seeker Header */}
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="relative w-8 h-8 rounded-full ring-1.5 ring-purple-500 overflow-hidden shrink-0 bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {userProfile.avatarUrl ? (
                          <img src={userProfile.avatarUrl} alt={getFullName(userProfile)} className="w-full h-full object-cover" />
                        ) : (
                          getFullName(userProfile).charAt(0).toUpperCase()
                        )}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-extrabold text-xs text-slate-900 truncate">{getFullName(userProfile)}</h3>
                          {userProfile.verificationStatus === 'verified' && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <span className="inline-block bg-purple-100 text-purple-800 font-extrabold text-[8px] px-1.5 py-0.2 rounded-full mt-0.5">
                          {userProfile.seekerTradeType || 'Electrician'} • HIRE ME
                        </span>
                      </div>
                    </div>

                    {/* Seeker Details */}
                    <div className="mt-1.5 space-y-1 text-[10px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-800">{userProfile.contactNumber || '+27 (0) 71 234 5678'}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-800 text-[9.5px] leading-tight line-clamp-1">
                          {userAddress || "Live GPS location"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[8.5px] text-emerald-600 font-extrabold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                        LIVE
                      </span>
                      {userProfile.contactNumber && (
                        <a
                          href={`tel:${userProfile.contactNumber}`}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-2.5 py-1 rounded-lg text-[10px] transition-all shadow-sm flex items-center gap-1 active:scale-95"
                        >
                          <Zap className="w-2.5 h-2.5" />
                          <span>Hire Me</span>
                        </a>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* User Profile Picture Logo Map Marker */}
          {showPinpointer && userPos && isValidCoordinate(userPos[0], userPos[1]) && (
            <>
              {accuracy && accuracy < 100000 && (
                <Circle 
                  center={userPos} 
                  radius={accuracy} 
                  pathOptions={{
                    fillColor: '#3b82f6',
                    fillOpacity: 0.1,
                    color: '#3b82f6',
                    weight: 1,
                    dashArray: '4, 4'
                  }} 
                />
              )}
              <Marker 
                position={userPos} 
                icon={createUserProfileMarkerIcon(userProfile.avatarUrl, getFullName(userProfile), userProfile.verificationStatus === 'verified')}
              >
                <Popup className="custom-profile-popup rounded-2xl overflow-hidden font-sans border-0 shadow-2xl p-0">
                  <div className="p-4 w-64 bg-white/95 backdrop-blur-md font-sans text-slate-800">
                    
                    {/* User Profile Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="relative w-11 h-11 rounded-full ring-2 ring-blue-500/40 overflow-hidden shrink-0 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                        {userProfile.avatarUrl ? (
                          <img src={userProfile.avatarUrl} alt={getFullName(userProfile)} className="w-full h-full object-cover" />
                        ) : (
                          getFullName(userProfile).charAt(0).toUpperCase()
                        )}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-sm text-slate-900 truncate">{getFullName(userProfile)}</h3>
                        <p className="text-[11px] text-slate-500 truncate font-medium mt-0.5">{userProfile.email}</p>
                      </div>
                    </div>

                    {/* Location Address Only */}
                    <div className="mt-3">
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider block">Address</span>
                      <p className="text-xs text-slate-800 font-semibold leading-snug mt-1">
                        {isReverseGeocoding ? "Retrieving address..." : (userAddress || "Location details unavailable")}
                      </p>
                    </div>

                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* Clicked / Searched Pinned Location */}
          {exactLocationPinnedEnabled && clickedPos && isValidCoordinate(clickedPos[0], clickedPos[1]) && (
            <Marker position={clickedPos} icon={customPinIcon}>
              <Popup className="custom-popup rounded-2xl overflow-hidden font-sans">
                <div className="p-2 min-w-[210px] max-w-[260px]">
                  <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-100">
                    <span className="font-extrabold text-[10px] text-rose-600 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      Exact Location
                    </span>
                  </div>
                  <span className="text-xs text-slate-900 font-extrabold block leading-snug">
                    {clickedAddress}
                  </span>
                  <div className="mt-2.5 pt-1.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleReturnToMyExactLocation}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-1.5 px-2 rounded-lg text-[10.5px] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Crosshair className="w-3 h-3" />
                      <span>Back to My Exact Location</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Active Gig Navigation Polyline (Seeker directed to user's exact location) */}
          {activeGigSession && activeGigSession.route.length > 1 && (
            <>
              <Polyline
                positions={activeGigSession.route}
                pathOptions={{
                  color: '#9333ea',
                  weight: 7,
                  opacity: 0.85,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
              <Polyline
                positions={activeGigSession.route}
                pathOptions={{
                  color: '#e9d5ff',
                  weight: 3,
                  opacity: 0.95,
                  dashArray: '6, 8',
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
            </>
          )}

          {/* Active Moving Seeker Marker on Route */}
          {activeGigSession && (activeGigSession.status === 'guiding' || activeGigSession.status === 'arrived') && (
            <Marker
              position={activeGigSession.seekerCurrentPos}
              icon={createMovingSeekerMarkerIcon(activeGigSession.seekerAvatar, activeGigSession.seekerName, activeGigSession.seekerTrade)}
            >
              <Popup className="custom-popup rounded-2xl overflow-hidden font-sans">
                <div className="p-2 min-w-[190px]">
                  <span className="text-[9px] font-bold uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    {activeGigSession.status === 'arrived' ? '🟢 Arrived at Your Location' : '🚗 Directed to Your Location'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{activeGigSession.seekerName}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{activeGigSession.seekerTrade} • {activeGigSession.seekerRate}</p>
                  <p className="text-[9px] text-purple-600 font-mono mt-0.5">
                    {activeGigSession.status === 'arrived' ? 'Live at Gig Site' : `ETA: ${activeGigSession.eta} (${activeGigSession.distance})`}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Seekers Map Markers */}
          {activeBottomTab === 'seekers' && seekersListings.map((item) => (
            <Marker
              key={item.id}
              position={[item.lat, item.lng]}
              icon={createSeekerMarkerIcon(item.name, item.role)}
            >
              <Popup className="custom-popup rounded-2xl overflow-hidden font-sans">
                <div className="p-2 min-w-[190px]">
                  <div className="flex items-center gap-2">
                    <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                      <p className="text-[10px] text-purple-700 font-semibold truncate">{item.role}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-600 font-medium flex justify-between border-t pt-1.5 items-center">
                    <span>⭐ {item.rating} ({item.reviews})</span>
                    <span className="font-bold text-purple-700">{item.hourly}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => startHiringFlow(item)}
                    className="w-full mt-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Hire Seeker Now</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* GiGs Map Markers */}
          {activeBottomTab === 'gigs' && gigsListings.map((item) => (
            <Marker
              key={item.id}
              position={[item.lat, item.lng]}
              icon={createGigMarkerIcon(item.rate || item.pay || 'R 350/hr', item.title)}
            >
              <Popup className="custom-popup rounded-2xl overflow-hidden font-sans">
                <div className="p-2 min-w-[200px] max-w-[240px]">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">{item.category}</span>
                    <span className="text-xs font-black text-emerald-700">{item.rate || item.pay}</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-2">{item.description}</p>
                  
                  <div className="mt-2 text-[9.5px] text-slate-600 font-semibold border-t pt-1.5 flex items-center justify-between">
                    <span className="truncate max-w-[120px]">{item.location}</span>
                    <span className="text-slate-400 font-normal">By {item.creatorName}</span>
                  </div>

                  <div className="mt-2 pt-1 border-t border-slate-100">
                    {item.creatorId === 'me' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCancelParty('creator');
                          setShowCancelGigModal(true);
                        }}
                        className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold rounded-lg transition-colors flex items-center justify-center gap-1 active:scale-95"
                      >
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Cancel GiG (Send Reason)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => applyToGig(item)}
                        className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black rounded-lg transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Apply to GiG</span>
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Business Map Markers */}
          {activeBottomTab === 'businesses' && businessesListings.map((item) => (
            <Marker
              key={item.id}
              position={[item.lat, item.lng]}
              icon={createTenantMarkerIcon(item.rating)}
            >
              <Popup className="custom-popup rounded-2xl overflow-hidden font-sans">
                <div className="p-2 min-w-[180px]">
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{item.category}</p>
                  <div className="mt-2 text-xs font-black text-slate-900 border-t pt-1.5">
                    <span>⭐ {item.rating} ({item.reviews} reviews)</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Tenant Map Markers */}
          {activeBottomTab === 'tenant' && tenantListings.map((item) => (
            <Marker
              key={item.id}
              position={[item.lat, item.lng]}
              icon={createTenantMarkerIcon(item.price)}
            >
              <Popup className="custom-popup rounded-2xl overflow-hidden font-sans">
                <div className="p-2 min-w-[180px]">
                  <span className="text-[9px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">{item.subscriptionPlan || 'Registered Tenant'}</span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{item.location}</p>
                  <div className="mt-2 text-xs font-black text-slate-900 border-t pt-1.5 flex items-center justify-between">
                    <span>{item.price}</span>
                    <span className="text-[9px] text-purple-700 font-bold">{item.name}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Custom programmatic events & centering handler */}
          <MapController
            onMapClick={handleMapClick}
            flyToLocation={flyToTrigger}
            setFlyToLocation={setFlyToTrigger}
            userPosition={userPos}
            autoCenter={autoCenter}
            setAutoCenter={setAutoCenter}
            zoomTrigger={zoomTrigger}
            setZoomTrigger={setZoomTrigger}
          />
        </MapContainer>
      </div>
    </div>
  );
}
