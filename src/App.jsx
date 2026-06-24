import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD58Byog0HXEJKzFOAScX1jl0WmotVPLo8",
  authDomain: "paper-revision-plan.firebaseapp.com",
  projectId: "paper-revision-plan",
  storageBucket: "paper-revision-plan.firebasestorage.app",
  messagingSenderId: "110145505262",
  appId: "1:110145505262:web:6c715f0774806e904d70ff",
  measurementId: "G-HTYEDTZFEP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const CheckCircle = ({ checked }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={checked ? "#007AFF" : "none"} stroke={checked ? "#007AFF" : "#C7C7CC"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    {checked && <polyline points="22 4 12 14.01 9 11.01" stroke="white"></polyline>}
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const TagIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const defaultPhases = [
  {
    id: 'phase1',
    title: 'Phase 1: Conceptual Deepening',
    dueDate: 'June 30, 2026',
    description: 'Flesh out the theoretical heart of the paper.',
    tasks: [
      { id: 't1', text: 'Expand II.A (Ford Assumption)', completed: false, tag: 'Red Reminder', tagColor: 'red' },
      { id: 't2', text: 'Expand II.B (Intelligible Signal)', completed: false, tag: 'Red Reminder', tagColor: 'red' }
    ]
  }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [phases, setPhases] = useState(defaultPhases);
  const [activePhaseId, setActivePhaseId] = useState('phase1');
  const [showAddPhase, setShowAddPhase] = useState(false);
  const [addingTaskToPhase, setAddingTaskToPhase] = useState(null);

  useEffect(() => {
    signInAnonymously(auth).catch(console.error);
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setPhases(docSnap.data().phases);
      } else {
        setDoc(docRef, { phases: defaultPhases });
      }
    });
    return () => unsubscribe();
  }, [user]);

  const updateData = async (updatedPhases) => {
    setPhases(updatedPhases);
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { phases: updatedPhases }, { merge: true });
    }
  };

  const activePhase = phases.find(p => p.id === activePhaseId) || phases[0];

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-8">
      <h1 className="text-2xl font-bold mb-6">Paper Revision Plan</h1>
      <div className="flex gap-8">
        <div className="w-1/3 flex flex-col gap-4">
          {phases.map(phase => (
            <button key={phase.id} onClick={() => setActivePhaseId(phase.id)} className="p-4 bg-white rounded-xl shadow-sm text-left">
              {phase.title}
            </button>
          ))}
        </div>
        <div className="w-2/3 bg-white p-8 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">{activePhase.title}</h2>
          {activePhase.tasks.map(task => (
            <div key={task.id} onClick={() => {
              const newPhases = phases.map(p => p.id === activePhase.id ? {...p, tasks: p.tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t)} : p);
              updateData(newPhases);
            }} className="flex items-center gap-3 p-3 border-b cursor-pointer">
              <CheckCircle checked={task.completed} />
              <span className={task.completed ? "line-through text-gray-400" : ""}>{task.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}