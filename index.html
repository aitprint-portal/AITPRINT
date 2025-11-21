// Print Portal - Single-file React App (App.jsx)
// How to use:
// 1. Create a new React app (Vite or CRA).  
// 2. Install TailwindCSS (optional) or keep the inline styles.  
// 3. Replace src/App.jsx with this file and run `npm run dev` or `npm start`.
// Notes: This is a frontend-only prototype using localStorage as a mock backend.
// Real payment/UPI integration requires a backend or payment gateway (Razorpay/Paytm/PhonePe, etc.).

import React, { useEffect, useState } from "react";

// Simple utility functions
const uid = () => "UID" + Math.random().toString(36).slice(2, 9).toUpperCase();
const now = () => new Date().toISOString();

const STORAGE_KEY = "print_portal_data_v1";

const defaultAdmin = {
  username: "admin",
  password: "admin123",
};

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = {
      users: [],
      admin: defaultAdmin,
      createdAt: now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw);
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function App() {
  const [data, setData] = useState(loadData);
  const [view, setView] = useState("home"); // home | register | login | dashboard | admin
  const [message, setMessage] = useState("");
  const [auth, setAuth] = useState({ user: null, admin: false });

  useEffect(() => {
    saveData(data);
  }, [data]);

  // Registration
  function register({ name, mobile, type /* 'retailer' | 'distributor' */ }) {
    // pricing
    const price = type === "distributor" ? 499 : 199;
    const newUser = {
      id: uid(),
      name,
      mobile,
      type,
      price,
      wallet: 0,
      createdAt: now(),
      status: "pending", // pending until wallet top-up
    };
    const next = { ...data, users: [newUser, ...data.users] };
    setData(next);
    setMessage(`Registration created for ${name}. UID: ${newUser.id} — please recharge wallet first.`);
    setView("pay");
    // keep selected user id in message area for payment
    return newUser;
  }

  function findUserById(id) {
    return data.users.find((u) => u.id === id);
  }

  function topup(userId, amount) {
    const users = data.users.map((u) => {
      if (u.id === userId) {
        const updated = { ...u, wallet: (u.wallet || 0) + Number(amount) };
        // If wallet >= price, mark active
        if (updated.wallet >= updated.price) updated.status = "active";
        return updated;
      }
      return u;
    });
    const next = { ...data, users };
    setData(next);
    setMessage("Wallet recharged successfully.");
  }

  function markPaidSim(userId) {
    // This simulates checking the UPI payment. In real app use webhooks.
    topup(userId, findUserById(userId).price);
  }

  function loginUser(id) {
    const u = findUserById(id);
    if (!u) {
      setMessage("UID not found.");
      return;
    }
    if (u.status !== "active") {
      setMessage("User found but wallet not active. Please recharge first.");
      setAuth({ user: u, admin: false });
      setView("user");
      return;
    }
    setAuth({ user: u, admin: false });
    setView("user");
  }

  function adminLogin(username, password) {
    if (username === data.admin.username && password === data.admin.password) {
      setAuth({ user: data.admin, admin: true });
      setView("admin");
    } else {
      setMessage("Admin credentials incorrect.");
    }
  }

  function adminCredit(userId, amount) {
    topup(userId, amount);
  }

  function removeUser(userId) {
    const users = data.users.filter((u) => u.id !== userId);
    setData({ ...data, users });
  }

  // ---------- UI parts ----------
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Print Portal — Retailer & Distributor Management</h1>
          <div>
            <button className="mr-2 px-3 py-1 border rounded" onClick={() => { setView('home'); setAuth({user:null, admin:false}); }}>Home</button>
            <button className="mr-2 px-3 py-1 border rounded" onClick={() => setView('register')}>Register</button>
            <button className="mr-2 px-3 py-1 border rounded" onClick={() => setView('login')}>Login</button>
            <button className="px-3 py-1 border rounded" onClick={() => setView('adminLogin')}>Admin</button>
          </div>
        </header>

        {message && <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-300">{message}</div>}

        {view === 'home' && (
          <div>
            <h2 className="text-lg font-semibold">How it works</h2>
            <ol className="list-decimal ml-5 mt-2">
              <li>Register as Retailer (₹199) or Distributor (₹499).</li>
              <li>After registration, recharge wallet first using UPI (required).</li>
              <li>Once wallet has enough balance, account becomes active and you can use the portal.</li>
            </ol>
          </div>
        )}

        {view === 'register' && (
          <RegisterForm onCreate={(vals) => {
            const u = register(vals);
            // go to payment with new uid
            setMessage(`New UID created: ${u.id}. Proceed to recharge wallet ₹${u.price}.`);
            setView('pay');
            // store last uid to re-use in payment
            setData(d => ({...d, lastUid: u.id}));
          }} />
        )}

        {view === 'login' && (
          <div>
            <h3 className="font-semibold mb-2">Login by UID</h3>
            <LoginByUID onLogin={(id) => loginUser(id)} />
          </div>
        )}

        {view === 'pay' && (
          <PaymentPanel
            upiId={'7033151758-3@ybl'}
            onTopup={(uid, amount) => { topup(uid, amount); }}
            onSimulatePaid={(uid) => { markPaidSim(uid); }}
            defaultUid={data.lastUid}
            findUser={(id) => findUserById(id)}
          />
        )}

        {view === 'user' && auth.user && (
          <UserPanel user={auth.user} onLogout={() => { setAuth({user:null,admin:false}); setView('home'); }} />
        )}

        {view === 'adminLogin' && (
          <AdminLogin onLogin={(u,p) => adminLogin(u,p)} />
        )}

        {view === 'admin' && auth.admin && (
          <AdminPanel
            users={data.users}
            onCredit={(uid, amt) => adminCredit(uid, amt)}
            onRemove={(uid) => removeUser(uid)}
          />
        )}

        <footer className="mt-6 text-sm text-gray-500">Prototype — UPI: <strong>7033151758-3@ybl</strong>. For real payments integrate a gateway.</footer>
      </div>
    </div>
  );
}

