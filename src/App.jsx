import React, { useEffect, useMemo, useState } from "react";
import { hasSupabaseConfig, supabase } from "./supabase";

const LOCATIONS = ["Ibadan", "Ilupeju", "Kano", "Abuja", "Akure", "Ilorin", "Asaba", "Ondo"];
const JOB_TYPES = ["Maintenance", "Repair", "Refurbishment", "Warranty", "Maintenance & Repair"];
const PAYMENT_TYPES = ["Captain-paid", "Company complimentary"];
const PART_CATEGORIES = ["Body & Frame", "Brake System", "Consumables & Service Items", "Control & Cables", "Drive System", "Electrical & Electronics", "Engine & Transmission", "Fuel, Air & Filter System", "Lubricants", "Suspension & Steering", "Wheels & Tyres"];

function generatePartCode(value) {
  const name = String(value || "").trim().replace(/\\s+/g, " ");
  if (!name) return "";
  const words = name.split(" ");
  if (words.length === 1) return (words[0] + "XXXX").slice(0, 4).toUpperCase();
  return (words[0].slice(0, 2) + words[1].slice(0, 1) + words[words.length - 1].slice(0, 1)).slice(0, 4).toUpperCase();
}
const STORAGE_KEY = "mechpadInventoryLedgerV5";
const LEGACY_STORAGE_KEY = "mechpadInventoryReactSampleV4";

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
  batches: sampleStock.map((item, index) => ({
    id: `OPENING-${index + 1}`,
    batchId: `OPENING-${String(index + 1).padStart(5, "0")}`,
    sourceType: "Opening Stock",
    ref: item.ref,
    location: item.location,
    qtyReceived: item.qty,
    unitCost: item.price,
    sellingPrice: item.sellingPrice,
    receivedAt: "2026-01-01T00:00:00.000Z",
    supplier: item.supplier,
    invoice: "OPENING"
  })),
  purchaseOrders: [],
  movements: [],
  receipts: sampleReceipts,
  jobs: [],
  audit: ["Demo inventory initialized."]
};

const money = (value) => `₦${Number(value || 0).toLocaleString("en-NG")}`;
const today = () => new Date().toLocaleDateString("en-GB");
const todayISO = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY));
    if (!saved) return initialData;
    const stock = Array.isArray(saved.stock) ? saved.stock : initialData.stock;
    return {
      ...initialData,
      ...saved,
      batches: Array.isArray(saved.batches) ? saved.batches : stock.map((item, index) => ({
        id: `MIGRATED-${item.id || index + 1}`,
        batchId: `OPENING-${String(item.id || index + 1).padStart(5, "0")}`,
        sourceType: "Opening Stock",
        ref: item.ref,
        location: item.location,
        qtyReceived: Number(item.qty) || 0,
        unitCost: Number(item.price) || 0,
        sellingPrice: Number(item.sellingPrice || item.price) || null,
        receivedAt: "2026-01-01T00:00:00.000Z",
        supplier: item.supplier || "",
        invoice: "OPENING"
      })),
      purchaseOrders: Array.isArray(saved.purchaseOrders) ? saved.purchaseOrders : [],
      movements: Array.isArray(saved.movements) ? saved.movements : []
    };
  } catch {
    return initialData;
  }
}

function emptyWorkspaceData(location) {
  return {
    ...initialData,
    stock: sampleStock
      .filter((item) => item.location === location)
      .map((item) => ({ ...item, qty: 0 })),
    batches: [],
    purchaseOrders: [],
    movements: [],
    receipts: [],
    jobs: [],
    audit: []
  };
}

function normalizeWorkspaceData(payload, location) {
  const defaults = emptyWorkspaceData(location);
  if (!payload || typeof payload !== "object") return defaults;
  return {
    ...defaults,
    ...payload,
    stock: Array.isArray(payload.stock) ? payload.stock : defaults.stock,
    batches: Array.isArray(payload.batches) ? payload.batches : [],
    purchaseOrders: Array.isArray(payload.purchaseOrders) ? payload.purchaseOrders : [],
    movements: Array.isArray(payload.movements) ? payload.movements : [],
    receipts: Array.isArray(payload.receipts) ? payload.receipts : [],
    jobs: Array.isArray(payload.jobs) ? payload.jobs : [],
    audit: Array.isArray(payload.audit) ? payload.audit : []
  };
}

function workspacePayload(data, location) {
  return {
    stock: data.stock.filter((item) => item.location === location),
    batches: (data.batches || []).filter((batch) => batch.location === location),
    purchaseOrders: (data.purchaseOrders || []).filter((po) => po.location === location),
    movements: (data.movements || []).filter((movement) => movement.location === location),
    receipts: data.receipts.filter((receipt) => receipt.location === location),
    jobs: data.jobs.filter((job) => job.location === location),
    audit: data.audit
  };
}

function roleName(role) {
  return ({
    business_head: "Business Head",
    manager: "Manager, Aftersales & Supply Chain",
    finance: "Finance",
    inventory_officer: "Inventory Officer",
    workshop_officer: "Workshop Officer",
    technical_ops_lead: "Technical Ops Lead"
  })[role] || role;
}

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }
    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) console.error("Failed to restore Supabase session:", error.message);
      setSession(data?.session || null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (authLoading) return <div className="auth-shell"><div className="panel">Checking your session…</div></div>;
  if (demoMode) {
    return <InventoryWorkspace
      key="local-demo"
      profile={{ display_name: "Local demo", role: "business_head", location: null }}
      onSignOut={() => setDemoMode(false)}
      demoMode
    />;
  }
  if (!hasSupabaseConfig) return <SetupRequired onDemo={() => setDemoMode(true)} />;
  if (!session) return <SignIn />;
  return <AuthenticatedWorkspace session={session} />;
}

function SetupRequired({ onDemo }) {
  return <div className="auth-shell"><div className="auth-card panel">
    <img className="company-logo" src="/mechpad-sign.png" alt="MechPad" />
    <h1>Secure workspace setup required</h1>
    <p>The Supabase project URL and public anon key have not been configured for this deployment.</p>
    <p className="muted">Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in the deployment environment, then redeploy. Do not put a service-role key in the browser or repository.</p>
    {import.meta.env.DEV && <button className="primary" onClick={onDemo}>Open local demo (not secure)</button>}
  </div></div>;
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    setBusy(false);
  };

  return <div className="auth-shell"><form className="auth-card panel" onSubmit={submit}>
    <img className="company-logo" src="/mechpad-sign.png" alt="MechPad" />
    <h1>Sign in to MechPad</h1>
    <p className="muted">Use the account assigned to your role and location.</p>
    <Field label="Work email"><input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
    <Field label="Password"><input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></Field>
    {error && <div className="notice auth-error" role="alert">{error}</div>}
    <button className="primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
  </form></div>;
}

function AuthenticatedWorkspace({ session }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    supabase.from("profiles")
      .select("id, display_name, role, location, active")
      .eq("id", session.user.id)
      .single()
      .then(({ data, error: profileError }) => {
        if (!mounted) return;
        if (profileError) setError("Your account is not assigned a MechPad workspace. Ask an administrator to activate your profile.");
        else if (!data.active) setError("This account has been deactivated. Contact the Business Head.");
        else setProfile(data);
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [session.user.id]);

  const signOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(`Unable to sign out: ${signOutError.message}`);
  };

  if (loading) return <div className="auth-shell"><div className="panel">Loading your workspace…</div></div>;
  if (error || !profile) return <div className="auth-shell"><div className="auth-card panel"><h1>Workspace unavailable</h1><p role="alert">{error || "Profile could not be loaded."}</p><button onClick={signOut}>Sign out</button></div></div>;
  return <InventoryWorkspace key={profile.id} profile={profile} supabaseClient={supabase} onSignOut={signOut} />;
}

