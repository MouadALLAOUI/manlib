import logger from "../../lib/logger";
import { useCallback, useEffect, useState } from "react";

/**
 * Universal Fetch Helper
 * @param {Function} dataService - The primary API call (e.g., bLivraisonImpService.getAll)
 * @param {Object} options - Configuration for grouping and loading
 */
export const universalFetch = async ({
  dataService,
  groupOptions = null // { keys: ['field1', 'field2'], sumField: 'quantite' }
}) => {
  try {
    const res = await dataService();
    const rawData = res.data?.data || res.data || [];

    if (groupOptions) {
      const { keys, sumField } = groupOptions;
      const grouped = Object.values(rawData.reduce((acc, current) => {
        const groupKey = keys.map(k => current[k]).join('-');

        if (!acc[groupKey]) {
          acc[groupKey] = {
            ...current,
            total_quantite: 0,
            items_count: 0,
            items: []
          };
        }

        if (sumField && current[sumField]) {
          acc[groupKey].total_quantite += parseInt(current[sumField]);
        }

        acc[groupKey].items_count += 1;
        acc[groupKey].items.push({ ...current });

        return acc;
      }, {}));

      return grouped;
    }

    return rawData;
  } catch (error) {
    logger({ "Fetch Error:": error }, "error");
    throw error; // Let the component handle the toast
  }
};

const normalizeRules = (rules) => {
  if (!rules) return {};
  if (Array.isArray(rules)) {
    return rules.reduce((acc, entry) => {
      if (entry && typeof entry === "object") return { ...acc, ...entry };
      return acc;
    }, {});
  }
  if (typeof rules === "object") return rules;
  return {};
};

const parseRuleString = (rule) => {
  if (!rule) return [];
  if (Array.isArray(rule)) return rule.flatMap((r) => (typeof r === "string" ? r.split("|") : []));
  if (typeof rule === "string") return rule.split("|");
  return [];
};

const inferInputConfig = (fieldName, ruleParts = [], fieldOverrides = {}) => {
  const lower = ruleParts.map((r) => String(r).toLowerCase());
  const required = lower.includes("required");

  let type = "text";
  let inputType = "input";

  if (lower.includes("email")) type = "email";
  if (lower.includes("date")) type = "date";
  if (lower.includes("integer") || lower.includes("numeric") || lower.includes("decimal")) type = "number";
  if (lower.includes("boolean")) {
    inputType = "select";
  }

  const inRule = ruleParts.find((r) => String(r).startsWith("in:"));
  if (inRule) {
    inputType = "select";
  }

  const isForeignKey = fieldName.endsWith("_id") || lower.some((r) => r.startsWith("exists:"));
  if (isForeignKey) {
    inputType = "select";
  }

  return {
    required,
    type,
    inputType,
    ...fieldOverrides,
  };
};

export const buildSchemaFromControllerRules = ({
  rules,
  formData,
  setFormData,
  labels = {},
  placeholders = {},
  overrides = {},
  selectItems = {},
  gridSpan = {},
  exclude = [],
}) => {
  const normalized = normalizeRules(rules);
  const excluded = new Set(["id", "created_at", "updated_at", ...exclude]);

  return Object.keys(normalized)
    .filter((fieldName) => !excluded.has(fieldName))
    .map((fieldName) => {
      const ruleParts = parseRuleString(normalized[fieldName]);
      const cfg = inferInputConfig(fieldName, ruleParts, overrides[fieldName]);

      const base = {
        name: fieldName,
        label: labels[fieldName] || fieldName.replace(/_/g, " "),
        placeholder: placeholders[fieldName],
        type: cfg.type,
        inputType: cfg.inputType,
        required: cfg.required,
        className: gridSpan[fieldName],
        value: formData[fieldName],
        onChange: (val) => setFormData((prev) => ({ ...prev, [fieldName]: val })),
      };

      const inRule = ruleParts.find((r) => String(r).startsWith("in:"));
      if (inRule) {
        const options = String(inRule).slice(3).split(",").map((v) => v.trim()).filter(Boolean);
        return {
          ...base,
          inputType: "select",
          items: options,
        };
      }

      if (cfg.inputType === "select") {
        const items = selectItems[fieldName] || [];
        return {
          ...base,
          items,
        };
      }

      return base;
    });
};

export const useFetch = (fetcher, _deps = [], { initialData = [] } = {}) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      setData(res);
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    run();
  }, [run]);

  return { data, setData, isLoading, error, refresh: run };
};

export const unwrapServiceResponse = (response) => response?.data?.data || response?.data || [];

export const useCrudService = (service, { unwrap = unwrapServiceResponse } = {}) => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await service.getAll();
      setRows(unwrap(res));
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [service, unwrap]);

  const createOne = useCallback(async (payload) => service.create(payload), [service]);
  const updateOne = useCallback(async (id, payload) => service.update(id, payload), [service]);
  const deleteOne = useCallback(async (id) => service.delete(id), [service]);

  return {
    rows,
    setRows,
    isLoading,
    error,
    fetchAll,
    createOne,
    updateOne,
    deleteOne,
  };
};
