import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

const Weather = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mapping kondisi cuaca ke ikon, bisa kosong jika asset tidak ada
  const weatherIcons: { [key: string]: any } = {
    "Cerah Berawan": require('@/assets/icons/berawan.png'),
    Cerah: require('@/assets/icons/cerah.png'), //
    Berawan: require('@/assets/icons/berawan.png'),
    Hujan: require('@/assets/icons/hujan.png'),
    Petir: require('@/assets/icons/petir.png'),
    Kabut: require('@/assets/icons/kabut.png'),
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const kelurahanCode = "63.71.04.1007"; // Kemayoran, Jakarta Pusat
        const response = await fetch(
          `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${kelurahanCode}`
        );
        const data = await response.json();

        if (data?.data?.[0]?.cuaca) {
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

  if (loading) return <ActivityIndicator size="small" color="#000" />;

  // Ambil ikon sesuai kondisi, jika tidak ada maka kosong
  const iconSource = weatherIcons[weather?.kondisi];

  return (
    <View className="flex flex-row items-center">
      <View className="flex flex-col items-start mr-2 justify-center">
        <Text className="text-xs font-rubik text-black-100">Cuaca Sekarang</Text>
        <Text className="text-sm font-rubik-medium text-black-300">
          {weather?.kondisi || "Tidak tersedia"}
        </Text>
      </View>
      {iconSource && (
        <Image source={iconSource} className="size-12 rounded-full" />
      )}
    </View>
  );
};

export default Weather;
