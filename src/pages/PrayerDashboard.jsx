import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/atoms/Card';
import initialPrayers from '../data/prayers.json';
import initialCategories from '../data/categories.json';
import { Search, Plus, Trash2, Download, FileText, CheckCircle2, Circle, X } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// You might need a font for Korean support in jsPDF. 
// Note: For this prototype, standard fonts might not support Korean. 
// A real app would need a custom font loaded into jsPDF.
// I will simulate the PDF export logic assuming a font is available or fall back to standard.

export default function PrayerDashboard() {
    const [prayers, setPrayers] = useState(initialPrayers);
    const [categories, setCategories] = useState(initialCategories);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams] = useSearchParams();

    // Modal States
    const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingPrayer, setEditingPrayer] = useState(null);

    // Form States
    const [prayerForm, setPrayerForm] = useState({
        title: '', description: '', categoryId: '', notes: '', answerNote: '', createdAt: ''
    });

    useEffect(() => {
        const focusId = searchParams.get('focusId');
        if (focusId) {
            const prayer = prayers.find(p => p.id === parseInt(focusId));
            if (prayer) {
                openPrayerModal(prayer);
            }
        }
    }, [searchParams]);
    const [newCategoryName, setNewCategoryName] = useState('');

    // --- Helpers ---
    const getCategoryName = (id) => categories.find(c => c.id === id)?.name || '기타';

    // --- CRUD Logic ---
    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        const newCat = { id: `cat${Date.now()}`, name: newCategoryName };
        setCategories([...categories, newCat]);
        setNewCategoryName('');
        setIsCategoryModalOpen(false);
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('정말 삭제하시겠습니까? 연결된 기도는 삭제되지 않습니다.')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    const handleSavePrayer = () => {
        if (!prayerForm.title || !prayerForm.categoryId) {
            alert("제목과 카테고리는 필수입니다.");
            return;
        }

        if (editingPrayer) {
            setPrayers(prayers.map(p => p.id === editingPrayer.id ? { ...editingPrayer, ...prayerForm } : p));
        } else {
            const newPrayer = {
                id: Date.now(),
                ...prayerForm,
                status: 'praying',
                createdAt: prayerForm.createdAt || new Date().toISOString().split('T')[0],
                answeredAt: null
            };
            setPrayers([newPrayer, ...prayers]);
        }
        closePrayerModal();
    };

    const handleDeletePrayer = (id) => {
        if (window.confirm("기도 제목을 삭제하시겠습니까?")) {
            setPrayers(prayers.filter(p => p.id !== id));
        }
    }

    const openPrayerModal = (prayer = null) => {
        if (prayer) {
            setEditingPrayer(prayer);
            setPrayerForm({
                title: prayer.title,
                description: prayer.description,
                categoryId: prayer.categoryId,
                notes: prayer.notes || '',
                answerNote: prayer.answerNote || '',
                createdAt: prayer.createdAt
            });
        } else {
            setEditingPrayer(null);
            setPrayerForm({
                title: '', description: '', categoryId: categories[0]?.id || '',
                notes: '', answerNote: '', createdAt: new Date().toISOString().split('T')[0]
            });
        }
        setIsPrayerModalOpen(true);
    };

    const closePrayerModal = () => {
        setIsPrayerModalOpen(false);
        setEditingPrayer(null);
    }

    const toggleStatus = (prayer) => {
        const newStatus = prayer.status === 'praying' ? 'answered' : 'praying';
        const updatedPrayer = {
            ...prayer,
            status: newStatus,
            answeredAt: newStatus === 'answered' ? new Date().toISOString().split('T')[0] : null
        };
        setPrayers(prayers.map(p => p.id === prayer.id ? updatedPrayer : p));
    };

    // --- Filtering ---
    const filteredPrayers = prayers.filter(p => {
        const matchesCategory = filterCategory === 'all' || p.categoryId === filterCategory;
        const matchesSearch = p.title.includes(searchTerm) || p.description.includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    // --- PDF Export ---
    const exportPDF = () => {
        const doc = new jsPDF();

        // Note: Korean characters won't render correctly without a custom font registration.
        // Use English for headers/structure or warn user.
        // For this prototype, we'll try to just dump the text and see (likely broken for KR).
        // Ideally, we'd add addFileToVFS for a font like Malgun Gothic.

        doc.setFontSize(18);
        doc.text("Prayer List", 14, 22);

        const tableData = filteredPrayers.map(p => [
            p.createdAt,
            getCategoryName(p.categoryId),
            p.title,
            p.status,
            p.status === 'answered' ? p.answerNote : p.notes
        ]);

        doc.autoTable({
            head: [['Date', 'Category', 'Title', 'Status', 'Notes']],
            body: tableData,
            startY: 30,
            styles: { font: "helvetica" }, // Fallback
        });

        doc.save(`prayer-list-${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    return (
        <div className="space-y-6 pb-20 animate-fade-in relative h-full">
            {/* Header & Controls */}
            <header className="flex flex-col gap-4 sticky top-0 bg-background z-10 pt-4 pb-2 border-b border-stone-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-stone-800">Prayer List</h2>
                        <p className="text-stone-500 text-sm">총 {filteredPrayers.length}개의 기도제목</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsCategoryModalOpen(true)} className="p-2 text-stone-500 hover:text-primary hover:bg-stone-100 rounded-full transition-colors" title="카테고리 관리">
                            <FileText size={20} />
                        </button>
                        <button onClick={exportPDF} className="p-2 text-stone-500 hover:text-primary hover:bg-stone-100 rounded-full transition-colors" title="PDF 저장">
                            <Download size={20} />
                        </button>
                        <button onClick={() => openPrayerModal()} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                            <Plus size={18} />
                            <span>기도 추가</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                            type="text"
                            placeholder="기도제목 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary/50 text-sm"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <button
                            onClick={() => setFilterCategory('all')}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filterCategory === 'all' ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}
                        >
                            전체
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilterCategory(cat.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filterCategory === cat.id ? 'bg-primary text-white' : 'bg-white border border-stone-200 text-stone-600'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* List View */}
            <div className="grid gap-2">
                {filteredPrayers.length === 0 ? (
                    <div className="text-center py-20 text-stone-400">
                        등록된 기도제목이 없습니다.
                    </div>
                ) : (
                    filteredPrayers.map(prayer => (
                        <div key={prayer.id} className="bg-white rounded-xl p-3 border border-stone-100 hover:shadow-sm transition-all flex gap-3 group items-start">
                            <button
                                onClick={() => toggleStatus(prayer)}
                                className={`mt-0.5 flex-shrink-0 transition-colors ${prayer.status === 'answered' ? 'text-green-500' : 'text-stone-300 group-hover:text-stone-400'}`}
                            >
                                {prayer.status === 'answered' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                            </button>

                            <div className="flex-1 cursor-pointer min-w-0" onClick={() => openPrayerModal(prayer)}>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded flex-shrink-0">
                                        {getCategoryName(prayer.categoryId)}
                                    </span>
                                    <span className="text-[10px] text-stone-400 flex-shrink-0">
                                        {prayer.createdAt}
                                        {prayer.answeredAt && ` ~ ${prayer.answeredAt}`}
                                    </span>
                                    {prayer.status === 'answered' && (
                                        <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-bold flex-shrink-0">
                                            응답
                                        </span>
                                    )}
                                </div>
                                <h3 className={`font-bold text-stone-800 text-sm mb-0.5 truncate ${prayer.status === 'answered' ? 'line-through text-stone-400' : ''}`}>
                                    {prayer.title}
                                </h3>
                                <p className="text-xs text-stone-500 truncate mb-1">{prayer.description}</p>

                                {/* Detailed Notes Preview */}
                                {prayer.status === 'praying' && prayer.notes && (
                                    <div className="text-[10px] bg-yellow-50 text-yellow-700 px-2 py-1 rounded truncate">
                                        ⚡ {prayer.notes}
                                    </div>
                                )}
                                {prayer.status === 'answered' && prayer.answerNote && (
                                    <div className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded truncate">
                                        🎉 {prayer.answerNote}
                                    </div>
                                )}
                            </div>

                            <button onClick={(e) => { e.stopPropagation(); handleDeletePrayer(prayer.id); }} className="text-stone-300 hover:text-red-400 self-start opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Prayer Edit Modal */}
            {isPrayerModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-stone-800">{editingPrayer ? '기도제목 수정' : '새 기도제목'}</h3>
                            <button onClick={closePrayerModal}><X size={24} className="text-stone-400" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1">기도 시작일</label>
                                <input
                                    type="date"
                                    value={prayerForm.createdAt}
                                    onChange={e => setPrayerForm({ ...prayerForm, createdAt: e.target.value })}
                                    className="w-full p-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1">카테고리</label>
                                <select
                                    value={prayerForm.categoryId}
                                    onChange={e => setPrayerForm({ ...prayerForm, categoryId: e.target.value })}
                                    className="w-full p-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                                >
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1">제목</label>
                                <input
                                    type="text"
                                    value={prayerForm.title}
                                    onChange={e => setPrayerForm({ ...prayerForm, title: e.target.value })}
                                    className="w-full p-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                                    placeholder="기도 제목을 입력하세요"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1">상세 내용</label>
                                <textarea
                                    value={prayerForm.description}
                                    onChange={e => setPrayerForm({ ...prayerForm, description: e.target.value })}
                                    className="w-full p-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm h-24 resize-none"
                                    placeholder="구체적인 내용을 기록하세요"
                                />
                            </div>

                            <div className="pt-4 border-t border-stone-100">
                                <label className="block text-xs font-bold text-stone-500 mb-2">진행 상황 노트 (Ongoing)</label>
                                <textarea
                                    value={prayerForm.notes}
                                    onChange={e => setPrayerForm({ ...prayerForm, notes: e.target.value })}
                                    className="w-full p-3 bg-yellow-50/50 rounded-xl border border-yellow-100 focus:ring-2 focus:ring-yellow-200 text-sm h-16 resize-none"
                                    placeholder="기도 중 변화된 상황이나 마음을 기록하세요"
                                />
                            </div>

                            {editingPrayer && editingPrayer.status === 'answered' && (
                                <div className="pt-2">
                                    <label className="block text-xs font-bold text-green-600 mb-2">응답 간증 (Answered)</label>
                                    <textarea
                                        value={prayerForm.answerNote}
                                        onChange={e => setPrayerForm({ ...prayerForm, answerNote: e.target.value })}
                                        className="w-full p-3 bg-green-50/50 rounded-xl border border-green-100 focus:ring-2 focus:ring-green-200 text-sm h-20 resize-none"
                                        placeholder="어떻게 응답해 주셨나요?"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleSavePrayer}
                                className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 mt-4"
                            >
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-stone-800">카테고리 관리</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)}><X size={24} className="text-stone-400" /></button>
                        </div>

                        <div className="space-y-4 mb-6">
                            {categories.map(cat => (
                                <div key={cat.id} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                                    <span className="font-medium text-stone-700">{cat.name}</span>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-stone-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                placeholder="새 카테고리 이름"
                                className="flex-1 p-3 bg-stone-50 rounded-xl border focus:border-primary focus:outline-none text-sm"
                            />
                            <button
                                onClick={handleAddCategory}
                                className="bg-stone-800 text-white p-3 rounded-xl disabled:opacity-50"
                                disabled={!newCategoryName.trim()}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
