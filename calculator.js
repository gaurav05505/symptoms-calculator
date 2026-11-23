/**
 * MediCalc AI - Advanced Symptoms Calculation Engine
 * Analyzes selected symptom clusters, computes probability, severity, and medical guidance.
 */

function calculateDisease() {
    const selectedBoxes = document.querySelectorAll(".symptom-box input:checked");
    const selected = Array.from(selectedBoxes).map(cb => cb.value);

    const resultCard = document.getElementById("result-card");
    const diseaseName = document.getElementById("disease-name");
    const medicineName = document.getElementById("medicine-name");
    const severityBadge = document.getElementById("severity-badge");
    const matchScore = document.getElementById("match-score");
    const dietAdvice = document.getElementById("diet-advice");
    const warningAdvice = document.getElementById("warning-advice");

    if (selected.length === 0) {
        if (typeof showToast === "function") {
            showToast("Please select at least one symptom before analyzing.", "warning");
        } else {
            alert("Please select at least one symptom before analyzing.");
        }
        return;
    }

    // Default fallback
    let result = {
        name: "Non-Specific Fatigue & General Malaise",
        severity: "low",
        severityLabel: "Low Risk • Self-Care Monitor",
        confidence: 65,
        medicine: "Multivitamins, adequate hydration, electrolyte fluids, and 8 hours of restorative sleep.",
        diet: "Fresh citrus fruits, light soups, leafy green vegetables, and minimum 2.5L water daily.",
        warning: "If exhaustion persists for more than 7 days or is accompanied by unintentional weight loss, consult a general physician."
    };

    // Diagnostic rules matching
    // 1. Emergency Cardiac / Severe Respiratory
    if (selected.includes("breath_shortness") && selected.includes("chest_pain")) {
        result = {
            name: "Potential Acute Cardiorespiratory Condition",
            severity: "danger",
            severityLabel: "High Urgency • Seek Medical Attention",
            confidence: 90,
            medicine: "Do NOT attempt self-medication. Rest in an upright seated position.",
            diet: "Sip water only if fully conscious. Avoid heavy solid meals.",
            warning: "Red Flag: Chest tightness radiating to jaw or arm, severe breathlessness, or dizziness requires IMMEDIATE emergency care."
        };
    }
    // 2. COVID-19 / Acute Respiratory Viral
    else if ((selected.includes("loss_smell") || selected.includes("loss_taste")) && (selected.includes("fever") || selected.includes("cough"))) {
        result = {
            name: "Probable Viral Respiratory Infection (e.g. COVID-19 / Flu)",
            severity: "warning",
            severityLabel: "Moderate Attention • Isolation & Monitoring",
            confidence: 88,
            medicine: "Paracetamol / Acetaminophen (for fever/aches), Vitamin C, Zinc, saline nasal rinse.",
            diet: "High-protein warm broth, herbal tea with honey and ginger, steamed vegetables, citrus juices.",
            warning: "Monitor oxygen saturation (SpO2) with a pulse oximeter. If SpO2 drops below 94% or breath shortness develops, visit a clinic."
        };
    }
    // 3. Influenza / Common Flu
    else if (selected.includes("fever") && (selected.includes("cough") || selected.includes("chills") || selected.includes("body_pain"))) {
        result = {
            name: "Influenza (Flu) / Upper Respiratory Tract Infection",
            severity: "warning",
            severityLabel: "Moderate • Symptomatic Relief",
            confidence: 85,
            medicine: "Paracetamol for fever/chills, steam inhalation with eucalyptus, saline gargles.",
            diet: "Warm chicken/vegetable soup, hot herbal infusions, hydrating fluids, easy-to-digest carbs.",
            warning: "Consult a physician if high fever (>102°F / 39°C) persists past 3 days or coughing brings up rust-colored sputum."
        };
    }
    // 4. Common Cold / Rhinitis
    else if ((selected.includes("runny_nose") || selected.includes("sore_throat") || selected.includes("cold")) && !selected.includes("chest_pain")) {
        result = {
            name: "Acute Nasopharyngitis (Common Cold)",
            severity: "low",
            severityLabel: "Mild • Home Recovery",
            confidence: 80,
            medicine: "Over-the-counter decongestants, throat lozenges, warm saline water gargles twice daily.",
            diet: "Warm liquids, ginger tea, vitamin C rich fruits (oranges, kiwi), honey.",
            warning: "Usually resolves within 5-7 days. Consult doctor if ear pain or severe sinus pressure develops."
        };
    }
    // 5. Gastrointestinal Infection / Food Poisoning
    else if ((selected.includes("stomach_pain") || selected.includes("nausea")) && (selected.includes("diarrhea") || selected.includes("vomiting"))) {
        result = {
            name: "Acute Gastroenteritis (Food Poisoning / Stomach Flu)",
            severity: "warning",
            severityLabel: "Moderate • Critical Hydration Required",
            confidence: 86,
            medicine: "Oral Rehydration Salts (ORS), Probiotics, Zinc supplements. Avoid anti-diarrheal agents without doctor advice.",
            diet: "Strict BRAT diet (Bananas, Rice, Applesauce, Toast), curd/yogurt, tender coconut water.",
            warning: "Seek urgent care if you observe blood in stool, persistent vomiting exceeding 24 hours, or signs of severe dehydration."
        };
    }
    // 6. Hyperacidity / GERD
    else if (selected.includes("acidity") || (selected.includes("gas") && selected.includes("bloating"))) {
        result = {
            name: "Gastroesophageal Reflux / Hyperacidity (GERD)",
            severity: "low",
            severityLabel: "Mild • Lifestyle & Antacid Management",
            confidence: 82,
            medicine: "OTC Antacids (Gelusil / Digene) or H2 blockers (Famotidine) taken before meals.",
            diet: "Small frequent meals, cold milk, oatmeal. Strictly avoid coffee, carbonated sodas, and oily/spicy foods.",
            warning: "If burning pain radiates to your back or throat or is accompanied by cold sweating, evaluate for cardiac issues."
        };
    }
    // 7. Hypertension / Cardiovascular Stress
    else if (selected.includes("palpitations") || selected.includes("high_bp")) {
        result = {
            name: "Cardiovascular Strain / Probable Hypertension",
            severity: "warning",
            severityLabel: "Moderate • Blood Pressure Monitoring",
            confidence: 78,
            medicine: "Do not stop or adjust prescribed BP drugs without consultation. Practice slow diaphragmatic breathing.",
            diet: "DASH diet protocol: strictly low sodium (<2g/day), potassium-rich foods (bananas, spinach).",
            warning: "Check BP with a digital cuff. Readings consistently exceeding 140/90 mmHg warrant clinical assessment."
        };
    }
    // 8. Urinary Tract Infection (UTI)
    else if (selected.includes("burning_urination") || selected.includes("frequent_urination") || selected.includes("pelvic_pain")) {
        result = {
            name: "Probable Urinary Tract Infection (UTI)",
            severity: "warning",
            severityLabel: "Moderate • Requires Antibiotic Evaluation",
            confidence: 84,
            medicine: "Urinary alkalinizer (Disodium hydrogen citrate), OTC analgesics for pelvic spasm.",
            diet: "Increase water consumption to 3-4 liters daily, fresh unsweetened cranberry juice, coconut water.",
            warning: "Most UTIs require a doctor-prescribed antibiotic course. Seek swift treatment if flank/back pain or fever develops."
        };
    }
    // 9. Allergic Dermatitis / Urticaria
    else if (selected.includes("itching") || selected.includes("rash") || selected.includes("dry_skin")) {
        result = {
            name: "Allergic Dermatitis / Skin Hypersensitivity",
            severity: "low",
            severityLabel: "Mild • Topical & Antihistamine Care",
            confidence: 79,
            medicine: "OTC Antihistamines (Cetirizine / Loratadine), calamine lotion or mild hydrocortisone cream.",
            diet: "Anti-inflammatory diet. Avoid known personal allergen triggers (shellfish, peanuts, artificial dyes).",
            warning: "If rash is accompanied by swelling of lips/tongue or throat tightness, seek EMERGENCY medical attention immediately (Anaphylaxis)."
        };
    }
    // 10. Anxiety / Stress & Insomnia
    else if (selected.includes("anxiety") || selected.includes("panic_attack") || selected.includes("insomnia") || selected.includes("stress")) {
        result = {
            name: "Acute Stress Reaction / Sleep-Wake Cycle Disruption",
            severity: "low",
            severityLabel: "Lifestyle & Mental Wellbeing",
            confidence: 80,
            medicine: "Herbal chamomile tea, magnesium glycinate supplement, guided mindfulness meditation.",
            diet: "Complex carbohydrates, warm milk with nutmeg, avoid caffeine after 2 PM and alcohol.",
            warning: "Consult a counselor or psychiatrist if anxiety impairs daily functioning or is accompanied by persistent depressive thoughts."
        };
    }
    // 11. Musculoskeletal Strain / Tension
    else if (selected.includes("joint_pain") || selected.includes("muscle_pain") || selected.includes("back_pain") || selected.includes("neck_pain")) {
        result = {
            name: "Musculoskeletal Strain / Postural Myalgia",
            severity: "low",
            severityLabel: "Mild • Rest & Physical Therapy",
            confidence: 76,
            medicine: "Topical pain relief gel (Diclofenac), hot/cold compress alternating every 20 minutes.",
            diet: "Turmeric milk (Curcumin), calcium and vitamin D3 rich foods, adequate hydration.",
            warning: "Consult an orthopedic specialist if joint swelling is hot to touch, causes joint locking, or pain radiates down legs."
        };
    }

    // Dynamic confidence boost based on symptom matches
    const calculatedConfidence = Math.min(95, result.confidence + Math.min(10, selected.length * 2));

    // Update UI elements
    if (resultCard) {
        resultCard.style.display = "block";
        resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (diseaseName) {
        diseaseName.innerText = result.name;
    }

    if (severityBadge) {
        severityBadge.innerText = result.severityLabel;
        severityBadge.className = `severity-badge severity-${result.severity}`;
    }

    if (matchScore) {
        matchScore.style.width = `${calculatedConfidence}%`;
        const scoreText = document.getElementById("score-percentage");
        if (scoreText) scoreText.innerText = `${calculatedConfidence}% Match Probability`;
    }

    if (medicineName) {
        medicineName.innerText = result.medicine;
    }

    if (dietAdvice) {
        dietAdvice.innerText = result.diet;
    }

    if (warningAdvice) {
        warningAdvice.innerText = result.warning;
    }

    if (typeof showToast === "function") {
        showToast("Analysis complete: " + result.name, "success");
    }
}

// Quick preset selection helper
function applyPreset(type) {
    // Uncheck all first
    document.querySelectorAll(".symptom-box input").forEach(cb => cb.checked = false);

    const presets = {
        cold: ["runny_nose", "sore_throat", "cough", "sneezing"],
        flu: ["fever", "cough", "chills", "body_pain", "fatigue"],
        stomach: ["stomach_pain", "nausea", "vomiting", "diarrhea"],
        stress: ["anxiety", "insomnia", "headache", "fatigue"],
        allergy: ["itching", "rash", "runny_nose", "eye_redness"]
    };

    const targetList = presets[type] || [];
    targetList.forEach(val => {
        const checkbox = document.querySelector(`.symptom-box input[value="${val}"]`);
        if (checkbox) checkbox.checked = true;
    });

    updateSelectedCount();
    if (typeof showToast === "function") {
        showToast(`Selected preset: ${type.toUpperCase()}`, "info");
    }
}

// Clear all checkboxes
function clearAllSymptoms() {
    document.querySelectorAll(".symptom-box input").forEach(cb => cb.checked = false);
    updateSelectedCount();
    const resultCard = document.getElementById("result-card");
    if (resultCard) resultCard.style.display = "none";
    if (typeof showToast === "function") {
        showToast("Cleared all selected symptoms", "info");
    }
}

// Update live badge count of selected symptoms
function updateSelectedCount() {
    const checked = document.querySelectorAll(".symptom-box input:checked").length;
    const badge = document.getElementById("selected-counter");
    if (badge) {
        badge.innerText = `${checked} Selected`;
    }
}
