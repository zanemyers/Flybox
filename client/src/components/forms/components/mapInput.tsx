import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";

interface MapModalProps {
  show: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

export default function MapInput({
  show,
  onClose,
  latitude,
  longitude,
  onChange,
}: MapModalProps) {
  const [position, setPosition] = useState<[number, number]>([
    latitude,
    longitude,
  ]);

  function LocationSelector() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onChange(e.latlng.lat, e.latlng.lng);
        onClose(); // auto-close modal after picking
      },
    });
    return null;
  }

  // Component to fix map resizing when modal opens
  function ResizeOnShow({ active }: { active: boolean }) {
    const map = useMap();
    useEffect(() => {
      if (active) {
        setTimeout(() => {
          map.invalidateSize();
          map.setView(position); // recenter properly
        }, 200); // small delay for modal animation
      }
    }, [active, map]);
    return null;
  }

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex={-1}
      role="dialog"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select a Location</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body p-0">
            <MapContainer
              center={position}
              zoom={10}
              style={{ height: "500px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="Map data © OpenStreetMap contributors"
              />
              <Marker
                position={position}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const latlng = (e.target as L.Marker).getLatLng();
                    setPosition([latlng.lat, latlng.lng]);
                    onChange(latlng.lat, latlng.lng);
                  },
                }}
              />
              <LocationSelector />
              <ResizeOnShow active={show} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
