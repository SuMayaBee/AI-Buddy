// import type { StartAvatarResponse } from "@heygen/streaming-avatar";

// import StreamingAvatar, {
//   AvatarQuality,
//   StreamingEvents, TaskMode, TaskType, VoiceEmotion,
// } from "@heygen/streaming-avatar";
// import {
//   Button,
//   Card,
//   CardBody,
//   CardFooter,
//   Divider,
//   Input,
//   Select,
//   SelectItem,
//   Spinner,
//   Chip,
//   Tabs,
//   Tab,
// } from "@nextui-org/react";
// import { useEffect, useRef, useState } from "react";
// import { useMemoizedFn, usePrevious } from "ahooks";

// import InteractiveAvatarTextInput from "./InteractiveAvatarTextInput";

// import {AVATARS, STT_LANGUAGE_LIST} from "@/lib/constants";

// export default function InteractiveAvatar() {
//   const [isLoadingSession, setIsLoadingSession] = useState(false);
//   const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
//   const [stream, setStream] = useState<MediaStream>();
//   const [debug, setDebug] = useState<string>();
//   const [knowledgeId, setKnowledgeId] = useState<string>("");
//   const [avatarId, setAvatarId] = useState<string>("");
//   const [language, setLanguage] = useState<string>('en');

//   const [data, setData] = useState<StartAvatarResponse>();
//   const [text, setText] = useState<string>("");
//   const mediaStream = useRef<HTMLVideoElement>(null);
//   const avatar = useRef<StreamingAvatar | null>(null);
//   const [chatMode, setChatMode] = useState("text_mode");
//   const [isUserTalking, setIsUserTalking] = useState(false);

//   async function fetchAccessToken() {
//     try {
//       const response = await fetch("/api/get-access-token", {
//         method: "POST",
//       });
//       const token = await response.text();

//       console.log("Access Token:", token); // Log the token to verify

//       return token;
//     } catch (error) {
//       console.error("Error fetching access token:", error);
//     }

//     return "";
//   }

//   async function startSession() {
//     setIsLoadingSession(true);
//     const newToken = await fetchAccessToken();

//     avatar.current = new StreamingAvatar({
//       token: newToken,
//     });
//     avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
//       console.log("Avatar started talking", e);
//     });
//     avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
//       console.log("Avatar stopped talking", e);
//     });
//     avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
//       console.log("Stream disconnected");
//       endSession();
//     });
//     avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
//       console.log(">>>>> Stream ready:", event.detail);
//       setStream(event.detail);
//     });
//     avatar.current?.on(StreamingEvents.USER_START, (event) => {
//       console.log(">>>>> User started talking:", event);
//       setIsUserTalking(true);
//     });
//     avatar.current?.on(StreamingEvents.USER_STOP, (event) => {
//       console.log(">>>>> User stopped talking:", event);
//       setIsUserTalking(false);
//     });
//     try {
//       const res = await avatar.current.createStartAvatar({
//         quality: AvatarQuality.Low,
//         avatarName: avatarId,
//         knowledgeId: knowledgeId, // Or use a custom `knowledgeBase`.
//         voice: {
//           rate: 1.5, // 0.5 ~ 1.5
//           emotion: VoiceEmotion.EXCITED,
//         },
//         language: language,
//         disableIdleTimeout: true,
//       });

//       setData(res);
//       // default to voice mode
//       await avatar.current?.startVoiceChat({
//         useSilencePrompt: false
//       });
//       setChatMode("voice_mode");
//     } catch (error) {
//       console.error("Error starting avatar session:", error);
//     } finally {
//       setIsLoadingSession(false);
//     }
//   }
//   async function handleSpeak() {
//     setIsLoadingRepeat(true);
//     if (!avatar.current) {
//       setDebug("Avatar API not initialized");

//       return;
//     }
//     // speak({ text: text, task_type: TaskType.REPEAT })
//     await avatar.current.speak({ text: text, taskType: TaskType.REPEAT, taskMode: TaskMode.SYNC }).catch((e) => {
//       setDebug(e.message);
//     });
//     setIsLoadingRepeat(false);
//   }
//   async function handleInterrupt() {
//     if (!avatar.current) {
//       setDebug("Avatar API not initialized");

