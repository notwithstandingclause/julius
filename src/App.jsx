import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// ----------------------------------------------------------------------
// FIREBASE CONFIGURATION
// ----------------------------------------------------------------------
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
const auth = getAuth(app);
const db = getFirestore(app);
  }
} catch (e) {
  console.warn("Firebase not fully configured. Using local state fallback.", e);
}

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
    description: 'Flesh out the theoretical heart of the paper. Expand on structural differences and interpretation.',
    tasks: [
      { id: 't1', text: 'Expand II.A (Ford Assumption): Integrate statutory interpretation pre-Rizzo (court sticking to plain reading vs pragmatic considerations).', completed: false, tag: 'Red Reminder', tagColor: 'red' },
      { id: 't2', text: 'Expand II.B (Intelligible Signal): Contrast s.15 with coextensive rights like s.2(b) Freedom of Expression.', completed: false, tag: 'Red Reminder', tagColor: 'red' },
      { id: 't3', text: 'Elaborate II.C (s.15 Structure): Grapple deeply with the analogous grounds issue.', completed: false, tag: 'Red Reminder', tagColor: 'red' },
      { id: 't4', text: 'Elaborate II.C: Compare Canadian equality structure with equality and discrimination jurisprudence in the U.S.', completed: false, tag: 'Red Reminder', tagColor: 'red' },
    ]
  },
  {
    id: 'phase2',
    title: 'Phase 2: Fortifying Counterarguments',
    dueDate: 'July 7, 2026',
    description: 'Address the professor\'s specific challenges to bulletproof your argument.',
    tasks: [
      { id: 't5', text: 'Address Disguised Substantive Review (Part III.A): Why asking for precision isn\'t asking for substantive justification.', completed: false, tag: "Prof's Note", tagColor: 'blue' },
      { id: 't6', text: 'Address Institutional Uncertainty: Tackle the "Kitchen Sink" drafting approach (what if a legislature just lists every ground to be safe?).', completed: false, tag: "Prof's Note", tagColor: 'blue' },
      { id: 't7', text: 'Address Sufficiency of Broad Signalling: Push back against the idea that the electorate is satisfied with abstract signaling. Explain why they need exact grounds named.', completed: false, tag: "Prof's Note", tagColor: 'blue' },
    ]
  },
  {
    id: 'phase3',
    title: 'Phase 3: Intro, Conclusion & Framing',
    dueDate: 'July 13, 2026',
    description: 'Set the stage and stick the landing. Define the literature gap and summarize your novel intervention now that the body is finalized.',
    tasks: [
      { id: 't8', text: 'Revise Introduction: Explicitly state the literature gap (the current debate focuses heavily on substantive judicial review).', completed: false, tag: "Prof's Note", tagColor: 'blue' },
      { id: 't9', text: 'Revise Introduction: Foreground your conceptual intervention early (specificity as a strict internal requirement of form).', completed: false, tag: "Prof's Note", tagColor: 'blue' },
      { id: 't10', text: 'Draft Formal Conclusion: Summarize the theoretical intervention and its broader institutional implications for rights litigation.', completed: false, tag: "Prof's Note", tagColor: 'blue' },
    ]
  },
  {
    id: 'phase4',
    title: 'Phase 4: Final Polish & Logistics',
    dueDate: 'July 17, 2026',
    description: 'Prepare the manuscript for final submission to Prof. Daniel and eventual journal publication.',
    tasks: [
      { id: 't11', text: 'Final proofread and formatting check.', completed: false },
      { id: 't12', text: 'Review journal guidelines (Osgoode, UTLJ, Review of Constitutional Studies).', completed: false },
      { id: 't13', text: 'Plan submission windows for late Summer/Fall.', completed: false },
    ]
  }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [phases, setPhases] = useState(defaultPhases);
  const [activePhaseId, setActivePhaseId] = useState('phase1');
  
  // UI State for adding new Phase
  const [showAddPhase, setShowAddPhase] = useState(false);
  const [newPhaseTitle, setNewPhaseTitle] = useState('');
  const [newPhaseDate, setNewPhaseDate] = useState('');
  const [newPhaseDesc, setNewPhaseDesc] = useState('');

  // UI State for adding new Task
  const [addingTaskToPhase, setAddingTaskToPhase] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('');

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (e) {
        console.error("Auth failed:", e);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    
    // Save to a secure collection for this user
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
    setPhases(updatedPhases); // Update UI immediately
    if (user && db) {
      try {
        await setDoc(doc(db, 'users', user.uid), { phases: updatedPhases }, { merge: true });
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  };

  const toggleTask = (phaseId, taskId) => {
    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return phase;
    });
    updateData(updatedPhases);
  };

  const handleAddPhase = (e) => {
    e.preventDefault();
    if (!newPhaseTitle.trim()) return;
    
    const newPhase = {
      id: `phase_${Date.now()}`,
      title: newPhaseTitle,
      dueDate: newPhaseDate || 'TBD',
      description: newPhaseDesc || 'Custom phase added to your plan.',
      tasks: []
    };
    
    updateData([...phases, newPhase]);
    setShowAddPhase(false);
    setNewPhaseTitle('');
    setNewPhaseDate('');
    setNewPhaseDesc('');
    setActivePhaseId(newPhase.id); 
  };

  const handleAddTask = (e, phaseId) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    let tagColor = null;
    if (newTaskTag === 'Red Reminder') tagColor = 'red';
    if (newTaskTag === "Prof's Note") tagColor = 'blue';

    const newTask = {
      id: `task_${Date.now()}`,
      text: newTaskText,
      completed: false,
      tag: newTaskTag || null,
      tagColor: tagColor
    };

    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        return { ...phase, tasks: [...phase.tasks, newTask] };
      }
      return phase;
    });

    updateData(updatedPhases);
    setAddingTaskToPhase(null);
    setNewTaskText('');
    setNewTaskTag('');
  };

  const getProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const totalTasks = phases.flatMap(p => p.tasks).length;
  const completedTasks = phases.flatMap(p => p.tasks).filter(t => t.completed).length;
  const overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleSendDraft = (phaseTitle) => {
    const subject = encodeURIComponent(`Draft Update: ${phaseTitle} - State Accountability & Social Change`);
    const body = encodeURIComponent(`Hi Professor Daniel,\n\nI have completed the revisions for ${phaseTitle}. I have attached the latest incremental draft for your review.\n\nBest regards,\nJulius Grippo`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const activePhase = phases.find(p => p.id === activePhaseId) || phases[0];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-[#007AFF] selection:text-white pb-20">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Paper Revision Plan</h1>
            <p className="text-sm text-[#86868B] font-medium mt-0.5">Target Deadline: July 19, 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#86868B]">Overall Progress</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#007AFF] transition-all duration-500 ease-out"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-[#007AFF] w-8 text-right">{overallProgress}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 mt-10 flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-1/3 flex flex-col gap-3">
          {phases.map((phase) => {
            const progress = getProgress(phase.tasks);
            const isActive = activePhaseId === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhaseId(phase.id)}
                className={`text-left p-5 rounded-2xl transition-all duration-300 outline-none ${
                  isActive 
                    ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-transparent scale-100' 
                    : 'bg-transparent border border-gray-200 hover:bg-white/50 scale-95 opacity-70 hover:opacity-100'
                }`}
              >
                <h3 className={`font-semibold tracking-tight text-lg mb-1 ${isActive ? 'text-[#1D1D1F]' : 'text-[#86868B]'}`}>
                  {phase.title}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-[#86868B] font-medium">
                    <CalendarIcon />
                    <span>{phase.dueDate}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${progress === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-[#007AFF]'}`}>
                    {progress}%
                  </span>
                </div>
              </button>
            )
          })}

          {}
          {showAddPhase ? (
            <form onSubmit={handleAddPhase} className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 mt-2">
              <input 
                type="text" 
                placeholder="Phase Title" 
                className="w-full text-sm font-semibold mb-2 p-2 rounded-lg bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                value={newPhaseTitle}
                onChange={(e) => setNewPhaseTitle(e.target.value)}
                autoFocus
              />
              <input 
                type="text" 
                placeholder="Due Date (e.g. July 21)" 
                className="w-full text-sm mb-2 p-2 rounded-lg bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                value={newPhaseDate}
                onChange={(e) => setNewPhaseDate(e.target.value)}
              />
              <textarea 
                placeholder="Brief description..." 
                className="w-full text-sm mb-3 p-2 rounded-lg bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#007AFF]/20 resize-none h-16"
                value={newPhaseDesc}
                onChange={(e) => setNewPhaseDesc(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-[#007AFF] text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors">Save</button>
                <button type="button" onClick={() => setShowAddPhase(false)} className="flex-1 bg-gray-100 text-[#1D1D1F] text-sm font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setShowAddPhase(true)}
              className="flex items-center justify-center gap-2 text-left p-4 rounded-2xl transition-all duration-300 border-2 border-dashed border-gray-200 text-[#86868B] hover:text-[#1D1D1F] hover:border-gray-300 hover:bg-white/50 mt-2 font-medium"
            >
              <PlusIcon /> Add New Phase
            </button>
          )}
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 md:p-10 transition-all duration-500">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">{activePhase.title}</h2>
                <p className="text-[#86868B] text-lg mt-2 leading-relaxed max-w-xl">
                  {activePhase.description}
                </p>
              </div>
              <button 
                onClick={() => handleSendDraft(activePhase.title)}
                className="flex items-center gap-2 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#007AFF] font-semibold py-2.5 px-5 rounded-full transition-colors shrink-0"
              >
                <MailIcon />
                Send Update
              </button>
            </div>

            <div className="space-y-3">
              {activePhase.tasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(activePhase.id, task.id)}
                  className={`group flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    task.completed ? 'bg-gray-50' : 'hover:bg-[#F5F5F7]'
                  }`}
                >
                  <div className="mt-1 shrink-0">
                    <CheckCircle checked={task.completed} />
                  </div>
                  <div className="flex flex-col gap-1.5 items-start">
                    <p className={`text-lg font-medium leading-snug transition-all duration-300 ${
                      task.completed ? 'text-[#86868B] line-through decoration-2 decoration-gray-300' : 'text-[#1D1D1F]'
                    }`}>
                      {task.text}
                    </p>
                    {task.tag && (
                      <span className={`flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-opacity duration-300 ${
                        task.completed ? 'opacity-50' : 'opacity-100'
                      } ${
                        task.tagColor === 'red' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        <TagIcon />
                        {task.tag}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {}
              {addingTaskToPhase === activePhase.id ? (
                <form onSubmit={(e) => handleAddTask(e, activePhase.id)} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 mt-4">
                  <input 
                    type="text" 
                    placeholder="Task description..." 
                    className="w-full text-sm font-medium mb-3 p-2.5 rounded-lg bg-white border border-gray-200 outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    autoFocus
                  />
                  <div className="flex items-center gap-3">
                    <select 
                      className="text-sm p-2 rounded-lg bg-white border border-gray-200 outline-none flex-1 text-[#1D1D1F]"
                      value={newTaskTag}
                      onChange={(e) => setNewTaskTag(e.target.value)}
                    >
                      <option value="">No Tag</option>
                      <option value="Red Reminder">Red Reminder</option>
                      <option value="Prof's Note">Prof's Note (Blue)</option>
                    </select>
                    <button type="submit" className="bg-[#1D1D1F] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">Add</button>
                    <button type="button" onClick={() => setAddingTaskToPhase(null)} className="bg-gray-200 text-[#1D1D1F] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setAddingTaskToPhase(activePhase.id)}
                  className="flex items-center gap-2 text-[#86868B] hover:text-[#1D1D1F] transition-colors p-4 font-medium text-sm w-full rounded-2xl hover:bg-[#F5F5F7]"
                >
                  <PlusIcon /> Add another task...
                </button>
              )}
            </div>
            
            {getProgress(activePhase.tasks) === 100 && (
              <div className="mt-8 p-6 bg-green-50 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between border border-green-100 gap-4">
                <div>
                  <h4 className="text-green-800 font-bold text-lg">Phase Complete!</h4>
                  <p className="text-green-600 font-medium">Great work. Don't forget to send the incremental draft to Professor Daniel.</p>
                </div>
                <button 
                  onClick={() => handleSendDraft(activePhase.title)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition-colors shadow-sm w-full md:w-auto shrink-0"
                >
                  Send Draft
                </button>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}