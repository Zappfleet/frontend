import { useRef, useState } from "react";
import NeshanMap, { NeshanMapRef, OlMap, Ol } from "@neshan-maps-platform/react-openlayers"
import "@neshan-maps-platform/react-openlayers/dist/style.css"
import MarkerRed from "../../images/map/marker-red.png";
import { NeshanMapKey } from "../../apis/neshan";
import BaseLayer from "ol/layer/Base";

export type AddMarkerLayerResult = { marker: BaseLayer, coordinates: [number, number] } | undefined;


export type MapRefType = {
    addMarker: (longitude: number, latitude: number, convert?: boolean) => AddMarkerLayerResult,
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
        if (c != null)
            return addMarker(c[0], c[1], false);
    }

    function addMarker(longitude: number, latitude: number, convert?: boolean): AddMarkerLayerResult {
        if (ref.current == null) return;
        const { ol, map } = ref.current;

        const coordinates = convert ? ol.proj.fromLonLat([longitude, latitude]) : [longitude, latitude];

        const feature = new ol.Feature(new ol.geom.Point(coordinates));
        const pinLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [feature]
            }),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({ color: 'rgba(255, 0, 0, 1)' }),
                    fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.5)' })
                })
            })
        });

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
    }

    return <div className="absolute top-0 left-0 bottom-0 right-0 rounded overflow-hidden shadow-md">
        <NeshanMap
            style={{ height: "100%", width: "100%", pointerEvents: props.freeze ? "none" : 'all' }}
            center={{ latitude: 29.882589, longitude: 52.808064 }}
            zoom={14}
            mapKey={NeshanMapKey}
            onInit={onInit}
        ></NeshanMap>
    </div>
}