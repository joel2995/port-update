"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface Certification {
  title: string
  issuer: string
  date: string
  credentialUrl: string
}

export default function CertificationsForm() {
  const [certification, setCertification] = useState<Certification>({
    title: "",
    issuer: "",
    date: "",
    credentialUrl: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const updateField = (field: keyof Certification, value: string) => {
    setCertification((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post("https://portfolio-back-cwzt.onrender.com/api/certifications", certification)

      toast({
        title: "Success!",
        description: "Certification saved successfully",
      })

      // Reset form
      setCertification({
        title: "",
        issuer: "",
        date: "",
        credentialUrl: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save certification",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="glass-card bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <Star className="w-6 h-6 text-purple-400" />
            Certification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-lg bg-white/5 border border-white/10 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Certification Title
                  </Label>
                  <Input
                    id="title"
                    value={certification.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., AWS Certified Solutions Architect"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuer" className="text-gray-300">
                    Issuing Organization
                  </Label>
                  <Input
                    id="issuer"
                    value={certification.issuer}
                    onChange={(e) => updateField("issuer", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., Amazon Web Services"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-gray-300">
                    Issue Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={certification.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credentialUrl" className="text-gray-300">
                    Credential URL
                  </Label>
                  <Input
                    id="credentialUrl"
                    type="url"
                    value={certification.credentialUrl}
                    onChange={(e) => updateField("credentialUrl", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>
            </motion.div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Certification"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
