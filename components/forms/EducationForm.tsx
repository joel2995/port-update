"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface Education {
  institution: string
  degree: string
  period: string
  score: string
}

export default function EducationForm() {
  const [education, setEducation] = useState<Education>({
    institution: "",
    degree: "",
    period: "",
    score: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const updateField = (field: keyof Education, value: string) => {
    setEducation((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post("https://portfolio-back-cwzt.onrender.com/api/educations", education)

      toast({
        title: "Success!",
        description: "Education information saved successfully",
      })

      // Reset form
      setEducation({
        institution: "",
        degree: "",
        period: "",
        score: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save education information",
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
            <GraduationCap className="w-6 h-6 text-green-400" />
            Education
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
                  <Label htmlFor="institution" className="text-gray-300">
                    Institution
                  </Label>
                  <Input
                    id="institution"
                    value={education.institution}
                    onChange={(e) => updateField("institution", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., Stanford University"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree" className="text-gray-300">
                    Degree
                  </Label>
                  <Input
                    id="degree"
                    value={education.degree}
                    onChange={(e) => updateField("degree", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., Bachelor of Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period" className="text-gray-300">
                    Period
                  </Label>
                  <Input
                    id="period"
                    value={education.period}
                    onChange={(e) => updateField("period", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., 2020 - 2024"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="score" className="text-gray-300">
                    Score/GPA
                  </Label>
                  <Input
                    id="score"
                    value={education.score}
                    onChange={(e) => updateField("score", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., 3.8/4.0"
                    required
                  />
                </div>
              </div>
            </motion.div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Education"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
