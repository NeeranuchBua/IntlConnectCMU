import path from 'path';

export enum PlatformStructure {
    DataFolder = "data",
    TemplatesFolder = "templates",
    ProvidersFolder = "providers",
    DeploymentsFolder = "deployments",
    ProjectsFolder = "projects",
}

// Base paths
export const PlatformPaths = {
    BASE: process.cwd(),
    DATA: path.join(process.cwd(), PlatformStructure.DataFolder),

    TEMPLATES: path.join(process.cwd(), PlatformStructure.DataFolder, PlatformStructure.TemplatesFolder),
    PROVIDERS: path.join(process.cwd(), PlatformStructure.DataFolder, PlatformStructure.ProvidersFolder),
    DEPLOYMENTS: path.join(process.cwd(), PlatformStructure.DataFolder, PlatformStructure.DeploymentsFolder),
    PROJECTS: path.join(process.cwd(), PlatformStructure.DataFolder, PlatformStructure.ProjectsFolder),

    TEMPLATE: (templateName: string) => path.join(process.cwd(), PlatformStructure.DataFolder, PlatformStructure.TemplatesFolder, templateName),

    PROVIDER: (providerId: string) => path.join(process.cwd(), PlatformStructure.DataFolder, PlatformStructure.ProvidersFolder, providerId),

    DEPLOYMENT: (deploymentId: string) => path.join(process.cwd(), PlatformStructure.DataFolder, PlatformStructure.DeploymentsFolder, deploymentId),

    PROJECT: (projectUUID: string) => path.join(process.cwd(), PlatformStructure.DataFolder, PlatformStructure.ProjectsFolder, projectUUID),
};

export interface ProviderManifest {
    name: string;
    description: string;
    inputs: {
        name: string;
        type: string;
        required: boolean;
        description: string;
        default?: any;
    }[];
    outputs: {
        name: string;
        type: string;
        description: string;
    }[];
}