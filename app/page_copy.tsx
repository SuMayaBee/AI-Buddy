// "use client"

// import React, { useEffect, useState, useRef } from "react"
// import useWebRTCAudioSession from "@/hooks/use-webrtc"
// import { tools } from "@/lib/tools"
// import { Hero } from "./components/Hero"
// import { VoiceSelector } from "./components/VoiceSelector"
// import { BroadcastButton } from "./components/BroadcastButton"
// import { StatusDisplay } from "./components/StatusDisplay"
// import { TokenUsageDisplay } from "./components/TokenUsageDisplay"
// import { MessageControls } from "./components/MessageControls"
// import { ToolsEducation } from "./components/ToolsEducation"
// import { motion } from "framer-motion"
// import { timeFunction, backgroundFunction, partyFunction, launchWebsite, takeScreenshot, copyToClipboard } from "./components/tools-functions"
// import { Toaster } from "@/components/ui/sonner"
// import { Video } from "@/components/reusable/Video"
// /////////////////////////////////////////////////////////////
// //import { Configuration, NewSessionData, StreamingAvatarApi } from '@heygen/streaming-avatar';
// import { getAccessToken } from "./api/session/service/route"
// import { useToast } from "@/hooks/use-toast"
// import OpenAI from 'openai';
// import MicButton from "@/components/reusable/MicButton"
// import { Loader2, Phone, PhoneOff } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"
// import Image from 'next/image'

// // interface ChatMessageType  {
// //   role: string;
// //   message: string;
// // };

// const App: React.FC = () => {
//   // State for voice selection
//   const { toast } = useToast()
//   const [showPlaceholder, setShowPlaceholder] = useState(true)
//   const [isBegin, setIsBegin] = useState<boolean>(false);
//   const [voice, setVoice] = useState("ash")
//   const mediaStream = useRef<HTMLVideoElement>(null);
//   const [stream, setStream] = useState<MediaStream>();
//  // const avatar = useRef<StreamingAvatarApi | null>(null);
//   const mediaRecorder = useRef<MediaRecorder | null>(null);
//   const audioChunks = useRef<Blob[]>([]);
//  // const [data, setData] = useState<NewSessionData>();
//   const [input, setInput] = useState<string>('');
//   const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
//   const [startLoading, setStartLoading] = useState<boolean>(false);
//   //const [isBegin, setIsBegin] = useState(false);
//   const webcamRef = useRef<HTMLVideoElement>(null);
//   const avatarRef = useRef<HTMLVideoElement>(null);

//   // WebRTC Audio Session Hook
//   const {
//     status,
//     isSessionActive,
//     registerFunction,
//     handleStartStopClick,
//     msgs,
//     conversation
//   } = useWebRTCAudioSession(voice, tools)

//   const [startAvatarLoading, setStartAvatarLoading] = useState<boolean>(false);
//   const [stopAvatarLoading, setStopAvatarLoading] = useState<boolean>(false);
//   let timeout: any;

//   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//     // 1) Initialize webcam
//     useEffect(() => {
//       async function startWebcam() {
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
//           if (webcamRef.current) {
//             webcamRef.current.srcObject = stream;
//             webcamRef.current.play();
//           }
//         } catch (err) {
//           console.error("Error starting webcam:", err);
//         }
//       }
//       startWebcam();
//     }, []);
  

//   // useEffect getting triggered when the input state is updated, basically make the avatar to talk
//   useEffect(() => {
//     async function speak() {
//       try {
//         await avatar.current?.speak({ taskRequest: { text: input, sessionId: data?.sessionId } });
//       } catch (err: any) {
//         console.error(err);
//       }
//     }

//     speak();
//   }, [input]);


// // Add this useEffect after other useEffects
// useEffect(() => {
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

//   // useEffect called when the component mounts, to fetch the accessToken and creates the new instance of StreamingAvatarApi
//   useEffect(() => {
//     async function fetchAccessToken() {
//       try {
//         const response = await getAccessToken();
//         const token = response.data.data.token;


//         // if (!avatar.current) {
//         //   avatar.current = new StreamingAvatarApi(
//         //     new Configuration({ accessToken: token })
//         //   );
//         // }
//         // console.log(avatar.current)
//         // // Clear any existing event handlers to prevent duplication
//         // avatar.current.removeEventHandler("avatar_stop_talking", handleAvatarStopTalking);
//         // avatar.current.addEventHandler("avatar_stop_talking", handleAvatarStopTalking);

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

 

//     //Function when user starts speaking
//     const handleStartSpeaking = () => {

