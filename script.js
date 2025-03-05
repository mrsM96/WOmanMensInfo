document.getElementById('trackerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    let duration = parseInt(document.getElementById('duration').value);
    let initialColor = document.getElementById('initialColor').value;
    let color = document.getElementById('color').value;
    let usualHaidh = parseInt(document.getElementById('usualHaidh').value);
    let purityDaysInput = document.getElementById('purityDays').value;
    let purityDays = purityDaysInput === '' ? null : parseInt(purityDaysInput);

    let result = '';
    let note = '';
    const haidhColors = ['dark', 'light', 'brown'];
    const defaultPurity = 15;

    // Determine purity days if unknown
    let effectivePurity = purityDays !== null ? purityDays : defaultPurity;

    // Shafi’i Haidh Logic
    if (duration >= 1 && duration <= 15) {
        if (haidhColors.includes(initialColor)) {
            if (haidhColors.includes(color) || color === 'yellow') {
                if (effectivePurity >= 15) {
                    result = `This is likely *haidh* (Shafi’i). You're excused from prayer and fasting for ${duration} days. Perform ghusl when it stops.`;
                } else if (effectivePurity >= 10) {
                    result = `Purity (${effectivePurity} days) is 10–14 days. Likely *haidh* if this matches your pattern. No prayer/fasting for ${duration} days.`;
                } else {
                    result = `Purity (${effectivePurity} days) is less than 10—likely *istihadhah*. Continue praying with wudu.`;
                }
            } else if (color === 'white' || color === 'none') {
                result = `Bleeding stopped with ${color === 'white' ? 'white, clear discharge' : 'a clean vagina'}. *Haidh* has ended after ${duration} days. Perform ghusl and resume prayer/fasting.`;
                if (duration < usualHaidh) {
                    note = `If bleeding resumes later this evening or tomorrow, it’s still considered part of this *haidh*.`;
                }
            } else {
                result = `Current state isn’t typical for *haidh*. Consult a scholar.`;
            }
        } else if (initialColor === 'yellow') {
            if (haidhColors.includes(color)) {
                if (effectivePurity >= 15 && usualHaidh <= 15) {
                    result = `Initial yellow followed by ${color} is *haidh* (Shafi’i). No prayer/fasting for ${duration} days. Perform ghusl when it stops.`;
                } else if (effectivePurity >= 10) {
                    result = `Purity (${effectivePurity} days) is 10–14. Likely *haidh* if this matches your pattern. No prayer/fasting for ${duration} days.`;
                } else {
                    result = `Purity (${effectivePurity} days) is less than 10—likely *istihadhah*. Continue praying with wudu.`;
                }
            } else if (color === 'yellow') {
                result = `Initial and current yellow is vaginal discharge, not *haidh*. Continue praying and fasting.`;
            } else if (color === 'white' || color === 'none') {
                result = `Yellow followed by ${color === 'white' ? 'white, clear discharge' : 'no discharge'} suggests no *haidh* occurred. Continue praying/fasting normally.`;
            }
        }
    } else if (duration > 15) {
        result = `Bleeding beyond 15 days is *istihadhah*. Resume prayer with wudu after day 15.`;
    } else {
        result = `Duration less than 1 day is not *haidh*. It may be spotting—consult a scholar.`;
    }

    // Handle unknown purity
    if (purityDays === null) {
        if (usualHaidh > 10) {
            note += ` (Purity unknown, assuming 15 days based on usual cycle leaning toward *haidh*.)`;
        } else if (usualHaidh <= 10) {
            note += ` (Purity unknown, usual cycle short—may lean toward *istihadhah*.)`;
        }
    }

    // Display result and note
    const resultElement = document.getElementById('result');
    resultElement.innerText = result;
    if (note) {
        resultElement.setAttribute('data-note', note);
    } else {
        resultElement.removeAttribute('data-note');
    }
});