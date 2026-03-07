import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "../leafletIcon";

const ChangeView = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
};

const LocationPicker = ({ onSelect, currentCoords, isEditable }) => {
  const [position, setPosition] = useState(currentCoords);

  // sync when parent coords change
  useEffect(() => {
    setPosition(currentCoords);
  }, [currentCoords]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        if (!isEditable) return;

        const loc = [e.latlng.lat, e.latlng.lng];
        setPosition(loc);
        onSelect(loc);
      },
    });

    return <Marker position={position} />;
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ChangeView center={position} />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;