/**
 * SkillBridge - Data Store & LocalStorage Manager
 * Handles state persistence, queries, updates, and matchmaking logic.
 */

const STORAGE_KEYS = {
  CURRENT_USER: "skillbridge_current_user",
  STUDENTS: "skillbridge_students",
  PROJECTS: "skillbridge_projects",
  APPLICATIONS: "skillbridge_applications",
  TASKS: "skillbridge_tasks",
  ACTIVE_PROJECT_ID: "skillbridge_active_project_id"
};

class SkillBridgeStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      this.resetToDefaults();
    }
  }

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_DATA.currentUser));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(SEED_DATA.students));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_DATA.projects));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_DATA.applications));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_DATA.tasks));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, "proj_1");
  }

  // --- CURRENT USER ---
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || SEED_DATA.currentUser;
    } catch {
      return SEED_DATA.currentUser;
    }
  }

  updateCurrentUser(userData) {
    const updated = { ...this.getCurrentUser(), ...userData };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
    return updated;
  }

  switchUser(studentId) {
    const students = this.getStudents();
    const target = students.find(s => s.id === studentId);
    if (target) {
      const currentUser = {
        ...this.getCurrentUser(),
        id: target.id,
        name: target.name,
        role: target.role,
        avatar: target.avatar,
        skills: target.skills.map((s, idx) => ({ name: s, category: "Tech", level: 80 - (idx * 5) })),
        lookingFor: ["Teammates", "Innovative Ideas"]
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      return currentUser;
    }
    return this.getCurrentUser();
  }

  // --- STUDENTS ---
  getStudents() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || SEED_DATA.students;
    } catch {
      return SEED_DATA.students;
    }
  }

  // --- PROJECTS ---
  getProjects() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS)) || SEED_DATA.projects;
    } catch {
      return SEED_DATA.projects;
    }
  }

  getProjectById(id) {
    const projects = this.getProjects();
    return projects.find(p => p.id === id) || null;
  }

  getActiveProjectId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID) || "proj_1";
  }

  setActiveProjectId(id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, id);
  }

  createProject(projectData) {
    const projects = this.getProjects();
    const currentUser = this.getCurrentUser();

    const newProject = {
      id: "proj_" + Date.now(),
      title: projectData.title,
      tagline: projectData.tagline,
      category: projectData.category || "General Tech",
      leaderId: currentUser.id,
      leaderName: currentUser.name,
      leaderAvatar: currentUser.avatar,
      status: "Recruiting",
      stage: projectData.stage || "Ideation",
      deadline: projectData.deadline || "2026-12-31",
      progress: 10,
      openRoles: projectData.openRoles || [],
      tags: projectData.tags || ["StudentProject"],
      description: projectData.description,
      teamMembers: [
        {
          id: currentUser.id,
          name: currentUser.name,
          role: "Team Leader",
          avatar: currentUser.avatar
        }
      ]
    };

    projects.unshift(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    
    // Set active workspace to this project
    this.setActiveProjectId(newProject.id);
    return newProject;
  }

  // --- COMPATIBILITY / SKILL MATCHMAKING ENGINE ---
  /**
   * Calculates a complementary skill fit score (0-100%) between student skills and project required roles
   */
  calculateSkillFit(project, user) {
    if (!project || !user) return 75;
    
    const userSkills = (user.skills || []).map(s => (typeof s === 'string' ? s : s.name).toLowerCase());
    const neededSkills = (project.openRoles || [])
      .filter(r => !r.filled)
      .map(r => `${r.role} ${r.skillNeeded}`.toLowerCase());

    if (neededSkills.length === 0) return 60;

    let matchPoints = 0;
    let totalChecks = 0;

    neededSkills.forEach(req => {
      totalChecks += 2;
      const directMatch = userSkills.some(skill => 
        req.includes(skill) || skill.includes(req.split(' ')[0])
      );
      if (directMatch) {
        matchPoints += 2;
      } else {
        // Complementary synergy check
        const isFrontendAndBackend = userSkills.some(s => s.includes("react") || s.includes("frontend")) && req.includes("backend");
        const isDesignAndFrontend = userSkills.some(s => s.includes("figma") || s.includes("design")) && req.includes("frontend");
        const isAIAndBackend = userSkills.some(s => s.includes("python") || s.includes("pytorch")) && req.includes("data");
        if (isFrontendAndBackend || isDesignAndFrontend || isAIAndBackend) {
          matchPoints += 1.5;
        } else {
          matchPoints += 0.8; // base baseline
        }
      }
    });

    const score = Math.min(98, Math.max(55, Math.round((matchPoints / (totalChecks || 1)) * 100)));
    return score;
  }

  // --- APPLICATIONS ---
  getApplications() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) || SEED_DATA.applications;
    } catch {
      return SEED_DATA.applications;
    }
  }

  applyToProject(applicationData) {
    const applications = this.getApplications();
    const currentUser = this.getCurrentUser();

    // Check if already applied
    const existing = applications.find(
      a => a.projectId === applicationData.projectId && a.applicantId === currentUser.id
    );

    if (existing) {
      return { success: false, message: "You have already applied for this project." };
    }

    const newApp = {
      id: "app_" + Date.now(),
      projectId: applicationData.projectId,
      projectTitle: applicationData.projectTitle,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantAvatar: currentUser.avatar,
      appliedRole: applicationData.appliedRole,
      message: applicationData.message,
      portfolioUrl: applicationData.portfolioUrl || currentUser.github || "",
      status: "pending",
      appliedDate: new Date().toISOString().split("T")[0]
    };

    applications.unshift(newApp);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    return { success: true, application: newApp };
  }

  updateApplicationStatus(appId, newStatus) {
    const applications = this.getApplications();
    const app = applications.find(a => a.id === appId);
    if (!app) return false;

    app.status = newStatus;
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));

    // If accepted, add applicant to project team members and update role filled status
    if (newStatus === "accepted") {
      const projects = this.getProjects();
      const project = projects.find(p => p.id === app.projectId);
      if (project) {
        // Add member if not already present
        const alreadyIn = project.teamMembers.some(m => m.id === app.applicantId);
        if (!alreadyIn) {
          project.teamMembers.push({
            id: app.applicantId,
            name: app.applicantName,
            role: app.appliedRole,
            avatar: app.applicantAvatar
          });
        }
        // Mark role filled if matching
        if (project.openRoles) {
          const roleMatch = project.openRoles.find(
            r => !r.filled && r.role.toLowerCase() === app.appliedRole.toLowerCase()
          );
          if (roleMatch) {
            roleMatch.filled = true;
          }
        }
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      }
    }
    return true;
  }

  // --- TASKS (WORKSPACE KANBAN) ---
  getTasks(projectId = null) {
    try {
      const allTasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || SEED_DATA.tasks;
      if (projectId) {
        return allTasks.filter(t => t.projectId === projectId);
      }
      return allTasks;
    } catch {
      return SEED_DATA.tasks;
    }
  }

  createTask(taskData) {
    const tasks = this.getTasks();
    const newTask = {
      id: "tsk_" + Date.now(),
      projectId: taskData.projectId,
      title: taskData.title,
      description: taskData.description || "",
      status: taskData.status || "todo",
      priority: taskData.priority || "medium",
      assigneeName: taskData.assigneeName || "Unassigned",
      assigneeAvatar: taskData.assigneeAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      dueDate: taskData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]
    };

    tasks.push(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return newTask;
  }

  updateTaskStatus(taskId, newStatus) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return task;
    }
    return null;
  }

  deleteTask(taskId) {
    let tasks = this.getTasks();
    tasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return true;
  }
}

// Global instance
window.store = new SkillBridgeStore();
