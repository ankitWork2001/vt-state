"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function ProtectedRoute({ children, checkRoute }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !localUser.userid) {
        return clearSession("Please login to continue.");
      }

      try {
        const { data } = await axiosInstance.get("/auth/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const serverUser = data.user;

        // Match user ID
        if (localUser.userid !== serverUser.userId) {
          return clearSession("Session mismatch, please login again.");
        }

        // Role check (only if not "both")
        if (checkRoute === "admin" && !serverUser.isAdmin) {
          return clearSession("Admin access only. Please login again.");
        }

        if (checkRoute === "user" && serverUser.isAdmin) {
          return clearSession("User access only. Please login again.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Token validation failed:", err.message);
        clearSession("Session expired. Please login again.");
      }
    };

    const clearSession = (message) => {
      toast.error(message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Dynamic redirect based on checkRoute
      if (checkRoute === "admin") {
        router.push("/admin/login");
      } else {
        router.push("/auth/login");
      }
    };

    verifyToken();
  }, [router, checkRoute]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#35590E] mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return children;
}
