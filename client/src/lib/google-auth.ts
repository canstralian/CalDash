export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export interface GoogleAuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export const initiateGoogleAuth = () => {
  window.location.href = "/auth/google";
};

export const handleAuthCallback = async (code: string) => {
  try {
    const response = await fetch("/auth/google/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error("Authentication failed");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Auth callback error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  } catch (error) {
    console.error("Logout error:", error);
    window.location.href = "/";
  }
};