//       navigator.mediaDevices.getUserMedia({ audio: true })
//         .then((stream) => {
//           const audioContext = new (window.AudioContext)(); 
//           const mediaStreamSource = audioContext.createMediaStreamSource(stream);
//           const analyser = audioContext.createAnalyser();
//           analyser.fftSize = 512;
//           const bufferLength = analyser.fftSize;
//           const dataArray = new Uint8Array(bufferLength);
        
//           mediaStreamSource.connect(analyser);
  
//           let silenceStart: number | null = null;
//           const silenceTimeout = 2000; // 2 second of silence
//           let silenceDetected = false;
//           mediaRecorder.current = new MediaRecorder(stream);
  
//           mediaRecorder.current.ondataavailable = (event) => {
//             audioChunks.current.push(event.data);
//           };
  
//           // mediaRecorder.current.onstop = () => {
//           //   const audioBlob = new Blob(audioChunks.current, {
//           //     type: 'audio/wav',
//           //   });
//           //   audioChunks.current = [];
//           //   transcribeAudio(audioBlob);
//           // };
  
//           mediaRecorder.current.start();
//           setIsSpeaking(true);
  
  
//           const checkSilence = () => {
//             analyser.getByteFrequencyData(dataArray);
//             const avgVolume = dataArray.reduce((a, b) => a + b) / bufferLength;
  
  
//             // Silence threshold
//             const silenceThreshold = 20;
  
//             if (avgVolume < silenceThreshold) {
//               console.log('here');
//               if (!silenceStart) silenceStart = Date.now();
  
//               if (Date.now() - silenceStart >= silenceTimeout && !silenceDetected) {
//                 console.log('silence detected!');
//                 silenceDetected = true;
//                 handleStopSpeaking(); 
//                 audioContext.close(); // Close the audio context
//                 stream.getTracks().forEach(track => track.stop()); // Stop the stream
//               }
//             } else {
//               silenceStart = null;
//             }
  
//             if (!silenceDetected) requestAnimationFrame(checkSilence);
//           };
  
//           checkSilence();
//         })
//         .catch((error) => {
//           console.error('Error accessing microphone:', error);
//           toast({
//             variant: "destructive",
//             title: "Uh oh! Something went wrong.",
//             description: error.message,
//           })
//         });
//     };

//   const handleStopSpeaking = async () => {
//     if (mediaRecorder.current) {
//       mediaRecorder.current.stop();
//       mediaRecorder.current = null;
//       setIsSpeaking(false);
//     }
//   };
  

// // Avatar stop talking event handler
// const handleAvatarStopTalking = (e: any) => {
//   console.log("Avatar stopped talking", e);
//   timeout = setTimeout(() => {
//     handleStartSpeaking();
//   }, 2000);
// };


// // Function to initiate the avatar
// async function grab() {
//   setStartLoading(true);
//   setStartAvatarLoading(true);
//   try {
//     const response = await getAccessToken();
//     console.log("Response: ",response);
//     const token = response.data.data.token;
//     console.log("Token: ",token);

//     console.log("Current Avatar: ", avatar.current);
// //////////////////////////////////////////////////////////////////////////////////////////////////////

//     // if (!avatar.current) {
//     //   avatar.current = new StreamingAvatarApi(
//     //     new Configuration({ accessToken: token })
//     //   );
//     // }
//     // avatar.current.addEventHandler("avatar_stop_talking", (e: any) => {
//     //   console.log("Avatar stopped talking", e);
//     //   setTimeout(() => {
//     //     handleStartSpeaking();
//     //   }, 2000);
//     // });

//     console.log("Current Avatar1: ", avatar.current);

//     // const res = await avatar.current!.createStartAvatar(
//     //   {
//     //     newSessionRequest: {
//     //       quality: "low",
//     //       avatarName: 'Artur_standing_office_side',
//     //       voice: { voiceId: "09465ad8e28d48f9affe795679e4be0e" }
//     //     }
//     //   },
//     // );

//     const res = await avatar.current!.createStartAvatar(
//       {
//         newSessionRequest: {
//           quality: "low",
//           avatarName: "Tyler-inshirt-20220721",
//           voice: { voiceId: "09465ad8e28d48f9affe795679e4be0e" }
//         }
//       },
//     );

//     console.log("Res", res);
//     setData(res);
//     setStream(avatar.current!.mediaStream);
//     setStartLoading(false);
//     setStartAvatarLoading(false);
//     setIsBegin(true);

