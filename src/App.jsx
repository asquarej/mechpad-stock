import React, { useEffect, useMemo, useState } from "react";

const LOCATIONS = ["Ibadan", "Ilupeju", "Kano", "Abuja", "Akure", "Ilorin", "Asaba", "Ondo"];
const JOB_TYPES = ["Maintenance", "Repair", "Refurbishment", "Warranty", "Maintenance & Repair"];
const PAYMENT_TYPES = ["Captain-paid", "Company complimentary"];
const STORAGE_KEY = "mechpadInventoryReactSampleV4";

const sampleParts = [
  ["2WHLXMISS112", "Mirror Set", "Body & Frame", 3087.2, 3632, 30, "Ibadan"],
  ["2WHLXRETT006", "Rear tyre", "Consumables & Service Items", 13394.3, 15758, 7, "Ilupeju"],
  ["2WHLXTAT064", "Tank", "Body & Frame", 46306.3, 54478, 7, "Kano"],
  ["2WHLXFRAA030", "Front absorber", "Suspension & Steering", 57002.7, 67062, 12, "Abuja"],
  ["2WHLXCACC078", "Carburetor cleaner", "Consumables & Service Items", 2572.95, 3027, 127, "Akure"],
  ["2WHLXCHAS001", "Chain and sprocket", "Engine & Transmission", 9261.6, 10896, 4, "Ilorin"],
  ["2WHLXSHBB002", "shoe brake", "Control & Cables", 3087.2, 3632, 19, "Asaba"],
  ["2WHLXFRSB053", "Front Shoe Brake", "Brake System", 3602.3, 4238, 68, "Ondo"],
  ["2WHLXHOH038", "Horn", "Electrical & Electronics", 2640.1, 3106, 26, "Ibadan"],
  ["2WHLXSICS113", "Side cover set", "Body & Frame", 10180.45, 11977, 13, "Ilupeju"],
  ["2WHLXSPPP003", "Spark plug", "Control & Cables", 1029.35, 1211, 50, "Kano"],
  ["2WHLXFRFF075", "Front footrest", "Control & Cables", 6688.65, 7869, 7, "Abuja"],
  ["2WHLXFORR039", "Footrest rubber", "Body & Frame", 1575.05, 1853, 88, "Akure"],
  ["2WHLXREFF012", "Rear fender", "Electrical & Electronics", 7179.95, 8447, 4, "Ilorin"],
  ["2WHLXEXPP011", "Exhaust pipe", "Engine & Transmission", 82321.65, 96849, 13, "Asaba"],
  ["2WHLXHASS022", "Half stand spring", "Body & Frame", 725.9, 854, 15, "Ondo"],
  ["2WHLXCAC037", "Carrier", "Body & Frame", 8232.25, 9685, 4, "Ibadan"],
  ["2WHLXCRC049", "Crankshaft", "Engine & Transmission", 25726.1, 30266, 2, "Ilupeju"],
  ["2WHLXENBB048", "Engine block", "Engine & Transmission", 25726.1, 30266, 4, "Kano"],
  ["2WHLXENCC069", "Engine cover", "Engine & Transmission", 5145.9, 6054, 5, "Abuja"],
  ["2WHLXCOHH013", "Complete headlight", "Suspension & Steering", 7203.75, 8475, 5, "Akure"],
  ["2WHLXFUSS063", "Full stand", "Control & Cables", 6543.3, 7698, 2, "Ilorin"],
  ["2WHLXCLCC059", "Clutch cable", "Control & Cables", 1029.35, 1211, 10, "Asaba"],
  ["2WHLXBRCC024", "Brake cable", "Brake System", 1543.6, 1816, 8, "Ondo"],
  ["2WHLXCHCC047", "CHoke cable", "Control & Cables", 1901.45, 2237, 3, "Ibadan"],
  ["2WHLXTHCC058", "Throttle cable", "Control & Cables", 1029.35, 1211, 17, "Ilupeju"],
  ["2WHLXSPCC025", "Speedometer cable", "Control & Cables", 1543.6, 1816, 37, "Kano"],
  ["2WHLXCORL016", "Complete rear light", "Electrical & Electronics", 15436, 18160, 8, "Abuja"],
  ["2WHLXPOP014", "Pointer", "Electrical & Electronics", 2572.95, 3027, 168, "Akure"],
  ["2WHLXSPAA019", "Speedometer assy", "Electrical & Electronics", 12348.8, 14528, 8, "Ilorin"],
  ["2WHLXBRPP036", "Brake pedal", "Brake System", 3087.2, 3632, 3, "Asaba"],
  ["2WHLXGEPP010", "Gear pedal", "Electrical & Electronics", 3087.2, 3632, 13, "Ondo"],
  ["2WHLXSOSS066", "Socket seat", "Suspension & Steering", 5033.7, 5922, 2, "Ibadan"],
  ["2WHLXCAHL023", "Case head light", "Body & Frame", 1543.6, 1816, 12, "Ilupeju"],
  ["2WHLXTHRR074", "Throttle rubber", "Control & Cables", 3602.3, 4238, 2, "Kano"],
  ["2WHLXOISF033", "Oil seal front fork", "Suspension & Steering", 351.9, 414, 17, "Abuja"],
  ["2WHLXCHCC015", "Chain case", "Body & Frame", 9261.6, 10896, 4, "Akure"],
  ["2WHLXHABB057", "Handle bar", "Suspension & Steering", 5145.9, 6054, 5, "Ilorin"],
  ["2WHLXREHC026", "Rear hub cover", "Brake System", 9261.6, 10896, 3, "Asaba"],
  ["2WHLXWISS114", "Winker switch", "Control & Cables", 9644.1, 11346, 14, "Ondo"],
  ["2WHLXFUCC017", "Fuel cock", "Body & Frame", 2572.95, 3027, 5, "Ibadan"],
  ["2WHLXDARR004", "Damper rubber", "Consumables & Service Items", 1235.05, 1453, 55, "Ilupeju"],
  ["2WHLXSES070", "Seat", "Body & Frame", 51451.35, 60531, 9, "Kano"]
];

