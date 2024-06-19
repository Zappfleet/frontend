import { useEffect, useRef, useState } from "react";
import './style.scss'
import NeshanMap, { NeshanMapRef, OlMap, Ol } from "@neshan-maps-platform/react-openlayers"
import nmp_mapboxgl from '@neshan-maps-platform/mapbox-gl';
import "@neshan-maps-platform/react-openlayers/dist/style.css"
import MarkerRed from "../../images/map/marker-red.png";
import { NeshanMapKey } from "../../apis/neshan";
import BaseLayer from "ol/layer/Base";
import DriverOnMap from "../../components/DriverOnMap/DriverOnMap";
import { LayerGroup } from "react-leaflet";
import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Feature } from "ol";

export type AddMarkerLayerResult = { marker: BaseLayer, coordinates: [number, number] } | undefined;


export type MapRefType = {
    addMarker: (longitude: number, latitude: number, convert?: boolean, myicon?: string,scale?:any) => AddMarkerLayerResult,
    addMarkerToCenter: () => AddMarkerLayerResult,
    viewCoordinates: (lng: number, lat: number, zoom: number) => void,
    addPolygon: (coordinates: [[number]], convert: boolean, color?: string) => void,
    addPolyline: (coordinates: [[number]], convert: boolean, color?: string) => void,
    remove: (layer: BaseLayer) => void,
    getCenterLonLat: () => void
}

type MapContainerProps = {
    freeze?: boolean,
    children?: any,
    mapRef?: { current: MapRefType }
    onMapInit?: () => void,

}


