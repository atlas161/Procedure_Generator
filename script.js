/**
 * ==========================================================================
 * GÉNÉRATEUR DE PROCÉDURES IT - ARCHITECTURE ENTERPRISE v2.0
 * Solution technique complète avec versionning automatique et PDF professionnel
 * 
 * Architecture technique avancée :
 * - Version Management System avec semantic versioning
 * - PDF Generation Engine avec cartouche persistant
 * - Modal System pour la saisie utilisateur
 * - State Management avec persistence avancée
 * - Event-driven Architecture pour la scalabilité
 * ==========================================================================
 */

class VersionManager {
    constructor() {
        this.currentVersion = { major: 1, minor: 0, patch: 0 };
        this.versionHistory = [];
        this.loadVersionHistory();
    }

    /**
     * Génère la prochaine version automatiquement
     * @param {string} changeType - 'major', 'minor', 'patch'
     * @param {string} author - Nom de l'auteur
     * @param {string} comment - Commentaire de modification
     */
    generateNextVersion(changeType = 'patch', author, comment) {
        const previousVersion = { ...this.currentVersion };
        
        // Semantic versioning intelligent
        switch (changeType) {
            case 'major':
                this.currentVersion.major++;
                this.currentVersion.minor = 0;
                this.currentVersion.patch = 0;
                break;
            case 'minor':
                this.currentVersion.minor++;
                this.currentVersion.patch = 0;
                break;
            case 'patch':
            default:
                this.currentVersion.patch++;
                break;
        }

        const versionEntry = {
            version: this.getVersionString(),
            previousVersion: `${previousVersion.major}.${previousVersion.minor}.${previousVersion.patch}`,
            author: author,
            date: new Date().toLocaleDateString('fr-FR'),
            timestamp: new Date().toISOString(),
            comment: comment,
            changeType: changeType
        };

        this.versionHistory.push(versionEntry);
        this.saveVersionHistory();
        
        console.log(`🚀 Version ${this.getVersionString()} générée par ${author}`);
        return versionEntry;
    }

    getVersionString() {
        return `${this.currentVersion.major}.${this.currentVersion.minor}.${this.currentVersion.patch}`;
    }

    saveVersionHistory() {
        try {
            localStorage.setItem('procedure_version_history', JSON.stringify({
                currentVersion: this.currentVersion,
                history: this.versionHistory
            }));
        } catch (error) {
            console.warn('Erreur sauvegarde versioning:', error);
        }
    }

    loadVersionHistory() {
        try {
            const saved = localStorage.getItem('procedure_version_history');
            if (saved) {
                const data = JSON.parse(saved);
                this.currentVersion = data.currentVersion || this.currentVersion;
                this.versionHistory = data.history || [];
            }
        } catch (error) {
            console.warn('Erreur chargement versioning:', error);
        }
    }

    resetVersioning() {
        this.currentVersion = { major: 1, minor: 0, patch: 0 };
        this.versionHistory = [];
        this.saveVersionHistory();
    }

    generateVersionTable() {
        if (this.versionHistory.length === 0) {
            return '<p style="color: #8e8e93; font-style: italic;">Aucun historique de version disponible</p>';
        }

        const tableHTML = `
            <table class="version-table">
                <thead>
                    <tr>
                        <th>Version</th>
                        <th>Auteur</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Commentaire</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.versionHistory.slice().reverse().map(entry => `
                        <tr>
                            <td>
                                <span class="version-number">v${entry.version}</span>
                                ${entry.previousVersion ? `<br><small style="color: #8e8e93;">← v${entry.previousVersion}</small>` : ''}
                            </td>
                            <td class="version-author">${entry.author}</td>
                            <td class="version-date">${entry.date}</td>
                            <td>
                                <span style="background: ${this.getChangeTypeColor(entry.changeType)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">
                                    ${this.getChangeTypeLabel(entry.changeType)}
                                </span>
                            </td>
                            <td style="max-width: 200px; word-wrap: break-word;">${entry.comment}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        return tableHTML;
    }

    getChangeTypeColor(type) {
        switch (type) {
            case 'major': return '#ff3b30';
            case 'minor': return '#ff9500';
            case 'patch': return '#34c759';
            default: return '#007aff';
        }
    }

    getChangeTypeLabel(type) {
        switch (type) {
            case 'major': return 'MAJEURE';
            case 'minor': return 'MINEURE';
            case 'patch': return 'CORRECTION';
            default: return 'MODIFICATION';
        }
    }
}

class ModalManager {
    constructor() {
        this.createVersionModal();
    }

