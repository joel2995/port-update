"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save, BookOpen, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Book {
  title: string
  author: string
  genre: string
  rating: number
  status: string
  review: string
}

const genres = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Biography",
  "History",
  "Self-Help",
  "Technology",
  "Business",
  "Other",
]

const statuses = ["Want to Read", "Currently Reading", "Completed", "On Hold"]

export default function BooksForm() {
  const [books, setBooks] = useState<Book[]>([{ title: "", author: "", genre: "", rating: 0, status: "", review: "" }])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addBook = () => {
    setBooks([...books, { title: "", author: "", genre: "", rating: 0, status: "", review: "" }])
  }

  const removeBook = (index: number) => {
    if (books.length > 1) {
      setBooks(books.filter((_, i) => i !== index))
    }
  }

  const updateBook = (index: number, field: keyof Book, value: string | number) => {
    const updated = books.map((book, i) => (i === index ? { ...book, [field]: value } : book))
    setBooks(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call since this is UI-only
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "Book collection saved locally",
      })
      setLoading(false)
    }, 1000)
  }

  const renderStars = (rating: number, bookIndex: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => updateBook(bookIndex, "rating", star)}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-600"
            } hover:text-yellow-400 transition-colors`}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        ))}
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="glass-card bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <BookOpen className="w-6 h-6 text-violet-400" />
            Book Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {books.map((book, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg bg-white/5 border border-white/10 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-violet-300">Book {index + 1}</h3>
                  {books.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBook(index)}
                      className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`book-title-${index}`} className="text-gray-300">
                      Book Title
                    </Label>
                    <Input
                      id={`book-title-${index}`}
                      value={book.title}
                      onChange={(e) => updateBook(index, "title", e.target.value)}
                      className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Enter book title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`book-author-${index}`} className="text-gray-300">
                      Author
                    </Label>
                    <Input
                      id={`book-author-${index}`}
                      value={book.author}
                      onChange={(e) => updateBook(index, "author", e.target.value)}
                      className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Author name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`book-genre-${index}`} className="text-gray-300">
                      Genre
                    </Label>
                    <Select value={book.genre} onValueChange={(value) => updateBook(index, "genre", value)}>
                      <SelectTrigger className="glass-input bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre} className="text-white hover:bg-white/10">
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`book-status-${index}`} className="text-gray-300">
                      Reading Status
                    </Label>
                    <Select value={book.status} onValueChange={(value) => updateBook(index, "status", value)}>
                      <SelectTrigger className="glass-input bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status} className="text-white hover:bg-white/10">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Rating</Label>
                  {renderStars(book.rating, index)}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`book-review-${index}`} className="text-gray-300">
                    Review/Notes
                  </Label>
                  <Textarea
                    id={`book-review-${index}`}
                    value={book.review}
                    onChange={(e) => updateBook(index, "review", e.target.value)}
                    className="glass-input bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                    placeholder="Your thoughts about this book..."
                  />
                </div>
              </motion.div>
            ))}

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={addBook}
                variant="outline"
                className="glass-button bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Book
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Book Collection"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
