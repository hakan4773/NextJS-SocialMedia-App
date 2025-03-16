export const getUserDetails = async () => {
  try {
    const token = localStorage.getItem("token"); 
    // if (!token) {
    //   throw new Error("Token bulunamadı");
    // }

    const response = await fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
const data=response.json();
    return data; 
  } catch (error) {
    console.error("Kullanıcı bilgileri alınırken hata oluştu:", error);
    throw error;
  }
};
