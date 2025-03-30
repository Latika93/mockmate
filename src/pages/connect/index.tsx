import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";
import { getSocket } from "../../services/videoCallService";
import axios from "axios";

interface RTCPeerConnectionNew extends RTCPeerConnection {
  signalingState:
    | "closed"
    | "have-local-offer"
    | "have-local-pranswer"
    | "have-remote-offer"
    | "have-remote-pranswer"
    | "stable";
}

const API_BASE_URL = "http://localhost:5000";

const ConnectPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isAvailable, setIsAvailable] = useState(false);
  const socket = getSocket();
  const [peerId, setPeerId] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnectionNew | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Add a debug function
  const addDebugInfo = (info: string) => {
    console.log(info);
    setDebugInfo((prev) =>
      [...prev, `${new Date().toISOString().substr(11, 8)}: ${info}`].slice(-10)
    );
  };

  // Initialize WebRTC with ICE servers
  const createPeerConnection = () => {
    addDebugInfo("Creating peer connection");

    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate && peerId) {
        addDebugInfo(
          `ICE candidate found: ${event.candidate.candidate.slice(0, 30)}...`
        );
        // Important: Make sure we're sending the full candidate object, not just a part
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          peerId: peerId,
          senderId: user?._id, // Add sender ID for verification
        });
      } else if (!event.candidate) {
        addDebugInfo("ICE gathering complete");
      }
    };

    pc.oniceconnectionstatechange = () => {
      addDebugInfo(`ICE connection state: ${pc.iceConnectionState}`);

      if (
        pc.iceConnectionState === "connected" ||
        pc.iceConnectionState === "completed"
      ) {
        setCallStatus("Call connected successfully");
      } else if (
        pc.iceConnectionState === "disconnected" ||
        pc.iceConnectionState === "failed" ||
        pc.iceConnectionState === "closed"
      ) {
        setCallStatus("Connection lost. Try reconnecting.");
      }
    };

    pc.ontrack = (event) => {
      addDebugInfo("Received remote track");
      if (remoteVideoRef.current && event.streams && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setCallStatus("Call connected");
      }
    };

    pc.onsignalingstatechange = () => {
      addDebugInfo(`Signaling state: ${pc.signalingState}`);
    };

    pc.onconnectionstatechange = () => {
      addDebugInfo(`Connection state: ${pc.connectionState}`);
    };

    return pc;
  };

  // Get local media stream
  const setupLocalMedia = async () => {
    addDebugInfo("Setting up local media");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      addDebugInfo("Local media acquired successfully");

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      addDebugInfo(`Media error: ${error}`);
      setCallStatus("Failed to access camera/microphone");
      return null;
    }
  };

  // Handle match found event
  const handleMatchFound = async (data: { peerId: string }) => {
    addDebugInfo(`Match found with peer: ${data.peerId}`);
    setPeerId(data.peerId);
    setIsAvailable(false);
    setCallStatus("Match found! Setting up call...");

    try {
      // Get local media if not already available
      if (!localStreamRef.current) {
        const stream = await setupLocalMedia();
        if (!stream) return;
      }

      // Create peer connection
      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      // Add local tracks to the peer connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          if (localStreamRef.current) {
            addDebugInfo(`Adding local ${track.kind} track to peer connection`);
            pc.addTrack(track, localStreamRef.current);
          }
        });
      }

      // For simplicity, determine if this client should initiate the call
      // In a real app, you might want the server to decide
      const shouldInitiateCall = user?._id && user?._id < data.peerId;

      if (shouldInitiateCall) {
        setCallStatus("Initiating call...");
        addDebugInfo("Creating offer as initiator");
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });

        addDebugInfo(`Offer created: ${offer.sdp?.substring(0, 30)}...`);
        await pc.setLocalDescription(offer);
        addDebugInfo("Local description set (offer)");

        // Wait a moment to ensure ICE gathering has started
        setTimeout(() => {
          // Important: Send the full offer object, not just the SDP
          socket.emit("offer", {
            sdp: pc.localDescription?.sdp || offer.sdp,
            peerId: data.peerId,
            callerId: user?._id, // Add caller ID for verification
          });
          addDebugInfo(`Offer sent to peer: ${data.peerId}`);
        }, 1000);
      } else {
        setCallStatus("Waiting for incoming call...");
        addDebugInfo("Waiting for offer from peer");
      }
    } catch (error) {
      addDebugInfo(`WebRTC setup error: ${error}`);
      setCallStatus("Failed to set up call");
    }
  };

  // Handle incoming offer
  // const handleIncomingOffer = async (data: { sdp: string; callerId: string }) => {
  //   addDebugInfo(`Received offer from: ${data.callerId}`);
  //   setPeerId(data.callerId);
  //   setCallStatus('Received call offer. Answering...');

  //   try {
  //     console.log("localStreamRef : ", localStreamRef);
  //     console.log("peerConnectionRef : ", peerConnectionRef);

  //     // Get local media if not already available
  //     if (!localStreamRef.current) {
  //       const stream = await setupLocalMedia();
  //       if (!stream) return;
  //     }

  //     // Create peer connection if not exists
  //     if (!peerConnectionRef.current) {
  //       const pc = createPeerConnection();
  //       peerConnectionRef.current = pc;

  //       // Add local tracks
  //       if (localStreamRef.current) {
  //         localStreamRef.current.getTracks().forEach(track => {
  //           if (localStreamRef.current) {
  //             addDebugInfo(`Adding local ${track.kind} track to peer connection`);
  //             pc.addTrack(track, localStreamRef.current);
  //           }
  //         });
  //       }else{
  //         addDebugInfo("localStreamRef : " + localStreamRef.current)
  //       }
  //     }

  //     const pc = peerConnectionRef.current;

  //     // Set remote description (the offer)
  //     const offer = new RTCSessionDescription({
  //       type: 'offer',
  //       sdp: data.sdp
  //     });

  //     await pc.setRemoteDescription(offer);
  //     addDebugInfo('Remote description set (offer)');

  //     // Create and set local description (the answer)
  //     const answer = await pc.createAnswer();
  //     addDebugInfo(`Answer created: ${answer.sdp?.substring(0, 30)}...`);

  //     await pc.setLocalDescription(answer);
  //     addDebugInfo('Local description set (answer)');

  //     // Wait a moment to ensure ICE gathering has started
  //     setTimeout(() => {
  //       // Send answer to caller
  //       socket.emit('answer', {
  //         sdp: pc.localDescription?.sdp || answer.sdp,
  //         peerId: data.callerId,
  //         replierId: user?._id  // Add replier ID for verification
  //       });
  //       addDebugInfo(`Answer sent to: ${data.callerId}`);
  //     }, 1000);

  //     setCallStatus('Call answering...');
  //   } catch (error) {
  //     addDebugInfo(`Error handling offer: ${error}`);
  //     setCallStatus('Failed to answer call');
  //   }
  // };

  const handleIncomingOffer = async (data: {
    sdp: string;
    callerId: string;
  }) => {
    addDebugInfo(`Received offer from: ${data.callerId}`);
    setPeerId(data.callerId);
    setCallStatus("Received call offer. Answering...");

    try {
      // First check if we already have an active peer connection and clean it up if necessary
      if (peerConnectionRef.current) {
        // Check if the connection is closed
        if (peerConnectionRef.current.signalingState === "closed") {
          addDebugInfo("Peer connection was closed, creating a new one");
          peerConnectionRef.current = null;
        }
      }

      // Get local media if not already available
      if (!localStreamRef.current) {
        const stream = await setupLocalMedia();
        if (!stream) {
          addDebugInfo("Failed to get local media stream");
          return;
        }
      }

      // Create a fresh peer connection
      if (!peerConnectionRef.current) {
        const pc = createPeerConnection();
        peerConnectionRef.current = pc;

        // Add local tracks
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => {
            if (localStreamRef.current) {
              addDebugInfo(
                `Adding local ${track.kind} track to peer connection`
              );
              pc.addTrack(track, localStreamRef.current);
            }
          });
        } else {
          addDebugInfo("Local stream not available");
          return;
        }
      }

      const pc = peerConnectionRef.current;

      // Double-check PC state before trying to set remote description
      if (pc.signalingState === "closed") {
        addDebugInfo(
          "Peer connection is closed, cannot set remote description"
        );
        return;
      }

      // Set remote description (the offer)
      const offer = new RTCSessionDescription({
        type: "offer",
        sdp: data.sdp,
      });

      await pc.setRemoteDescription(offer);
      addDebugInfo("Remote description set (offer)");

      // Create and set local description (the answer)
      const answer = await pc.createAnswer();
      addDebugInfo(`Answer created: ${answer.sdp?.substring(0, 30)}...`);
      // Check if the connection is still valid before creating the answer
      if (
        pc.signalingState === "have-local-offer" ||
        pc.signalingState === "have-remote-offer"
      ) {
        addDebugInfo("Connection is valid, proceeding to create answer");
      } else {
        addDebugInfo("Peer connection is not valid for creating answer");
        return;
      }

      await pc.setLocalDescription(answer);
      addDebugInfo("Local description set (answer)");

      // Wait a moment to ensure ICE gathering has started
      setTimeout(() => {
        // Make sure connection is still active before sending answer
        if (pc.signalingState === "closed") {
          addDebugInfo("Connection closed before sending answer");
          return;
        }

        // Send answer to caller
        socket.emit("answer", {
          sdp: pc.localDescription?.sdp || answer.sdp,
          peerId: data.callerId,
          replierId: user?._id, // Add replier ID for verification
        });
        addDebugInfo(`Answer sent to: ${data.callerId}`);
      }, 1000);

      setCallStatus("Call answering...");
    } catch (error) {
      addDebugInfo(`Error handling offer: ${error}`);
      setCallStatus("Failed to answer call");
    }
  };

  // Handle incoming answer
  const handleIncomingAnswer = async (data: {
    sdp: string;
    replierId: string;
  }) => {
    addDebugInfo(`Received answer from: ${data.replierId}`);

    try {
      if (!peerConnectionRef.current) {
        addDebugInfo("No peer connection available for answer");
        return;
      }

      const answer = new RTCSessionDescription({
        type: "answer",
        sdp: data.sdp,
      });

      await peerConnectionRef.current.setRemoteDescription(answer);
      addDebugInfo("Remote description set (answer)");
      setCallStatus("Call connecting...");
    } catch (error) {
      addDebugInfo(`Error handling answer: ${error}`);
      setCallStatus("Failed to establish connection");
    }
  };

  // Handle incoming ICE candidate
  const handleIncomingIceCandidate = async (data: {
    candidate: RTCIceCandidateInit;
    senderId: string;
  }) => {
    try {
      if (peerConnectionRef.current && data.candidate) {
        addDebugInfo(`Received ICE candidate from: ${data.senderId}`);

        // Make sure this is a candidate from our peer
        if (data.senderId !== peerId) {
          addDebugInfo(
            `Ignoring ICE candidate from non-peer: ${data.senderId}`
          );
          return;
        }

        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
        addDebugInfo("Added ICE candidate successfully");
      }
    } catch (error) {
      addDebugInfo(`Error adding ICE candidate: ${error}`);
    }
  };

  // Handle remote user disconnect
  const handleUserDisconnected = (data: { userId: string }) => {
    addDebugInfo(`User disconnected: ${data.userId}`);
    if (data.userId === peerId) {
      setCallStatus("Remote user disconnected");
      endCall();
    }
  };

  // End the call and clean up resources
  // const endCall = () => {
  //   addDebugInfo("Ending call and cleaning up");

  //   if (peerConnectionRef.current) {
  //     peerConnectionRef.current.close();
  //     peerConnectionRef.current = null;
  //   }

  //   if (localStreamRef.current) {
  //     localStreamRef.current.getTracks().forEach((track) => track.stop());
  //     localStreamRef.current = null;
  //   }

  //   if (localVideoRef.current) {
  //     localVideoRef.current.srcObject = null;
  //   }

  //   if (remoteVideoRef.current) {
  //     remoteVideoRef.current.srcObject = null;
  //   }

  //   setPeerId(null);
  //   setCallStatus("");
  //   setIsAvailable(false);
  // };
  const endCall = () => {
    addDebugInfo("Ending call and cleaning up");

    if (peerConnectionRef.current) {
      // Close the peer connection properly
      if (peerConnectionRef.current.signalingState !== "closed") {
        peerConnectionRef.current.close();
      }
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Notify the other peer about disconnection
    if (peerId && socket?.connected) {
      socket.emit("call-ended", { peerId: peerId });
    }

    setPeerId(null);
    setCallStatus("");
    setIsAvailable(false);
  };

  // Set up event listeners
  useEffect(() => {
    if (socket) {
      addDebugInfo("Setting up socket event listeners");

      socket.on("connect", () => {
        addDebugInfo("Socket connected");
      });

      socket.on("disconnect", () => {
        addDebugInfo("Socket disconnected");
      });

      socket.on("match-found", handleMatchFound);
      socket.on("offer", handleIncomingOffer);
      socket.on("answer", handleIncomingAnswer);
      socket.on("ice-candidate", handleIncomingIceCandidate);
      socket.on("user-disconnected", handleUserDisconnected);

      // Add explicit error handler
      socket.on("error", (error: any) => {
        addDebugInfo(`Socket error: ${error}`);
      });
    }

    return () => {
      if (socket) {
        addDebugInfo("Removing socket event listeners");
        socket.off("match-found", handleMatchFound);
        socket.off("offer", handleIncomingOffer);
        socket.off("answer", handleIncomingAnswer);
        socket.off("ice-candidate", handleIncomingIceCandidate);
        socket.off("user-disconnected", handleUserDisconnected);
        socket.off("error");
      }

      // Clean up resources
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [socket, peerId]);

  // Verify socket connection periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (socket) {
        if (socket.connected) {
          // Skip verbose logging of connected state
        } else {
          addDebugInfo("Socket disconnected - attempting to reconnect");
          socket.connect();
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [socket]);

  // Toggle availability status
  const handleAvailabilityToggle = async () => {
    if (!user?._id) {
      addDebugInfo("No user ID available");
      console.warn("User ID not available. Please log in.");
      return;
    }

    // If we're ending a call, clean up resources
    if (peerId) {
      addDebugInfo("Ending active call");
      endCall();
      return;
    }

    const newStatus = !isAvailable ? "available_for_call" : "online";
    setIsAvailable(!isAvailable);

    try {
      if (!isAvailable) {
        // Setup local media when becoming available
        await setupLocalMedia();
        setCallStatus("Looking for a match...");
        addDebugInfo("Status set to available, looking for match");
      } else {
        setCallStatus("");
        addDebugInfo("Status set to online, not searching");
      }

      await axios.put(`${API_BASE_URL}/users/${user._id}/status`, {
        status: newStatus,
      });
      addDebugInfo(`API status updated to: ${newStatus}`);
    } catch (error: any) {
      addDebugInfo(`Failed to update status: ${error.message}`);
      setIsAvailable(isAvailable);
    }
  };

  // Force connection restart
  const handleForceRestart = () => {
    addDebugInfo("Forcing connection restart");
    endCall();

    // Short delay before restarting
    setTimeout(() => {
      setIsAvailable(true);
      setupLocalMedia().then(() => {
        setCallStatus("Restarted and looking for match");
      });
    }, 1000);
  };

  if (!isAuthenticated) {
    return <p>Please log in to connect with others.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Connect Now</h2>
      {user?.name && <p className="mb-4">Welcome, {user.name}!</p>}

      <div className="mb-6">
        <button
          className={`px-4 py-2 rounded ${
            peerId
              ? "bg-red-500 hover:bg-red-600"
              : isAvailable
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-medium mr-2`}
          onClick={handleAvailabilityToggle}
        >
          {peerId
            ? "End Call"
            : isAvailable
            ? "Stop Searching"
            : "Find a Match"}
        </button>

        <button
          className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white font-medium"
          onClick={handleForceRestart}
        >
          Force Restart
        </button>

        {callStatus && (
          <p className="mt-2 text-gray-600 font-medium">{callStatus}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative bg-black rounded overflow-hidden aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            You
          </div>
        </div>

        <div className="relative bg-gray-800 rounded overflow-hidden aspect-video">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {peerId ? "Partner" : "Waiting for connection..."}
          </div>
        </div>
      </div>

      {/* Debug Information */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="font-bold mb-2">Debug Info</h3>
        <div className="text-xs font-mono bg-white p-2 rounded h-40 overflow-y-auto">
          {debugInfo.map((info, i) => (
            <div key={i} className="mb-1">
              {info}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
