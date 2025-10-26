import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

export default function BookingsScreen() {
  return (
    <View className="flex-1">
      {/* Background Circle */}
      <View
        className="absolute bg-[#007bff] rounded-full"
        style={{
          width: width * 2,
          height: width * 1.8,
          borderRadius: width * 0.9,
          bottom: -width * 0.7,
          right: -width * 0.9,
        }}
      />

      <ScrollView className="flex-grow pb-[60px] bg-transparent">
        {/* Header Section */}
        <View className="items-center px-6 pt-[60px]">
          <View className="flex-row items-center justify-center relative mb-4">
            <Ionicons name="location" size={40} color="#007bff" />
            <Ionicons
              name="home"
              size={32}
              color="#007bff"
              className="absolute -right-1 -bottom-1"
            />
          </View>

          <Text className="text-[22px] text-black font-rubik-bold">
            Tambahkan Wisata Baru
          </Text>

          <Text className="text-center text-[#666] mt-1.5 text-[13px] leading-[18px] font-rubik-light">
            Isi data di bawah untuk menambahkan tempat wisata baru ke daftar kamu.
          </Text>
        </View>

        {/* Form Card */}
        <View className="bg-white mx-5 mt-8 rounded-2xl p-5 shadow-lg">
          <Text className="font-rubik-bold text-base mb-4 text-black">
            Contact Address
          </Text>

          <View className="flex-row items-center border border-[#ddd] rounded-xl px-2.5 mb-3 bg-[#fafafa]">
            <Ionicons name="call-outline" size={18} color="#999" className="mr-1.5" />
            <TextInput
              placeholder="Phone Number"
              className="flex-1 py-2.5 font-rubik-medium text-[14px]"
              keyboardType="phone-pad"
            />
          </View>

          <View className="flex-row items-center border border-[#ddd] rounded-xl px-2.5 mb-3 bg-[#fafafa]">
            <Ionicons name="earth-outline" size={18} color="#999" className="mr-1.5" />
            <TextInput
              placeholder="Country"
              className="flex-1 py-2.5 font-rubik-medium text-[14px]"
            />
          </View>

          <View className="flex-row">
            <View className="flex-1 mr-2.5 flex-row items-center border border-[#ddd] rounded-xl px-2.5 mb-3 bg-[#fafafa]">
              <Ionicons name="location-outline" size={18} color="#999" className="mr-1.5" />
              <TextInput
                placeholder="City"
                className="flex-1 py-2.5 font-rubik-medium text-[14px]"
              />
            </View>

            <View className="flex-1 flex-row items-center border border-[#ddd] rounded-xl px-2.5 mb-3 bg-[#fafafa]">
              <TextInput
                placeholder="Postal Code"
                className="flex-1 py-2.5 font-rubik-medium text-[14px]"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View className="border border-[#ddd] rounded-xl bg-[#fafafa] mb-5 px-2.5">
            <TextInput
              placeholder="Street Address"
              className="py-2.5 font-rubik-medium text-[14px]"
              style={{ textAlignVertical: "top" }}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity className="bg-[#007bff] rounded-xl py-3.5 items-center">
            <Text className="text-white text-[15px] font-rubik-semibold">
              Save & Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
