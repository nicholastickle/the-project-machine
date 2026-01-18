declare module 'swagger-ui-react' {
  import { ReactNode } from 'react'
  
  interface SwaggerUIProps {
    url?: string
    spec?: Record<string, any>
    onComplete?: (system: any) => void
    [key: string]: any
  }
  
  export default function SwaggerUI(props: SwaggerUIProps): ReactNode
}
