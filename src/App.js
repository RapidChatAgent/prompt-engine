import React, { useEffect, useState } from "react";

// Parse parameters in order
function getOrderedParams() {
  const urlParams = [];
  const q = window.location.search.replace(/^\?/, "");
  q.split("&").forEach((pair) => {
    if (!pair) return;
    const [k, v] = pair.split("=").map(decodeURIComponent);
    if (k) urlParams.push([k, v === undefined ? true : v]);
  });
  return urlParams;
}

// Core query logic (returns result, logs per step)
function queryByParamChain(data, orderedParams) {
  const logsArr = [];
  let cursor = data;
  const fileParam = orderedParams.find(([k]) => k === "file");
  if (!fileParam) {
    logsArr.push({
      msg: "Missing file parameter in URL",
      data: null,
      kind: "error",
      step: 0,
    });
    return { result: undefined, logs: logsArr };
  }
  const steps = orderedParams.filter(([k]) => k !== "file");
  let pathDisplay = [];
  logsArr.push({
    msg: `[Step 0][ROOT] Loaded data:`,
    data: cursor,
    kind: "debug",
    step: 0,
  });

  steps.forEach(([key, val], stepIdx) => {
    const msg = `[Step ${stepIdx + 1}] Path: ${
      pathDisplay.join(".") || "[root]"
    } | Param: [${key}${val === true ? "" : "=" + val}] Current value/type:`;
    logsArr.push({ msg, data: cursor, kind: "debug", step: stepIdx + 1 });

    if (Array.isArray(cursor)) {
      // Array index
      if (/^\d+$/.test(val === true ? key : val)) {
        const idx = Number(val === true ? key : val);
        logsArr.push({
          msg: `-- Array index [${idx}]`,
          data: cursor[idx],
          kind: "debug",
          step: stepIdx + 1,
        });
        cursor = cursor[idx];
        pathDisplay.push(String(idx));
      }
      // Array filter
      else if (val !== true) {
        logsArr.push({
          msg: `-- Array filter: "${key}==${val}"`,
          data: undefined,
          kind: "debug",
          step: stepIdx + 1,
        });
        const filtered = cursor.find(
          (item) => item && String(item[key]) === val
        );
        if (!filtered)
          logsArr.push({
            msg: `[Warning] Array filter "${key}=${val}" not found!`,
            data: cursor,
            kind: "warn",
            step: stepIdx + 1,
          });
        cursor = filtered;
        pathDisplay.push(`${key}=${val}`);
      } else {
        logsArr.push({
          msg: `-- [Error] Cannot use property "${key}" with no value on array!`,
          data: cursor,
          kind: "error-step",
          step: stepIdx + 1,
        });
        cursor = undefined;
      }
    } else if (cursor && typeof cursor === "object") {
      if (key in cursor) {
        logsArr.push({
          msg: `-- Object property "${key}"`,
          data: cursor[key],
          kind: "debug",
          step: stepIdx + 1,
        });
        cursor = cursor[key];
        pathDisplay.push(key);
      } else {
        logsArr.push({
          msg: `-- [FAIL] Property "${key}" not found in object. Keys: ${Object.keys(
            cursor
          ).join(", ")}`,
          data: cursor,
          kind: "warn",
          step: stepIdx + 1,
        });
        cursor = undefined;
      }
    } else {
      logsArr.push({
        msg: `-- [FAIL] Cannot process param "${key}" on type: ${typeof cursor} (${String(
          cursor
        )})`,
        data: cursor,
        kind: "error-step",
        step: stepIdx + 1,
      });
      cursor = undefined;
    }
    logsArr.push({
      msg: `[Step ${stepIdx + 1}] Result after applying param:`,
      data: cursor,
      kind: "debug",
      step: stepIdx + 1,
    });
  });
  logsArr.push({
    msg: `==== END QUERY / FINAL VALUE ====`,
    data: cursor,
    kind: cursor !== undefined ? "result" : "warn",
    step: steps.length + 1,
  });
  return { result: cursor, logs: logsArr };
}

