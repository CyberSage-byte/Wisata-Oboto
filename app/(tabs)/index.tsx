import { Card } from '@/components/card';
import { TourCard } from '@/components/cards';
import Filters from '@/components/filters';
import Search from '@/components/search';
import { APPWRITE_IDS, databases, Query, storage } from "@/lib/appwrite";
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, ImageBackground, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomeScreen() {

  interface WisataItem {
    id: string;
    name: string;
    location: string;
    price: string;
    image: string | null;
  }

  const [time, setTime] = useState<string>("");
  const [wisataList, setWisataList] = useState<WisataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // 🔍 Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery); // 💥 Tambahan

  const handlePress = (id: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push(`/detail/${id}`);
    setTimeout(() => setIsNavigating(false), 1000);
  };

  // 🕒 Update waktu real-time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(formatted);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🕊️ Sapaan waktu
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return "Selamat Pagi";
    if (hour >= 11 && hour < 15) return "Selamat Siang";
    if (hour >= 15 && hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  }

  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Fetch data wisata dari Appwrite
  useEffect(() => {
    fetchWisataList();
  }, []);

  const fetchWisataList = async () => {
    setLoading(true);
    try {
      const wisataDocs = await databases.listDocuments(
        APPWRITE_IDS.database,
        APPWRITE_IDS.collections.wisata
      );

      const wisataWithImages = await Promise.all(
        wisataDocs.documents.map(async (w) => {
          try {
            const thumbDocs = await databases.listDocuments(
              APPWRITE_IDS.database,
              APPWRITE_IDS.collections.gallery,
              [
                Query.equal("wisataId", w.$id),
                Query.equal("status", "thumbnail"),
              ]
            );

            let imageUrl = null;
            if (thumbDocs.documents.length > 0) {
              const fileId = thumbDocs.documents[0].fileId;
              imageUrl = storage
                .getFileView(APPWRITE_IDS.bucket, fileId)
                .toString();
            }

            return {
              id: w.$id,
              name: w.nama,
              location: w.alamat
                ?.replace("Kecamatan", "Kec.")
                .replace("Kabupaten", "Kab.")
                .replace(/,?\s*Kalimantan Selatan/gi, "")
                .replace("Kota", "Kota")
                .trim(),
              price: w.harga ?? "",
              image: imageUrl,
            };
          } catch (err) {
            console.error("Error fetch thumbnail atau lokasi:", err);
            return null;
          }
        })
      );

      setWisataList(
        wisataWithImages.filter(
          (item): item is WisataItem => Boolean(item)
        )
      );
      setError(null);
      } catch (err) {
        console.error("Error fetch wisata:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
      setLoading(false);
    }
  };

  const [isScrolled, setIsScrolled] = useState(false); // 🔥 Buat deteksi scroll

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // kalau scroll lebih dari 250px (tinggi hero kira-kira segitu)
    setIsScrolled(offsetY > 250);
  };

  // 🕒 Debounce: tunggu 500ms sebelum update debouncedSearch
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // delay 0.5 detik

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 🔍 Filter wisata berdasarkan debouncedSearch
  const filteredWisataList = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return wisataList;
    }

    const query = debouncedSearch.toLowerCase();
    return wisataList.filter((wisata) =>
      wisata.name.toLowerCase().includes(query)
    );
  }, [wisataList, debouncedSearch]);

  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Kondisi loading/error
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={{ width: 250, height: 250, resizeMode: "contain" }}
        />
        <Text style={{ marginTop: 0, fontSize: 16, fontWeight: "600", color: "#333" }} className="font-rubik-semibold">
          Memuat data wisata{dots}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <View className="items-center">
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/463/463612.png" }}
            style={{ width: 90, height: 90, marginBottom: 20, opacity: 0.8 }}
            resizeMode="contain"
          />
          <Text className="text-gray-800 text-lg font-rubik-semibold mb-2">
            Gagal memuat data wisata 😢
          </Text>
          <Text className="text-gray-500 text-center leading-5 mb-6 font-rubik-medium">
            Pastikan koneksi internet kamu stabil, lalu coba lagi.
          </Text>
          <TouchableOpacity
            onPress={fetchWisataList}
            className="bg-red-500 px-6 py-3 rounded-2xl"
          >
            <Text className="text-white font-rubik-semibold">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* ✅ Status bar berubah tergantung posisi scroll */}
      <StatusBar
        translucent
        backgroundColor={isScrolled ? "rgba(255,255,255,0.95)" : "transparent"}
        barStyle={isScrolled ? "dark-content" : "dark-content"}
      />

      <FlatList
        onScroll={handleScroll}
        scrollEventThrottle={16} // biar event scroll lebih smooth
        data={filteredWisataList}
        renderItem={({ item }) => (
          <Card
            name={item.name}
            location={item.location}
            price={item.price}
            image={item.image ?? require('@/assets/images/no-image.png')}
            onPress={() => handlePress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          searchQuery ? (
            <View className="items-center justify-center py-10">
              <Text className="text-gray-500 text-base font-rubik-medium">
                Tidak ada wisata dengan nama "{debouncedSearch}"
              </Text>
              <Text className="text-gray-400 text-sm font-rubik mt-2">
                Coba kata kunci lain
              </Text>
            </View>
          ) : null
        }
        ListHeaderComponent={
          <ImageBackground
            source={require('@/assets/images/background.png')}
            resizeMode="cover"
            className="w-full pt-14 pb-6"
          >
            <View className="px-5">
              <View className="mt-2">
                <View className="flex flex-row items-center justify-between mb-5">
                  <View className="flex flex-row items-center">
                    <Image
                      source={require('@/assets/images/avatar.png')}
                      className="size-12 rounded-full"
                    />
                    <View className="flex flex-col items-start ml-2 justify-center">
                      <Text className="text-xs font-rubik text-[#37474F]">{greeting}</Text>
                      <Text className="text-sm font-rubik-medium text-black-300">Andre</Text>
                    </View>
                  </View>
                  <View className="p-2 rounded-full">
                    <Feather name="bell" size={24} color="black" />
                  </View>
                </View>

                <View className="relative my-2">
                  <View className="flex-1 z-1">
                    <Text className="text-xl font-rubik-bold text-black">
                      Waktunya
                    </Text>
                    <Text className="text-[22px] font-rubik-bold text-black">
                      Liburan !!
                    </Text>
                  </View>

                  <View className="absolute -top-20 right-3 items-center z-0">
                    <Image
                      source={require('@/assets/images/travel-car.png')}
                      style={{ width: 200, height: 200 }}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>

              <Search onSearch={setSearchQuery} searchQuery={searchQuery} />

              <View className="flex flex-row items-center justify-between mt-4">
                <Text className="text-xl font-rubik-bold text-black-300">Wisata Populer</Text>
              </View>

              <FlatList
                data={wisataList}
                renderItem={({ item }) => (
                  <TourCard
                    name={item.name}
                    location={item.location}
                    price={item.price}
                    image={item.image ?? require('@/assets/images/no-image.png')}
                    onPress={() => handlePress(item.id)}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex gap-5 mt-5"
              />

              <Filters />
              <Text className="text-xl font-rubik-bold text-black-300 mt-4">
                {debouncedSearch ? `Hasil Pencarian "${debouncedSearch}"` : 'Wisata Lainnya'}
              </Text>
            </View>
          </ImageBackground>
        }
      />
    </View>
  );
}
