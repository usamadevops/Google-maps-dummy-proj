import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
    GoogleMap,
    Marker,
    Polygon,
} from '@react-google-maps/api';
import axios from 'axios';

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



const Map = ({ data }) => {
    const [addCar, setaddCar] = useState([]);
    const [cars,setCars]=useState([]);
    const [delalersLocation, setDealersLocation] = useState(null);
    const [markers, setMarkers] = useState([]);  
    const [polygonCords, setPolygonCords] = useState([]);
    const options = useMemo(() => ({ 
        clickableIcons: false
    }), [])
    const mapRef = useRef(); 

const handlecarCoords = (e)=>{
    setaddCar(addCar=>[...addCar,{lat:e.latLng.lat(),lng:e.latLng.lng()}]); 
   if(addCar.length==4){
       setCars(cars=>[...cars,addCar]);
       alert('Car Added',cars.length);
       setaddCar([]);
   }
}
    useEffect(() => {
        setDealersLocation(() => get_polygon_centroid(data.coords));
        data.cars && setMarkers(data.cars);
        setPolygonCords(data.coords);
    }, [])

    const onLoad = useCallback(map => (mapRef.current = map), []);
    const handleSubmitCars = async (e) => {

        const data1 = await axios.put(`${DB_URL}/${data.id}`, cars);
        if (data1) {
            alert('Cars sucessfully added!');
        }
        else {
            alert('Some Error Occured!');
        }
    }



    return (
        <>
            <div>
                <button onClick={handleSubmitCars} style={{color:'white',padding:'10px',position:'absolute',width:'100%',backgroundColor:'chocolate',zIndex:1000,bottom:40,right:20}}>Submit Cars</button>
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
                                    <Polygon paths={item}
                                    key={item.lat}
                                        options={{
                                            strokeColor: "#FF0000",
                                            fillOpacity: 2
                                        }}
                                    />)
                            }

                            <Polygon paths={polygonCords}
                                options={{
                                    strokeColor: "#FFffff",
                                    strokeWeight:4,
                                    fillOpacity: 0
                                }}
                                onClick={(e) => {handlecarCoords(e)}}
                            />
                        </>
                    </GoogleMap>
                }
            </div>
        </>
    )
}

export default Map