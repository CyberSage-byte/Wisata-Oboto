import { Account, Client, Databases, Query, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("68ae7adb00009777fc5d"); // project ID

// ✅ Inisialisasi service Appwrite
export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export { Query };

// 💾 Kumpulan ID biar gak diketik terus
export const APPWRITE_IDS = {
  database: "68d38e0f003984aa0bd0", // id database utama lo
  collections: {
    wisata: "68d3915200260276b4f8", // id collection wisata
    gallery: "68d3fc3f000dae3f4706", // id collection gallery

  },
  bucket: "68d3fafa0036c748dbbb", // id bucket buat file/image
};
