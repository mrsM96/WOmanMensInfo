document.addEventListener('DOMContentLoaded', function() {
    const qaContainer = document.getElementById('qaContainer');
    const questionDiv = document.getElementById('question');
    const inputArea = document.getElementById('inputArea');
    const nextBtn = document.getElementById('nextBtn');
    const resultP = document.getElementById('result');
    const languageSelect = document.getElementById('language');
    const introP = document.querySelector('main p');
    const suggestionInput = document.getElementById('suggestionInput');
    const submitSuggestion = document.getElementById('submitSuggestion');
    const commentsDiv = document.getElementById('comments');

    let step = 1;
    let answers = {};
    let askDaysInstead = false;
    let currentLang = 'en';

    const texts = {
        en: {
            title: 'Muslimah Knows Her Day',
            intro: 'Answer step-by-step to determine *haidh* or *istihadhah* (Shafi’i)',
            next: 'Next',
            q1: 'When did the bleeding start?',
            q2: 'What was the initial color of the bleeding?',
            q3Hours: 'How many hours has the bleeding lasted so far?',
            q3Days: 'How many days has the bleeding lasted so far?',
            q4: 'How many days were you free of bleeding before this started? (Leave blank if unsure)',
            q5: 'If unsure about purity days, when did your last menstruation start?',
            q6: 'What is the current state of your bleeding?',
            colors: {
                dark: 'Dark red or black, thick',
                light: 'Thin red',
                brown: 'Brownish',
                yellow: 'Yellowish',
                white: 'White, clear discharge',
                none: 'None (bleeding stopped, vagina clean)'
            },
            results: {
                istihadhahShort: 'Bleeding less than 24 hours is *istihadhah*. Continue praying with wudu.',
                haidh: 'This is likely *haidh* (Shafi’i). You’re excused from prayer and fasting for {days} days. Perform ghusl when it stops.',
                haidhEnd: 'Bleeding stopped with {state}. *Haidh* has ended after {days} days. Perform ghusl and resume prayer/fasting.',
                istihadhahLong: 'Bleeding beyond 15 days is *istihadhah*. Resume prayer with wudu after day 15.',
                yellowDischarge: 'Initial and current yellow is vaginal discharge, not *haidh*. Continue praying and fasting.',
                yellowNoHaidh: 'Yellow followed by {state} suggests no *haidh* occurred. Continue praying/fasting normally.',
                unclear: 'Current state isn’t typical for *haidh*. Consult a scholar.',
                purityShort: 'Purity ({days} days) too short—likely *istihadhah*. Continue praying with wudu.'
            },
            suggestionTitle: 'Your Suggestions',
            suggestionPlaceholder: 'Share your thoughts...'
        },
        bm: {
            title: 'Muslimah Tahu Harinya',
            intro: 'Jawab langkah demi langkah untuk menentukan *haidh* atau *istihadhah* (Mazhab Shafi’i)',
            next: 'Seterusnya',
            q1: 'Bilakah pendarahan bermula?',
            q2: 'Apakah warna awal pendarahan?',
            q3Hours: 'Berapa jam pendarahan telah berlangsung setakat ini?',
            q3Days: 'Berapa hari pendarahan telah berlangsung setakat ini?',
            q4: 'Berapa hari anda bebas dari pendarahan sebelum ini bermula? (Kosongkan jika tidak pasti)',
            q5: 'Jika tidak pasti tentang hari suci, bilakah haid terakhir anda bermula?',
            q6: 'Apakah keadaan pendarahan anda sekarang?',
            colors: {
                dark: 'Merah gelap atau hitam, pekat',
                light: 'Merah cair',
                brown: 'Kekuningan',
                yellow: 'Kuning',
                white: 'Putih, jernih',
                none: 'Tiada (pendarahan berhenti, faraj bersih)'
            },
            results: {
                istihadhahShort: 'Pendarahan kurang dari 24 jam adalah *istihadhah*. Teruskan solat dengan wuduk.',
                haidh: 'Ini mungkin *haidh* (Shafi’i). Anda dikecualikan dari solat dan puasa selama {days} hari. Mandi wajib apabila berhenti.',
                haidhEnd: 'Pendarahan berhenti dengan {state}. *Haidh* telah tamat selepas {days} hari. Mandi wajib dan sambung solat/puasa.',
                istihadhahLong: 'Pendarahan melebihi 15 hari adalah *istihadhah*. Sambung solat dengan wuduk selepas hari ke-15.',
                yellowDischarge: 'Kuning awal dan kini adalah keputihan, bukan *haidh*. Teruskan solat dan puasa.',
                yellowNoHaidh: 'Kuning diikuti {state} menunjukkan tiada *haidh*. Teruskan solat/puasa seperti biasa.',
                unclear: 'Keadaan kini tidak tipikal untuk *haidh*. Rujuk kepada ulama.',
                purityShort: 'Kesucian ({days} hari) terlalu pendek—mungkin *istihadhah*. Teruskan solat dengan wuduk.'
            },
            suggestionTitle: 'Cadangan Anda',
            suggestionPlaceholder: 'Kongsi pendapat anda...'
        }
    };

    function updateLanguage() {
        currentLang = languageSelect.value;
        document.querySelector('header h1').textContent = texts[currentLang].title;
        introP.textContent = texts[currentLang].intro;
        nextBtn.textContent = texts[currentLang].next;
        document.querySelector('#suggestionBox h2').textContent = texts[currentLang].suggestionTitle;
        suggestionInput.placeholder = texts[currentLang].suggestionPlaceholder;
        document.querySelector('#donation p').innerHTML = `${currentLang === 'en' ? 'Support this project' : 'Sokong projek ini'}: <a href="https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID" target="_blank">Donate via PayPal</a>`;
        if (step <= 6) showQuestion();
        else calculateResult();
    }

    languageSelect.addEventListener('change', updateLanguage);

    function showQuestion() {
        inputArea.innerHTML = '';
        nextBtn.style.display = 'block';
        resultP.style.display = 'none';

        switch (step) {
            case 1:
                questionDiv.textContent = texts[currentLang].q1;
                inputArea.innerHTML = '<input type="date" id="startDate" required>';
                break;
            case 2:
                questionDiv.textContent = texts[currentLang].q2;
                inputArea.innerHTML = `
                    <select id="initialColor" required>
                        <option value="dark">${texts[currentLang].colors.dark}</option>
                        <option value="light">${texts[currentLang].colors.light}</option>
                        <option value="brown">${texts[currentLang].colors.brown}</option>
                        <option value="yellow">${texts[currentLang].colors.yellow}</option>
                    </select>`;
                break;
            case 3:
                const startDate = new Date(answers[1]);
                const today = new Date('2025-03-03'); // Replace with new Date() in production
                const diffTime = today - startDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 2) {
                    askDaysInstead = true;
                    questionDiv.textContent = texts[currentLang].q3Days;
                    inputArea.innerHTML = '<input type="number" id="duration" min="2" required>';
                } else {
                    questionDiv.textContent = texts[currentLang].q3Hours;
                    inputArea.innerHTML = '<input type="number" id="duration" min="1" required>';
                }
                break;
            case 4:
                questionDiv.textContent = texts[currentLang].q4;
                inputArea.innerHTML = '<input type="number" id="purityDays" min="0">';
                break;
            case 5:
                questionDiv.textContent = texts[currentLang].q5;
                inputArea.innerHTML = '<input type="date" id="lastMensDate">';
                break;
            case 6:
                questionDiv.textContent = texts[currentLang].q6;
                inputArea.innerHTML = `
                    <select id="color" required>
                        <option value="dark">${texts[currentLang].colors.dark}</option>
                        <option value="light">${texts[currentLang].colors.light}</option>
                        <option value="brown">${texts[currentLang].colors.brown}</option>
                        <option value="yellow">${texts[currentLang].colors.yellow}</option>
                        <option value="white">${texts[currentLang].colors.white}</option>
                        <option value="none">${texts[currentLang].colors.none}</option>
                    </select>`;
                break;
        }
    }

    nextBtn.addEventListener('click', function() {
        let input;
        if (step === 1) input = document.getElementById('startDate');
        else if (step === 2) input = document.getElementById('initialColor');
        else if (step === 3) input = document.getElementById('duration');
        else if (step === 4) input = document.getElementById('purityDays');
        else if (step === 5) input = document.getElementById('lastMensDate');
        else if (step === 6) input = document.getElementById('color');

        if (step < 4 && !input.value) {
            alert(currentLang === 'en' ? 'Please answer the question.' : 'Sila jawab soalan.');
            return;
        }

        answers[step] = input.value;

        if (step === 3) {
            const duration = parseInt(answers[3]);
            if (!askDaysInstead && duration < 24) {
                showResult(texts[currentLang].results.istihadhahShort);
                return;
            }
        }

        if (step === 4 && answers[4]) {
            step = 5; // Skip to Step 6
        }

        step++;
        if (step > 6) {
            calculateResult();
        } else {
            showQuestion();
        }
    });

    function showResult(result, note = '') {
        qaContainer.style.display = 'none';
        resultP.style.display = 'block';
        resultP.innerText = result;
        if (note) resultP.setAttribute('data-note', note);
    }

    function calculateResult() {
        const startDate = new Date(answers[1]);
        const initialColor = answers[2];
        const durationInput = parseInt(answers[3]);
        const purityDays = answers[4] ? parseInt(answers[4]) : null;
        const lastMensDate = answers[5] ? new Date(answers[5]) : null;
        const currentColor = answers[6];

        const durationDays = askDaysInstead ? durationInput : Math.floor(durationInput / 24);
        const haidhColors = ['dark', 'light', 'brown'];
        let effectivePurity = purityDays;

        if (!purityDays && lastMensDate) {
            const diffTime = startDate - lastMensDate;
            effectivePurity = Math.floor(diffTime / (1000 * 60 * 60 * 24)) - 1;
        }
        if (!effectivePurity) effectivePurity = 15;

        let result = '';
        let note = '';

        if (durationDays <= 15) {
            if (haidhColors.includes(initialColor)) {
                if (haidhColors.includes(currentColor) || currentColor === 'yellow') {
                    if (effectivePurity >= 1) {
                        result = texts[currentLang].results.haidh.replace('{days}', durationDays);
                    } else {
                        result = texts[currentLang].results.purityShort.replace('{days}', effectivePurity);
                    }
                } else if (currentColor === 'white' || currentColor === 'none') {
                    const state = texts[currentLang].colors[currentColor];
                    result = texts[currentLang].results.haidhEnd.replace('{state}', state).replace('{days}', durationDays);
                } else {
                    result = texts[currentLang].results.unclear;
                }
            } else if (initialColor === 'yellow') {
                if (haidhColors.includes(currentColor)) {
                    if (effectivePurity >= 1) {
                        result = texts[currentLang].results.haidh.replace('{days}', durationDays);
                    } else {
                        result = texts[currentLang].results.purityShort.replace('{days}', effectivePurity);
                    }
                } else if (currentColor === 'yellow') {
                    result = texts[currentLang].results.yellowDischarge;
                } else if (currentColor === 'white' || currentColor === 'none') {
                    const state = texts[currentLang].colors[currentColor];
                    result = texts[currentLang].results.yellowNoHaidh.replace('{state}', state);
                }
            }
        } else {
            result = texts[currentLang].results.istihadhahLong;
        }

        showResult(result, note);
    }

    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        commentsDiv.innerHTML = '';
        comments.forEach(comment => {
            const p = document.createElement('p');
            p.textContent = comment;
            commentsDiv.appendChild(p);
        });
    }

    submitSuggestion.addEventListener('click', function() {
        const comment = suggestionInput.value.trim();
        if (comment) {
            const comments = JSON.parse(localStorage.getItem('comments') || '[]');
            comments.push(comment);
            localStorage.setItem('comments', JSON.stringify(comments));
            suggestionInput.value = '';
            loadComments();
        }
    });

    updateLanguage();
    loadComments();
});
