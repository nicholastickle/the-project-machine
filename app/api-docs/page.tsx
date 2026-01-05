'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Project Machine API Documentation</h1>
          <p className="text-muted-foreground mt-2">
            OpenAPI/Swagger documentation for all API endpoints
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <SwaggerUI url="/api/docs" />
        </div>
      </div>
    </div>
  )
}
