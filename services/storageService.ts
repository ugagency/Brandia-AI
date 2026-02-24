
import { Project } from "../types";
import { supabase } from "./supabase";

/**
 * Este serviço agora utiliza o banco de dados real do Supabase.
 */
export const storageService = {
  async saveProject(email: string, project: Project): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .upsert({
        id: project.id, // Se o ID for UUID ou string única
        user_email: email,
        project_name: project.projectName,
        profile: project.profile,
        plan: project.plan,
        created_at: project.createdAt
      });

    if (error) {
      console.error("Erro ao salvar projeto no Supabase:", error);
      throw error;
    }
  },

  async getProjects(email: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar projetos no Supabase:", error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      projectName: item.project_name,
      profile: item.profile,
      plan: item.plan,
      createdAt: item.created_at
    }));
  },

  async deleteProject(email: string, projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_email', email);

    if (error) {
      console.error("Erro ao excluir projeto no Supabase:", error);
      throw error;
    }
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
