'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

// Define the shape of the context
interface ProjectContextType {
    project: { name: string; description: string };
    setProject: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>;
    loading: boolean;
    isConnectToGit: boolean;
    setIsConnectToGit: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Context provider component
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [project, setProject] = useState<{ name: string; description: string }>({ name: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [isConnectToGit, setIsConnectToGit] = useState(true);
    const { uuid } = useParams();

    // Fetch project data when layout is mounted
    useEffect(() => {
        if (!uuid) return; // Prevent fetching if no ID is present

        const fetchProject = async () => {
            try {
                const { data } = await axios.get(`/api/projects/${uuid}`);
                setProject({ name: data.name, description: data.description });
            } catch {
                console.error('Failed to fetch project data');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [uuid]);

    return (
        <ProjectContext.Provider value={{ project, setProject, loading, isConnectToGit, setIsConnectToGit }}>
            {children}
        </ProjectContext.Provider>
    );
};

// Custom hook to use the ProjectContext
export const useProjectContext = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProjectContext must be used within a ProjectProvider');
    }
    return context;
};