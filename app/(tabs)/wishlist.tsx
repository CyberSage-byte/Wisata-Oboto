import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from 'react-native-maps';


import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { height, width } = Dimensions.get("window");

const images = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
];

export default function ApartmentDetails() {

  const [address, setAddress] = useState<string | null>(null);
  const coords = { latitude: -6.125321, longitude: 107.058768 };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const apiKey = "pk.ed6b3c4cd1df0208ce1aa28ba3e3c989"; // ganti sama key lo
        const url = `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=id`;

        const response = await fetch(url);
        const data = await response.json();

        if (data && data.display_name) {
          setAddress(data.display_name);
        } else {
          setAddress("Alamat tidak ditemukan");
        }
      } catch (error) {
        console.error(error);
        setAddress("Gagal mengambil alamat");
      }
    };

    fetchAddress();
  }, []);


  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setActiveIndex(slideIndex);
  };

  const [modalVisible, setModalVisible] = useState(false);

  // semua gambar tambahan
  const extraImages = [
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20",
    "https://images.unsplash.com/photo-1649083048770-82e8ffd80431",
    "https://images.unsplash.com/photo-1649083048337-4aeb6dda80bb",
    "https://images.unsplash.com/photo-1615874694520-474822394e73",
  ];

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 20, backgroundColor: "white" }}>
        {/* Slider */}
        <View className="relative">
          <FlatList
            ref={flatListRef}
            data={images}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width: width, height: height * 0.6 }} // 60% dari tinggi layar

                resizeMode="cover"
              />
            )}
          />

          {/* Tombol back & aksi */}
          <View className="absolute top-12 left-4 flex-row justify-between w-[90%]">
            <TouchableOpacity className="bg-white p-2 rounded-full">
              <Ionicons name="arrow-back" size={20} color="black" />
            </TouchableOpacity>
            <View className="flex-row gap-3">
              <TouchableOpacity className="bg-white p-2 rounded-full">
                <Ionicons name="heart-outline" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-white p-2 rounded-full">
                <Ionicons name="share-social-outline" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Indicator dots */}
          <View className="absolute bottom-4 self-center flex-row gap-2">
            {images.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full ${
                  activeIndex === index ? "bg-blue-500 px-4" : "bg-gray-300"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Konten Detail */}
        <View className="bg-white p-4">
          <Text className="font-rubik-extrabold text-xl text-gray-900 mb-2">
            Modernica Apartment
          </Text>

          {/* Label + rating */}
          <View className="flex-row items-center mt-2 space-x-3">
            <View className="bg-primary-400 px-2 py-1 rounded-lg">
              <Text className="text-blue-600 text-xs font-rubik-bold">
                APARTMENT
              </Text>
            </View>
            <FontAwesome name="star" size={16} color="#facc15" className="ml-2 mr-1"/>
            <Text className="font-rubik text-sm text-gray-600">
              4.8 <Text className="text-gray-400 font-rubik-light">(1,275 reviews)</Text>
            </Text>
          </View>

          {/* Info detail */}
          <View className="flex-row justify-between mt-4">
            <View className="items-center flex-row gap-2">
              <Ionicons name="bed-outline" size={24} color="#0061FF" />
              <Text className="text-sm text-gray-800 font-rubik-medium mt-1">8 Beds</Text>
            </View>
            <View className="items-center flex-row gap-2">
              <Ionicons name="water-outline" size={24} color="#0061FF" />
              <Text className="text-sm text-gray-800 font-rubik-medium mt-1">3 Bath</Text>
            </View>
            <View className="items-center flex-row gap-2">
              <Ionicons name="expand-outline" size={24} color="#0061FF" />
              <Text className="text-sm text-gray-800 font-rubik-medium mt-1">2000 sqft</Text>
            </View>
          </View>

          <View className="h-[1px] bg-gray-200 my-8" />

          <Text className="mb-3 font-rubik-bold text-xl">Agent</Text>
          <View className="flex flex-row items-center justify-between mb-8">
            <View className="flex-row items-center gap-4">
              <Image source={require('@/assets/images/icon.png')}  className="size-16 rounded-full"/>
              <View className="flex flex-col">
                <Text className="font-rubik-semibold text-lg">Natasya Wilodra</Text>
                <Text className="font-rubik-light text-sm text-gray-700">Owner</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-4">
              <Ionicons name="chatbubble-ellipses-outline" size={28} color="#0061FF" />
              <SimpleLineIcons name="phone" size={28} color="#0061FF" />
            </View>
          </View>

          <Text className="mb-3 font-rubik-bold text-xl">Overview</Text>
          <Text className="font-rubik text-base text-gray-600 leading-relaxed mb-8">Sleek, modern 2-bedroom apartment with open living space, high-end finishes, and city views. minuts from downtown, dining, and transit</Text>

          <Text className="mb-3 font-rubik-bold text-xl">Facilities</Text>

          <View className="flex flex-row flex-wrap">

            <View className="flex flex-col items-center w-1/3 mb-5">
              <View className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50">
                <FontAwesome name="car" size={24} color="#0061FF" />
              </View>
              <Text className="mt-2 text-sm font-rubik-medium text-gray-800">Car Parking</Text>
            </View>

            <View className="flex flex-col items-center w-1/3 mb-5">
              <View className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50">
                <FontAwesome5 name="swimmer" size={24} color="#0061FF" />
              </View>
              <Text className="mt-2 text-sm font-rubik-medium text-gray-800">Swimming Pool</Text>
            </View>

            <View className="flex flex-col items-center w-1/3 mb-5">
              <View className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50">
                <FontAwesome6 name="dumbbell" size={24} color="#0061FF" />
              </View>
              <Text className="mt-2 text-sm font-rubik-medium text-gray-800">Gym & Fitness</Text>
            </View>

            <View className="flex flex-col items-center w-1/3 mb-5">
              <View className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50">
                <Ionicons name="restaurant" size={24} color="#0061FF" />
              </View>
              <Text className="mt-2 text-sm font-rubik-medium text-gray-800">Restaurant</Text>
            </View>

            <View className="flex flex-col items-center w-1/3 mb-5">
              <View className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50">
                <AntDesign name="wifi" size={24} color="#0061FF" />
              </View>
              <Text className="mt-2 text-sm font-rubik-medium text-gray-800">Wifi & Network</Text>
            </View>

            <View className="flex flex-col items-center w-1/3 mb-5">
              <View className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50">
                <MaterialIcons name="pets" size={24} color="#0061FF" />
              </View>
              <Text className="mt-2 text-sm font-rubik-medium text-gray-800">Pet Center</Text>
            </View>

          </View>

          {/* Judul */}
          <Text className="font-rubik-bold text-xl mt-5">Gallery</Text>

          {/* Grid gallery */}
          <View className="flex flex-row flex-wrap justify-between gap-3">
            {/* Gambar 1 */}
            <View className="w-[31%] mt-4">
              <Image
                source={{ uri: extraImages[0] }}
                className="w-full h-32 rounded-2xl"
              />
            </View>

            {/* Gambar 2 */}
            <View className="w-[31%] mt-4">
              <Image
                source={{ uri: extraImages[1] }}
                className="w-full h-32 rounded-2xl"
              />
            </View>

            {/* Gambar 3 + overlay */}
            <View className="w-[31%] relative mt-4">
              <Image
                source={{ uri: extraImages[2] }}
                className="w-full h-32 rounded-2xl"
              />
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-white text-xl font-rubik-bold">20+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Modal Gallery */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={false}
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 bg-black">
              {/* FlatList buat slider */}
              <FlatList
                data={extraImages}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={{ width, height, justifyContent: "center" }}>
                    <Image
                      source={{ uri: item }}
                      style={{ width, height, resizeMode: "contain" }}
                    />
                  </View>
                )}
              />

              {/* Tombol Close */}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="absolute top-12 right-6 bg-white px-4 py-2 rounded-full"
              >
                <Text className="text-black font-rubik-bold text-sm">Kembali</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Text className="mb-3 font-rubik-bold text-xl my-10">Location</Text>
          <Text className="font-rubik-Regular text-sm text-gray-600 mb-1">{address}</Text>

          <View style={{ width: "100%", height: 250, borderRadius: 12, overflow: "hidden" }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                ...coords,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              <Marker coordinate={coords} title="Lokasi" description={address || "Loading..."} />
            </MapView>
          </View>

          <View className="flex flex-row justify-between mt-10 items-center">
            <View className="flex flex-row">
              <FontAwesome name="star" size={23} color="#facc15" className="mr-3"/>
              <Text className="font-rubik-bold text-xl">
                4.8 <Text className="font-rubik-bold text-xl">(1,275 reviews)</Text>
              </Text>
            </View>
            <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
          </View>

          <View className="flex flex-row mt-5 mb-2 items-center">
            <Image source={require('@/assets/images/icon.png')} className="size-12 rounded-full mr-2"/>
            <Text className="font-rubik-semibold text-lg">
              Charlotte Hanlin
            </Text>
          </View>

          <Text className="font-rubik text-base text-gray-600 leading-relaxed">The apartment is very clean and modern. I really like the interior design. Looks like i'll feel  at home 😍</Text>
          <View className="flex flex-row justify-between items-center mt-4">
            <View className="flex flex-row items-center">
              <FontAwesome name="heart-o" size={24} color="blue" className="mr-2" />
              <Text className="text-base font-rubik-bold">938</Text>
            </View>
            <Text className="font-rubik-light text-base text-gray-600">6 days ago</Text>
          </View>
          
        </View>
        
      </ScrollView>
    </View>
  );
}