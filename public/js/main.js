// Fonction pour charger la barre de navigation 
document.addEventListener('DOMContentLoaded', function() {  
    // Fonction pour charger la navbar
    async function loadNavbar() {
        try {
            const response = await fetch('./partials/navbar.html');
            if (!response.ok) throw new Error('Erreur lors du chargement de la barre de navigation');
            const dataNavbar = await response.text();
            document.getElementById('navbar-container').innerHTML = dataNavbar;
            attachNavbarListeners();
        } catch (error) {
            console.error('Erreur lors du chargement de la barre de navigation:', error);
        }
    }

    // Fonctions pour injecter les formulaires

    function injectRegisterForm() {
        const contentDiv = document.getElementById('content'); 
        contentDiv.innerHTML = `
            <div class="container card pt-5 mx-auto">
                <h1 class="text-center text-black"><b>EcoRide'Vert</b></h1>
                <h2 class="text-center mb-2 mt-5">CREER UN COMPTE</h2>
                <h6 class="text-center mb-3">Déjà inscrit ? <a href="#" id="register-form-click">Cliquer ici</a></h6>
                <form id="register-form">
                    <div class="alert alert-danger d-none" id="error-message" role="alert"></div>
                    <div class="mb-3">
                        <label for="exampleInputFirstName" class="form-label">Nom</label>
                        <input type="text" class="form-control" id="exampleInputFirstName" required>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputLastName" class="form-label">Prénom</label>
                        <input type="text" class="form-control" id="exampleInputLastName" required>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail" required>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword" required>
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck" required>
                        <label class="form-check-label m-2" for="exampleCheck">J'accepte les conditions d'utilisation</label>
                    </div>
                    <div class="d-flex justify-content-center mt-5">
                        <button type="submit" class="btn btn-primary mb-5">Créer mon compte</button>
                    </div>
                </form>
            </div>
        `;
        attachRegisterFormSubmitHandler();
        registerOnClick();
    }

    function injectLoginForm() {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = `
            <div class="container card pt-5 mx-auto">
                <h1 class="text-center text-black"><b>EcoRide'Vert</b></h1>
                <h2 class="text-center mb-2 mt-5">CONNECTEZ-VOUS</h2>
                <h6 class="text-center mb-3">Pas encore inscrit ? <a href="#" id="login-form-click">Cliquer ici</a></h6>
                <form id="login-form">
                    <div class="alert alert-danger d-none" id="error-message" role="alert"></div>
                    <div class="mb-3">
                        <label for="exampleInputEmail" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail" required>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" required>
                    </div>
                    <div class="d-flex justify-content-center mt-5">
                        <button type="submit" class="btn btn-primary mb-5">Se connecter</button>
                    </div>
                </form>
            </div>
        `;
        attachLoginFormSubmitHandler();
        loginOnClick();
    }

    // Gestion du clic sur le lien "Déjà inscrit ?" (dans le formulaire d'inscription)
    function registerOnClick() {
        const registerFormClick = document.getElementById('register-form-click');
        if (registerFormClick) {
            registerFormClick.addEventListener('click', function(event) {
                event.preventDefault();
                injectLoginForm();
            });
        }
    }

    // Gestion du clic sur le lien "Pas encore inscrit ?" (dans le formulaire de connexion)
    function loginOnClick() {
        const loginFormClick = document.getElementById('login-form-click');
        if (loginFormClick) {
            loginFormClick.addEventListener('click', function(event) {
                event.preventDefault();
                injectRegisterForm();
            });
        }
    }

    // Gestion de la soumission du formulaire d'inscription
    function attachRegisterFormSubmitHandler() {
        const form = document.getElementById('register-form');
        if (!form) return;
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const errorMessageDiv = document.getElementById('error-message');
            errorMessageDiv.classList.add('d-none');
            errorMessageDiv.textContent = '';

            const nom = document.getElementById('exampleInputFirstName').value.trim();
            const prenom = document.getElementById('exampleInputLastName').value.trim();
            const email = document.getElementById('exampleInputEmail').value.trim();
            const password = document.getElementById('exampleInputPassword').value;
            const conditions = document.getElementById('exampleCheck').checked;

            if (!nom || !prenom || !email || !password) {
                errorMessageDiv.textContent = 'Tous les champs sont obligatoires.';
                errorMessageDiv.classList.remove('d-none');
                return;
            }
            if (!conditions) {
                errorMessageDiv.textContent = 'Vous devez accepter les conditions d\'utilisation de la plateforme.';
                errorMessageDiv.classList.remove('d-none');
                return;
            }

            let csrfToken = '';
            try {
                const csrfRes = await fetch('/api/csrf-token', { credentials: 'include' });
                const csrfData = await csrfRes.json();
                csrfToken = csrfData.csrfToken;
            } catch (err) {
                errorMessageDiv.textContent = 'Erreur CSRF, veuillez réessayer.';
                errorMessageDiv.classList.remove('d-none');
                return;
            }

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-csrf-token': csrfToken
                    },
                    body: JSON.stringify({ nom, prenom, email, password })
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                    injectLoginForm();
                } else {
                    // Affichage des erreurs de validation ou message unique
                    if (result.errors) {
                        // Si c'est un tableau d'erreurs
                        if (Array.isArray(result.errors)) {
                            errorMessageDiv.innerHTML = result.errors.map(e => `<div>${e.msg || e}</div>`).join('');
                        } else {
                            // Si c'est un objet d'erreurs
                            errorMessageDiv.innerHTML = Object.values(result.errors).map(e => `<div>${e}</div>`).join('');
                        }
                    } else if (result.message) {
                        errorMessageDiv.textContent = result.message;
                    } else {
                        errorMessageDiv.textContent = "Erreur inconnue.";
                    }
                    errorMessageDiv.classList.remove('d-none');
                }
            } catch (error) {
                errorMessageDiv.textContent = 'Erreur lors de l\'inscription.';
                errorMessageDiv.classList.remove('d-none');
            }
        });
    }

    // Gestion de la soumission du formulaire de connexion
    function attachLoginFormSubmitHandler() {
        const form = document.getElementById('login-form');
        if (!form) return;
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const errorMessageDiv = document.getElementById('error-message');
            errorMessageDiv.classList.add('d-none');
            errorMessageDiv.textContent = '';

            const email = document.getElementById('exampleInputEmail').value.trim();
            const password = document.getElementById('exampleInputPassword1').value;

            if (!email || !password) {
                errorMessageDiv.textContent = 'Tous les champs sont obligatoires.';
                errorMessageDiv.classList.remove('d-none');
                return;
            }

            let csrfToken = '';
            try {
                const csrfRes = await fetch('/api/csrf-token', { credentials: 'include' });
                const csrfData = await csrfRes.json();
                csrfToken = csrfData.csrfToken;
            } catch (err) {
                errorMessageDiv.textContent = 'Erreur serveur, veuillez réessayer.';
                errorMessageDiv.classList.remove('d-none');
                return;
            }

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json', 
                        'x-csrf-token': csrfToken
                    },
                    body: JSON.stringify({ email, password })
                });
                const result = await response.json();
                if (response.ok) {
                    showMainContent();
                } else {

                    // Affichage des erreurs de validation ou message unique
                    if (result.errors) {
                        // Si c'est un tableau d'erreurs
                        if (Array.isArray(result.errors)) {
                            errorMessageDiv.innerHTML = result.errors.map(e => `<div>${e.msg || e}</div>`).join('');
                        } else {
                            // Si c'est un objet d'erreurs
                            errorMessageDiv.innerHTML = Object.values(result.errors).map(e => `<div>${e}</div>`).join('');
                        }
                    } else if (result.message) {
                        errorMessageDiv.textContent = result.message;
                    } else {
                        errorMessageDiv.textContent = "Erreur inconnue.";
                    }
                    errorMessageDiv.classList.remove('d-none'); 
                }    
            } catch (error) {
                errorMessageDiv.textContent = 'Erreur lors de la connexion';
                errorMessageDiv.classList.remove('d-none');
            }
        });
    }

    // Attachement des listeners sur la navbar
    function attachNavbarListeners() {
        const createAccountBtn = document.getElementById('create-account-btn');
        const loginAccountBtn = document.getElementById('login-account-btn');
        const logoutAccountBtn = document.getElementById('logout-account-btn');
        const covoiturageBtn = document.getElementById('covoiturage-btn');

        if (createAccountBtn) {
            createAccountBtn.addEventListener('click', function(event) {
                event.preventDefault();
                injectRegisterForm();
            });
        }
        if (loginAccountBtn) {
            loginAccountBtn.addEventListener('click', function(event) {
                event.preventDefault();
                injectLoginForm();
            });
        }
        if (logoutAccountBtn) {
            logoutAccountBtn.addEventListener('click', async function(event) {
                event.preventDefault();
                // Appel de l'API de déconnexion
                try {
                    const response = await fetch('/api/logout', {
                        method: 'POST',
                        credentials: 'include'
                    });
                    if (!response.ok) {
                        console.error("Erreur HTTP sur /api/logout :", response.status);
                        return;
                    }
                    // On réaffiche le contenu principal (hero image)
                    showMainContent();
                } catch (error) {
                    alert('Erreur lors de la déconnexion');
                }
            });
        }
        if (covoiturageBtn) {
            covoiturageBtn.addEventListener('click', async function(event) {
                event.preventDefault();
                const contentDiv = document.getElementById('content');
                try {
                    const response = await fetch('./partials/covoiturage.html');
                    if (!response.ok) throw new Error('Erreur lors du chargement de la page covoiturage');
                    const covoiturageHtml = await response.text();
                    contentDiv.innerHTML = covoiturageHtml;
                } catch (error) {
                    contentDiv.innerHTML = "<div class='alert alert-danger'>Impossible de charger la page covoiturage.</div>";
                }
            });
            
        }
    }
    
    

    // Affichage dynamique de la navbar
    loadNavbar();

    // Affichage dynamique du contenu principal
    showMainContent();

});