// ---------- Subcomponents below ----------

function RegisterForm({ onCreate }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [type, setType] = useState("retailer");

  function submit(e) {
    e.preventDefault();
    if (!name || !mobile) return alert('Name and mobile required');
    onCreate({ name, mobile, type });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block">Name</label>
        <input className="border p-2 w-full" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div>
        <label className="block">Mobile</label>
        <input className="border p-2 w-full" value={mobile} onChange={e=>setMobile(e.target.value)} />
      </div>
      <div>
        <label className="block">Type</label>
        <select className="border p-2 w-full" value={type} onChange={e=>setType(e.target.value)}>
          <option value="retailer">Retailer — ₹199</option>
          <option value="distributor">Distributor — ₹499</option>
        </select>
      </div>
      <div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Create UID & Proceed to Pay</button>
      </div>
    </form>
  );
}

function LoginByUID({ onLogin }) {
  const [uidVal, setUidVal] = useState("");
  return (
    <div className="space-y-2">
      <input className="border p-2 w-full" placeholder="Enter UID e.g. UIDXXXXX" value={uidVal} onChange={e=>setUidVal(e.target.value)} />
      <div className="flex gap-2">
        <button className="px-3 py-1 border rounded" onClick={()=>onLogin(uidVal)}>Login</button>
      </div>
    </div>
  );
}

function PaymentPanel({ upiId, onTopup, onSimulatePaid, defaultUid, findUser }) {
  const [uidVal, setUidVal] = useState(defaultUid || "");
  const [amount, setAmount] = useState(0);

  useEffect(()=>{
    if (uidVal) {
      const u = findUser(uidVal);
      if (u) setAmount(u.price);
    }
  }, [uidVal]);

  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=PrintPortal&am=${amount}`;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Wallet Recharge</h3>
      <div>
        <label>UID</label>
        <input value={uidVal} onChange={e=>setUidVal(e.target.value)} className="border p-2 w-full" />
      </div>
      <div>
        <label>Amount (₹)</label>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="border p-2 w-full" />
      </div>
      <div className="flex gap-3 items-center">
        <a className="px-4 py-2 border rounded" href={upiLink}>Pay with UPI (open UPI-enabled app)</a>
        <button className="px-4 py-2 border rounded" onClick={()=>{ onSimulatePaid(uidVal); }}>I have paid (simulate)</button>
      </div>
      <div className="text-sm text-gray-600">UPI ID: <strong>{upiId}</strong>. Note: In this prototype 'I have paid' simulates a successful recharge. For live payments integrate a gateway and webhook.</div>
    </div>
  );
}

function UserPanel({ user, onLogout }) {
  return (
    <div>
      <h3 className="font-semibold">Welcome, {user.name} ({user.type})</h3>
      <p>UID: <strong>{user.id}</strong></p>
      <p>Wallet: ₹{user.wallet}</p>
      <p>Status: {user.status}</p>
      <div className="mt-3">
        <button className="px-3 py-1 border rounded mr-2" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  return (
    <div className="space-y-2 max-w-sm">
      <input className="border p-2 w-full" placeholder="Admin username" value={u} onChange={e=>setU(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Password" type="password" value={p} onChange={e=>setP(e.target.value)} />
      <button className="px-3 py-1 bg-gray-800 text-white rounded" onClick={()=>onLogin(u,p)}>Login as Admin</button>
    </div>
  );
}

function AdminPanel({ users, onCredit, onRemove }) {
  const [selected, setSelected] = useState(null);
  const [amt, setAmt] = useState(0);

  return (
    <div>
      <h3 className="font-semibold">Admin Panel</h3>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium">Users ({users.length})</h4>
          <div className="mt-2 space-y-2 max-h-64 overflow-auto">
            {users.map(u => (
              <div key={u.id} className="p-2 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{u.name} — {u.type}</div>
                  <div className="text-sm">{u.id} | ₹{u.wallet} | {u.status}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 border" onClick={()=>setSelected(u.id)}>Select</button>
                  <button className="px-2 py-1 border text-red-600" onClick={()=>onRemove(u.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium">Selected Actions</h4>
          {selected ? (
            <div className="space-y-2 mt-2">
              <div>Selected UID: <strong>{selected}</strong></div>
              <div>
                <label>Credit amount (₹)</label>
                <input type="number" className="border p-2 w-full" value={amt} onChange={e=>setAmt(e.target.value)} />
                <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded" onClick={()=>{ onCredit(selected, amt); setAmt(0); }}>Credit Wallet</button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600 mt-2">Select a user to credit wallet or remove account.</div>
          )}
        </div>
      </div>
    </div>
  );
}


<!-- Support contact -->
Support (WhatsApp only): 7070838282
