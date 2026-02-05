
import { Project } from "../types";

/**
 * Este serviço simula uma API de banco de dados.
 * Para conectar um "banco real", você substituiria as chamadas de localStorage
 * por fetch() ou chamadas ao SDK do Supabase/Firebase.
 */

export const storageService = {
  async saveProject(email: string, project: Project): Promise<void> {
    const key = `stratyx_projects_v1_${email}`;
    const projects = await this.getProjects(email);
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index > -1) {
      projects[index] = project;
    } else {
      projects.unshift(project);
    }
    
    localStorage.setItem(key, JSON.stringify(projects));
    return Promise.resolve();
  },

  async getProjects(email: string): Promise<Project[]> {
    const key = `stratyx_projects_v1_${email}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  },

  async deleteProject(email: string, projectId: string): Promise<void> {
    const key = `stratyx_projects_v1_${email}`;
    const projects = await this.getProjects(email);
    const updated = projects.filter(p => p.id !== projectId);
    localStorage.setItem(key, JSON.stringify(updated));
    return Promise.resolve();
  },

  exportPlanAsJSON(project: Project) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `plan-stratyx-${project.projectName.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
};
