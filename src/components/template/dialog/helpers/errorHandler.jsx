const errorHandler = (schema, isView) => {
  if (isView) return {};
  const newErrors = {};
  schema.forEach(item => {
    if (item.type === "section") return;

    const val = item.value;
    const strVal = String(val || "").trim();
    if (item.required && strVal === "") {
      newErrors[item.name] = "Ce champ est obligatoire";
      return;
    }
    if (strVal === "") return;
    if (item.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      newErrors[item.name] = "Format d'email invalide";
    }
    if (item.minLength && strVal.length < item.minLength) {
      newErrors[item.name] = `Minimum ${item.minLength} caractères`;
    }
    // 3. MinLength Validation
    if (item.minLength && strVal.length < item.minLength) {
      newErrors[item.name] = `Minimum ${item.minLength} caractères`;
    }

    // 4. MaxLength Validation
    if (item.maxLength && strVal.length > item.maxLength) {
      newErrors[item.name] = `Maximum ${item.maxLength} caractères`;
    }

    // 5. Numeric Min Validation
    if (item.min !== undefined && Number(val) < item.min) {
      newErrors[item.name] = `La valeur doit être ≥ ${item.min}`;
    }

    // 6. Numeric Max Validation
    if (item.max !== undefined && Number(val) > item.max) {
      newErrors[item.name] = `La valeur doit être ≤ ${item.max}`;
    }

    // 7. Custom Regex Validation (Optional extra)
    if (item.pattern && !new RegExp(item.pattern).test(strVal)) {
      newErrors[item.name] = item.patternError || "Format invalide";
    }
  });
  return newErrors;
}

export { errorHandler }