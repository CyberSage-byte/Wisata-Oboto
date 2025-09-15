import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { TourCard } from '@/components/cards';
import Search from '@/components/search';
import Weather from '@/components/weather';
import { wisataList } from '@/constants/wisataList';
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-white h-full">
      <View className='px-5 '>

        {/* Header */}
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row items-center">
            <Image source={require('@/assets/images/icon.png')}  className="size-12 rounded-full"/>
            <View className="flex flex-col items-start ml-2 justify-center">
              <Text className="text-xs font-rubik text-black-100">Selamat Pagi</Text>
              <Text className="text-base font-rubik-medium text-black-300">Andre</Text>
            </View>
          </View>
          <View className='flex flex-row items-center'>
            <View className="flex flex-col items-start mr-2 justify-center">
              <Text className="text-xs font-rubik text-black-100">Cuaca Sekarang</Text>
              <Weather />
            </View>
            <Image source={require('@/assets/icons/cloudy.png')}  className="size-12 rounded-full"/>
          </View>
        </View>
        <Search />
        {/* End of Header */}

        <View className="flex flex-row items-center justify-between mt-8">
          <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
          <TouchableOpacity>
            <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex gap-5 mt-5"
        >
          {wisataList.map((item) => (
            <TourCard
              key={item.id}
              name={item.name}
              location={item.location}
              price={item.price}
              image={item.image}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

