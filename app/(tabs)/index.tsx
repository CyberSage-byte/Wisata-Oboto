import { Image, Text, View } from 'react-native';

import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from "react-native-safe-area-context";
import Search from '@/components/search';


export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-white h-full">
      <View className='px-5 '>

        //Header
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row items-center">
            <Image source={require('@/assets/images/icon.png')}  className="size-12 rounded-full"/>
            <View className="flex flex-col items-start ml-2 justify-center">
              <Text className="text-xs font-rubik text-black-100">Selamat Pagi</Text>
              <Text className="text-base font-rubik-medium text-black-300">Andre</Text>
            </View>
          </View>
          <Feather name="bell" size={24} color="black" />
        </View>
        <Search />
        {/* End of Header */}

        
      </View>
    </SafeAreaView>
  );
}

