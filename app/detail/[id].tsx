import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { Client, Databases, Query, Storage } from "appwrite";
import React, { useEffect, useRef, useState } from "react";
import { WebView } from 'react-native-webview';

import { useLocalSearchParams } from "expo-router";
import {
    Dimensions,
    FlatList,
    Image,
    Linking,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function WisataDetails() {

  const { id } = useLocalSearchParams();

  // ===== STATE =====
  const [wisata, setWisata] = useState<any>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [visible, setVisible] = useState(true);

  const [address, setAddress] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const flatListRef = useRef(null);

  // ===== APPWRITE SETUP =====
  const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1") // endpoint lo
    .setProject("68ae7adb00009777fc5d"); // project ID lo

  // Perbaiki di sini 👇 harus pakai (client)
  const databases = new Databases(client); 
  const storage = new Storage(client);     

  const bucketId = "68d3fafa0036c748dbbb"; // bucketId Storage lo


  // ===== FETCH GALLERY =====
  useEffect(() => {

    if (!id) return;

    const getDataById = async () => {
      try {
        // ambil data wisata
        const wisataDoc = await databases.getDocument(
          "68d38e0f003984aa0bd0", // databaseId Oboto
          "68d3915200260276b4f8", // collectionId Wisata
          id.toString()
        );
        setWisata(wisataDoc);

        // ambil gallery terkait wisataId
        const galleryDocs = await databases.listDocuments(
          "68d38e0f003984aa0bd0", // databaseId Oboto
          "68d3fc3f000dae3f4706",  // collectionId Gallery
          [Query.equal("wisataId", wisataDoc.$id)]
        );

        // bikin url preview untuk tiap file
        const mapped = galleryDocs.documents.map((doc) => {
          const url = storage.getFileView(bucketId, doc.fileId).toString();
          return {
            fileId: doc.fileId,
            url,
          };
        });

        console.log("Gallery mapped:", mapped);


        setGallery(mapped);
      } catch (error) {
        console.error("Error fetching wisata/gallery:", error);
      }
    };

    getDataById();
  }, []);

  // ===== FETCH REVERSE BigDataCloud ADDRESS =====
  useEffect(() => {
    if (!wisata) return;

    const fetchAddress = async () => {
      try {
        const [lat, lng] = wisata.lokasi.split(",").map(Number);

        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`;
        const response = await fetch(url);
        const data = await response.json();

        if (data) {
          const provinsi = data.localityInfo?.administrative?.[2]?.name || data.principalSubdivision || "-";
          const kabupaten = data.localityInfo?.administrative?.[3]?.name || "-";
          const kecamatanDesa = data.locality || data.city || "-";

          // gabung jadi satu baris string
          const formatted = `Kecamatan/Desa: ${kecamatanDesa} | Kabupaten: ${kabupaten} | Provinsi: ${provinsi}`;
          setAddress(formatted);
        } else {
          setAddress("Tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Gagal mengambil alamat");
      }
    };

    fetchAddress();
  }, [wisata]);



  // ====== STATE BARU ======
  const [thumbnail, setThumbnail] = useState<string[]>([]);

  useEffect(() => {
    const ambilThumbnail = async () => {
      try {
        // ambil dokumen gallery dengan status "thumbnail"
        const thumbDocs = await databases.listDocuments(
          "68d38e0f003984aa0bd0", // databaseId
          "68d3fc3f000dae3f4706", // collectionId Gallery
          [
            Query.equal("wisataId", id.toString()), // filter wisataId UBAH
            Query.equal("status", "thumbnail"),     // filter status
          ]
        );

        // mapping → ambil URL dari storage
        const mapped = thumbDocs.documents.map((doc) =>
          storage.getFileView("68d3fafa0036c748dbbb", doc.fileId).toString()
        );

        // simpan ke state thumbnail
        setThumbnail(mapped);
      } catch (error) {
        console.error("Gagal ambil thumbnail:", error);
      }
    };

    ambilThumbnail();
  }, []);


  // ===== HANDLE SLIDER =====
  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex); 
  };

  // ===== RENDER =====
  if (!wisata) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white", // bisa custom warna
        }}
      >

        {/* Atau pakai gambar custom */}
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={{ width: 250, height: 250, resizeMode: "contain" }}
        />
        <Text style={{ marginTop: 16, fontSize: 16, fontWeight: "600", color: "#333" }} className="font-rubik-semibold">
          Memuat data wisata...
        </Text>
      </View>
    );
  }

    // === parsing lokasi ke latitude & longitude ===
  const [lat, lng] = wisata.lokasi.split(",").map(Number);

  const coords = {
    latitude: lat,
    longitude: lng,
  };

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 20, backgroundColor: "white" }}>
        {/* Slider */}
        <View className="relative">
        <FlatList
          ref={flatListRef}
          data={thumbnail} // 🔥 ganti ke thumbnail
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }} // item sudah berupa URL
              style={{ width: width, height: height * 0.6 }} // 60% tinggi layar
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
          {thumbnail.length > 1 && (
          <View className="absolute bottom-4 self-center flex-row gap-2">
            {thumbnail.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full ${
                  activeIndex === index ? "bg-blue-500 px-4" : "bg-gray-300"
                }`}
              />
            ))}
          </View>
          )}

        </View>

        {/* Konten Detail */}
        <View className="bg-white p-4">
          <Text className="font-rubik-extrabold text-xl text-gray-900 mb-2">
            {wisata.nama}
          </Text>

          {/* Label + rating */}
          <View className="flex-row items-center mt-2 space-x-3">
            <View className="bg-primary-400 px-2 py-1 rounded-lg">
              <Text className="text-blue-600 text-xs font-rubik-bold">
                {wisata.kategori}
              </Text>
            </View>
            <FontAwesome name="star" size={16} color="#facc15" className="ml-2 mr-1"/>
            <Text className="font-rubik text-sm text-gray-600">
              4.8 <Text className="text-gray-400 font-rubik-light">(1,275 reviews)</Text>
            </Text>
          </View>

          {/* Info detail */}
          <View className="flex-row flex-wrap mt-4 justify-between">
            {/* Jam Operasional */}
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="access-time" size={28} color="#0061FF" />
              <View className="flex flex-col">
                <Text className="text-sm text-gray-700 font-rubik-medium">Jam Operasional</Text>
                <Text className="text-base text-gray-900 font-rubik-regular">08:00 - 13:00</Text>
              </View>
            </View>

            {/* HTM */}
            <View className="flex-row items-center gap-2">
              <Ionicons name="ticket-sharp" size={28} color="#0061FF" />
              <View className="flex flex-col">
                <Text className="text-sm text-gray-700 font-rubik-medium">Harga Tiket Masuk</Text>
                <Text className="text-base text-gray-900 font-rubik-regular">Rp10.000</Text>
              </View>
            </View>
          </View>


          <View className="h-[1px] bg-gray-200 my-8" />

          {/* Info Cuaca */}
          {visible && (
            <View className="bg-blue-50 rounded-xl p-4 mb-4 shadow-md relative">
              {/* Tombol close */}
              <TouchableOpacity 
                className="absolute top-2 right-2"  
                onPress={() => setVisible(false)}
              >
                <Ionicons name="close-circle" size={22} color="#555" />
              </TouchableOpacity>

              {/* Judul */}
              <Text className="text-lg font-rubik-bold text-blue-700 mb-1">
                Info Cuaca
              </Text>

              {/* Cuaca Sekarang */}
              <Text className="text-base font-rubik-semibold text-gray-900">
                Cuaca saat ini: <Text className="text-blue-600 font-rubik-semibold">Cerah</Text>
              </Text>

              {/* Tips */}
              <Text className="text-sm font-rubik-regular text-gray-700 mt-2 leading-relaxed">
                Nikmati hari yang indah! 🌤️ Jangan lupa pakai sunscreen dan bawa topi.
              </Text>
            </View>
          )}

          <Text className="mb-3 font-rubik-bold text-xl">Pengelola</Text>
          <View className="flex flex-row items-center justify-between mb-8">
            <View className="flex-row items-center gap-4">
              <Image source={require('@/assets/images/avatar.png')}  className="size-16 rounded-full"/>
              <View className="flex flex-col">
                <Text className="font-rubik-semibold text-lg">Andre</Text>
                <Text className="font-rubik-light text-sm text-gray-700">Pedagang</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-4">
              <Ionicons name="chatbubble-ellipses-outline" size={28} color="#0061FF" />
              <SimpleLineIcons name="phone" size={28} color="#0061FF" />
            </View>
          </View>

          <Text className="font-rubik text-base text-gray-600 leading-relaxed mb-8">{wisata.deskripsi}</Text>

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
          <View className="flex flex-row flex-wrap justify-between gap-3 mt-4">
            {gallery.length > 0 ? (
              gallery.slice(0, 3).map((item, index) => {
                // cek apakah ini gambar terakhir yang muncul dan ada lebih dari 3 gambar
                const isLastVisible = index === 2 && gallery.length > 3;
                return (
                  <View key={index} className="w-[31%] relative">
                    <Image
                      source={{ uri: item.url }}
                      className="w-full h-32 rounded-2xl"
                    />
                    {isLastVisible && (
                      <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center"
                        activeOpacity={0.7}
                      >
                        <Text className="text-white text-xl font-rubik-bold">
                          +{gallery.length - 3}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            ) : (
              <Text className="text-gray-500">Belum ada gambar</Text>
            )}
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
                data={gallery}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={{ width, height, justifyContent: "center" }}>
                    <Image
                      source={{ uri: item.url }}
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


          <Text className="mb-3 font-rubik-bold text-xl my-10">Lokasi</Text>
          <Text className="font-rubik-Regular text-sm text-gray-600 mb-1">{address}</Text>

          <View style={{ width: "100%", height: 250, borderRadius: 12, overflow: "hidden" }}>
            <WebView
              originWhitelist={['*']}
              style={{ flex: 1 }}
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                    <style>
                      html, body { margin:0; padding:0; height:100%; }
                      #map { width: 100%; height: 100%; }
                      .leaflet-control-attribution {
                        pointer-events: none;
                      }
                    </style>
                  </head>
                  <body>
                    <div id="map"></div>
                    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                    <script>
                      const map = L.map('map')
                      .setView([${coords.latitude}, ${coords.longitude}], 14);
                      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      }).addTo(map);
                      L.marker([${coords.latitude}, ${coords.longitude}]).addTo(map)
                        .bindPopup("${wisata.nama}")
                        .openPopup();
                    </script>
                  </body>
                  </html>
                `
              }}
            />

            {/* Tombol floating kayak MapView */}
            <TouchableOpacity
              onPress={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;
                Linking.openURL(url);
              }}
              style={{
                position: "absolute",
                bottom: 22,
                right: 16,
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 5,
              }}
            >
              <Ionicons name="navigate-outline" size={24} color="#0061FF" />
            </TouchableOpacity>
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
            <Image source={require('@/assets/images/avatar.png')} className="size-12 rounded-full mr-2"/>
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