export default function MapContainer(props: MapContainerProps) {



    const ref = useRef<{ ol: Ol, map: OlMap } | null>(null);

    function remove(layer: BaseLayer) {
        if (ref.current == null) return;
        const { map } = ref.current;
        map.removeLayer(layer);
    }

    function addPolyline(coordinates: [[number]], convert: boolean, color?: string) {
        if (ref.current == null) return;
        const { ol, map } = ref.current;

        const coordinatesConverted = coordinates.map((c) => {
            return convert ? ol.proj.fromLonLat(c) : c;
        })

        const feature = new ol.Feature({
            geometry: new ol.geom.LineString(coordinatesConverted)
        });

        const vectorSource = new ol.source.Vector({
            features: [feature]
        });
        const polylineLayer = new ol.layer.Vector({
            source: vectorSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: `rgba(${color || "255, 102, 0"}, 0.8)`,
                    width: 3
                }),
                fill: new ol.style.Fill({
                    color: `rgba(${color || "255, 102, 0"}, 0.3)`
                })
            })
        });
        map.addLayer(polylineLayer);
        return {
            polyline: polylineLayer,
            coordinates: coordinatesConverted.map((c) => {
                return convert ? ol.proj.toLonLat(c) : c;
            })
        }
    }

    function addPolygon(coordinates: [[number]], convert: boolean, color?: string) {
        if (ref.current == null) return;

        const { ol, map } = ref.current;

        const coordinatesConverted = coordinates.map((c) => {
            return convert ? ol.proj.fromLonLat(c) : c;
        })

        const feature = new ol.Feature({
            geometry: new ol.geom.Polygon([coordinatesConverted])
        });

        const vectorSource = new ol.source.Vector({
            features: [feature]
        });

        const polygonLayer = new ol.layer.Vector({
            source: vectorSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: `rgba(${color || "255, 102, 0"}, 0.8)`,
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: `rgba(${color || "255, 102, 0"}, 0.3)`
                })
            })
        });

        map.addLayer(polygonLayer);
        return {
            polygon: polygonLayer,
            coordinates: coordinatesConverted.map((c) => {
                return convert ? ol.proj.toLonLat(c) : c;
            })
        }
    }

    function getCenterLonLat() {
        if (ref.current == null) return;

        const { ol, map } = ref.current;
        const view = map.getView();
        const c = view.getCenter();
        if (c == null) return;

        const longitude = c[0]
        const latitude = c[1]
        return ol.proj.toLonLat([longitude, latitude]);

    }

    function addMarkerToCenter(): AddMarkerLayerResult {
        if (ref.current == null) return;
        const view = ref.current.map.getView();
        const c = view.getCenter();
        if (c != null) {
            return addMarker(c[0], c[1], false)
        }
    }

    function addMarker(longitude: number, latitude: number, convert?: boolean, myicon?: any, scale?: any): AddMarkerLayerResult {
        //  console.log(77);

        if (ref.current == null) return;
        const { ol, map } = ref.current;
        //  console.log(77, ol);
        const coordinates = convert ? ol.proj.fromLonLat([longitude, latitude]) : [longitude, latitude];

        const feature = new ol.Feature(new ol.geom.Point(coordinates));
        const pinLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [feature]
            }),
            style: new ol.style.Style({
                image:
                    myicon ?
                        // new ol.style.Circle({
                        //     radius: 5,
                        //     stroke: new ol.style.Stroke({ color: 'green' }),
                        //     fill: new ol.style.Fill({ color: 'green' })
                        // })
                        new ol.style.Icon({
                            src: myicon,
                            scale: scale,// Adjust the scale as needed
                        })
                        :
                        new ol.style.Circle({
                            radius: 5,
                            stroke: new ol.style.Stroke({ color: 'rgba(255, 0, 0, 1)' }),
                            fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.5)' })
                        })
            }),
            //className: 'w-8' // Add your class name here
        });

        // console.log(222, longitude, latitude);

        map.addLayer(pinLayer);

        return {
            marker: pinLayer,
            coordinates: ol.proj.toLonLat([coordinates[0], coordinates[1]])
        }
    }

    function viewCoordinates(lng: number, lat: number, zoom = 12) {
        if (ref.current == null) return;

        const view = ref.current.map.getView()
        const ol = ref.current.ol;
        view.animate({
            center: ol.proj.fromLonLat([lng, lat]),
            zoom: zoom,
            duration: 1000,
        })
    }


    const onInit = (ol: Ol, map: OlMap) => {
        ref.current = { ol, map };

        if (props.mapRef == null) return;
        props.mapRef.current = {
            addMarker,
            addMarkerToCenter,
            viewCoordinates,
            addPolygon,
            addPolyline,
            remove,
            getCenterLonLat
        }
        if (props.onMapInit != null) props.onMapInit()

        ///////////////////////
        //addCustomMarkers(map);

        //////////////////
    }

    const addCustomMarkers = (map1: any) => {

        mapboxgl.accessToken = NeshanMapKey;

        const geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'message': 'Foo',
                        'imageId': 1011,
                        'iconSize': [60, 60]
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-66.324462, -16.024695]
                    }
                },
                {
                    'type': 'Feature',
                    'properties': {
                        'message': 'Bar',
                        'imageId': 870,
                        'iconSize': [50, 50]
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-61.21582, -15.971891]
                    }
                },
                {
                    'type': 'Feature',
                    'properties': {
                        'message': 'Baz',
                        'imageId': 837,
                        'iconSize': [40, 40]
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-63.292236, -18.281518]
                    }
                }
            ]
        };

        const map = new mapboxgl.Map({
            container: 'mapsgh',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-65.017, -16.457],
            zoom: 5
        });

        geojson.features.forEach((marker: any) => {
            const el = document.createElement('div');
            const width = marker.properties.iconSize[0];
            const height = marker.properties.iconSize[1];
            el.className = 'marker';
            el.style.backgroundImage = `url(https://picsum.photos/id/${marker.properties.imageId}/${width}/${height})`;
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.backgroundSize = '100%';

            el.addEventListener('click', () => {
                window.alert(marker.properties.message);
            });

            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map1);
        })


        const { ol, map2 }: any = ref.current;
        geojson.features.forEach((feature: any) => {

            const pinLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [feature]
                }),
                style: new ol.style.Style({
                    image:
                        //myPinLayerAddress ?
                        // new ol.style.Icon({
                        //     anchor: [0.5, 1],
                        //     src: carIcon,  // Path to the search icon image
                        //     scale: 1
                        // }) :
                        // new ol.style.Circle({
                        //     radius: 5,
                        //     stroke: new ol.style.Stroke({ color: 'green' }),
                        //     fill: new ol.style.Fill({ color: 'green' })
                        // }) :
                        new ol.style.Circle({
                            radius: 5,
                            stroke: new ol.style.Stroke({ color: 'rgba(255, 0, 0, 1)' }),
                            fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.5)' })
                        })
                })
            });

            map2.addLayer(pinLayer);

        });



        //  return () => map.remove(); // Cleanup on unmount

    };


    return <NeshanMap
        style={{ zIndex: 1, height: "100%", width: "100%", pointerEvents: props.freeze ? "none" : 'all' }}
        center={{ latitude: 29.882589, longitude: 52.808064 }}
        zoom={14}
        mapKey={NeshanMapKey}
        onInit={onInit}
    >
    </NeshanMap>

    // <div style={{ height: '100vh', width: '100%' }}>
    //     <div ref={mapContainer} id="mapsgh" style={{ height: '100%', width: '100%' }} />

    //     <style>
    //         {`
    //     .marker {
    //         background-image: url('custom_marker.png');
    //         background-size: cover;
    //         width: 32px;
    //         height: 40px;
    //         top: -20px;
    //         cursor: pointer;
    //     }

    //     .mapboxgl-popup {
    //         max-width: 200px;
    //     }

    //     .mapboxgl-popup-content {
    //         direction: rtl;
    //         text-align: center;
    //         font-family: 'Open Sans', sans-serif;
    //     }
    //     `}
    //     </style>
    // </div>








    //      <div>
    //     <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
    //     <style>
    //         {`
    //         .marker {
    //             display: block;
    //             border: none;
    //             border-radius: 50%;
    //             cursor: pointer;
    //             padding: 0;
    //         }
    //         `}
    //     </style>
    // </div>






}