async function showMainContent() {

    const createAccountBtn = document.getElementById('create-account-btn');
    const loginAccountBtn = document.getElementById('login-account-btn');
    const logoutAccountBtn = document.getElementById('logout-account-btn');
    const covoiturageBtn = document.getElementById('covoiturage-btn');  

    // Vérification de la session côté serveur
    let data = {};
    try {
         const res = await fetch('/api/session', { credentials: 'include' });
        if (!res.ok) {
            console.error("Erreur HTTP sur /api/session :", res.status);
            return;
        }
        data = await res.json();
    } catch (err) {
        console.error("Réponse non JSON reçue pour /api/session :", err);
        return;
    }
    
     
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;

    if (data.isAuthenticated) {
        // L'utilisateur est connecté, masque les boutons "Créer un compte" et "Se connecter" et charge home.html
        if (createAccountBtn) createAccountBtn.classList.add('d-none');
        if (loginAccountBtn) loginAccountBtn.classList.add('d-none');
        // Afficher le bouton "Se déconnecter"
        if (logoutAccountBtn) logoutAccountBtn.classList.remove('d-none');

        const response = await fetch('./partials/home.html');
        if (!response.ok) throw new Error('Erreur lors du chargement de la page d\'accueil');
        const homeHtml = await response.text();
        contentDiv.innerHTML = homeHtml;
        showAccordion();
    } else {
        // L'utilisateur n'est pas connecté, affiche les boutons "Créer un compte" et "Se connecter", ensuite la hero image
        if (createAccountBtn) createAccountBtn.classList.remove('d-none');
        if (loginAccountBtn) loginAccountBtn.classList.remove('d-none');
        // Masquer le bouton "Se déconnecter"
        if (logoutAccountBtn) logoutAccountBtn.classList.add('d-none');
       
        const initialContent = `
            <div class="hero-image">
                <div class="hero-text">
                    <h1>Bienvenue sur notre plateforme de covoiturage</h1>
                    <p>Veuillez vous inscrire ou vous connecter pour continuer.</p> 
                    <button>En savoir plus</button>
                </div>
            </div>
        `;
        contentDiv.innerHTML = initialContent;
    }
}

