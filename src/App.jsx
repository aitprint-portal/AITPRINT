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
    setData(d => ({...d, lastUid: newUser.id}));
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
    const u = findUserById(userId);
    if (!u) { setMessage("UID not found for simulation."); return; }
    topup(userId, u.price);
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

  return (
    <div className="container">
      <div style={{background:'#fff',borderRadius:8,padding:20,boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
        <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h1 style={{fontSize:22,fontWeight:700}}>Print Portal — Retailer & Distributor</h1>
          <div>
            <button onClick={() => { setView('home'); setAuth({user:null, admin:false}); }} style={{marginRight:8}}>Home</button>
            <button onClick={() => setView('register')} style={{marginRight:8}}>Register</button>
            <button onClick={() => setView('login')} style={{marginRight:8}}>Login</button>
            <button onClick={() => setView('adminLogin')} >Admin</button>
          </div>
        </header>

        {message && <div style={{marginBottom:12, padding:10, background:'#fff4e5', borderLeft:'4px solid #ffd29b'}}>{message}</div>}

        {view === 'home' && (
          <div>
            <h2 style={{fontSize:16,fontWeight:600}}>How it works</h2>
            <ol style={{marginLeft:18, marginTop:8}}>
              <li>Register as Retailer (₹199) or Distributor (₹499).</li>
              <li>After registration, recharge wallet first using UPI (required).</li>
              <li>Once wallet has enough balance, account becomes active and you can use the portal.</li>
            </ol>
          </div>
        )}

        {view === 'register' && (
          <RegisterForm onCreate={(vals) => {
            const u = register(vals);
            setMessage(`New UID created: ${u.id}. Proceed to recharge wallet ₹${u.price}.`);
            setView('pay');
          }} />
        )}

        {view === 'login' && (
          <div>
            <h3 style={{fontWeight:600,marginBottom:8}}>Login by UID</h3>
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

        <footer style={{marginTop:16,fontSize:13,color:'#666'}}>Prototype — UPI: <strong>7033151758-3@ybl</strong>. Support (WhatsApp only): <strong>7070838282</strong></footer>
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
    <form onSubmit={submit} style={{display:'grid',gap:12,maxWidth:520}}>
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
        <button style={{padding:'8px 12px',background:'#2563eb',color:'#fff',borderRadius:6}}>Create UID & Proceed to Pay</button>
      </div>
    </form>
  );
}

function LoginByUID({ onLogin }) {
  const [uidVal, setUidVal] = useState("");
  return (
    <div style={{maxWidth:420}}>
      <input className="border p-2 w-full" placeholder="Enter UID e.g. UIDXXXXX" value={uidVal} onChange={e=>setUidVal(e.target.value)} />
      <div style={{marginTop:8}}>
        <button onClick={()=>onLogin(uidVal)} style={{padding:'6px 10px',borderRadius:6}}>Login</button>
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
    <div style={{maxWidth:520,display:'grid',gap:10}}>
      <h3 style={{fontWeight:600}}>Wallet Recharge</h3>
      <div>
        <label>UID</label>
        <input value={uidVal} onChange={e=>setUidVal(e.target.value)} className="border p-2 w-full" />
      </div>
      <div>
        <label>Amount (₹)</label>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="border p-2 w-full" />
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <a style={{padding:'8px 12px',border:'1px solid #ddd',borderRadius:6}} href={upiLink}>Pay with UPI (open UPI app)</a>
        <button style={{padding:'8px 12px',border:'1px solid #ddd',borderRadius:6}} onClick={()=>{ onSimulatePaid(uidVal); }}>I have paid (simulate)</button>
      </div>
      <div style={{fontSize:13,color:'#666'}}>UPI ID: <strong>{upiId}</strong>. Note: In this prototype 'I have paid' simulates a successful recharge. For live payments integrate a gateway.</div>
    </div>
  );
}

function UserPanel({ user, onLogout }) {
  return (
    <div>
      <h3 style={{fontWeight:600}}>Welcome, {user.name} ({user.type})</h3>
      <p>UID: <strong>{user.id}</strong></p>
      <p>Wallet: ₹{user.wallet}</p>
      <p>Status: {user.status}</p>
      <div style={{marginTop:12}}>
        <button onClick={onLogout} style={{padding:'6px 10px',borderRadius:6}}>Logout</button>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  return (
    <div style={{maxWidth:360,display:'grid',gap:8}}>
      <input placeholder="Admin username" value={u} onChange={e=>setU(e.target.value)} className="border p-2 w-full"/>
      <input placeholder="Password" type="password" value={p} onChange={e=>setP(e.target.value)} className="border p-2 w-full"/>
      <button onClick={()=>onLogin(u,p)} style={{padding:'8px 12px',background:'#111827',color:'#fff',borderRadius:6}}>Login as Admin</button>
    </div>
  );
}

function AdminPanel({ users, onCredit, onRemove }) {
  const [selected, setSelected] = useState(null);
  const [amt, setAmt] = useState(0);

  return (
    <div>
      <h3 style={{fontWeight:600}}>Admin Panel</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:12}}>
        <div>
          <h4 style={{fontWeight:600}}>Users ({users.length})</h4>
          <div style={{marginTop:8,maxHeight:320,overflow:'auto'}}>
            {users.map(u => (
              <div key={u.id} style={{padding:10,border:'1px solid #eee',borderRadius:6,display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <div>
                  <div style={{fontWeight:700}}>{u.name} — {u.type}</div>
                  <div style={{fontSize:13,color:'#666'}}>{u.id} | ₹{u.wallet} | {u.status}</div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>setSelected(u.id)} style={{padding:'6px 8px'}}>Select</button>
                  <button onClick={()=>onRemove(u.id)} style={{padding:'6px 8px',color:'#c00'}}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{fontWeight:600}}>Selected Actions</h4>
          {selected ? (
            <div style={{marginTop:12,display:'grid',gap:8}}>
              <div>Selected UID: <strong>{selected}</strong></div>
              <div>
                <label>Credit amount (₹)</label>
                <input type="number" className="border p-2 w-full" value={amt} onChange={e=>setAmt(e.target.value)} />
                <button onClick={()=>{ onCredit(selected, amt); setAmt(0); }} style={{marginTop:8,padding:'8px 10px',background:'#16a34a',color:'#fff',borderRadius:6}}>Credit Wallet</button>
              </div>
            </div>
          ) : (
            <div style={{fontSize:13,color:'#666',marginTop:12}}>Select a user to credit wallet or remove account.</div>
          )}
        </div>
      </div>
    </div>
  );
}
