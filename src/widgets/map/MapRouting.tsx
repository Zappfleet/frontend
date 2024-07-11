import axios from "axios";
import { useState } from "react";
import { NeshanServiceKey } from "../../apis/neshan";



export default async function createRoutingOnMap(coordinates: any, mapRef: any) {

    const [coordsForgoogleMap, setCoordsForgoogleMap] = useState<any>([])
    setCoordsForgoogleMap(coordinates)

    console.log(52, coordinates);

    let origin: any
    let destination: any
    let waypoints: any = ''
    const mapLength = coordinates?.length


    coordinates.map((item: any, index: any) => {
        index === 0 ? origin = `${item[1]},${item[0]}` :
            index === mapLength - 1 ? destination = `${item[1]},${item[0]}` :
                mapLength > 2 && index === 1 ? waypoints += `${item[1]},${item[0]}` :
                    waypoints += `%7C${item[1]},${item[0]}`
    })


   // console.log(122, mapLength, origin, destination, waypoints);



    // ساخت آدرس کامل برای درخواست API
    const apiGetRoutingUrl =
        //'https://api.neshan.org/v4/direction?type=car&origin=29.87781386196582,52.80807554886337&destination=29.885447453232032,52.81699611135298&waypoints=29.881032493977102,52.818784660836286%7C29.881886980601294,52.81237890367538&avoidTrafficZone=false&avoidOddEvenZone=false&alternative=false&bearing='
        `https://api.neshan.org/v4/direction?type=car&origin=${origin}&destination=${destination}&waypoints=${waypoints}&avoidTrafficZone=false&avoidOddEvenZone=false&alternative=false&bearing`;
    console.log(66, apiGetRoutingUrl);
    await axios.get(apiGetRoutingUrl, {
        headers: {
            'Api-Key': NeshanServiceKey,
        }
    })
        .then(response => {
            console.log('API response:', response);

            // استخراج مختصات مسیر از پاسخ API
            const routeCoordinates: any = extractRouteCoordinates(mapRef, response.data, coordinates[mapLength - 1]);
            console.log(253, routeCoordinates);

            mapRef?.current?.addRoute(routeCoordinates, true, "255, 0, 0");
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function decodePolyline(polyline: any) {
    let index = 0;
    const len = polyline.length;
    let lat = 0;
    let lng = 0;
    const coordinates = [];

    while (index < len) {
        let shift = 0;
        let result = 0;
        let byte;

        do {
            byte = polyline.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += deltaLat;

        shift = 0;
        result = 0;

        do {
            byte = polyline.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        const deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += deltaLng;

        coordinates.push([lat * 1e-5, lng * 1e-5]);
    }

    return coordinates;
}

function extractRouteCoordinates(mapRef: any, data: any, origin: any): [number, number][] | null {
    try {
        // بررسی و استخراج مختصات از پاسخ API
        const routes = data.routes;
        console.log(400, routes);

        // let coordinates: any = []
        let coordinates: any = []

        //  coordinates.push(origin)
        if (routes && routes.length > 0) {
            routes[0].legs?.map((leg: any, index: any) => {
                leg.steps?.map((step: any, index: any) => {
                    const decodedCoordinates = decodePolyline(step.polyline);
                    decodedCoordinates.map((item: any) => {
                        coordinates.push([item[1], item[0]])
                    })
                  //  console.log(6000, decodedCoordinates);

                    //   coordinates.push([step.start_location[0], step.start_location[1]])
                })

                //  index%2===0? mapRef.current?.addRoute(coordinates, true, "255, 0, 0"):

            })

            //  console.log(777,coordinates.length);

            // coordinates.push(coordinates[coordinates.length - 2])
            // coordinates.push(origin)

            console.log(4589, coordinates);

            mapRef.current?.addRoute(coordinates, true, "0, 0, 255")
            //   const steps = routes[0].legs.map([0].steps;
            // const coordinates = steps.map((step: any) => step.start_location);
            //  return coordinates;
        }
    } catch (error) {
        console.error('Error extracting route coordinates:', error);
    }
    return null;
};