import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, Text, TouchableOpacity, View } from "react-native";

type TourCardProps = {
  name: string;
  location: string;
  price: string;
  image: string;
  onPress?: () => void;
};

export const TourCard = ({ name, location, price, image, onPress }: TourCardProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      className="flex flex-col items-start w-60 h-80 relative"
    >
      {/* Gambar wisata */}
      <Image
        source={{ uri: image }}
        className="size-full rounded-xl"
      />

      {/* Gradient overlay */}
      <Image
        source={require("@/assets/images/card-gradient.png")}
        className="size-full rounded-2xl absolute bottom-0"
      />

        {/* Rating */}
        <View className='flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5'>
            <FontAwesome name="star" size={15} color="gold" />            
            <Text className='text-xs font-rubik-bold text-primary-300 ml-1'>4.5</Text>
        </View>

      {/* Info wisata */}
      <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
        <Text className="text-2xl font-rubik-extrabold text-white">
          {name}
        </Text>
        <Text className="text-base font-rubik text-white">{location}</Text>

        <View className="flex flex-row items-center justify-between w-full">
          <Text className="text-base font-rubik-extrabold text-white">{price}</Text>
          <Image
            source={{ uri: "https://img.icons8.com/ios-filled/50/ffffff/like.png" }}
            className="size-5"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
