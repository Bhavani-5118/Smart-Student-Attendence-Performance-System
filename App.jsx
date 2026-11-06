import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowUpRight, Award, BarChart3, BookOpen,
  Building2, Calendar, CalendarDays, Check, CheckCheck, CheckCircle2,
  ChevronDown, ChevronRight, Clock, Clock3, Download, Eye, EyeOff,
  FileSpreadsheet, GraduationCap, Hash, KeyRound, Laptop, Layers,
  LayoutDashboard, LoaderCircle, Lock, LogIn, LogOut, Mail, Menu,
  Plus, Printer, QrCode, Radio, RefreshCw, ScanLine, Search,
  Shield, ShieldCheck, SlidersHorizontal, Sparkles, Trash2, TrendingUp,
  User, UserCheck, Users, UserX, Volume2, VolumeX, X, XCircle
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const currentYear = new Date().getFullYear();
const academicYear = `${currentYear - 1} — ${currentYear}`;
const today = new Date().toISOString().slice(0, 10);

// Default realistic Vignan University CSE batch roster
const DEFAULT_VIGNAN_STUDENTS = [
  { _id: 'vu-01', fullName: 'Rahul Sharma', rollNumber: '211FA04001', course: 'B.Tech Computer Science & Engg', section: 'A', email: '211fa04001@vignan.ac.in' },
  { _id: 'vu-02', fullName: 'Priya Varma', rollNumber: '211FA04002', course: 'B.Tech Computer Science & Engg', section: 'A', email: '211fa04002@vignan.ac.in' },
  { _id: 'vu-03', fullName: 'Ananya Reddy', rollNumber: '211FA04003', course: 'B.Tech Computer Science & Engg', section: 'A', email: '211fa04003@vignan.ac.in' },
  { _id: 'vu-04', fullName: 'Sai Krishna K.', rollNumber: '211FA04004', course: 'B.Tech Computer Science & Engg', section: 'A', email: '211fa04004@vignan.ac.in' },
  { _id: 'vu-05', fullName: 'Harshita Rao', rollNumber: '211FA04005', course: 'B.Tech Computer Science & Engg', section: 'A', email: '211fa04005@vignan.ac.in' },
  { _id: 'vu-06', fullName: 'Manikanth G.', rollNumber: '211FA04006', course: 'B.Tech Computer Science & Engg', section: 'A', email: '211fa04006@vignan.ac.in' },
  { _id: 'vu-07', fullName: 'Sneha Latha M.', rollNumber: '211FA04007', course: 'B.Tech Computer Science & Engg', section: 'B', email: '211fa04007@vignan.ac.in' },
  { _id: 'vu-08', fullName: 'P. Tejaswi', rollNumber: '211FA04008', course: 'B.Tech Computer Science & Engg', section: 'B', email: '211fa04008@vignan.ac.in' },
  { _id: 'vu-09', fullName: 'Venkat Ramana B.', rollNumber: '211FA04009', course: 'B.Tech Computer Science & Engg', section: 'B', email: '211fa04009@vignan.ac.in' },
  { _id: 'vu-10', fullName: 'M. Divya Sri', rollNumber: '211FA04010', course: 'B.Tech Computer Science & Engg', section: 'A', email: '211fa04010@vignan.ac.in' },
  { _id: 'vu-11', fullName: 'Karthik Varma', rollNumber: '211FA04011', course: 'B.Tech Computer Science & Engg', section: 'A', email: '211fa04011@vignan.ac.in' },
  { _id: 'vu-12', fullName: 'Bhavani Shankar', rollNumber: '211FA04012', course: 'B.Tech Computer Science & Engg', section: 'A', email: '211fa04012@vignan.ac.in' },
  { _id: 'vu-13', fullName: 'Akhil Chowdary', rollNumber: '211FA04013', course: 'B.Tech Computer Science & Engg', section: 'B', email: '211fa04013@vignan.ac.in' },
  { _id: 'vu-14', fullName: 'Swathi Priya K.', rollNumber: '211FA04014', course: 'B.Tech Computer Science & Engg', section: 'B', email: '211fa04014@vignan.ac.in' },
  { _id: 'vu-15', fullName: 'Nithin Kumar D.', rollNumber: '211FA04015', course: 'B.Tech Computer Science & Engg', section: 'B', email: '211fa04015@vignan.ac.in' },
];

const DEFAULT_SCORES = [
  { _id: 'sc-1', student: { _id: 'vu-01', fullName: 'Rahul Sharma', rollNumber: '211FA04001' }, subject: 'Design & Analysis of Algorithms', assessmentName: 'Mid-Term Exam I', score: 92, maxScore: 100, assessmentDate: today, remarks: 'Excellent performance' },
  { _id: 'sc-2', student: { _id: 'vu-02', fullName: 'Priya Varma', rollNumber: '211FA04002' }, subject: 'Database Management Systems', assessmentName: 'Lab Practical Internal', score: 88, maxScore: 100, assessmentDate: today, remarks: 'Very thorough queries' },
  { _id: 'sc-3', student: { _id: 'vu-03', fullName: 'Ananya Reddy', rollNumber: '211FA04003' }, subject: 'Operating Systems', assessmentName: 'Mid-Term Exam I', score: 95, maxScore: 100, assessmentDate: today, remarks: 'Top score in cohort' },
  { _id: 'sc-4', student: { _id: 'vu-04', fullName: 'Sai Krishna K.', rollNumber: '211FA04004' }, subject: 'Computer Networks', assessmentName: 'Unit Test 2', score: 68, maxScore: 100, assessmentDate: today, remarks: 'Needs revision on subnetting' },
  { _id: 'sc-5', student: { _id: 'vu-05', fullName: 'Harshita Rao', rollNumber: '211FA04005' }, subject: 'Web Technologies Lab', assessmentName: 'Full Stack Milestone', score: 94, maxScore: 100, assessmentDate: today, remarks: 'Outstanding React App' },
  { _id: 'sc-6', student: { _id: 'vu-06', fullName: 'Manikanth G.', rollNumber: '211FA04006' }, subject: 'Design & Analysis of Algorithms', assessmentName: 'Mid-Term Exam I', score: 74, maxScore: 100, assessmentDate: today, remarks: 'Good grasp on DP' },
];

const VIGNAN_COURSES = [
  { code: 'CS301', name: 'Design & Analysis of Algorithms' },
  { code: 'CS302', name: 'Database Management Systems' },
  { code: 'CS303', name: 'Operating Systems & System Calls' },
  { code: 'CS304', name: 'Computer Networks & Protocols' },
  { code: 'CS305', name: 'Full-Stack Web Development Lab' },
];

const PERIOD_SLOTS = [
  { id: '1', label: 'Period 1 (08:30 — 09:20 AM)' },
  { id: '2', label: 'Period 2 (09:20 — 10:10 AM)' },
  { id: '3', label: 'Period 3 (10:25 — 11:15 AM)' },
  { id: '4', label: 'Period 4 (11:15 — 12:05 PM)' },
  { id: '5', label: 'Period 5 (01:15 — 02:05 PM)' },
  { id: '6', label: 'Lab Block (02:05 — 03:45 PM)' },
];

const blankStudent = { fullName: '', rollNumber: '', email: '', course: 'B.Tech Computer Science & Engg', section: 'A' };
const blankScore = { studentId: '', subject: 'Design & Analysis of Algorithms', assessmentName: 'Mid-Term Exam I', score: '', maxScore: '100', assessmentDate: today, remarks: '' };

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'attendance', label: 'Smart Attendance', icon: ScanLine, highlight: true },
  { id: 'students', label: 'Student Directory', icon: Users },
  { id: 'performance', label: 'Assessments & Marks', icon: BarChart3 },
  { id: 'timetable', label: 'Class Timetable', icon: CalendarDays },
];

// Web Audio API beep synthesizer for scanner kiosk
function playScanChime(success = true) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = success ? 'sine' : 'sawtooth';
    osc.frequency.setValueAtTime(success ? 880 : 320, ctx.currentTime);
    if (success) {
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
    }
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch {
    // Audio context may require user gesture
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new Error('API server unreachable. Operating in local interactive mode.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed. Please try again.');
  return data;
}

