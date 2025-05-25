"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Save, Code, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface Project {
  id?: string
  title: string
  description: string
  technologies: string[]
  githubUrl: string
  liveUrl: string
  image: string
}

export default function ProjectsForm() {
  const [projects, setProjects] = useState<Project[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentProject, setCurrentProject] = useState<Project>({
    title: "",
    description: "",
    technologies: [""],
    githubUrl: "",
    liveUrl: "",
    image: "",
  })
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get("https://portfolio-back-cwzt.onrender.com/api/projects")
        // Ensure we're getting the data property from the response
        const projectsData = Array.isArray(response.data.data) ? response.data.data : 
                           Array.isArray(response.data) ? response.data : []
        // console.log('Fetched projects:', projectsData) // Debug log
        setProjects(projectsData)
      } catch (error) {
        console.error('Error fetching projects:', error)
        toast({
          title: "Error",
          description: "Failed to fetch projects",
          variant: "destructive",
        })
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [toast])

  const addTechnology = () => {
    setCurrentProject((prev) => ({
      ...prev,
      technologies: [...prev.technologies, ""],
    }))
  }

  const removeTechnology = (index: number) => {
    if (currentProject.technologies.length > 1) {
      setCurrentProject((prev) => ({
        ...prev,
        technologies: prev.technologies.filter((_, i) => i !== index),
      }))
    }
  }

  const updateTechnology = (index: number, value: string) => {
    setCurrentProject((prev) => ({
      ...prev,
      technologies: prev.technologies.map((tech, i) => (i === index ? value : tech)),
    }))
  }

  const updateField = (field: keyof Omit<Project, "technologies">, value: string) => {
    setCurrentProject((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setCurrentProject((prev) => ({ ...prev, image: base64 }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        title: currentProject.title,
        description: currentProject.description,
        technologies: currentProject.technologies.filter((t) => t.trim() !== ""),
        githubUrl: currentProject.githubUrl,
        liveUrl: currentProject.liveUrl,
        image: currentProject.image,
      }

      if (editingId) {
        await axios.put(`https://portfolio-back-cwzt.onrender.com/api/projects/${editingId}`, payload)
        // Update the projects list with the edited project
        setProjects(projects.map(p => p.id === editingId ? { ...payload, id: editingId } : p))
        toast({
          title: "Success!",
          description: "Project updated successfully",
        })
      } else {
        const response = await axios.post("https://portfolio-back-cwzt.onrender.com/api/projects", [payload])
        // Add the new project to the projects list
        setProjects([...projects, ...response.data])
        toast({
          title: "Success!",
          description: "Project saved successfully",
        })
      }

      // Reset form
      setCurrentProject({
        title: "",
        description: "",
        technologies: [""],
        githubUrl: "",
        liveUrl: "",
        image: "",
      })
      setEditingId(null)
    } catch (error) {
      console.error('Error saving project:', error)
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setCurrentProject({
      title: "",
      description: "",
      technologies: [""],
      githubUrl: "",
      liveUrl: "",
      image: "",
    })
    setEditingId(null)
  }

  const handleEdit = (project: Project) => {
    setCurrentProject({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      image: project.image,
    })
    setEditingId(project.id || null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      await axios.delete(`https://portfolio-back-cwzt.onrender.com/api/projects/${id}`)
      setProjects(projects.filter((project) => project.id !== id))
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="glass-card bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <Code className="w-6 h-6 text-indigo-400" />
            Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-indigo-300 mb-4">Existing Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                <p className="text-gray-400 col-span-2 text-center">Loading projects...</p>
              ) : projects && projects.length > 0 ? (
                projects.map((project) => (
                  <motion.div
                    key={project.id || Math.random().toString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">{project.title}</h4>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(project)}
                          className="text-blue-400 border-blue-400/50 hover:bg-blue-400/10"
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => project.id && handleDelete(project.id)}
                          className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies && project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-white/10 text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 col-span-2 text-center">No projects found. Add your first project!</p>
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
                <h3 className="text-lg font-semibold text-indigo-300">
                  {editingId ? "Edit Project" : "Add New Project"}
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
                  <Label htmlFor="title" className="text-gray-300">
                    Project Title
                  </Label>
                  <Input
                    id="title"
                    value={currentProject.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Project name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-gray-300">
                    Project Image
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="glass-input bg-white/10 border-white/20 text-white file:bg-white/20 file:border-0 file:text-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="glass-button bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubUrl" className="text-gray-300">
                    GitHub URL
                  </Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    value={currentProject.githubUrl}
                    onChange={(e) => updateField("githubUrl", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="https://github.com/..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="liveUrl" className="text-gray-300">
                    Live URL
                  </Label>
                  <Input
                    id="liveUrl"
                    type="url"
                    value={currentProject.liveUrl}
                    onChange={(e) => updateField("liveUrl", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={currentProject.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                  placeholder="Describe your project..."
                  required
                />
              </div>

              <div className="space-y-4">
                <Label className="text-gray-300">Technologies Used</Label>
                {currentProject.technologies.map((technology, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={technology}
                      onChange={(e) => updateTechnology(index, e.target.value)}
                      className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400 flex-1"
                      placeholder="e.g., React, Node.js, MongoDB"
                      required
                    />
                    {currentProject.technologies.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTechnology(index)}
                        className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={addTechnology}
                  variant="outline"
                  size="sm"
                  className="glass-button bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Technology
                </Button>
              </div>
            </motion.div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : editingId ? "Update Project" : "Save Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
