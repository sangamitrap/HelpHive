import { useEffect, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { mockLocationService } from '../services/mockData';

export default function LocationStatus() {
  const { location, setLocation, setLocationError, locationError } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    setIsLoading(true);
    try {
      const loc = await mockLocationService.getLocation();
      setLocation(loc);
      setLocationError(null);
    } catch (error) {
      setLocationError(error.message);
      setLocation(null);
      console.log('Location error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Location Status</h2>
        <MapPin className="w-5 h-5 text-blue-500" />
      </div>

      {location ? (
        <div className="space-y-2">
          <p className="text-sm text-green-600 font-medium">✅ Location enabled</p>
          <p className="text-xs text-gray-600">
            Latitude: {location.latitude.toFixed(4)}
          </p>
          <p className="text-xs text-gray-600">
            Longitude: {location.longitude.toFixed(4)}
          </p>
          <p className="text-xs text-gray-600">
            Accuracy: ±{Math.round(location.accuracy)} meters
          </p>
        </div>
      ) : locationError || isLoading === false ? (
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-600 font-medium">Location disabled</p>
              <p className="text-xs text-gray-600 mt-1">
                {locationError || 'Location permission was denied'}
              </p>
            </div>
          </div>
          <button
            onClick={requestLocationPermission}
            disabled={isLoading}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
          >
            {isLoading ? 'Requesting...' : 'Retry'}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-600">Requesting location...</p>
      )}
    </div>
  );
}
