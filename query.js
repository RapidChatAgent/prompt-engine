// query.js - Common data extraction logic for both HTML+API
function getOrderedParams() {
  const urlParams = [];
  const q = (location.search||"").replace(/^\?/, "");
  q.split('&').forEach(pair => {
    if (!pair) return;
    const [k, v] = pair.split('=').map(decodeURIComponent);
    if (k) urlParams.push([k, v === undefined ? true : v]);
  });
  return urlParams;
}

function queryByParamChain(data, orderedParams) {
  const fileParam = orderedParams.find(([k]) => k === 'file');
  if (!fileParam) throw new Error("Missing 'file' parameter");
  const steps = orderedParams.filter(([k]) => k !== 'file');
  let cursor = data;
  for (const [key, val] of steps) {
    if (Array.isArray(cursor)) {
      if (/^\d+$/.test(val === true ? key : val)) {
        const idx = Number(val === true ? key : val);
        cursor = cursor[idx];
      } else if (val !== true) {
        cursor = cursor.find(item => item && String(item[key]) === val);
      } else {
        cursor = undefined;
      }
    } else if (cursor && typeof cursor === 'object') {
      if (key in cursor) {
        cursor = cursor[key];
      } else {
        cursor = undefined;
      }
    } else {
      cursor = undefined;
    }
    if (cursor === undefined) break;
  }
  return cursor;
}

// Expose for global
if (typeof window !== "undefined") {
  window.getOrderedParams = getOrderedParams;
  window.queryByParamChain = queryByParamChain;
}
