"use client"

import { useToast } from "@/hooks/use-toast"
import { useEffect } from 'react'

interface StatusDisplayProps {
  status: string
}

export function StatusDisplay({ status }: StatusDisplayProps) {
  const { toast } = useToast()

  useEffect(() => {
    if (status.startsWith("Error")) {
      toast({
        title: "Whoops!",
        description: status,
        variant: "destructive",
        duration: 3000,
      })
    } 
    else if (status.startsWith("Session established")) {
        toast({
            title: "We're live!",
            description: status,
            duration: 5000,
            variant: "destructive",
        })
    }
    else {
      toast({
        title: "Connecting to Voice Assistant...",
        description: status,
        duration: 3000,
        variant: "default",
      })
    }
  }, [status, toast])
    return null
} 