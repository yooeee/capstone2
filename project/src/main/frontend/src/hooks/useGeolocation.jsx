import { useState, useCallback } from 'react';

export const useGeolocation = () => {
  const [state, setState] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: "Geolocation이 지원되지 않습니다." }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => {
        setState(prev => ({ ...prev, error: error.message }));
      }
    );
  }, []);

  return { ...state, getLocation };
};
