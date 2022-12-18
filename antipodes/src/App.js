import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import axios from "axios";

function App() {
  const [data, setData] = useState(null);
  const [ortho, setOrtho] = useState(null);
  const [transform, setTrans] = useState(null);
  const [posnew, setNew] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState([47.536, 7.643]);

//-------------------Karte-------------------------------------------------------------
  useEffect(() => {
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
    },[]);

//-------------------Funktion test (für Umrechnung)------------------------------------
  function test() {
    var url = `http://geodesy.geo.admin.ch/reframe/wgs84tolv95?easting=7&northing=47&format=json`;
    //var url = `https://vm13.sourcelab.ch/antipodes?lat=${position[1]}&lng=${position[0]}` 
    
    setLoading(true);
      axios
        .get(url)
        .then((response) => {
          setTrans(response.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    console.log(transform);

//-------------------Umrechnen (für Button "Calculate Coordinates")---------------------
  function umrechnen() {
    //var url = `http://geodesy.geo.admin.ch/reframe/wgs84tolv95?easting=7&northing=47&format=json`;
    var url = `https://vm13.sourcelab.ch/antipodes?lat=${position[0]}&lng=${position[1]}` 
    
    setLoading(true);
      axios
        .get(url)
        .then((response) => {
          setNew(response.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    console.log(posnew);

//-------------------Umrechnen (für Button "Calculate Coordinates")-------------------
  function do_download() {
    // TODO: Parametrisieren
    //var url = "https://vm1.sourcelab.ch/geodetic/line?startlat=47.5349&startlng=7.6415&endlat=8.9738&endlng=-79.5068&pts=100";
    var url = `https://vm13.sourcelab.ch/antipodes?lat=${position[0]}&lng=${position[1]}` 

    setLoading(true);
      axios
        .get(url)
        .then((response) => {
          setData(response.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
  }
  console.log(data);

//-------------------Orthofoto -------------------------------------------------------
  function Orthofoto() {
    // TODO: Parametrisieren
    //var url = "https://vm1.sourcelab.ch/geodetic/line?startlat=47.5349&startlng=7.6415&endlat=8.9738&endlng=-79.5068&pts=100";
    var url = `https://vm13.sourcelab.ch/antipodes?lat=${position[0]}&lng=${position[1]}` 

    setLoading(true);
      axios
        .get(url)
        .then((response) => {
          setOrtho(response.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
  }
  console.log(ortho);

//-------------------Map Position aktualisieren---------------------------------------
  function FlyMapTo() {

    const map = useMap()
    useEffect(() => {
        map.flyTo(position)
    },)
    return null
  }

  function FlyMapToAntipode() {

    const map = useMap()
    useEffect(() => {
        map.flyTo([posnew?.geometry.coordinates[0], posnew?.geometry.coordinates[1]])
    },)
    return null
}

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Breite" variant="outlined" type={"number"} defaultValue={position[0]} onChange={(event) => {var lng = position[1]; setPosition([event.target.value, lng])}}/> 
        </Grid>
        <Grid item xs={12}>
          <TextField label="Länge" variant="outlined" type={"number"} defaultValue={position[1]} onChange={(event) => {var lat = position[0]; setPosition([lat, event.target.value])}}/>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="success" onClick={ () => {umrechnen() } }>Calculate Coordinates</Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="warning" onClick={ () => {do_download() } }>View Point</Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="error" onClick={ () => {Orthofoto() } }>View Antipode</Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={ () => {Orthofoto() } }>View Orthofoto</Button>
        </Grid>
      </Grid>

      {posnew &&
        <>
          <div className="text-3xl font-bold underline">
            <h2>Koordinaten des antipodes:</h2>
            <div>Breite: {posnew?.geometry.coordinates[0]}</div>
            <div>Länge: {posnew?.geometry.coordinates[1]}</div>
          </div>
        </>
      }

      {loading &&
        <>
          <div>API Aufruf, bitte warten!</div><br/>
        </>
      }

      {error &&
        <>
          <div>ERROR API Aufruf fehlgeschlagen</div>{console.log(error)}<br/>
        </>
      }

      {data &&
        <>
          <MapContainer className="map" center={position} zoom={2} scrollWheelZoom={true} style={{height: "400px", width: "48%", float:"left", margin:"10px"}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
            <Marker color="green" position={ position }>
              <Popup>{position[0]}<br/>{position[1]}</Popup>
            </Marker>
            <FlyMapTo/>
          </MapContainer>
        </>
      }

      {ortho &&
        <>
          <MapContainer className="map" center={[posnew?.geometry.coordinates[0], posnew?.geometry.coordinates[1]]} zoom={2} scrollWheelZoom={true} style={{height: "400px", width: "48%", float:"right", margin:"10px"}}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; swisstopo"/>
            <Marker color="green" position={[posnew?.geometry.coordinates[0], posnew?.geometry.coordinates[1]]}>
              <Popup>{posnew?.geometry.coordinates[0]}<br/>{posnew?.geometry.coordinates[1]}</Popup>
            </Marker>
            <FlyMapToAntipode/>
          </MapContainer>
        </>
      }
    </>
  );
}

export default App;