//       return;
//     }
//     await avatar.current
//       .interrupt()
//       .catch((e) => {
//         setDebug(e.message);
//       });
//   }
//   async function endSession() {
//     await avatar.current?.stopAvatar();
//     setStream(undefined);
//   }

//   const handleChangeChatMode = useMemoizedFn(async (v) => {
//     if (v === chatMode) {
//       return;
//     }
//     if (v === "text_mode") {
//       avatar.current?.closeVoiceChat();
//     } else {
//       await avatar.current?.startVoiceChat();
//     }
//     setChatMode(v);
//   });

//   const previousText = usePrevious(text);
//   useEffect(() => {
//     if (!previousText && text) {
//       avatar.current?.startListening();
//     } else if (previousText && !text) {
//       avatar?.current?.stopListening();
//     }
//   }, [text, previousText]);

//   useEffect(() => {
//     return () => {
//       endSession();
//     };
//   }, []);

//   useEffect(() => {
//     if (stream && mediaStream.current) {
//       mediaStream.current.srcObject = stream;
//       mediaStream.current.onloadedmetadata = () => {
//         mediaStream.current!.play();
//         setDebug("Playing");
//       };
//     }
//   }, [mediaStream, stream]);

//   return (
//     <div className="w-full flex flex-col gap-4">
//       <Card>
//         <CardBody className="h-[500px] flex flex-col justify-center items-center">
//           {stream ? (
//             <div className="h-[500px] w-[900px] justify-center items-center flex rounded-lg overflow-hidden">
//               <video
//                 ref={mediaStream}
//                 autoPlay
//                 playsInline
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "contain",
//                 }}
//               >
//                 <track kind="captions" />
//               </video>
//               <div className="flex flex-col gap-2 absolute bottom-3 right-3">
//                 <Button
//                   className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white rounded-lg"
//                   size="md"
//                   variant="shadow"
//                   onClick={handleInterrupt}
//                 >
//                   Interrupt task
//                 </Button>
//                 <Button
//                   className="bg-gradient-to-tr from-indigo-500 to-indigo-300  text-white rounded-lg"
//                   size="md"
//                   variant="shadow"
//                   onClick={endSession}
//                 >
//                   End session
//                 </Button>
//               </div>
//             </div>
//           ) : !isLoadingSession ? (
//             <div className="h-full justify-center items-center flex flex-col gap-8 w-[500px] self-center">
//               <div className="flex flex-col gap-2 w-full">
//                 <p className="text-sm font-medium leading-none">
//                   Custom Knowledge ID (optional)
//                 </p>
//                 <Input
//                   placeholder="Enter a custom knowledge ID"
//                   value={knowledgeId}
//                   onChange={(e) => setKnowledgeId(e.target.value)}
//                 />
//                 <p className="text-sm font-medium leading-none">
//                   Custom Avatar ID (optional)
//                 </p>
//                 <Input
//                   placeholder="Enter a custom avatar ID"
//                   value={avatarId}
//                   onChange={(e) => setAvatarId(e.target.value)}
//                 />
//                 <Select
//                   placeholder="Or select one from these example avatars"
//                   size="md"
//                   onChange={(e) => {
//                     setAvatarId(e.target.value);
//                   }}
//                 >
//                   {AVATARS.map((avatar) => (
//                     <SelectItem
//                       key={avatar.avatar_id}
//                       textValue={avatar.avatar_id}
//                     >
//                       {avatar.name}
//                     </SelectItem>
//                   ))}
//                 </Select>
//                 <Select
//                   label="Select language"
//                   placeholder="Select language"
//                   className="max-w-xs"
//                   selectedKeys={[language]}
//                   onChange={(e) => {
//                     setLanguage(e.target.value);
//                   }}
//                 >
//                   {STT_LANGUAGE_LIST.map((lang) => (
//                     <SelectItem key={lang.key}>
//                       {lang.label}
//                     </SelectItem>
//                   ))}
//                 </Select>
//               </div>
//               <Button
//                 className="bg-gradient-to-tr from-indigo-500 to-indigo-300 w-full text-white"
//                 size="md"
//                 variant="shadow"
//                 onClick={startSession}
//               >
//                 Start session
//               </Button>
//             </div>
//           ) : (
//             <Spinner color="default" size="lg" />
//           )}
//         </CardBody>
//         <Divider />
//         <CardFooter className="flex flex-col gap-3 relative">
//           <Tabs
//             aria-label="Options"
//             selectedKey={chatMode}
//             onSelectionChange={(v) => {
//               handleChangeChatMode(v);
//             }}
//           >
//             <Tab key="text_mode" title="Text mode" />
//             <Tab key="voice_mode" title="Voice mode" />
//           </Tabs>
//           {chatMode === "text_mode" ? (
//             <div className="w-full flex relative">
//               <InteractiveAvatarTextInput
//                 disabled={!stream}
//                 input={text}
//                 label="Chat"
//                 loading={isLoadingRepeat}
//                 placeholder="Type something for the avatar to respond"
//                 setInput={setText}
//                 onSubmit={handleSpeak}
//               />
//               {text && (
//                 <Chip className="absolute right-16 top-3">Listening</Chip>
//               )}
//             </div>
//           ) : (
//             <div className="w-full text-center">
//               <Button
//                 isDisabled={!isUserTalking}
//                 className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white"
//                 size="md"
//                 variant="shadow"
//               >
//                 {isUserTalking ? "Listening" : "Voice chat"}
//               </Button>
//             </div>
//           )}
//         </CardFooter>
//       </Card>
//       <p className="font-mono text-right">
//         <span className="font-bold">Console:</span>
//         <br />
//         {debug}
//       </p>
//     </div>
//   );
// }

