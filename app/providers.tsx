// =============================================================================
// APP PROVIDERS
// =============================================================================

'use client';

import { useEffect } from 'react';
import { USE_LOCAL_STORAGE } from '@/utils/env';
import { initializeLocalStorage } from '@/mock/initLocalStorage';
import { useLoadUser, useLoadProjects, useLoadProjectData } from '@/stores/hooks'

export function AppProviders({ children }: { children: React.ReactNode }) {
    // Initialize localStorage in development
    useEffect(() => {
        if (USE_LOCAL_STORAGE) {
            initializeLocalStorage();
        }
    }, []);

    // Load user, projects, and current project data
    useLoadUser();
    useLoadProjects();
    useLoadProjectData();

    return <>{children}</>;
}