import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSiteSettingsStore } from '../../store/siteSettingsStore';

export const LocationSection = () => {
  const { settings } = useSiteSettingsStore();
  const lat = Number(settings.adminMapPinLat);
  const lng = Number(settings.adminMapPinLng);
  const zoom = Number(settings.adminMapZoom || 12);
  const center = Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : [15.2993, 74.124];

  return (
    <section className="mt-16">
      <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold/80">Find Us</p>
      <h2 className="font-display text-4xl text-gold">Location</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="h-72 overflow-hidden rounded-2xl border border-gold/30 shadow-2xl shadow-black/35">
          <MapContainer key={`${center[0]}-${center[1]}-${zoom}`} center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={center}>
              <Popup>Aurelia Grand Hotel</Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="premium-panel rounded-2xl border border-gold/30 p-6">
          <p className="text-lg font-medium">Aurora Bay Road, Goa, India</p>
          <p className="mt-3 text-ivory/85">+91 98765 43210</p>
          <p className="mt-2 text-ivory/85">stay@aureliagrand.com</p>
          <p className="mt-6 rounded-lg border border-gold/20 bg-white/5 p-3 text-sm text-ivory/80">
            Ten minutes from the shoreline, close to the arts district, and connected to curated local experiences.
          </p>
        </div>
      </div>
    </section>
  );
};
