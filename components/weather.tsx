import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";

const Weather = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Ganti kode kabupaten sesuai kebutuhan
        const kelurahanCode = "63.03.04.1001"; // Kemayoran, Jakarta Pusat
        const response = await fetch(
        `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${kelurahanCode}`
        );
        const data = await response.json();

        if (data?.data?.[0]?.cuaca) {
          // Ambil prakiraan terdekat
          const firstForecast = data.data[0].cuaca[0][0];
          setWeather({
            kondisi: firstForecast.weather_desc,
          });
        }
      } catch (error) {
        console.error("Gagal ambil cuaca:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <Text>{weather ? weather.kondisi : "Tidak tersedia"}</Text>
  );
};

export default Weather;
