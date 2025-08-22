'use client';

import { useState, useEffect } from 'react';

interface SimpleMapPickerProps {
  isOpen: boolean;
  title: string;
  onSelect: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}

export default function SimpleMapPicker({ isOpen, title, onSelect, onClose }: SimpleMapPickerProps) {
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && !map) {
      // Carregar Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places`;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [isOpen]);

  const initMap = () => {
    const mapInstance = new (window as any).google.maps.Map(document.getElementById('map'), {
      center: { lat: -23.5505, lng: -46.6333 },
      zoom: 13
    });

    const markerInstance = new (window as any).google.maps.Marker({
      map: mapInstance,
      draggable: true
    });

    // Clique no mapa
    mapInstance.addListener('click', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      markerInstance.setPosition(e.latLng);
      
      // Geocoding reverso
      const geocoder = new (window as any).google.maps.Geocoder();
      geocoder.geocode({ location: e.latLng }, (results: any, status: any) => {
        const address = status === 'OK' ? results[0].formatted_address : `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setSelectedLocation({ lat, lng, address });
      });
    });

    // Busca
    const searchBox = new (window as any).google.maps.places.SearchBox(document.getElementById('search-input'));
    
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      mapInstance.setCenter(place.geometry.location);
      mapInstance.setZoom(15);
      markerInstance.setPosition(place.geometry.location);
      
      setSelectedLocation({ lat, lng, address: place.formatted_address });
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect(selectedLocation.lat, selectedLocation.lng, selectedLocation.address);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-[700px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="space-y-4">
          <input
            id="search-input"
            type="text"
            placeholder="Buscar endereço, CEP ou local..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />

          <div id="map" className="w-full h-96 border rounded-lg"></div>

          {selectedLocation && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium">✓ Localização selecionada!</p>
              <p className="text-sm text-green-600">
                Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
              <p className="text-sm text-green-600">Endereço: {selectedLocation.address}</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Busque um local ou clique diretamente no mapa para selecionar
            </p>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedLocation}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                ✓ Confirmar Localização
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}