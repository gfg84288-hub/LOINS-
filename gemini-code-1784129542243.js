/* ==========================================================================
   SYSTEME DE ROUTING ET MENU MOBILE
   ========================================================================== */
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Masquer et afficher les pages sans rafraîchissement
function showSection(sectionId) {
    // Fermeture du menu mobile
    navLinks.classList.remove('active');

    // Cacher toutes les sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => sec.classList.remove('active'));

    // Afficher la bonne section
    const target = document.getElementById(sectionId);
    if(target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }

    // Mettre à jour l'état actif dans la nav
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(l => {
        l.classList.remove('active-link');
        if(l.getAttribute('onclick') && l.getAttribute('onclick').includes(sectionId)) {
            l.classList.add('active-link');
        }
    });
}

/* ==========================================================================
   GESTION DES MODALES (LOGIN & REGISTER)
   ========================================================================== */
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Fermeture au clic à l'extérieur de la modale
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

/* ==========================================================================
   SIMULATEUR DE COMPTE ET PIPELINE WHITELIST (DATA BINDING)
   ========================================================================== */
let userSession = {
    isLoggedIn: false,
    username: "",
    email: "",
    creationDate: "",
    whitelistStatus: "Non Soumise" // "Non Soumise", "En Attente", "Validée", "Refusée"
};

// Formulaire Inscription
function handleRegister(e) {
    e.preventDefault();
    const user = document.getElementById('reg-user').value;
    const email = document.getElementById('reg-email').value;

    userSession.isLoggedIn = true;
    userSession.username = user;
    userSession.email = email;
    userSession.creationDate = new Date().toLocaleDateString('fr-FR');
    
    closeModal('register-modal');
    updateSessionUI();
    showSection('dashboard');
}

// Formulaire Connexion
function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('login-user').value;

    userSession.isLoggedIn = true;
    userSession.username = user;
    userSession.email = "contact@nexus.rp";
    userSession.creationDate = new Date().toLocaleDateString('fr-FR');

    closeModal('login-modal');
    updateSessionUI();
    showSection('dashboard');
}

// Mise à jour adaptative de l'interface
function updateSessionUI() {
    if(userSession.isLoggedIn) {
        // MAJ de la barre de navigation
        document.getElementById('auth-buttons').classList.add('hidden');
        document.getElementById('user-profile-nav').classList.remove('hidden');
        document.getElementById('nav-dashboard-link').classList.remove('hidden');
        document.getElementById('nav-username').textContent = userSession.username;

        // MAJ du dashboard
        document.getElementById('dash-username').textContent = userSession.username;
        document.getElementById('dash-join-date').textContent = userSession.creationDate;
        updateWhitelistUI();
    }
}

// Gérer l'état d'avancement de la Whitelist dans le dashboard
function updateWhitelistUI() {
    const wlStatusText = document.getElementById('dash-wl-status');
    const step2 = document.getElementById('step-2');
    const step2Desc = document.getElementById('step-2-desc');
    const btnWl = document.getElementById('btn-start-whitelist');
    
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');

    if(userSession.whitelistStatus === "Non Soumise") {
        wlStatusText.textContent = "Non Soumise";
        wlStatusText.className = "text-right text-warning";
    } else if(userSession.whitelistStatus === "En Attente") {
        wlStatusText.textContent = "En Attente de relecture";
        wlStatusText.className = "text-right text-accent";
        
        // Progression
        step2.className = "step completed";
        step2Desc.innerHTML = "<strong>Dossier soumis avec succès !</strong> Nos modérateurs analysent vos réponses.";
        if(btnWl) btnWl.style.display = "none";

        step3.className = "step pending";
    } else if(userSession.whitelistStatus === "Validée") {
        wlStatusText.textContent = "Validée !";
        wlStatusText.className = "text-right text-success";

        step2.className = "step completed";
        step3.className = "step completed";
        step4.className = "step pending";
    }
}

// Envoi du formulaire Whitelist
function submitWhitelist(e) {
    e.preventDefault();
    if(!userSession.isLoggedIn) {
        alert("Vous devez être connecté pour envoyer votre candidature.");
        return;
    }
    userSession.whitelistStatus = "En Attente";
    showSection('dashboard');
    updateWhitelistUI();
}

/* ==========================================================================
   TEXTES ET RULES DYNAMIQUES
   ========================================================================== */
const rulesDb = {
    general: `
        <h3>Règles Générales d'Usage</h3>
        <p><strong>1. Respect d'autrui :</strong> Les insultes hors-RP (OOC), le harcèlement ou les propos à caractère raciste, sexiste ou homophobe entraînent un bannissement permanent.</p>
        <p><strong>2. Utilisation des bugs (Glitch/Cheat) :</strong> L'exploitation de failles techniques du jeu, l'utilisation de logiciels tiers ou le cheat sont formellement proscrits.</p>
        <p><strong>3. Nom de compte réaliste :</strong> Vos pseudonymes en jeu doivent respecter la syntaxe "Prénom_Nom". Les noms de célébrités historiques ou de fiction célèbres sont interdits.</p>
    `,
    roleplay: `
        <h3>Concepts Fondamentaux du RolePlay</h3>
        <p><strong>1. Le Powergaming :</strong> Faire des actions impossibles dans la vie réelle (sauter d'un pont en voiture et continuer sa route comme si de rien n'était).</p>
        <p><strong>2. Le Metagaming :</strong> Utiliser des informations acquises Hors-RP (via les lives Twitch, Discord ou les forums) pour mener à bien des actions en jeu.</p>
        <p><strong>3. Fear-RP :</strong> Vous devez simuler la peur lorsque votre vie est menacée de manière réaliste (ex: braqué par deux armes à feu).</p>
    `,
    illegal: `
        <h3>Factions et Crime Organisé</h3>
        <p><strong>1. Droits aux braquages :</strong> Les braquages de supérettes et de banques exigent un quota minimum de policiers actifs en ville.</p>
        <p><strong>2. Alliances criminelles :</strong> Les bandes de rue et les mafias doivent officialiser leur existence via le dossier légal requis sur le Discord.</p>
    `,
    legal: `
        <h3>Règles pour la Police & la Justice</h3>
        <p><strong>1. Usage de la force (Force Matrix) :</strong> Les officiers de police doivent adapter l'usage de la force de façon progressive (Avertissement oral ➔ Arme non létale ➔ Arme létale).</p>
        <p><strong>2. Droits du détenu :</strong> Tout citoyen arrêté a droit à la lecture de ses droits ainsi qu'à la présence d'un avocat pour sa défense.</p>
    `
};

function switchRules(category) {
    const content = rulesDb[category];
    document.getElementById('rules-display').innerHTML = content;

    // Gestion du style actif
    const tabs = document.querySelectorAll('.rule-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active-tab');
        if(tab.getAttribute('onclick').includes(category)) {
            tab.classList.add('active-tab');
        }
    });
}

// Initialisation au chargement de la page
window.onload = function() {
    switchRules('general');
};