/**
 * SkillBridge - Main Application Logic & View Controller
 * Coordinates Views, Modals, Filters, Matchmaking & Workspace Kanban.
 */

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // State & DOM Elements
  // =========================================================================
  const state = {
    currentView: "home",
    selectedCategory: "all",
    searchQuery: "",
    activeProjectId: window.store.getActiveProjectId() || "proj_1"
  };

  // View Sections
  const views = {
    home: document.getElementById("view-home"),
    explore: document.getElementById("view-explore"),
    leader: document.getElementById("view-leader"),
    workspace: document.getElementById("view-workspace"),
    profile: document.getElementById("view-profile")
  };

  // Nav Links
  const navTabs = {
    home: document.getElementById("tab-home"),
    explore: document.getElementById("tab-explore"),
    leader: document.getElementById("tab-leader"),
    workspace: document.getElementById("tab-workspace"),
    profile: document.getElementById("tab-profile")
  };

  // Modals
  const modals = {
    apply: document.getElementById("modal-apply"),
    post: document.getElementById("modal-post-project"),
    task: document.getElementById("modal-add-task")
  };

  // =========================================================================
  // Toast Notification System
  // =========================================================================
  function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    
    const iconSvg = type === "success" 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="toast-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // =========================================================================
  // Navigation & View Routing
  // =========================================================================
  function switchView(viewName) {
    if (!views[viewName]) return;

    // Toggle active view sections
    Object.keys(views).forEach(key => {
      views[key].classList.toggle("active", key === viewName);
    });

    // Toggle nav link highlight
    Object.keys(navTabs).forEach(key => {
      navTabs[key].classList.toggle("active", key === viewName);
    });

    state.currentView = viewName;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Re-render data depending on the newly opened view
    if (viewName === "home") renderHomeStats();
    if (viewName === "explore") renderExploreProjects();
    if (viewName === "leader") renderLeaderHub();
    if (viewName === "workspace") renderWorkspace();
    if (viewName === "profile") renderStudentProfile();
  }

  // Attach nav link events
  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-view");
      switchView(target);
    });
  });

  document.getElementById("nav-brand-btn").addEventListener("click", () => switchView("home"));
  document.getElementById("btn-hero-explore").addEventListener("click", () => switchView("explore"));
  document.getElementById("btn-hero-post").addEventListener("click", () => openModal("post"));
  document.getElementById("btn-hero-workspace").addEventListener("click", () => switchView("workspace"));
  document.getElementById("btn-post-from-explore").addEventListener("click", () => openModal("post"));
  document.getElementById("btn-post-project-nav").addEventListener("click", () => openModal("post"));
  document.getElementById("btn-open-new-proj-modal").addEventListener("click", () => openModal("post"));
  document.getElementById("btn-switch-persona").addEventListener("click", () => switchView("profile"));

  // =========================================================================
  // Modal Management
  // =========================================================================
  function openModal(modalKey) {
    if (modals[modalKey]) {
      modals[modalKey].classList.add("active");
    }
  }

  function closeModal(modalKey) {
    if (modals[modalKey]) {
      modals[modalKey].classList.remove("active");
    }
  }

  document.getElementById("btn-close-apply-modal").addEventListener("click", () => closeModal("apply"));
  document.getElementById("btn-cancel-apply").addEventListener("click", () => closeModal("apply"));

  document.getElementById("btn-close-post-modal").addEventListener("click", () => closeModal("post"));
  document.getElementById("btn-cancel-post").addEventListener("click", () => closeModal("post"));

  document.getElementById("btn-close-task-modal").addEventListener("click", () => closeModal("task"));
  document.getElementById("btn-cancel-task").addEventListener("click", () => closeModal("task"));

  // Close when clicking modal backdrop
  Object.values(modals).forEach(modalEl => {
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) modalEl.classList.remove("active");
    });
  });

  // =========================================================================
  // User Header & Persona Switcher
  // =========================================================================
  function updateNavUser() {
    const user = window.store.getCurrentUser();
    document.getElementById("nav-avatar").src = user.avatar;
    document.getElementById("nav-name").textContent = user.name;
    document.getElementById("nav-role").textContent = user.role;

    // Check pending applications for projects this user leads
    const myProjects = window.store.getProjects().filter(p => p.leaderId === user.id);
    const myProjectIds = myProjects.map(p => p.id);
    const pendingApps = window.store.getApplications().filter(
      a => myProjectIds.includes(a.projectId) && a.status === "pending"
    );

    const pendingBadge = document.getElementById("nav-pending-badge");
    if (pendingApps.length > 0) {
      pendingBadge.style.display = "inline-block";
      pendingBadge.textContent = `${pendingApps.length} New`;
    } else {
      pendingBadge.style.display = "none";
    }
  }

  // =========================================================================
  // Home View Stats
  // =========================================================================
  function renderHomeStats() {
    const projects = window.store.getProjects();
    const students = window.store.getStudents();
    const tasks = window.store.getTasks();

    let openRolesCount = 0;
    projects.forEach(p => {
      if (p.openRoles) {
        openRolesCount += p.openRoles.filter(r => !r.filled).length;
      }
    });

    document.getElementById("stat-projects-count").textContent = projects.length;
    document.getElementById("stat-students-count").textContent = students.length;
    document.getElementById("stat-roles-count").textContent = openRolesCount;
    document.getElementById("stat-tasks-count").textContent = tasks.length;
  }

  // =========================================================================
  // Explore Projects View
  // =========================================================================
  function renderExploreProjects() {
    const container = document.getElementById("projects-grid-container");
    const currentUser = window.store.getCurrentUser();
    let projects = window.store.getProjects();

    // Filter by domain
    if (state.selectedCategory !== "all") {
      projects = projects.filter(p => p.category.toLowerCase().includes(state.selectedCategory.toLowerCase()));
    }

    // Filter by search query
    if (state.searchQuery.trim() !== "") {
      const q = state.searchQuery.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.openRoles && p.openRoles.some(r => r.role.toLowerCase().includes(q) || r.skillNeeded.toLowerCase().includes(q)))
      );
    }

    if (projects.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:1rem; opacity:0.6;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h3 style="color:var(--text-main); margin-bottom:0.5rem;">No matching projects found</h3>
          <p>Try adjusting your search query or domain category filters.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = projects.map(proj => {
      const matchScore = window.store.calculateSkillFit(proj, currentUser);
      const isHighMatch = matchScore >= 75;
      const isLeader = proj.leaderId === currentUser.id;

      // Open Roles markup
      const rolesMarkup = (proj.openRoles && proj.openRoles.length > 0) ? `
        <div class="open-roles-box">
          <div class="roles-title">
            <span>Roles Needed</span>
            <span style="color:var(--secondary);">${proj.openRoles.filter(r => !r.filled).length} open</span>
          </div>
          <div class="role-items-list">
            ${proj.openRoles.map(r => `
              <div class="role-item-pill">
                <span class="role-name-text">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ${r.role}
                </span>
                <span class="${r.filled ? 'role-status-filled' : 'role-status-open'}">
                  ${r.filled ? 'Filled' : r.skillNeeded}
                </span>
              </div>
            `).join("")}
          </div>
        </div>
      ` : '';

      // Tags markup
      const tagsMarkup = (proj.tags || []).map(t => `<span class="tag-badge">#${t}</span>`).join("");

      return `
        <div class="project-card" data-project-id="${proj.id}">
          <div class="project-card-header">
            <div>
              <div class="project-meta-category">${proj.category}</div>
              <h3 class="project-title">${proj.title}</h3>
            </div>
            <div class="match-badge ${isHighMatch ? 'high' : 'medium'}" title="Complementary skill fit with your profile">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              ${matchScore}% Match
            </div>
          </div>

          <p class="project-tagline">${proj.tagline}</p>

          <div class="project-tags-row">
            ${tagsMarkup}
          </div>

          ${rolesMarkup}

          <div class="project-card-footer">
            <div class="leader-identity">
              <img src="${proj.leaderAvatar}" alt="${proj.leaderName}" class="leader-avatar">
              <div>
                <div class="leader-name">${proj.leaderName}</div>
                <div class="leader-label">${isLeader ? 'You (Project Lead)' : 'Lead Student'}</div>
              </div>
            </div>

            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-secondary btn-sm btn-open-workspace" data-project-id="${proj.id}" title="Open Task Board">
                Workspace
              </button>
              ${!isLeader ? `
                <button class="btn btn-primary btn-sm btn-apply-trigger" data-project-id="${proj.id}">
                  Apply
                </button>
              ` : `
                <span class="badge-tag" style="background:rgba(99,102,241,0.2); color:#a5b4fc; align-self:center;">Leading</span>
              `}
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Attach Event Listeners to rendered cards
    container.querySelectorAll(".btn-open-workspace").forEach(btn => {
      btn.addEventListener("click", () => {
        const pId = btn.getAttribute("data-project-id");
        window.store.setActiveProjectId(pId);
        state.activeProjectId = pId;
        switchView("workspace");
      });
    });

    container.querySelectorAll(".btn-apply-trigger").forEach(btn => {
      btn.addEventListener("click", () => {
        const pId = btn.getAttribute("data-project-id");
        openApplyModal(pId);
      });
    });
  }

  // Category filter clicks
  document.querySelectorAll("#category-filter-container .filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll("#category-filter-container .filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.selectedCategory = pill.getAttribute("data-category");
      renderExploreProjects();
    });
  });

  // Search input with debounce
  let searchTimer;
  document.getElementById("project-search-input").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.searchQuery = e.target.value;
      renderExploreProjects();
    }, 250);
  });

  // =========================================================================
  // Application Modal Workflow
  // =========================================================================
  function openApplyModal(projectId) {
    const project = window.store.getProjectById(projectId);
    if (!project) return;

    document.getElementById("apply-modal-project-title").textContent = `Applying to: ${project.title}`;
    document.getElementById("apply-project-id").value = project.id;

    const roleSelect = document.getElementById("apply-role-select");
    const openRoles = (project.openRoles || []).filter(r => !r.filled);

    if (openRoles.length > 0) {
      roleSelect.innerHTML = openRoles.map(r => `<option value="${r.role}">${r.role} (${r.skillNeeded})</option>`).join("");
    } else {
      roleSelect.innerHTML = `<option value="Contributor">General Technical Contributor</option>`;
    }

    const currentUser = window.store.getCurrentUser();
    document.getElementById("apply-pitch-msg").value = `Hi ${project.leaderName}! I'm skilled in ${currentUser.skills.map(s => s.name).join(", ")}. I'm excited about this project and would love to contribute.`;
    document.getElementById("apply-portfolio-url").value = currentUser.github ? `https://${currentUser.github}` : "";

    openModal("apply");
  }

  document.getElementById("form-apply").addEventListener("submit", (e) => {
    e.preventDefault();
    const projectId = document.getElementById("apply-project-id").value;
    const project = window.store.getProjectById(projectId);
    const appliedRole = document.getElementById("apply-role-select").value;
    const message = document.getElementById("apply-pitch-msg").value;
    const portfolioUrl = document.getElementById("apply-portfolio-url").value;

    const result = window.store.applyToProject({
      projectId,
      projectTitle: project.title,
      appliedRole,
      message,
      portfolioUrl
    });

    closeModal("apply");

    if (result.success) {
      showToast(`Application sent to ${project.leaderName}!`);
      updateNavUser();
      renderExploreProjects();
    } else {
      showToast(result.message, "error");
    }
  });

  // =========================================================================
  // Post New Project Workflow
  // =========================================================================
  document.getElementById("form-post-project").addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("post-title").value.trim();
    const tagline = document.getElementById("post-tagline").value.trim();
    const category = document.getElementById("post-category").value;
    const deadline = document.getElementById("post-deadline").value;
    const description = document.getElementById("post-description").value.trim();
    const role1 = document.getElementById("post-needed-role-1").value.trim();
    const role2 = document.getElementById("post-needed-role-2").value.trim();
    const tagsRaw = document.getElementById("post-tags").value.trim();

    const openRoles = [];
    if (role1) {
      const parts = role1.split("(");
      openRoles.push({
        role: parts[0].trim(),
        skillNeeded: parts[1] ? parts[1].replace(")", "").trim() : "Core Skill",
        filled: false,
        applicantsCount: 0
      });
    }
    if (role2) {
      const parts = role2.split("(");
      openRoles.push({
        role: parts[0].trim(),
        skillNeeded: parts[1] ? parts[1].replace(")", "").trim() : "Core Skill",
        filled: false,
        applicantsCount: 0
      });
    }

    const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : ["MinorProject"];

    const newProject = window.store.createProject({
      title,
      tagline,
      category,
      deadline,
      description,
      openRoles,
      tags
    });

    closeModal("post");
    document.getElementById("form-post-project").reset();
    showToast(`Project "${newProject.title}" published!`);

    state.activeProjectId = newProject.id;
    updateNavUser();
    renderHomeStats();
    renderExploreProjects();
    renderLeaderHub();
    switchView("workspace");
  });

  // =========================================================================
  // Team Leader Hub
  // =========================================================================
  function renderLeaderHub() {
    const currentUser = window.store.getCurrentUser();
    const myProjects = window.store.getProjects().filter(p => p.leaderId === currentUser.id);
    const myProjectIds = myProjects.map(p => p.id);

    // Filter incoming applications for projects led by current user
    const applications = window.store.getApplications().filter(a => myProjectIds.includes(a.projectId));
    const appsListContainer = document.getElementById("applications-list-container");
    const appsCountBadge = document.getElementById("hub-apps-count");

    const pendingApps = applications.filter(a => a.status === "pending");
    appsCountBadge.textContent = `${pendingApps.length} Pending`;

    if (applications.length === 0) {
      appsListContainer.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:0.75rem; opacity:0.6;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
          <p style="font-weight:600; color:var(--text-main); margin-bottom:0.25rem;">No Applications Yet</p>
          <p style="font-size:0.82rem;">When students apply to your open project roles, their proposals will appear here for review.</p>
        </div>
      `;
    } else {
      appsListContainer.innerHTML = applications.map(app => {
        const isPending = app.status === "pending";
        return `
          <div class="application-card" data-app-id="${app.id}">
            <div class="app-card-top">
              <div class="app-applicant-profile">
                <img src="${app.applicantAvatar}" alt="${app.applicantName}" class="applicant-avatar">
                <div>
                  <div class="applicant-name">${app.applicantName}</div>
                  <div class="applied-role-pill">Applied for: ${app.appliedRole}</div>
                </div>
              </div>
              <span class="app-status-badge ${app.status}">${app.status}</span>
            </div>

            <div class="app-project-target">Project: <strong>${app.projectTitle}</strong> &bull; Applied: ${app.appliedDate}</div>

            <div class="app-message-box">
              &ldquo;${app.message}&rdquo;
            </div>

            <div class="app-actions-row">
              ${app.portfolioUrl ? `
                <a href="${app.portfolioUrl}" target="_blank" class="social-link-btn" style="font-size:0.75rem;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  View Work/Portfolio
                </a>
              ` : `<span></span>`}

              ${isPending ? `
                <div style="display:flex; gap:0.5rem;">
                  <button class="btn btn-secondary btn-sm btn-reject-app" data-app-id="${app.id}">
                    Decline
                  </button>
                  <button class="btn btn-primary btn-sm btn-accept-app" data-app-id="${app.id}">
                    Accept to Team
                  </button>
                </div>
              ` : `
                <span style="font-size:0.8rem; color:var(--text-dim);">Processed</span>
              `}
            </div>
          </div>
        `;
      }).join("");

      // App approval/rejection listeners
      appsListContainer.querySelectorAll(".btn-accept-app").forEach(btn => {
        btn.addEventListener("click", () => {
          const appId = btn.getAttribute("data-app-id");
          window.store.updateApplicationStatus(appId, "accepted");
          showToast("Teammate accepted! Added to project team.");
          renderLeaderHub();
          updateNavUser();
          renderExploreProjects();
        });
      });

      appsListContainer.querySelectorAll(".btn-reject-app").forEach(btn => {
        btn.addEventListener("click", () => {
          const appId = btn.getAttribute("data-app-id");
          window.store.updateApplicationStatus(appId, "rejected");
          showToast("Application marked as declined.", "info");
          renderLeaderHub();
          updateNavUser();
        });
      });
    }

    // Render My Led Projects
    const myProjContainer = document.getElementById("my-projects-list-container");
    if (myProjects.length === 0) {
      myProjContainer.innerHTML = `
        <div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.88rem;">
          You haven't posted any projects yet. Use the button below to pitch your first idea!
        </div>
      `;
    } else {
      myProjContainer.innerHTML = myProjects.map(proj => {
        return `
          <div class="my-proj-item">
            <div class="my-proj-head">
              <div>
                <div class="my-proj-title">${proj.title}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${proj.category} &bull; Deadline: ${proj.deadline}</div>
              </div>
              <button class="btn btn-secondary btn-sm btn-hub-workspace" data-project-id="${proj.id}">
                Workspace
              </button>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-dim); margin-bottom:0.2rem;">
                <span>Sprint Progress</span>
                <span>${proj.progress}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${proj.progress}%;"></div>
              </div>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.75rem; color:var(--text-muted);">
              <span>Team size: <strong>${(proj.teamMembers || []).length} members</strong></span>
              <span>Open roles: <strong>${(proj.openRoles || []).filter(r => !r.filled).length} open</strong></span>
            </div>
          </div>
        `;
      }).join("");

      myProjContainer.querySelectorAll(".btn-hub-workspace").forEach(btn => {
        btn.addEventListener("click", () => {
          const pId = btn.getAttribute("data-project-id");
          window.store.setActiveProjectId(pId);
          state.activeProjectId = pId;
          switchView("workspace");
        });
      });
    }
  }

  // =========================================================================
  // Project Workspace & Kanban Board
  // =========================================================================
  function renderWorkspace() {
    const projects = window.store.getProjects();
    if (projects.length === 0) return;

    // Check if active project still exists
    let activeProject = window.store.getProjectById(state.activeProjectId);
    if (!activeProject) {
      activeProject = projects[0];
      state.activeProjectId = activeProject.id;
      window.store.setActiveProjectId(activeProject.id);
    }

    // Populate Project Switcher Select
    const projSelect = document.getElementById("workspace-project-select");
    projSelect.innerHTML = projects.map(p => 
      `<option value="${p.id}" ${p.id === activeProject.id ? 'selected' : ''}>${p.title}</option>`
    ).join("");

    // Workspace Header info
    document.getElementById("workspace-title").textContent = activeProject.title;
    document.getElementById("workspace-tagline").textContent = activeProject.tagline;

    // Team Avatars
    const avatarsRow = document.getElementById("workspace-team-avatars-row");
    const team = activeProject.teamMembers || [];
    avatarsRow.innerHTML = team.map(m => 
      `<img src="${m.avatar}" alt="${m.name}" title="${m.name} (${m.role})">`
    ).join("");

    // Render Tasks into Columns
    const tasks = window.store.getTasks(activeProject.id);
    const cols = {
      todo: document.getElementById("col-body-todo"),
      inprogress: document.getElementById("col-body-inprogress"),
      review: document.getElementById("col-body-review"),
      done: document.getElementById("col-body-done")
    };

    // Reset columns
    Object.values(cols).forEach(col => col.innerHTML = "");

    const counts = { todo: 0, inprogress: 0, review: 0, done: 0 };

    tasks.forEach(task => {
      const statusKey = task.status || "todo";
      if (counts[statusKey] !== undefined) counts[statusKey]++;

      const card = document.createElement("div");
      card.className = "task-card";
      card.draggable = true;
      card.dataset.taskId = task.id;

      card.innerHTML = `
        <span class="task-priority-badge priority-${task.priority}">${task.priority}</span>
        <h4 class="task-card-title">${task.title}</h4>
        ${task.description ? `<p class="task-card-desc">${task.description}</p>` : ''}
        <div class="task-card-foot">
          <div class="task-assignee">
            <img src="${task.assigneeAvatar}" alt="${task.assigneeName}">
            <span>${task.assigneeName}</span>
          </div>

          <div style="display:flex; align-items:center; gap:0.35rem;">
            <select class="task-move-select" data-task-id="${task.id}" title="Move status">
              <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
              <option value="inprogress" ${task.status === 'inprogress' ? 'selected' : ''}>In Progress</option>
              <option value="review" ${task.status === 'review' ? 'selected' : ''}>Review</option>
              <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
            </select>
            <button class="btn btn-secondary btn-icon btn-sm btn-delete-task" data-task-id="${task.id}" title="Delete task" style="width:24px; height:24px; font-size:0.7rem; border-radius:4px;">
              &times;
            </button>
          </div>
        </div>
      `;

      // Drag and drop event listeners
      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.id);
        card.style.opacity = "0.5";
      });
      card.addEventListener("dragend", () => {
        card.style.opacity = "1";
      });

      if (cols[statusKey]) {
        cols[statusKey].appendChild(card);
      }
    });

    // Update column counters
    document.getElementById("count-todo").textContent = counts.todo;
    document.getElementById("count-inprogress").textContent = counts.inprogress;
    document.getElementById("count-review").textContent = counts.review;
    document.getElementById("count-done").textContent = counts.done;

    // Attach task move select & delete listeners
    document.querySelectorAll(".task-move-select").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const taskId = sel.getAttribute("data-task-id");
        const newStatus = e.target.value;
        window.store.updateTaskStatus(taskId, newStatus);
        renderWorkspace();
        showToast(`Task moved to ${newStatus}`);
      });
    });

    document.querySelectorAll(".btn-delete-task").forEach(btn => {
      btn.addEventListener("click", () => {
        const taskId = btn.getAttribute("data-task-id");
        window.store.deleteTask(taskId);
        renderWorkspace();
        showToast("Task removed from board");
      });
    });
  }

  // Handle Drag & Drop across columns
  document.querySelectorAll(".kanban-column").forEach(col => {
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
      col.style.background = "rgba(99, 102, 241, 0.1)";
    });

    col.addEventListener("dragleave", () => {
      col.style.background = "";
    });

    col.addEventListener("drop", (e) => {
      e.preventDefault();
      col.style.background = "";
      const taskId = e.dataTransfer.getData("text/plain");
      const targetStatus = col.getAttribute("data-status");
      if (taskId && targetStatus) {
        window.store.updateTaskStatus(taskId, targetStatus);
        renderWorkspace();
        showToast(`Task moved to ${targetStatus}`);
      }
    });
  });

  // Switch active project in workspace
  document.getElementById("workspace-project-select").addEventListener("change", (e) => {
    const pId = e.target.value;
    state.activeProjectId = pId;
    window.store.setActiveProjectId(pId);
    renderWorkspace();
  });

  // Open Add Task Modal
  document.getElementById("btn-add-task-modal").addEventListener("click", () => {
    const activeProject = window.store.getProjectById(state.activeProjectId);
    if (!activeProject) return;

    const assigneeSelect = document.getElementById("task-assignee");
    const team = activeProject.teamMembers || [];
    assigneeSelect.innerHTML = team.map(m => `<option value="${m.name}" data-avatar="${m.avatar}">${m.name} (${m.role})</option>`).join("");
    assigneeSelect.innerHTML += `<option value="Unassigned" data-avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80">Unassigned</option>`;

    document.getElementById("task-duedate").value = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
    openModal("task");
  });

  // Submit Add Task Modal
  document.getElementById("form-add-task").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-description").value.trim();
    const status = document.getElementById("task-status").value;
    const priority = document.getElementById("task-priority").value;
    const assigneeSelect = document.getElementById("task-assignee");
    const assigneeName = assigneeSelect.value;
    const selectedOption = assigneeSelect.options[assigneeSelect.selectedIndex];
    const assigneeAvatar = selectedOption ? selectedOption.getAttribute("data-avatar") : "";
    const dueDate = document.getElementById("task-duedate").value;

    window.store.createTask({
      projectId: state.activeProjectId,
      title,
      description,
      status,
      priority,
      assigneeName,
      assigneeAvatar,
      dueDate
    });

    closeModal("task");
    document.getElementById("form-add-task").reset();
    showToast("Sprint task created!");
    renderWorkspace();
    renderHomeStats();
  });

  // =========================================================================
  // Student Profile & Persona Switcher
  // =========================================================================
  function renderStudentProfile() {
    const user = window.store.getCurrentUser();
    const students = window.store.getStudents();

    document.getElementById("profile-avatar").src = user.avatar;
    document.getElementById("profile-name").textContent = user.name;
    document.getElementById("profile-role").textContent = user.role;
    document.getElementById("profile-uni").textContent = `${user.university} &bull; ${user.degree || 'Student'}`;
    document.getElementById("profile-bio").textContent = user.bio || "Enthusiastic student builder ready to solve real problems and ship impactful projects.";

    // Social links
    const ghLink = document.getElementById("profile-github");
    const inLink = document.getElementById("profile-linkedin");
    ghLink.href = user.github ? `https://${user.github}` : "#";
    inLink.href = user.linkedin ? `https://${user.linkedin}` : "#";

    // Skills breakdown bars
    const skillsContainer = document.getElementById("profile-skills-list");
    skillsContainer.innerHTML = (user.skills || []).map(skill => {
      const name = typeof skill === 'string' ? skill : skill.name;
      const level = typeof skill === 'object' && skill.level ? skill.level : 85;
      return `
        <div class="skill-bar-row">
          <div class="skill-bar-info">
            <span class="skill-bar-name">${name}</span>
            <span class="skill-bar-val">${level}% Proficiency</span>
          </div>
          <div class="skill-bar-track">
            <div class="skill-bar-progress" style="width: ${level}%;"></div>
          </div>
        </div>
      `;
    }).join("");

    // Looking for complementary roles
    const lookingRow = document.getElementById("profile-looking-for-row");
    lookingRow.innerHTML = (user.lookingFor || ["Designers", "Data Scientists", "Hardware Devs"]).map(
      item => `<span class="tag-badge" style="background:rgba(99,102,241,0.15); color:#a5b4fc; border-color:rgba(99,102,241,0.3); font-size:0.85rem; padding:0.3rem 0.75rem;">+ ${item}</span>`
    ).join("");

    // Stats
    const stats = user.stats || { projectsLed: 2, projectsJoined: 3, tasksCompleted: 24, reputationScore: 98 };
    document.getElementById("stat-led-val").textContent = stats.projectsLed;
    document.getElementById("stat-joined-val").textContent = stats.projectsJoined;
    document.getElementById("stat-tasks-done-val").textContent = stats.tasksCompleted;
    document.getElementById("stat-reputation-val").textContent = `${stats.reputationScore}%`;

    // Persona picker list
    const pickerList = document.getElementById("persona-picker-list");
    pickerList.innerHTML = students.map(student => {
      const isCurrent = student.id === user.id;
      return `
        <button class="btn btn-secondary btn-sm btn-switch-user" data-student-id="${student.id}" style="justify-content:flex-start; text-align:left; gap:0.75rem; ${isCurrent ? 'border-color:var(--primary); background:rgba(99,102,241,0.15);' : ''}">
          <img src="${student.avatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover;">
          <div style="line-height:1.2; flex:1;">
            <div style="font-weight:600; font-size:0.82rem; color:var(--text-main);">${student.name} ${isCurrent ? '(Active)' : ''}</div>
            <div style="font-size:0.7rem; color:var(--text-muted);">${student.role}</div>
          </div>
        </button>
      `;
    }).join("");

    pickerList.querySelectorAll(".btn-switch-user").forEach(btn => {
      btn.addEventListener("click", () => {
        const sId = btn.getAttribute("data-student-id");
        window.store.switchUser(sId);
        showToast("Switched student persona!");
        updateNavUser();
        renderStudentProfile();
        renderHomeStats();
        renderLeaderHub();
        renderExploreProjects();
      });
    });
  }

  // =========================================================================
  // Initialize Application
  // =========================================================================
  updateNavUser();
  renderHomeStats();
  renderExploreProjects();
  renderLeaderHub();
  renderWorkspace();
  renderStudentProfile();
});