import type { StartAvatarResponse } from "@heygen/streaming-avatar";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents, 
  VoiceEmotion, TaskMode, TaskType
} from "@heygen/streaming-avatar";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
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
import { forwardRef, useImperativeHandle } from 'react';
import InteractiveAvatarTextInput from "./InteractiveAvatarTextInput";

import {AVATARS, STT_LANGUAGE_LIST} from "@/lib/constants";
import Image from "next/image";

interface InteractiveAvatarProps {
  inputText?: string;
}

export interface InteractiveAvatarRef {
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
}


const InteractiveAvatar = forwardRef<InteractiveAvatarRef, InteractiveAvatarProps>(
  ({ inputText }, ref) => {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [data, setData] = useState<StartAvatarResponse>();
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const [text, setText] = useState<string>("");
  const [chatMode, setChatMode] = useState("text_mode");
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [debug, setDebug] = useState<string>();
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);

  useImperativeHandle(ref, () => ({
    startSession,
    endSession
  }));

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      return await response.text();
    } catch (error) {
      console.error("Error fetching token:", error);
      return "";
    }
  }

  async function startSession() {
    setIsLoadingSession(true);
    try {
      const settings = JSON.parse(localStorage.getItem('avatarSettings') || '{}');
      const newToken = await fetchAccessToken();
      if (!newToken) {
        throw new Error("Failed to get access token");
      }

      if (newToken && !avatar.current) {
     
      avatar.current = new StreamingAvatar({ token: newToken });
     
      setupEventListeners();

      avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
          console.log("Avatar started talking", e);
        });
        avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
          console.log("Avatar stopped talking", e);
        });
        avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
          console.log("Stream disconnected");
          endSession();
        });
        avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
          console.log(">>>>> Stream ready:", event.detail);
          setStream(event.detail);
        });
        avatar.current?.on(StreamingEvents.USER_START, (event) => {
          console.log(">>>>> User started talking:", event);
          setIsUserTalking(true);
        });
        avatar.current?.on(StreamingEvents.USER_STOP, (event) => {
          console.log(">>>>> User stopped talking:", event);
          setIsUserTalking(false);
        });

      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: settings.avatarId || process.env.NEXT_PUBLIC_DEFAULT_AVATAR_ID,
        knowledgeId: settings.knowledgeId,
        voice: {
          rate: 1.5,
          emotion: VoiceEmotion.EXCITED,
        },
        language: settings.language || 'en',
        disableIdleTimeout: true,
      });

      setData(res);

      // // Start voice chat by default
      // await avatar.current?.startVoiceChat({
      //   useSilencePrompt: false
      // });
      // setChatMode("voice_mode");

      setChatMode("text_mode");
    }

    } catch (error) {
      console.error("Error starting avatar:", error);
    } finally {
      setIsLoadingSession(false);
    }
  }

  const handleChangeChatMode = useMemoizedFn(async (mode) => {
    if (mode === chatMode) return;
    
    if (mode === "text_mode") {
      avatar.current?.closeVoiceChat();
    } else {
      await avatar.current?.startVoiceChat();
    }
    setChatMode(mode);
  });

  const setupEventListeners = () => {
    if (!avatar.current) return;
    
    avatar.current.on(StreamingEvents.STREAM_READY, (event) => {
      setStream(event.detail);
    });
    
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      endSession();
    });
  };

  async function endSession() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  async function handleSpeak() {
    setIsLoadingRepeat(true);
    if (!avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }
    
    try {
      await avatar.current.speak({ 
        text, 
        taskType: TaskType.REPEAT, 
        taskMode: TaskMode.SYNC 
      });
      setText(""); // Clear input after speaking
    } catch (e: any) {
      setDebug(e.message);
    } finally {
      setIsLoadingRepeat(false);
    }
  }
  async function handleInterrupt() {
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    await avatar.current
      .interrupt()
      .catch((e) => {
        setDebug(e.message);
      });
  }

    const previousText = usePrevious(text);
  useEffect(() => {
    if (!previousText && text) {
      avatar.current?.startListening();
    } else if (previousText && !text) {
      avatar?.current?.stopListening();
    }
  }, [text, previousText]);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  useEffect(() => {
    if (inputText && avatar.current && stream) {
      setText(inputText);
      handleSpeak();
    }
  }, [inputText]);

  // Update useEffect for automatic speaking
