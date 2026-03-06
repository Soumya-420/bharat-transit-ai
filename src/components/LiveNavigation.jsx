import React, { useMemo } from 'react';
import { Mic, ShieldAlert, Share2, Compass, ArrowRight, Train, Navigation, BellRing } from 'lucide-react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function LiveNavigation({ route, apiResult }) {
    // GeoJSON route feature
    const routeGeojson = useMemo(() => {
        if (!apiResult?.route_geojson) return null;
        return {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: apiResult.route_geojson
            }
        };
    }, [apiResult]);

    // Layer styling for the path
    const routeLayerStyle = {
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#0ea5e9', // Primary blue
            'line-width': 6,
            'line-opacity': 0.8
        }
    };

    // Calculate dynamic coordinates from data if available
    const startCoords = apiResult?.route_geojson?.[0] || [77.2185, 28.6141];
    const endCoords = apiResult?.route_geojson?.[apiResult.route_geojson.length - 1] || [77.2090, 28.6139];

    return (
        <div className="h-full flex flex-col bg-slate-50 animate-slide-up pb-20">

            {/* Search Header Info */}
            <div className="bg-white px-4 py-3 shadow-sm z-10">
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                        <Train className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Navigating</p>
                        <p className="font-bold text-sm text-slate-800">To India Gate</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-emerald-600">22<span className="text-sm font-bold ml-0.5">m</span></p>
                        <p className="text-[10px] font-bold text-slate-400">ETA 14:45</p>
                    </div>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-slate-200 overflow-hidden">
                <Map
                    initialViewState={{
                        longitude: startCoords[0],
                        latitude: startCoords[1],
                        zoom: 13
                    }}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                    mapboxAccessToken="pk.eyJ1IjoicGxhY2Vob2xkZXIiLCJhIjoiY2xhY2Vob2xkZXIifQ.placeholder" // Replace with real token
                    style={{ width: '100%', height: '100%' }}
                >
                    {routeGeojson && (
                        <Source id="route-source" type="geojson" data={routeGeojson}>
                            <Layer {...routeLayerStyle} />
                        </Source>
                    )}

                    <Marker longitude={endCoords[0]} latitude={endCoords[1]} anchor="bottom">
                        <div className="bg-white p-1 rounded-full shadow-lg border-2 border-emerald-500">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        </div>
                    </Marker>
                    <Marker longitude={startCoords[0]} latitude={startCoords[1]} anchor="bottom">
                        <div className="bg-primary-500 text-white p-1.5 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] border-2 border-white">
                            <Navigation className="w-4 h-4" />
                        </div>
                    </Marker>
                </Map>

                <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-20">
                    <button className="bg-white p-2.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)] text-slate-700 hover:text-primary-600 transition-colors interactive-tap">
                        <Compass className="w-5 h-5" />
                    </button>
                    <button className="bg-white p-2.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)] text-slate-700 hover:text-primary-600 transition-colors interactive-tap">
                        <BellRing className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Floating Instruction Card */}
            <div className="absolute bottom-24 left-4 right-4 bg-slate-900 text-white rounded-3xl p-5 shadow-2xl z-20 border border-slate-800 glass-panel-dark">
                <div className="flex gap-4">
                    <div className="bg-primary-500/20 p-3 rounded-2xl h-fit border border-primary-500/30">
                        <ArrowRight className="w-6 h-6 text-primary-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-primary-400 text-xs font-bold tracking-wide uppercase mb-1">Next Step</p>
                        <p className="font-semibold text-lg leading-tight mb-4">Board Metro - Blue Line <span className="text-slate-400 font-normal">towards Dwarka</span></p>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-2">
                            <button className="flex flex-col items-center justify-center bg-slate-800/80 hover:bg-slate-700 py-2.5 rounded-xl transition-colors interactive-tap gap-1.5">
                                <Mic className="w-4 h-4 text-slate-300" />
                                <span className="text-[10px] font-medium text-slate-300">Ask Native</span>
                            </button>
                            <button className="flex flex-col items-center justify-center bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 py-2.5 rounded-xl transition-colors interactive-tap gap-1.5">
                                <ShieldAlert className="w-4 h-4 text-rose-400" />
                                <span className="text-[10px] font-bold text-rose-400 uppercase">SOS</span>
                            </button>
                            <button className="flex flex-col items-center justify-center bg-slate-800/80 hover:bg-slate-700 py-2.5 rounded-xl transition-colors interactive-tap gap-1.5">
                                <Share2 className="w-4 h-4 text-slate-300" />
                                <span className="text-[10px] font-medium text-slate-300">Share Live</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
