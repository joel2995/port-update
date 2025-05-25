"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Save, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface Skill {
  name: string
  level: number
  category: string
}

const skillCategories = [
  "Programming Languages",
  "Bloackchain Development", 
  "Frameworks & Tools",
]

export default function SkillsForm() {
  const [skill, setSkill] = useState<Skill>({
    name: "",
    level: 50,
    category: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const updateField = (field: keyof Skill, value: string | number) => {
    setSkill((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post("https://portfolio-back-cwzt.onrender.com/api/skills", skill)

      toast({
        title: "Success!",
        description: "Skill saved successfully",
      })

      // Reset form
      setSkill({
        name: "",
        level: 50,
        category: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save skill",
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
            <User className="w-6 h-6 text-pink-400" />
            Skills
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
                  <Label htmlFor="name" className="text-gray-300">
                    Skill Name
                  </Label>
                  <Input
                    id="name"
                    value={skill.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., React, Python, Design"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300">
                    Category
                  </Label>
                  <Select value={skill.category} onValueChange={(value) => updateField("category", value)}>
                    <SelectTrigger className="glass-input bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {skillCategories.map((category) => (
                        <SelectItem key={category} value={category} className="text-white hover:bg-white/10">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-gray-300">Skill Level: {skill.level}%</Label>
                <div className="px-4">
                  <Slider
                    value={[skill.level]}
                    onValueChange={(value) => updateField("level", value[0])}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                  <span>Expert</span>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Preview</h4>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{skill.name || "Skill Name"}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm">{skill.level}%</span>
                </div>
                {skill.category && (
                  <span className="inline-block mt-2 px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded">
                    {skill.category}
                  </span>
                )}
              </div>
            </motion.div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Skill"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