useEffect(() => {
  if (text && avatar.current && stream) {
    handleSpeak();
  }
}, [text]); // Watch for text changes

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
      };
    }
  }, [mediaStream, stream]);

  useEffect(() => {
    startSession();
  }, []);



  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current?.play();
      };
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  return (
    <div className="relative w-full h-[700px] overflow-hidden rounded-lg border border-white/10">
    {stream ? (
      <video
        ref={mediaStream}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      >
        <track kind="captions" />
      </video>
    ) : (
      <div className="w-full h-full relative">
        <Image
          src="/ABC.jpg"
          alt="Avatar placeholder"
          fill
          className="object-cover"
        />
        {isLoadingSession && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>
    )}


      
{stream && (
      <>
    <div className="absolute bottom-20 opacity-0 left-1/2 -translate-x-1/2 w-[80%] flex items-center gap-4">
      {chatMode === "text_mode" && (
        <div className="w-full flex gap-2">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="Type something..."
            className="flex-1 bg-black/20 backdrop-blur-sm text-white"
          />
          {isLoadingRepeat && (
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Speaking...</span>
            </div>
          )}
        </div>
      )}
    </div>
{/* 
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <Tabs
            selectedKey={chatMode}
            onSelectionChange={handleChangeChatMode}
          >
            <Tab key="text_mode" title="Text" />
            <Tab key="voice_mode" title="Voice" />
          </Tabs>

          {chatMode === "voice_mode" && (
            <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
              {isUserTalking ? "Listening..." : "Ready for voice chat"}
            </div>
          )}

          <Button 
            onClick={endSession}
            variant="destructive"
            size="sm"
          >
            End
          </Button>
        </div> */}
      </>
    )}
    </div>
  );
}
)

InteractiveAvatar.displayName = 'InteractiveAvatar';
export default InteractiveAvatar;