function batchRemaining(batch, movements) {
  const issued = movements
    .filter((movement) => movement.batchId === batch.id)
    .reduce((sum, movement) => sum + Number(movement.qty || 0), 0);
  return Math.max(0, Number(batch.qtyReceived || 0) - issued);
}

function inventoryRows(stock, batches, movements) {
  const catalogItems = [...new Map(stock.map((item) => [
    `${item.ref}::${item.location}`,
    item
  ])).values()];
  return catalogItems.map((item) => {
    const itemBatches = batches
      .filter((batch) => batch.ref === item.ref && batch.location === item.location)
      .sort((a, b) => new Date(a.receivedAt) - new Date(b.receivedAt));
    const remaining = itemBatches.map((batch) => ({ batch, qty: batchRemaining(batch, movements) }));
    const activeBatches = remaining.filter((entry) => entry.qty > 0);
    const currentBatch = activeBatches[0]?.batch;
    const nextBatch = activeBatches[1]?.batch;
    const qty = activeBatches.reduce((sum, entry) => sum + entry.qty, 0);
    const stockValue = activeBatches.reduce((sum, entry) => sum + entry.qty * Number(entry.batch.unitCost || 0), 0);
    return {
      ...item,
      qty,
      price: currentBatch?.unitCost ?? item.price,
      sellingPrice: currentBatch?.sellingPrice ?? null,
      nextPrice: nextBatch?.sellingPrice ?? null,
      stockValue,
      priceNeeded: activeBatches.some((entry) => entry.batch.sellingPrice == null)
    };
  });
}

function allocateFIFO(ref, location, requestedQty, batches, movements) {
  let remaining = requestedQty;
  const allocations = [];
  const fifoBatches = batches
    .filter((batch) => batch.ref === ref && batch.location === location)
    .sort((a, b) => new Date(a.receivedAt) - new Date(b.receivedAt));

  for (const batch of fifoBatches) {
    const available = batchRemaining(batch, movements);
    if (available <= 0) continue;
    if (batch.sellingPrice == null) {
      return { allocations: [], error: `${batch.batchId} has no selling price yet. Ask HQ to price it first.` };
    }
    const qty = Math.min(available, remaining);
    allocations.push({ batch, qty });
    remaining -= qty;
    if (remaining === 0) break;
  }

  if (remaining > 0) {
    const available = requestedQty - remaining;
    return { allocations: [], error: `Only ${available} of ${requestedQty} requested units are available at ${location}.` };
  }
  return { allocations, error: "" };
}

function averageFIFOPrice(ref, location, qty, batches, movements) {
  const quantity = Number(qty);
  if (!Number.isInteger(quantity) || quantity < 1) return "";
  const allocation = allocateFIFO(ref, location, quantity, batches, movements);
  if (allocation.error) return "";
  const total = allocation.allocations.reduce((sum, entry) =>
    sum + entry.qty * Number(entry.batch.sellingPrice), 0
  );
  return Math.round(total / quantity * 100) / 100;
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

  if (matchIndex === -1) return [...receipts, { ...delivery, deliveryCount: 1, deliveries: [delivery] }];

  return receipts.map((receipt, index) => index === matchIndex ? {
    ...receipt,
    lines: receipt.lines + delivery.lines,
    qty: Number(receipt.qty || 0) + Number(delivery.qty || 0),
    total: receipt.total + delivery.total,
    date: delivery.date,
    verifier: delivery.verifier,
    lastDeliveryDate: delivery.date,
    deliveryCount: (Number(receipt.deliveryCount) ||
      (Array.isArray(receipt.deliveries) ? receipt.deliveries.length : Number(receipt.deliveries) || 1)) + 1,
    deliveries: [...(Array.isArray(receipt.deliveries) ? receipt.deliveries : []), delivery]
  } : receipt);
}

