import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Clock, Tag } from 'lucide-react'
import Container from '../../components/ui/Container'
import Card from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxTitle, setLightboxTitle] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [selectedCategory, projects])

  async function loadProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('display_order')

    if (data) {
      setProjects(data)

      const uniqueCategories = Array.from(new Set(data.map(p => p.category)))
      setCategories(uniqueCategories)
    }

    setLoading(false)
  }

  function filterProjects() {
    if (selectedCategory === 'All') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(p => p.category === selectedCategory))
    }
  }

  function openLightbox(project: any) {
    const images = project.images || []
    setLightboxImages(images)
    setLightboxIndex(0)
    setLightboxTitle(project.title)
    setLightboxOpen(true)
  }

  function closeLightbox() {
    setLightboxOpen(false)
    setLightboxImages([])
    setLightboxIndex(0)
  }

  function nextImage() {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)
  }

  function previousImage() {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-wood-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-charcoal-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-beige-50 to-white py-16 md:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">Our Portfolio</h1>
            <p className="text-xl text-charcoal-600 leading-relaxed">
              Explore our collection of completed projects showcasing exceptional craftsmanship and design
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 bg-white border-b border-charcoal-200">
        <Container>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === 'All'
                  ? 'bg-wood-700 text-white shadow-md'
                  : 'bg-beige-100 text-charcoal-700 hover:bg-beige-200'
              }`}
            >
              All Projects
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-wood-700 text-white shadow-md'
                    : 'bg-beige-100 text-charcoal-700 hover:bg-beige-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-charcoal-600">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => {
                const images = project.images || []
                const firstImage = images[0]

                return (
                  <div key={project.id} onClick={() => openLightbox(project)}>
                    <Card
                      hover
                      padding="none"
                      className="overflow-hidden cursor-pointer"
                    >
                      {firstImage ? (
                        <img
                          src={firstImage}
                          alt={project.title}
                          className="w-full h-64 object-cover"
                        />
                      ) : (
                        <div className="w-full h-64 bg-beige-200 flex items-center justify-center">
                          <span className="text-charcoal-400">No image</span>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Tag className="w-4 h-4 text-wood-700" />
                          <span className="text-sm text-wood-700 font-medium">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-charcoal-600 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-charcoal-500">
                          {project.completion_time && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{project.completion_time}</span>
                            </div>
                          )}
                          {images.length > 1 && (
                            <span>{images.length} photos</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>
          )}
        </Container>
      </section>

      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-wood-400 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
            {lightboxImages.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-4 text-white hover:text-wood-400 transition-colors bg-black bg-opacity-50 rounded-full p-3"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 text-white hover:text-wood-400 transition-colors bg-black bg-opacity-50 rounded-full p-3"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <div className="max-w-7xl max-h-full">
              <img
                src={lightboxImages[lightboxIndex]}
                alt={`${lightboxTitle} - Image ${lightboxIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain"
              />
              <div className="text-center mt-4 text-white">
                <h3 className="text-xl font-semibold mb-2">{lightboxTitle}</h3>
                {lightboxImages.length > 1 && (
                  <p className="text-sm text-charcoal-300">
                    Image {lightboxIndex + 1} of {lightboxImages.length}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
