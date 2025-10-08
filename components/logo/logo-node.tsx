import { memo } from 'react';

import { ProjectMachineLogo } from '@/components/logo/project-machine-logo';

interface LogoNodeProps {
    id?: string;
    data?: {
        label?: string;
        value?: string;
    };
}

function LogoNode({ id, data }: LogoNodeProps) {
    return (
        <div className="flex items-center justify-center p-4 bg-background backdrop-blur-sm rounded-full opacity-15">
            <ProjectMachineLogo
                size="xxl"
                showText={false}
                href=""
                className="opacity-30"
            />
        </div>
    );
}

export default memo(LogoNode);