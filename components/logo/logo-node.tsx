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
        <div className="flex items-center justify-center p-8 bg-background/50 backdrop-blur-md rounded-full opacity-20 hover:opacity-30 transition-opacity duration-500">
            <ProjectMachineLogo
                size="xxl"
                showText={false}
                href=""
                className="opacity-40"
            />
        </div>
    );
}

export default memo(LogoNode);
