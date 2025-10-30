"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ImageIcon, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Calendar } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface GalleryItem {
  id: number
  url: string
  caption: string | null
  createdAt: string
}

export default function GaleriPage() {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/public/gallery")
        if (!res.ok) throw new Error("Failed to fetch gallery")

        const data = await res.json()
        setImages(data)
      } catch (error) {
        console.error("Error fetching gallery:", error)
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Gallery Card Component with scroll animation
  const GalleryCard = ({ 
    image, 
    index, 
    onClick 
  }: { 
    image: GalleryItem; 
    index: number; 
    onClick: () => void;
  }) => {
    const ref = useScrollAnimation<HTMLDivElement>({
      threshold: 0.1,
      triggerOnce: true
    });

    return (
      <div
        ref={ref.ref}
        className={`group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer opacity-0-init ${
          ref.isVisible ? 'animate-fade-in-up' : ''
        }`}
        style={{ animationDelay: `${(index % 3) * 100}ms` }}
        onClick={onClick}
      >
        <div className="relative w-full h-64 bg-slate-200 overflow-hidden">
          <Image
            src={image.url}
            alt={image.caption || "Gallery image"}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="font-medium line-clamp-2">{image.caption || "Foto Kegiatan"}</p>
          </div>
        </div>
        <div className="bg-white p-4">
          <p className="text-slate-700 font-medium text-center line-clamp-1">
            {image.caption || "Foto Kegiatan"}
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            {formatDate(image.createdAt)}
          </p>
        </div>
      </div>
    );
  }

  const openLightbox = (image: GalleryItem, index: number) => {
    setSelectedImage(image)
    setSelectedIndex(index)
    setZoom(1)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    setZoom(1)
  }

  const goToPrevious = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1
    setSelectedIndex(newIndex)
    setSelectedImage(images[newIndex])
    setZoom(1)
  }

  const goToNext = () => {
    const newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0
    setSelectedIndex(newIndex)
    setSelectedImage(images[newIndex])
    setZoom(1)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleDownload = async () => {
    if (!selectedImage) return
    
    try {
      const response = await fetch(selectedImage.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `kelurahan-sendangan-${selectedImage.id}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (!selectedImage) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === '+' || e.key === '=') handleZoomIn()
      if (e.key === '-') handleZoomOut()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedImage, selectedIndex])

  return (
    <div className="w-full">
      <section className="relative bg-slate-900 text-white py-12 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2074"
            alt="Galeri Kegiatan"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-4xl font-bold">Galeri Kegiatan</h1>
          <p className="text-slate-300 mt-2">Dokumentasi kegiatan dan potensi Kelurahan Sendangan</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <div className="bg-slate-50 p-4">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="Galeri Masih Kosong"
              description="Belum ada foto kegiatan yang tersedia saat ini. Pantau terus halaman ini untuk melihat dokumentasi kegiatan dan momen menarik dari Kelurahan Sendangan."
              actionLabel="Lihat Berita Terkini"
              actionHref="/berita"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <GalleryCard
                  key={image.id}
                  image={image}
                  index={index}
                  onClick={() => openLightbox(image, index)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-full h-[95vh] p-0 gap-0 bg-black/95">
          <VisuallyHidden>
            <DialogTitle>
              {selectedImage?.caption || "Gallery Image"}
            </DialogTitle>
          </VisuallyHidden>
          {selectedImage && (
            <>
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 left-4 z-50 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium">
                {selectedIndex + 1} / {images.length}
              </div>

              {/* Navigation Arrows */}
              {selectedIndex > 0 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
              )}
              {selectedIndex < images.length - 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              )}

              {/* Main Image */}
              <div className="relative w-full h-full flex items-center justify-center p-20">
                <div 
                  className="relative max-w-full max-h-full transition-transform duration-300 ease-out"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.caption || "Gallery image"}
                    width={1920}
                    height={1080}
                    className="object-contain max-w-full max-h-[70vh]"
                  />
                </div>
              </div>

              {/* Bottom Toolbar */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent p-6">
                {/* Zoom Controls */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="bg-white/10 hover:bg-white/20 text-white"
                  >
                    <ZoomOut className="h-4 w-4 mr-1" />
                    Zoom Out
                  </Button>
                  <span className="text-white text-sm font-medium px-3">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="bg-white/10 hover:bg-white/20 text-white"
                  >
                    <ZoomIn className="h-4 w-4 mr-1" />
                    Zoom In
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleDownload}
                    className="bg-white/10 hover:bg-white/20 text-white ml-4"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>

                {/* Caption and Date */}
                {selectedImage.caption && (
                  <div className="text-center text-white">
                    <p className="text-lg font-medium">{selectedImage.caption}</p>
                    <p className="text-sm text-white/70 mt-1">
                      {formatDate(selectedImage.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
