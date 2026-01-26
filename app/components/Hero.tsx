import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <div className="text-center mb-8 rounded-lg p-4">
      <div className="flex justify-center items-center mx-auto gap-2 h-full w-full mb-2">
        {/* <Badge className="text-xl font-medium">
          shadcn/ui starter kit
        </Badge> */}
        {/* <Link href="https://github.com/cameronking4/shadcn-openai-realtime-webrtc">
          <Button className="shadow-md rounded-full" variant="outline">
            <GithubIcon />
          </Button>
        </Link> */}
      </div>
      <h1 className="text-4xl font-bold mb-4">
        OpenAI WebRTC Audio Avatar
      </h1>
      <p className="max-w-2xl mx-auto">
        {/* Experience real-time voice AI powered by OpenAI&apos;s latest API (12/17/2024)<br/> */}
      </p>
    </div>
  )
} 