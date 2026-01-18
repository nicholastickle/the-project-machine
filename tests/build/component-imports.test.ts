import { describe, it, expect } from 'vitest'

describe('Component Imports', () => {
  describe('Sidebar Components', () => {
    it('should import sidebar', async () => {
      await expect(import('@/components/sidebar/sidebar')).resolves.toBeDefined()
    })

    it('should import sidebar-projects-dropdown', async () => {
      await expect(import('@/components/sidebar/sidebar-projects-dropdown')).resolves.toBeDefined()
    })

    it('should import sidebar-projects-new', async () => {
      await expect(import('@/components/sidebar/sidebar-projects-new')).resolves.toBeDefined()
    })

    it('should import sidebar-projects-options', async () => {
      await expect(import('@/components/sidebar/sidebar-projects-options')).resolves.toBeDefined()
    })

    it('should import sidebar-users', async () => {
      await expect(import('@/components/sidebar/sidebar-users')).resolves.toBeDefined()
    })

    it('should import sidebar-help-button', async () => {
      await expect(import('@/components/sidebar/sidebar-help-button')).resolves.toBeDefined()
    })

    it('should import sidebar-help-options', async () => {
      await expect(import('@/components/sidebar/sidebar-help-options')).resolves.toBeDefined()
    })

    it('should import sidebar-trigger', async () => {
      await expect(import('@/components/sidebar/sidebar-trigger')).resolves.toBeDefined()
    })

    it('should import sidebar-theme-changer', async () => {
      await expect(import('@/components/sidebar/sidebar-theme-changer')).resolves.toBeDefined()
    })
  })

  describe('Canvas Components', () => {
    it('should import canvas', async () => {
      await expect(import('@/components/canvas/canvas')).resolves.toBeDefined()
    })

    it('should import background', async () => {
      await expect(import('@/components/canvas/background')).resolves.toBeDefined()
    })

    it('should import initial-nodes', async () => {
      await expect(import('@/components/canvas/initial-nodes')).resolves.toBeDefined()
    })

    it('should import initial-edges', async () => {
      await expect(import('@/components/canvas/initial-edges')).resolves.toBeDefined()
    })
  })

  describe('Node Components', () => {
    it('should import task-card-node', async () => {
      await expect(import('@/components/task-card-node/task-card-node')).resolves.toBeDefined()
    })
  })

  describe('Toolbar Components', () => {
    it('should import canvas-toolbar', async () => {
      await expect(import('@/components/toolbar/canvas-toolbar')).resolves.toBeDefined()
    })
  })

  describe('Task Book Components', () => {
    it('should import task-book', async () => {
      await expect(import('@/components/task-book/task-book')).resolves.toBeDefined()
    })

    it('should import task-book-dialog', async () => {
      await expect(import('@/components/task-book/task-book-dialog')).resolves.toBeDefined()
    })

    it('should import task-book-icon', async () => {
      await expect(import('@/components/task-book/task-book-icon')).resolves.toBeDefined()
    })
  })

  describe('Export Components', () => {
    it('should import export-buttons', async () => {
      await expect(import('@/components/export/export-buttons')).resolves.toBeDefined()
    })
  })

  describe('Navigation Controls', () => {
    it('should import minimap', async () => {
      await expect(import('@/components/navigation-controls/minimap')).resolves.toBeDefined()
    })

    it('should import nav-control-bar', async () => {
      await expect(import('@/components/navigation-controls/nav-control-bar')).resolves.toBeDefined()
    })

    it('should import nav-toggle', async () => {
      await expect(import('@/components/navigation-controls/nav-toggle')).resolves.toBeDefined()
    })
  })

  describe('Landing Page Components', () => {
    it('should import header', async () => {
      await expect(import('@/components/landing/header')).resolves.toBeDefined()
    })

    it('should import hero-section', async () => {
      await expect(import('@/components/landing/hero-section')).resolves.toBeDefined()
    })

    it('should import about-section', async () => {
      await expect(import('@/components/landing/about-section')).resolves.toBeDefined()
    })

    it('should import cta-section', async () => {
      await expect(import('@/components/landing/cta-section')).resolves.toBeDefined()
    })

    it('should import footer-section', async () => {
      await expect(import('@/components/landing/footer-section')).resolves.toBeDefined()
    })

    it('should import dashboard-preview', async () => {
      await expect(import('@/components/landing/dashboard-preview')).resolves.toBeDefined()
    })

    it('should import typewriter-subheadline', async () => {
      await expect(import('@/components/landing/typewriter-subheadline')).resolves.toBeDefined()
    })
  })

  describe('Chat Components', () => {
    it('should import chat-panel', async () => {
      await expect(import('@/components/chat/chat-panel')).resolves.toBeDefined()
    })
  })

  describe('Theme Components', () => {
    it('should import theme-provider', async () => {
      await expect(import('@/components/theme-provider/theme-provider')).resolves.toBeDefined()
    })

    it('should import theme-toggle', async () => {
      await expect(import('@/components/theme-provider/theme-toggle')).resolves.toBeDefined()
    })
  })
})

describe('Store Imports', () => {
  it('should import flow-store', async () => {
    await expect(import('@/stores/flow-store')).resolves.toBeDefined()
  })

  it('should import taskbook-store', async () => {
    await expect(import('@/stores/taskbook-store')).resolves.toBeDefined()
  })

  it('should import types', async () => {
    await expect(import('@/stores/types')).resolves.toBeDefined()
  })
})

describe('Hook Imports', () => {
  it('should import use-mobile', async () => {
    await expect(import('@/hooks/use-mobile')).resolves.toBeDefined()
  })
})

describe('Lib Imports', () => {
  it('should import utils', async () => {
    await expect(import('@/lib/utils')).resolves.toBeDefined()
  })
})

describe('App Pages', () => {
  it('should import canvas page', async () => {
    await expect(import('@/app/canvas/page')).resolves.toBeDefined()
  })
})
