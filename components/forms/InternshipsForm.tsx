"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Save, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface Internship {
  id?: string
  company: string
  role: string
  period: string
  responsibilities: string[]
}

export default function InternshipsForm() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentInternship, setCurrentInternship] = useState<Internship>({
    company: "",
    role: "",
    period: "",
    responsibilities: [""],
  })
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchInternships = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get("https://portfolio-back-cwzt.onrender.com/api/internships")
        const internshipsData = Array.isArray(response.data.data) ? response.data.data : 
                              Array.isArray(response.data) ? response.data : []
        console.log('Fetched internships:', internshipsData)
        setInternships(internshipsData)
      } catch (error) {
        console.error('Error fetching internships:', error)
        toast({
          title: "Error",
          description: "Failed to fetch internships",
          variant: "destructive",
        })
        setInternships([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchInternships()
  }, [toast])

  const addResponsibility = () => {
    setCurrentInternship((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }))
  }

  const removeResponsibility = (index: number) => {
    if (currentInternship.responsibilities.length > 1) {
      setCurrentInternship((prev) => ({
        ...prev,
        responsibilities: prev.responsibilities.filter((_, i) => i !== index),
      }))
    }
  }

  const updateResponsibility = (index: number, value: string) => {
    setCurrentInternship((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.map((resp, i) => (i === index ? value : resp)),
    }))
  }

  const updateField = (field: keyof Omit<Internship, "responsibilities">, value: string) => {
    setCurrentInternship((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        company: currentInternship.company,
        role: currentInternship.role,
        period: currentInternship.period,
        responsibilities: currentInternship.responsibilities.filter((r) => r.trim() !== ""),
      }

      if (editingId) {
        await axios.put(`https://portfolio-back-cwzt.onrender.com/api/internships/${editingId}`, payload)
        toast({
          title: "Success!",
          description: "Internship updated successfully",
        })
      } else {
        await axios.post("https://portfolio-back-cwzt.onrender.com/api/internships", payload)
        toast({
          title: "Success!",
          description: "Internship saved successfully",
        })
      }

      // Reset form
      setCurrentInternship({
        company: "",
        role: "",
        period: "",
        responsibilities: [""],
      })
      setEditingId(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save internship",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (internship: Internship) => {
    setCurrentInternship(internship)
    setEditingId(internship.id || null)
  }

  const cancelEdit = () => {
    setCurrentInternship({
      company: "",
      role: "",
      period: "",
      responsibilities: [""],
    })
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this internship?")) return

    try {
      await axios.delete(`https://portfolio-back-cwzt.onrender.com/api/internships/${id}`)
      setInternships(internships.filter((internship) => internship.id !== id))
      toast({
        title: "Success",
        description: "Internship deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete internship",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="glass-card bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <Briefcase className="w-6 h-6 text-orange-400" />
            Internships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-orange-300 mb-4">Existing Internships</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                <p className="text-gray-400 col-span-2 text-center">Loading internships...</p>
              ) : internships && internships.length > 0 ? (
                internships.map((internship) => (
                  <motion.div
                    key={internship.id || Math.random().toString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-white font-medium">{internship.company}</h4>
                        <p className="text-gray-400 text-sm">{internship.role}</p>
                        <p className="text-gray-500 text-xs">{internship.period}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(internship)}
                          className="text-blue-400 border-blue-400/50 hover:bg-blue-400/10"
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => internship.id && handleDelete(internship.id)}
                          className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h5 className="text-gray-300 text-sm mb-2">Responsibilities:</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {internship.responsibilities.map((resp, index) => (
                          <li key={index} className="text-gray-400 text-sm">
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 col-span-2 text-center">No internships found. Add your first internship!</p>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-lg bg-white/5 border border-white/10 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-orange-300">
                  {editingId ? "Edit Internship" : "Add New Internship"}
                </h3>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={cancelEdit}
                    className="text-gray-400 border-gray-400/50 hover:bg-gray-400/10"
                  >
                    Cancel
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-gray-300">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={currentInternship.company}
                    onChange={(e) => updateField("company", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Company name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-300">
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={currentInternship.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Your role/position"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="period" className="text-gray-300">
                    Period
                  </Label>
                  <Input
                    id="period"
                    value={currentInternship.period}
                    onChange={(e) => updateField("period", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., June 2023 - August 2023"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-gray-300">Responsibilities</Label>
                {currentInternship.responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={responsibility}
                      onChange={(e) => updateResponsibility(index, e.target.value)}
                      className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400 flex-1"
                      placeholder="Describe your responsibility..."
                      required
                    />
                    {currentInternship.responsibilities.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeResponsibility(index)}
                        className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={addResponsibility}
                  variant="outline"
                  size="sm"
                  className="glass-button bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Responsibility
                </Button>
              </div>
            </motion.div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : editingId ? "Update Internship" : "Save Internship"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
