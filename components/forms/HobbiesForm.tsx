"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Save, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Hobby {
  name: string
  description: string
  level: string
}

export default function HobbiesForm() {
  const [hobbies, setHobbies] = useState<Hobby[]>([{ name: "", description: "", level: "" }])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addHobby = () => {
    setHobbies([...hobbies, { name: "", description: "", level: "" }])
  }

  const removeHobby = (index: number) => {
    if (hobbies.length > 1) {
      setHobbies(hobbies.filter((_, i) => i !== index))
    }
  }

  const updateHobby = (index: number, field: keyof Hobby, value: string) => {
    const updated = hobbies.map((hobby, i) => (i === index ? { ...hobby, [field]: value } : hobby))
    setHobbies(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call since this is UI-only
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "Hobbies saved locally",
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="glass-card bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <Heart className="w-6 h-6 text-yellow-400" />
            Hobbies & Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {hobbies.map((hobby, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg bg-white/5 border border-white/10 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-yellow-300">Hobby {index + 1}</h3>
                  {hobbies.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeHobby(index)}
                      className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`hobby-name-${index}`} className="text-gray-300">
                      Hobby Name
                    </Label>
                    <Input
                      id={`hobby-name-${index}`}
                      value={hobby.name}
                      onChange={(e) => updateHobby(index, "name", e.target.value)}
                      className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="e.g., Photography, Gaming, Cooking"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`hobby-level-${index}`} className="text-gray-300">
                      Experience Level
                    </Label>
                    <Input
                      id={`hobby-level-${index}`}
                      value={hobby.level}
                      onChange={(e) => updateHobby(index, "level", e.target.value)}
                      className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="e.g., Beginner, Intermediate, Advanced"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`hobby-description-${index}`} className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id={`hobby-description-${index}`}
                    value={hobby.description}
                    onChange={(e) => updateHobby(index, "description", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                    placeholder="Describe your hobby and what you enjoy about it..."
                    required
                  />
                </div>
              </motion.div>
            ))}

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={addHobby}
                variant="outline"
                className="glass-button bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Hobby
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Hobbies"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
