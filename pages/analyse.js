// RIZZVERSE Analyse Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const uploadPreview = document.getElementById('uploadPreview');
    const addMessageBtn = document.getElementById('addMessageBtn');
    const messagesList = document.getElementById('messagesList');
    const contextInput = document.getElementById('contextInput');
    const analyseBtn = document.getElementById('analyseBtn');
    
    const processingState = document.getElementById('processingState');
    const resultState = document.getElementById('resultState');
    const initialState = document.getElementById('initialState');
    const analyseAgainBtn = document.getElementById('analyseAgainBtn');
    
    let messages = [];
    
    // Upload zone
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--primary-pink)';
        uploadZone.style.background = 'rgba(255, 61, 154, 0.1)';
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        uploadZone.style.background = 'transparent';
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        uploadZone.style.background = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
    
    function handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadPreview.innerHTML = `
                <img src="${e.target.result}" alt="Screenshot" style="width: 100%; border-radius: 12px; max-height: 200px; object-fit: cover;">
                <p style="text-align: center; margin-top: 8px; font-size: 12px; color: var(--accent-soft);">✓ ${file.name}</p>
            `;
            uploadPreview.style.display = 'block';
            
            // Demo: Add some messages
            messages = [
                { sender: 'Them', content: 'hey, how was your day?' },
                { sender: 'Me', content: 'pretty good tbh, just finished watching a terrible romcom lmaoo' },
                { sender: 'Them', content: 'a terrible romcom sounds like perfect movie night material fr' }
            ];
            renderMessages();
        };
        reader.readAsDataURL(file);
    }
    
    // Add message
    addMessageBtn.addEventListener('click', () => {
        messages.push({ sender: messages.length % 2 === 0 ? 'Them' : 'Me', content: '' });
        renderMessages();
    });
    
    function renderMessages() {
        messagesList.innerHTML = '';
        messages.forEach((msg, idx) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message-item';
            msgDiv.innerHTML = `
                <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <select class="input-select" style="width: 80px;" onchange="updateMessage(${idx}, 'sender', this.value)">
                        <option value="Them" ${msg.sender === 'Them' ? 'selected' : ''}>Them</option>
                        <option value="Me" ${msg.sender === 'Me' ? 'selected' : ''}>Me</option>
                    </select>
                    <input type="text" class="input-text" style="flex: 1;" placeholder="Message..." 
                           value="${msg.content}" onchange="updateMessage(${idx}, 'content', this.value)">
                    <button onclick="removeMessage(${idx})" style="background: transparent; border: none; color: #ef4444; cursor: pointer;">×</button>
                </div>
            `;
            messagesList.appendChild(msgDiv);
        });
    }
    
    window.updateMessage = (idx, field, value) => {
        messages[idx][field] = value;
    };
    
    window.removeMessage = (idx) => {
        messages.splice(idx, 1);
        renderMessages();
    };
    
    // Analyse
    analyseBtn.addEventListener('click', async () => {
        if (messages.length === 0 || messages.every(m => !m.content.trim())) {
            alert('Please add some conversation messages');
            return;
        }
        
        initialState.style.display = 'none';
        resultState.style.display = 'none';
        processingState.style.display = 'block';
        
        // Animate processing steps
        const steps = document.querySelectorAll('.processing-step');
        steps.forEach((step, idx) => {
            setTimeout(() => {
                step.classList.add('active');
            }, (idx + 1) * 800);
        });
        
        // Wait for processing animation
        await new Promise(r => setTimeout(r, 5000));
        
        // Get analysis
        const context = contextInput.value;
        const analysis = await window.rizzAI.analyzeConversation(messages, context);
        
        // Show results
        processingState.style.display = 'none';
        resultState.style.display = 'block';
        
        // Animate score
        const score = analysis.rizzScore;
        const scoreProgress = document.getElementById('scoreProgress');
        const scoreNumber = document.getElementById('scoreNumber');
        const vibeText = document.getElementById('vibeText');
        const verdictText = document.getElementById('verdictText');
        const suggestionsList = document.getElementById('suggestionsList');
        
        // Calculate stroke dasharray
        const circumference = 2 * Math.PI * 88;
        const offset = circumference - (score / 100) * circumference;
        scoreProgress.style.strokeDasharray = circumference;
        scoreProgress.style.strokeDashoffset = circumference;
        
        setTimeout(() => {
            scoreProgress.style.transition = 'stroke-dashoffset 2s ease';
            scoreProgress.style.strokeDashoffset = offset;
        }, 100);
        
        // Animate number
        let current = 0;
        const increment = score / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= score) {
                current = score;
                clearInterval(timer);
            }
            scoreNumber.textContent = Math.floor(current);
        }, 40);
        
        vibeText.textContent = analysis.vibe;
        verdictText.textContent = analysis.verdict;
        
        suggestionsList.innerHTML = '';
        analysis.whatToDoNext.forEach((suggestion, idx) => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                <span class="suggestion-number">${idx + 1}.</span>
                <span>${suggestion}</span>
            `;
            suggestionsList.appendChild(div);
        });
    });
    
    // Analyse again
    analyseAgainBtn.addEventListener('click', () => {
        resultState.style.display = 'none';
        initialState.style.display = 'block';
        messages = [];
        renderMessages();
        uploadPreview.style.display = 'none';
        fileInput.value = '';
        contextInput.value = '';
        document.querySelectorAll('.processing-step').forEach(step => {
            step.classList.remove('active');
        });
    });
});
