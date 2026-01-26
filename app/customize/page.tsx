"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AVATARS, STT_LANGUAGE_LIST } from "@/lib/constants"
import { useRouter } from "next/navigation"
import { VoiceSelector } from "../components/VoiceSelector"

export default function CustomizeAvatar() {
  const router = useRouter()
  const [knowledgeId, setKnowledgeId] = useState("")
  const [avatarId, setAvatarId] = useState("")
  const [language, setLanguage] = useState("en")
  const [voice, setVoice] = useState("ash")

  const handleSave = () => {
    localStorage.setItem('avatarSettings', JSON.stringify({
      knowledgeId,
      avatarId,
      language
    }))
    router.push('/')
  }

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <h1 className="text-2xl font-bold mb-6">Customize Avatar</h1>
      <div className="space-y-6">
      <div className="space-y-2">
          <label className="text-sm font-medium">Voice Selection</label>
          <VoiceSelector 
            value={voice} 
            onValueChange={setVoice}
          />
        </div>
        <div>
          <Input 
            placeholder="Enter custom knowledge ID"
            value={knowledgeId}
            onChange={(e) => setKnowledgeId(e.target.value)}
          />
        </div>

        <div>
          <Input
            placeholder="Enter custom avatar ID" 
            value={avatarId}
            onChange={(e) => setAvatarId(e.target.value)}
          />
        </div>

        <Select value={avatarId} onValueChange={setAvatarId}>
          <SelectTrigger>
            <SelectValue placeholder="Select an avatar" />
          </SelectTrigger>
          <SelectContent>
            {AVATARS.map((avatar) => (
              <SelectItem key={avatar.avatar_id} value={avatar.avatar_id}>
                {avatar.name}  
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {STT_LANGUAGE_LIST.map((lang) => (
              <SelectItem key={lang.key} value={lang.key}>
                {lang.label}
              </SelectItem>  
            ))}
          </SelectContent>
        </Select>

        <Button className="w-full" onClick={handleSave}>
          Save & Return
        </Button>
      </div>
    </div>
  )
}