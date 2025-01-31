import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
    GoogleMap,
    Marker,
    Polygon,
} from '@react-google-maps/api';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';

const DB_URL = 'http://localhost:3000/map';

function get_polygon_centroid(pts) {
    var first = pts[0], last = pts[pts.length - 1];
    if (first.lat != last.lat || first.lng != last.lng) pts.push(first);
    var twicearea = 0,
        x = 0, y = 0,
        nPts = pts.length,
        p1, p2, f;
    for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = pts[i]; p2 = pts[j];
        f = (p1.lng - first.lng) * (p2.lat - first.lat) - (p2.lng - first.lng) * (p1.lat - first.lat);
        twicearea += f;
        x += (p1.lat + p2.lat - 2 * first.lat) * f;
        y += (p1.lng + p2.lng - 2 * first.lng) * f;
    }
    f = twicearea * 3;
    return { lat: x / f + first.lat, lng: y / f + first.lng };
}



const Map = ({ data, setData }) => {
    const [addCar, setaddCar] = useState([]);
    const [cars, setCars] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [delalersLocation, setDealersLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [polygonCords, setPolygonCords] = useState([]);
    const [submitCars, setSubmitCars] = useState([]);
    const [car, setCar] = useState(false);
    const [building, setBuilding] = useState(false);
    const [mappingSlots,setMappingSlots] = useState([]);

    const options = useMemo(() => ({
        clickableIcons: false
    }), [])
    const mapRef = useRef();

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handlecarCoords = (e) => {
        
        if (addCar.length !== 4)
            setaddCar(addCar => [...addCar, { lat: e.latLng.lat(), lng: e.latLng.lng() }]);
        if (addCar.length === 4) {
            setOpen(true);
            setaddCar(addCar => [...addCar, { lat: addCar[0].lat, lng: addCar[0].lng }]);

        }
    }

    const getCars = async () => {
        const data1 = await axios.get(`${DB_URL}/${data.id}`);
        setCars(data1?.data?.parkings_lots);
        setBuildings(data1?.data?.buildings);
    }
    useEffect(() => {
        console.log(data?.data);
        setDealersLocation(() => get_polygon_centroid(data.map_coords));
        data.parkings_lots && setMarkers(data.parkings_lots);
        setPolygonCords(data.map_coords);
    }, [])

    useEffect(() => {
        getCars();
    }, []);

    const onLoad = useCallback(map => (mapRef.current = map), []);
    const handleSubmitCars = async (e) => {
        console.log("slots: ", data.parkings_lots[0].zones[0].rows[0].slots)
        var check = {
                "map_name": data?.map_name,
                "map_coords":
                    data?.map_coords,
                "parkings_lots": [
                    {
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
                                    "slots": [...data?.parkings_lots?.[0]?.zones?.[0]?.rows?.[0]?.slots, 
                                        {
                                            "spacing_number": "1",
                                            "slot_id": "1",
                                            "slot_coords": addCar
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }], "id": data?.id
            }

        console.log("data: ", data)
        console.log("check: ", check)

        const data1 = await axios.put(`${DB_URL}/${data.id}`, check);
        // const data2 = await axios.patch(`${DB_URL}/${data.id}`, { "buildings": buildings });
        if (data1) {
            alert('Cars sucessfully added!');
            setData(check)
        }
        else {
            alert('Some Error Occured!');
        }
        
        setaddCar([]);
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
                            <h2>What do you want to add ?</h2>
                            <button onClick={() => {
                                handleClose()
                                let brand = prompt("Please enter your car's brand", "BMW");
                                if (brand) {
                                    setCars(cars => [...cars, {addCar} ]);
                                    alert('Car Added', cars.length);
                                    // setaddCar([]);
                                }
                            }}>Car</button>
                            <button onClick={() => {
                                handleClose()
                                let name = prompt("Please enter your building name", "Office");
                                if (name) {
                                    setBuildings(buildings => [...buildings, { buildingId: Math.random(), Name: name, location: addCar }]);
                                    alert('Building Added', buildings.length);
                                    console.log(addCar)
                                    // setaddCar([]);
                                    console.log(buildings);
                                }
                            }}>Building</button>
                        </div>
                    </Modal>
                }
            </>
            <div>
                <button onClick={handleSubmitCars} style={{ color: 'white', padding: '10px', position: 'absolute', width: '100%', backgroundColor: 'chocolate', zIndex: 1000, bottom: 40, right: 20 }}>Submit Cars</button>
            </div>
            <div className="map">
                {delalersLocation &&
                    <GoogleMap
                        zoom={24}
                        key={'Your API KEY'}
                        center={delalersLocation}
                        mapContainerStyle={{ width: '100vw', height: '90vh' }}
                        options={options}
                        onLoad={onLoad}
                    >
                        <>
                            <Marker position={delalersLocation} />
                            {
                                addCar &&
                                <Polygon path={addCar}
                                    key={addCar.lat}
                                    options={{
                                        strokeColor: "#FF0000",
                                        fillOpacity: 1
                                    }}
                                />
                            }
                            {
                                cars && cars.map(item =>
                                    <Polygon paths={item?.parkings_lots?.zones?.rows?.slots?.slot_coords}
                                        key={item?.parkings_lots?.zones?.rows?.slots?.slot_coords}
                                        label={"Car"}
                                        options={{
                                            strokeColor: "#FF0000",
                                            fillOpacity: 2
                                        }}
                                    />)
                            }

{
                                buildings && buildings.map(item =>
                                    <Polygon paths={item?.location}
                                        key={item?.location.lat}
                                        options={{
                                            strokeColor: "#FFF000",
                                            fillOpacity: 2
                                        }}
                                    ></Polygon>)
                            }

                            <Polygon paths={polygonCords}
                                options={{
                                    strokeColor: "#FFffff",
                                    strokeWeight: 4,
                                    fillOpacity: 0
                                }}
                                onClick={(e) => { handlecarCoords(e) }}
                            />
                        </>
                    </GoogleMap>
                }
            </div>
        </>
    )
}

export default Map