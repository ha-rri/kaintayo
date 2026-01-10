import { Alert } from "react-native";

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (
  imageUri: string
): Promise<string | null> => {
  if (!imageUri) return null;

  // If it's already a remote URL (e.g. initial value), return it as is
  if (imageUri.startsWith("http")) return imageUri;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error("Missing Cloudinary Configuration");
    Alert.alert(
      "Configuration Error",
      "Cloudinary environment variables missing."
    );
    return null;
  }

  try {
    const formData = new FormData();

    // Extract filename from URI
    const filename = imageUri.split("/").pop() || "upload.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    // @ts-ignore: React Native FormData expects specific object structure
    formData.append("file", {
      uri: imageUri,
      name: filename,
      type,
    });

    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error("Cloudinary Upload Failed:", data);
      return null;
    }
  } catch (error) {
    console.error("Upload Error:", error);
    return null;
  }
};
