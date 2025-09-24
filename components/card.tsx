import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type CardProps = {
  name: string;
  location: string;
  price: string;
  image: string;
  rating?: string;
  onPress?: () => void;
};

export const Card = ({ name, location, price, image, rating = "4.5", onPress }: CardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
      }}
    >
      {/* Rating Badge */}
      <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 rounded-full z-50">
        <FontAwesome name="star" size={12} color="gold" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">{rating}</Text>
      </View>

      {/* Gambar Wisata */}
      <Image
        source={{ uri: image }}
        className="w-full h-40 rounded-lg"
      />

      {/* Info Wisata */}
      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">{name}</Text>
        <Text className="text-xs font-rubik text-black-200">{location}</Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-base font-rubik-bold text-primary-300">{price}</Text>
          <Image
            source={{ uri: "https://img.icons8.com/ios-filled/50/191d31/like.png" }}
            className="w-5 h-5 mr-2"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
