import { Card } from '@/components/card';
import { TourCard } from '@/components/cards';
import Filters from '@/components/filters';
import Search from '@/components/search';
import Weather from '@/components/weather';
import { wisataList } from '@/constants/wisataList';
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";



export default function HomeScreen() {

    const [time, setTime] = useState<string>("");

    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        // Format jam: HH:MM:SS
        const formatted = now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setTime(formatted);
      }, 1000);

      return () => clearInterval(interval); // bersihin interval biar gak bocor memory
    }, []);
    
    function getGreeting() {
      const hour = new Date().getHours();

      if (hour >= 4 && hour < 11) return "Selamat Pagi";   // 04:00 - 10:59
      if (hour >= 11 && hour < 15) return "Selamat Siang"; // 11:00 - 14:59
      if (hour >= 15 && hour < 18) return "Selamat Sore";  // 15:00 - 17:59
      return "Selamat Malam";                              // 18:00 - 03:59
    }

    const [greeting, setGreeting] = useState(getGreeting());

    useEffect(() => {
      const interval = setInterval(() => {
        setGreeting(getGreeting());
      }, 60000); // update tiap 1 menit
      return () => clearInterval(interval);
    }, []);

  return (
    <SafeAreaView className="bg-white h-full" edges={['top', 'left', 'right']}>
      <FlatList
        data={wisataList}
        renderItem={({ item }) => (
          <Card
            name={item.name}
            location={item.location}
            price={item.price}
            image={item.image}
            // rating bisa dikosongkan atau default
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <View className="px-5">
            
            {/* Header */}
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image source={require('@/assets/images/icon.png')}  className="size-12 rounded-full"/>
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">{greeting}</Text>
                  <Text className="text-base font-rubik-medium text-black-300">Andre</Text>
                </View>
              </View>
              <Weather />
            </View>
            {/* End of Header */}

            <Search />

            <View className="flex flex-row items-center justify-between mt-8">
              <Text className="text-xl font-rubik-bold text-black-300">Wisata Populer</Text>
            </View>

            {/* Horizontal Card List */}
            <FlatList
              data={wisataList} // gunakan wisataList juga
              renderItem={({ item }) => (
                <TourCard
                  name={item.name}
                  location={item.location}
                  price={item.price}
                  image={item.image}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              bounces={false}
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="flex gap-5 mt-5"
            />

            <Filters />
            <Text className="text-xl font-rubik-bold text-black-300 mt-4">Wisata Lainnya</Text>

            
          </View>
        }
      />
    </SafeAreaView>
  );
}

