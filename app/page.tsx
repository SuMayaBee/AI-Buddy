"use client"

import React, { useEffect, useState, useRef } from "react"
import useWebRTCAudioSession from "@/hooks/use-webrtc"
import { tools } from "@/lib/tools"
// import { Hero } from "./components/Hero"
// import { VoiceSelector } from "./components/VoiceSelector"
// import { BroadcastButton } from "./components/BroadcastButton"
// import { StatusDisplay } from "./components/StatusDisplay"
// import { TokenUsageDisplay } from "./components/TokenUsageDisplay"
// import { MessageControls } from "./components/MessageControls"
// import { ToolsEducation } from "./components/ToolsEducation"
// import { motion } from "framer-motion"
import { timeFunction, backgroundFunction, partyFunction, launchWebsite, takeScreenshot, copyToClipboard } from "./components/tools-functions"
import { Toaster } from "@/components/ui/sonner"
// import { Video } from "@/components/reusable/Video"
// import { Configuration, NewSessionData, StreamingAvatarApi } from '@heygen/streaming-avatar';
// import { getAccessToken } from "./api/session/service/route"
import { useToast } from "@/hooks/use-toast"
// import OpenAI from 'openai';
// import MicButton from "@/components/reusable/MicButton"
// import { Loader2, Phone, PhoneOff } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"
import Image from 'next/image'

import { StartAvatarResponse } from "@heygen/streaming-avatar";

import { InteractiveAvatarRef } from "./components/InteractiveAvatar"



import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Divider,
    Input,
    Select,
    SelectItem,
    Spinner,
    Chip,
    Tabs,
    Tab,
  } from "@nextui-org/react";

import { useMemoizedFn, usePrevious } from "ahooks";
import InteractiveAvatar from "./components/InteractiveAvatar"
import { Loader2, Phone, PhoneOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { BroadcastButton } from "./components/BroadcastButton"
import { VoiceSelector } from "./components/VoiceSelector"
import { ToolsEducation } from "./components/ToolsEducation"


interface ChatMessageType  {
  role: string;
  message: string;
};

const App: React.FC = () => {
  // State for voice selection
  
  const { toast } = useToast()
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [isBegin, setIsBegin] = useState<boolean>(false);
  const [voice, setVoice] = useState("ash")
  const mediaStream = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream>();
 // const avatar = useRef<StreamingAvatarApi | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
 // const [data, setData] = useState<NewSessionData>();
  const [input, setInput] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [startLoading, setStartLoading] = useState<boolean>(false);
  //const [isBegin, setIsBegin] = useState(false);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<InteractiveAvatarRef>(null);

  // WebRTC Audio Session Hook
  const {
    status,
    isSessionActive,
    registerFunction,
    handleStartStopClick,
    msgs,
    conversation
  } = useWebRTCAudioSession(voice, tools)

  

  const [startAvatarLoading, setStartAvatarLoading] = useState<boolean>(false);
  const [stopAvatarLoading, setStopAvatarLoading] = useState<boolean>(false);
  let timeout: any;

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 1) Initialize webcam
    useEffect(() => {
      async function startWebcam() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (webcamRef.current) {
            webcamRef.current.srcObject = stream;
            webcamRef.current.play();
          }
        } catch (err) {
          console.error("Error starting webcam:", err);
        }
      }
      startWebcam();
    }, []);
  



// Add this useEffect after other useEffects
useEffect(() => {
  if (conversation && conversation.length > 0) {
    const lastMessage = conversation[conversation.length - 1];
    console.log("Last Message", lastMessage);
    console.log("Conversation", conversation);

    // Only set input if assistant message isFinal
    if (lastMessage.role === "assistant" && lastMessage.isFinal === true) {
      setInput(lastMessage.text);
    }
  }
}, [conversation]);

//   // useEffect called when the component mounts, to fetch the accessToken and creates the new instance of StreamingAvatarApi
//   useEffect(() => {
//     async function fetchAccessToken() {
//       try {
//         const response = await getAccessToken();
//         const token = response.data.data.token;

//       } catch (error: any) {
//         console.error("Error fetching access token:", error);
//         toast({
//           variant: "destructive",
//           title: "Uh oh! Something went wrong.",
//           description: error.response.data.message || error.message,
//         })
//       }
//     }

//     fetchAccessToken();

//     return () => {
//       // Cleanup event handler and timeout
//       if (avatar.current) {
//         avatar.current.removeEventHandler("avatar_stop_talking", handleAvatarStopTalking);
//       }
//       clearTimeout(timeout);
//     }

//   }, []);

const [sessionActive, setSessionActive] = useState(false);
 
