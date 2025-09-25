'use client'

import { useEffect } from 'react'

interface ClientBodyProps {
  children: React.ReactNode
  className?: string
}

export default function ClientBody({ children, className }: ClientBodyProps) {
  useEffect(() => {
    // Remove atributos de extensões que podem causar problemas de hidratação
    const body = document.body
    
    // Lista de atributos comuns de extensões que causam problemas
    const problematicAttributes = [
      'cz-shortcut-listen',
      'data-new-gr-c-s-check-loaded',
      'data-gr-ext-installed',
      'spellcheck'
    ]
    
    problematicAttributes.forEach(attr => {
      if (body.hasAttribute(attr)) {
        body.removeAttribute(attr)
      }
    })
  }, [])

  return <div className={className}>{children}</div>
}
