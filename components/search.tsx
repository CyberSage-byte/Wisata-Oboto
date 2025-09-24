import EvilIcons from '@expo/vector-icons/EvilIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';


const Search = () => {

  return (
    <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-gray-300 mt-5 py-2">
      <View className='flex-1 flex-row items-center justify-start z-50'>
        <EvilIcons name="search" size={20} color="black" />        
        <TextInput 
        placeholder='Cari Wisata'
        className='text-sm font-rubik text-black-300 ml-2 mt-1 flex-1'
        /> 
      </View>

      <TouchableOpacity>
        <Ionicons name="filter" size={20} color="black" />
      </TouchableOpacity>
    </View>
  )
}

export default Search