const handleCallClick = async () => {
  try {
    setStartLoading(true);
    setShowPlaceholder(false);
    
    await Promise.all([
      handleStartStopClick(),
      avatarRef.current?.startSession()
    ]);
    
    setSessionActive(!sessionActive); // Toggle session state
  } catch (error) {
    console.error(error);
    setShowPlaceholder(true);
    toast({
      variant: "destructive",
      title: "Call failed to connect",
      description: "Please try again"
    });
  } finally {
    setStartLoading(false);
  }
};

      //Function when user starts speaking
    const handleStartSpeaking = () => {

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const audioContext = new (window.AudioContext)(); 
          const mediaStreamSource = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 512;
          const bufferLength = analyser.fftSize;
          const dataArray = new Uint8Array(bufferLength);
        
          mediaStreamSource.connect(analyser);
  
          let silenceStart: number | null = null;
          const silenceTimeout = 2000; // 2 second of silence
          let silenceDetected = false;
          mediaRecorder.current = new MediaRecorder(stream);
  
          mediaRecorder.current.ondataavailable = (event) => {
            audioChunks.current.push(event.data);
          };
  
          // mediaRecorder.current.onstop = () => {
          //   const audioBlob = new Blob(audioChunks.current, {
          //     type: 'audio/wav',
          //   });
          //   audioChunks.current = [];
          //   transcribeAudio(audioBlob);
          // };
  
          mediaRecorder.current.start();
          setIsSpeaking(true);
  
  
          const checkSilence = () => {
            analyser.getByteFrequencyData(dataArray);
            const avgVolume = dataArray.reduce((a, b) => a + b) / bufferLength;
  
  
            // Silence threshold
            const silenceThreshold = 20;
  
            if (avgVolume < silenceThreshold) {
              console.log('here');
              if (!silenceStart) silenceStart = Date.now();
  
              if (Date.now() - silenceStart >= silenceTimeout && !silenceDetected) {
                console.log('silence detected!');
                silenceDetected = true;
                handleStopSpeaking(); 
                audioContext.close(); // Close the audio context
                stream.getTracks().forEach(track => track.stop()); // Stop the stream
              }
            } else {
              silenceStart = null;
            }
  
            if (!silenceDetected) requestAnimationFrame(checkSilence);
          };
  
          checkSilence();
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message,
          })
        });
    };


  const handleStopSpeaking = async () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current = null;
      setIsSpeaking(false);
    }
  };


    useEffect(() => {
    // Register all functions
    registerFunction('getCurrentTime', timeFunction)
    registerFunction('changeBackgroundColor', backgroundFunction)
    registerFunction('partyMode', partyFunction)
    registerFunction('launchWebsite', launchWebsite)
    registerFunction('takeScreenshot', takeScreenshot)
    registerFunction('copyToClipboard', copyToClipboard)
  }, [registerFunction])

  //   useEffect(() => {
  //   if (conversation && conversation.length > 0) {
  //     const lastMessage = conversation[conversation.length - 1];
  //     console.log("Last Message", lastMessage);
  //     console.log("Conversation", conversation);
  
  //     // Only set input if assistant message isFinal
  //     if (lastMessage.role === "assistant" && lastMessage.isFinal === true) {
  //       setInput(lastMessage.text);
  //     }
  //   }
  // }, [conversation]);











  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // Register all functions
    registerFunction('getCurrentTime', timeFunction)
    registerFunction('changeBackgroundColor', backgroundFunction)
    registerFunction('partyMode', partyFunction)
    registerFunction('launchWebsite', launchWebsite)
    registerFunction('takeScreenshot', takeScreenshot)
    registerFunction('copyToClipboard', copyToClipboard)
  }, [registerFunction])

  




  return (

<main className="min-h-screen flex flex-col w-full relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
  {/* Status Bar */}
  {/* <div className="absolute top-0 w-full h-14 flex items-center px-6 bg-black/30 backdrop-blur-md border-b border-white/5 z-10">
    <div className="flex items-center gap-3">
      <div className={cn(
        "h-2 w-2 rounded-full",
        isSessionActive ? "bg-green-500 animate-pulse" : "bg-gray-500"
      )} />
      <span className="text-sm font-medium text-white/90">
        {isSessionActive ? "Call Active" : "Ready to Connect"}
      </span>
    </div>
  </div> */}

  {/* Video Grid */}
  <div className="flex flex-1 flex-col md:flex-row gap-4 p-4 pt-16">
    {/* Webcam Container */}
    <div className="w-full md:w-1/2 relative group">
  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
  <div className="w-full h-[400px] md:h-[700px] relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
    <video
      ref={webcamRef}
      className="absolute inset-0 w-full h-full object-cover"
      muted
      style={{ transform: "scaleX(-1)" }}
    />
    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-md rounded-full">
      <div className={cn(
        "h-2 w-2 rounded-full",
        isSessionActive 
          ? "bg-green-500 animate-pulse" 
          : "bg-gray-400"
      )} />
      <span className="text-sm font-medium text-white/90">
        {isSessionActive ? "Connected" : "Ready"}
      </span>
    </div>
  </div>
</div>

    {/* Avatar Container */}
    <div className="w-full md:w-1/2 relative group">
  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
  <div className="w-full h-[400px] md:h-[700px] relative overflow-hidden rounded-2xl border border-white/10">
    {startLoading ? (
      <>
        <Image
          src="/ABC.jpg"
          alt="Avatar placeholder"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </>
    ) : isSessionActive ? (
      <InteractiveAvatar 
        ref={avatarRef}
        inputText={input}
      />
    ) : (
      <Image
        src="/ABC.jpg"
        alt="Avatar placeholder"
        fill
        className="object-cover"
      />
    )}
  </div>
</div>
  </div>

  {/* Floating Controls */}
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 p-6 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-20">
  <Button
    variant="solid"
    size="lg"
    className={cn(
      "rounded-full w-16 h-16 relative transition-all duration-300",
      "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
      "shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]",
      "border border-white/20",
      isSessionActive && "from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
    )}
    onClick={handleCallClick}
    disabled={startLoading}
  >
    {startLoading ? (
      <Loader2 className="h-6 w-6 animate-spin text-white" />
    ) : isSessionActive ? (
      <PhoneOff className="h-6 w-6 text-white" />
    ) : (
      <Phone className="h-6 w-6 text-white" />
    )}
  </Button>
  </div>

  <Toaster />
</main>
  )
}

export default App;