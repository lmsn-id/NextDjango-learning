// import { NextApiRequest, NextApiResponse } from "next";
// import axios from "axios";
// import { api } from "@/hook/api";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { refreshToken } = req.body;

//   if (!refreshToken) {
//     return res.status(400).json({ message: "Refresh token is required" });
//   }

//   const BASE_URL = api();

//   try {
//     // Kirim permintaan untuk refresh token ke Django backend
//     const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
//       refresh: refreshToken,
//     });

//     // Kirimkan data yang diperoleh dari server sebagai respon
//     res.status(200).json(response.data);
//   } catch (error) {
//     // Memastikan tipe 'error' sebelum digunakan
//     if (axios.isAxiosError(error)) {
//       console.error(
//         "Error refreshing token:",
//         error.response?.data || error.message
//       );
//       res
//         .status(error.response?.status || 500)
//         .json({ message: error.response?.data || "Failed to refresh token" });
//     } else {
//       console.error("Unexpected error:", error);
//       res.status(500).json({ message: "An unexpected error occurred" });
//     }
//   }
// }
