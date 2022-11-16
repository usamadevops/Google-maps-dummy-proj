import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
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
import Modal from '@material-ui/core/Modal';


const DB_URL = 'http://localhost:3000/dealers';







const SetLocationMap = () => {
    const [name, setName] = useState('');
    //const [variable, setvariable] = useState(1)
    const [pass, setPass] = useState('');
    const center = useMemo(() => ({ lat: 40, lng: -80 }), []); // <google.maps.LatLngLiteral>
    const [polygonCords, setPolygonCords] = useState([]);
    const options = useMemo(() => ({ //<MapOptions>
        // disableDefaultUI: true,
        clickableIcons: false
    }), [])
    const mapRef = useRef(); //mapRef: <GoogleMap>
    const [coords, setCoords] = useState([]);
    const [open, setOpen] = useState(false);


    const onLoad = useCallback(map => (mapRef.current = map), []);

    //car[0],car[1] pressed car[1] , car[0]

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handlePolygonCoords = (e) => {
        //setCoords(coords => [...coords, { lat: e.latLng.lat(), lng: e.latLng.lng() }]);
        //if (coords.length === 4) {
            //setCoords(coords => [...coords, { lat: coords[0].lat, lng: coords[0].lng }]);
            //setOpen(true);
            //setPolygonCords([coords]);
            setPolygonCords([...polygonCords, {lat:e.latLng.lat(),lng:e.latLng.lng()}]);
        //}
        // if (variable<3){
        //     setvariable(variable+1);
        //     setCoords(coords => [...coords, { lat: e.latLng.lat(), lng: e.latLng.lng() }]);
        // }
        // if (variable === 3){
        //     setvariable(variable+1);
        //     setCoords(coords => [...coords, { lat: e.latLng.lat(), lng: e.latLng.lng() }]);
        //     setCoords(coords => [...coords, { lat: coords[0].lat(), lng: coords[0].lng() }]);
        // }  
        // else{
        //     coords[]
        // }
    }


    const handleSignUp = async () => {
        if (polygonCords.length > 4 && name.length > 0) {
            //setPolygonCords([coords]);

            await axios.post('http://localhost:3000/map', { map_name: name, map_coords: polygonCords, parkings_lots: [{
                "parking_name": "Parking1",
                "parking_coords": [],
                "zones": [
                    {
                        "zone_name": "Zone A",
                        "zone_coords": [],
                        "rows": [
                            {
                                "rows_name": "Row 1",
                                "rows_coords": [],
                                "slots": [
                                    {
                                        "spacing_number": "1",
                                        "slot_id": "1",
                                        "slot_coords": []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }] });
            console.log(coords)
            console.log(polygonCords);
            window.location.reload();
        }
        else if (polygonCords.length < 2) {
            alert('Set your Delaership location!');
        }
        else if (name.length === 0) {
            alert('Set your Delaership Name!');

        }

    }




    return (
        <>
            <>
                {
                    open && <Modal
                        onClose={handleClose}
                        open={open}
                        style={{
                            position: 'absolute',
                            border: '2px solid #000',
                            backgroundColor: 'gray',
                            boxShadow: '2px solid black',
                            height: 100,
                            width: 300,
                            margin: 'auto'
                        }}
                    >
                        <div>
                            <h2>Are you sure you want to add the map ?</h2>
                            <button onClick={() => {
                                handleClose()
                            }}>No</button>
                            <button onClick={() => {
                                handleClose();
                                if (coords.length > 4) {
                                    setPolygonCords([coords]);
                                    alert("Click the Signup button to Create map")
                                }
                                }
                            }>Yes</button>
                        </div>
                    </Modal>
                }
            </>
            <div><input type={'text'} value={name} placeholder='Enter your Name here ...' onChange={(e) => { setName(e.target.value) }} />
                {/* <input type={'password'} value={pass} placeholder='Enter your Password here ...' onChange={(e)=>{setPass(e.target.value)}} /> */}
                <button onClick={handleSignUp}>Signup</button></div>
            <div className="map">
                <GoogleMap
                    zoom={10}
                    center={center}
                    key={'Your API KEY'}
                    mapContainerStyle={{ marginTop: 30, width: '100vw', height: '93vh' }}
                    options={options}
                    onLoad={onLoad}
                    onClick={handlePolygonCoords}
                >
                    {polygonCords.length >= 2 && <Polygon paths={polygonCords}
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