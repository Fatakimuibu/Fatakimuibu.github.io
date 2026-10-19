/* ==========================================================================
   BETHY FATAKI // IT MANAGEMENT & CYBERSECURITY PORTFOLIO JAVASCRIPT ENGINE
   Interactive Canvas, Terminal CLI, SFX Audio, Modals & Live Telemetry
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
   * 1. AUDIO SYNTHESIZER (WEB AUDIO API - SUBTLE CYBER SFX)
   * ------------------------------------------------------------------------ */
  let audioCtx = null;
  let sfxEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playCyberSound(frequency = 800, type = 'sine', duration = 0.04, gainVal = 0.05) {
    if (!sfxEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio failed silently
    }
  }

  // SFX Toggle button
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  const sfxText = document.getElementById('sfx-text');
  if (sfxToggleBtn && sfxText) {
    sfxToggleBtn.addEventListener('click', () => {
      initAudio();
      sfxEnabled = !sfxEnabled;
      if (sfxEnabled) {
        sfxToggleBtn.classList.add('active');
        sfxText.textContent = 'SFX: ACTIF';
        playCyberSound(1200, 'triangle', 0.08, 0.08);
      } else {
        sfxToggleBtn.classList.remove('active');
        sfxText.textContent = 'SFX: MUET';
      }
    });
  }

  // Play sound on button hover/click
  document.querySelectorAll('button, .btn, .nav-link, .chip-option, .filter-btn').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      if (audioCtx) playCyberSound(650, 'sine', 0.02, 0.02);
    });
    elem.addEventListener('click', () => {
      initAudio();
      playCyberSound(900, 'triangle', 0.05, 0.05);
    });
  });

  /* ------------------------------------------------------------------------
   * 2. INTERACTIVE CYBER CANVAS (NEURAL MESH / PARTICLE GRID)
   * ------------------------------------------------------------------------ */
  const canvas = document.getElementById('cyber-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, maxDist: 140 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    const nodeCount = Math.floor((width * height) / 22000);
    let nodes = [];

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.65;
        this.vy = (Math.random() - 0.5) * 0.65;
        this.radius = Math.random() * 1.8 + 1;
        this.baseAlpha = Math.random() * 0.5 + 0.3;
        this.isSpecial = Math.random() > 0.85; // some glow cyan/purple
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interaction with mouse
        if (mouse.x !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDist) {
            let force = (mouse.maxDist - dist) / mouse.maxDist;
            this.x -= (dx / dist) * force * 1.2;
            this.y -= (dy / dist) * force * 1.2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (this.isSpecial) {
          ctx.fillStyle = `rgba(0, 242, 254, ${this.baseAlpha + 0.2})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#00f2fe';
        } else {
          ctx.fillStyle = `rgba(148, 163, 184, ${this.baseAlpha * 0.6})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initNodes() {
      nodes = [];
      const count = Math.min(Math.floor((width * height) / 18000), 75);
      for (let i = 0; i < count; i++) {
        nodes.push(new Node());
      }
    }
    initNodes();

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes
      const maxConnectDist = 120;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          let dx = nodes[i].x - nodes[j].x;
          let dy = nodes[i].y - nodes[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            let alpha = (1 - dist / maxConnectDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Connect to mouse
      if (mouse.x !== null) {
        for (let i = 0; i < nodes.length; i++) {
          let dx = mouse.x - nodes[i].x;
          let dy = mouse.y - nodes[i].y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDist) {
            let alpha = (1 - dist / mouse.maxDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw all nodes
      for (let node of nodes) {
        node.update();
        node.draw();
      }

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }

  /* ------------------------------------------------------------------------
   * 3. TYPEWRITER EFFECT IN HERO
   * ------------------------------------------------------------------------ */
  const roleTypewriter = document.getElementById('role-typewriter');
  if (roleTypewriter) {
    const roles = [
      "IT Manager & Expert en Cybersécurité",
      "Ethical Hacker Certifié Cisco (Pentest & Audits)",
      "Développeur Python Certifié freeCodeCamp (300h)",
      "Spécialiste Réseaux IP & Télécoms (Cisco / V-SAT)",
      "Manager SOC & Auditeur ISO/CEI 27001",
      "Chercheur Forensic dans les SI Hybrides",
      "Administrateur Systèmes & Cloud (Linux / Azure)"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        roleTypewriter.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        roleTypewriter.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 75;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2200; // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Pause before typing next word
      }

      setTimeout(typeLoop, typingSpeed);
    }
    typeLoop();
  }

  /* ------------------------------------------------------------------------
   * 4. INTERACTIVE TERMINAL ENGINE (CLI HUD)
   * ------------------------------------------------------------------------ */
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const terminalScreen = document.getElementById('terminal-screen');
  const quickPillBtns = document.querySelectorAll('.quick-pill-btn');

  const commandResponses = {
    help: `Commandes disponibles :
  <span class="highlight">whoami</span>      - Identité, accréditations et profil de Bethy Fataki
  <span class="highlight">skills</span>      - Synthèse des compétences réseaux, télécoms et cybersécurité
  <span class="highlight">kali</span>        - Arsenal offensif & distribution Kali Linux
  <span class="highlight">onion</span>       - Plateforme défensive & supervision SOC Security Onion
  <span class="highlight">csharp</span>      - Détails de la certification C# Fondamental Microsoft
  <span class="highlight">projects</span>    - Aperçu des projets phares (54 Sites Radio, V-SAT, Forensic)
  <span class="highlight">cve</span>         - Axes de recherche forensic et audits ISO 27001
  <span class="highlight">certs</span>       - Diplômes et certifications (Cisco, freeCodeCamp, Microsoft, ISTA)
  <span class="highlight">contact</span>     - Coordonnées directes, email, téléphone & empreinte PGP
  <span class="highlight">matrix</span>      - Déclencher le flux binaire cyber
  <span class="highlight">clear</span>       - Nettoyer l'affichage du terminal
  <span class="highlight">flag</span>        - Vous cherchez un flag CTF ?`,

    whoami: `<span class="highlight">BETHY FATAKI // IT Manager | Expert en Cybersécurité</span>
Périmètre : Infrastructures Réseaux IP (LAN/WAN/Wi-Fi), Télécoms & V-SAT, Sécurité Offensive & Défensive
Distributions : Kali Linux (arsenal offensif/pentest) & Security Onion (NSM/SOC/forensic)
Expérience : 15+ années en environnements critiques, FAI et haute disponibilité
Certifications Clés : Cisco Ethical Hacker (2026), Python Developer (300h, 2026), C# Fondamental avec Microsoft (2026), ISTA TIC (Distinction), Cisco Network Defense, Alvarion WiMAX
Localisation : Kinshasa, République Démocratique du Congo // Missions internationales
Statut : Disponible pour direction IT, audits de sécurité ISO 27001, missions réseaux & pentesting`,

    skills: `<span class="highlight">=== ARSENAL RÉSEAUX, DEV & CYBERSÉCURITÉ ===</span>
[+] <span class="cyan">Réseaux IP & Télécoms :</span>
    Cisco WAN/LAN/Wi-Fi, Microtik, Juniper, Faisceaux Hertziens, V-SAT, WiMAX Alvarion, VoIP
[+] <span class="warning">Cybersécurité Offensive & Pentest (Kali Linux & Cisco 2026) :</span>
    Arsenal Kali Linux (Nmap, Metasploit, Burp Suite, Aircrack-ng, SQLmap, Hydra, John the Ripper), Pentest méthodologique, reconnaissance OSINT, exploitation filaire/sans-fil, cloud & IoT, post-exploitation
[+] <span class="warning">Cybersécurité Défensive, SOC & NSM (Security Onion) :</span>
    Plateforme Security Onion (Suricata NIDS/IPS, Zeek, Wazuh EDR, Stenographer, Kibana/OpenSearch), Management opérationnel de SOC, Audits ISO/CEI 27001, Durcissement bases SQL, Forensic SI hybrides
[+] <span class="success">Programmation & Développement Logiciel (2026) :</span>
    - Développeur Python certifié freeCodeCamp (300h) : scripts réseau & SecOps, Scapy, parsing
    - Développeur C# Fondamental certifié Microsoft & freeCodeCamp : POO, écosystème .NET
    - JavaScript & Responsive Web Design
[+] <span class="highlight">Systèmes, Cloud & Management :</span>
    Linux/Unix, Windows Server, VMware ESXi, VirtualBox, Proxmox, Azure, AWS, Direction technique`,

    projects: `<span class="highlight">=== RÉALISATIONS & PROJETS CLÉS ===</span>
1. <span class="highlight">Fine-Tuning Radio 54 Sites :</span> Décongestion et optimisation de couverture FAI (Kinshasa).
2. <span class="highlight">Boucle Locale & V-SAT :</span> Déploiement stations terriennes et routage Cisco/Microtik/Juniper.
3. <span class="highlight">Forensic SI Hybrides RDC :</span> Méthodologie d'investigation des incidents de sécurité.
Tapez <span class="highlight">'cve'</span> pour voir les audits de recherche ou descendez dans la section projets.`,

    cve: `<span class="highlight">=== AXES DE RECHERCHE FORENSIC & AUDITS ===</span>
- <span class="error">[RECHERCHE]</span> FORENSIC-RDC : Investigation forensic des incidents dans les SI hybrides
- <span class="warning">[AUDIT]</span> AUDIT-ISO-27001 : Audit de sécurité & analyse des risques chez le FAI Cieluxtelecom
- <span class="warning">[DATABASE]</span> DB-HARDENING : Sécurisation & optimisation bases MySQL/PostgreSQL contre intrusions
- <span class="cyan">[TÉLÉCOMS]</span> RADIO-QOS-54 : Décongestion de trafic et fine-tuning de 54 sites radio`,

    certs: `<span class="highlight">=== DIPLÔMES & CERTIFICATIONS OFFICIELLES ===</span>
[★] Cisco Certified Ethical Hacker - Cisco Networking Academy (Mai 2026)
    -> Pentest méthodologique, OSINT, failles filaires/sans-fil, cloud & IoT, post-exploitation
[★] C# Fondamental avec Microsoft - freeCodeCamp.org & Microsoft (Juin 2026)
    -> C# syntax, POO, logique algorithmique, écosystème .NET. ID: focalone/foundational-c-sharp-with-microsoft
[★] Python Developer Certification (300h) - freeCodeCamp.org (Mars 2026)
    -> Algorithmique avancée, programmation système, scripts réseau. ID: focalone/python-v9
[✓] Diplôme Ingénieur 2ème cycle TIC - ISTA Kinshasa (Distinction, 2016-2018)
[✓] Diplôme Ingénieur Technicien Télécom - ISTA Kinshasa (Satisfaction, 2004-2008)
[✓] Cisco Certified Network Defense, Cyber Threat Mgmt & Cyber Analyst (2022)
[✓] Certifications WiMAX : CAIT, CASO, CASS - ALVARION (2010)
[✓] FreeCodeCamp : JavaScript Algorithms & Responsive Web Design (2021)`,

    kali: `<span class="highlight">=== DISTRIBUTION KALI LINUX // ARSENAL OFFENSIF ===</span>
Outils maîtrisés en environnement opérationnel :
- Reconnaissance & Scanning : Nmap, Masscan, Amass, theHarvester
- Analyse de vulnérabilités & Exploitation : Metasploit Framework, Searchsploit
- Sécurité Web & Proxies : Burp Suite Professional, OWASP ZAP, SQLmap, Nikto
- Audit Réseaux Sans-Fil : Aircrack-ng Suite, Kismet, Wifite
- Cassage de mots de passe : John the Ripper, Hashcat, Hydra
- Post-Exploitation : Mimikatz, Empire, Meterpreter`,

    onion: `<span class="highlight">=== DISTRIBUTION SECURITY ONION // DÉFENSE & NSM ===</span>
Composants et outils intégrés pour la supervision SOC & Forensic :
- NIDS / IPS : Suricata (détection d'intrusions réseau en temps réel)
- Analyse de protocoles : Zeek / Bro (métadonnées réseau détaillées)
- HIDS & EDR : Wazuh (surveillance d'intégrité, détection sur les hôtes)
- Capture complète de paquets : Stenographer
- Visualisation & Chasse aux menaces (Threat Hunting) : Elasticsearch, Logstash, Kibana (ELK) / OpenSearch
- Décodage et analyse d'artefacts : CyberChef, NetworkMiner`,

    csharp: `<span class="highlight">=== CERTIFICATION C# FONDAMENTAL AVEC MICROSOFT (2026) ===</span>
Éditeur : Microsoft & freeCodeCamp.org (19 juin 2026)
Compétences validées :
- Syntaxe C# et structures de contrôle modernes
- Programmation Orientée Objet (POO) : encapsulation, héritage, polymorphisme, interfaces
- Algorithmes de traitement de données et manipulation de collections
- Débogage, gestion des exceptions et sécurisation du code applicatif
- Écosystème .NET et développement d'outils système
Vérification : https://freecodecamp.org/certification/focalone/foundational-c-sharp-with-microsoft`,

    contact: `<span class="highlight">=== COORDONNÉES SÉCURISÉES ===</span>
Email Pro   : <span class="cyan">fmuibu@gmail.com</span>
Téléphone   : <span class="success">+243 826 806 151</span>
LinkedIn    : <span class="highlight">linkedin.com/in/fataki-muibu</span>
Localisation: Kinshasa, RDC (5 Av. Ibangi, C/Mont-Ngafula)
PGP Key     : <span class="success">BF24 8268 0615 1F9A 46DF 883A 9C21 77FE</span>`,

    flag: `<span class="success">CTF{b3thy_f4t4k1_n3tw0rk_s3c_m4st3r}</span>
Bien joué ! Mentionnez ce flag dans votre prise de contact pour un échange prioritaire.`,

    sudo: `<span class="error">Permission denied: 'secops' is not in the sudoers file. Tentative journalisée dans le SOC Cieluxtelecom.</span>`,

    matrix: `<span class="success">01000010 01000101 01010100 01001000 01011001 00100000 01000110 01000001 01010100 01000001 01001011 01001001
INITIALISATION DU PROTOCOLE CIPHER...
ACCÈS AU MAINFRAME SÉCURISÉ EFFECTUÉ // BETHY FATAKI.</span>`
  };

  let commandHistory = [];
  let historyPointer = -1;

  function executeTerminalCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    commandHistory.push(cmd);
    historyPointer = commandHistory.length;

    // Append user command
    const cmdLine = document.createElement('div');
    cmdLine.innerHTML = `<span class="terminal-prompt">secops@fataki-lab:~$</span> <span style="color:#fff;">${escapeHtml(cmdRaw)}</span>`;
    terminalHistory.appendChild(cmdLine);

    if (cmd === 'clear') {
      terminalHistory.innerHTML = '';
      return;
    }

    // Process response
    const outputElem = document.createElement('div');
    outputElem.className = 'terminal-output';

    if (commandResponses[cmd]) {
      outputElem.innerHTML = commandResponses[cmd];
    } else if (cmd.startsWith('cat ')) {
      const file = cmd.substring(4).trim();
      if (file === 'flag.txt' || file === 'flag') {
        outputElem.innerHTML = commandResponses.flag;
      } else {
        outputElem.innerHTML = `<span class="error">cat: ${escapeHtml(file)}: Fichier introuvable. Tapez 'help'.</span>`;
      }
    } else {
      outputElem.innerHTML = `<span class="error">Commande non reconnue: '${escapeHtml(cmd)}'. Tapez 'help' pour la liste des instructions.</span>`;
    }

    terminalHistory.appendChild(outputElem);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        terminalInput.value = '';
        executeTerminalCommand(val);
      } else if (e.key === 'ArrowUp') {
        if (historyPointer > 0) {
          historyPointer--;
          terminalInput.value = commandHistory[historyPointer] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (historyPointer < commandHistory.length - 1) {
          historyPointer++;
          terminalInput.value = commandHistory[historyPointer] || '';
        } else {
          historyPointer = commandHistory.length;
          terminalInput.value = '';
        }
      }
    });

    // Quick pills execution
    quickPillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          terminalInput.value = cmd;
          executeTerminalCommand(cmd);
          terminalInput.value = '';
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
   * 5. PROJECT FILTERING BAR
   * ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
   * 6. PROJECT & CVE MODALS WITH DETAILED CASE STUDIES
   * ------------------------------------------------------------------------ */
  const modalOverlay = document.getElementById('project-modal');
  const modalDynamicContent = document.getElementById('modal-dynamic-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  const caseStudyData = {
    "radio-opt": {
      title: "Étude de Cas : Fine-Tuning Radio & Optimisation 54 Sites FAI",
      badge: "TÉLÉCOMS & COUVERTURE RADIO",
      img: "./assets/project-aegis.jpg",
      context: "Mission stratégique pour le FAI Cieluxtelecom visant à optimiser la qualité de service et la couverture radio sur la ville de Kinshasa.",
      challenge: "Face à la saturation des canaux et aux interférences spectrales, de nombreux abonnés subissaient des pertes de paquets et des ralentissements de débit lors des heures de pointe.",
      solution: "Réalisation d'un site survey approfondi, analyse de la propagation électromagnétique avec analyseurs RF, réalignement des faisceaux hertziens Alvarion WiMAX et reconfiguration fine des paramètres QoS sur les routeurs Cisco.",
      results: [
        "Fine-tuning validé avec succès sur 54 sites radio stratégiques",
        "Élimination totale de la congestion du trafic réseau dans les canaux critiques",
        "Signal fluide, stable et débit garanti pour l'ensemble des abonnés du FAI"
      ]
    },
    "vsat-infra": {
      title: "Étude de Cas : Déploiement Boucle Locale & Liaisons V-SAT",
      badge: "INFRASTRUCTURE & V-SAT",
      img: "./assets/project-shadowtrace.jpg",
      context: "Conception, installation et maintenance des infrastructures critiques d'interconnexion pour des entreprises clientes et institutions.",
      challenge: "Raccorder des sites distants et isolés tout en maintenant une continuité d'activité sans faille et une intégration transparente de la téléphonie VoIP intranet.",
      solution: "Déploiement d'antennes paraboliques V-SAT, configuration des transpondeurs satellite, mise en place de la boucle locale et routage dynamique multi-sites via Cisco, Microtik et Juniper.",
      results: [
        "Disponibilité réseau de 99.9% constatée sur les sites critiques raccordés",
        "Intégration VoIP d'entreprise avec qualité vocale haute définition et zéro jitter",
        "Architecture résiliente avec bascule automatique de secours en cas d'incident"
      ]
    },
    "forensic-rdc": {
      title: "Étude de Cas : Méthodologie Forensic SI Hybrides en RDC",
      badge: "RECHERCHE FORENSIC & SI HYBRIDES",
      img: "./assets/project-vaultbreaker.jpg",
      context: "Projet de recherche appliquée mené pour répondre aux défis spécifiques de cybercriminalité et d'investigation numérique en Afrique centrale.",
      challenge: "L'absence de protocoles standardisés pour collecter, figer et analyser les preuves numériques dans des architectures mêlant serveurs locaux et services Cloud (Azure/AWS), rendant les investigations vulnérables à la contestation légale.",
      solution: "Élaboration d'un cadre méthodologique complet d'investigation forensic : chaîne de traçabilité des preuves (chain of custody), extraction des artefacts mémoire et disque sous Linux/Windows, et analyse des journaux d'audit conformes à ISO/CEI 27001.",
      results: [
        "Méthodologie novatrice adaptée aux contraintes d'infrastructures en République Démocratique du Congo",
        "Protocoles d'investigation applicables lors d'incidents de sécurité en environnements hybrides",
        "Transmission académique intégrée dans le cursus d'administration système à l'ISCK"
      ]
    },
    // Alias rétro-compatibilité
    aegis: {
      title: "Étude de Cas : Fine-Tuning Radio & Optimisation 54 Sites FAI",
      badge: "TÉLÉCOMS & COUVERTURE RADIO",
      img: "./assets/project-aegis.jpg",
      context: "Optimisation de couverture pour le FAI Cieluxtelecom sur 54 sites radio à Kinshasa.",
      challenge: "Saturation et congestion du trafic réseau impactant la qualité de service des abonnés.",
      solution: "Recalibrage des faisceaux hertziens WiMAX Alvarion et réglage QoS sur équipements Cisco.",
      results: [
        "54 sites radio optimisés",
        "Suppression des congestions réseau",
        "Connectivité haut débit fluide pour les abonnés"
      ]
    },
    shadowtrace: {
      title: "Étude de Cas : Déploiement Boucle Locale & V-SAT",
      badge: "INFRASTRUCTURE & V-SAT",
      img: "./assets/project-shadowtrace.jpg",
      context: "Raccordement de sites distants critiques et intégration VoIP.",
      challenge: "Continuité de service et raccordement de zones enclavées sans perte de signal.",
      solution: "Installation de liaisons V-SAT et routage Cisco/Microtik/Juniper.",
      results: [
        "99.9% de disponibilité",
        "Téléphonie VoIP intranet opérationnelle",
        "Basculement de secours automatique"
      ]
    },
    vaultbreaker: {
      title: "Étude de Cas : Méthodologie Forensic SI Hybrides en RDC",
      badge: "RECHERCHE FORENSIC & SI HYBRIDES",
      img: "./assets/project-vaultbreaker.jpg",
      context: "Recherche sur l'investigation numérique dans les environnements hybrides en RDC.",
      challenge: "Garantir la traçabilité des preuves lors d'incidents de sécurité.",
      solution: "Cadre méthodologique rigoureux basé sur ISO/CEI 27001 et forensic Linux/Windows.",
      results: [
        "Modèle d'investigation forensic standardisé",
        "Chaîne de conservation des preuves numériques",
        "Enseignement dispensé aux étudiants de l'ISCK"
      ]
    }
  };

  const cveData = {
    "cve-1": {
      id: "FORENSIC-RDC",
      cvss: "RECHERCHE MAJEURE",
      vector: "DOMAINE: INVESTIGATION NUMÉRIQUE // SI HYBRIDES",
      title: "Méthodologie d'Investigation Forensic des Incidents de Sécurité",
      target: "Systèmes d'Information Hybrides (Afrique Centrale / RDC)",
      details: "Travaux de recherche fondamentale et appliquée axés sur la formalisation de démarches d'investigation forensic face aux compromissions dans les architectures distribuées (sur site et cloud). Analyse de la mémoire volatile, extraction de journaux d'audit et préservation rigoureuse de la chaîne de preuve numérique.",
      timeline: "Thèse & travaux de recherche engagés depuis 2019 | Présentation académique à l'ISCK | Validation des démarches méthodologiques."
    },
    "cve-2": {
      id: "AUDIT-ISO-27001",
      cvss: "ISO/CEI 27001",
      vector: "NORME SECTORIELLE: SÉCURITÉ DE L'INFORMATION",
      title: "Audit de Conformité & Évaluation des Risques Sécurité FAI",
      target: "Infrastructures Réseaux Cieluxtelecom & Backbone Opérateur",
      details: "Réalisation d'audits de sécurité exhaustifs en vérifiant la stricte conformité aux normes et recommandations sectorielles ISO/CEI 27001. Identification des vulnérabilités d'équipements, sensibilisation des utilisateurs aux cyberattaques et renforcement des politiques de sécurité des systèmes d'information (PSSI).",
      timeline: "Mission CDI Cieluxtelecom (2011-2012) | Rapport exécutif validé par la direction | Plan de remédiation appliqué avec succès."
    },
    "cve-3": {
      id: "DB-HARDENING",
      cvss: "SÉCURISATION DB",
      vector: "CIBLE: BASES DE DONNÉES // MySQL & PostgreSQL",
      title: "Sécurisation & Optimisation Bases de Données contre les Intrusions",
      target: "Serveurs de Données MySQL & PostgreSQL d'Entreprise",
      details: "Déploiement de mesures de durcissement avancées visant à prévenir les intrusions non autorisées et les fuites de données confidentielles. Audit et optimisation des requêtes SQL, ajustement des index de performance et rédaction de politiques conformes aux normes industrielles.",
      timeline: "Procédures de sécurité implémentées | Audit périodique de conformité | Zéro fuite de données recensée."
    },
    "cve-4": {
      id: "RADIO-QOS-54",
      cvss: "OPTIMISATION RF",
      vector: "COUVERTURE: 54 SITES RADIO // KINSHASA",
      title: "Fine-Tuning Radio & Résolution de la Congestion Réseau",
      target: "54 Sites Radio & Boucle Locale Télécoms",
      details: "Audit radio complet et fine-tuning de 54 sites radio du FAI Cieluxtelecom. Mesure de signaux, réorientation d'antennes et paramétrage des protocoles de communication pour éliminer les engorgements de trafic et optimiser la qualité de service offerte aux abonnés.",
      timeline: "Campagne de mesure terrain | Ajustement des faisceaux et stations | Fluidification intégrale du service Internet."
    }
  };

  function openModal(html) {
    if (modalDynamicContent && modalOverlay) {
      modalDynamicContent.innerHTML = html;
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Open Project Modal
  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = caseStudyData[projKey];
      if (data) {
        const resultsList = data.results.map(r => `<li style="margin-bottom: 6px;">✓ ${escapeHtml(r)}</li>`).join('');
        const content = `
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-primary); margin-bottom: 8px;">
            // ÉTUDE DE CAS COMPLÈTE : [${data.badge}]
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: #fff; margin-bottom: 16px;">
            ${escapeHtml(data.title)}
          </h2>
          <div style="width: 100%; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; margin-bottom: 24px; border: 1px solid var(--border-cyber);">
            <img src="${data.img}" style="width: 100%; height: 100%; object-fit: cover;" alt="${escapeHtml(data.title)}">
          </div>
          <div style="font-size: 0.95rem; line-height: 1.7; color: var(--text-muted); display: flex; flex-direction: column; gap: 16px;">
            <div>
              <strong style="color: #fff; font-family: var(--font-mono); font-size: 0.85rem;">&gt; Contexte Opérationnel :</strong>
              <p>${escapeHtml(data.context)}</p>
            </div>
            <div>
              <strong style="color: #fff; font-family: var(--font-mono); font-size: 0.85rem;">&gt; Problématique &amp; Vecteur de Menace :</strong>
              <p>${escapeHtml(data.challenge)}</p>
            </div>
            <div>
              <strong style="color: #fff; font-family: var(--font-mono); font-size: 0.85rem;">&gt; Solution Technique Apportée :</strong>
              <p>${escapeHtml(data.solution)}</p>
            </div>
            <div style="background: rgba(0, 255, 135, 0.08); border-left: 3px solid var(--emerald-accent); padding: 14px 18px; border-radius: 0 8px 8px 0;">
              <strong style="color: var(--emerald-accent); font-family: var(--font-mono); font-size: 0.85rem;">&gt; Résultats Mesurables &amp; ROI Sécurité :</strong>
              <ul style="list-style: none; margin-top: 8px; color: #e2e8f0; font-family: var(--font-mono); font-size: 0.82rem;">
                ${resultsList}
              </ul>
            </div>
          </div>
          <div style="margin-top: 24px; text-align: right;">
            <a href="#contact" class="btn btn-primary btn-sm" onclick="document.getElementById('project-modal').classList.remove('active'); document.body.style.overflow='';">
              Discuter d'un besoin similaire
            </a>
          </div>
        `;
        openModal(content);
      }
    });
  });

  // Open CVE Modal
  document.querySelectorAll('.open-cve-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const cveKey = btn.getAttribute('data-cve');
      const data = cveData[cveKey];
      if (data) {
        const content = `
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--rose-accent); margin-bottom: 8px;">
            // BULLETIN DE SÉCURITÉ OFFICIEL : [DIVULGATION RESPONSABLE]
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
            <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: #fff;">
              ${escapeHtml(data.id)}
            </h2>
            <span class="cvss-badge cvss-critical">${escapeHtml(data.cvss)}</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--cyan-primary); margin-bottom: 20px;">
            Vecteur : ${escapeHtml(data.vector)}
          </div>
          <div style="font-size: 0.95rem; line-height: 1.7; color: var(--text-muted); display: flex; flex-direction: column; gap: 16px;">
            <div>
              <strong style="color: #fff; font-family: var(--font-mono); font-size: 0.85rem;">&gt; Intitulé de la Vulnérabilité :</strong>
              <p style="color: #fff; font-size: 1.1rem; font-weight: 600;">${escapeHtml(data.title)}</p>
            </div>
            <div>
              <strong style="color: #fff; font-family: var(--font-mono); font-size: 0.85rem;">&gt; Cible / Équipement Affecté :</strong>
              <p>${escapeHtml(data.target)}</p>
            </div>
            <div>
              <strong style="color: #fff; font-family: var(--font-mono); font-size: 0.85rem;">&gt; Analyse Technique &amp; Exploitation :</strong>
              <p>${escapeHtml(data.details)}</p>
            </div>
            <div style="background: rgba(0, 242, 254, 0.06); border: 1px solid var(--border-cyber); padding: 14px 18px; border-radius: 8px;">
              <strong style="color: var(--cyan-primary); font-family: var(--font-mono); font-size: 0.85rem;">&gt; Chronologie de Divulgation Responsable :</strong>
              <p style="margin-top: 6px; font-family: var(--font-mono); font-size: 0.82rem; color: #cbd5e1;">${escapeHtml(data.timeline)}</p>
            </div>
          </div>
          <div style="margin-top: 24px; text-align: right;">
            <button class="btn btn-outline btn-sm" onclick="document.getElementById('project-modal').classList.remove('active'); document.body.style.overflow='';">
              Fermer le Rapport
            </button>
          </div>
        `;
        openModal(content);
      }
    });
  });

  /* ------------------------------------------------------------------------
   * 7. INTERACTIVE AUDIT ESTIMATOR / CALCULATOR
   * ------------------------------------------------------------------------ */
  const targetChips = document.querySelectorAll('#target-chips .chip-option');
  const goalChips = document.querySelectorAll('#goal-chips .chip-option');
  const scaleChips = document.querySelectorAll('#scale-chips .chip-option');

  const calcTitle = document.getElementById('calc-title');
  const calcMethod = document.getElementById('calc-method');
  const calcDuration = document.getElementById('calc-duration');
  const calcReport = document.getElementById('calc-report');

  let selectedTarget = 'network';
  let selectedGoal = 'iso';
  let selectedScale = 'medium';

  function setupChipGroup(chips, onSelect) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        onSelect(chip);
        updateEstimate();
      });
    });
  }

  setupChipGroup(targetChips, (chip) => { selectedTarget = chip.getAttribute('data-type'); });
  setupChipGroup(goalChips, (chip) => { selectedGoal = chip.getAttribute('data-goal'); });
  setupChipGroup(scaleChips, (chip) => { selectedScale = chip.getAttribute('data-scale'); });

  function updateEstimate() {
    let title = "Audit de Sécurité Réseaux (ISO 27001)";
    let method = "ISO/CEI 27001 + Analyse de Risques";
    let duration = "6 à 10 Jours / Homme";
    let report = "Matrice des écarts & Plan de durcissement";

    // Target logic
    const targetNames = {
      network: "Infrastructures Réseaux",
      soc: "Supervision SOC & ISO 27001",
      cloud: "Systèmes & SI Hybrides",
      db: "Bases de Données",
      vsat: "Liaisons V-SAT & Radio",
      web: "Applications Web & API",
      ad: "Active Directory",
      mobile: "Application Mobile",
      k8s: "Cluster Kubernetes"
    };

    const targetLabel = targetNames[selectedTarget] || "Infrastructure";

    // Goal logic
    if (selectedGoal === 'iso' || selectedGoal === 'compliance') {
      title = `Audit de Sécurité & Conformité ISO 27001 (${targetLabel})`;
      method = "Norme ISO/CEI 27001 + Matrice des Risques";
      report = "Matrice des écarts, plan de remédiation & PSSI";
    } else if (selectedGoal === 'forensic') {
      title = `Investigation Forensic & Réponse Incidents (${targetLabel})`;
      method = "Méthodologie Forensic SI Hybrides + Traçabilité Preuves";
      report = "Rapport d'expertise forensic, chronologie d'attaque & IoC";
    } else if (selectedGoal === 'tuning') {
      title = `Optimisation QoS & Fine-Tuning Radio (${targetLabel})`;
      method = "Audit Spectral RF + Analyse Propagation & Décongestion";
      report = "Cartographie de couverture & rapport d'optimisation QoS";
    } else if (selectedGoal === 'hardening' || selectedGoal === 'code') {
      title = `Durcissement Système, Réseau & DB (${targetLabel})`;
      method = "CIS Benchmarks + Durcissement Cisco/Linux/MySQL";
      report = "Playbooks de durcissement & tests de non-régression";
    } else if (selectedGoal === 'pentest') {
      title = `Audit & Test de Pénétration (${targetLabel})`;
      method = "Méthodologie Pentest Cisco + Exploitation Filaire & Sans-fil";
      report = "Rapport d'intrusion technique, PoC, cartographie des failles & remédiation";
    } else if (selectedGoal === 'redteam') {
      title = `Simulation d'Intrusion Réseau (${targetLabel})`;
      method = "Scénarios Réalistes + Tests d'Évasion";
      report = "Journal d'intrusion & préconisations SOC";
    }

    // Scale calculation
    if (selectedScale === 'small') {
      duration = (selectedGoal === 'forensic') ? "5 à 8 Jours / Homme" : "3 à 5 Jours / Homme";
    } else if (selectedScale === 'medium') {
      duration = (selectedGoal === 'forensic') ? "10 à 15 Jours / Homme" : "6 à 10 Jours / Homme";
    } else if (selectedScale === 'large') {
      duration = (selectedGoal === 'forensic') ? "18 à 30 Jours / Homme" : "12 à 20 Jours / Homme";
    }

    if (calcTitle) calcTitle.textContent = title;
    if (calcMethod) calcMethod.textContent = method;
    if (calcDuration) calcDuration.textContent = duration;
    if (calcReport) calcReport.textContent = report;
  }

  /* ------------------------------------------------------------------------
   * 8. CLIPBOARD COPY & TOAST NOTIFICATION
   * ------------------------------------------------------------------------ */
  const toastNotice = document.getElementById('toast-notice');
  const toastMsg = document.getElementById('toast-msg');

  function showToast(message) {
    if (!toastNotice || !toastMsg) return;
    toastMsg.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-clipboard');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copié : ${textToCopy.slice(0, 32)}...`);
        }).catch(() => {
          showToast('Texte copié !');
        });
      }
    });
  });

  /* ------------------------------------------------------------------------
   * 9. CONTACT FORM SIMULATION
   * ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const submitContactBtn = document.getElementById('submit-contact-btn');

  if (contactForm && submitContactBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originalText = submitContactBtn.innerHTML;
      submitContactBtn.innerHTML = `
        <span class="brand-pulse"></span>
        <span>Chiffrement de la requête en cours...</span>
      `;
      submitContactBtn.disabled = true;

      setTimeout(() => {
        submitContactBtn.innerHTML = `
          <span>✓ Message Sécurisé Transmis !</span>
        `;
        submitContactBtn.style.background = 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)';
        showToast("Demande envoyée avec succès ! Réponse sous 24h ouvrées.");

        setTimeout(() => {
          contactForm.reset();
          submitContactBtn.innerHTML = originalText;
          submitContactBtn.style.background = '';
          submitContactBtn.disabled = false;
        }, 4000);
      }, 1200);
    });
  }

  /* ------------------------------------------------------------------------
   * 10. HEADER SCROLL & MOBILE MENU
   * ------------------------------------------------------------------------ */
  const siteHeader = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (siteHeader) {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.textContent = '☰';
      });
    });
  }

  /* ------------------------------------------------------------------------
   * 11. LIVE FOOTER TELEMETRY CLOCK
   * ------------------------------------------------------------------------ */
  const footerTime = document.getElementById('footer-time');
  function updateTelemetryClock() {
    if (footerTime) {
      const now = new Date();
      const utcString = now.toUTCString().split(' ')[4] + ' UTC';
      footerTime.textContent = `● UTC: ${utcString}`;
    }
  }
  setInterval(updateTelemetryClock, 1000);
  updateTelemetryClock();

});