async function showAccordion() {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;

            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } 
        });
    }
}

/*
// Fonction pour la gestion de la création d'un trajet
document.getElementById('trajetForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    // Convertir les cases à cocher en booléens
    data.sieges_chauffants = formData.get('sieges_chauffants') === 'on';
    data.aide_conduite = formData.get('aide_conduite') === 'on';
    data.freinage_urgence = formData.get('freinage_urgence') === 'on';
    data.avertissement_voie = formData.get('avertissement_voie') === 'on';
    data.recuperation_energie = formData.get('recuperation_energie') === 'on';
    data.prechauffage = formData.get('prechauffage') === 'on';
    data.itineraire_optimise = formData.get('itineraire_optimise') === 'on';
    data.espace_bagages = formData.get('espace_bagages') === 'on';
    data.partage_frais = formData.get('partage_frais') === 'on';

    try {
        const response = await fetch('/api/trajet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 'charset': 'utf-8'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Erreur: ${response.status}`);
        }

        const result = await response.json();
        alert('Trajet créé avec succès: ' + result.id_trajet); // log création de trajet
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
});


/*
// fonction pour la gestion de configuration des paramètres du covoiturage
document.getElementById('parametreForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    // Convertir les cases à cocher en booléens
    data.sieges_chauffants = formData.get('sieges_chauffants') === 'on';
    data.aide_conduite = formData.get('aide_conduite') === 'on';
    data.freinage_urgence = formData.get('freinage_urgence') === 'on';
    data.avertissement_voie = formData.get('avertissement_voie') === 'on';
    data.recuperation_energie = formData.get('recuperation_energie') === 'on';
    data.prechauffage = formData.get('prechauffage') === 'on';
    data.itineraire_optimise = formData.get('itineraire_optimise') === 'on';
    data.espace_bagages = formData.get('espace_bagages') === 'on';
    data.partage_frais = formData.get('partage_frais') === 'on';

    try {
        const response = await fetch('/api/parametre', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 'charset': utf-8
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Erreur: ${response.status}`);
        }

        const result = await response.json();
        alert('Paramètre créé avec succès: ' + result.id_parametre); // log création de paramètres
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
});
*/