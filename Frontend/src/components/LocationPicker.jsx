import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import "../leafletIcon";

const LocationPicker = ({ onSelect }) => {
  const [position, setPosition] = useState([27.7172, 85.3240]); // default Kathmandu

  // auto detect user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setPosition(loc);
        onSelect(loc);
      },
      () => {
        console.log("User denied location access");
      }
    );
  }, []);

  // click to change location
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
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
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;
