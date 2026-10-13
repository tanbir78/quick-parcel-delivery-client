import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import coverageData from "../data/warehouses.json";


// ========================================
// MAP CONTROL
// ========================================
const MapController = ({ selectedLocation }) => {
    const map = useMap();

    if (selectedLocation) {
        map.flyTo(
            [
                selectedLocation.latitude,
                selectedLocation.longitude,
            ],
            11,
            {
                duration: 1.5,
            }
        );
    }

    return null;
};


// ========================================
// MAIN MAP
// ========================================
const CoverageMap = ({ selectedLocation }) => {

    const centerPosition = [23.6850, 90.3563];

    return (
        <div className="w-full h-[700px] rounded-2xl overflow-hidden border border-base-200 shadow-sm">

            <MapContainer
                center={centerPosition}
                zoom={7}
                scrollWheelZoom={true}
                className="w-full h-full"
            >

                {/* OpenStreetMap */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                {/* Move map when search result changes */}
                <MapController
                    selectedLocation={selectedLocation}
                />


                {/* ============================
                    ALL DISTRICT MARKERS
                ============================ */}
                {coverageData
                    .filter(
                        (location) =>
                            location.status === "active"
                    )
                    .map((location) => (

                        <Marker
                            key={location.district}
                            position={[
                                location.latitude,
                                location.longitude,
                            ]}
                        >

                            <Popup>

                                <div className="min-w-[200px]">

                                    <h3 className="text-lg font-bold text-black">
                                        {location.district}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {location.city}
                                    </p>

                                    <div className="mt-2">

                                        <p className="font-semibold text-sm">
                                            Covered Areas:
                                        </p>

                                        <ul className="list-disc list-inside text-xs text-gray-600">

                                            {location.covered_area.map(
                                                (area) => (
                                                    <li key={area}>
                                                        {area}
                                                    </li>
                                                )
                                            )}

                                        </ul>

                                    </div>

                                    <p className="mt-2 text-xs font-medium text-green-600">
                                        ● Active Branch
                                    </p>

                                </div>

                            </Popup>

                        </Marker>

                    ))}

            </MapContainer>

        </div>
    );
};

export default CoverageMap;