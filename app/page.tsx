"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Award, GraduationCap, Briefcase, Code, Star, Mail, Heart, BookOpen, ChevronRight } from "lucide-react"
import AchievementsForm from "@/components/forms/AchievementsForm"
import CertificationsForm from "@/components/forms/CertificationsForm"
import EducationForm from "@/components/forms/EducationForm"
import InternshipsForm from "@/components/forms/InternshipsForm"
import ProjectsForm from "@/components/forms/ProjectsForm"
import SkillsForm from "@/components/forms/SkillsForm"
import ContactForm from "@/components/forms/ContactForm"
import HobbiesForm from "@/components/forms/HobbiesForm"
import BooksForm from "@/components/forms/BooksForm"
import ParticleBackground from "@/components/ui/ParticleBackground"

const formComponents = {
  achievements: AchievementsForm,
  certifications: CertificationsForm,
  education: EducationForm,
  internships: InternshipsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  contact: ContactForm,
  hobbies: HobbiesForm,
  books: BooksForm,
}

const formOptions = [
  { id: "achievements", label: "Achievements", icon: Award, color: "from-cyan-400 to-blue-500" },
  { id: "certifications", label: "Certifications", icon: Star, color: "from-purple-400 to-pink-500" },
  { id: "education", label: "Education", icon: GraduationCap, color: "from-green-400 to-emerald-500" },
  { id: "internships", label: "Internships", icon: Briefcase, color: "from-orange-400 to-red-500" },
  { id: "projects", label: "Projects", icon: Code, color: "from-indigo-400 to-purple-500" },
  { id: "skills", label: "Skills", icon: User, color: "from-pink-400 to-rose-500" },
  { id: "contact", label: "Contact", icon: Mail, color: "from-teal-400 to-cyan-500" },
  { id: "hobbies", label: "Hobbies", icon: Heart, color: "from-yellow-400 to-orange-500" },
  { id: "books", label: "Books", icon: BookOpen, color: "from-violet-400 to-purple-500" },
]

export default function PortfolioManager() {
  const [activeForm, setActiveForm] = useState<string | null>(null)

  const ActiveFormComponent = activeForm ? formComponents[activeForm as keyof typeof formComponents] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
           JOEL  Portfolio Updater
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything will be Under The Code except the Life           </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!activeForm ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {formOptions.map((option, index) => {
                const IconComponent = option.icon
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      z: 50,
                    }}
                    className="perspective-1000"
                  >
                    <Card
                      className="glass-card p-6 cursor-pointer group relative overflow-hidden border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
                      onClick={() => setActiveForm(option.id)}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                      />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${option.color} shadow-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                          {option.label}
                        </h3>

                        <p className="text-gray-400 text-sm">
                          Manage your {option.label.toLowerCase()} with advanced CRUD operations
                        </p>
                      </div>

                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-6">
                <Button
                  onClick={() => setActiveForm(null)}
                  variant="outline"
                  className="glass-button bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  ← Back to Dashboard
                </Button>
              </div>

              {ActiveFormComponent && <ActiveFormComponent />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