function dateLabel(value, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  return value ? new Intl.DateTimeFormat('en-IN', opts).format(new Date(value)) : '—';
}
function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}
function percent(score, max) {
  return max ? Math.round((Number(score) / Number(max)) * 100) : 0;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vfstr_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [active, setActive] = useState('dashboard');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [students, setStudents] = useState(DEFAULT_VIGNAN_STUDENTS);
  const [scores, setScores] = useState(DEFAULT_SCORES);
  const [dashboard, setDashboard] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState('1');
  const [selectedCourse, setSelectedCourse] = useState('CS301');
  const [marks, setMarks] = useState({
    'vu-01': 'Present', 'vu-02': 'Present', 'vu-03': 'Present',
    'vu-04': 'Present', 'vu-05': 'Present', 'vu-06': 'Late',
    'vu-07': 'Present', 'vu-08': 'Absent', 'vu-09': 'Present',
    'vu-10': 'Present', 'vu-11': 'Present', 'vu-12': 'Excused',
    'vu-13': 'Present', 'vu-14': 'Present', 'vu-15': 'Absent'
  });
  const [notes, setNotes] = useState({
    'vu-06': 'Late bus arrival from Guntur',
    'vu-08': 'Medical leave',
    'vu-12': 'On Duty: University Hackathon'
  });

  // Smart Attendance Sub-Modes: 'register' | 'scanner' | 'defaulters' | 'reports'
  const [smartMode, setSmartMode] = useState('register');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [studentSearch, setStudentSearch] = useState('');
  const [scoreSearch, setScoreSearch] = useState('');

  // Scanner Kiosk State
  const [scanInput, setScanInput] = useState('');
  const [lastScanned, setLastScanned] = useState(null);
  const [scanFeed, setScanFeed] = useState([
    { id: 1, name: 'Rahul Sharma', roll: '211FA04001', time: '08:32 AM', status: 'Present' },
    { id: 2, name: 'Priya Varma', roll: '211FA04002', time: '08:34 AM', status: 'Present' },
    { id: 3, name: 'Ananya Reddy', roll: '211FA04003', time: '08:35 AM', status: 'Present' },
  ]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals & UI States
  const [modal, setModal] = useState('');
  const [editing, setEditing] = useState(null);
  const [studentForm, setStudentForm] = useState(blankStudent);
  const [scoreForm, setScoreForm] = useState(blankScore);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);

  // Live University Clock
  const [timeString, setTimeString] = useState('');
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateString(now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch core records from backend API
  const loadCore = useCallback(async () => {
    try {
      const health = await request('/health');
      if (health.status === 'ok') setApiOnline(true);
      const [studentData, dashboardData, scoreData] = await Promise.all([
        request('/students'),
        request('/dashboard'),
        request('/performance'),
      ]);
      if (studentData?.students?.length > 0) {
        setStudents(studentData.students);
      }
      if (dashboardData) setDashboard(dashboardData);
      if (scoreData?.records?.length > 0) {
        setScores(scoreData.records);
      }
    } catch {
      setApiOnline(false);
    }
  }, []);

  const loadAttendance = useCallback(async () => {
    if (!apiOnline) return;
    try {
      const data = await request(`/attendance?date=${attendanceDate}`);
      setAttendance(data.records || []);
      if (data.records && data.records.length > 0) {
        const next = { ...marks };
        const nextNotes = { ...notes };
        data.records.forEach((record) => {
          if (record.student?._id) {
            next[record.student._id] = record.status;
            if (record.notes) nextNotes[record.student._id] = record.notes;
          }
        });
        setMarks(next);
        setNotes(nextNotes);
      }
    } catch (err) {
      console.warn('Attendance load warning:', err.message);
    }
  }, [attendanceDate, apiOnline]);

  useEffect(() => {
    if (currentUser) {
      loadCore();
    }
  }, [currentUser, loadCore]);

  useEffect(() => {
    if (currentUser && !loading) {
      loadAttendance();
    }
  }, [currentUser, attendanceDate, loading, loadAttendance]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  // Auth Handler: Login
  function handleLogin(userData) {
    setCurrentUser(userData);
    try {
      localStorage.setItem('vfstr_user', JSON.stringify(userData));
    } catch {}
    setToast(`Welcome, ${userData.name || userData.email}!`);
  }

  // Auth Handler: Logout
  function handleLogout() {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vfstr_user');
    } catch {}
    setToast('Logged out of Vignan University Portal.');
  }

  // Attendance metrics calculation
  const totalCount = students.length;
  const presentCount = Object.values(marks).filter((s) => s === 'Present').length;
  const absentCount = Object.values(marks).filter((s) => s === 'Absent').length;
  const lateCount = Object.values(marks).filter((s) => s === 'Late').length;
  const excusedCount = Object.values(marks).filter((s) => s === 'Excused').length;
  const markedTotal = presentCount + absentCount + lateCount + excusedCount;
  const unmarkedCount = Math.max(totalCount - markedTotal, 0);
  const attendanceRate = markedTotal > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalCount) * 100) : 0;

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = studentSearch.toLowerCase().trim();
      const matchesSearch = !query ||
        student.fullName.toLowerCase().includes(query) ||
        student.rollNumber.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query);
      const matchesSection = sectionFilter === 'All' || student.section === sectionFilter;
      const studentMark = marks[student._id] || 'Unmarked';
      const matchesStatus = statusFilter === 'All' ||
        (statusFilter === 'Unmarked' ? !marks[student._id] : studentMark === statusFilter);
      return matchesSearch && matchesSection && matchesStatus;
    });
  }, [students, studentSearch, sectionFilter, statusFilter, marks]);

  // Defaulters (< 75% attendance)
  const defaulterList = useMemo(() => {
    return students.map((s) => {
      const rollEnd = parseInt(s.rollNumber.slice(-2), 10) || 5;
      const rate = rollEnd === 8 ? 62 : rollEnd === 15 ? 58 : rollEnd === 4 ? 71 : Math.min(76 + (rollEnd * 2) % 24, 98);
      const neededClasses = rate < 75 ? Math.ceil((75 * 40 - rate * 40) / 25) : 0;
      return { ...s, cumulativeRate: rate, neededClasses };
    }).filter((s) => s.cumulativeRate < 75);
  }, [students]);

  // Bulk actions for attendance
  function setAllStatus(status) {
    const next = {};
    students.forEach((s) => { next[s._id] = status; });
    setMarks(next);
    if (soundEnabled) playScanChime(true);
    setToast(`Marked all ${students.length} students as ${status}`);
  }

  function invertAttendance() {
    const next = { ...marks };
    students.forEach((s) => {
      const current = marks[s._id];
      if (current === 'Present') next[s._id] = 'Absent';
      else if (current === 'Absent') next[s._id] = 'Present';
      else if (!current) next[s._id] = 'Present';
    });
    setMarks(next);
    setToast('Inverted attendance statuses');
  }

  function clearMarks() {
    setMarks({});
    setToast('Cleared all attendance marks for this session');
  }

  function toggleStudentStatus(studentId, status) {
    setMarks((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? '' : status,
    }));
    if (soundEnabled) playScanChime(true);
  }

  // Handle Smart Scanner / RFID check-in
  function handleScannerSubmit(e) {
    e.preventDefault();
    if (!scanInput.trim()) return;
    const query = scanInput.trim().toUpperCase();

    const match = students.find((s) =>
      s.rollNumber.toUpperCase() === query ||
      s.rollNumber.toUpperCase().endsWith(query) ||
      s.fullName.toUpperCase().includes(query)
    );

    if (match) {
      setMarks((prev) => ({ ...prev, [match._id]: 'Present' }));
      const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      const record = { id: Date.now(), name: match.fullName, roll: match.rollNumber, time: timeNow, status: 'Present' };
      setLastScanned(record);
      setScanFeed((prev) => [record, ...prev.slice(0, 14)]);
      if (soundEnabled) playScanChime(true);
      setToast(`Verified: ${match.fullName} (${match.rollNumber}) marked Present!`);
      setScanInput('');
    } else {
      if (soundEnabled) playScanChime(false);
      setError(`Roll Number / ID "${scanInput}" not found in this department roster.`);
    }
  }

  // Save attendance to backend or local store
  async function handleSaveAttendance(e) {
    if (e) e.preventDefault();
    const entries = Object.entries(marks)
      .filter(([, status]) => status)
      .map(([studentId, status]) => ({
        studentId,
        status,
        notes: notes[studentId] || '',
      }));

    if (!entries.length) {
      setError('Mark at least one student before saving attendance.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (apiOnline) {
        const result = await request('/attendance/bulk', {
          method: 'POST',
          body: JSON.stringify({ date: attendanceDate, entries }),
        });
        setAttendance(result.records || []);
      }
      setToast(`Saved attendance for ${entries.length} students to University Portal`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Export Attendance Register to CSV
  function exportAttendanceCSV() {
    const headers = ['Roll Number', 'Full Name', 'Course', 'Section', 'Date', 'Status', 'Remarks'];
    const rows = students.map((s) => [
      `"${s.rollNumber}"`,
      `"${s.fullName}"`,
      `"${s.course}"`,
      `"${s.section}"`,
      `"${attendanceDate}"`,
      `"${marks[s._id] || 'Not Marked'}"`,
      `"${notes[s._id] || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vignan_Attendance_${selectedCourse}_${attendanceDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast('Downloaded official attendance CSV');
  }

  // Seed realistic Vignan roster into MongoDB if empty
  async function seedVignanRoster() {
    setLoading(true);
    try {
      for (const st of DEFAULT_VIGNAN_STUDENTS) {
        try {
          await request('/students', { method: 'POST', body: JSON.stringify(st) });
        } catch {}
      }
      await loadCore();
      setToast('Populated Vignan University Class Roster');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Student CRUD operations
  function openStudentModal(student = null) {
    setEditing(student?._id || null);
    setStudentForm(
      student
        ? { fullName: student.fullName, rollNumber: student.rollNumber, email: student.email || '', course: student.course, section: student.section || 'A' }
        : { ...blankStudent, rollNumber: `211FA040${(students.length + 1).toString().padStart(2, '0')}` }
    );
    setModal('student');
  }

  async function handleSaveStudent(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (apiOnline) {
        await request(editing ? `/students/${editing}` : '/students', {
          method: editing ? 'PUT' : 'POST',
          body: JSON.stringify(studentForm),
        });
        await loadCore();
      } else {
        if (editing) {
          setStudents((prev) => prev.map((s) => (s._id === editing ? { ...s, ...studentForm } : s)));
        } else {
          setStudents((prev) => [...prev, { _id: `vu-${Date.now()}`, ...studentForm }]);
        }
      }
      setModal('');
      setToast(editing ? 'Updated student details' : 'Added student to Vignan roster');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteStudent(student) {
    if (!window.confirm(`Remove ${student.fullName} (${student.rollNumber}) from Vignan University roster?`)) return;
    try {
      if (apiOnline) {
        await request(`/students/${student._id}`, { method: 'DELETE' });
        await loadCore();
      } else {
        setStudents((prev) => prev.filter((s) => s._id !== student._id));
      }
      setToast('Student removed from roster');
    } catch (err) {
      setError(err.message);
    }
  }

  // Assessment score CRUD
  function openScoreModal(record = null) {
    setEditing(record?._id || null);
    setScoreForm(
      record
        ? { studentId: record.student?._id || '', subject: record.subject, assessmentName: record.assessmentName, score: String(record.score), maxScore: String(record.maxScore), assessmentDate: record.assessmentDate.slice(0, 10), remarks: record.remarks || '' }
        : { ...blankScore, studentId: students[0]?._id || '' }
    );
    setModal('score');
  }

  async function handleSaveScore(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...scoreForm, score: Number(scoreForm.score), maxScore: Number(scoreForm.maxScore) };
    try {
      if (apiOnline) {
        await request(editing ? `/performance/${editing}` : '/performance', {
          method: editing ? 'PUT' : 'POST',
          body: JSON.stringify(payload),
        });
        await loadCore();
      } else {
        const student = students.find((s) => s._id === scoreForm.studentId) || students[0];
        if (editing) {
          setScores((prev) => prev.map((s) => (s._id === editing ? { ...s, ...payload, student } : s)));
        } else {
          setScores((prev) => [{ _id: `sc-${Date.now()}`, ...payload, student }, ...prev]);
        }
      }
      setModal('');
      setToast(editing ? 'Assessment marks updated' : 'Recorded assessment score');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ===========================================================================
  // IF USER IS NOT LOGGED IN: RENDER AUTHENTICATION PORTAL (LOGIN & SIGN UP)
  // ===========================================================================
  if (!currentUser) {
    return (
      <AuthView
        onLogin={handleLogin}
        toast={toast}
        setToast={setToast}
        academicYear={academicYear}
        timeString={timeString}
        dateString={dateString}
      />
    );
  }

  // ===========================================================================
  // LOGGED-IN PORTAL VIEW
  // ===========================================================================
  return (
    <div className="vu-app-container">
      {/* =====================================================================
          TOP VIGNAN UNIVERSITY INSTITUTIONAL HEADER BAR (HIGHLIGHTED AT TOP)
          ===================================================================== */}
      <header className="vu-top-masthead">
        <div className="vu-masthead-inner">
          <div className="vu-brand-lockup">
            <button
              className="vu-hamburger-btn"
              onClick={() => setMobileNav(!mobileNav)}
              aria-label="Toggle navigation drawer"
            >
              <Menu size={20} />
            </button>

            {/* Vignan University Crest Emblem */}
            <div className="vu-crest" title="Vignan University (VFSTR)">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="46" stroke="#0f2b5c" strokeWidth="6" fill="#ffffff" />
                <path d="M50 14 L55 24 L66 22 L67 33 L78 35 L75 46 L84 50 L75 54 L78 65 L67 67 L66 78 L55 76 L50 86 L45 76 L34 78 L33 67 L22 65 L25 54 L16 50 L25 46 L22 35 L33 33 L34 22 L45 24 Z" fill="#f59e0b" opacity="0.25" />
                <path d="M50 20 C42 32 38 42 43 54 C45 48 50 44 52 41 C54 48 58 52 56 60 C64 54 62 36 50 20 Z" fill="#d97706" />
                <path d="M50 26 C45 34 43 40 46 48 C48 44 51 41 53 38 C54 43 56 46 55 52 C60 48 59 36 50 26 Z" fill="#fbbf24" />
                <path d="M30 64 C38 60 46 62 50 66 C54 62 62 60 70 64 L70 76 C62 72 54 74 50 78 C46 74 38 72 30 76 Z" fill="#0f2b5c" />
                <path d="M32 66 C39 62 46 64 50 68 C54 64 61 62 68 66" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* University Title & Accreditation Badges */}
            <div className="vu-title-block">
              <span className="vu-title-subhead">
                <Sparkles size={11} /> VIGNAN'S FOUNDATION FOR SCIENCE, TECHNOLOGY & RESEARCH
              </span>
              <h1 className="vu-main-title">
                VIGNAN UNIVERSITY <span>PORTAL</span>
              </h1>
              <div className="vu-accreditation-line">
                <span className="vu-badge-pill naac">
                  <Award size={10} /> NAAC A+ ACCREDITED
                </span>
                <span className="vu-badge-pill">
                  <ShieldCheck size={10} /> DEEMED TO BE UNIVERSITY (UGC ACT 1956)
                </span>
                <span className="vu-badge-pill">NIRF TOP 100</span>
                <span className="vu-badge-pill campus">
                  <Building2 size={10} /> VADLAMUDI, GUNTUR
                </span>
              </div>
            </div>
          </div>

          {/* Masthead Right Utilities */}
          <div className="vu-masthead-controls">
            {/* Live Campus Clock */}
            <div className="vu-clock-card" title="Live University Ticker">
              <Clock size={16} />
              <div>
                <div className="vu-clock-time">{timeString || '09:00:00 AM'}</div>
                <div className="vu-clock-date">{dateString || dateLabel(today)}</div>
              </div>
            </div>

            {/* Department Selector */}
            <div className="vu-dept-select-wrap">
              <Laptop size={14} />
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setToast(`Switched view to ${e.target.value}`);
                }}
              >
                <option value="Computer Science & Engineering">Dept. of CSE</option>
                <option value="Information Technology">Dept. of IT</option>
                <option value="Artificial Intelligence & DS">Dept. of AI & DS</option>
                <option value="Electronics & Communication">Dept. of ECE</option>
              </select>
            </div>

            {/* Logged in User Badge & Sign Out Button */}
            <div className="vu-user-badge-menu" title={`Signed in as ${currentUser.name}`}>
              <div className="vu-user-badge-avatar">
                {initials(currentUser.name || 'KB')}
              </div>
              <span className="vu-user-badge-name">{currentUser.name || 'Dr. Bhavani'}</span>
            </div>

            <button
              className="vu-signout-btn"
              onClick={handleLogout}
              title="Sign Out of VFSTR Portal"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN PORTAL LAYOUT WITH SIDEBAR & WORKSPACE
          ===================================================================== */}
      <div className="vu-portal-layout">
        {/* Sidebar Backdrop for Mobile */}
        <div
          className={`vu-mobile-scrim ${mobileNav ? 'open' : ''}`}
          onClick={() => setMobileNav(false)}
        />

        {/* Sidebar */}
        <aside className={`vu-sidebar ${mobileNav ? 'open' : ''}`}>
          <div className="vu-sidebar-header">
            <div className="vu-portal-name">
              <GraduationCap size={18} color="#2563eb" />
              <span>Smart Campus Suite</span>
              <span className="vu-portal-badge">v2.4</span>
            </div>

            {/* Faculty Active Card */}
            <div className="vu-faculty-chip">
              <div className="vu-faculty-avatar">{initials(currentUser.name || 'KB')}</div>
              <div className="vu-faculty-meta">
                <b>{currentUser.name || 'Dr. K. Bhavani'}</b>
                <span>{currentUser.role || 'Faculty'} · {currentUser.idCode || 'FAC-2041'}</span>
              </div>
            </div>
          </div>

          <div className="vu-nav-group-label">FACULTY WORKSPACE</div>
          <ul className="vu-nav-list">
            {nav.map(({ id, label, icon: Icon }) => (
              <li key={id} className={`vu-nav-item ${active === id ? 'active' : ''}`}>
                <button
                  onClick={() => {
                    setActive(id);
                    setMobileNav(false);
                  }}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                  {id === 'students' && <span className="vu-nav-badge">{students.length}</span>}
                  {id === 'attendance' && <span className="vu-nav-badge alert">Live</span>}
                </button>
              </li>
            ))}
          </ul>

          <div className="vu-nav-group-label">ACADEMIC TOOLS</div>
          <ul className="vu-nav-list">
            <li className="vu-nav-item">
              <button onClick={() => { setActive('attendance'); setSmartMode('scanner'); setMobileNav(false); }}>
                <QrCode size={17} />
                <span>RFID / QR Scanner</span>
              </button>
            </li>
            <li className="vu-nav-item">
              <button onClick={() => { setActive('attendance'); setSmartMode('defaulters'); setMobileNav(false); }}>
                <AlertTriangle size={17} />
                <span>Defaulters List (&lt;75%)</span>
                {defaulterList.length > 0 && <span className="vu-nav-badge alert">{defaulterList.length}</span>}
              </button>
            </li>
            <li className="vu-nav-item">
              <button onClick={() => { setActive('attendance'); setSmartMode('reports'); setMobileNav(false); }}>
                <Printer size={17} />
                <span>Print Register Sheet</span>
              </button>
            </li>
          </ul>

          <div className="vu-sidebar-footer">
            <div className="vu-system-card">
              <div className="vu-sync-status">
                <span className="vu-pulse-dot" />
                <span>{apiOnline ? 'Atlas Database Live' : 'Interactive Campus Mode'}</span>
              </div>
              <p>Section A · 64 Enrolled · Vignan University VFSTR Campus Vadlamudi</p>
            </div>

            <button
              className="btn-secondary"
              onClick={handleLogout}
              style={{ marginTop: 10, width: '100%', justifyContent: 'center', color: '#dc2626' }}
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* ===================================================================
            PAGE WORKSPACE
            =================================================================== */}
        <main className="vu-main-area">
          {/* Workspace Top Action Bar */}
          <div className="vu-workspace-bar">
            <div className="vu-breadcrumbs">
              <span>VFSTR Portal</span>
              <b>/</b>
              <span>{department}</span>
              <b>/</b>
              <strong>{nav.find((n) => n.id === active)?.label || 'Workspace'}</strong>
            </div>

            <div className="vu-top-quick-actions">
              <button
                className="btn-secondary"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute scanner sound' : 'Enable scanner sound'}
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                <span>{soundEnabled ? 'Audio On' : 'Muted'}</span>
              </button>

              <button
                className="btn-secondary"
                onClick={loadCore}
                disabled={loading}
                title="Refresh from database"
              >
                <RefreshCw size={14} className={loading ? 'vu-spin' : ''} />
                <span>Refresh</span>
              </button>

              <button
                className="btn-primary"
                onClick={() => openStudentModal()}
              >
                <Plus size={15} />
                <span>Enroll Student</span>
              </button>

              <button
                className="btn-primary btn-gold"
                onClick={() => { setActive('attendance'); setSmartMode('register'); }}
              >
                <ScanLine size={15} />
                <span>Take Attendance</span>
              </button>
            </div>
          </div>

          {/* Hero Greeting Banner */}
          <div className="vu-hero-banner">
            <div className="vu-hero-text">
              <div className="vu-title-subhead">VIGNAN UNIVERSITY SMART ATTENDANCE CONSOLE</div>
              <h1>
                Good morning, {currentUser.name} <span>✳</span>
              </h1>
              <p>
                Manage class roster, record smart daily attendance, track academic performance, and monitor UGC compliance.
              </p>
            </div>
            <div className="vu-hero-tags">
              <div className="vu-kpi-chip">
                <span>Roster Strength</span>
                <b>{students.length} Students</b>
              </div>
              <div className="vu-kpi-chip">
                <span>Class Attendance</span>
                <b style={{ color: attendanceRate >= 75 ? '#059669' : '#dc2626' }}>{attendanceRate}%</b>
              </div>
              <div className="vu-kpi-chip">
                <span>Current Slot</span>
                <b>Period {selectedSlot}</b>
              </div>
            </div>
          </div>

          {/* Alert Message Banner */}
          {error && (
            <div className="vu-alert-banner" role="alert">
              <AlertTriangle size={18} />
              <span>{error}</span>
              <button onClick={() => setError('')} aria-label="Dismiss alert">
                <X size={16} />
              </button>
            </div>
          )}

          {/* TAB 1: DASHBOARD VIEW */}
          {active === 'dashboard' && (
            <DashboardView
              students={students}
              scores={scores}
              marks={marks}
              attendanceRate={attendanceRate}
              presentCount={presentCount}
              absentCount={absentCount}
              lateCount={lateCount}
              excusedCount={excusedCount}
              defaultersCount={defaulterList.length}
              onGoAttendance={() => { setActive('attendance'); setSmartMode('register'); }}
              onGoScanner={() => { setActive('attendance'); setSmartMode('scanner'); }}
              onGoDefaulters={() => { setActive('attendance'); setSmartMode('defaulters'); }}
              onAddScore={() => openScoreModal()}
              onAddStudent={() => openStudentModal()}
            />
          )}

          {/* TAB 2: SMART ATTENDANCE SYSTEM */}
          {active === 'attendance' && (
            <SmartAttendanceView
              students={filteredStudents}
              allStudents={students}
              marks={marks}
              notes={notes}
              setMarks={setMarks}
              setNotes={setNotes}
              attendanceDate={attendanceDate}
              setAttendanceDate={setAttendanceDate}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              sectionFilter={sectionFilter}
              setSectionFilter={setSectionFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              search={studentSearch}
              setSearch={setStudentSearch}
              smartMode={smartMode}
              setSmartMode={setSmartMode}
              presentCount={presentCount}
              absentCount={absentCount}
              lateCount={lateCount}
              excusedCount={excusedCount}
              unmarkedCount={unmarkedCount}
              attendanceRate={attendanceRate}
              defaulters={defaulterList}
              onSetAll={setAllStatus}
              onInvert={invertAttendance}
              onClear={clearMarks}
              onToggleStatus={toggleStudentStatus}
              onSave={handleSaveAttendance}
              saving={saving}
              onExportCSV={exportAttendanceCSV}
              scanInput={scanInput}
              setScanInput={setScanInput}
              onScanSubmit={handleScannerSubmit}
              lastScanned={lastScanned}
              scanFeed={scanFeed}
              onSeedRoster={seedVignanRoster}
            />
          )}

          {/* TAB 3: STUDENT DIRECTORY VIEW */}
          {active === 'students' && (
            <StudentsDirectoryView
              students={filteredStudents}
              totalCount={students.length}
              search={studentSearch}
              setSearch={setStudentSearch}
              sectionFilter={sectionFilter}
              setSectionFilter={setSectionFilter}
              onAdd={() => openStudentModal()}
              onEdit={(st) => openStudentModal(st)}
              onDelete={handleDeleteStudent}
              onSeedRoster={seedVignanRoster}
            />
          )}

          {/* TAB 4: PERFORMANCE & MARKS VIEW */}
          {active === 'performance' && (
            <PerformanceView
              scores={scores}
              students={students}
              search={scoreSearch}
              setSearch={setScoreSearch}
              onAdd={() => openScoreModal()}
              onEdit={(sc) => openScoreModal(sc)}
              onDelete={async (record) => {
                if (!window.confirm(`Delete assessment result for ${record.student?.fullName}?`)) return;
                try {
                  if (apiOnline) {
                    await request(`/performance/${record._id}`, { method: 'DELETE' });
                    await loadCore();
                  } else {
                    setScores((prev) => prev.filter((s) => s._id !== record._id));
                  }
                  setToast('Assessment result deleted');
                } catch (err) { setError(err.message); }
              }}
            />
          )}

          {/* TAB 5: CLASS TIMETABLE VIEW */}
          {active === 'timetable' && (
            <TimetableView
              department={department}
              onLaunchAttendance={(slotId, courseCode) => {
                setSelectedSlot(slotId);
                setSelectedCourse(courseCode);
                setActive('attendance');
                setSmartMode('register');
                setToast(`Initialized attendance register for ${courseCode} (Period ${slotId})`);
              }}
            />
          )}
        </main>
      </div>

      {/* =====================================================================
          MODAL DIALOGS
          ===================================================================== */}
      {modal && (
        <div
          className="vu-modal-backdrop"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(''); }}
        >
          <div className="vu-modal-box">
            <div className="vu-modal-head">
              <div>
                <span className="vu-panel-kicker">VIGNAN UNIVERSITY ACADEMIC REGISTRY</span>
                <h3>{modal === 'student' ? (editing ? 'Edit Student Details' : 'Enroll New Student') : (editing ? 'Edit Assessment Score' : 'Record Student Assessment')}</h3>
              </div>
              <button className="vu-modal-close-btn" onClick={() => setModal('')} aria-label="Close dialog">
                <X size={18} />
              </button>
            </div>

            {modal === 'student' ? (
              <form onSubmit={handleSaveStudent}>
                <div className="vu-modal-body">
                  <div className="vu-form-grid">
                    <div className="vu-field full">
                      <label>Student Full Name <i>*</i></label>
                      <input
                        autoFocus
                        required
                        value={studentForm.fullName}
                        onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                        placeholder="e.g. Sravan Kumar Reddy"
                      />
                    </div>
                    <div className="vu-field">
                      <label>University Roll Number <i>*</i></label>
                      <input
                        required
                        value={studentForm.rollNumber}
                        onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value.toUpperCase() })}
                        placeholder="e.g. 211FA04016"
                      />
                    </div>
                    <div className="vu-field">
                      <label>Class Section <i>*</i></label>
                      <select
                        value={studentForm.section}
                        onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                        <option value="D">Section D</option>
                      </select>
                    </div>
                    <div className="vu-field full">
                      <label>Degree & Branch <i>*</i></label>
                      <input
                        required
                        value={studentForm.course}
                        onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                        placeholder="e.g. B.Tech Computer Science & Engg"
                      />
                    </div>
                    <div className="vu-field full">
                      <label>Institutional Email</label>
                      <input
                        type="email"
                        value={studentForm.email}
                        onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                        placeholder="e.g. 211fa04016@vignan.ac.in"
                      />
                    </div>
                  </div>
                </div>
                <div className="vu-modal-foot">
                  <button type="button" className="btn-secondary" onClick={() => setModal('')}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? <LoaderCircle className="vu-spin" size={15} /> : <Check size={15} />}
                    <span>{editing ? 'Update Student' : 'Enroll Student'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveScore}>
                <div className="vu-modal-body">
                  <div className="vu-form-grid">
                    <div className="vu-field full">
                      <label>Select Student <i>*</i></label>
                      <select
                        required
                        value={scoreForm.studentId}
                        onChange={(e) => setScoreForm({ ...scoreForm, studentId: e.target.value })}
                      >
                        <option value="">-- Choose Student from Roster --</option>
                        {students.map((st) => (
                          <option key={st._id} value={st._id}>
                            {st.rollNumber} — {st.fullName} (Sec {st.section})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="vu-field full">
                      <label>Subject / Course <i>*</i></label>
                      <select
                        required
                        value={scoreForm.subject}
                        onChange={(e) => setScoreForm({ ...scoreForm, subject: e.target.value })}
                      >
                        {VIGNAN_COURSES.map((c) => (
                          <option key={c.code} value={c.name}>{c.code} — {c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="vu-field full">
                      <label>Assessment Type / Title <i>*</i></label>
                      <input
                        required
                        value={scoreForm.assessmentName}
                        onChange={(e) => setScoreForm({ ...scoreForm, assessmentName: e.target.value })}
                        placeholder="e.g. Mid-Term Examination 1, Lab Practical Internal"
                      />
                    </div>
                    <div className="vu-field">
                      <label>Marks Scored <i>*</i></label>
                      <input
                        type="number"
                        min="0"
                        max={scoreForm.maxScore || 100}
                        required
                        value={scoreForm.score}
                        onChange={(e) => setScoreForm({ ...scoreForm, score: e.target.value })}
                        placeholder="e.g. 88"
                      />
                    </div>
                    <div className="vu-field">
                      <label>Maximum Marks <i>*</i></label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={scoreForm.maxScore}
                        onChange={(e) => setScoreForm({ ...scoreForm, maxScore: e.target.value })}
                      />
                    </div>
                    <div className="vu-field full">
                      <label>Assessment Date <i>*</i></label>
                      <input
                        type="date"
                        required
                        value={scoreForm.assessmentDate}
                        onChange={(e) => setScoreForm({ ...scoreForm, assessmentDate: e.target.value })}
                      />
                    </div>
                    <div className="vu-field full">
                      <label>Faculty Remarks</label>
                      <input
                        value={scoreForm.remarks}
                        onChange={(e) => setScoreForm({ ...scoreForm, remarks: e.target.value })}
                        placeholder="e.g. High proficiency in data structures"
                      />
                    </div>
                  </div>
                </div>
                <div className="vu-modal-foot">
                  <button type="button" className="btn-secondary" onClick={() => setModal('')}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? <LoaderCircle className="vu-spin" size={15} /> : <Check size={15} />}
                    <span>{editing ? 'Update Score' : 'Save Assessment'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="vu-toast" role="status">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// AUTHENTICATION COMPONENT: LOGIN & SIGN UP PAGE
// =============================================================================
function AuthView({ onLogin, toast, setToast, academicYear, timeString, dateString }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authRole, setAuthRole] = useState('Faculty'); // 'Faculty' | 'Student' | 'Administrator'
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [emailOrId, setEmailOrId] = useState('bhavani@vignan.ac.in');
  const [password, setPassword] = useState('Vignan@2026');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form States
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupId, setSignupId] = useState('');
  const [signupDept, setSignupDept] = useState('Computer Science & Engineering');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle Login Submit
  function handleLoginSubmit(e) {
    e.preventDefault();
    setAuthError('');
    if (!emailOrId.trim() || !password) {
      setAuthError('Please enter your University ID/Email and password.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const isStudent = authRole === 'Student' || emailOrId.includes('211fa') || emailOrId.includes('student');
      const isAdmin = authRole === 'Administrator' || emailOrId.includes('admin') || emailOrId.includes('dean');

      const user = {
        name: isStudent ? 'Rahul Sharma' : isAdmin ? 'Dr. Dean Academics' : 'Dr. K. Bhavani',
        email: emailOrId.includes('@') ? emailOrId : `${emailOrId.toLowerCase()}@vignan.ac.in`,
        role: authRole,
        idCode: isStudent ? '211FA04001' : isAdmin ? 'VU-ADM-01' : 'FAC-2041',
        department: 'Computer Science & Engineering',
      };
      onLogin(user);
    }, 450);
  }

  // Handle Sign Up Submit
  function handleSignupSubmit(e) {
    e.preventDefault();
    setAuthError('');
    if (!fullName.trim() || !signupEmail.trim() || !signupPassword) {
      setAuthError('Please fill in all mandatory fields.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setAuthError('Passwords do not match. Please verify.');
      return;
    }
    if (signupPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const user = {
        name: fullName.trim(),
        email: signupEmail.trim(),
        role: authRole,
        idCode: signupId.trim() || (authRole === 'Student' ? '211FA04020' : 'FAC-2050'),
        department: signupDept,
      };
      onLogin(user);
    }, 500);
  }

  // Quick 1-Click Demo Login Shortcuts
  function quickDemoLogin(role) {
    if (role === 'Faculty') {
      onLogin({
        name: 'Dr. K. Bhavani',
        email: 'bhavani@vignan.ac.in',
        role: 'Faculty',
        idCode: 'FAC-2041',
        department: 'Computer Science & Engineering',
      });
    } else if (role === 'Student') {
      onLogin({
        name: 'Rahul Sharma',
        email: '211fa04001@vignan.ac.in',
        role: 'Student',
        idCode: '211FA04001',
        department: 'Computer Science & Engineering',
      });
    } else if (role === 'Admin') {
      onLogin({
        name: 'Dr. Dean Academics',
        email: 'dean.academics@vignan.ac.in',
        role: 'Administrator',
        idCode: 'VU-ADM-01',
        department: 'Academic Affairs',
      });
    }
  }

  return (
    <div className="vu-auth-screen">
      <div className="vu-auth-split">
        {/* Left Column: Vignan University Branding & Mission */}
        <div className="vu-auth-brand-pane">
          <div className="vu-auth-brand-top">
            <div className="vu-crest" style={{ width: 62, height: 62 }}>
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="46" stroke="#0f2b5c" strokeWidth="6" fill="#ffffff" />
                <path d="M50 14 L55 24 L66 22 L67 33 L78 35 L75 46 L84 50 L75 54 L78 65 L67 67 L66 78 L55 76 L50 86 L45 76 L34 78 L33 67 L22 65 L25 54 L16 50 L25 46 L22 35 L33 33 L34 22 L45 24 Z" fill="#f59e0b" opacity="0.25" />
                <path d="M50 20 C42 32 38 42 43 54 C45 48 50 44 52 41 C54 48 58 52 56 60 C64 54 62 36 50 20 Z" fill="#d97706" />
                <path d="M50 26 C45 34 43 40 46 48 C48 44 51 41 53 38 C54 43 56 46 55 52 C60 48 59 36 50 26 Z" fill="#fbbf24" />
                <path d="M30 64 C38 60 46 62 50 66 C54 62 62 60 70 64 L70 76 C62 72 54 74 50 78 C46 74 38 72 30 76 Z" fill="#0f2b5c" />
                <path d="M32 66 C39 62 46 64 50 68 C54 64 61 62 68 66" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="vu-badge-pill naac">NAAC A+ ACCREDITED</span>
              <h4 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.8, color: '#fbbf24', marginTop: 4 }}>
                VFSTR DEEMED TO BE UNIVERSITY
              </h4>
            </div>
          </div>

          <div className="vu-auth-brand-content">
            <span className="vu-title-subhead">
              <Sparkles size={13} /> OFFICIAL CAMPUS PORTAL
            </span>
            <h2>
              Smart Attendance &amp; <span>Academic Telemetry</span>
            </h2>
            <p>
              Welcome to the centralized academic console of Vignan's Foundation for Science, Technology &amp; Research. Experience next-generation biometric, RFID pass, and QR attendance automation.
            </p>

            <div className="vu-auth-features-list">
              <div className="vu-auth-feat-item">
                <div className="vu-auth-feat-icon"><ScanLine size={17} /></div>
                <span>Contactless RFID card and real-time QR check-in kiosk</span>
              </div>
              <div className="vu-auth-feat-item">
                <div className="vu-auth-feat-icon"><ShieldCheck size={17} /></div>
                <span>UGC 75% attendance compliance &amp; automated alert system</span>
              </div>
              <div className="vu-auth-feat-item">
                <div className="vu-auth-feat-icon"><Award size={17} /></div>
                <span>Direct marks recording, gradebook, and analytics</span>
              </div>
              <div className="vu-auth-feat-item">
                <div className="vu-auth-feat-icon"><Clock size={17} /></div>
                <span>Academic session {academicYear} · Semester VI Live</span>
              </div>
            </div>
          </div>

          <div className="vu-auth-brand-footer">
            <span>Vadlamudi, Guntur - 522213, A.P., India</span>
            <span>Campus Time: {timeString || '09:00 AM'}</span>
          </div>
        </div>

        {/* Right Column: Authentication Card (Login & Sign Up) */}
        <div className="vu-auth-form-pane">
          <div className="vu-auth-form-card">
            <div className="vu-auth-card-head">
              <span className="vu-panel-kicker">CAMPUS IDENTITY ACCESS MANAGEMENT</span>
              <h3>{authMode === 'login' ? 'Sign In to VFSTR' : 'Create University Account'}</h3>
              <p>
                {authMode === 'login'
                  ? 'Enter your university credentials or choose a 1-click demo role below.'
                  : 'Enroll as a new faculty, student, or proctor on the Vignan portal.'}
              </p>
            </div>

            {/* Segmented Switch: Sign In vs Sign Up */}
            <div className="vu-auth-mode-switch">
              <button
                type="button"
                className={`vu-auth-switch-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
              >
                <LogIn size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                Sign In
              </button>
              <button
                type="button"
                className={`vu-auth-switch-btn ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => { setAuthMode('signup'); setAuthError(''); }}
              >
                <Plus size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                Create Account
              </button>
            </div>

            {/* Role Selector Pills */}
            <div className="vu-auth-role-select">
              {['Faculty', 'Student', 'Administrator'].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`vu-role-pill-btn ${authRole === r ? 'active' : ''}`}
                  onClick={() => setAuthRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Error Message */}
            {authError && (
              <div className="vu-alert-banner" role="alert" style={{ marginBottom: 16 }}>
                <AlertTriangle size={16} />
                <span>{authError}</span>
              </div>
            )}

            {/* FORM 1: SIGN IN */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit}>
                <div className="vu-auth-field">
                  <label>
                    <span>University Email or Faculty ID</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>e.g. FAC-2041</span>
                  </label>
                  <div className="vu-auth-input-wrap">
                    <Mail size={16} className="vu-input-lead" />
                    <input
                      type="text"
                      autoFocus
                      required
                      placeholder="e.g. bhavani@vignan.ac.in or 211FA04001"
                      value={emailOrId}
                      onChange={(e) => setEmailOrId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="vu-auth-field">
                  <label>
                    <span>Password</span>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact VFSTR IT Helpdesk (helpdesk@vignan.ac.in) or use 1-Click Demo Login below.'); }} style={{ color: '#2563eb', fontSize: 11, textDecoration: 'none' }}>
                      Forgot?
                    </a>
                  </label>
                  <div className="vu-auth-input-wrap">
                    <Lock size={16} className="vu-input-lead" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your university password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="vu-pw-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="vu-auth-remember-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me on this workstation</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="vu-auth-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? <LoaderCircle className="vu-spin" size={18} /> : <LogIn size={18} />}
                  <span>{submitting ? 'Verifying Credentials…' : `Sign In as ${authRole}`}</span>
                </button>
              </form>
            ) : (
              /* FORM 2: SIGN UP / REGISTER */
              <form onSubmit={handleSignupSubmit}>
                <div className="vu-auth-field">
                  <label>Full Name</label>
                  <div className="vu-auth-input-wrap">
                    <User size={16} className="vu-input-lead" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. K. Bhavani or Sravan Reddy"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="vu-auth-field">
                  <label>Institutional Email</label>
                  <div className="vu-auth-input-wrap">
                    <Mail size={16} className="vu-input-lead" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@vignan.ac.in"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="vu-auth-field">
                  <label>University ID / Roll Number</label>
                  <div className="vu-auth-input-wrap">
                    <KeyRound size={16} className="vu-input-lead" />
                    <input
                      type="text"
                      placeholder="e.g. FAC-2041 or 211FA04020"
                      value={signupId}
                      onChange={(e) => setSignupId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="vu-auth-field">
                  <label>Department / Branch</label>
                  <div className="vu-auth-input-wrap">
                    <Laptop size={16} className="vu-input-lead" />
                    <select
                      value={signupDept}
                      onChange={(e) => setSignupDept(e.target.value)}
                    >
                      <option value="Computer Science & Engineering">Dept. of Computer Science &amp; Engg (CSE)</option>
                      <option value="Information Technology">Dept. of Information Technology (IT)</option>
                      <option value="Artificial Intelligence & DS">Dept. of AI &amp; Data Science (AIDS)</option>
                      <option value="Electronics & Communication">Dept. of Electronics &amp; Comm (ECE)</option>
                    </select>
                  </div>
                </div>

                <div className="vu-auth-field">
                  <label>Create Password</label>
                  <div className="vu-auth-input-wrap">
                    <Lock size={16} className="vu-input-lead" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="vu-pw-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="vu-auth-field">
                  <label>Confirm Password</label>
                  <div className="vu-auth-input-wrap">
                    <Lock size={16} className="vu-input-lead" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="vu-auth-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? <LoaderCircle className="vu-spin" size={18} /> : <Check size={18} />}
                  <span>{submitting ? 'Creating Account…' : 'Register Account'}</span>
                </button>
              </form>
            )}

            {/* 1-Click Quick Demo Login Shortcuts */}
            <div className="vu-demo-logins-box">
              <div className="vu-demo-heading">Or Quick 1-Click Demo Login</div>
              <div className="vu-demo-btn-group">
                <button
                  type="button"
                  className="vu-demo-pill"
                  onClick={() => quickDemoLogin('Faculty')}
                >
                  Faculty Demo
                </button>
                <button
                  type="button"
                  className="vu-demo-pill"
                  onClick={() => quickDemoLogin('Student')}
                >
                  Student Demo
                </button>
                <button
                  type="button"
                  className="vu-demo-pill"
                  onClick={() => quickDemoLogin('Admin')}
                >
                  Admin Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast */}
      {toast && (
        <div className="vu-toast" role="status">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENT: DASHBOARD OVERVIEW
// =============================================================================
function DashboardView({
  students, scores, marks, attendanceRate, presentCount,
  absentCount, lateCount, excusedCount, defaultersCount,
  onGoAttendance, onGoScanner, onGoDefaulters, onAddScore, onAddStudent
}) {
  const avgScore = scores.length
    ? Math.round(scores.reduce((sum, s) => sum + percent(s.score, s.maxScore), 0) / scores.length)
    : 85;

  return (
    <div>
      {/* 4 Primary KPI Stat Cards */}
      <div className="vu-stats-grid">
        <div className="vu-stat-card">
          <div className="vu-stat-top">
            <div className="vu-stat-icon blue">
              <Users size={20} />
            </div>
            <span className="vu-stat-badge neutral">Section A & B</span>
          </div>
          <div className="vu-stat-label">TOTAL ENROLLED</div>
          <div className="vu-stat-value">{students.length}</div>
          <div className="vu-stat-footnote">
            <ShieldCheck size={13} color="#2563eb" /> Active student roll
          </div>
        </div>

        <div className="vu-stat-card">
          <div className="vu-stat-top">
            <div className="vu-stat-icon emerald">
              <UserCheck size={20} />
            </div>
            <span className={`vu-stat-badge ${attendanceRate >= 75 ? 'good' : 'warning'}`}>
              {attendanceRate >= 75 ? 'UGC Compliant' : 'Below Target'}
            </span>
          </div>
          <div className="vu-stat-label">TODAY'S ATTENDANCE</div>
          <div className="vu-stat-value">{attendanceRate}%</div>
          <div className="vu-stat-footnote">
            <span className="vu-pulse-dot" /> {presentCount} Present · {absentCount} Absent
          </div>
        </div>

        <div className="vu-stat-card">
          <div className="vu-stat-top">
            <div className="vu-stat-icon gold">
              <Award size={20} />
            </div>
            <span className="vu-stat-badge good">Class Grade: A</span>
          </div>
          <div className="vu-stat-label">ACADEMIC PERFORMANCE</div>
          <div className="vu-stat-value">{avgScore}%</div>
          <div className="vu-stat-footnote">
            <TrendingUp size={13} color="#d97706" /> {scores.length} Assessments Recorded
          </div>
        </div>

        <div className="vu-stat-card">
          <div className="vu-stat-top">
            <div className="vu-stat-icon rose">
              <AlertTriangle size={20} />
            </div>
            <span className="vu-stat-badge warning">&lt; 75% Rule</span>
          </div>
          <div className="vu-stat-label">ATTENDANCE AT RISK</div>
          <div className="vu-stat-value" style={{ color: '#dc2626' }}>{defaultersCount}</div>
          <div className="vu-stat-footnote">
            <button
              onClick={onGoDefaulters}
              style={{ color: '#dc2626', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}
            >
              View Defaulters <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Rows */}
      <div className="vu-dash-row">
        {/* Attendance Visual Gauge */}
        <div className="vu-panel">
          <div className="vu-panel-header">
            <div className="vu-panel-title">
              <span className="vu-panel-kicker">TODAY'S ATTENDANCE TELEMETRY</span>
              <h2>Class Session Attendance</h2>
            </div>
            <button className="btn-secondary" onClick={onGoAttendance}>
              <span>Register</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="vu-panel-body">
            <div className="vu-attendance-visual">
              {/* Circular Gauge */}
              <div className="vu-gauge-wrap">
                <svg className="vu-gauge-svg" viewBox="0 0 140 140">
                  <circle className="vu-gauge-bg" cx="70" cy="70" r="54" />
                  <circle
                    className="vu-gauge-meter"
                    cx="70"
                    cy="70"
                    r="54"
                    strokeDasharray={339.29}
                    strokeDashoffset={339.29 - (339.29 * attendanceRate) / 100}
                  />
                </svg>
                <div className="vu-gauge-center">
                  <b>{attendanceRate}%</b>
                  <span>Present</span>
                </div>
              </div>

              {/* Breakdown Bars */}
              <div className="vu-breakdown-list">
                <div className="vu-breakdown-row">
                  <div className="vu-breakdown-labels">
                    <span><i className="vu-color-bullet present" /> Present</span>
                    <b>{presentCount} ({students.length ? Math.round((presentCount / students.length) * 100) : 0}%)</b>
                  </div>
                  <div className="vu-meter-track">
                    <div
                      className="vu-meter-fill"
                      style={{ width: `${students.length ? (presentCount / students.length) * 100 : 0}%`, background: '#10b981' }}
                    />
                  </div>
                </div>

                <div className="vu-breakdown-row">
                  <div className="vu-breakdown-labels">
                    <span><i className="vu-color-bullet absent" /> Absent</span>
                    <b>{absentCount} ({students.length ? Math.round((absentCount / students.length) * 100) : 0}%)</b>
                  </div>
                  <div className="vu-meter-track">
                    <div
                      className="vu-meter-fill"
                      style={{ width: `${students.length ? (absentCount / students.length) * 100 : 0}%`, background: '#ef4444' }}
                    />
                  </div>
                </div>

                <div className="vu-breakdown-row">
                  <div className="vu-breakdown-labels">
                    <span><i className="vu-color-bullet late" /> Late</span>
                    <b>{lateCount} ({students.length ? Math.round((lateCount / students.length) * 100) : 0}%)</b>
                  </div>
                  <div className="vu-meter-track">
                    <div
                      className="vu-meter-fill"
                      style={{ width: `${students.length ? (lateCount / students.length) * 100 : 0}%`, background: '#f59e0b' }}
                    />
                  </div>
                </div>

                <div className="vu-breakdown-row">
                  <div className="vu-breakdown-labels">
                    <span><i className="vu-color-bullet excused" /> Excused (OD / Medical)</span>
                    <b>{excusedCount} ({students.length ? Math.round((excusedCount / students.length) * 100) : 0}%)</b>
                  </div>
                  <div className="vu-meter-track">
                    <div
                      className="vu-meter-fill"
                      style={{ width: `${students.length ? (excusedCount / students.length) * 100 : 0}%`, background: '#6366f1' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launch & Scanner Launcher */}
        <div className="vu-panel">
          <div className="vu-panel-header">
            <div className="vu-panel-title">
              <span className="vu-panel-kicker">SMART CLASSROOM SHORTCUTS</span>
              <h2>Quick Actions</h2>
            </div>
            <Sparkles size={16} color="#f59e0b" />
          </div>

          <div className="vu-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              className="btn-secondary"
              onClick={onGoScanner}
              style={{ justifyContent: 'flex-start', padding: '14px 16px', borderRadius: 10, background: '#f8fafc' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fef3c7', color: '#d97706', display: 'grid', placeItems: 'center', marginRight: 12 }}>
                <ScanLine size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <b style={{ display: 'block', fontSize: 13, color: '#0f172a' }}>Smart RFID / QR Kiosk</b>
                <span style={{ fontSize: 11, color: '#64748b' }}>Simulate contactless door / barcode check-in</span>
              </div>
              <ChevronRight size={16} style={{ marginLeft: 'auto', color: '#94a3b8' }} />
            </button>

            <button
              className="btn-secondary"
              onClick={onGoAttendance}
              style={{ justifyContent: 'flex-start', padding: '14px 16px', borderRadius: 10, background: '#f8fafc' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#ecfdf5', color: '#059669', display: 'grid', placeItems: 'center', marginRight: 12 }}>
                <CheckCheck size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <b style={{ display: 'block', fontSize: 13, color: '#0f172a' }}>Rapid Attendance Matrix</b>
                <span style={{ fontSize: 11, color: '#64748b' }}>One-click [P], [A], [L] toggle register</span>
              </div>
              <ChevronRight size={16} style={{ marginLeft: 'auto', color: '#94a3b8' }} />
            </button>

            <button
              className="btn-secondary"
              onClick={onAddScore}
              style={{ justifyContent: 'flex-start', padding: '14px 16px', borderRadius: 10, background: '#f8fafc' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'grid', placeItems: 'center', marginRight: 12 }}>
                <BarChart3 size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <b style={{ display: 'block', fontSize: 13, color: '#0f172a' }}>Record Assessment Marks</b>
                <span style={{ fontSize: 11, color: '#64748b' }}>Mid-1, Mid-2, Sem Labs & Unit Tests</span>
              </div>
              <ChevronRight size={16} style={{ marginLeft: 'auto', color: '#94a3b8' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Assessment Table */}
      <div className="vu-panel">
        <div className="vu-panel-header">
          <div className="vu-panel-title">
            <span className="vu-panel-kicker">ASSESSMENT PROGRESS</span>
            <h2>Recent University Assessment Marks</h2>
          </div>
          <button className="btn-secondary" onClick={onAddScore}>
            <Plus size={14} /> Add Assessment
          </button>
        </div>

        <div className="vu-table-scroll">
          <table className="vu-attendance-table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>ROLL NUMBER</th>
                <th>SUBJECT</th>
                <th>ASSESSMENT</th>
                <th>SCORE</th>
                <th>PERCENTAGE</th>
                <th>GRADE</th>
              </tr>
            </thead>
            <tbody>
              {scores.slice(0, 5).map((sc) => {
                const p = percent(sc.score, sc.maxScore);
                return (
                  <tr key={sc._id}>
                    <td>
                      <div className="vu-student-profile">
                        <div className="vu-avatar-badge">{initials(sc.student?.fullName)}</div>
                        <div className="vu-student-info">
                          <span className="vu-student-name">{sc.student?.fullName || 'Enrolled Student'}</span>
                          <span className="vu-student-sub">{sc.remarks || 'Regular Assessment'}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="vu-roll-tag">{sc.student?.rollNumber || '—'}</span></td>
                    <td><b>{sc.subject}</b></td>
                    <td>{sc.assessmentName}</td>
                    <td><b>{sc.score}</b> / {sc.maxScore}</td>
                    <td>
                      <span className={`vu-cumul-badge ${p >= 75 ? 'safe' : 'danger'}`}>
                        {p}%
                      </span>
                    </td>
                    <td>
                      <span
                        className="vu-badge-pill"
                        style={{
                          background: p >= 90 ? '#ecfdf5' : p >= 75 ? '#eff6ff' : '#fef2f2',
                          color: p >= 90 ? '#059669' : p >= 75 ? '#2563eb' : '#dc2626',
                          borderColor: 'transparent',
                        }}
                      >
                        {p >= 90 ? 'Grade O' : p >= 80 ? 'Grade A+' : p >= 70 ? 'Grade A' : 'Grade B'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SUB-COMPONENT: SMART ATTENDANCE SYSTEM VIEW
// =============================================================================
function SmartAttendanceView({
  students, allStudents, marks, notes, setMarks, setNotes,
  attendanceDate, setAttendanceDate, selectedSlot, setSelectedSlot,
  selectedCourse, setSelectedCourse, sectionFilter, setSectionFilter,
  statusFilter, setStatusFilter, search, setSearch, smartMode, setSmartMode,
  presentCount, absentCount, lateCount, excusedCount, unmarkedCount,
  attendanceRate, defaulters, onSetAll, onInvert, onClear, onToggleStatus,
  onSave, saving, onExportCSV, scanInput, setScanInput, onScanSubmit,
  lastScanned, scanFeed, onSeedRoster
}) {
  return (
    <div className="vu-smart-attendance-suite">
      {/* 4 Mode Pills: Register Matrix, Scanner Kiosk, Defaulters List, Reports */}
      <div className="vu-smart-modes-nav">
        <button
          className={`vu-mode-btn ${smartMode === 'register' ? 'active' : ''}`}
          onClick={() => setSmartMode('register')}
        >
          <CheckCheck size={16} />
          <span>Interactive Register</span>
          <span className="vu-mode-badge">Rapid Matrix</span>
        </button>

        <button
          className={`vu-mode-btn ${smartMode === 'scanner' ? 'active' : ''}`}
          onClick={() => setSmartMode('scanner')}
        >
          <ScanLine size={16} />
          <span>Smart Scanner / RFID Kiosk</span>
          <span className="vu-mode-badge">Auto Pass</span>
        </button>

        <button
          className={`vu-mode-btn ${smartMode === 'defaulters' ? 'active' : ''}`}
          onClick={() => setSmartMode('defaulters')}
        >
          <AlertTriangle size={16} />
          <span>Defaulter Watchlist (&lt;75%)</span>
          {defaulters.length > 0 && <span className="vu-mode-badge">{defaulters.length} At Risk</span>}
        </button>

        <button
          className={`vu-mode-btn ${smartMode === 'reports' ? 'active' : ''}`}
          onClick={() => setSmartMode('reports')}
        >
          <Printer size={16} />
          <span>Printable Register & Export</span>
        </button>
      </div>

      {/* Session Configuration Bar */}
      <div className="vu-session-config-bar">
        <div className="vu-session-fields">
          {/* Date Picker */}
          <div className="vu-input-pill">
            <Calendar size={15} />
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
            <button
              type="button"
              className="vu-quick-date-btn"
              onClick={() => setAttendanceDate(today)}
            >
              Today
            </button>
          </div>

          {/* Period Slot */}
          <div className="vu-input-pill">
            <Clock3 size={15} />
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
            >
              {PERIOD_SLOTS.map((slot) => (
                <option key={slot.id} value={slot.id}>{slot.label}</option>
              ))}
            </select>
          </div>

          {/* Subject / Course */}
          <div className="vu-input-pill">
            <BookOpen size={15} />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {VIGNAN_COURSES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="vu-input-pill">
            <Layers size={15} />
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
        </div>

        {/* Live Tally Chips */}
        <div className="vu-tally-chips">
          <span className="vu-chip present" title="Present count">
            <Check size={12} /> Present: {presentCount} ({attendanceRate}%)
          </span>
          <span className="vu-chip absent" title="Absent count">
            <X size={12} /> Absent: {absentCount}
          </span>
          <span className="vu-chip late" title="Late arrival">
            <Clock3 size={12} /> Late: {lateCount}
          </span>
          <span className="vu-chip excused" title="On-Duty or Medical">
            <ShieldCheck size={12} /> Excused: {excusedCount}
          </span>
          {unmarkedCount > 0 && (
            <span className="vu-chip unmarked">
              Unmarked: {unmarkedCount}
            </span>
          )}
        </div>
      </div>

      {/* ===================================================================
          MODE 1: RAPID INTERACTIVE MATRIX REGISTER
          =================================================================== */}
      {smartMode === 'register' && (
        <div className="vu-panel">
          {/* Quick Action Toolbar */}
          <div className="vu-roster-actions-bar">
            <div className="vu-bulk-triggers">
              <button
                type="button"
                className="btn-pill-action green"
                onClick={() => onSetAll('Present')}
              >
                <CheckCheck size={14} /> Mark All Present
              </button>
              <button
                type="button"
                className="btn-pill-action red"
                onClick={() => onSetAll('Absent')}
              >
                <UserX size={14} /> Mark All Absent
              </button>
              <button
                type="button"
                className="btn-pill-action"
                onClick={onInvert}
              >
                <RefreshCw size={13} /> Invert Selection
              </button>
              <button
                type="button"
                className="btn-pill-action"
                onClick={onClear}
              >
                <Trash2 size={13} /> Clear
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="vu-search-box">
                <Search size={15} />
                <input
                  placeholder="Filter student or roll no…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="btn-secondary"
                style={{ padding: '6px 10px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Present">Present Only</option>
                <option value="Absent">Absent Only</option>
                <option value="Late">Late Only</option>
                <option value="Excused">Excused Only</option>
                <option value="Unmarked">Unmarked Only</option>
              </select>
            </div>
          </div>

          {/* Interactive Roster Table */}
          {students.length > 0 ? (
            <div className="vu-table-scroll">
              <table className="vu-attendance-table">
                <thead>
                  <tr>
                    <th>STUDENT PROFILE</th>
                    <th>ROLL NUMBER</th>
                    <th>SECTION</th>
                    <th style={{ textAlign: 'center' }}>QUICK STATUS TOGGLE</th>
                    <th>SESSION REMARKS</th>
                    <th>SEMESTER ATTENDANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const currentStatus = marks[student._id] || '';
                    const rollEnd = parseInt(student.rollNumber.slice(-2), 10) || 5;
                    const baselineRate = rollEnd === 8 ? 62 : rollEnd === 15 ? 58 : rollEnd === 4 ? 71 : Math.min(76 + (rollEnd * 2) % 24, 98);

                    return (
                      <tr key={student._id}>
                        <td>
                          <div className="vu-student-profile">
                            <div className="vu-avatar-badge">{initials(student.fullName)}</div>
                            <div className="vu-student-info">
                              <span className="vu-student-name">{student.fullName}</span>
                              <span className="vu-student-sub">{student.email}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="vu-roll-tag">{student.rollNumber}</span>
                        </td>

                        <td>
                          <b>Sec {student.section}</b>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <div className="vu-status-toggle-group">
                            <button
                              type="button"
                              className={`vu-toggle-btn ${currentStatus === 'Present' ? 'active p' : ''}`}
                              onClick={() => onToggleStatus(student._id, 'Present')}
                              title="Mark Present"
                            >
                              <Check size={12} /> Present
                            </button>

                            <button
                              type="button"
                              className={`vu-toggle-btn ${currentStatus === 'Absent' ? 'active a' : ''}`}
                              onClick={() => onToggleStatus(student._id, 'Absent')}
                              title="Mark Absent"
                            >
                              <X size={12} /> Absent
                            </button>

                            <button
                              type="button"
                              className={`vu-toggle-btn ${currentStatus === 'Late' ? 'active l' : ''}`}
                              onClick={() => onToggleStatus(student._id, 'Late')}
                              title="Mark Late"
                            >
                              Late
                            </button>

                            <button
                              type="button"
                              className={`vu-toggle-btn ${currentStatus === 'Excused' ? 'active e' : ''}`}
                              onClick={() => onToggleStatus(student._id, 'Excused')}
                              title="Mark Excused (OD / Medical)"
                            >
                              Excused
                            </button>
                          </div>
                        </td>

                        <td>
                          <input
                            className="vu-note-input"
                            placeholder="Add remark…"
                            value={notes[student._id] || ''}
                            onChange={(e) => setNotes({ ...notes, [student._id]: e.target.value })}
                          />
                        </td>

                        <td>
                          <span className={`vu-cumul-badge ${baselineRate >= 75 ? 'safe' : 'danger'}`}>
                            {baselineRate}% {baselineRate < 75 ? '⚠️ Defaulter' : 'Eligible'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="vu-empty-state">
              <div className="vu-empty-icon"><Users size={28} /></div>
              <h3>No students matched the active filter</h3>
              <p>Try clearing your search query or populate the sample Vignan University roster.</p>
              <button className="btn-primary" onClick={onSeedRoster}>
                <Plus size={14} /> Seed Vignan CSE Roster
              </button>
            </div>
          )}

          {/* Sticky Commit Bar */}
          {students.length > 0 && (
            <div className="vu-sticky-save-bar">
              <div className="vu-save-info">
                <ShieldCheck size={22} />
                <div>
                  <b>Ready to commit attendance: {presentCount + absentCount + lateCount + excusedCount} marked</b>
                  <span>Session: {selectedCourse} · Period {selectedSlot} · Date: {attendanceDate}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onExportCSV}
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                >
                  <Download size={14} /> Export CSV
                </button>

                <button
                  type="button"
                  className="btn-primary btn-gold"
                  onClick={onSave}
                  disabled={saving}
                >
                  {saving ? <LoaderCircle className="vu-spin" size={15} /> : <Check size={15} />}
                  <span>{saving ? 'Syncing…' : 'Save Attendance to Portal'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          MODE 2: SMART SCANNER & PASS KIOSK
          =================================================================== */}
      {smartMode === 'scanner' && (
        <div className="vu-kiosk-layout">
          {/* Left: Interactive Scanner Terminal */}
          <div className="vu-scanner-panel">
            <div className="vu-scanner-header">
              <span className="vu-panel-kicker">CONTACTLESS SMART CLASSROOM ENTRY</span>
              <h3>Vignan RFID &amp; Barcode Scanner Kiosk</h3>
              <p>Type roll number, scan student ID barcode, or tap university smart card.</p>
            </div>

            {/* Glowing Scan Card */}
            <div className="vu-scan-input-card">
              <div className="vu-scan-beam" />
              <div className="vu-scan-icon-ring">
                <ScanLine size={32} />
              </div>

              <form className="vu-scan-form" onSubmit={onScanSubmit}>
                <input
                  className="vu-scan-input"
                  autoFocus
                  placeholder="SCAN ID CARD OR ENTER ROLL NO (e.g. 001 or 211FA04001)"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                />
                <button type="submit" className="btn-primary btn-gold" style={{ padding: '12px 20px', fontSize: 14 }}>
                  <Check size={18} /> Check In
                </button>
              </form>

              <div className="vu-scan-hint">
                Tip: Press <kbd style={{ background: '#334155', padding: '2px 5px', borderRadius: 4 }}>Enter</kbd> to simulate fast laser scanner capture with audible chime.
              </div>
            </div>

            {/* Visual Confirmation Card of Last Scanned Student */}
            {lastScanned && (
              <div className="vu-last-scanned-card">
                <div className="vu-last-scanned-left">
                  <div className="vu-last-scanned-icon">
                    <CheckCircle2 size={22} />
                  </div>
                  <div className="vu-last-scanned-info">
                    <b>{lastScanned.name} ({lastScanned.roll})</b>
                    <span>Verified &amp; Recorded Present at {lastScanned.time}</span>
                  </div>
                </div>
                <span className="vu-badge-pill naac">VERIFIED ATTENDANCE</span>
              </div>
            )}

            {/* Projectable Mobile Session QR Code */}
            <div style={{ marginTop: 24, borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <b style={{ fontSize: 13, color: '#0f172a' }}>Display Classroom Mobile Pass QR</b>
                  <p style={{ fontSize: 11, color: '#64748b' }}>Project this code for students to scan via Vignan Student App</p>
                </div>
                <span className="vu-badge-pill"><Radio size={12} /> SESSION ACTIVE</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ width: 84, height: 84, background: '#ffffff', border: '2px solid #0f2b5c', borderRadius: 8, display: 'grid', placeItems: 'center' }}>
                  <QrCode size={68} color="#0f2b5c" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: '#0f2b5c' }}>
                    VFSTR-{selectedCourse}-SEC{sectionFilter === 'All' ? 'A' : sectionFilter}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                    Dynamic 45-second rotatory token prevents proxy attendance.
                  </div>
                  <div style={{ fontSize: 10, color: '#059669', fontWeight: 700, marginTop: 4 }}>
                    ● 48 Students Connected in Classroom Wi-Fi (VFSTR-AP-04)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Chronological Live Scan Feed */}
          <div className="vu-activity-feed-panel">
            <div className="vu-feed-header">
              <h4>Live Check-In Stream</h4>
              <span className="vu-badge-pill">{scanFeed.length} Scans</span>
            </div>

            <div className="vu-feed-list">
              {scanFeed.map((item) => (
                <div key={item.id} className="vu-feed-item">
                  <div className="vu-feed-item-left">
                    <div className="vu-avatar-badge" style={{ width: 30, height: 30, fontSize: 11 }}>
                      {initials(item.name)}
                    </div>
                    <div className="vu-feed-item-meta">
                      <b>{item.name}</b>
                      <span>{item.roll}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="vu-badge-pill naac">{item.status}</span>
                    <div className="vu-feed-time">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODE 3: DEFAULTER ANALYTICS (<75% UGC MANDATORY THRESHOLD)
          =================================================================== */}
      {smartMode === 'defaulters' && (
        <div className="vu-defaulters-panel">
          <div className="vu-defaulters-banner">
            <AlertTriangle size={24} />
            <div className="vu-defaulters-banner-text">
              <h4>Vignan University &amp; UGC Academic Regulation 75% Rule</h4>
              <p>
                Students with attendance below 75% are ineligible for End-Semester Examinations without approved medical/condonation certificates. The table below lists all students currently in the critical zone along with recovery trajectory.
              </p>
            </div>
          </div>

          <div className="vu-table-scroll">
            <table className="vu-attendance-table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>ROLL NUMBER</th>
                  <th>SECTION</th>
                  <th>ATTENDANCE %</th>
                  <th>STATUS</th>
                  <th>CLASSES NEEDED FOR 75%</th>
                  <th>PROCTOR ACTION</th>
                </tr>
              </thead>
              <tbody>
                {defaulters.map((st) => (
                  <tr key={st._id}>
                    <td>
                      <div className="vu-student-profile">
                        <div className="vu-avatar-badge" style={{ background: '#ef4444' }}>
                          {initials(st.fullName)}
                        </div>
                        <div className="vu-student-info">
                          <span className="vu-student-name">{st.fullName}</span>
                          <span className="vu-student-sub">{st.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="vu-roll-tag">{st.rollNumber}</span></td>
                    <td><b>Sec {st.section}</b></td>
                    <td>
                      <b style={{ color: '#dc2626', fontSize: 14 }}>{st.cumulativeRate}%</b>
                    </td>
                    <td>
                      <span className="vu-cumul-badge danger">
                        Shortfall ({75 - st.cumulativeRate}%)
                      </span>
                    </td>
                    <td>
                      <b>Must attend next {st.neededClasses} classes</b>
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        onClick={() => alert(`Proctor Alert SMS and Parent Email generated for ${st.fullName} (${st.rollNumber}) via VFSTR Parent Portal.`)}
                        style={{ fontSize: 11, padding: '4px 8px' }}
                      >
                        Send Alert SMS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODE 4: PRINTABLE REGISTER & CSV EXPORT
          =================================================================== */}
      {smartMode === 'reports' && (
        <div className="vu-print-register-card">
          <div className="vu-print-header">
            <div>
              <div className="vu-print-inst-name">
                VIGNAN'S FOUNDATION FOR SCIENCE, TECHNOLOGY AND RESEARCH
              </div>
              <div className="vu-print-inst-sub">
                (Deemed to be University u/s 3 of UGC Act 1956) · Department of Computer Science &amp; Engineering
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f2b5c', marginTop: 4 }}>
                CLASS ATTENDANCE REGISTER · COURSE CODE: {selectedCourse} · PERIOD {selectedSlot}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" onClick={() => window.print()}>
                <Printer size={15} /> Print Formal Sheet
              </button>
              <button className="btn-primary btn-gold" onClick={onExportCSV}>
                <Download size={15} /> Download CSV
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 16 }}>
            <span><b>Date:</b> {attendanceDate}</span>
            <span><b>Faculty In-Charge:</b> Dr. K. Bhavani (FAC-2041)</span>
            <span><b>Section:</b> B.Tech CSE (Sec {sectionFilter})</span>
            <span><b>Enrolled:</b> {allStudents.length}</span>
            <span><b>Present:</b> {presentCount}</span>
            <span><b>Absent:</b> {absentCount}</span>
          </div>

          <div className="vu-table-scroll">
            <table className="vu-attendance-table" style={{ border: '1px solid #cbd5e1' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #cbd5e1' }}>S.NO</th>
                  <th style={{ border: '1px solid #cbd5e1' }}>ROLL NUMBER</th>
                  <th style={{ border: '1px solid #cbd5e1' }}>STUDENT NAME</th>
                  <th style={{ border: '1px solid #cbd5e1' }}>SEC</th>
                  <th style={{ border: '1px solid #cbd5e1' }}>STATUS</th>
                  <th style={{ border: '1px solid #cbd5e1' }}>REMARKS</th>
                  <th style={{ border: '1px solid #cbd5e1' }}>STUDENT SIGN</th>
                </tr>
              </thead>
              <tbody>
                {allStudents.map((st, idx) => (
                  <tr key={st._id}>
                    <td style={{ border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ border: '1px solid #cbd5e1', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{st.rollNumber}</td>
                    <td style={{ border: '1px solid #cbd5e1', fontWeight: 600 }}>{st.fullName}</td>
                    <td style={{ border: '1px solid #cbd5e1', textAlign: 'center' }}>{st.section}</td>
                    <td style={{ border: '1px solid #cbd5e1', fontWeight: 700, color: marks[st._id] === 'Present' ? '#059669' : marks[st._id] === 'Absent' ? '#dc2626' : '#d97706' }}>
                      {marks[st._id] || 'Not Marked'}
                    </td>
                    <td style={{ border: '1px solid #cbd5e1' }}>{notes[st._id] || '—'}</td>
                    <td style={{ border: '1px solid #cbd5e1', width: 100 }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: 40 }} />
              <div style={{ borderTop: '1px solid #0f172a', width: 160, paddingTop: 4, fontSize: 11, fontWeight: 700 }}>
                FACULTY SIGNATURE
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: 40 }} />
              <div style={{ borderTop: '1px solid #0f172a', width: 160, paddingTop: 4, fontSize: 11, fontWeight: 700 }}>
                HEAD OF DEPARTMENT
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: 40 }} />
              <div style={{ borderTop: '1px solid #0f172a', width: 160, paddingTop: 4, fontSize: 11, fontWeight: 700 }}>
                DEAN OF ACADEMICS
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENT: STUDENT DIRECTORY VIEW
// =============================================================================
function StudentsDirectoryView({
  students, totalCount, search, setSearch, sectionFilter,
  setSectionFilter, onAdd, onEdit, onDelete, onSeedRoster
}) {
  return (
    <div className="vu-panel">
      <div className="vu-roster-actions-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="vu-search-box">
            <Search size={15} />
            <input
              placeholder="Search by name, roll no or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="btn-secondary"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
          >
            <option value="All">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={onSeedRoster}>
            <Sparkles size={14} /> Seed Vignan Roster
          </button>
          <button className="btn-primary" onClick={onAdd}>
            <Plus size={14} /> Enroll Student
          </button>
        </div>
      </div>

      {students.length > 0 ? (
        <div className="vu-table-scroll">
          <table className="vu-attendance-table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>ROLL NUMBER</th>
                <th>PROGRAM &amp; BRANCH</th>
                <th>SECTION</th>
                <th>INSTITUTIONAL EMAIL</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => (
                <tr key={st._id}>
                  <td>
                    <div className="vu-student-profile">
                      <div className="vu-avatar-badge">{initials(st.fullName)}</div>
                      <div className="vu-student-info">
                        <span className="vu-student-name">{st.fullName}</span>
                        <span className="vu-student-sub">Enrolled Undergrad</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="vu-roll-tag">{st.rollNumber}</span></td>
                  <td>{st.course}</td>
                  <td><b>Section {st.section || 'A'}</b></td>
                  <td>{st.email || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button className="btn-secondary" onClick={() => onEdit(st)} style={{ padding: '4px 8px', fontSize: 11 }}>
                        Edit
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => onDelete(st)}
                        style={{ padding: '4px 8px', fontSize: 11, color: '#dc2626' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="vu-empty-state">
          <div className="vu-empty-icon"><Users size={28} /></div>
          <h3>No students in this view</h3>
          <p>Add a new student or populate the sample Vignan University batch.</p>
          <button className="btn-primary" onClick={onSeedRoster}>
            Seed Vignan Class Roster
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENT: PERFORMANCE & MARKS VIEW
// =============================================================================
function PerformanceView({ scores, students, search, setSearch, onAdd, onEdit, onDelete }) {
  const filtered = scores.filter((sc) => {
    const q = search.toLowerCase().trim();
    return !q ||
      sc.subject.toLowerCase().includes(q) ||
      sc.assessmentName.toLowerCase().includes(q) ||
      (sc.student?.fullName || '').toLowerCase().includes(q) ||
      (sc.student?.rollNumber || '').toLowerCase().includes(q);
  });

  return (
    <div className="vu-panel">
      <div className="vu-roster-actions-bar">
        <div className="vu-search-box">
          <Search size={15} />
          <input
            placeholder="Search by student, subject, or exam…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={onAdd}>
          <Plus size={14} /> Record Assessment Marks
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className="vu-table-scroll">
          <table className="vu-attendance-table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>ROLL NUMBER</th>
                <th>SUBJECT</th>
                <th>ASSESSMENT</th>
                <th>DATE</th>
                <th>SCORE</th>
                <th>PERCENTAGE</th>
                <th>REMARKS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sc) => {
                const p = percent(sc.score, sc.maxScore);
                return (
                  <tr key={sc._id}>
                    <td>
                      <div className="vu-student-profile">
                        <div className="vu-avatar-badge">{initials(sc.student?.fullName)}</div>
                        <div className="vu-student-info">
                          <span className="vu-student-name">{sc.student?.fullName || 'Deleted'}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="vu-roll-tag">{sc.student?.rollNumber || '—'}</span></td>
                    <td><b>{sc.subject}</b></td>
                    <td>{sc.assessmentName}</td>
                    <td>{dateLabel(sc.assessmentDate)}</td>
                    <td><b>{sc.score}</b> / {sc.maxScore}</td>
                    <td>
                      <span className={`vu-cumul-badge ${p >= 75 ? 'safe' : 'danger'}`}>
                        {p}%
                      </span>
                    </td>
                    <td style={{ fontSize: 11, color: '#64748b' }}>{sc.remarks || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button className="btn-secondary" onClick={() => onEdit(sc)} style={{ padding: '4px 8px', fontSize: 11 }}>
                          Edit
                        </button>
                        <button className="btn-secondary" onClick={() => onDelete(sc)} style={{ padding: '4px 8px', fontSize: 11, color: '#dc2626' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="vu-empty-state">
          <div className="vu-empty-icon"><BarChart3 size={28} /></div>
          <h3>No assessment records found</h3>
          <p>Record your class's mid-terms, unit tests, or lab practicals.</p>
          <button className="btn-primary" onClick={onAdd}>
            Record Assessment
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENT: TIMETABLE VIEW
// =============================================================================
function TimetableView({ department, onLaunchAttendance }) {
  const schedule = [
    { period: '1', time: '08:30 — 09:20 AM', code: 'CS301', subject: 'Design & Analysis of Algorithms', room: 'N-Block 304', faculty: 'Dr. K. Bhavani' },
    { period: '2', time: '09:20 — 10:10 AM', code: 'CS302', subject: 'Database Management Systems', room: 'N-Block 304', faculty: 'Prof. S. R. Murthy' },
    { period: 'Break', time: '10:10 — 10:25 AM', code: '—', subject: 'Tea Break & Discussion', room: 'Campus Lawn', faculty: '—' },
    { period: '3', time: '10:25 — 11:15 AM', code: 'CS303', subject: 'Operating Systems & System Calls', room: 'N-Block 304', faculty: 'Dr. P. Swaroop' },
    { period: '4', time: '11:15 — 12:05 PM', code: 'CS304', subject: 'Computer Networks & Protocols', room: 'N-Block 304', faculty: 'Dr. K. Bhavani' },
    { period: 'Lunch', time: '12:05 — 01:15 PM', code: '—', subject: 'Lunch & Student Proctoring Hour', room: 'Faculty Lounge', faculty: '—' },
    { period: '5 & 6', time: '01:15 — 03:45 PM', code: 'CS305', subject: 'Full-Stack Web Development Lab', room: 'Computing Lab 4 (A-Block)', faculty: 'Dr. K. Bhavani & Team' },
  ];

  return (
    <div className="vu-panel">
      <div className="vu-panel-header">
        <div className="vu-panel-title">
          <span className="vu-panel-kicker">VIGNAN UNIVERSITY MASTER TIMETABLE</span>
          <h2>Weekly Lecture Schedule · {department}</h2>
        </div>
        <span className="vu-badge-pill"><CalendarDays size={13} /> AY {academicYear}</span>
      </div>

      <div className="vu-table-scroll">
        <table className="vu-attendance-table">
          <thead>
            <tr>
              <th>SLOT</th>
              <th>TIME</th>
              <th>COURSE CODE</th>
              <th>SUBJECT / LAB MODULE</th>
              <th>VENUE / ROOM</th>
              <th>FACULTY</th>
              <th style={{ textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, i) => (
              <tr key={i} style={{ background: row.code === '—' ? '#f8fafc' : undefined }}>
                <td><b style={{ color: '#0f2b5c' }}>{row.period}</b></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>{row.time}</td>
                <td><span className="vu-roll-tag">{row.code}</span></td>
                <td><b style={{ color: row.code === '—' ? '#64748b' : '#0f172a' }}>{row.subject}</b></td>
                <td>{row.room}</td>
                <td>{row.faculty}</td>
                <td style={{ textAlign: 'right' }}>
                  {row.code !== '—' && (
                    <button
                      className="btn-primary"
                      onClick={() => onLaunchAttendance(row.period.charAt(0), row.code)}
                      style={{ padding: '5px 10px', fontSize: 11 }}
                    >
                      <ScanLine size={13} /> Take Attendance
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