const sampleStock = sampleParts.map(([ref, name, category, price, sellingPrice, qty, location], index) => ({
  id: index + 1,
  ref,
  name,
  category,
  assetType: "Motorcycle",
  assetBrand: "TVS",
  assetModel: "HLX",
  qty,
  price,
  sellingPrice,
  markup: 15,
  location,
  condition: "Good",
  reorder: Math.max(2, Math.ceil(qty * 0.2)),
  supplier: "Donaten Enterprise"
}));

const sampleReceipts = LOCATIONS.map((location, index) => {
  const locationStock = sampleStock.filter((item) => item.location === location);
  return {
    id: `RCPT-SAMPLE-${String(index + 1).padStart(3, "0")}`,
    supplier: "Donaten Enterprise",
    invoice: `DON-INV-2026-${String(index + 1).padStart(3, "0")}`,
    location,
    lines: locationStock.length,
    total: locationStock.reduce((sum, item) => sum + item.qty * item.price, 0),
    verifier: "Demo user",
    date: new Date().toLocaleDateString("en-GB")
  };
});

const initialData = {
  stock: sampleStock,
  receipts: sampleReceipts,
  jobs: [],
  audit: ["Demo inventory initialized."]
};

const money = (value) => `₦${Number(value || 0).toLocaleString("en-NG")}`;
const today = () => new Date().toLocaleDateString("en-GB");

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialData;
  } catch {
    return initialData;
  }
}

function csvToObjects(text) {
  const rows = text.trim().split(/\r?\n/).filter(Boolean);
  if (rows.length < 2) return [];
  const headers = rows.shift().split(",").map((x) => x.trim().toLowerCase());
  return rows.map((row) => {
    const cells = row.split(",").map((x) => x.trim());
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""]));
  });
}

