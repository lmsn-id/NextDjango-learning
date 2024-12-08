"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { api } from "./api";

export const useLoginSuperAdmin = () => {
  const [FormData, setFormData] = useState({
    username: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...FormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!FormData.username || !FormData.password) {
      toast.error("Tolong Masukkan Username dan Password");
      return;
    }

    try {
      const response = await signIn("credentials", {
        username: FormData.username,
        password: FormData.password,
        redirect: false,
      });

      if (response && response.error) {
        toast.error(response.error || "Gagal login");
        return;
      }

      const res = await fetch("/api/auth/session");
      if (!res.ok) {
        toast.error("Gagal mendapatkan sesi autentikasi");
        return;
      }
      const session = await res.json();
      console.log("Session Data:", session);

      if (session?.user?.is_superuser) {
        toast.success("Login berhasil sebagai superuser!", {
          autoClose: 3000,
          onClose: () => router.push("/admin"),
        });
      } else {
        toast.error("Anda bukan superuser!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Terjadi kesalahan saat login");
    }
  };

  return { handleChange, handleSubmit, FormData };
};

export const useLoginSiswa = () => {
  const navigate = useRouter();
  const [FormData, setFormData] = useState({
    Nis: "",
    Password: "",
    remember: false,
  });

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({
      ...FormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(FormData);

    if (!FormData.Nis || !FormData.Password) {
      toast.error("Tolong Masukkan NIS dan Password");
      return;
    }

    const { ApiBackend } = api();
    const urlLogin = ApiBackend("api/auth/login/siswa");

    fetch(urlLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(FormData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            throw new Error(errData.message || "Login Gagal");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.access_token_siswa) {
          const currentDate = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Jakarta",
          });
          localStorage.setItem("access_token_siswa", data.access_token_siswa);
          localStorage.setItem("login_date", currentDate);
          localStorage.setItem("nis", data.nis);

          toast.success("Login Berhasil", {
            onClose: () => {
              navigate.push(data.redirect);
              window.location.reload();
            },
          });
        } else {
          toast.error(data.message || "Login Gagal");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error.message || "Login Gagal");
      });
  };

  return {
    handleChange,
    handleSubmit,
    FormData,
  };
};
