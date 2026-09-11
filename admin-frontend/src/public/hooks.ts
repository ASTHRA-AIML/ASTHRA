import { useCallback, useRef, useState } from 'react'

/**
 * Robust scroll reveal hook using a callback ref.
 * Automatically attaches an IntersectionObserver as soon as the DOM element mounts,
 * even after async data loads or conditional re-renders.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  return useCallback((node: T | null) => {
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('visible')
          observer.unobserve(node)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
    )

    observer.observe(node)
  }, [])
}

/**
 * Animated number counter using callback ref and IntersectionObserver.
 * Smoothly interpolates to the target number once scrolled into view.
 */
export function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const startedRef = useRef(false)

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return
      if (typeof IntersectionObserver === 'undefined') {
        setCount(target)
        return
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true
            const start = Date.now()
            const tick = () => {
              const elapsed = Date.now() - start
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              setCount(Math.round(eased * target))
              if (progress < 1) {
                requestAnimationFrame(tick)
              }
            }
            requestAnimationFrame(tick)
            observer.unobserve(node)
          }
        },
        { threshold: 0.2 }
      )

      observer.observe(node)
    },
    [target, duration]
  )

  return { count, ref }
}
