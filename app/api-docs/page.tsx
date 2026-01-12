'use client'

import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(
  () => import('swagger-ui-react'),
  { ssr: false }
) as any

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: '#111' }}>
            Project Machine API Documentation
          </h1>
          <p className="mt-2" style={{ color: '#666' }}>
            OpenAPI/Swagger documentation for all API endpoints
          </p>
        </div>
        <div className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: 'white' }}>
          <SwaggerUI 
            url="/api/docs"
            defaultModelsExpandDepth={1}
            defaultModelExpandDepth={1}
          />
        </div>
      </div>
    </div>
  )
}
