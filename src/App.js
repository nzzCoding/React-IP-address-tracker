import { useState, useEffect } from 'react';
import './App.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from './images/icon-location.svg';
import { ReactComponent as Arrow } from './images/icon-arrow.svg';

function AppHeader(props) {
  return (
    <div className="app-header">
      <header className="app-title">
        <h1>IP Address Tracker</h1>
      </header>
      <div className="search-bar">
        <input 
          className="search-input"
          type="text" 
          placeholder="Search for any IP address or domain"
          onChange={props.searchInputChange}
        />
        <button 
          className="search-button"
          onClick={props.searchButtonClick}>
            <Arrow />
        </button>
        {(!props.validSearch) ? 
          <p>please enter a valid IP address</p> :
          undefined }
      </div>
    </div>
  )
}

function IpInfoCategory(props) {
  return (
    <div className="ip-info-category">
      <h5 className="category-head">{props.category}</h5>
      <p className="category-body">{props.content}Brookklyn, NY 1999992</p>
    </div>
  )
}

function IpInfo(props) {
  let ipAddress, location, timezone, isp;
  if (props.ipifyData !== undefined && props.ipifyData !== "Error") {
    ipAddress = props.ipifyData.ip;
    location = (
      props.ipifyData.location.region +
      ', ' +
      props.ipifyData.location.city +
      ' ' +
      props.ipifyData.location.postalCode
      );
    timezone = "UTC " + props.ipifyData.location.timezone;
    isp = props.ipifyData.isp;
  }
  const verticalSeparator = (
    <div className="ip-info-separator"></div>
  );
  
  return (
    <div className="ip-info">
      <IpInfoCategory 
        category="IP ADDRESS" 
        content={ipAddress} />
      {verticalSeparator}
      <IpInfoCategory 
        category="LOCATION" 
        content={location} />
      {verticalSeparator}
      <IpInfoCategory 
        category="TIMEZONE" 
        content={timezone} />
      {verticalSeparator}
      <IpInfoCategory
        category="ISP" 
        content={isp} />
    </div>
  )
}

function Carte(props) {
  console.log("Carte rendering");
  const style = {
    border: "solid black 5px",
    height: "520px"
  }
  let [lat, lng] = [33.589886, -7.603869];
  if (props.ipifyData !== undefined && props.ipifyData !== 'Error') {
    lat = Number(props.ipifyData.location.lat);
    lng = Number(props.ipifyData.location.lng)
  }
  useEffect(() => {
    console.log("carte useEffect");

    let leafletMap = L.map("mapid").setView([lat, lng], 13);
    const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    L.tileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${accessToken}`, 
      {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: accessToken
      }
    ).addTo(leafletMap);

    return () => {
      leafletMap.remove();
    }
  }, [lat, lng]);

  return (
    <div id="mapid" style={style}>map placeholder</div>
  )
}

function App(props) {
  console.log("App rendering");

  let initialRequest = `https://geo.ipify.org/api/v1?apiKey=${process.env.REACT_APP_IPIFY_KEY}`;

  let [request, setRequest] = useState(initialRequest);
  let [response, setResponse] = useState(undefined);
  let [search, setSearch] = useState("");
  let [validSearch, setValidSearch] = useState(true);

  const searchInputChange = (event) => {
    setSearch(event.target.value);
  };

  const searchButtonClick = (event) => {
    let numField = "(0|[1-2][0-9]([0-5]|(?<!2[5-9])[6-9])|[1-9][0-9]?)";
    let validity = new RegExp(
        `^(${numField}\\.){3}${numField}$`).test(search);  
    let newRequest = (validity) ? 
      `${initialRequest}&ipAddress=${search}` : request;
    setValidSearch(validity);
    setRequest(newRequest);
  };
  
  useEffect(() => {
    console.log("App useEffect");
    fetch("json placeholder")
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Failed to fetch data from server");
    })
    .then((data) => {
      setResponse(data);
    })
    .catch((error) => {
      setResponse("Error");
    })
  }, [request]);

  return (
    <div className="app-container">
      <div className="prompter">
        <AppHeader 
          validSearch={validSearch}
          searchInputChange={searchInputChange} 
          searchButtonClick={searchButtonClick}
        />
        <IpInfo ipifyData={response} />
      </div>
      {/*<Carte ipifyData={response}/>*/}
      <div className="filler" style={{height: "570px", border: "solid black 5px"}}></div>
    </div>
  );
}

export default App;