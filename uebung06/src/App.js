import React from 'react';
import "./App.css";
import "leaflet/dist/leaflet.css";


import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, CircleMarker} from 'react-leaflet'


function App() {

  React.useEffect(() => {
    const L = require("leaflet");

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
  }, []);

  var swisstopo = (<TileLayer url="https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg"
  attribution='&copy; swisstopo' ></TileLayer>
  );

return (
  <MapContainer center={[46.859255202, 8.094326316]} zoom={9} scrollWheelZoom={true}>

  {swisstopo}

  <Marker position={[46.968872773, 7.268042402]}>
    <Popup>
      <b>Kernkraftwerk Mühleberg</b><br/>
    </Popup>
  </Marker>
  <Circle center={[46.968872773, 7.268042402]} radius={50000} />

  <Marker position={[47.366075562, 7.966750757]}>
    <Popup>
      <b>Kernkraftwerk Gösgen</b><br/>
    </Popup>
  </Marker>
  <Circle center={[47.366075562, 7.966750757]} radius={50000} />

  <Marker position={[47.552019433, 8.228391684]}>
    <Popup>
      <b>Kernkraftwerk Beznau</b><br/>
    </Popup>
  </Marker>
  <Circle center={[47.552019433, 8.228391684]} radius={50000} />

  <Marker position={[47.601455367, 8.182823992]}>
    <Popup>
      <b>Kernkraftwerk Leibstadt</b><br/>
    </Popup>
  </Marker>
  <Circle center={[47.601455367, 8.182823992]} radius={50000} />

</MapContainer>
  );
}

export default App;