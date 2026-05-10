import { useEffect, useState } from 'react'

export default function Chapter({ number, title, children, decision, images }) {
  const [activeImageIndex, setActiveImageIndex] = useState(null)

  const closeImagePreview = () => setActiveImageIndex(null)

  const hasPlaceholder = (img) =>
    img.src?.startsWith('PLACEHOLDER') ||
    img.srcLight?.startsWith('PLACEHOLDER') ||
    img.srcDark?.startsWith('PLACEHOLDER')

  const getResolvedSrc = (img) => img.src ?? img.srcLight ?? img.srcDark

  const isRenderableImage = (img) => !hasPlaceholder(img) && Boolean(getResolvedSrc(img))

  const getPreviewSource = (img) => {
    if (img.srcLight && img.srcDark) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? img.srcDark : img.srcLight
    }

    return img.src ?? img.srcLight ?? img.srcDark
  }

  const handleImageTap = (imgIndex) => {
    const image = images?.[imgIndex]
    if (!image || !isRenderableImage(image)) return

    const previewSrc = getPreviewSource(image)
    if (!previewSrc) return

    setActiveImageIndex(imgIndex)
  }

  const getNavigableImageCount = () =>
    (images ?? []).reduce((count, img) => (isRenderableImage(img) ? count + 1 : count), 0)

  const getNextRenderableIndex = (startIndex, direction) => {
    if (!images || images.length === 0) return null

    let nextIndex = startIndex
    for (let step = 0; step < images.length; step += 1) {
      nextIndex = (nextIndex + direction + images.length) % images.length
      if (isRenderableImage(images[nextIndex])) return nextIndex
    }

    return null
  }

  const openPreviousImage = () => {
    if (activeImageIndex === null) return
    const previousIndex = getNextRenderableIndex(activeImageIndex, -1)
    if (previousIndex !== null) setActiveImageIndex(previousIndex)
  }

  const openNextImage = () => {
    if (activeImageIndex === null) return
    const nextIndex = getNextRenderableIndex(activeImageIndex, 1)
    if (nextIndex !== null) setActiveImageIndex(nextIndex)
  }

  const activeImage = activeImageIndex !== null ? images?.[activeImageIndex] : null
  const activeImageData = activeImage
    ? {
        src: getPreviewSource(activeImage),
        alt: activeImage.alt ?? activeImage.label ?? 'Case study screenshot',
        caption: activeImage.caption ?? activeImage.label ?? null,
      }
    : null

  useEffect(() => {
    if (activeImageIndex === null) return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeImagePreview()
      if (event.key === 'ArrowLeft') openPreviousImage()
      if (event.key === 'ArrowRight') openNextImage()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeImageIndex, images])

  const canNavigateImages = getNavigableImageCount() > 1

  return (
    <section className="px-6 md:px-12 py-16 md:py-24 max-w-wide mx-auto">
      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
            Chapter {number}
          </div>
          <h2 className="display text-3xl md:text-4xl leading-tight text-balance">
            {title}
          </h2>
        </div>

        <div className="md:col-span-7 md:col-start-5 space-y-5 text-lg leading-relaxed text-pretty">
          {children}

          {images && images.length > 0 && (
            <div className="pt-6 space-y-4 md:pt-8 md:space-y-5 md:-mx-8 lg:-mx-12">
              <p className="text-xs font-mono tracking-wide text-muted/80 px-1">
                Tap to enlarge. Use arrows or swipe to browse.
              </p>
              {images.map((img, i) => {
                const resolvedSrc = getResolvedSrc(img)

                return hasPlaceholder(img) || !resolvedSrc ? (
                  <figure
                    key={i}
                    className="border border-dashed border-rule rounded-md bg-white/50 aspect-[16/10] flex items-center justify-center px-4"
                  >
                    <figcaption className="text-xs font-mono uppercase tracking-wide text-muted text-center">
                      {img.label}
                    </figcaption>
                  </figure>
                ) : (
                  <figure
                    key={i}
                    onClick={() => handleImageTap(i)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleImageTap(i)
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open image preview: ${img.alt ?? img.label ?? 'case study screenshot'}`}
                    className="border border-rule rounded-md md:rounded-lg overflow-hidden bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)] transition duration-200 ease-out hover:scale-[1.005] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] active:scale-[0.995] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                  >
                    {img.srcLight && img.srcDark ? (
                      <picture>
                        <source
                          srcSet={img.srcDark}
                          media="(prefers-color-scheme: dark)"
                        />
                        <img src={img.srcLight} alt={img.alt} className="w-full h-auto" />
                      </picture>
                    ) : (
                      <img src={resolvedSrc} alt={img.alt} className="w-full h-auto" />
                    )}
                    {img.caption && (
                      <figcaption className="text-xs font-mono text-muted px-4 py-2 border-t border-rule">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              })}
            </div>
          )}

          {decision && (
            <div className="pt-6 mt-6 border-t border-rule">
              <div className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
                The decision I'm proud of
              </div>
              <p className="font-serif text-xl italic leading-snug">
                {decision}
              </p>
            </div>
          )}

          {activeImage && (
            <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
              <button
                type="button"
                onClick={closeImagePreview}
                aria-label="Close image preview"
                className="absolute inset-0 bg-black/75 image-preview-backdrop"
              />
              <div className="relative z-10 h-full w-full flex items-center justify-center p-4 image-preview-content">
                <div className="w-full max-w-4xl">
                  <div className="flex justify-end mb-2">
                    <button
                      type="button"
                      onClick={closeImagePreview}
                      className="text-white text-sm font-mono uppercase tracking-wide opacity-90 hover:opacity-100 transition-opacity"
                    >
                      Close
                    </button>
                  </div>
                  <div className="relative">
                    {canNavigateImages && (
                      <button
                        type="button"
                        onClick={openPreviousImage}
                        aria-label="Previous image"
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/55 text-white text-2xl leading-none hover:bg-black/70 transition-colors"
                      >
                        ‹
                      </button>
                    )}
                    <img
                      src={activeImageData.src}
                      alt={activeImageData.alt}
                      className="w-full max-h-[80vh] object-contain rounded-md border border-rule bg-white"
                    />
                    {canNavigateImages && (
                      <button
                        type="button"
                        onClick={openNextImage}
                        aria-label="Next image"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/55 text-white text-2xl leading-none hover:bg-black/70 transition-colors"
                      >
                        ›
                      </button>
                    )}
                  </div>
                  {activeImageData.caption && (
                    <p className="text-xs font-mono text-white/85 mt-2 px-1">
                      {activeImageData.caption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