    createVersionModal() {
        const modalHTML = `
            <div class="version-modal" id="versionModal">
                <div class="version-modal-content">
                    <h3>
                        <i class="fas fa-code-branch"></i>
                        Nouvelle version de la procédure
                    </h3>
                    <form class="version-form" id="versionForm">
                        <div class="input-group">
                            <label>Auteur de la modification <span class="required">*</span></label>
                            <input type="text" id="versionAuthor" placeholder="Votre nom complet" required>
                        </div>
                        
                        <div class="input-group">
                            <label>Type de modification</label>
                            <select id="versionType">
                                <option value="patch">Correction/Amélioration mineure</option>
                                <option value="minor">Nouvelle fonctionnalité</option>
                                <option value="major">Refonte majeure</option>
                            </select>
                        </div>
                        
                        <div class="input-group">
                            <label>Commentaire de modification <span class="required">*</span></label>
                            <textarea id="versionComment" rows="3" placeholder="Décrivez les modifications apportées à cette version..." required></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-cancel" onclick="modalManager.hideVersionModal()">Annuler</button>
                            <button type="submit" class="btn btn-green">
                                <i class="fas fa-save"></i>
                                Créer la version
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupModalEvents();
    }

    setupModalEvents() {
        const form = document.getElementById('versionForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleVersionSubmit();
            });
        }

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideVersionModal();
            }
        });

        // Fermer en cliquant à l'extérieur
        document.getElementById('versionModal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('version-modal')) {
                this.hideVersionModal();
            }
        });
    }

    showVersionModal() {
        const modal = document.getElementById('versionModal');
        if (modal) {
            modal.classList.add('show');
            document.getElementById('versionAuthor')?.focus();
        }
    }

    hideVersionModal() {
        const modal = document.getElementById('versionModal');
        if (modal) {
            modal.classList.remove('show');
            this.clearForm();
        }
    }

    clearForm() {
        document.getElementById('versionAuthor').value = '';
        document.getElementById('versionType').value = 'patch';
        document.getElementById('versionComment').value = '';
    }

    handleVersionSubmit() {
        const author = document.getElementById('versionAuthor').value.trim();
        const changeType = document.getElementById('versionType').value;
        const comment = document.getElementById('versionComment').value.trim();

        if (!author || !comment) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Générer la nouvelle version
        const versionEntry = procedureGen.versionManager.generateNextVersion(changeType, author, comment);
        
        // Cacher la modal
        this.hideVersionModal();
        
        // Procéder à l'export
        this.proceedWithExport(versionEntry);
    }

    proceedWithExport(versionEntry) {
        // Mettre à jour la version dans les données
        const data = procedureGen.collectFormData();
        data.version = versionEntry.version;
        data.author = versionEntry.author;
        data.versionHistory = procedureGen.versionManager.versionHistory;
        
        // Générer le PDF avec la nouvelle version
        procedureGen.generatePDFWithVersion(data);
    }
}

class ProcedureGenerator {
    constructor() {
        // État de l'application
        this.currentData = {};
        this.stepCounter = 0;
        this.logoData = null;
        
        // Managers spécialisés
        this.versionManager = new VersionManager();
        
        // Configuration
        this.config = {
            maxImageSize: 2 * 1024 * 1024, // 2MB
            allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
            autoSaveInterval: 30000 // 30 secondes
        };
        
        this.init();
    }

    /**
     * Initialisation avec architecture modulaire
     */
    init() {
        this.setupEventListeners();
        this.renderInitialSteps();
        this.loadExampleData();
        this.startAutoSave();
        
        console.log('🚀 Générateur Enterprise v2.0 initialisé');
        console.log('📊 Modules: Version Management, Modal System, PDF Engine');
    }

    /**
     * Configuration des event listeners avec delegation pattern
     */
    setupEventListeners() {
        // File input pour l'import JSON
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileImport(e));
        }

        // Upload d'image avec support drag & drop
        this.setupImageUpload();
    }

    /**
     * Configuration avancée de l'upload d'image avec drag & drop
     */
    setupImageUpload() {
        const uploadArea = document.getElementById('imageUploadArea');
        const logoInput = document.getElementById('logoInput');
        
        if (!uploadArea || !logoInput) return;

        // Click pour sélectionner
        uploadArea.addEventListener('click', () => logoInput.click());
        
        // Drag & Drop moderne avec feedback visuel
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0]);
            }
        });
        
        // File input change
        logoInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        });
    }

    /**
     * Gestion intelligente de l'upload d'image avec validation
     */
    handleImageUpload(file) {
        // Validation du type
        if (!this.config.allowedImageTypes.includes(file.type)) {
            alert('Format non supporté. Utilisez JPG, PNG ou SVG.');
            return;
        }
        
        // Validation de la taille
        if (file.size > this.config.maxImageSize) {
            alert('Image trop volumineuse. Maximum 2MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.logoData = e.target.result;
            this.displayImagePreview(e.target.result);
            console.log('🖼️ Logo chargé avec succès');
        };
        
        reader.onerror = () => {
            alert('Erreur lors du chargement de l\'image');
        };
        
        reader.readAsDataURL(file);
    }

    /**
     * Affichage de la prévisualisation d'image
     */
    displayImagePreview(imageSrc) {
        const uploadArea = document.getElementById('imageUploadArea');
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        
        if (uploadArea && preview && previewImg) {
            uploadArea.classList.add('hidden');
            preview.classList.remove('hidden');
            previewImg.src = imageSrc;
        }
    }

    /**
     * Suppression du logo avec nettoyage de l'état
     */
    removeLogo() {
        this.logoData = null;
        
        const uploadArea = document.getElementById('imageUploadArea');
        const preview = document.getElementById('imagePreview');
        const logoInput = document.getElementById('logoInput');
        
        if (uploadArea && preview && logoInput) {
            uploadArea.classList.remove('hidden');
            preview.classList.add('hidden');
            logoInput.value = '';
        }
        
        console.log('🗑️ Logo supprimé');
    }

    /**
     * Auto-sauvegarde intelligente avec throttling
     */
    startAutoSave() {
        setInterval(() => {
            if (this.hasFormData()) {
                this.autoSave();
            }
        }, this.config.autoSaveInterval);
    }

    autoSave() {
        try {
            const data = this.collectFormData();
            data.logoData = this.logoData;
            data.versionHistory = this.versionManager.versionHistory;
            localStorage.setItem('procedure_autosave', JSON.stringify(data));
            console.log('💾 Auto-sauvegarde effectuée');
        } catch (error) {
            console.warn('Erreur auto-sauvegarde:', error);
        }
    }

    hasFormData() {
        const title = document.getElementById('title')?.value?.trim();
        const objective = document.getElementById('objective')?.value?.trim();
        return title || objective;
    }

    // === COLLECTE DE DONNÉES AVANCÉE ===

    /**
     * Collecte intelligente des données du formulaire
     */
    collectFormData() {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('fr-FR');

        return {
            title: this.getValue('title'),
            reference: this.getValue('reference'),
            version: this.versionManager.getVersionString(),
            author: this.getValue('author'),
            validator: this.getValue('validator'),
            creationDate: formattedDate,
            revisionDate: formattedDate,
            classification: this.getValue('classification') || 'Interne',
            logoData: this.logoData,
            objective: this.getValue('objective'),
            scope: {
                perimeter: this.getValue('scopePerimeter'),
                personnel: this.getValue('scopePersonnel'),
                systems: this.getValue('scopeSystems')
            },
            prerequisites: {
                technical: this.collectDynamicList('technicalSkills'),
                access: this.collectDynamicList('accessRights'),
                tools: this.collectDynamicList('tools'),
                environment: this.collectDynamicList('environment')
            },
            steps: this.collectSteps(),
            validation: {
                redactor: { name: this.getValue('redactorName') },
                verifier: { name: this.getValue('verifierName') },
                approver: { name: this.getValue('approverName') }
            },
            contact: {
                supportEmail: this.getValue('supportEmail'),
                hotline: this.getValue('hotline'),
                portal: this.getValue('portal'),
                location: this.getValue('location')
            },
            company: this.getValue('company'),
            versionHistory: this.versionManager.versionHistory
        };
    }

    getValue(id) {
        return document.getElementById(id)?.value?.trim() || '';
    }

    collectDynamicList(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        
        const inputs = container.querySelectorAll('input[type="text"]');
        return Array.from(inputs)
            .map(input => input.value.trim())
            .filter(value => value.length > 0);
    }

    collectSteps() {
        const stepsContainer = document.getElementById('stepsContainer');
        if (!stepsContainer) return [];

        const stepElements = stepsContainer.querySelectorAll('.step-container');
        return Array.from(stepElements).map(stepEl => {
            const stepIndex = stepEl.dataset.stepIndex;
            return {
                name: this.getValue(`stepName_${stepIndex}`),
                objective: this.getValue(`stepObjective_${stepIndex}`),
                responsible: this.getValue(`stepResponsible_${stepIndex}`),
                duration: this.getValue(`stepDuration_${stepIndex}`),
                actions: this.collectActions(stepIndex),
                controls: this.collectControls(stepIndex),
                result: this.getValue(`stepResult_${stepIndex}`)
            };
        });
    }

    collectActions(stepIndex) {
        const actionsContainer = document.getElementById(`actionsContainer_${stepIndex}`);
        if (!actionsContainer) return [];

        const actionElements = actionsContainer.querySelectorAll('.action-container');
        return Array.from(actionElements).map(actionEl => {
            const actionIndex = actionEl.dataset.actionIndex;
            return {
                description: this.getValue(`actionDesc_${stepIndex}_${actionIndex}`),
                scenarios: this.collectScenarios(stepIndex, actionIndex)
            };
        });
    }

    collectScenarios(stepIndex, actionIndex) {
        const scenariosContainer = document.getElementById(`scenariosContainer_${stepIndex}_${actionIndex}`);
        if (!scenariosContainer) return [];

        const scenarioElements = scenariosContainer.querySelectorAll('.scenario-container');
        return Array.from(scenarioElements).map(scenarioEl => {
            const scenarioIndex = scenarioEl.dataset.scenarioIndex;
            return {
                condition: this.getValue(`scenarioCondition_${stepIndex}_${actionIndex}_${scenarioIndex}`),
                steps: this.collectScenarioSteps(stepIndex, actionIndex, scenarioIndex)
            };
        });
    }

    collectScenarioSteps(stepIndex, actionIndex, scenarioIndex) {
        const stepsContainer = document.getElementById(`scenarioStepsContainer_${stepIndex}_${actionIndex}_${scenarioIndex}`);
        if (!stepsContainer) return [];

        const inputs = stepsContainer.querySelectorAll('input[type="text"]');
        return Array.from(inputs)
            .map(input => input.value.trim())
            .filter(value => value.length > 0);
    }

    collectControls(stepIndex) {
        const controlsContainer = document.getElementById(`controlsContainer_${stepIndex}`);
        if (!controlsContainer) return [];

        const inputs = controlsContainer.querySelectorAll('input[type="text"]');
        return Array.from(inputs)
            .map(input => input.value.trim())
            .filter(value => value.length > 0);
    }

    // === GESTION DYNAMIQUE DES ÉTAPES ===

    renderInitialSteps() {
        if (document.getElementById('stepsContainer').children.length === 0) {
            this.addStep();
        }
    }

    addStep() {
        const stepIndex = this.stepCounter++;
        const stepsContainer = document.getElementById('stepsContainer');
        
        const stepHtml = this.generateStepHTML(stepIndex);
        stepsContainer.insertAdjacentHTML('beforeend', stepHtml);
        
        this.addAction(stepIndex);
        
        console.log(`✅ Étape ${stepIndex + 1} créée`);
    }

    generateStepHTML(stepIndex) {
        return `
            <div class="step-container" data-step-index="${stepIndex}">
                <div class="step-header">
                    <div class="step-title">Étape ${stepIndex + 1}</div>
                    <button class="step-remove" onclick="procedureGen.removeStep(${stepIndex})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
                
                <div class="grid grid-2">
                    <div class="input-group">
                        <label>Nom de l'étape</label>
                        <input type="text" id="stepName_${stepIndex}" placeholder="Ex: Préparation du matériel">
                    </div>
                    <div class="input-group">
                        <label>Objectif</label>
                        <input type="text" id="stepObjective_${stepIndex}" placeholder="Objectif de cette étape">
                    </div>
                    <div class="input-group">
                        <label>Responsable</label>
                        <input type="text" id="stepResponsible_${stepIndex}" placeholder="Ex: Technicien IT">
                    </div>
                    <div class="input-group">
                        <label>Durée estimée</label>
                        <input type="text" id="stepDuration_${stepIndex}" placeholder="Ex: 15 minutes">
                    </div>
                </div>

                <h4 class="subsection-title">Actions</h4>
                <div id="actionsContainer_${stepIndex}"></div>
                <button type="button" class="btn-add" onclick="procedureGen.addAction(${stepIndex})">
                    <i class="fas fa-plus"></i> Ajouter une action
                </button>

                <h4 class="subsection-title" style="margin-top: 20px;">Contrôles/Vérifications</h4>
                <div id="controlsContainer_${stepIndex}" class="dynamic-list">
                    <div class="dynamic-item">
                        <input type="text" placeholder="Contrôle à effectuer">
                        <button type="button" class="btn-remove hidden" onclick="removeItem(this)">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>
                <button type="button" class="btn-add" onclick="procedureGen.addControl(${stepIndex})">
                    <i class="fas fa-plus"></i> Ajouter un contrôle
                </button>

                <div class="input-group" style="margin-top: 20px;">
                    <label>Résultat attendu</label>
                    <textarea id="stepResult_${stepIndex}" rows="2" placeholder="Décrivez le résultat attendu de cette étape"></textarea>
                </div>
            </div>
        `;
    }

    removeStep(stepIndex) {
        const stepElement = document.querySelector(`[data-step-index="${stepIndex}"]`);
        if (stepElement) {
            stepElement.remove();
            console.log(`🗑️ Étape ${stepIndex + 1} supprimée`);
        }
    }

    // === GESTION DES ACTIONS ET SCÉNARIOS ===

    addAction(stepIndex) {
        const actionsContainer = document.getElementById(`actionsContainer_${stepIndex}`);
        const actionIndex = actionsContainer.children.length;
        
        const actionHtml = this.generateActionHTML(stepIndex, actionIndex);
        actionsContainer.insertAdjacentHTML('beforeend', actionHtml);
        
        this.addScenario(stepIndex, actionIndex);
    }

    generateActionHTML(stepIndex, actionIndex) {
        return `
            <div class="action-container" data-action-index="${actionIndex}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                    <h5 style="color: var(--primary-blue); font-weight: 600;">Action ${actionIndex + 1}</h5>
                    <button class="btn-remove" onclick="procedureGen.removeAction(${stepIndex}, ${actionIndex})" style="width: auto; height: auto; padding: 6px 10px; border-radius: 6px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                
                <div class="input-group">
                    <label>Description de l'action</label>
                    <input type="text" id="actionDesc_${stepIndex}_${actionIndex}" placeholder="Ex: Vérifier l'état du matériel et démarrer l'installation">
                </div>

                <h6 style="color: var(--text-secondary); font-weight: 600; margin: 15px 0 10px 0;">Scénarios</h6>
                <div id="scenariosContainer_${stepIndex}_${actionIndex}"></div>
                <button type="button" class="btn-add" onclick="procedureGen.addScenario(${stepIndex}, ${actionIndex})" style="margin-top: 10px;">
                    <i class="fas fa-plus"></i> Ajouter un scénario
                </button>
            </div>
        `;
    }

    removeAction(stepIndex, actionIndex) {
        const actionElement = document.querySelector(`[data-step-index="${stepIndex}"] [data-action-index="${actionIndex}"]`);
        if (actionElement) {
            actionElement.remove();
            console.log(`🗑️ Action ${actionIndex + 1} supprimée`);
        }
    }

    addScenario(stepIndex, actionIndex) {
        const scenariosContainer = document.getElementById(`scenariosContainer_${stepIndex}_${actionIndex}`);
        const scenarioIndex = scenariosContainer.children.length;
        
        const scenarioHtml = this.generateScenarioHTML(stepIndex, actionIndex, scenarioIndex);
        scenariosContainer.insertAdjacentHTML('beforeend', scenarioHtml);
        
        this.addScenarioStep(stepIndex, actionIndex, scenarioIndex);
    }

    generateScenarioHTML(stepIndex, actionIndex, scenarioIndex) {
        return `
            <div class="scenario-container" data-scenario-index="${scenarioIndex}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 10px;">
                    <input type="text" id="scenarioCondition_${stepIndex}_${actionIndex}_${scenarioIndex}" 
                           placeholder="Ex: Si le matériel est neuf" 
                           style="flex: 1; font-weight: 600;">
                    <button class="btn-remove" onclick="procedureGen.removeScenario(${stepIndex}, ${actionIndex}, ${scenarioIndex})" style="width: auto; height: auto; padding: 4px 8px; border-radius: 4px;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="scenario-steps">
                    <div id="scenarioStepsContainer_${stepIndex}_${actionIndex}_${scenarioIndex}" class="dynamic-list"></div>
                    <button type="button" class="btn-add" onclick="procedureGen.addScenarioStep(${stepIndex}, ${actionIndex}, ${scenarioIndex})" style="font-size: 0.85rem; padding: 8px 12px;">
                        <i class="fas fa-plus"></i> Ajouter une étape
                    </button>
                </div>
            </div>
        `;
    }

    removeScenario(stepIndex, actionIndex, scenarioIndex) {
        const scenarioElement = document.querySelector(`[data-step-index="${stepIndex}"] [data-action-index="${actionIndex}"] [data-scenario-index="${scenarioIndex}"]`);
        if (scenarioElement) {
            scenarioElement.remove();
            console.log(`🗑️ Scénario ${scenarioIndex + 1} supprimé`);
        }
    }

    addScenarioStep(stepIndex, actionIndex, scenarioIndex) {
        const stepsContainer = document.getElementById(`scenarioStepsContainer_${stepIndex}_${actionIndex}_${scenarioIndex}`);
        const stepHtml = `
            <div class="scenario-step">
                <input type="text" placeholder="Étape du scénario" style="flex: 1;">
                <button type="button" class="btn-remove ${stepsContainer.children.length === 0 ? 'hidden' : ''}" onclick="removeItem(this)">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
        `;
        stepsContainer.insertAdjacentHTML('beforeend', stepHtml);
        this.updateRemoveButtons(stepsContainer);
    }

    addControl(stepIndex) {
        const controlsContainer = document.getElementById(`controlsContainer_${stepIndex}`);
        const controlHtml = `
            <div class="dynamic-item">
                <input type="text" placeholder="Contrôle à effectuer">
                <button type="button" class="btn-remove" onclick="removeItem(this)">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
        `;
        controlsContainer.insertAdjacentHTML('beforeend', controlHtml);
        this.updateRemoveButtons(controlsContainer);
    }

    updateRemoveButtons(container) {
        const items = container.querySelectorAll('.dynamic-item, .scenario-step');
        items.forEach((item, index) => {
            const removeBtn = item.querySelector('.btn-remove');
            if (removeBtn) {
                removeBtn.classList.toggle('hidden', items.length <= 1);
            }
        });
    }

    // === VALIDATION MÉTIER ===

    validateForExport() {
        const approverName = this.getValue('approverName');
        const alertElement = document.getElementById('validationAlert');
        
        if (!approverName) {
            alertElement.classList.remove('hidden');
            setTimeout(() => alertElement.classList.add('hidden'), 5000);
            document.getElementById('approverName').focus();
            return false;
        }
        
        alertElement.classList.add('hidden');
        return true;
    }

    // === PRÉVISUALISATION AVANCÉE ===

    showPreview() {
        const data = this.collectFormData();
        const previewHTML = this.generatePreviewHTML(data);
        
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('previewContainer').style.display = 'block';
        document.getElementById('previewContainer').innerHTML = previewHTML;
        
        document.body.className = 'preview-mode';
        console.log('👀 Mode prévisualisation activé');
    }

    hidePreview() {
        document.getElementById('formContainer').style.display = 'block';
        document.getElementById('previewContainer').style.display = 'none';
        document.body.className = '';
        console.log('📝 Retour au mode édition');
    }

    generatePreviewHTML(data) {
        return `
            <div class="preview-container">
                ${this.generateCoverPage(data)}
                ${this.generateMainContent(data)}
                <div class="back-button" onclick="procedureGen.hidePreview()">
                    Retour au formulaire
                </div>
            </div>
        `;
    }

    generateCoverPage(data) {
        const logoSection = data.logoData ? `
            <div class="cover-logo">
                <img src="${data.logoData}" alt="Logo de la procédure">
            </div>
        ` : '';

        return `
            <div class="cover-page">
                <div class="cover-content">
                    ${logoSection}
                    <div class="cover-title">PROCÉDURE IT</div>
                    <div class="cover-subtitle">${data.title || 'Nouvelle procédure'}</div>
                    <div class="cover-meta">
                        <div class="cover-meta-item">
                            <div class="cover-meta-label">Version</div>
                            <div class="cover-meta-value">v${data.version}</div>
                        </div>
                        <div class="cover-meta-item">
                            <div class="cover-meta-label">Auteur</div>
                            <div class="cover-meta-value">${data.author || 'Non défini'}</div>
                        </div>
                        <div class="cover-meta-item">
                            <div class="cover-meta-label">Date</div>
                            <div class="cover-meta-value">${data.creationDate}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateMainContent(data) {
        return `
            <div style="background: white; margin: 0; position: relative;">
                ${this.generateCartouche(data)}
                <div style="padding: 40px; padding-top: 120px;">
                    ${this.generateObjectiveSection(data)}
                    ${this.generatePrerequisitesSection(data)}
                    ${this.generateStepsSection(data)}
                    ${this.generateVersionHistorySection(data)}
                    ${this.generateContactSection(data)}
                </div>
            </div>
        `;
    }

    generateCartouche(data) {
        return `
            <div class="header-cartouche">
                <div class="cartouche-header">
                    <div class="cartouche-item">
                        <div class="cartouche-label">Référence</div>
                        <div class="cartouche-value">${data.reference || 'N/A'}</div>
                    </div>
                    <div class="cartouche-item">
                        <div class="cartouche-label">Version</div>
                        <div class="cartouche-value">v${data.version}</div>
                    </div>
                    <div class="cartouche-item">
                        <div class="cartouche-label">Date</div>
                        <div class="cartouche-value">${data.creationDate}</div>
                    </div>
                    <div class="cartouche-item">
                        <div class="cartouche-label">Validé par</div>
                        <div class="cartouche-value">${data.validator || 'En attente'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    generateObjectiveSection(data) {
        return `
            <div class="preview-section">
                <h2>OBJECTIF ET PORTÉE</h2>
                
                <h3 style="color: #1d1d1f; font-size: 1.1rem; font-weight: 600; margin: 20px 0 12px 0;">Objectif</h3>
                <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 15px 0; border: 1px solid #e5e5e7;">
                    <p>${data.objective || 'Aucun objectif défini'}</p>
                </div>

                <h3 style="color: #1d1d1f; font-size: 1.1rem; font-weight: 600; margin: 20px 0 12px 0;">Portée</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
                    ${this.generateScopeCard('Périmètre d\'application', data.scope.perimeter)}
                    ${this.generateScopeCard('Personnel concerné', data.scope.personnel)}
                    ${this.generateScopeCard('Systèmes/Technologies', data.scope.systems)}
                </div>
            </div>
        `;
    }

    generateScopeCard(title, content) {
        return `
            <div style="background: #f9f9f9; padding: 12px; border-radius: 8px; border: 1px solid #e5e5e7;">
                <div style="font-weight: 600; color: #007aff; font-size: 0.8rem; margin-bottom: 4px;">${title}</div>
                <div style="color: #1d1d1f; font-size: 0.85rem;">${content || 'Non défini'}</div>
            </div>
        `;
    }

    generatePrerequisitesSection(data) {
        return `
            <div class="preview-section">
                <h2>PRÉREQUIS</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
                    ${this.generatePrerequisiteCard('Compétences techniques', data.prerequisites.technical)}
                    ${this.generatePrerequisiteCard('Accès et permissions', data.prerequisites.access)}
                    ${this.generatePrerequisiteCard('Outils et ressources', data.prerequisites.tools)}
                    ${this.generatePrerequisiteCard('Environnement matériel / logiciel', data.prerequisites.environment)}
                </div>
            </div>
        `;
    }

    generatePrerequisiteCard(title, items) {
        const listContent = items && items.length > 0 ? 
            this.generatePrerequisiteList(items) :
            '<p style="color: #8e8e93; font-style: italic;">Aucun prérequis défini</p>';

        return `
            <div style="background: #f9f9f9; border: 1px solid #e5e5e7; border-radius: 8px; padding: 16px;">
                <h5 style="color: #007aff; font-weight: 600; margin-bottom: 12px; font-size: 0.9rem;">${title}</h5>
                ${listContent}
            </div>
        `;
    }

    generatePrerequisiteList(items) {
        return `
            <ul style="list-style: none; margin: 0; padding: 0;">
                ${items.map(item => `
                    <li style="position: relative; padding-left: 24px; margin: 8px 0;">
                        <span style="position: absolute; left: 0; top: 0; color: #34c759; font-weight: bold; font-size: 0.9rem;">✓</span>
                        ${item}
                    </li>
                `).join('')}
            </ul>
        `;
    }

    generateStepsSection(data) {
        if (!data.steps || data.steps.length === 0) {
            return `
                <div class="preview-section">
                    <h2>PROCÉDURE DÉTAILLÉE</h2>
                    <p style="color: #8e8e93; font-style: italic;">Aucune étape définie</p>
                </div>
            `;
        }

        return `
            <div class="preview-section">
                <h2>PROCÉDURE DÉTAILLÉE</h2>
                ${data.steps.map((step, index) => this.generateStepCard(step, index)).join('')}
            </div>
        `;
    }

    generateStepCard(step, index) {
        return `
            <div class="step-card">
                <div class="step-header-preview">Étape ${index + 1} : ${step.name}</div>
                <div class="step-content">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 16px;">
                        ${this.generateScopeCard('Objectif', step.objective)}
                        ${this.generateScopeCard('Responsable', step.responsible)}
                        ${this.generateScopeCard('Durée estimée', step.duration)}
                    </div>
                    
                    ${step.actions.map((action, actionIndex) => this.generateActionCard(action, actionIndex)).join('')}

                    ${step.controls && step.controls.length > 0 ? `
                        <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 12px 0; border: 1px solid #e5e5e7;">
                            <h5 style="color: #007aff; font-weight: 600; margin-bottom: 10px; font-size: 0.9rem;">Contrôles/Vérifications :</h5>
                            ${this.generatePrerequisiteList(step.controls)}
                        </div>
                    ` : ''}

                    ${step.result ? `
                        <div style="background: #f0f9ff; border: 1px solid #34c759; border-radius: 8px; padding: 16px; margin: 12px 0;">
                            <h5 style="color: #34c759; font-weight: 600; margin-bottom: 6px; font-size: 0.9rem;">Résultat attendu :</h5>
                            <p>${step.result}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    generateActionCard(action, actionIndex) {
        return `
            <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 12px 0; border: 1px solid #e5e5e7;">
                <h5 style="color: #007aff; font-weight: 600; margin-bottom: 10px; font-size: 0.9rem;">
                    Action ${actionIndex + 1}: ${action.description}
                </h5>
                ${action.scenarios.map(scenario => this.generateScenarioCard(scenario)).join('')}
            </div>
        `;
    }

    generateScenarioCard(scenario) {
        return `
            <div style="margin-bottom: 12px; padding-left: 16px; border-left: 3px solid #007aff;">
                <h6 style="color: #1d1d1f; font-weight: 600; font-size: 0.8rem; margin-bottom: 6px;">
                    ${scenario.condition}
                </h6>
                <ol style="margin-left: 16px;">
                    ${scenario.steps.map(step => `
                        <li style="margin: 4px 0; color: #1d1d1f; font-size: 0.8rem;">
                            ${step}
                        </li>
                    `).join('')}
                </ol>
            </div>
        `;
    }

    generateVersionHistorySection(data) {
        return `
            <div class="version-history">
                <h3>
                    <i class="fas fa-code-branch" style="color: #007aff; margin-right: 8px;"></i>
                    Historique des versions
                </h3>
                ${this.versionManager.generateVersionTable()}
            </div>
        `;
    }

    generateContactSection(data) {
        return `
            <div style="background: #f2f2f7; color: #1d1d1f; padding: 30px 40px; border-top: 1px solid #e5e5e7; margin-top: 30px; border-radius: 0 0 var(--radius-lg) var(--radius-lg);">
                <h3 style="color: #007aff; font-size: 1.1rem; margin-bottom: 20px; text-align: center; font-weight: 600;">
                    INFORMATIONS DE CONTACT
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 20px;">
                    ${this.generateContactCard('Support IT', data.contact.supportEmail || 'Non défini')}
                    ${this.generateContactCard('Hotline', data.contact.hotline || 'Non définie')}
                    ${this.generateContactCard('Portail interne', data.contact.portal || 'Non défini')}
                    ${this.generateContactCard('Localisation', data.contact.location || 'Non définie')}
                </div>
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e5e7; color: #8e8e93; font-size: 0.75rem;">
                    <p>Document confidentiel - Usage interne uniquement</p>
                    <p>© ${data.company || 'Entreprise'} - ${new Date().getFullYear()} - Tous droits réservés</p>
                </div>
            </div>
        `;
    }

    generateContactCard(title, content) {
        return `
            <div style="text-align: center; background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e5e7;">
                <h4 style="color: #007aff; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px;">${title}</h4>
                <p style="color: #8e8e93; font-size: 0.8rem;">${content}</p>
            </div>
        `;
    }

    // === EXPORT PDF PROFESSIONNEL ===

    generatePDF() {
        if (!this.validateForExport()) {
            return;
        }
        
        // Afficher la modal de versionning
        modalManager.showVersionModal();
    }

    generatePDFWithVersion(data) {
        const pdfHTML = this.generatePDFSpecificHTML(data);
        
        const originalFormDisplay = document.getElementById('formContainer').style.display;
        
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('previewContainer').style.display = 'block';
        document.getElementById('previewContainer').innerHTML = pdfHTML;
        
        const backButton = document.querySelector('.back-button');
        if (backButton) backButton.style.display = 'none';
        
        console.log('🖨️ Génération PDF Enterprise avec versionning...');
        
        setTimeout(() => {
            window.print();
            
            const afterPrint = () => {
                document.getElementById('formContainer').style.display = originalFormDisplay;
                document.getElementById('previewContainer').style.display = 'none';
                if (backButton) backButton.style.display = 'block';
                window.removeEventListener('afterprint', afterPrint);
                console.log('✅ PDF généré avec succès - Version ' + data.version);
            };
            
            window.addEventListener('afterprint', afterPrint);
            setTimeout(() => {
                if (document.getElementById('previewContainer').style.display === 'block') {
                    afterPrint();
                }
            }, 3000);
            
        }, 1000);
    }

    generatePDFSpecificHTML(data) {
        // Déterminer le dernier modificateur à partir de l'historique des versions
        const lastModifier = this.getLastModifier(data);
        
        return `
            <div class="preview-container" style="margin: 0; border-radius: 0; box-shadow: none;">
                <!-- Page de garde -->
                ${this.generateCoverPage(data)}
                
                <!-- Contenu principal avec cartouche intelligent -->
                <div class="print-main-content" style="background: white; margin: 0;">
                    <div style="padding: 40px 20px;">
                        ${this.generateObjectiveSection(data)}
                        ${this.generatePrerequisitesSection(data)}
                        ${this.generateStepsSection(data)}
                        ${this.generateVersionHistorySection(data)}
                        ${this.generateContactSectionForPrint(data)}
                    </div>
                </div>
            </div>
        `;
    }

    generatePDFWithVersion(data) {
        const pdfHTML = this.generatePDFSpecificHTML(data);
        
        const originalFormDisplay = document.getElementById('formContainer').style.display;
        
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('previewContainer').style.display = 'block';
        document.getElementById('previewContainer').innerHTML = pdfHTML;
        
        const backButton = document.querySelector('.back-button');
        if (backButton) backButton.style.display = 'none';
        
        // INNOVATION : Injection dynamique du cartouche pendant l'impression
        this.injectPrintHeader(data);
        
        console.log('🖨️ Génération PDF Enterprise avec cartouche intelligent...');
        
        setTimeout(() => {
            window.print();
            
            const afterPrint = () => {
                document.getElementById('formContainer').style.display = originalFormDisplay;
                document.getElementById('previewContainer').style.display = 'none';
                if (backButton) backButton.style.display = 'block';
                
                // Nettoyer le cartouche injecté
                this.cleanupPrintHeader();
                
                window.removeEventListener('afterprint', afterPrint);
                console.log('✅ PDF généré avec succès - Version ' + data.version);
            };
            
            window.addEventListener('afterprint', afterPrint);
            setTimeout(() => {
                if (document.getElementById('previewContainer').style.display === 'block') {
                    afterPrint();
                }
            }, 3000);
            
        }, 1000);
    }

    /**
     * INNOVATION TECHNIQUE : Injection dynamique du cartouche de façon robuste
     * Cette méthode contourne les limitations CSS Paged Media des navigateurs
     */
    injectPrintHeader(data) {
        const lastModifier = this.getLastModifier(data);
        
        // Créer le cartouche fixe
        const headerElement = document.createElement('div');
        headerElement.className = 'print-fixed-header';
        headerElement.id = 'dynamic-print-header';
        
        headerElement.innerHTML = `
            <div class="header-content">
                <div class="header-item">
                    <span class="header-label">Procédure</span>
                    <span class="header-value" title="${data.title || 'Nouvelle procédure'}">${this.truncateText(data.title || 'Nouvelle procédure', 25)}</span>
                </div>
                <div class="header-item">
                    <span class="header-label">Référence</span>
                    <span class="header-value">${data.reference || 'N/A'}</span>
                </div>
                <div class="header-item">
                    <span class="header-label">Version</span>
                    <span class="header-value">v${data.version}</span>
                </div>
                <div class="header-item">
                    <span class="header-label">Date</span>
                    <span class="header-value">${data.creationDate}</span>
                </div>
                <div class="header-item">
                    <span class="header-label">Modifié par</span>
                    <span class="header-value" title="${lastModifier}">${this.truncateText(lastModifier, 12)}</span>
                </div>
            </div>
        `;
        
        // Injecter dans le body pour qu'il soit visible partout
        document.body.appendChild(headerElement);
        
        // Masquer sur la page de garde avec une logique JavaScript robuste
        this.hidePrintHeaderOnCoverPage();
    }

    /**
     * Logique intelligente pour masquer le cartouche sur la page de garde uniquement
     */
    hidePrintHeaderOnCoverPage() {
        // Utiliser Intersection Observer pour détecter la page de garde
        const coverPage = document.querySelector('.cover-page');
        const printHeader = document.getElementById('dynamic-print-header');
        
        if (coverPage && printHeader) {
            // Créer un observateur d'intersection pour la page de garde
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Sur la page de garde : masquer le cartouche
                        printHeader.style.display = 'none';
                    } else {
                        // Sur les autres pages : afficher le cartouche
                        printHeader.style.display = 'block';
                    }
                });
            }, {
                threshold: 0.5,
                rootMargin: '0px 0px -50% 0px' // Trigger quand 50% de la page est visible
            });
            
            observer.observe(coverPage);
            
            // Fallback : masquer initialement si on démarre sur la page de garde
            const rect = coverPage.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                printHeader.style.display = 'none';
            }
        }
    }

    /**
     * Nettoyage du cartouche après impression
     */
    cleanupPrintHeader() {
        const dynamicHeader = document.getElementById('dynamic-print-header');
        if (dynamicHeader) {
            dynamicHeader.remove();
        }
    }

    /**
     * Utilitaire pour tronquer le texte intelligemment
     */
    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    /**
     * Détermine le dernier modificateur à partir de l'historique des versions
     */
    getLastModifier(data) {
        if (data.versionHistory && data.versionHistory.length > 0) {
            // Retourner l'auteur de la version la plus récente
            const lastVersion = data.versionHistory[data.versionHistory.length - 1];
            return lastVersion.author;
        }
        
        // Fallback sur l'auteur principal si pas d'historique
        return data.author || 'Non défini';
    }

    /**
     * Section contact optimisée pour l'impression
     */
    generateContactSectionForPrint(data) {
        return `
            <div class="contact-section-print">
                <h3 style="color: #007aff; font-size: 1.1rem; margin-bottom: 20px; text-align: center; font-weight: 600; page-break-after: avoid;">
                    INFORMATIONS DE CONTACT
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 15px;">
                    ${this.generateContactCardForPrint('Support IT', data.contact.supportEmail || 'Non défini')}
                    ${this.generateContactCardForPrint('Hotline', data.contact.hotline || 'Non définie')}
                    ${this.generateContactCardForPrint('Portail interne', data.contact.portal || 'Non défini')}
                    ${this.generateContactCardForPrint('Localisation', data.contact.location || 'Non définie')}
                </div>
                <div style="text-align: center; padding-top: 15px; border-top: 1px solid #e5e5e7; color: #8e8e93; font-size: 0.7rem;">
                    <p style="margin: 2px 0;">Document confidentiel - Usage interne uniquement</p>
                    <p style="margin: 2px 0;">© ${data.company || 'Entreprise'} - ${new Date().getFullYear()} - Tous droits réservés</p>
                </div>
            </div>
        `;
    }

    generateContactCardForPrint(title, content) {
        return `
            <div style="text-align: center; background: white; padding: 12px; border-radius: 6px; border: 1px solid #e5e5e7;">
                <h4 style="color: #007aff; font-size: 0.8rem; font-weight: 600; margin-bottom: 4px;">${title}</h4>
                <p style="color: #8e8e93; font-size: 0.75rem; margin: 0;">${content}</p>
            </div>
        `;
    }

    // === SAUVEGARDE ET IMPORT AVANCÉS ===

    saveModel() {
        const data = this.collectFormData();
        const filename = this.generateFilename(data.title);
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
        console.log(`💾 Procédure sauvegardée : ${filename}`);
    }

    generateFilename(title) {
        const date = new Date().toISOString().split('T')[0];
        const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'procedure';
        return `procedure_${cleanTitle}_v${this.versionManager.getVersionString()}_${date}.json`;
    }

    importModel() {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.loadData(data);
                console.log('📂 Procédure importée avec versionning');
            } catch (error) {
                alert('Erreur lors de l\'import : fichier JSON invalide');
                console.error('Erreur import:', error);
            }
        };
        reader.readAsText(file);
    }

    loadData(data) {
        // Charger le logo si présent
        if (data.logoData) {
            this.logoData = data.logoData;
            this.displayImagePreview(data.logoData);
        }

        // Charger l'historique des versions si présent
        if (data.versionHistory) {
            this.versionManager.versionHistory = data.versionHistory;
            this.versionManager.saveVersionHistory();
        }

        // Charger toutes les données
        this.setValue('title', data.title);
        this.setValue('reference', data.reference);
        this.setValue('version', data.version);
        this.setValue('author', data.author);
        this.setValue('validator', data.validator);
        this.setValue('classification', data.classification);
        this.setValue('objective', data.objective);
        this.setValue('scopePerimeter', data.scope?.perimeter);
        this.setValue('scopePersonnel', data.scope?.personnel);
        this.setValue('scopeSystems', data.scope?.systems);

        // Charger les prérequis
        this.loadDynamicList('technicalSkills', data.prerequisites?.technical);
        this.loadDynamicList('accessRights', data.prerequisites?.access);
        this.loadDynamicList('tools', data.prerequisites?.tools);
        this.loadDynamicList('environment', data.prerequisites?.environment);

        // Charger la validation et les contacts
        this.setValue('redactorName', data.validation?.redactor?.name);
        this.setValue('verifierName', data.validation?.verifier?.name);
        this.setValue('approverName', data.validation?.approver?.name);
        this.setValue('supportEmail', data.contact?.supportEmail);
        this.setValue('hotline', data.contact?.hotline);
        this.setValue('portal', data.contact?.portal);
        this.setValue('location', data.contact?.location);
        this.setValue('company', data.company);

        // Charger les étapes
        this.loadSteps(data.steps);
    }

    setValue(id, value) {
        const element = document.getElementById(id);
        if (element && value !== undefined) {
            element.value = value;
        }
    }

    loadDynamicList(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container || !items) return;

        container.innerHTML = '';

        items.forEach((item, index) => {
            const itemHtml = `
                <div class="dynamic-item">
                    <input type="text" value="${item}">
                    <button type="button" class="btn-remove ${index === 0 && items.length === 1 ? 'hidden' : ''}" onclick="removeItem(this)">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', itemHtml);
        });

        if (items.length === 0) {
            const itemHtml = `
                <div class="dynamic-item">
                    <input type="text" placeholder="Nouvelle entrée">
                    <button type="button" class="btn-remove hidden" onclick="removeItem(this)">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', itemHtml);
        }
    }

    loadSteps(steps) {
        const stepsContainer = document.getElementById('stepsContainer');
        stepsContainer.innerHTML = '';
        this.stepCounter = 0;

        if (!steps || steps.length === 0) {
            this.addStep();
            return;
        }

        steps.forEach((step, index) => {
            this.addStep();
            const stepIndex = index;

            this.setValue(`stepName_${stepIndex}`, step.name);
            this.setValue(`stepObjective_${stepIndex}`, step.objective);
            this.setValue(`stepResponsible_${stepIndex}`, step.responsible);
            this.setValue(`stepDuration_${stepIndex}`, step.duration);
            this.setValue(`stepResult_${stepIndex}`, step.result);

            this.loadControlsForStep(stepIndex, step.controls);
            this.loadActionsForStep(stepIndex, step.actions);
        });
    }

    loadActionsForStep(stepIndex, actions) {
        const actionsContainer = document.getElementById(`actionsContainer_${stepIndex}`);
        actionsContainer.innerHTML = '';

        if (!actions || actions.length === 0) {
            this.addAction(stepIndex);
            return;
        }

        actions.forEach((action, actionIndex) => {
            this.addAction(stepIndex);
            this.setValue(`actionDesc_${stepIndex}_${actionIndex}`, action.description);
            this.loadScenariosForAction(stepIndex, actionIndex, action.scenarios);
        });
    }

    loadScenariosForAction(stepIndex, actionIndex, scenarios) {
        const scenariosContainer = document.getElementById(`scenariosContainer_${stepIndex}_${actionIndex}`);
        scenariosContainer.innerHTML = '';

        if (!scenarios || scenarios.length === 0) {
            this.addScenario(stepIndex, actionIndex);
            return;
        }

        scenarios.forEach((scenario, scenarioIndex) => {
            this.addScenario(stepIndex, actionIndex);
            this.setValue(`scenarioCondition_${stepIndex}_${actionIndex}_${scenarioIndex}`, scenario.condition);
            this.loadScenarioSteps(stepIndex, actionIndex, scenarioIndex, scenario.steps);
        });
    }

    loadScenarioSteps(stepIndex, actionIndex, scenarioIndex, steps) {
        const stepsContainer = document.getElementById(`scenarioStepsContainer_${stepIndex}_${actionIndex}_${scenarioIndex}`);
        stepsContainer.innerHTML = '';

        if (!steps || steps.length === 0) {
            this.addScenarioStep(stepIndex, actionIndex, scenarioIndex);
            return;
        }

        steps.forEach((step, index) => {
            const stepHtml = `
                <div class="scenario-step">
                    <input type="text" value="${step}" style="flex: 1;">
                    <button type="button" class="btn-remove ${index === 0 && steps.length === 1 ? 'hidden' : ''}" onclick="removeItem(this)">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            `;
            stepsContainer.insertAdjacentHTML('beforeend', stepHtml);
        });
    }

    loadControlsForStep(stepIndex, controls) {
        const controlsContainer = document.getElementById(`controlsContainer_${stepIndex}`);
        controlsContainer.innerHTML = '';

        if (!controls || controls.length === 0) {
            const controlHtml = `
                <div class="dynamic-item">
                    <input type="text" placeholder="Contrôle à effectuer">
                    <button type="button" class="btn-remove hidden" onclick="removeItem(this)">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            `;
            controlsContainer.insertAdjacentHTML('beforeend', controlHtml);
            return;
        }

        controls.forEach((control, index) => {
            const controlHtml = `
                <div class="dynamic-item">
                    <input type="text" value="${control}">
                    <button type="button" class="btn-remove ${index === 0 && controls.length === 1 ? 'hidden' : ''}" onclick="removeItem(this)">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            `;
            controlsContainer.insertAdjacentHTML('beforeend', controlHtml);
        });
    }

    loadAutoSave() {
        const saved = localStorage.getItem('procedure_autosave');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (confirm('Une sauvegarde automatique a été trouvée. Voulez-vous la charger ?')) {
                    this.loadData(data);
                    console.log('🔄 Auto-sauvegarde chargée avec versionning');
                }
            } catch (error) {
                console.warn('Erreur lors du chargement de l\'auto-sauvegarde:', error);
            }
        }
    }

    loadExampleData() {
        if (!this.hasFormData()) {
            setTimeout(() => {
                if (confirm('Voulez-vous charger un exemple de procédure pour commencer ?')) {
                    this.loadData(this.getExampleData());
                }
            }, 1000);
        }
    }

    getExampleData() {
        return {
            "title": "Installation d'un nouveau poste de travail",
            "reference": "PROC-IT-2024-001",
            "version": "1.0",
            "author": "Jean Dupont",
            "validator": "Marie Martin",
            "classification": "Interne",
            "logoData": null,
            "objective": "Cette procédure décrit les étapes nécessaires pour installer et configurer un nouveau poste de travail informatique pour un nouvel employé, en s'assurant que tous les logiciels requis sont installés et que l'accès aux ressources de l'entreprise est correctement configuré.",
            "scope": {
                "perimeter": "Service IT, Ressources Humaines",
                "personnel": "Techniciens IT, Responsable IT",
                "systems": "Postes de travail Windows 11, Active Directory, Office 365"
            },
            "prerequisites": {
                "technical": [
                    "Connaissances Windows 11",
                    "Accès administrateur sur Active Directory",
                    "Maîtrise des outils de déploiement"
                ],
                "access": [
                    "Accès administrateur local",
                    "Droits sur Active Directory",
                    "Accès aux licences logicielles"
                ],
                "tools": [
                    "Image système Windows 11",
                    "Clé USB bootable",
                    "Licences Office 365",
                    "Câble réseau"
                ],
                "environment": [
                    "Matériel compatible et fonctionnel (PC, serveurs, routeurs)",
                    "OS et logiciels à jour",
                    "Sauvegardes récentes des systèmes critiques",
                    "Plans de rollback / restauration disponibles"
                ]
            },
            "steps": [
                {
                    "name": "Préparation du matériel",
                    "objective": "Vérifier et préparer le matériel informatique",
                    "responsible": "Technicien IT",
                    "duration": "15 minutes",
                    "actions": [
                        {
                            "description": "Vérifier l'état du matériel et démarrer l'installation",
                            "scenarios": [
                                {
                                    "condition": "Si le matériel est neuf",
                                    "steps": [
                                        "Déballer le matériel avec précaution",
                                        "Vérifier l'absence de dommages physiques",
                                        "Connecter écran, clavier, souris",
                                        "Brancher l'alimentation",
                                        "Démarrer pour la première fois"
                                    ]
                                },
                                {
                                    "condition": "Si le matériel est reconditionné",
                                    "steps": [
                                        "Effectuer un nettoyage complet",
                                        "Vérifier tous les ports et connexions",
                                        "Tester le démarrage",
                                        "Formater le disque dur si nécessaire"
                                    ]
                                }
                            ]
                        }
                    ],
                    "controls": [
                        "Vérifier que tous les composants fonctionnent",
                        "S'assurer que l'écran s'affiche correctement"
                    ],
                    "result": "Matériel opérationnel et prêt pour l'installation système"
                }
            ],
            "validation": {
                "redactor": { "name": "Jean Dupont" },
                "verifier": { "name": "Pierre Durand" },
                "approver": { "name": "Marie Martin" }
            },
            "contact": {
                "supportEmail": "support-it@entreprise.com",
                "hotline": "+33 1 23 45 67 89",
                "portal": "https://intranet.entreprise.com/it",
                "location": "Bâtiment A, Étage 2, Bureau IT"
            },
            "company": "Entreprise Tech Solutions",
            "versionHistory": []
        };
    }
}

// === FONCTIONS GLOBALES POUR L'INTERFACE ===

function removeItem(button) {
    const item = button.closest('.dynamic-item, .scenario-step');
    const container = item.parentElement;
    
    item.remove();
    procedureGen.updateRemoveButtons(container);
}

function addTechnicalSkill() {
    addDynamicItem('technicalSkills', 'Compétence requise');
}

function addAccessRight() {
    addDynamicItem('accessRights', 'Accès requis');
}

function addTool() {
    addDynamicItem('tools', 'Outil requis');
}

function addEnvironment() {
    addDynamicItem('environment', 'Prérequis environnement');
}

function addDynamicItem(containerId, placeholder) {
    const container = document.getElementById(containerId);
    const itemHtml = `
        <div class="dynamic-item">
            <input type="text" placeholder="${placeholder}">
            <button type="button" class="btn-remove" onclick="removeItem(this)">
                <i class="fas fa-minus"></i>
            </button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', itemHtml);
    procedureGen.updateRemoveButtons(container);
}

function removeLogo() {
    procedureGen.removeLogo();
}

// Fonctions de l'interface principale
function importModel() {
    procedureGen.importModel();
}

function saveModel() {
    procedureGen.saveModel();
}

function showPreview() {
    procedureGen.showPreview();
}

function generatePDF() {
    procedureGen.generatePDF();
}

function addStep() {
    procedureGen.addStep();
}

// === INITIALISATION ENTERPRISE ===

let procedureGen;
let modalManager;

document.addEventListener('DOMContentLoaded', function() {
    // Instanciation des managers
    procedureGen = new ProcedureGenerator();
    modalManager = new ModalManager();
    
    // Chargement différé de l'auto-sauvegarde
    setTimeout(() => procedureGen.loadAutoSave(), 500);
    
    console.log('🎯 Application Enterprise v2.0 initialisée !');
    console.log('🚀 Modules actifs : Version Management, Modal System, PDF Engine Pro');
    console.log('⚡ Architecture : ES6 Classes, Event Delegation, Semantic Versioning');
});