//   } catch (error: any) {
//     console.log(error.message);
//     setStartAvatarLoading(false);
//     setStartLoading(false);
//     toast({
//       variant: "destructive",
//       title: "Uh oh! Something went wrong.",
//       description: error.response.data.message || error.message,
//     })
//   }
// };


// //Function to stop the avatar
// async function stop() {
//   setStopAvatarLoading(true);
//   try {
//     await avatar.current?.stopAvatar({ stopSessionRequest: { sessionId: data?.sessionId } });
//     // handleStopSpeaking();
//     setStopAvatarLoading(false);
//     avatar.current = null;
//   } catch (error: any) {
//     setStopAvatarLoading(false);
//     toast({
//       variant: "destructive",
//       title: "Uh oh! Something went wrong.",
//       description: error.response.data.message || error.message,
//     })
//   }
// }





//   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//   useEffect(() => {
//     // Register all functions
//     registerFunction('getCurrentTime', timeFunction)
//     registerFunction('changeBackgroundColor', backgroundFunction)
//     registerFunction('partyMode', partyFunction)
//     registerFunction('launchWebsite', launchWebsite)
//     registerFunction('takeScreenshot', takeScreenshot)
//     registerFunction('copyToClipboard', copyToClipboard)
//   }, [registerFunction])

//   // When the stream gets the data, The avatar video will gets played
//   useEffect(() => {
//     if (stream && mediaStream.current) {
//       console.log(stream);
//       console.log(mediaStream.current);
//       mediaStream.current.srcObject = stream;
//       // mediaStream.current.muted = true; // Mute audio
//       mediaStream.current.onloadedmetadata = () => {
//         mediaStream.current!.play();
//       };
//     }
//   }, [stream]);

//   // useEffect(() => {
//   //   if (stream && mediaStream.current) {
//   //     mediaStream.current.srcObject = stream;
//   //     mediaStream.current.muted = true; // Mute audio
//   //     mediaStream.current.onloadedmetadata = () => {
//   //       mediaStream.current?.play();
//   //     };
//   //   }
//   // }, [stream]);

//   // useEffect(() => {
//   //   if (conversation && conversation.length > 0) {
//   //     const lastMessage = conversation[conversation.length - 1];
//   //     console.log("Last Message", lastMessage);
//   //     console.log("Conversation", conversation);
  
//   //     // Only set input if assistant message isFinal
//   //     if (lastMessage.role === "assistant" && lastMessage.isFinal === true) {
//   //       setInput(lastMessage.text);
//   //     }
//   //   }
//   // }, [conversation]);

//   // Add new handler function
//   const handleCallClick = async () => {
//     try {
//       setStartLoading(true);
//       setShowPlaceholder(false); // Hide placeholder
//       await grab();
//       await handleStartStopClick();
//     } catch (error) {
//       console.error(error);
//       setShowPlaceholder(true); // Show placeholder on error
//       toast({
//         variant: "destructive",
//         title: "Call failed to connect",
//         description: "Please try again"
//       });
//     } finally {
//       setStartLoading(false);
//     }
//   };

//   return (
// //     <main className="h-screen flex w-full">
// //       {/* Left Side */}
// //       <div className="w-1/2 p-6 overflow-y-auto">

// //       <div className="w-1/2 flex items-center justify-center p-4">
// //       <video 
// //           ref={webcamRef} 
// //           className="border rounded" 
// //           muted 
// //           style={{ transform: 'scaleX(-1)' }} // Mirror horizontally
// //         />
// //         </div>

// //         <motion.div 
// //           className="container flex flex-col items-center justify-center mx-auto max-w-3xl my-20 p-12 border rounded-lg shadow-xl"
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.5 }}
// //         >
// //           {/* <Hero /> */}
          
// //           <motion.div 
// //             className="w-full max-w-md bg-card text-card-foreground rounded-xl border shadow-sm p-6 space-y-4"
// //             initial={{ opacity: 0, scale: 0.95 }}
// //             animate={{ opacity: 1, scale: 1 }}
// //             transition={{ delay: 0.2, duration: 0.4 }}
// //           >
// //             <VoiceSelector value={voice} onValueChange={setVoice} />
            
// //             <div className="flex flex-col items-center gap-4">
// //               <BroadcastButton 
// //                 isSessionActive={isSessionActive} 
// //                 onClick={handleStartStopClick}
// //               />
// //             </div>
// //             {/* {status && <TokenUsageDisplay messages={msgs} />} */}
// //             {/* {status && (
// //               <motion.div 
// //                 className="w-full flex flex-col gap-2"
// //                 initial={{ opacity: 0, height: 0 }}
// //                 animate={{ opacity: 1, height: "auto" }}
// //                 exit={{ opacity: 0, height: 0 }}
// //                 transition={{ duration: 0.3 }}
// //               >
// //                 <MessageControls conversation={conversation} msgs={msgs} />
// //               </motion.div>
// //             )} */}
// //           </motion.div>
          
