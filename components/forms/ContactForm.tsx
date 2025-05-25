"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Save, Mail, Phone, MapPin, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContactInfo {
  email: string
  phone: string
  address: string
  website: string
  linkedin: string
  github: string
  message: string
}

export default function ContactForm() {
  const [contact, setContact] = useState<ContactInfo>({
    email: "",
    phone: "",
    address: "",
    website: "",
    linkedin: "",
    github: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const updateField = (field: keyof ContactInfo, value: string) => {
    setContact((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call since this is UI-only
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "Contact information saved locally",
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="glass-card bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <Mail className="w-6 h-6 text-teal-400" />
            Contact Information
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
                  <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={contact.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={contact.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="City, State, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-gray-300 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={contact.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-gray-300">
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={contact.linkedin}
                    onChange={(e) => updateField("linkedin", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github" className="text-gray-300">
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    type="url"
                    value={contact.github}
                    onChange={(e) => updateField("github", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-300">
                  Additional Message
                </Label>
                <Textarea
                  id="message"
                  value={contact.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                  placeholder="Any additional information you'd like to share..."
                />
              </div>
            </motion.div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Contact Info"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
