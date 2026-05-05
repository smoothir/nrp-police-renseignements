// --- VARIABLES GLOBALES ---
let currentUser = "";
let userScore = 0;
// Récupération des logs sauvegardés dans le navigateur, ou création d'un tableau vide
let systemLogs = JSON.parse(localStorage.getItem('konohaLogs')) || [];

// --- FONCTIONS DE NAVIGATION ---
function showPage(pageId) {
    // Cache toutes les pages
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('epreuve1').classList.add('hidden');
    document.getElementById('epreuve2').classList.add('hidden');
    document.getElementById('epreuve3').classList.add('hidden');
    document.getElementById('admin-page').classList.add('hidden');
    
    // Affiche la page demandée
    document.getElementById(pageId).classList.remove('hidden');
    
    if(pageId === 'main-menu') {
        document.getElementById('user-stats').innerText = `Score: ${userScore} / 3`;
    }
}

function addLog(action) {
    const time = new Date().toLocaleTimeString();
    const logEntry = `[${time}] ${currentUser} : ${action}`;
    systemLogs.push(logEntry);
    // Sauvegarde dans le navigateur
    localStorage.setItem('konohaLogs', JSON.stringify(systemLogs)); 
}

// --- SYSTEME DE CONNEXION ---
function login() {
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const mdp = document.getElementById('password').value;

    // Accès Admin caché
    if (nom.toLowerCase() === "admin" && mdp === "admin") {
        currentUser = "ADMINISTRATEUR";
        loadAdminLogs();
        showPage('admin-page');
        return;
    }

    if (mdp === "POLICESECRET" && nom !== "" && prenom !== "") {
        currentUser = `${prenom} ${nom}`;
        userScore = 0; // Réinitialise les stats pour la session
        document.getElementById('welcome-msg').innerText = `Bienvenue, Recrue ${currentUser}.`;
        addLog("S'est connecté au terminal.");
        showPage('main-menu');
    } else {
        alert("Accès refusé. Nom/Prénom manquant ou mot de passe incorrect.");
        addLog(`Tentative de connexion échouée (Nom tapé: ${nom})`);
    }
}

function logout() {
    addLog("S'est déconnecté.");
    currentUser = "";
    document.getElementById('nom').value = "";
    document.getElementById('prenom').value = "";
    document.getElementById('password').value = "";
    showPage('login-page');
}

// --- EPREUVE 1 : CRYPTO ---
function checkCrypto() {
    const answer = document.getElementById('crypto-answer').value.toUpperCase();
    if (answer === "KONOHA") {
        document.getElementById('crypto-result').innerHTML = "<span style='color:green;'>Code déchiffré ! Vous avez trouvé : KONOHA.</span>";
        userScore++;
        addLog("A réussi l'épreuve de cryptanalyse.");
    } else {
        document.getElementById('crypto-result').innerHTML = "<span style='color:red;'>Code erroné. L'ennemi a changé ses fréquences.</span>";
        addLog(`A échoué à la cryptanalyse (a tapé : ${answer})`);
    }
}

// --- EPREUVE 2 : INTERROGATOIRE ---
function interact(suspect) {
    const box = document.getElementById('dialogue-box');
    if (suspect === 'grand-mere') {
        box.innerHTML = `
            <h4>Suspect : Grand-mère civile</h4>
            <p>"Je faisais juste mes courses près de la porte Est..."</p>
            <button onclick="dialogueAction('grand-mere', 'douceur')">Être compréhensif</button>
            <button onclick="dialogueAction('grand-mere', 'pression')">Mettre la pression</button>
        `;
    } else if (suspect === 'genin') {
        box.innerHTML = `
            <h4>Suspect : Genin confirmé</h4>
            <p>"Je m'entraînais seul dans la forêt, je vous le jure !"</p>
            <button onclick="dialogueAction('genin', 'douceur')">Demander des détails</button>
            <button onclick="dialogueAction('genin', 'pression')">L'accuser de mensonge</button>
        `;
    } else if (suspect === 'jonin') {
        box.innerHTML = `
            <h4>Suspect : Jônin de Konoha</h4>
            <p>"J'étais en mission d'escorte à ce moment là. Vérifiez les registres."</p>
            <button onclick="dialogueAction('jonin', 'douceur')">Demander les papiers de mission</button>
            <button onclick="dialogueAction('jonin', 'pression')">Vérifier son chakra</button>
        `;
    }
}

function dialogueAction(suspect, methode) {
    const box = document.getElementById('dialogue-box');
    addLog(`A utilisé la méthode '${methode}' sur ${suspect}.`);
    
    if (suspect === 'jonin' && methode === 'pression') {
        box.innerHTML += `<p style="color:#ff5555;"><em>*Le Jônin transpire* "Mes papiers ? Je... je les ai perdus en route !"</em> (Indice : Incohérence majeure pour un Jônin).</p>`;
    } else {
        box.innerHTML += `<p style="color:#aaa;"><em>Le suspect ne lâche aucune information pertinente avec cette méthode...</em></p>`;
    }
}

function accuse() {
    const choix = document.getElementById('accusation').value;
    if (choix === "jonin") {
        document.getElementById('interro-result').innerHTML = "<span style='color:green;'>Exact ! Le Jônin était un espion d'Oto métamorphosé. Bonne déduction.</span>";
        userScore++;
        addLog("A réussi l'épreuve de l'interrogatoire en accusant le Jônin.");
    } else {
        document.getElementById('interro-result').innerHTML = "<span style='color:red;'>Erreur fatale. Vous avez accusé un innocent. Le vrai coupable s'est échappé.</span>";
        addLog(`A échoué à l'interrogatoire (A accusé : ${choix}).`);
    }
}

// --- EPREUVE 3 : DILEMMES ---
function resolveDilemma(choix) {
    let resultat = "";
    if (choix === 'abandon') {
        resultat = "Vous avez sécurisé l'information, mais perdu un frère d'armes. La Racine approuverait.";
        addLog("Epreuve 3 : A choisi le profil ANBU Racine (Abandon).");
    } else if (choix === 'combat') {
        resultat = "Vous êtes mort en héros, mais l'information n'est jamais arrivée à Konoha. Mauvais choix pour le renseignement.";
        addLog("Epreuve 3 : A choisi le profil classique (Mort au combat).");
    } else if (choix === 'piege') {
        resultat = "Tactique exceptionnelle. Vous avez sauvé les deux. Bienvenue chez les Jônins spéciaux.";
        userScore++;
        addLog("Epreuve 3 : A choisi le profil Jônin Stratège (Survie).");
    }
    document.getElementById('dilemma-result').innerHTML = `<strong>Résultat de la simulation :</strong> ${resultat}`;
}

// --- SYSTEME ADMIN ---
function loadAdminLogs() {
    const container = document.getElementById('logs-container');
    container.innerHTML = "<h3>Logs du système d'examen :</h3>";
    if (systemLogs.length === 0) {
        container.innerHTML += "<p>Aucun log pour le moment.</p>";
    } else {
        // Affiche la liste des logs (du plus récent au plus ancien)
        let htmlLogs = "";
        for (let i = systemLogs.length - 1; i >= 0; i--) {
            htmlLogs += `<div class="admin-log">${systemLogs[i]}</div>`;
        }
        container.innerHTML += htmlLogs;
    }
}

function clearLogs() {
    if(confirm("Effacer tous les logs ?")) {
        systemLogs = [];
        localStorage.removeItem('konohaLogs');
        loadAdminLogs();
    }
}