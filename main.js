document.addEventListener('DOMContentLoaded', () => {
    // --- API KEY & REAL-TIME VARIABLES ---
    const ASSEMBLYAI_API_KEY = "c7f2eed1fcc148328d9bccf6fa68a84e";
    let recorder;
    let socket;

    // --- ELEMENT SELECTORS ---
    const ironmanContainer = document.querySelector('.ironman-container');
    const ironmanHelmet = document.querySelector('.ironman-helmet');
    const leftEye = document.querySelector('.eye-socket.left-eye');
    const rightEye = document.querySelector('.eye-socket.right-eye');
    const arcReactor = document.querySelector('.arc-reactor');
    const mouthGrille = document.querySelector('.mouth-grille');
    const grillLines = document.querySelectorAll('.grille-line');

    // --- NEW: Avenger Selector Elements ---
    const avengerSelectors = document.querySelectorAll('.avenger-icon');
    const avengerFaces = document.querySelectorAll('.avenger-face');


    // --- STATE MANAGEMENT ---
    let fridayMode = false;
    // --- POWER MANAGEMENT ---
    let powerLevel = 100;
    const powerFill = document.querySelector('.power-fill');
    const powerPercentage = document.getElementById('power-percentage');

    function updatePowerDisplay() {
        if (powerFill && powerPercentage) {
            powerFill.style.width = powerLevel + '%';
            powerPercentage.textContent = powerLevel;
            
            // Change color based on power level
            if (powerLevel > 70) {
                powerFill.style.background = 'linear-gradient(90deg, #00FF00, #7FFF00)';
            } else if (powerLevel > 30) {
                powerFill.style.background = 'linear-gradient(90deg, #FFD700, #FFA500)';
            } else {
                powerFill.style.background = 'linear-gradient(90deg, #DC143C, #FF6347)';
            }
        }
    }

    function consumePower(amount = 1) {
        powerLevel = Math.max(0, powerLevel - amount);
        updatePowerDisplay();
        
        if (powerLevel <= 0) {
            addChatMessage("FRIDAY: Warning - Power critically low!");
            speak("Warning - Power critically low");
        }
    }

    function rechargePower(amount = 5) {
        powerLevel = Math.min(100, powerLevel + amount);
        updatePowerDisplay();
    }

    // Auto recharge slowly
    setInterval(() => {
        if (powerLevel < 100) {
            rechargePower(0.5);
        }
    }, 5000);

    // Consume power during interactions
    document.addEventListener('mousemove', () => {
        if (Math.random() < 0.001) { // Very small chance
            consumePower(0.1);
        }
    });

    // Initialize power display
    updatePowerDisplay();

    let systemStatus = 'ONLINE';
    let voiceActive = false;
    let conversationMode = false;

    // --- MOUSE TRACKING & ANIMATION ---
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    // --- SETUP EVENT LISTENERS (FIXED VERSION) ---
    function setupEventListeners() {
        // Mouse movement for helmet and eye tracking
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
            trackEyes(e);
        });

        // Interactive click handlers for Iron Man only
        if (ironmanHelmet) {
            ironmanHelmet.addEventListener('click', () => {
                if (!conversationMode) startConversation();
                else askQuestion();
            });
        }
        if (leftEye) leftEye.addEventListener('click', (e) => { e.stopPropagation(); performTargetingScan(); });
        if (rightEye) rightEye.addEventListener('click', (e) => { e.stopPropagation(); performThreatAssessment(); });
        if (arcReactor) arcReactor.addEventListener('click', (e) => { e.stopPropagation(); togglePowerMode(); });
        if (mouthGrille) mouthGrille.addEventListener('click', (e) => { e.stopPropagation(); toggleVoiceMode(); });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case ' ': e.preventDefault(); startConversation(); break;
                case 'f': toggleFridayMode(); break;
                case 's': performAdvancedScan(); break;
                case 'v': toggleVoiceMode(); break;
                case 'escape': if (conversationMode) endConversation(); break;
            }
        });
    }

    // --- CORE FUNCTION: SWITCH BETWEEN CHARACTERS (SIMPLIFIED) ---
    function switchToAvenger(avengerType) {
        // 1. Hide all character faces
        document.querySelectorAll('.avenger-face').forEach(face => {
            face.classList.remove('active');
        });

        // 2. Show the selected character's face
        const selectedFace = document.querySelector(`.avenger-face[data-avenger="${avengerType}"]`);
        if (selectedFace) {
            selectedFace.classList.add('active');
        }

        // 3. Update the active state on the selector icons
        document.querySelectorAll('.avenger-icon').forEach(icon => {
            icon.classList.remove('active');
        });
        const selectedIcon = document.querySelector(`.avenger-icon[data-avenger="${avengerType}"]`);
        if (selectedIcon) {
            selectedIcon.classList.add('active');
        }
        // The arc reactor visibility is now handled automatically! No extra code needed.
    }

    function updateCharacterSpecificPower(avengerType) {
        const powerText = document.querySelector('.power-text');
        if (powerText) {
            switch(avengerType) {
                case 'iron-man':
                    powerText.innerHTML = `ARC REACTOR: <span id="power-percentage">${powerLevel}</span>%`;
                    break;
                case 'captain-america':
                    powerText.innerHTML = `SHIELD ENERGY: <span id="power-percentage">${powerLevel}</span>%`;
                    break;
                case 'spiderman':
                    powerText.innerHTML = `WEB FLUID: <span id="power-percentage">${powerLevel}</span>%`;
                    break;
                case 'hulk':
                    powerText.innerHTML = `GAMMA RADIATION: <span id="power-percentage">${powerLevel}</span>%`;
                    break;
            }
        }
    }

    // --- SIMPLE INITIALIZATION ---
    function init() {
        createBootSequence();
        createAdvancedHUD();
        createChatInterface();
        createTranscriptionDisplay();
        createEnhancedStarfield();
        setupEventListeners();
        smoothMouseTracking();
        
        // Set up character selection - SIMPLE VERSION
        setTimeout(() => {
            document.querySelectorAll('.avenger-icon').forEach(icon => {
                icon.addEventListener('click', function() {
                    const avengerType = this.dataset.avenger;
                    switchToAvenger(avengerType);
                    
                    // Show message
                    setTimeout(() => {
                        switch(avengerType) {
                            case 'iron-man':
                                addChatMessage("FRIDAY: Iron Man suit activated.");
                                break;
                            case 'captain-america':
                                addChatMessage("FRIDAY: Captain America protocol engaged.");
                                break;
                            case 'spiderman':
                                addChatMessage("KAREN: Spider-Man systems online.");
                                break;
                            case 'hulk':
                                addChatMessage("FRIDAY: Hulk protocol engaged.");
                                break;
                        }
                    }, 100);
                });
                
                // Hover effects
                icon.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.1)';
                });
                icon.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('active')) {
                        this.style.transform = 'scale(1)';
                    }
                });
            });
            
            // Start with Iron Man
            switchToAvenger('iron-man');
        }, 500);
    }

    // --- VOICE RECOGNITION (AssemblyAI) ---
    function toggleVoiceMode() {
        voiceActive = !voiceActive;
        const transcriptionDisplay = document.getElementById('transcription-display');
        if (voiceActive) {
            addChatMessage("FRIDAY: Voice recognition activated.");
            speak("Voice recognition activated");
            ironmanHelmet.classList.add('listening');
            transcriptionDisplay.classList.add('visible');
            startVoiceRecognition();
        } else {
            addChatMessage("FRIDAY: Voice recognition deactivated.");
            speak("Voice recognition deactivated");
            ironmanHelmet.classList.remove('listening');
            transcriptionDisplay.classList.remove('visible');
            if (recorder && recorder.state === "recording") recorder.stop();
            if (socket) socket.close();
        }
        updateHUD();
    }

    async function startVoiceRecognition() {
        const transcriptionDisplay = document.getElementById('transcription-display');
        
        // 1. Check for API Key
        if (!ASSEMBLYAI_API_KEY || ASSEMBLYAI_API_KEY === "c7f2eed1fcc148328d9bccf6fa68a84e") {
            transcriptionDisplay.textContent = "Error: AssemblyAI API Key is not set.";
            speak("API Key is not set.");
            if (voiceActive) toggleVoiceMode(); // Turn off voice mode
            return;
        }

        try {
            // 2. Create the WebSocket connection
            socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${ASSEMBLYAI_API_KEY}`);

            // 3. Set up WebSocket event handlers
            socket.onmessage = (message) => {
                const res = JSON.parse(message.data);
                transcriptionDisplay.textContent = res.text || 'Listening...';
                if (res.message_type === 'FinalTranscript' && res.text) {
                    processVoiceCommand(res.text.trim().toLowerCase());
                }
            };

            socket.onerror = (event) => {
                console.error("WebSocket error:", event);
                transcriptionDisplay.textContent = "Error: Connection failed.";
                if(socket) socket.close();
            };

            socket.onclose = (event) => {
                console.log("WebSocket closed:", event);
                socket = null;
                // Stop the audio processor when connection closes
                if (window.audioProcessor) {
                    window.audioProcessor.disconnect();
                }
            };

            socket.onopen = async () => {
                // 4. Start capturing raw audio from the microphone upon successful connection
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                    const source = audioContext.createMediaStreamSource(stream);
                    
                    // The ScriptProcessorNode is used to get raw audio data
                    const processor = audioContext.createScriptProcessor(1024, 1, 1);
                    processor.onaudioprocess = (event) => {
                        if (!socket || socket.readyState !== 1) return;
                        const audioData = event.inputBuffer.getChannelData(0);
                        // Convert PCM data to Int16, then Base64
                        const pcmData = new Int16Array(audioData.length);
                        for (let i = 0; i < audioData.length; i++) {
                            pcmData[i] = audioData[i] * 0x7FFF; // Convert to 16-bit PCM
                        }
                        const base64Data = btoa(String.fromCharCode.apply(null, new Uint8Array(pcmData.buffer)));
                        socket.send(JSON.stringify({ audio_data: base64Data }));
                    };

                    source.connect(processor);
                    processor.connect(audioContext.destination); // Connect to output to avoid garbage collection
                    
                    // Store processor in a global scope to be able to disconnect it later
                    window.audioProcessor = processor;

                } catch (error) {
                    console.error("Microphone access error:", error);
                    transcriptionDisplay.textContent = "Error: Could not access microphone.";
                    if (socket) socket.close();
                }
            };

        } catch (error) {
            console.error("Error in WebSocket setup:", error);
            transcriptionDisplay.textContent = "Error: Could not initialize voice recognition.";
            speak("Could not initialize voice recognition.");
            if (voiceActive) toggleVoiceMode(); // Turn off voice mode
        }
    }

    // --- VOICE COMMANDS UPDATE ---
    function processVoiceCommand(command) {
        consumePower(2); // Voice commands use power
        
        if (command.includes('status')) {
            addChatMessage("FRIDAY: All systems operational. Power at " + powerLevel + "%.");
            speak("All systems operational");
        } else if (command.includes('scan')) {
            performAdvancedScan();
        } else if (command.includes('power')) {
            addChatMessage("FRIDAY: Arc reactor operating at " + powerLevel + "% efficiency.");
            speak("Arc reactor operating at " + powerLevel + " percent efficiency");
        } else if (command.includes('recharge')) {
            rechargePower(20);
            addChatMessage("FRIDAY: Power systems recharged to " + powerLevel + "%.");
            speak("Power systems recharged");
        } else {
            addChatMessage("FRIDAY: Command not recognized.");
            speak("Command not recognized");
        }
    }

    // --- VISUAL EFFECTS & ANIMATION ---
    function smoothMouseTracking() {
        targetX += (mouseX - targetX) * 0.1;
        targetY += (mouseY - targetY) * 0.1;
        
        // NEW: Target the active rotatable face
        const activeRotatableFace = document.querySelector('.avenger-face.active .rotatable-face');
        if (activeRotatableFace) {
            activeRotatableFace.style.transform = `rotateX(${5 - targetY}deg) rotateY(${targetX}deg)`;
        }
        
        requestAnimationFrame(smoothMouseTracking);
    }

    function trackEyes(e) {
        // NEW: Find the active face and its eyes
        const activeFace = document.querySelector('.avenger-face.active');
        if (!activeFace) return;

        const leftEye = activeFace.querySelector('.avenger-eye-left');
        const rightEye = activeFace.querySelector('.avenger-eye-right');
        
        if (!leftEye || !rightEye) return;

        const rect = activeFace.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angleX = (e.clientX - centerX) / 20;
        const angleY = (e.clientY - centerY) / 20;

        // --- CORRECTED LOGIC ---
        // Check if the active face is Iron Man to apply the special skew
        if (activeFace.dataset.avenger === 'iron-man') {
            // Preserve the original skew while adding the new translate
            leftEye.style.transform = `skew(-20deg) translateZ(65px) translate(${angleX * 0.2}px, ${angleY * 0.2}px)`;
            rightEye.style.transform = `skew(20deg) translateZ(65px) translate(${angleX * 0.2}px, ${angleY * 0.2}px)`;
        } else {
            // Apply a generic transform for all other Avengers
            leftEye.style.transform = `translate(${angleX}px, ${angleY}px)`;
            rightEye.style.transform = `translate(${angleX}px, ${angleY}px)`;
        }
    }

    function activateFridayMode() {
        // Find the currently active eyes to apply the glow
        const activeFace = document.querySelector('.avenger-face.active[data-avenger="iron-man"]');
        if (!activeFace) return; // Only works for Iron Man

        const currentLeftEye = activeFace.querySelector('.avenger-eye-left');
        const currentRightEye = activeFace.querySelector('.avenger-eye-right');

        if (currentLeftEye) currentLeftEye.style.boxShadow = '0 0 50px #00BFFF, 0 0 80px #00BFFF';
        if (currentRightEye) currentRightEye.style.boxShadow = '0 0 50px #00BFFF, 0 0 80px #00BFFF';
        
        arcReactor.style.boxShadow = '0 0 70px #00BFFF, 0 0 120px #00BFFF';
        grillLines.forEach(line => line.style.boxShadow = '0 0 20px #DC143C');
        ironmanHelmet.classList.add('glitch');
        systemStatus = 'FRIDAY ACTIVE';
    }

    function deactivateFridayMode() {
        const activeFace = document.querySelector('.avenger-face.active[data-avenger="iron-man"]');
        if (!activeFace) return;

        const currentLeftEye = activeFace.querySelector('.avenger-eye-left');
        const currentRightEye = activeFace.querySelector('.avenger-eye-right');

        if (currentLeftEye) currentLeftEye.style.boxShadow = '';
        if (currentRightEye) currentRightEye.style.boxShadow = '';

        arcReactor.style.boxShadow = '';
        grillLines.forEach(line => line.style.boxShadow = '');
        ironmanHelmet.classList.remove('glitch');
        systemStatus = 'ONLINE';
    }

    function performAdvancedScan() {
        addChatMessage("FRIDAY: Performing environmental scan...");
        speak("Performing environmental scan");
        for (let i = 0; i < 5; i++) setTimeout(() => createScanLine(), i * 200);
        setTimeout(() => {
            addChatMessage("FRIDAY: Scan complete. No anomalies detected.");
            speak("Scan complete. No anomalies detected.");
        }, 2000);
    }

    // --- UI ELEMENT CREATION & HELPERS ---
    function createBootSequence() {
        const bootDiv = document.createElement('div');
        bootDiv.className = 'boot-sequence';
        bootDiv.innerHTML = `<div>INITIALIZING INTERACTIVE SYSTEMS...</div>`;
        document.body.appendChild(bootDiv);
        setTimeout(() => speak("Interactive mode enabled."), 3000);
    }

    function createAdvancedHUD() {
        const hudHTML = `<div class="hud-element power-indicator"><div>POWER: <span id="power-level">100%</span></div><div>STATUS: <span id="system-status">ONLINE</span></div><div>VOICE: <span id="voice-status">INACTIVE</span></div></div>`;
        document.body.insertAdjacentHTML('beforeend', hudHTML);
    }

    function updateHUD() {
        document.getElementById('power-level').textContent = `${powerLevel}%`;
        document.getElementById('system-status').textContent = systemStatus;
        document.getElementById('voice-status').textContent = voiceActive ? 'ACTIVE' : 'INACTIVE';
    }

    function createChatInterface() {
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.id = 'chat-container';
        document.body.appendChild(chatContainer);
    }

    function showChatInterface() { document.getElementById('chat-container').classList.add('visible'); }
    function hideChatInterface() { document.getElementById('chat-container').classList.remove('visible'); }

    function addChatMessage(message) {
        const chatContainer = document.getElementById('chat-container');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.textContent = message;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function createTranscriptionDisplay() {
        const display = document.createElement('div');
        display.className = 'transcription-display';
        display.id = 'transcription-display';
        document.body.appendChild(display);
    }

    function createScanLine() {
        const scanLine = document.createElement('div');
        scanLine.style.cssText = `position:fixed;width:100%;height:3px;background:linear-gradient(90deg,transparent,#00BFFF,#FFF,#00BFFF,transparent);top:0;left:0;z-index:1500;animation:scanMove 2s ease-out forwards;box-shadow:0 0 20px #00BFFF;`;
        document.body.appendChild(scanLine);
        setTimeout(() => scanLine.remove(), 2000);
    }

    function createTargetingReticle() {
        const reticle = document.createElement('div');
        reticle.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:100px;height:100px;border:2px solid #F00;border-radius:50%;animation:targetPulse 2s ease-out;pointer-events:none;z-index:1000;`;
        document.body.appendChild(reticle);
        setTimeout(() => reticle.remove(), 2000);
    }

    function createEnhancedStarfield() {
        const starsContainer = document.querySelector('.stars');
        if (!starsContainer) return;
        for (let i = 0; i < 300; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 3 + 1;
            star.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:#FFF;border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:twinkle ${Math.random()*4+2}s infinite;opacity:${Math.random()*0.8+0.2};`;
            starsContainer.appendChild(star);
        }
    }

    function speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    // --- DYNAMIC CSS ---
    const style = document.createElement('style');
    style.textContent = `@keyframes scanMove{0%{top:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100vh;opacity:0}} @keyframes targetPulse{0%{transform:translate(-50%,-50%) scale(.5);opacity:0}50%{transform:translate(-50%,-50%) scale(1.2);opacity:1}100%{transform:translate(-50%,-50%) scale(2);opacity:0}}`;
    document.head.appendChild(style);

    // --- START THE APPLICATION ---
    init();

    // --- TEMPORARY DEBUG FUNCTION ---
    function debugCharacterSwitch() {
        console.log('=== DEBUG CHARACTER SWITCH ===');
        
        const faces = document.querySelectorAll('.avenger-face');
        const icons = document.querySelectorAll('.avenger-icon');
        
        console.log('Total faces found:', faces.length);
        console.log('Total icons found:', icons.length);
        
        faces.forEach(face => {
            console.log(`Face ${face.dataset.avenger}:`, {
                hasActiveClass: face.classList.contains('active'),
                display: getComputedStyle(face).display,
                opacity: getComputedStyle(face).opacity
            });
        });
        
        icons.forEach(icon => {
            console.log(`Icon ${icon.dataset.avenger}:`, {
                hasActiveClass: icon.classList.contains('active'),
                hasEventListener: icon.onclick !== null
            });
        });
        
        // Test switching
        console.log('Testing switch to captain-america...');
        switchToAvenger('captain-america');
        
        setTimeout(() => {
            console.log('After switch - Active face:', document.querySelector('.avenger-face.active')?.dataset.avenger);
        }, 500);
    }
    
    // Make it globally accessible
    window.debugCharacterSwitch = debugCharacterSwitch;
    window.switchToAvenger = switchToAvenger; // For manual testing
});