function InventoryWorkspace({ profile, supabaseClient = null, onSignOut, demoMode = false }) {
  const canAccessAllLocations = ["business_head", "manager"].includes(profile.role);
  const canManageHQ = ["business_head", "manager"].includes(profile.role);
  const canOperateLocation = ["business_head", "manager", "inventory_officer", "workshop_officer", "technical_ops_lead"].includes(profile.role);
  const canReceiveStock = canOperateLocation;
  const canEditWorkspace = canOperateLocation;
  const [data, setData] = useState(() =>
    demoMode ? readSaved() : emptyWorkspaceData(profile.location || LOCATIONS[0])
  );
  const [activeLocation, setActiveLocation] = useState(canAccessAllLocations ? "All locations" : (profile.location || LOCATIONS[0]));
  const [workspaceReady, setWorkspaceReady] = useState(demoMode);
  const [workspaceError, setWorkspaceError] = useState("");
  const [partMaster, setPartMaster] = useState([]);
  const [vehicleMaster, setVehicleMaster] = useState([]);
  const [partNumbers, setPartNumbers] = useState([]);
  const [partSearch, setPartSearch] = useState("");
  const [partError, setPartError] = useState("");
  const [partSaving, setPartSaving] = useState(false);
  const [partForm, setPartForm] = useState({ name: "", category: "Body & Frame", notes: "", vehicleModel: "", suffix: "" });
  const [page, setPage] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [single, setSingle] = useState({
    ref: "", name: "", category: "", qty: 1, price: 0, location: "Ibadan",
    supplier: "", invoice: "", condition: "Good", reorder: 2, verifier: ""
  });
  const [bulk, setBulk] = useState({ supplier: "", invoice: "", location: "Ibadan", verifier: "", file: null });
  const [poForm, setPoForm] = useState({
    location: "Ibadan",
    supplier: "",
    invoice: "",
    transportCost: 0,
    lines: [{ ref: "", qtyOrdered: 1, unitCost: "" }]
  });
  const [receivingPoId, setReceivingPoId] = useState(null);
  const [receiveForm, setReceiveForm] = useState({ date: todayISO(), verifier: "", quantities: {} });
  const [priceDraft, setPriceDraft] = useState({ batchId: "", sellingPrice: "" });
  const [job, setJob] = useState({
    vehicle: "", captain: "", location: "Ibadan", type: "Maintenance",
    technician: "", odometer: "", description: "", lines: []
  });

  const allowedLocations = canAccessAllLocations
    ? (activeLocation === "All locations" ? LOCATIONS : [activeLocation])
    : [profile.location];

  useEffect(() => {
    if (!supabaseClient) {
      setVehicleMaster([
        { vehicle_model: "Neo NX", brand: "TVS", vehicle_type: "2W", powertrain: "ICE", model_code: "NN", prefix: "2WTVNN" },
        { vehicle_model: "HLX 100", brand: "TVS", vehicle_type: "2W", powertrain: "ICE", model_code: "HL", prefix: "2WTVHL" },
        { vehicle_model: "King Deluxe", brand: "TVS", vehicle_type: "3W", powertrain: "ICE", model_code: "KD", prefix: "3WTVKD" },
        { vehicle_model: "RE", brand: "Bajaj", vehicle_type: "3W", powertrain: "ICE", model_code: "RE", prefix: "3WBARE" },
        { vehicle_model: "Pulsar", brand: "Bajaj", vehicle_type: "2W", powertrain: "ICE", model_code: "PU", prefix: "2WBAPU" },
        { vehicle_model: "Champion 100", brand: "Qlink", vehicle_type: "2W", powertrain: "ICE", model_code: "CH", prefix: "2WQLCH" },
        { vehicle_model: "Hunter", brand: "Hero", vehicle_type: "2W", powertrain: "ICE", model_code: "HU", prefix: "2WHEHU" },
        { vehicle_model: "Ekon M1", brand: "Spiro", vehicle_type: "2W", powertrain: "EV", model_code: "EM", prefix: "2WSPEM" },
        { vehicle_model: "Crux Rev", brand: "Yamaha", vehicle_type: "2W", powertrain: "ICE", model_code: "CR", prefix: "2WYACR" }
      ]);
      return undefined;
    }
    let mounted = true;
    const loadPartCatalogue = async () => {
      const [partsResult, vehiclesResult, numbersResult] = await Promise.all([
        supabaseClient.from("part_master").select("*").order("serial_no"),
        supabaseClient.from("vehicle_master").select("*").eq("active", true).order("vehicle_model"),
        supabaseClient.from("part_numbers").select("*").eq("active", true).order("full_sku")
      ]);
      if (!mounted) return;
      const failure = partsResult.error || vehiclesResult.error || numbersResult.error;
      if (failure) {
        setPartError(`Could not load the part catalogue: ${failure.message}`);
        return;
      }
      setPartMaster(partsResult.data || []);
      setVehicleMaster(vehiclesResult.data || []);
      setPartNumbers(numbersResult.data || []);
    };
    loadPartCatalogue();
    return () => { mounted = false; };
  }, [supabaseClient]);

  useEffect(() => {
    if (supabaseClient) {
      let mounted = true;
      setWorkspaceReady(false);
      setWorkspaceError("");
      const loadWorkspace = async () => {
        const allLocations = canAccessAllLocations && activeLocation === "All locations";
        const request = supabaseClient.from("inventory_workspaces")
          .select("location, payload");
        const { data: workspaces, error } = allLocations
          ? await request.in("location", LOCATIONS)
          : await request.eq("location", activeLocation).maybeSingle().then((result) => ({
              data: result.data ? [result.data] : [],
              error: result.error
            }));
        if (!mounted) return;
        if (error) {
          console.error("Failed to load location workspace:", error.message);
          setWorkspaceError(`Could not load ${allLocations ? "all locations" : activeLocation}: ${error.message}`);
          setWorkspaceReady(false);
          return;
        }
        if (allLocations) {
          const combined = workspaces.reduce((acc, workspace) => {
            const locationData = normalizeWorkspaceData(workspace.payload, workspace.location);
            return {
              ...acc,
              stock: [...acc.stock, ...locationData.stock],
              batches: [...acc.batches, ...locationData.batches],
              purchaseOrders: [...acc.purchaseOrders, ...locationData.purchaseOrders],
              movements: [...acc.movements, ...locationData.movements],
              receipts: [...acc.receipts, ...locationData.receipts],
              jobs: [...acc.jobs, ...locationData.jobs],
              audit: [...new Set([...acc.audit, ...locationData.audit])]
            };
          }, { stock: [], batches: [], purchaseOrders: [], movements: [], receipts: [], jobs: [], audit: [] });
          setData(combined);
        } else {
          setData(normalizeWorkspaceData(workspaces[0]?.payload, activeLocation));
        }
        setWorkspaceReady(true);
      };
      loadWorkspace();
      return () => { mounted = false; };
    }
    setWorkspaceReady(true);
    return undefined;
  }, [supabaseClient, activeLocation, canAccessAllLocations]);

  useEffect(() => {
    if (supabaseClient || !demoMode) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [supabaseClient, demoMode, data]);

  useEffect(() => {
    if (!supabaseClient || !workspaceReady || !canEditWorkspace) return undefined;
    const locationsToSave = canAccessAllLocations && activeLocation === "All locations"
      ? LOCATIONS
      : [activeLocation];
    const timeout = window.setTimeout(async () => {
      const updatedAt = new Date().toISOString();
      const results = await Promise.all(locationsToSave.map((location) =>
        supabaseClient.from("inventory_workspaces").upsert({
          location,
          payload: workspacePayload(data, location),
          updated_at: updatedAt,
          updated_by: profile.id
        }, { onConflict: "location" })
      ));
      const failed = results.find((result) => result.error);
      if (failed) {
        console.error("Failed to save location workspace:", failed.error.message);
        setWorkspaceError(`Could not save workspace data: ${failed.error.message}`);
      } else {
        setWorkspaceError("");
      }
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [supabaseClient, workspaceReady, activeLocation, data, profile.id, canEditWorkspace, canAccessAllLocations]);

  useEffect(() => {
    if (!allowedLocations.includes(single.location)) setSingle((x) => ({ ...x, location: allowedLocations[0] }));
    if (!allowedLocations.includes(bulk.location)) setBulk((x) => ({ ...x, location: allowedLocations[0] }));
    if (!allowedLocations.includes(job.location)) setJob((x) => ({ ...x, location: allowedLocations[0] }));
    if (filterLocation && !allowedLocations.includes(filterLocation)) setFilterLocation("");
  }, [activeLocation]);

  const visibleStock = useMemo(() => {
    const query = search.toLowerCase();
    return inventoryRows(data.stock, data.batches || [], data.movements || []).filter((item) =>
      allowedLocations.includes(item.location) &&
      (!filterLocation || item.location === filterLocation) &&
      `${item.ref} ${item.name}`.toLowerCase().includes(query)
    );
  }, [data.stock, data.batches, data.movements, search, filterLocation, activeLocation]);

  const visibleJobs = data.jobs.filter((item) => allowedLocations.includes(item.location));
  const visibleReceipts = data.receipts.filter((item) => allowedLocations.includes(item.location));
  const visiblePurchaseOrders = (data.purchaseOrders || []).filter((po) => allowedLocations.includes(po.location));
  const inboundBatches = (data.batches || []).filter((batch) => batch.sourceType === "Vendor" && allowedLocations.includes(batch.location));
  const pricesNeeded = (data.batches || []).filter((batch) =>
    batch.sellingPrice == null &&
    allowedLocations.includes(batch.location) &&
    batchRemaining(batch, data.movements || []) > 0
  ).map((batch) => ({ ...batch, qtyRemaining: batchRemaining(batch, data.movements || []) }));

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

  const createPart = async (event) => {
    event.preventDefault();
    setPartError("");
    const name = partForm.name.trim().replace(/\\s+/g, " ");
    if (!name || !partForm.category) return setPartError("Enter a part name and category.");
    if (partMaster.some((part) => String(part.part_name || "").trim().toLowerCase() === name.toLowerCase())) {
      return setPartError("This part name already exists. Search the catalogue before registering it.");
    }
    setPartSaving(true);
    try {
      if (supabaseClient && !demoMode) {
        const { data: result, error } = await supabaseClient.rpc("create_part_master_part", {
          p_part_name: name,
          p_category: partForm.category,
          p_notes: partForm.notes.trim() || null,
          p_vehicle_model: partForm.vehicleModel || null,
          p_suffix: partForm.suffix.trim() || null
        });
        if (error) throw error;
        const created = Array.isArray(result) ? result[0] : result;
        if (!created) throw new Error("The database did not return the new part record.");
        setPartMaster((current) => [...current, {
          serial_no: created.serial_no, part_name: created.part_name, category: created.category,
          part_code: created.part_code, notes: partForm.notes.trim() || null, active: true
        }].sort((a, b) => Number(a.serial_no) - Number(b.serial_no)));
        if (created.part_number) setPartNumbers((current) => [...current, {
          serial_no: created.serial_no, vehicle_model: created.vehicle_model,
          part_number: created.part_number, full_sku: created.full_sku, active: true
        }]);
      } else {
        const serialNo = Math.max(324, ...partMaster.map((part) => Number(part.serial_no) || 0)) + 1;
        if (serialNo > 999) throw new Error("The generator has reached its 999-part serial limit.");
        const code = generatePartCode(name);
        const vehicle = vehicleMaster.find((item) => item.vehicle_model === partForm.vehicleModel);
        const core = vehicle ? `${vehicle.prefix}${code}${String(serialNo).padStart(3, "0")}` : null;
        const suffix = partForm.suffix.trim().toUpperCase();
        const created = { serial_no: serialNo, part_name: name, category: partForm.category, part_code: code, notes: partForm.notes.trim() || null, active: true };
        setPartMaster((current) => [...current, created]);
        if (core) setPartNumbers((current) => [...current, { serial_no: serialNo, vehicle_model: vehicle.vehicle_model, part_number: core, full_sku: suffix ? `${core}-${suffix}` : core, active: true }]);
      }
      setPartForm({ name: "", category: "Body & Frame", notes: "", vehicleModel: "", suffix: "" });
      setModal(null);
      setPage("parts");
    } catch (error) {
      setPartError(error.message || "Could not register this part.");
    } finally {
      setPartSaving(false);
    }
  };

  const openSingle = () => {
    setSingle((current) => ({ ...current, location: allowedLocations[0] }));
    setModal("single");
  };

  const openBulk = () => {
    setBulk((current) => ({ ...current, location: allowedLocations[0] }));
    setModal("bulk");
  };

  const openPurchaseOrder = () => {
    setPoForm({
      location: allowedLocations[0],
      supplier: "",
      invoice: "",
      transportCost: 0,
      lines: [{ ref: "", qtyOrdered: 1, unitCost: "" }]
    });
    setModal("purchase-order");
  };

  const createPurchaseOrder = (event) => {
    event.preventDefault();
    const lines = poForm.lines.map((line) => ({
      ...line,
      qtyOrdered: Number(line.qtyOrdered),
      unitCost: Number(line.unitCost)
    }));
    if (!poForm.supplier.trim() || !poForm.invoice.trim() || lines.some((line) =>
      !line.ref || !Number.isInteger(line.qtyOrdered) || line.qtyOrdered < 1 ||
      !Number.isFinite(line.unitCost) || line.unitCost <= 0
    )) {
      return alert("Enter a vendor, invoice reference, item, whole-number quantity, and valid unit cost for every line.");
    }

    const date = new Date();
    const dayCode = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const locationCode = poForm.location.slice(0, 3).toUpperCase();
    const sequence = String(data.purchaseOrders.filter((po) => po.poNo.startsWith(`PO-${locationCode}-${dayCode}-`)).length + 1).padStart(2, "0");
    const poNo = `PO-${locationCode}-${dayCode}-${sequence}`;
    const purchaseOrder = {
      id: `PO-${Date.now()}`,
      poNo,
      location: poForm.location,
      supplier: poForm.supplier.trim(),
      invoice: poForm.invoice.trim(),
      date: today(),
      transportCost: Number(poForm.transportCost) || 0,
      status: "Awaiting delivery",
      lines: lines.map((line, index) => ({
        id: `${Date.now()}-${index}`,
        ref: line.ref,
        qtyOrdered: line.qtyOrdered,
        unitCost: line.unitCost,
        qtyReceived: 0
      }))
    };

    updateData((current) => {
      const newStockRows = purchaseOrder.lines
        .filter((line, index, lines) =>
          lines.findIndex((candidate) => candidate.ref === line.ref) === index &&
          !current.stock.some((item) => item.ref === line.ref && item.location === purchaseOrder.location)
        )
        .map((line, index) => {
          const catalogItem = current.stock.find((item) => item.ref === line.ref) ||
            sampleStock.find((item) => item.ref === line.ref);
          return {
            ...catalogItem,
            id: `PO-STOCK-${Date.now()}-${index}`,
            location: purchaseOrder.location,
            qty: 0,
            supplier: purchaseOrder.supplier
          };
        });
      return {
        ...current,
        stock: [...current.stock, ...newStockRows],
        purchaseOrders: [...(current.purchaseOrders || []), purchaseOrder]
      };
    }, `${poNo} created for ${purchaseOrder.location}; awaiting delivery.`);
    setModal(null);
    setPage("purchase-orders");
  };

  const openReceiveDelivery = (purchaseOrder) => {
    setReceivingPoId(purchaseOrder.id);
    setReceiveForm({
      date: todayISO(),
      verifier: "",
      quantities: Object.fromEntries(purchaseOrder.lines.map((line) => [line.id, ""]))
    });
    setModal("receive");
  };

  const receiveDelivery = (event) => {
    event.preventDefault();
    const purchaseOrder = data.purchaseOrders.find((po) => po.id === receivingPoId);
    if (!purchaseOrder) return alert("The purchase order could not be found.");
    const receivedLines = purchaseOrder.lines.map((line) => ({
      ...line,
      receivedNow: Number(receiveForm.quantities[line.id] || 0)
    })).filter((line) => line.receivedNow > 0);
    if (!receivedLines.length || !receiveForm.verifier.trim()) {
      return alert("Enter at least one delivered quantity and the receiving officer's name.");
    }
    const invalidLine = receivedLines.find((line) =>
      !Number.isInteger(line.receivedNow)
    );
    if (invalidLine) return alert("Each delivery quantity must be a whole number.");

    const orderedValue = purchaseOrder.lines.reduce((sum, line) => sum + line.qtyOrdered * line.unitCost, 0);
    const transportRate = orderedValue > 0 ? purchaseOrder.transportCost / orderedValue : 0;
    const receiptDate = new Date(`${receiveForm.date}T12:00:00`).toISOString();
    const deliveryId = `DEL-${Date.now()}`;
    const newBatches = receivedLines.map((line, index) => ({
      id: `${deliveryId}-${index + 1}`,
      batchId: `B-${purchaseOrder.location.slice(0, 3).toUpperCase()}-${String((data.batches || []).length + index + 1).padStart(5, "0")}`,
      sourceType: "Vendor",
      ref: line.ref,
      location: purchaseOrder.location,
      qtyReceived: line.receivedNow,
      unitCost: Math.round(line.unitCost * (1 + transportRate) * 100) / 100,
      sellingPrice: null,
      receivedAt: receiptDate,
      supplier: purchaseOrder.supplier,
      invoice: purchaseOrder.invoice,
      poNo: purchaseOrder.poNo,
      purchaseOrderId: purchaseOrder.id,
      receivedBy: receiveForm.verifier.trim(),
      deliveryId
    }));
    const deliveryTotal = newBatches.reduce((sum, batch) => sum + batch.qtyReceived * batch.unitCost, 0);
    const receipt = {
      id: deliveryId,
      supplier: purchaseOrder.supplier,
      invoice: purchaseOrder.invoice,
      location: purchaseOrder.location,
      poNo: purchaseOrder.poNo,
      lines: receivedLines.length,
      qty: receivedLines.reduce((sum, line) => sum + line.receivedNow, 0),
      total: deliveryTotal,
      verifier: receiveForm.verifier.trim(),
      date: new Date(receiptDate).toLocaleDateString("en-GB")
    };

    updateData((current) => ({
      ...current,
      batches: [...(current.batches || []), ...newBatches],
      purchaseOrders: current.purchaseOrders.map((po) => po.id !== purchaseOrder.id ? po : {
        ...po,
        lines: po.lines.map((line) => {
          const deliveredLine = receivedLines.find((entry) => entry.id === line.id);
          return deliveredLine
            ? { ...line, qtyReceived: line.qtyReceived + deliveredLine.receivedNow }
            : line;
        }),
        status: po.lines.some((line) => {
          const delivered = receivedLines.find((entry) => entry.id === line.id)?.receivedNow || 0;
          return line.qtyReceived + delivered > line.qtyOrdered;
        }) ? "Over-delivered" : po.lines.every((line) => {
          const delivered = receivedLines.find((entry) => entry.id === line.id)?.receivedNow || 0;
          return line.qtyReceived + delivered >= line.qtyOrdered;
        }) ? "Received" : "Partially received"
      }),
      receipts: addReceiptDelivery(current.receipts, receipt)
    }), `${receipt.qty} units received against ${purchaseOrder.poNo}; batches are waiting for HQ pricing.`);
    setModal(null);
    setPage("inbound");
  };

  const openPriceBatch = (batch) => {
    setPriceDraft({ batchId: batch.id, sellingPrice: "", targetMargin: "" });
    setModal("price-batch");
  };

  const setBatchPrice = (event) => {
    event.preventDefault();
    const batch = data.batches.find((entry) => entry.id === priceDraft.batchId);
    const marginInput = priceDraft.targetMargin.trim();
    const margin = marginInput ? Number(marginInput) : null;
    const sellingPrice = margin != null && Number.isFinite(margin) && margin >= 0 && margin < 95
      ? Math.ceil((batch?.unitCost / (1 - margin / 100)) / 50) * 50
      : Number(priceDraft.sellingPrice);
    if (!batch || !Number.isFinite(sellingPrice) || sellingPrice <= 0 ||
      (marginInput && (margin == null || !Number.isFinite(margin) || margin < 0 || margin >= 95))) {
      return alert("Enter a selling price or a target margin from 0% to below 95%.");
    }
    updateData((current) => ({
      ...current,
      batches: current.batches.map((entry) =>
        entry.id === batch.id ? { ...entry, sellingPrice } : entry
      )
    }), `Selling price set for ${batch.batchId} (${batch.ref}) at ${money(sellingPrice)}.`);
    setModal(null);
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
      lines: current.lines.map((line, lineIndex) => {
        if (lineIndex !== index) return line;
        if (field === "qty") {
          return {
            ...line,
            qty: value,
            price: averageFIFOPrice(line.ref, current.location, value, data.batches || [], data.movements || [])
          };
        }
        if (field !== "ref" && field !== "name") return { ...line, [field]: value };

        const query = value.trim().toLowerCase();
        const matchingItems = inventoryRows(data.stock, data.batches || [], data.movements || []);
        const match = matchingItems.find((item) =>
          item.location === current.location && (field === "ref"
            ? item.ref.toLowerCase() === query
            : item.name.toLowerCase() === query)
        ) || data.stock.find((item) =>
          field === "ref"
            ? item.ref.toLowerCase() === query
            : item.name.toLowerCase() === query
        );

        const localMatch = match && matchingItems.find((item) =>
          item.ref === match.ref && item.location === current.location
        );
        return match
          ? {
            ...line,
            ref: match.ref,
            name: match.name,
            price: localMatch
              ? averageFIFOPrice(match.ref, current.location, line.qty, data.batches || [], data.movements || [])
              : ""
          }
          : field === "ref"
            ? { ...line, ref: value, name: "", price: "" }
            : { ...line, name: value, ref: "", price: "" };
      })
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
    const issuedLines = [];
    const movements = [];
    const plannedMovements = [...(data.movements || [])];
    for (const line of job.lines) {
      const qty = Number(line.qty);
      if (!line.ref || !Number.isInteger(qty) || qty < 1) return alert("Each job card part line needs an item and a whole-number quantity.");
      const allocation = allocateFIFO(line.ref, job.location, qty, data.batches || [], plannedMovements);
      if (allocation.error) return alert(`${line.ref}: ${allocation.error}`);
      for (const entry of allocation.allocations) {
        const issueId = `ISS-${Date.now()}-${issuedLines.length}`;
        issuedLines.push({
          ...line,
          id: issueId,
          qty: entry.qty,
          price: entry.batch.sellingPrice,
          unitCost: entry.batch.unitCost,
          batchId: entry.batch.batchId
        });
        const movement = {
          id: issueId,
          type: "Issue",
          batchId: entry.batch.id,
          ref: line.ref,
          location: job.location,
          qty: entry.qty,
          date: today()
        };
        movements.push(movement);
        plannedMovements.push(movement);
      }
    }
    const newJob = { ...job, lines: issuedLines, id: `JC-${String(data.jobs.length + 1).padStart(4, "0")}`, status: "Open", date: today() };
    updateData((current) => ({
      ...current,
      jobs: [...current.jobs, newJob],
      movements: [...(current.movements || []), ...movements]
    }),
      `${newJob.id} created: ${newJob.type} at ${newJob.location}.`);
    setJob({ vehicle: "", captain: "", location: allowedLocations[0], type: "Maintenance", technician: "", odometer: "", description: "", lines: [] });
    setModal(null);
    setPage("jobs");
  };

  const roleLabel = `${roleName(profile.role)}${profile.location ? ` · ${profile.location}` : " · HQ access"}`;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <img className="company-logo" src="/mechpad-sign.png" alt="MechPad" />
          <div className="muted">Aftersales & Supply Chain Management</div>
        </div>
        <div className="account-actions">
          <div><strong>{profile.display_name}</strong><div className="muted">{roleLabel}</div></div>
          <button onClick={onSignOut}>{demoMode ? "Exit demo" : "Sign out"}</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          {canAccessAllLocations
            ? <label>Location workspace<select value={activeLocation} onChange={(e) => setActiveLocation(e.target.value)}><option>All locations</option>{LOCATIONS.map((location) => <option key={location}>{location}</option>)}</select></label>
            : <div className="workspace-location"><span className="muted">Your location workspace</span><strong>{profile.location}</strong></div>}
          <div className="notice">{roleLabel}</div>
          <nav>{[
            ["dashboard", "Dashboard"], ["inventory", "Inventory"], ["purchase-orders", "Purchase Orders"],
            ["inbound", "Inbound Log"], ["prices-needed", "Prices Needed"], ["receipts", "Supplier Receipts"],
            ["jobs", "Job Cards"], ["parts", "Parts Catalogue"], ["reports", "Reports"], ["audit", "Activity Log"]
          ].filter(([key]) =>
            (key !== "prices-needed" || canManageHQ) &&
            (key !== "purchase-orders" || canReceiveStock) &&
            (key !== "inbound" || canReceiveStock) &&
            (key !== "jobs" || canOperateLocation)
          ).map(([key, label]) => <button key={key} className={page === key ? "active" : ""} onClick={() => setPage(key)}>{label}</button>)}</nav>
          {workspaceError && <div className="notice auth-error" role="alert">{workspaceError}</div>}
          <div className="muted side-note">{demoMode ? "Local demo data is saved only in this browser." : "Workspace data is shared securely with your authorized location team."}</div>
        </aside>

        <main className="content">
          {!workspaceReady
            ? <div className="panel">Loading {activeLocation === "All locations" ? "all location workspaces" : `${activeLocation} workspace`}…</div>
            : <>
          {page === "dashboard" && <Dashboard data={data} stock={visibleStock} jobs={visibleJobs} receipts={data.receipts} totals={totals} />}
          {page === "inventory" && <Inventory stock={visibleStock} search={search} setSearch={setSearch} filterLocation={filterLocation} setFilterLocation={setFilterLocation} locations={allowedLocations} purchaseOrders={data.purchaseOrders || []} onPurchaseOrder={openPurchaseOrder} canManage={canManageHQ} />}
          {page === "purchase-orders" && canReceiveStock && <PurchaseOrders purchaseOrders={visiblePurchaseOrders} onNew={openPurchaseOrder} onReceive={openReceiveDelivery} canManage={canManageHQ} />}
          {page === "inbound" && canReceiveStock && <Inbound batches={inboundBatches} />}
          {page === "prices-needed" && <PricesNeeded batches={pricesNeeded} onPrice={openPriceBatch} canManage={canManageHQ} />}
          {page === "receipts" && <Receipts receipts={data.receipts} />}
          {page === "jobs" && canOperateLocation && <Jobs jobs={visibleJobs} onNew={() => { setJob((current) => ({ ...current, location: allowedLocations[0], lines: [] })); setModal("job"); }} canOperate={canOperateLocation} />}
          {page === "parts" && <PartsCatalogue parts={partMaster} partNumbers={partNumbers} vehicles={vehicleMaster} search={partSearch} setSearch={setPartSearch} error={partError} canManage={canManageHQ} onNew={() => { setPartError(""); setPartForm({ name: "", category: "Body & Frame", notes: "", vehicleModel: "", suffix: "" }); setModal("new-part"); }} />}
          {page === "reports" && <Reports jobs={visibleJobs} totals={totals} />}
          {page === "audit" && <Audit entries={data.audit} />}
            </>}
        </main>
      </div>

      {workspaceError && <div className="workspace-error" role="alert">{workspaceError}</div>}
      {modal === "new-part" && <Modal title="Register new part" onClose={() => setModal(null)}>
        <form onSubmit={createPart}>
          <div className="notice">Registration creates a catalogue record only. It does not add stock, a purchase order or a receipt. Part serials are permanent.</div>
          <div className="form-grid">
            <Field label="Part name"><input required maxLength="120" value={partForm.name} onChange={(e) => setPartForm((current) => ({ ...current, name: e.target.value }))} placeholder="e.g. Front Brake Shoe" /></Field>
            <Field label="Category"><select required value={partForm.category} onChange={(e) => setPartForm((current) => ({ ...current, category: e.target.value }))}>{PART_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></Field>
            <Field label="Generated part code"><input readOnly value={generatePartCode(partForm.name)} placeholder="Generated from part name" /></Field>
            <Field label="Vehicle model (optional)"><select value={partForm.vehicleModel} onChange={(e) => setPartForm((current) => ({ ...current, vehicleModel: e.target.value }))}><option value="">Catalogue only — no vehicle number yet</option>{vehicleMaster.map((vehicle) => <option key={vehicle.vehicle_model} value={vehicle.vehicle_model}>{vehicle.vehicle_model} · {vehicle.prefix}</option>)}</select></Field>
            <Field label="Optional suffix (e.g. OEM)"><input maxLength="12" value={partForm.suffix} onChange={(e) => setPartForm((current) => ({ ...current, suffix: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") }))} placeholder="Leave blank for standard part number" /></Field>
            <Field label="Notes"><input value={partForm.notes} onChange={(e) => setPartForm((current) => ({ ...current, notes: e.target.value }))} placeholder="Optional specifications or details" /></Field>
          </div>
          {partForm.name.trim() && <div className="notice">{partForm.vehicleModel ? `Preview: ${vehicleMaster.find((vehicle) => vehicle.vehicle_model === partForm.vehicleModel)?.prefix || "PREFIX"}${generatePartCode(partForm.name)}${String(Math.max(324, ...partMaster.map((part) => Number(part.serial_no) || 0)) + 1).padStart(3, "0")}${partForm.suffix ? `-${partForm.suffix}` : ""}` : `Part code ${generatePartCode(partForm.name)} will be assigned a permanent serial when saved.`}</div>}
          {partError && <div className="notice auth-error" role="alert">{partError}</div>}
          <div className="form-actions"><button type="button" onClick={() => setModal(null)}>Cancel</button><button className="primary" disabled={partSaving}>{partSaving ? "Registering…" : "Register part"}</button></div>
        </form>
      </Modal>}
      {modal === "purchase-order" && <Modal title="Create purchase order" onClose={() => setModal(null)}>
        <form onSubmit={createPurchaseOrder}>
          <div className="form-grid">
            <Field label="Receiving location"><select value={poForm.location} onChange={(e) => setPoForm({ ...poForm, location: e.target.value })}>{allowedLocations.map((location) => <option key={location}>{location}</option>)}</select></Field>
            <Field label="Vendor"><input required value={poForm.supplier} onChange={(e) => setPoForm({ ...poForm, supplier: e.target.value })} /></Field>
            <Field label="Vendor invoice / reference"><input required value={poForm.invoice} onChange={(e) => setPoForm({ ...poForm, invoice: e.target.value })} /></Field>
            <Field label="Trip / PO transport cost"><input type="number" min="0" step="0.01" value={poForm.transportCost} onChange={(e) => setPoForm({ ...poForm, transportCost: e.target.value })} /></Field>
          </div>
          <div className="section-head"><h3>Order lines</h3><button type="button" onClick={() => setPoForm((current) => ({ ...current, lines: [...current.lines, { ref: "", qtyOrdered: 1, unitCost: "" }] }))}>＋ Add line</button></div>
          {poForm.lines.map((line, index) => <div className="job-line" key={index}>
            <Field label="Item code"><select required value={line.ref} onChange={(e) => setPoForm((current) => ({ ...current, lines: current.lines.map((entry, lineIndex) => lineIndex === index ? { ...entry, ref: e.target.value } : entry) }))}><option value="">Select an item</option>{[...new Map([...sampleStock, ...data.stock].map((item) => [item.ref, item])).values()].map((item) => <option key={item.ref} value={item.ref}>{item.ref} — {item.name}</option>)}</select></Field>
            <Field label="Quantity"><input required type="number" min="1" step="1" value={line.qtyOrdered} onChange={(e) => setPoForm((current) => ({ ...current, lines: current.lines.map((entry, lineIndex) => lineIndex === index ? { ...entry, qtyOrdered: e.target.value } : entry) }))} /></Field>
            <Field label="Unit cost"><input required type="number" min="0.01" step="0.01" value={line.unitCost} onChange={(e) => setPoForm((current) => ({ ...current, lines: current.lines.map((entry, lineIndex) => lineIndex === index ? { ...entry, unitCost: e.target.value } : entry) }))} /></Field>
            {poForm.lines.length > 1 && <button type="button" onClick={() => setPoForm((current) => ({ ...current, lines: current.lines.filter((_, lineIndex) => lineIndex !== index) }))}>Remove</button>}
          </div>)}
          <div className="notice">A PO creates expected quantities only. Stock becomes available after receipt and remains unsellable until HQ sets a selling price.</div>
          <div className="form-actions"><button className="primary">Create PO</button></div>
        </form>
      </Modal>}

      {modal === "receive" && <Modal title="Record delivery" onClose={() => setModal(null)}>
        {(() => {
          const purchaseOrder = data.purchaseOrders.find((po) => po.id === receivingPoId);
          if (!purchaseOrder) return <div className="notice">Purchase order not found.</div>;
          return <form onSubmit={receiveDelivery}>
            <div className="notice"><b>{purchaseOrder.poNo}</b> · {purchaseOrder.supplier} · {purchaseOrder.location} · Invoice {purchaseOrder.invoice}</div>
            <div className="form-grid">
              <Field label="Delivery date"><input required type="date" value={receiveForm.date} onChange={(e) => setReceiveForm({ ...receiveForm, date: e.target.value })} /></Field>
              <Field label="Received by"><input required value={receiveForm.verifier} onChange={(e) => setReceiveForm({ ...receiveForm, verifier: e.target.value })} /></Field>
            </div>
            <div className="table-wrap"><table><thead><tr><th>Item</th><th>Ordered</th><th>Received to date</th><th>Remaining</th><th>Delivered now</th></tr></thead><tbody>{purchaseOrder.lines.map((line) => {
              const item = data.stock.find((entry) => entry.ref === line.ref);
              const remaining = line.qtyOrdered - line.qtyReceived;
              return <tr key={line.id}><td>{line.ref}<div className="muted">{item?.name}</div></td><td>{line.qtyOrdered}</td><td>{line.qtyReceived}</td><td>{remaining}</td><td><input aria-label={`Delivered now ${line.ref}`} type="number" min="0" step="1" disabled={!remaining} value={receiveForm.quantities[line.id] || ""} onChange={(e) => setReceiveForm((current) => ({ ...current, quantities: { ...current.quantities, [line.id]: e.target.value } }))} /></td></tr>;
            })}</tbody></table></div>
            <div className="form-actions"><button className="primary">Record delivery</button></div>
          </form>;
        })()}
      </Modal>}

      {modal === "price-batch" && <Modal title="Set batch selling price" onClose={() => setModal(null)}>
        {(() => {
          const batch = data.batches.find((entry) => entry.id === priceDraft.batchId);
          if (!batch) return <div className="notice">Batch not found.</div>;
          const margin = priceDraft.targetMargin === "" ? Number.NaN : Number(priceDraft.targetMargin);
          const suggested = Number.isFinite(margin) && margin >= 0 && margin < 95
            ? Math.ceil((batch.unitCost / (1 - margin / 100)) / 50) * 50
            : 0;
          return <form onSubmit={setBatchPrice} className="form-grid">
            <div className="notice full-width"><b>{batch.batchId}</b> · {batch.ref} · {batch.location}<br />Landed cost: {money(batch.unitCost)}</div>
            <Field label="Target margin (%)"><input type="number" min="0" max="94.99" step="0.01" value={priceDraft.targetMargin} onChange={(e) => setPriceDraft((current) => ({ ...current, targetMargin: e.target.value, sellingPrice: "" }))} /></Field>
            <Field label="Selling price"><input type="number" min="0.01" step="0.01" required={!priceDraft.targetMargin} value={priceDraft.targetMargin && suggested ? suggested : priceDraft.sellingPrice} onChange={(e) => setPriceDraft((current) => ({ ...current, targetMargin: "", sellingPrice: e.target.value }))} /></Field>
            {suggested > 0 && <div className="muted full-width">Suggested price rounded up to the next ₦50: {money(suggested)}</div>}
            <div className="form-actions"><button className="primary">Set price</button></div>
          </form>;
        })()}
      </Modal>}

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
            <Field label="Location"><select value={job.location} onChange={(e) => {
              const location = e.target.value;
              setJob((current) => ({
                ...current,
                location,
                lines: current.lines.map((line) => ({
                  ...line,
                  price: averageFIFOPrice(line.ref, location, line.qty, data.batches || [], data.movements || [])
                }))
              }));
            }}>{allowedLocations.map((x) => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Job type"><select value={job.type} onChange={(e) => setJob({ ...job, type: e.target.value })}>{JOB_TYPES.map((x) => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Assigned technician"><input required value={job.technician} onChange={(e) => setJob({ ...job, technician: e.target.value })} /></Field>
            <Field label="Odometer"><input type="number" min="0" value={job.odometer} onChange={(e) => setJob({ ...job, odometer: e.target.value })} /></Field>
          </div>
          <div className="section-head"><h3>Parts and engine oil</h3><button type="button" onClick={addJobLine}>＋ Add line</button></div>
          <p className="muted">Classify every line as Captain-paid or Company complimentary.</p>
          {job.lines.map((line, index) => <div className="job-line" key={index}>
            <Field label="Reference"><input required list="job-part-references" value={line.ref} onChange={(e) => updateJobLine(index, "ref", e.target.value)} /></Field>
            <Field label="Item / oil name"><input required list="job-part-names" value={line.name} onChange={(e) => updateJobLine(index, "name", e.target.value)} /></Field>
            <Field label="Qty"><input required type="number" min="1" value={line.qty} onChange={(e) => updateJobLine(index, "qty", e.target.value)} /></Field>
            <Field label="Unit price (FIFO)"><input required type="number" min="0.01" value={line.price} readOnly /></Field>
            <Field label="Payment"><select value={line.payment} onChange={(e) => updateJobLine(index, "payment", e.target.value)}>{PAYMENT_TYPES.map((x) => <option key={x}>{x}</option>)}</select></Field>
            <button type="button" onClick={() => removeJobLine(index)}>Remove</button>
          </div>)}
          <datalist id="job-part-references">{data.stock.filter((item) => allowedLocations.includes(item.location)).map((item) => <option key={item.ref} value={item.ref}>{item.name}</option>)}</datalist>
          <datalist id="job-part-names">{data.stock.filter((item) => allowedLocations.includes(item.location)).map((item) => <option key={item.name} value={item.name}>{item.ref}</option>)}</datalist>
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

function PartsCatalogue({ parts, partNumbers, vehicles, search, setSearch, error, canManage, onNew }) {
  const query = search.trim().toLowerCase();
  const filtered = parts.filter((part) => `${part.serial_no} ${part.part_code} ${part.part_name} ${part.category}`.toLowerCase().includes(query));
  const numbersFor = (serial) => partNumbers.filter((number) => Number(number.serial_no) === Number(serial));
  return <>
    <div className="page-head"><h2>Parts Catalogue</h2>{canManage && <button className="primary" onClick={onNew}>＋ Register new part</button>}</div>
    <div className="notice">The master catalogue is separate from stock. A part can be registered before it has ever been purchased. Serial numbers are permanent and never reused.</div>
    {error && <div className="notice auth-error" role="alert">{error}</div>}
    <div className="panel"><div className="form-grid"><Field label="Search parts"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Part name, code, serial or category" /></Field><div className="metric"><span className="muted">Registered parts</span><strong>{parts.length}</strong></div><div className="metric"><span className="muted">Vehicle models</span><strong>{vehicles.length}</strong></div></div>
      <div className="table-wrap"><table><thead><tr><th>Serial</th><th>Part code</th><th>Part name</th><th>Category</th><th>Vehicle part numbers</th><th>Status</th></tr></thead><tbody>{filtered.map((part) => <tr key={part.serial_no}><td>{String(part.serial_no).padStart(3, "0")}</td><td><strong>{part.part_code}</strong><div className="muted">{part.part_code}{String(part.serial_no).padStart(3, "0")}</div></td><td>{part.part_name}{part.notes && <div className="muted">{part.notes}</div>}</td><td>{part.category}</td><td>{numbersFor(part.serial_no).length ? numbersFor(part.serial_no).map((number) => <div key={number.id || number.full_sku}>{number.vehicle_model || vehicles.find((vehicle) => vehicle.prefix === String(number.full_sku).slice(0, 6))?.vehicle_model || "Vehicle"}: {number.full_sku}</div>) : <span className="muted">Not assigned to a vehicle</span>}</td><td><span className={`tag ${part.active === false ? "red" : "green"}`}>{part.active === false ? "INACTIVE" : "ACTIVE"}</span></td></tr>)}{!filtered.length && <tr><td colSpan="6" className="muted">{parts.length ? "No parts match your search." : "No master parts are loaded yet."}</td></tr>}</tbody></table></div>
    </div>
  </>;
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
      <Metric label="Complimentary" value={money(totals.free)}/><Metric label="Stock value" value={money(stock.reduce((a,x)=>a+x.stockValue,0))}/>
      <Metric label="Open jobs" value={jobs.filter((x)=>x.status!=="Closed"&&x.status!=="Cancelled").length}/><Metric label="Receipts" value={receipts.length}/>
    </div>
    <div className="panel"><h3>Recent activity</h3>{data.audit.slice(-8).reverse().map((x,i)=><div className="activity" key={i}>{x}</div>)}</div>
  </>;
}
function Metric({ label, value }) { return <div className="metric"><span className="muted">{label}</span><strong>{value}</strong></div>; }
function Inventory({ stock, search, setSearch, filterLocation, setFilterLocation, locations, purchaseOrders, onPurchaseOrder, canManage }) {
  const onOrder = (item) => purchaseOrders
    .filter((po) => po.location === item.location)
    .flatMap((po) => po.lines.filter((line) => line.ref === item.ref))
    .reduce((sum, line) => sum + Math.max(0, line.qtyOrdered - line.qtyReceived), 0);
  return <><div className="page-head"><h2>Inventory</h2>{canManage && <button className="primary" onClick={onPurchaseOrder}>＋ Purchase order</button>}</div>
    <div className="panel"><div className="form-grid"><Field label="Location"><select value={filterLocation} onChange={(e)=>setFilterLocation(e.target.value)}><option value="">All locations</option>{locations.map((x)=><option key={x}>{x}</option>)}</select></Field><Field label="Search"><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Part reference or name"/></Field></div>
    <div className="table-wrap"><table><thead><tr><th>Item code</th><th>Item</th><th>Asset</th><th>Location</th><th>On shelf</th><th>On order</th><th>Current unit cost</th><th>Current selling price</th><th>Stock value at cost</th><th>Status</th></tr></thead><tbody>{stock.map((x)=>{const outstanding=onOrder(x);const status=x.priceNeeded?"PRICE NEEDED":x.qty===0&&outstanding>0?"ON ORDER":x.qty===0?"NO STOCK":x.qty<=x.reorder?"REORDER":"OK";return <tr key={x.id}><td>{x.ref}</td><td>{x.name}<div className="muted">{x.category}</div></td><td>{x.assetBrand ? `${x.assetBrand} ${x.assetModel}` : "—"}<div className="muted">{x.assetType || "—"}</div></td><td>{x.location}</td><td>{x.qty}</td><td>{outstanding}</td><td>{x.qty ? money(x.price) : "—"}</td><td>{x.sellingPrice != null ? money(x.sellingPrice) : "—"}</td><td>{money(x.stockValue)}</td><td><span className={`tag ${status==="OK"?"green":status==="ON ORDER"?"blue":"red"}`}>{status}</span></td></tr>})}</tbody></table></div></div>
  </>;
}
function PurchaseOrders({ purchaseOrders, onNew, onReceive, canManage }) {
  return <><div className="page-head"><h2>Purchase Orders</h2>{canManage && <button className="primary" onClick={onNew}>＋ Create purchase order</button>}</div>
    <div className="notice">PO lines create expected stock only. Receive the counted quantity against the PO; each delivery creates its own batch.</div>
    <div className="panel"><div className="table-wrap"><table><thead><tr><th>PO number</th><th>Vendor / invoice</th><th>Location</th><th>Item</th><th>Ordered</th><th>Received</th><th>Outstanding</th><th>Unit cost</th><th>Status</th><th>Action</th></tr></thead><tbody>{purchaseOrders.flatMap((po) => po.lines.map((line) => {
      const remaining = Math.max(0, line.qtyOrdered - line.qtyReceived);
      const over = Math.max(0, line.qtyReceived - line.qtyOrdered);
      const status = over ? `Over by ${over}` : remaining ? line.qtyReceived ? "Partially received" : "Awaiting delivery" : "Received";
      return <tr key={line.id}><td>{po.poNo}</td><td>{po.supplier}<div className="muted">{po.invoice}</div></td><td>{po.location}</td><td>{line.ref}</td><td>{line.qtyOrdered}</td><td>{line.qtyReceived}</td><td>{remaining}</td><td>{money(line.unitCost)}</td><td><span className={`tag ${over?"red":remaining?"blue":"green"}`}>{status}</span></td><td>{remaining > 0 && <button onClick={() => onReceive(po)}>Receive delivery</button>}</td></tr>;
    }))}</tbody></table></div>{purchaseOrders.length === 0 && <p className="muted">No purchase orders yet.</p>}</div>
  </>;
}
function Inbound({ batches }) {
  return <><div className="page-head"><h2>Inbound Log</h2><span className="muted">Each delivery is recorded as a stock batch</span></div>
    <div className="panel"><div className="table-wrap"><table><thead><tr><th>Date received</th><th>Source</th><th>PO / Invoice</th><th>Item</th><th>Location</th><th>Qty received</th><th>Landed unit cost</th><th>Batch ID</th><th>Received by</th></tr></thead><tbody>{batches.map((batch) => <tr key={batch.id}><td>{new Date(batch.receivedAt).toLocaleDateString("en-GB")}</td><td>{batch.supplier}</td><td>{batch.poNo}<div className="muted">{batch.invoice}</div></td><td>{batch.ref}</td><td>{batch.location}</td><td>{batch.qtyReceived}</td><td>{money(batch.unitCost)}</td><td>{batch.batchId}</td><td>{batch.receivedBy}</td></tr>)}</tbody></table></div>{batches.length === 0 && <p className="muted">No vendor deliveries received yet.</p>}</div>
  </>;
}
function PricesNeeded({ batches, onPrice, canManage }) {
  return <><div className="page-head"><h2>Prices Needed</h2><span className="muted">{batches.length} received batch{batches.length === 1 ? "" : "es"} awaiting a selling price</span></div>
    <div className="notice">Received stock is not sellable until HQ sets a selling price for each batch.</div>
    <div className="panel"><div className="table-wrap"><table><thead><tr><th>Batch ID</th><th>Item</th><th>Location</th><th>Qty remaining</th><th>Landed cost</th><th>Vendor / PO</th><th>Action</th></tr></thead><tbody>{batches.map((batch) => <tr key={batch.id}><td>{batch.batchId}</td><td>{batch.ref}</td><td>{batch.location}</td><td>{batch.qtyRemaining}</td><td>{money(batch.unitCost)}</td><td>{batch.supplier}<div className="muted">{batch.poNo}</div></td><td>{canManage && <button className="primary" onClick={() => onPrice(batch)}>Set price</button>}</td></tr>)}</tbody></table></div>{batches.length === 0 && <p className="muted">All received batches have a selling price.</p>}</div>
  </>;
}
function Receipts({ receipts }) {
  return <><div className="page-head"><h2>Supplier Receipts</h2></div><div className="panel"><div className="table-wrap"><table><thead><tr><th>Invoice</th><th>Vendor</th><th>PO number</th><th>Location</th><th>Lines</th><th>Qty received</th><th>Total landed cost</th><th>Deliveries</th><th>Last delivery</th><th>Received by</th></tr></thead><tbody>{receipts.map((x)=><tr key={x.id}><td>{x.invoice}</td><td>{x.supplier}</td><td>{x.poNo || "—"}</td><td>{x.location}</td><td>{x.lines}</td><td>{x.qty || "—"}</td><td>{money(x.total)}</td><td>{x.deliveryCount || (Array.isArray(x.deliveries) ? x.deliveries.length : Number(x.deliveries)) || 1}</td><td>{x.date}</td><td>{x.verifier}</td></tr>)}</tbody></table></div></div></>;
}
function Jobs({ jobs, onNew, canOperate }) {
  return <><div className="page-head"><h2>Job Cards</h2>{canOperate && <button className="primary" onClick={onNew}>＋ New job card</button>}</div><div className="notice">Every job card has one job type. Each part or engine-oil line is classified separately.</div><div className="panel"><div className="table-wrap"><table><thead><tr><th>Job card</th><th>Vehicle</th><th>Captain</th><th>Type</th><th>Location</th><th>Captain-paid</th><th>Complimentary</th><th>Status</th></tr></thead><tbody>{jobs.map((j)=><tr key={j.id}><td>{j.id}</td><td>{j.vehicle}</td><td>{j.captain}</td><td><span className="tag blue">{j.type}</span></td><td>{j.location}</td><td>{money(j.lines.filter((x)=>x.payment==="Captain-paid").reduce((a,x)=>a+x.qty*x.price,0))}</td><td>{money(j.lines.filter((x)=>x.payment==="Company complimentary").reduce((a,x)=>a+x.qty*x.price,0))}</td><td><span className="tag">{j.status}</span></td></tr>)}</tbody></table></div></div></>;
}
function Reports({ jobs, totals }) {
  return <><div className="page-head"><h2>Reports</h2></div><div className="metrics">{JOB_TYPES.slice(0,4).map((type)=><Metric key={type} label={type} value={jobs.filter((x)=>x.type===type).length}/>)}</div><div className="panel"><h3>Cost classification</h3><div className="notice"><b>Captain-paid / recoverable:</b> {money(totals.paid)}</div><div className="notice"><b>Company complimentary:</b> {money(totals.free)}</div><div className="notice"><b>Combined value:</b> {money(totals.paid+totals.free)}</div></div></>;
}
function Audit({ entries }) { return <><div className="page-head"><h2>Activity Log</h2></div><div className="panel">{entries.slice().reverse().map((x,i)=><div className="activity" key={i}>{x}</div>)}</div></>; }

export default App;