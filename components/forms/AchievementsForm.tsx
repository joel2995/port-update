"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Save, Award } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface Achievement {
  id?: string
  title: string
  organization: string
  date: string
  description: string
}

export default function AchievementsForm() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    { title: "", organization: "", date: "", description: "" },
  ])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addAchievement = () => {
    setAchievements([...achievements, { title: "", organization: "", date: "", description: "" }])
  }

  const removeAchievement = (index: number) => {
    if (achievements.length > 1) {
      setAchievements(achievements.filter((_, i) => i !== index))
    }
  }

  const updateAchievement = (index: number, field: keyof Achievement, value: string) => {
    const updated = achievements.map((achievement, i) =>
      i === index ? { ...achievement, [field]: value } : achievement,
    )
    setAchievements(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = { achievements }
      await axios.post("https://portfolio-back-cwzt.onrender.com/api/achievements", payload)

      toast({
        title: "Success!",
        description: "Achievements saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save achievements",
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
            <Award className="w-6 h-6 text-cyan-400" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg bg-white/5 border border-white/10 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-cyan-300">Achievement {index + 1}</h3>
                  {achievements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAchievement(index)}
                      className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${index}`} className="text-gray-300">
                      Title
                    </Label>
                    <Input
                      id={`title-${index}`}
                      value={achievement.title}
                      onChange={(e) => updateAchievement(index, "title", e.target.value)}
                      className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Achievement title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`organization-${index}`} className="text-gray-300">
                      Organization
                    </Label>
                    <Input
                      id={`organization-${index}`}
                      value={achievement.organization}
                      onChange={(e) => updateAchievement(index, "organization", e.target.value)}
                      className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Organization name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`date-${index}`} className="text-gray-300">
                      Date
                    </Label>
                    <Input
                      id={`date-${index}`}
                      type="date"
                      value={achievement.date}
                      onChange={(e) => updateAchievement(index, "date", e.target.value)}
                      className="glass-input bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`} className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id={`description-${index}`}
                    value={achievement.description}
                    onChange={(e) => updateAchievement(index, "description", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                    placeholder="Describe your achievement..."
                    required
                  />
                </div>
              </motion.div>
            ))}

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={addAchievement}
                variant="outline"
                className="glass-button bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Achievements"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