function DebugStep({ step, msg, data, kind }) {
  const [open, setOpen] = React.useState(false);
  const baseClass =
    kind === "warn"
      ? "warn"
      : kind === "error" || kind === "error-step"
      ? "error-step"
      : "debug";
  return (
    <div className={`collapsible-step ${baseClass}`}>
      <button
        type="button"
        className="stephead"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="arrow">{open ? "▼" : "▶"}</span>
        {msg.split("<br>")[0]}
      </button>
      {open && (
        <div className="stepbody">
          {msg.split("<br>").slice(1).map((m, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: m }} />
          ))}
          {data !== undefined ? (
            <pre>{typeof data === "string" ? data : JSON.stringify(data, null, 2)}</pre>
          ) : null}
        </div>
      )}
    </div>
  );
}

function App() {
  const [result, setResult] = useState(undefined);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    setResult(undefined);
    setLogs([]);
    // Note: This runs only ONCE (empty deps array), which is correct for a tool that always reloads on URL change.
    async function run() {
      const orderedParams = getOrderedParams();
      const fileParam = orderedParams.find(([k]) => k === "file");
      if (!fileParam) {
        setError('Missing "file" parameter in URL');
        return;
      }
      const fileValue = fileParam[1];
      const jsonUrl = `/data/${encodeURIComponent(fileValue)}.json`;
      let jsonData;
      try {
        const resp = await fetch(jsonUrl);
        if (!resp.ok) throw new Error("Not Found");
        jsonData = await resp.json();
      } catch (e) {
        setError(
          `File not found or fetch failed. Attempted URL: ${jsonUrl}`
        );
        return;
      }
      try {
        const { result, logs } = queryByParamChain(jsonData, orderedParams);
        setResult(result);
        setLogs(logs);
      } catch (e) {
        setError("Failed: " + e.message);
      }
    }
    run();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ padding: 28, maxWidth: 980, margin: "0 auto" }}>
      <h2>JSON Param Query Tool <span style={{fontSize:'0.7em'}}>(React)</span></h2>
      <div style={{marginBottom:'1.4em',color:'#555'}}>
        Usage: <code>?file=FILENAME&amp;id=4&amp;address=location&amp;lat</code>
      </div>
      {error ? (
        <div className="error">{error}</div>
      ) : result === undefined ? null : (
        <pre className="result">
          {typeof result === "string" || typeof result === "number"
            ? result
            : JSON.stringify(result, null, 2)}
        </pre>
      )}

      {/* Collapse logs if error or result is not found */}
      {(error || result === undefined) && logs.length > 0 && (
        <div>
          <h3 style={{fontSize:'1.08em',margin:"0.8em 0 0.30em 0"}}>Debug Steps</h3>
          {logs.map((step, i) => (
            <DebugStep key={i} {...step} />
          ))}
        </div>
      )}

      <style>{`
        pre { font-family: ui-monospace,monospace;background:#f9f9f9;color:#222;border-radius:6px;padding:1em;}
        .warn {background:#ffe4e0;color:#9b3939;border:1px solid #ffd2cb;}
        .error-step {background:#ffeaea;color:#891818;border:1px solid #ffc1c1;}
        .debug {font-size:1em;background:#fffbe5;color:#543c11;border:1px solid #eee2b1;}
        .stephead {
          font-family:inherit;background:#f7f4e8;border:0;color:#543c11;
          font-size:1em; padding:0.3em 0.8em 0.3em 0em; border-radius:4px;cursor:pointer;
          outline:none;width:100%;text-align:left;margin-bottom:0;margin-top:0;display:flex;align-items:center;
        }
        .arrow {font-size:1.2em; margin-right:0.3em; transition:transform 0.1s;}
        .stepbody {padding:0 1.2em 0.75em 1.5em;}
        .result {margin-top:1.5em;}
      `}</style>
    </div>
  );
}

export default App;
