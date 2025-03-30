import { apiService } from "./apiService";
import io from "socket.io-client";
import { store } from "../features/store";
import { RootState } from "../features/store";

const API_BASE_URL = "http://localhost:5000"; // Replace with your NestJS backend URL if different

let socket: any = null;

export const initializeSocket = () => {
  if (socket) return socket; // If socket is already initialized, return it

  socket = io(`${API_BASE_URL}/video-call`);

  socket.on("connect", () => {
    const state = store.getState() as RootState;

    console.log("state", state);
    const userId = state.auth._id; // Assuming your user object has an 'id' property

    if (userId) {
      socket.emit("set-user-id", userId);
      console.log("WebSocket connected and User ID sent:", userId);
    } else {
      console.warn("WebSocket connected, but User ID is not available yet.");
    }
  });

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });

  socket.on("match-found", (data: { peerId: string }) => {
    console.log("Match found! Peer ID:", data.peerId);
    // TODO: Implement logic to initiate WebRTC call with data.peerId
  });

  socket.on("offer", (data: { sdp: string; callerId: string }) => {
    console.log("Received offer from:", data.callerId, "SDP:", data.sdp);
    // TODO: Implement logic to handle the received offer
  });

  socket.on("answer", (data: { sdp: string; replierId: string }) => {
    console.log("Received answer from:", data.replierId, "SDP:", data.sdp);
    // TODO: Implement logic to handle the received answer
  });

  socket.on("ice-candidate", (data: { candidate: any; senderId: string }) => {
    console.log(
      "Received ICE candidate from:",
      data.senderId,
      "Candidate:",
      data.candidate
    );
    // TODO: Implement logic to handle the received ICE candidate
  });

  socket.on("user-disconnected", () => {
    console.log("Peer user disconnected.");
    // TODO: Implement logic to handle peer disconnection during a call
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.error("WebSocket not initialized. Call initializeSocket first.");
  }
  return socket;
};

export interface User {
  id: string;
  name?: string;
  email?: string;
  level: string;
  status: "online" | "available_for_call" | "busy" | "offline";
}

class VideoCallService {
  /**
   * Set user status to available for call
   */
  async setUserAvailableForCall(userId: string): Promise<User> {
    return apiService.put<User>(`/users/${userId}/status`, {
      status: "available_for_call",
    });
  }

  /**
   * Set user status to busy (during a call)
   */
  async setUserBusy(userId: string): Promise<User> {
    return apiService.put<User>(`/users/${userId}/status`, {
      status: "busy",
    });
  }

  /**
   * Set user status to offline
   */
  async setUserOffline(userId: string): Promise<User> {
    return apiService.put<User>(`/users/${userId}/status`, {
      status: "offline",
    });
  }

  /**
   * Find an available match for a user
   */
  async findMatch(userId: string, level: string): Promise<User | null> {
    try {
      const response = await apiService.get<User>(
        `/users/match?userId=${userId}&level=${level}`
      );
      return response;
    } catch (error) {
      console.error("Error finding match:", error);
      return null;
    }
  }
}

export const videoCallService = new VideoCallService();