function addReceiptDelivery(receipts, delivery) {
  const matchIndex = receipts.findIndex((receipt) =>
    receipt.invoice === delivery.invoice &&
    receipt.supplier === delivery.supplier &&
    receipt.location === delivery.location
  );

  if (matchIndex === -1) return [...receipts, delivery];

  return receipts.map((receipt, index) => index === matchIndex ? {
    ...receipt,
    lines: receipt.lines + delivery.lines,
    total: receipt.total + delivery.total,
    date: delivery.date,
    lastDeliveryDate: delivery.date,
    deliveries: (receipt.deliveries || 1) + 1
  } : receipt);
}

function App() {
  const [data, setData] = useState(readSaved);
  const [role, setRole] = useState("manager");
  const [page, setPage] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [single, setSingle] = useState({
    ref: "", name: "", category: "", qty: 1, price: 0, location: "Ibadan",
    supplier: "", invoice: "", condition: "Good", reorder: 2, verifier: ""
  });
  const [bulk, setBulk] = useState({ supplier: "", invoice: "", location: "Ibadan", verifier: "", file: null });
  const [job, setJob] = useState({
    vehicle: "", captain: "", location: "Ibadan", type: "Maintenance",
    technician: "", odometer: "", description: "", lines: []
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const allowedLocations = role === "manager" ? LOCATIONS : [role.split(":")[1] || "Ibadan"];

  useEffect(() => {
    if (!allowedLocations.includes(single.location)) setSingle((x) => ({ ...x, location: allowedLocations[0] }));
    if (!allowedLocations.includes(bulk.location)) setBulk((x) => ({ ...x, location: allowedLocations[0] }));
    if (!allowedLocations.includes(job.location)) setJob((x) => ({ ...x, location: allowedLocations[0] }));
    if (filterLocation && !allowedLocations.includes(filterLocation)) setFilterLocation("");
  }, [role]);

  const visibleStock = useMemo(() => {
    const query = search.toLowerCase();
    return data.stock.filter((item) =>
      allowedLocations.includes(item.location) &&
      (!filterLocation || item.location === filterLocation) &&
      `${item.ref} ${item.name}`.toLowerCase().includes(query)
    );
  }, [data.stock, search, filterLocation, role]);

  const visibleJobs = data.jobs.filter((item) => allowedLocations.includes(item.location));
  const visibleReceipts = data.receipts.filter((item) => allowedLocations.includes(item.location));

  const totals = useMemo(() => visibleJobs.reduce((acc, current) => {
    current.lines.forEach((line) => {
      const value = Number(line.qty || 0) * Number(line.price || 0);
      if (line.payment === "Captain-paid") acc.paid += value;
      else acc.free += value;
    });
    return acc;
  }, { paid: 0, free: 0 }), [visibleJobs]);

  const log = (message) => {
    setData((current) => ({
      ...current,
      audit: [...current.audit, `${new Date().toLocaleString("en-GB")} — ${message}`]
    }));
  };

  const updateData = (updater, message) => {
    setData((current) => updater(current));
    if (message) log(message);
  };

  const openSingle = () => {
    setSingle((current) => ({ ...current, location: allowedLocations[0] }));
    setModal("single");
  };

  const openBulk = () => {
    setBulk((current) => ({ ...current, location: allowedLocations[0] }));
    setModal("bulk");
  };

  const addSingle = (event) => {
    event.preventDefault();
    const item = { ...single, id: Date.now(), qty: Number(single.qty), price: Number(single.price), reorder: Number(single.reorder) };
    const receipt = {
      id: Date.now(),
      supplier: item.supplier,
      invoice: single.invoice,
      location: item.location,
      lines: 1,
      total: item.qty * item.price,
      verifier: single.verifier,
      date: today()
    };
    updateData((current) => ({
      ...current,
      stock: [...current.stock, item],
      receipts: addReceiptDelivery(current.receipts, receipt)
    }), `Single upload: ${item.ref} added to ${item.location} against invoice ${item.invoice}.`);
    setSingle({
      ref: "", name: "", category: "", qty: 1, price: 0, location: allowedLocations[0],
      supplier: "", condition: "Good", reorder: 2, verifier: "", invoice: ""
    });
    setModal(null);
    setPage("receipts");
  };

  const addBulk = async (event) => {
    event.preventDefault();
    if (!bulk.file) return alert("Please select a CSV file.");
    const text = await bulk.file.text();
    const rows = csvToObjects(text);
    const required = ["part_reference", "part_name", "category", "quantity", "unit_price", "condition", "reorder_level"];
    if (!rows.length || !required.every((key) => Object.prototype.hasOwnProperty.call(rows[0], key))) {
      return alert("The CSV headers are invalid.");
    }

    const items = rows.map((row, index) => ({
      id: Date.now() + index,
      ref: row.part_reference,
      name: row.part_name,
      category: row.category,
      qty: Number(row.quantity) || 0,
      price: Number(row.unit_price) || 0,
      condition: row.condition || "Good",
      reorder: Number(row.reorder_level) || 0,
      location: bulk.location,
      supplier: bulk.supplier
    }));

    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    updateData((current) => ({
      ...current,
      stock: [...current.stock, ...items],
      receipts: addReceiptDelivery(current.receipts, {
        id: Date.now(), supplier: bulk.supplier, invoice: bulk.invoice,
        location: bulk.location, lines: items.length, total,
        verifier: bulk.verifier, date: today()
      })
    }), `Bulk CSV upload: ${items.length} lines added to ${bulk.location}.`);

    setBulk({ supplier: "", invoice: "", location: allowedLocations[0], verifier: "", file: null });
    setModal(null);
    setPage("receipts");
  };

  const addJobLine = () => {
    setJob((current) => ({
      ...current,
      lines: [...current.lines, { ref: "", name: "", qty: 1, price: 0, payment: "Captain-paid" }]
    }));
  };

  const updateJobLine = (index, field, value) => {
    setJob((current) => ({
      ...current,
      lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, [field]: value } : line)
    }));
  };

  const removeJobLine = (index) => {
    setJob((current) => ({ ...current, lines: current.lines.filter((_, i) => i !== index) }));
  };

  const jobTotals = job.lines.reduce((acc, line) => {
    const value = Number(line.qty || 0) * Number(line.price || 0);
    if (line.payment === "Captain-paid") acc.paid += value;
    else acc.free += value;
    return acc;
  }, { paid: 0, free: 0 });

  const createJob = (event) => {
    event.preventDefault();
    if (!job.lines.length) return alert("Add at least one part or engine-oil line.");
    const newJob = { ...job, id: `JC-${String(data.jobs.length + 1).padStart(4, "0")}`, status: "Open", date: today() };
    updateData((current) => ({ ...current, jobs: [...current.jobs, newJob] }),
      `${newJob.id} created: ${newJob.type} at ${newJob.location}.`);
    setJob({ vehicle: "", captain: "", location: allowedLocations[0], type: "Maintenance", technician: "", odometer: "", description: "", lines: [] });
    setModal(null);
    setPage("jobs");
  };

  const roleLabel = role === "manager" ? "Manager access: all locations." : `Inventory Officer access: ${allowedLocations[0]} only.`;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <img className="company-logo" src="/mechpad-sign.png" alt="MechPad" />
          <div className="muted">Aftersales & Supply Chain Management</div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <label>Active role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="manager">Aftersales & Supply Chain Manager</option>
              {LOCATIONS.map((location) => <option key={location} value={`inventory:${location}`}>Inventory Officer — {location}</option>)}
            </select>
          </label>
          <div className="notice">{roleLabel}</div>
          <nav>{[
            ["dashboard", "Dashboard"], ["inventory", "Inventory"], ["receipts", "Supplier Receipts"],
            ["jobs", "Job Cards"], ["reports", "Reports"], ["audit", "Activity Log"]
          ].map(([key, label]) => <button key={key} className={page === key ? "active" : ""} onClick={() => setPage(key)}>{label}</button>)}</nav>
          <div className="muted side-note">Demo data is saved in this browser.</div>
        </aside>

        <main className="content">
          {page === "dashboard" && <Dashboard data={data} stock={visibleStock} jobs={visibleJobs} receipts={data.receipts} totals={totals} />}
          {page === "inventory" && <Inventory stock={visibleStock} search={search} setSearch={setSearch} filterLocation={filterLocation} setFilterLocation={setFilterLocation} locations={allowedLocations} onSingle={openSingle} onBulk={openBulk} />}
          {page === "receipts" && <Receipts receipts={data.receipts} />}
          {page === "jobs" && <Jobs jobs={visibleJobs} onNew={() => { setJob((current) => ({ ...current, location: allowedLocations[0], lines: [] })); setModal("job"); }} />}
          {page === "reports" && <Reports jobs={visibleJobs} totals={totals} />}
          {page === "audit" && <Audit entries={data.audit} />}
        </main>
      </div>

      {modal === "single" && <Modal title="Single upload" onClose={() => setModal(null)}>
        <form onSubmit={addSingle} className="form-grid">
          <Field label="Part reference"><input required value={single.ref} onChange={(e) => setSingle({ ...single, ref: e.target.value })} /></Field>
          <Field label="Part name"><input required value={single.name} onChange={(e) => setSingle({ ...single, name: e.target.value })} /></Field>
          <Field label="Category"><input required value={single.category} onChange={(e) => setSingle({ ...single, category: e.target.value })} /></Field>
          <Field label="Quantity"><input required type="number" min="1" value={single.qty} onChange={(e) => setSingle({ ...single, qty: e.target.value })} /></Field>
          <Field label="Unit price"><input required type="number" min="0" value={single.price} onChange={(e) => setSingle({ ...single, price: e.target.value })} /></Field>
          <Field label="Location"><select value={single.location} onChange={(e) => setSingle({ ...single, location: e.target.value })}>{allowedLocations.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Supplier"><input required value={single.supplier} onChange={(e) => setSingle({ ...single, supplier: e.target.value })} /></Field>
          <Field label="Invoice number"><input required value={single.invoice} onChange={(e) => setSingle({ ...single, invoice: e.target.value })} /></Field>
          <Field label="Condition"><select value={single.condition} onChange={(e) => setSingle({ ...single, condition: e.target.value })}><option>Good</option><option>Used</option><option>Failed</option><option>Returned</option><option>Scrap</option></select></Field>
          <Field label="Reorder level"><input type="number" min="0" value={single.reorder} onChange={(e) => setSingle({ ...single, reorder: e.target.value })} /></Field>
          <Field label="Verified by"><input required value={single.verifier} onChange={(e) => setSingle({ ...single, verifier: e.target.value })} /></Field>
          <div className="form-actions"><button className="primary">Save single upload</button></div>
        </form>
      </Modal>}

      {modal === "bulk" && <Modal title="Bulk CSV upload" onClose={() => setModal(null)}>
        <form onSubmit={addBulk} className="form-grid">
          <Field label="Supplier"><input required value={bulk.supplier} onChange={(e) => setBulk({ ...bulk, supplier: e.target.value })} /></Field>
          <Field label="Invoice number"><input required value={bulk.invoice} onChange={(e) => setBulk({ ...bulk, invoice: e.target.value })} /></Field>
          <Field label="Receiving location"><select value={bulk.location} onChange={(e) => setBulk({ ...bulk, location: e.target.value })}>{allowedLocations.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Verified by"><input required value={bulk.verifier} onChange={(e) => setBulk({ ...bulk, verifier: e.target.value })} /></Field>
          <Field label="CSV file"><input required type="file" accept=".csv,text/csv" onChange={(e) => setBulk({ ...bulk, file: e.target.files?.[0] || null })} /></Field>
          <div className="notice full-width">Required columns: part_reference, part_name, category, quantity, unit_price, condition, reorder_level</div>
          <div className="form-actions"><button className="primary">Process CSV upload</button></div>
        </form>
      </Modal>}

      {modal === "job" && <Modal title="New job card" onClose={() => setModal(null)}>
        <form onSubmit={createJob}>
          <div className="form-grid">
            <Field label="Vehicle plate number"><input required value={job.vehicle} onChange={(e) => setJob({ ...job, vehicle: e.target.value })} /></Field>
            <Field label="Captain name"><input required value={job.captain} onChange={(e) => setJob({ ...job, captain: e.target.value })} /></Field>
            <Field label="Location"><select value={job.location} onChange={(e) => setJob({ ...job, location: e.target.value })}>{allowedLocations.map((x) => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Job type"><select value={job.type} onChange={(e) => setJob({ ...job, type: e.target.value })}>{JOB_TYPES.map((x) => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Assigned technician"><input required value={job.technician} onChange={(e) => setJob({ ...job, technician: e.target.value })} /></Field>
            <Field label="Odometer"><input type="number" min="0" value={job.odometer} onChange={(e) => setJob({ ...job, odometer: e.target.value })} /></Field>
          </div>
          <div className="section-head"><h3>Parts and engine oil</h3><button type="button" onClick={addJobLine}>＋ Add line</button></div>
          <p className="muted">Classify every line as Captain-paid or Company complimentary.</p>
          {job.lines.map((line, index) => <div className="job-line" key={index}>
            <Field label="Reference"><input required value={line.ref} onChange={(e) => updateJobLine(index, "ref", e.target.value)} /></Field>
            <Field label="Item / oil name"><input required value={line.name} onChange={(e) => updateJobLine(index, "name", e.target.value)} /></Field>
            <Field label="Qty"><input required type="number" min="1" value={line.qty} onChange={(e) => updateJobLine(index, "qty", e.target.value)} /></Field>
            <Field label="Unit price"><input required type="number" min="0" value={line.price} onChange={(e) => updateJobLine(index, "price", e.target.value)} /></Field>
            <Field label="Payment"><select value={line.payment} onChange={(e) => updateJobLine(index, "payment", e.target.value)}>{PAYMENT_TYPES.map((x) => <option key={x}>{x}</option>)}</select></Field>
            <button type="button" onClick={() => removeJobLine(index)}>Remove</button>
          </div>)}
          <div className="notice">
            <div><b>Captain-paid:</b> {money(jobTotals.paid)}</div>
            <div><b>Company complimentary:</b> {money(jobTotals.free)}</div>
            <div><b>Combined:</b> {money(jobTotals.paid + jobTotals.free)}</div>
          </div>
          <Field label="Complaint / work description"><textarea required rows="3" value={job.description} onChange={(e) => setJob({ ...job, description: e.target.value })} /></Field>
          <div className="form-actions"><button className="primary">Create job card</button></div>
        </form>
      </Modal>}
    </div>
  );
}

function Field({ label, children }) { return <label>{label}{children}</label>; }

function Modal({ title, onClose, children }) {
  return <div className="modal-backdrop"><div className="modal-card"><div className="modal-head"><h3>{title}</h3><button onClick={onClose}>Close</button></div>{children}</div></div>;
}

function Dashboard({ stock, jobs, receipts, totals, data }) {
  const low = stock.filter((x) => x.qty <= x.reorder).length;
  return <><div className="page-head"><h2>Dashboard</h2><span className="muted">Live operational overview</span></div>
    <div className="metrics">
      <Metric label="Stock lines" value={stock.length}/><Metric label="Low-stock items" value={low}/>
      <Metric label="Job cards" value={jobs.length}/><Metric label="Captain-paid" value={money(totals.paid)}/>
      <Metric label="Complimentary" value={money(totals.free)}/><Metric label="Stock value" value={money(stock.reduce((a,x)=>a+x.qty*x.price,0))}/>
      <Metric label="Open jobs" value={jobs.filter((x)=>x.status!=="Closed"&&x.status!=="Cancelled").length}/><Metric label="Receipts" value={receipts.length}/>
    </div>
    <div className="panel"><h3>Recent activity</h3>{data.audit.slice(-8).reverse().map((x,i)=><div className="activity" key={i}>{x}</div>)}</div>
  </>;
}
function Metric({ label, value }) { return <div className="metric"><span className="muted">{label}</span><strong>{value}</strong></div>; }
function Inventory({ stock, search, setSearch, filterLocation, setFilterLocation, locations, onSingle, onBulk }) {
  return <><div className="page-head"><h2>Inventory</h2><div className="actions"><button className="primary" onClick={onSingle}>＋ Single upload</button><button onClick={onBulk}>＋ Bulk upload</button></div></div>
    <div className="panel"><div className="form-grid"><Field label="Location"><select value={filterLocation} onChange={(e)=>setFilterLocation(e.target.value)}><option value="">All locations</option>{locations.map((x)=><option key={x}>{x}</option>)}</select></Field><Field label="Search"><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Part reference or name"/></Field></div>
    <div className="table-wrap"><table><thead><tr><th>Reference</th><th>Item</th><th>Asset</th><th>Location</th><th>Qty</th><th>Unit price</th><th>Selling price</th><th>Condition</th><th>Status</th></tr></thead><tbody>{stock.map((x)=><tr key={x.id}><td>{x.ref}</td><td>{x.name}<div className="muted">{x.category}</div></td><td>{x.assetBrand ? `${x.assetBrand} ${x.assetModel}` : "—"}<div className="muted">{x.assetType || "—"}</div></td><td>{x.location}</td><td>{x.qty}</td><td>{money(x.price)}</td><td>{x.sellingPrice ? money(x.sellingPrice) : "—"}</td><td>{x.condition}</td><td><span className={`tag ${x.qty<=x.reorder?"red":"green"}`}>{x.qty<=x.reorder?"Low stock":"Available"}</span></td></tr>)}</tbody></table></div></div>
  </>;
}
function Receipts({ receipts }) {
  return <><div className="page-head"><h2>Supplier Receipts</h2></div><div className="panel"><div className="table-wrap"><table><thead><tr><th>Invoice</th><th>Supplier</th><th>Location</th><th>Lines</th><th>Total</th><th>Verified by</th><th>Date</th></tr></thead><tbody>{receipts.map((x)=><tr key={x.id}><td>{x.invoice}</td><td>{x.supplier}</td><td>{x.location}</td><td>{x.lines}</td><td>{money(x.total)}</td><td>{x.verifier}</td><td>{x.date}</td></tr>)}</tbody></table></div></div></>;
}
function Jobs({ jobs, onNew }) {
  return <><div className="page-head"><h2>Job Cards</h2><button className="primary" onClick={onNew}>＋ New job card</button></div><div className="notice">Every job card has one job type. Each part or engine-oil line is classified separately.</div><div className="panel"><div className="table-wrap"><table><thead><tr><th>Job card</th><th>Vehicle</th><th>Captain</th><th>Type</th><th>Location</th><th>Captain-paid</th><th>Complimentary</th><th>Status</th></tr></thead><tbody>{jobs.map((j)=><tr key={j.id}><td>{j.id}</td><td>{j.vehicle}</td><td>{j.captain}</td><td><span className="tag blue">{j.type}</span></td><td>{j.location}</td><td>{money(j.lines.filter((x)=>x.payment==="Captain-paid").reduce((a,x)=>a+x.qty*x.price,0))}</td><td>{money(j.lines.filter((x)=>x.payment==="Company complimentary").reduce((a,x)=>a+x.qty*x.price,0))}</td><td><span className="tag">{j.status}</span></td></tr>)}</tbody></table></div></div></>;
}
function Reports({ jobs, totals }) {
  return <><div className="page-head"><h2>Reports</h2></div><div className="metrics">{JOB_TYPES.slice(0,4).map((type)=><Metric key={type} label={type} value={jobs.filter((x)=>x.type===type).length}/>)}</div><div className="panel"><h3>Cost classification</h3><div className="notice"><b>Captain-paid / recoverable:</b> {money(totals.paid)}</div><div className="notice"><b>Company complimentary:</b> {money(totals.free)}</div><div className="notice"><b>Combined value:</b> {money(totals.paid+totals.free)}</div></div></>;
}
function Audit({ entries }) { return <><div className="page-head"><h2>Activity Log</h2></div><div className="panel">{entries.slice().reverse().map((x,i)=><div className="activity" key={i}>{x}</div>)}</div></>; }

export default App;