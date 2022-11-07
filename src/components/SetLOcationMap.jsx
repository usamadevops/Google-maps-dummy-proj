import {useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
    GoogleMap,
    Marker,
    DirectionsRenderer,
    Circle,
    Polygon,
    MarkerClusterer,
    computeOffset
    

} from '@react-google-maps/api';
import axios from 'axios';

const DB_URL = 'http://localhost:3000/dealers';








const SetLocationMap = () => {
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const center = useMemo(()=>({lat:40,lng:-80}),[]); // <google.maps.LatLngLiteral>
    const [polygonCords, setPolygonCords] = useState([]);
    const options = useMemo(()=>({ //<MapOptions>
        // disableDefaultUI: true,
        clickableIcons: false
    }),[])
    const mapRef = useRef(); //mapRef: <GoogleMap>
 
    const onLoad = useCallback(map => (mapRef.current = map),[]);


const handlePolygonCoords = (e)=>{
    setPolygonCords([...polygonCords, {lat:e.latLng.lat(),lng:e.latLng.lng()}]);
}
   

const handleSignUp = async()=>{
    if(polygonCords.length >2 && name.length>0 && pass.length>0){
      await axios.post('http://localhost:3000/map',{Name:name,Password:pass,coords:polygonCords});
    

    }
    else if(polygonCords.length<2){
        alert('Set your Delaership location!');
    }
    else if(name.length===0){
        alert('Set your Delaership Name!');

    }
    else if(pass.length===0){
        alert('Set your Password!');

    }
    
}




  return (
    <><div><input type={'text'} value={name} placeholder='Enter your Name here ...' onChange={(e)=>{setName(e.target.value)}} />
    <input type={'password'} value={pass} placeholder='Enter your Password here ...' onChange={(e)=>{setPass(e.target.value)}} />
    <button onClick={handleSignUp}>Signup</button></div>
    <div className="map">
            <GoogleMap
            zoom={10} 
            center={center}
            key={'Your API KEY'}
            mapContainerStyle={{marginTop:30,width:'100vw',height:'93vh'}}
            options={options}
            onLoad={onLoad}
            onClick={handlePolygonCoords}
            >   
                {polygonCords.length>=2 && <Polygon paths={polygonCords} 
                options={
                    [
                        {
                            "featureType": "all",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "saturation": "32"
                                },
                                {
                                    "lightness": "-3"
                                },
                                {
                                    "visibility": "on"
                                },
                                {
                                    "weight": "1.18"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.neighborhood",
                            "elementType": "labels.text",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.neighborhood",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.neighborhood",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.neighborhood",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape.man_made",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "saturation": "-70"
                                },
                                {
                                    "lightness": "14"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape.natural",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "saturation": "100"
                                },
                                {
                                    "lightness": "-14"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                },
                                {
                                    "lightness": "12"
                                }
                            ]
                        }
                    ]
                
                  
                } />}
             
            </GoogleMap>
        </div>
        </>
  )
}

export default SetLocationMap