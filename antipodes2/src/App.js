import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Grid, Button, TextField, Typography } from '@mui/material';
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

  const url =`https://vm13.sourcelab.ch/calculateantipode?lat=${position[0]}&lng=${position[1]}`

//------------------- Überprüfung auf gültige Koordinatenwerte -------------------------
  if (-90 <= position[0] && position[0] <= 90) {
  } else {
    alert('Fehler: Breitengrade müssen zwischen -90 und 90 sein.');
    reload();
    }
    
  if (-180 <= position[1] && position[1] <= 180) {
  } else {
    alert('Fehler: Längengrade müssen zwischen -180 und 180 sein.');
    reload();
    }

//------------------- Karte -------------------------------------------------------------
  useEffect(() => {
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
    },[]);

//------------------- Koordinaten umrechnen (für Button "Calculate Coordinates") --------
  function umrechnen() {
    
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

//------------------- Punkt anzeigen (für Button "View Point") -------------------------
  function point() {

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

//------------------- Antipode anzeigen (für Button "View Antipode") --------------------
  function antipode() {

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

//------------------- Orthofoto -------------------------------------------------------
  function orthofoto() {

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

//------------------- Map Position aktualisieren ---------------------------------------
  function FlyMapTo() {

    const map = useMap()
    useEffect(() => {
        map.flyTo(position)
    },);
  }

  function FlyMapToAntipode() {

    const map = useMap()
    useEffect(() => {
        map.flyTo(transform?.geometry.coordinates)
    },);
  }

  function OrthoFlyMapToAntipode() {

    const map = useMap()
    useEffect(() => {
        map.flyTo(ortho?.geometry.coordinates)
    },);
  }

//----------- Seite neu laden, für Reset oder neue Berechung --------------------------
function reload() {
  window.location.reload();
}

//----------- Design: GUI (mit Buttons, Textfields und Maps) --------------------------
  return (
    <>
      <AppBar position="sticky" sx={{backgroundColor: "black", pt:2, pb:2}}>
        <Toolbar>
          <Grid container spacing={2}>
            <Grid item md={3} sm={6} xs={12} align="center">
              <Button className='Button' variant="outlined" sx={{color: 'white', backgroundColor: 'none', borderColor: 'white'}} onClick={() => {umrechnen()}}>Calculate Coordinates</Button>
            </Grid>
            <Grid item md={3} sm={6} xs={12} align="center">
              <Button className='Button' variant="outlined" sx={{color: 'white', backgroundColor: 'none', borderColor: 'white'}} onClick={() => {point()}}>View Point</Button>
            </Grid>
            <Grid item md={3} sm={6} xs={12} align="center">
              <Button className='Button' variant="outlined" sx={{color: 'white', backgroundColor: 'none', borderColor: 'white'}} onClick={() => {antipode()}} >View Antipode</Button>
            </Grid>
            <Grid item md={3} sm={6} xs={12} align="center">
              <Button className='Button' variant="outlined" sx={{color: 'white', backgroundColor: 'none', borderColor: 'white'}} onClick={() => {orthofoto()}}>View Orthofoto</Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Typography variant='h3' align='center' sx={{m:5}}>Antipode</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} align="center">
          <TextField label="Breite" variant="outlined" type={"number"} sx={{m:1.5}} defaultValue={position[0]} onBlur={(event) => {var lng = position[1]; setPosition([event.target.value, lng])}}/> 
          <TextField label="Länge" variant="outlined" type={"number"} sx={{m:1.5}} defaultValue={position[1]} onBlur={(event) => {var lat = position[0]; setPosition([lat, event.target.value])}}/>
        </Grid>
      </Grid>

      {posnew &&
        <>
          <Grid align="center" sx={{mt:4, mb:4}}>
            <Typography variant='h6' align='center' sx={{mb:1}}>Koordinaten des Antipodes:</Typography>
            <Typography>Breite: {posnew?.geometry.coordinates[0]}</Typography>
            <Typography>Länge: {posnew?.geometry.coordinates[1]}</Typography>
          </Grid>
        </>
      }

      {error &&
        <>
          <Typography align='center'>ERROR API Aufruf fehlgeschlagen</Typography>{console.log(error)}<br/>
        </>
      }

      <Grid container spacing={2} sx={{mb:2}}>
        {data &&
          <>
            <Grid item sm={6} xs={12}>
              <Typography variant='h6' align='center' sx={{mb:1}}>Position der Ursprungskoordinaten</Typography>
              <MapContainer center={position} zoom={2} scrollWheelZoom={true} style={{height: "400px", width:"100%"}}>
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                <Marker position={position}>
                  <Popup>{position[0]}<br/>{position[1]}</Popup>
                </Marker>
                <FlyMapTo/>
              </MapContainer>
            </Grid>
          </>
        }

        {transform &&
          <>
            <Grid item sm={6} xs={12}>
              <Typography variant='h6' align='center' sx={{mb:1}}>Position des Antipodes</Typography>
              <MapContainer center={transform?.geometry.coordinates} zoom={2} scrollWheelZoom={true} style={{height: "400px", width:"100%"}}>
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                <Marker position={transform?.geometry.coordinates}>
                  <Popup>{posnew?.geometry.coordinates[0]}<br/>{posnew?.geometry.coordinates[1]}</Popup>
                </Marker>
                <FlyMapToAntipode/>
              </MapContainer>
            </Grid>
          </>
        }
      </Grid>

      <Grid container spacing={2} sx={{mb:9}}>
        {ortho &&
          <>
            <Grid item sm={6} xs={12}>
              <MapContainer center={position} zoom={10} scrollWheelZoom={true} style={{height: "400px", width: "100%"}}>
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; swisstopo"/>
                <Marker position={position}>
                  <Popup>{position[0]}<br/>{position[1]}</Popup>
                </Marker>
                <FlyMapTo/>
              </MapContainer>
            </Grid>

            <Grid item sm={6} xs={12}>
              <MapContainer center={ortho?.geometry.coordinates} zoom={10} scrollWheelZoom={true} style={{height: "400px", width: "100%"}}>
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; swisstopo"/>
                <Marker position={ortho?.geometry.coordinates}>
                  <Popup>{ortho?.geometry.coordinates[0]}<br/>{ortho?.geometry.coordinates[1]}</Popup>
                </Marker>
                <OrthoFlyMapToAntipode/>
              </MapContainer>
            </Grid>
          </>
        }
      </Grid>

      <Grid container>
      <AppBar position='fixed' style={{marginTop:"20px"}} sx={{backgroundColor: 'black', top: 'auto', bottom: 0}}>
        <Toolbar sx={{display:'flex', alignItems:"center", justifyContent:"center"}}>
          <Typography>Sara Hauser | Martina Meyer | Livia Rubi</Typography>
        </Toolbar>
      </AppBar>
      </Grid>
    </>
  );
}

export default App;