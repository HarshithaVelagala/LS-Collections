export const CATEGORIES = {
  SAREE: "saree",
  JEWELLERY: "jewellery"
} as const;

export const FILTER_OPTIONS = {
  saree: {
    types: ["Banarasi", "Silk", "Cotton", "Chiffon", "Georgette", "Wedding"],
    fabrics: ["Pure Silk", "Cotton Silk", "Organza", "Linen"],
  },
  jewellery: {
    types: ["Neck Sets", "Earrings", "Bangles", "Rings", "Bridal Sets"],
    materials: ["Gold Plated", "Brass Alloy", "Silver"],
  }
} as const;

export function normalizeProductFields(product: any) {
  const result = { ...product };

  // 1. Normalize Category (must be "saree" or "jewellery")
  let category = (result.category || "").toLowerCase().trim();
  if (category !== CATEGORIES.SAREE && category !== CATEGORIES.JEWELLERY) {
    const name = (result.name || "").toLowerCase();
    const jewelleryKeywords = ['necklace', 'bangles', 'jewellery', 'ring', 'earrings', 'pendant', 'choker', 'haram', 'ornament', 'sets', 'bangle', 'earring'];
    const isJewellery = jewelleryKeywords.some(kw => name.includes(kw));
    category = isJewellery ? CATEGORIES.JEWELLERY : CATEGORIES.SAREE;
  }
  result.category = category;

  const name = (result.name || "").toLowerCase();
  const subCategoryInput = (result.subCategory || "").trim();
  const fabricInput = (result.fabric || "").trim();
  const materialInput = (result.material || "").trim();
  const typeInput = (result.type || "").trim();

  let subCategory = "";
  let fabric = "";
  let material = "";
  let type = "";

  if (category === CATEGORIES.SAREE) {
    const options = FILTER_OPTIONS.saree;

    // Normalize Saree Subcategory (Types)
    let foundSub = options.types.find(t => 
      t.toLowerCase() === subCategoryInput.toLowerCase() || 
      name.includes(t.toLowerCase()) ||
      (t === "Silk" && (
        name.includes("silk") || 
        subCategoryInput.toLowerCase().includes("silk") || 
        subCategoryInput.toLowerCase().includes("kanjeevaram")
      ))
    );
    if (!foundSub) {
      if (name.includes("linen") || name.includes("organza")) {
        foundSub = "Silk";
      } else {
        foundSub = "Silk"; // default fallback for saree
      }
    }
    subCategory = foundSub;

    // Normalize Saree Fabric
    let foundFabric = options.fabrics.find(f => 
      f.toLowerCase() === fabricInput.toLowerCase() ||
      fabricInput.toLowerCase().includes(f.toLowerCase()) ||
      name.includes(f.toLowerCase()) ||
      (f === "Pure Silk" && (name.includes("silk") && !name.includes("cotton silk") && !name.includes("cotton-silk"))) ||
      (f === "Cotton Silk" && (name.includes("cotton silk") || name.includes("cotton-silk")))
    );
    if (!foundFabric) {
      if (name.includes("organza") || fabricInput.toLowerCase().includes("organza")) foundFabric = "Organza";
      else if (name.includes("linen") || fabricInput.toLowerCase().includes("linen")) foundFabric = "Linen";
      else if (name.includes("cotton") || fabricInput.toLowerCase().includes("cotton")) foundFabric = "Cotton Silk";
      else foundFabric = "Pure Silk"; // default
    }
    fabric = foundFabric;
    
    // For sarees, material is fabric
    material = foundFabric;
    type = foundSub;

  } else {
    const options = FILTER_OPTIONS.jewellery;

    // Normalize Jewellery Subcategory (Types)
    let foundSub = options.types.find(t => 
      t.toLowerCase() === subCategoryInput.toLowerCase() ||
      name.includes(t.toLowerCase().slice(0, -1)) || // match singular earring / bangle
      name.includes(t.toLowerCase()) ||
      (t === "Neck Sets" && (name.includes("necklace") || name.includes("choker") || name.includes("haram") || name.includes("pendant"))) ||
      (t === "Bridal Sets" && name.includes("bridal"))
    );
    if (!foundSub) {
      if (name.includes("earring") || name.includes("chandbali")) foundSub = "Earrings";
      else if (name.includes("bangle")) foundSub = "Bangles";
      else if (name.includes("ring")) foundSub = "Rings";
      else if (name.includes("choker") || name.includes("necklace") || name.includes("haram") || name.includes("pendant")) foundSub = "Neck Sets";
      else foundSub = "Neck Sets"; // default
    }
    subCategory = foundSub;

    // Normalize Jewellery Material
    let foundMaterial = options.materials.find(m => 
      m.toLowerCase() === materialInput.toLowerCase() ||
      materialInput.toLowerCase().includes(m.toLowerCase()) ||
      name.includes(m.toLowerCase()) ||
      (m === "Gold Plated" && (name.includes("gold-plated") || name.includes("gold plated"))) ||
      (m === "Brass Alloy" && (name.includes("brass") || name.includes("alloy") || name.includes("copper")))
    );
    if (!foundMaterial) {
      if (name.includes("silver")) foundMaterial = "Silver";
      else if (name.includes("brass") || name.includes("alloy") || name.includes("copper")) foundMaterial = "Brass Alloy";
      else foundMaterial = "Gold Plated"; // default
    }
    material = foundMaterial;
    
    // For jewellery, fabric is not applicable
    fabric = "";
    type = foundSub;
  }

  result.subCategory = subCategory;
  result.fabric = fabric;
  result.material = material;
  result.type = type;

  // Propagate to variants attributes
  if (result.variants && Array.isArray(result.variants)) {
    result.variants = result.variants.map((v: any) => {
      const updatedAttrs = { ...(v.attributes || {}) };
      if (category === CATEGORIES.SAREE) {
        updatedAttrs.fabric = fabric;
        updatedAttrs.material = fabric; // ensure both are set
        updatedAttrs.type = type;
      } else {
        updatedAttrs.material = material;
        updatedAttrs.type = type;
        if (updatedAttrs.fabric !== undefined) {
          delete updatedAttrs.fabric;
        }
      }
      return {
        ...v,
        attributes: updatedAttrs
      };
    });
  }

  return result;
}
