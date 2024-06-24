import { MapContainer, TileLayer,useMapEvents } from "react-leaflet";
import settings from "../../../../config";
import LocationMarker from "../../../../components/map/locationMarker";
import { useEffect, useState } from "react";
import { locationGeoCoding } from "../../../../services/externalApiService";

export function CreateAreaMap({ onCityChanged,setMap,map,mapRef, handleMapClick, children }) {
  const [city, setCity] = useState();
  useEffect(() => {
    if (city == null) return;
    if (onCityChanged) {
      onCityChanged(city);
    }
  }, [city]);
  useEffect(() => {
    if (map && mapRef != null) {
      mapRef.current = map;
      setTimeout(()=>{
        locateProviceOf(map.getCenter())
      } , 1500);
    }
  }, [map]);
  const locateProviceOf = async (center) => {
    locationGeoCoding(center.lat, center.lng).then((res) => {
      setCity(res.data.city || res.data.district);
    }).catch((e) => { });
  }
  const EventListener = (props) => {
    const map = useMapEvents({
      dragend: (e) => {
        locateProviceOf(e.target.getCenter());
      },
    })
    return null;
  }
  return (
    <MapContainer
      style={{
        zIndex: 1,
        borderRadius: "20px",
        height: "100%",
      }}
      center={settings.INITIAL_VIEW}
      zoom={11}
      whenCreated={(map) => {
        map.on("click", handleMapClick);
        setMap(map);
        setTimeout(() => {
          map.invalidateSize();
        }, 0);
      }}
    >
      <LocationMarker />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
       <EventListener />
      {children}
    </MapContainer>
  );
}
