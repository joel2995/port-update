"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, GraduationCap, Trash2, Edit2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface Education {
  _id?: string
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
  const [educations, setEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch all educations
  const fetchEducations = async () => {
    try {
      const res = await axios.get("https://portfolio-back-cwzt.onrender.com/api/educations")
      setEducations(res.data)
    } catch {
      toast({ title: "Error", description: "Failed to fetch education records", variant: "destructive" })
    }
  }

  useEffect(() => {
    fetchEducations()
  }, [])

  const updateField = (field: keyof Education, value: string) => {
    setEducation((prev) => ({ ...prev, [field]: value }))
  }

  // Create or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editId) {
        // Update
        await axios.put(`https://portfolio-back-cwzt.onrender.com/api/educations/${editId}`, education)
        toast({ title: "Updated!", description: "Education updated successfully" })
      } else {
        // Create
        await axios.post("https://portfolio-back-cwzt.onrender.com/api/educations", education)
        toast({ title: "Success!", description: "Education information saved successfully" })
      }
      setEducation({ institution: "", degree: "", period: "", score: "" })
      setEditId(null)
      fetchEducations()
    } catch {
      toast({ title: "Error", description: "Failed to save education information", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Edit
  const handleEdit = (edu: Education) => {
    setEducation({
      institution: edu.institution,
      degree: edu.degree,
      period: edu.period,
      score: edu.score,
    })
    setEditId(edu._id || null)
  }

  // Delete
  const handleDelete = async (id?: string) => {
    if (!id) return
    setLoading(true)
    try {
      await axios.delete(`https://portfolio-back-cwzt.onrender.com/api/educations/${id}`)
      toast({ title: "Deleted!", description: "Education deleted successfully" })
      fetchEducations()
    } catch {
      toast({ title: "Error", description: "Failed to delete education", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEducation({ institution: "", degree: "", period: "", score: "" })
    setEditId(null)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="glass-card bg-white/10 backdrop-blur-md border-white/20 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <GraduationCap className="w-6 h-6 text-green-400" />
            {editId ? "Edit Education" : "Add Education"}
            {editId && (
              <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="ml-2">
                <X className="w-4 h-4 text-red-400" />
              </Button>
            )}
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
              {loading ? (editId ? "Updating..." : "Saving...") : (editId ? "Update Education" : "Save Education")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List of Educations */}
      <Card className="glass-card bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-xl text-white">Your Educations</CardTitle>
        </CardHeader>
        <CardContent>
          {educations.length === 0 ? (
            <div className="text-gray-400">No education records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-white">
                <thead>
                  <tr className="bg-white/10">
                    <th className="p-2 text-left">Institution</th>
                    <th className="p-2 text-left">Degree</th>
                    <th className="p-2 text-left">Period</th>
                    <th className="p-2 text-left">Score</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {educations.map((edu) => (
                    <tr key={edu._id} className="border-b border-white/10">
                      <td className="p-2">{edu.institution}</td>
                      <td className="p-2">{edu.degree}</td>
                      <td className="p-2">{edu.period}</td>
                      <td className="p-2">{edu.score}</td>
                      <td className="p-2 flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(edu)}
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(edu._id)}
                          title="Delete"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}