// //           {/* {status && <StatusDisplay status={status} />}
// //           <div className="w-full flex flex-col items-center gap-4">
// //             <ToolsEducation />
// //           </div> */}
// //         </motion.div>
// //       </div>

// //       {/* Right Side */}
// // {/* Right Side */}
// // <div className="w-1/2 p-6 border-l">
// //   <motion.div
// //     className="relative flex flex-col h-full border rounded-lg shadow-xl p-6"
// //     initial={{ opacity: 0, x: 20 }}
// //     animate={{ opacity: 1, x: 0 }}
// //     transition={{ duration: 0.5 }}
// //   >
// //     <div className="flex-1 overflow-hidden rounded-lg">
// //       <div className="w-full h-full">
// //         <Video ref={mediaStream} />
// //       </div>
// //     </div>

// //     <div className='bg-gray-50 mt-4 p-2 rounded-lg'>
// //       <MicButton
// //         isSpeaking={isSpeaking}
// //         onClick={isSpeaking ? handleStopSpeaking : handleStartSpeaking}
// //         stopAvatar={stop}
// //         grab={grab}
// //         avatarStartLoading={startAvatarLoading}
// //         avatarStopLoading={stopAvatarLoading}
// //       />
// //     </div>
// //   </motion.div>
// //      </div>
// //       <Toaster />
// //     </main>

// <main className="min-h-screen flex flex-col w-full relative bg-gradient-to-br from-gray-900 via-black to-gray-900">
//   {/* Top Bar */}
//   <div className="absolute top-0 w-full h-12 flex items-center px-4 bg-black/40 backdrop-blur-sm border-b border-white/10 z-10">
//     <span className="text-sm text-white tracking-wide">Cool Video Call</span>
//   </div>

//   {/* Responsive Container: stack on small, side-by-side on md+ */}
//   <div className="flex flex-1 flex-col md:flex-row mt-12">
//     {/* Left side: Webcam */}
//     <div className="w-full md:w-1/2 p-2 flex items-center justify-center">
//       <div className="w-full h-[400px] md:h-[700px] relative overflow-hidden rounded-lg border border-white/10 shadow-lg">
//         <video
//           ref={webcamRef}
//           className="absolute inset-0 w-full h-full object-cover"
//           muted
//           style={{ transform: "scaleX(-1)" }}
//         />
//       </div>
//     </div>

//     {/* Right side: Avatar */}
//     <div className="w-full md:w-1/2 p-2 border-t md:border-t-0 md:border-l border-white/10 flex items-center justify-center">
//       <div className="w-full h-[400px] md:h-[700px] relative overflow-hidden rounded-lg border border-white/10 shadow-lg">
//         {showPlaceholder ? (
//           <Image
//             src="/ABC.jpg"
//             alt="Avatar placeholder"
//             fill
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//         ) : (
//           <Video
//             ref={mediaStream}
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//         )}
//       </div>
//     </div>
//   </div>

//   {/* Floating Controls - Bottom Center */}
//   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 p-4 bg-white/5 rounded-lg border border-white/10 shadow-xl">
//     <div className="relative">
//       {!isSessionActive && !startLoading && (
//         <div className="absolute inset-0 rounded-full animate-ping bg-gradient-to-r from-green-400/20 to-emerald-500/20" />
//       )}

//       <Button
//         variant="default"
//         size="lg"
//         className={cn(
//           "rounded-full w-24 h-24 relative transition-all duration-300",
//           "bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600",
//           "shadow-[0_0_15px_rgba(52,211,153,0.5)] hover:shadow-[0_0_20px_rgba(52,211,153,0.7)]",
//           "border-2 border-white/20 backdrop-blur-sm transform hover:scale-110 active:scale-95",
//           isSessionActive &&
//             "from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.5)] hover:shadow-[0_0_20px_rgba(244,63,94,0.7)]"
//         )}
//         onClick={handleCallClick}
//         disabled={startLoading}
//       >
//         <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full" />
//         {startLoading ? (
//           <Loader2 className="h-10 w-10 animate-spin text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
//         ) : isSessionActive ? (
//           <PhoneOff className="h-10 w-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
//         ) : (
//           <Phone className="h-10 w-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
//         )}
//       </Button>
//     </div>
//   </div>

//   <Toaster />
// </main>
//   )
// }

// export default App;