import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import './style.scss';
import NeshanMap, { OlMap, Ol } from "@neshan-maps-platform/react-openlayers";
import "@neshan-maps-platform/react-openlayers/dist/style.css";
import { NeshanMapKey } from "../../apis/neshan";
import BaseLayer from "ol/layer/Base";
import { Feature } from "ol";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../../CustomForCustomer/constatns'


export type AddMarkerLayerResult = { marker: BaseLayer, coordinates: [number, number] } | undefined;

export type MapRefType = {
    addMarker: (longitude: number, latitude: number, convert?: boolean, myicon?: string, scale?: any, color?: any) => AddMarkerLayerResult,
    addMarkerToCenter: () => AddMarkerLayerResult,
    viewCoordinates: (lng: number, lat: number, zoom: number) => void,
    addPolygon: (coordinates: [number, number][], convert: boolean, color?: string) => void,
    addPolyline: (coordinates: [number, number][], convert: boolean, color?: string) => void,
    addRoute: (coordinates: [number, number][], convert: boolean, color?: string) => void, // اضافه شده
    remove: (layer: BaseLayer) => void,
    getCenterLonLat: () => [number, number] | undefined
}

type MapContainerProps = {
    freeze?: boolean,
    children?: any,
    mapRef?: React.MutableRefObject<MapRefType | null>,
    onMapInit?: () => void,
}

const MapContainer = forwardRef<MapRefType, MapContainerProps>((props, ref) => {
    console.log(6);
    
    const [markers, setMarkers] = useState<Feature[]>([]);
    const mapRef = useRef<{ ol: Ol, map: OlMap } | null>(null);

    useEffect(() => {
        return () => {
            if (mapRef.current) {
                // Clean up map and layers on unmount
                mapRef.current.map.setTarget(undefined);
                mapRef.current = null;
            }
        };
    }, []);

    function remove(layer: BaseLayer) {
        if (!mapRef.current) return;
        const { map } = mapRef.current;
        map.removeLayer(layer);
    }

    function addRoute(coordinates: [number, number][], convert: boolean, color?: string) {
        if (!mapRef.current) return;
        const { ol, map } = mapRef.current;

        const coordinatesConverted = coordinates.map(c => convert ? ol.proj.fromLonLat(c) : c);

        const feature = new ol.Feature({
            geometry: new ol.geom.LineString(coordinatesConverted)
        });

        const vectorSource = new ol.source.Vector({
            features: [feature]
        });

        const routeLayer = new ol.layer.Vector({
            source: vectorSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: `rgba(${color || "0, 102, 255"}, 0.8)`,
                    width: 3
                }),
                fill: new ol.style.Fill({
                    color: `rgba(${color || "0, 102, 255"}, 0.3)`
                })
            })
        });

        map.addLayer(routeLayer);
        return {
            route: routeLayer,
            coordinates: coordinatesConverted.map(c => convert ? ol.proj.toLonLat(c) : c)
        }
    }

    function addPolyline(coordinates: [number, number][], convert: boolean, color?: string) {
        if (!mapRef.current) return;
        const { ol, map } = mapRef.current;

        const coordinatesConverted = coordinates.map(c => convert ? ol.proj.fromLonLat(c) : c);

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
            coordinates: coordinatesConverted.map(c => convert ? ol.proj.toLonLat(c) : c)
        }
    }

    function addPolygon(coordinates: [number, number][], convert: boolean, color?: string) {
        if (!mapRef.current) return;
        const { ol, map } = mapRef.current;

        const coordinatesConverted = coordinates.map(c => convert ? ol.proj.fromLonLat(c) : c);

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
            coordinates: coordinatesConverted.map(c => convert ? ol.proj.toLonLat(c) : c)
        }
    }

    function getCenterLonLat(): [number, number] | undefined {
        if (!mapRef.current) return;
        const { ol, map } = mapRef.current;
        const view = map.getView();
        const c = view.getCenter();
        if (!c) return;
        return ol.proj.toLonLat([c[0], c[1]]);
    }

    function addMarkerToCenter(): AddMarkerLayerResult {
        if (!mapRef.current) return;
        const view = mapRef.current.map.getView();
        const c = view.getCenter();
        if (c) {
            return addMarker(c[0], c[1], false);
        }
    }

    function addMarker(longitude: number, latitude: number, convert?: boolean, myicon?: string, scale?: any, color?: any): AddMarkerLayerResult {
        if (!mapRef.current) return;
        const { ol, map } = mapRef.current;

        const coordinates = convert ? ol.proj.fromLonLat([longitude, latitude]) : [longitude, latitude];

        let Mycolor: any = color ? color :
            { color: 'rgba(255, 0, 0, 1)' }
        const feature = new ol.Feature(new ol.geom.Point(coordinates));
        const pinLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [feature]
            }),
            style: new ol.style.Style({
                image: myicon ? new ol.style.Icon({
                    src: myicon,
                    scale: scale, // Adjust the scale as needed
                }) : new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke(Mycolor),
                    fill: new ol.style.Fill(Mycolor)
                })
            }),
        });

        map.addLayer(pinLayer);

        // Track markers to force re-render
        setMarkers(prev => [...prev, feature]);

        return {
            marker: pinLayer,
            coordinates: ol.proj.toLonLat([coordinates[0], coordinates[1]])
        }
    }

    function viewCoordinates(lng: number, lat: number, zoom = 12) {
        if (!mapRef.current) return;
        const { ol, map } = mapRef.current;
        const view = map.getView();
        view.animate({
            center: ol.proj.fromLonLat([lng, lat]),
            zoom: zoom,
            duration: 1000,
        });
    }

    const onInit = (ol: Ol, map: OlMap) => {
        mapRef.current = { ol, map };

        if (props.mapRef) {
            props.mapRef.current = {
                addMarker,
                addMarkerToCenter,
                viewCoordinates,
                addPolygon,
                addPolyline,
                addRoute,
                remove,
                getCenterLonLat
            };
        }
        if (props.onMapInit) props.onMapInit();
        // console.log("Map initialized");
    }

    useImperativeHandle(ref, () => ({
        addMarker,
        addMarkerToCenter,
        viewCoordinates,
        addPolygon,
        addPolyline,
        addRoute,
        remove,
        getCenterLonLat
    }), [mapRef.current]);

    return (
         
            <NeshanMap
                style={{ zIndex: 1, height: "100%", width: "100%", pointerEvents: props.freeze ? "none" : 'all' }}
                center={{ latitude: DEFAULT_LATITUDE, longitude: DEFAULT_LONGITUDE }}
                zoom={16}
                mapKey={NeshanMapKey}
                onInit={onInit}
            >
            </NeshanMap>
         
    );
});

export default MapContainer;
