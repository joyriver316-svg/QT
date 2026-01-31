import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/atoms/Card';
import meditations from '../data/meditations.json';
import { Plus, Calendar, BookOpen, Printer, X, Check } from 'lucide-react';

export default function QTList() {
    const navigate = useNavigate();

    // Export States
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [exportYear, setExportYear] = useState('all');
    const [exportMonth, setExportMonth] = useState('all');

    // Sort by date desc
    const sortedMeditations = [...meditations].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Derived Data for Filters
    const availableYears = [...new Set(meditations.map(m => m.date.split('-')[0]))].sort().reverse();
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

    // Printing Logic
    const handlePrintClick = () => {
        setIsExportModalOpen(true);
    };

    const handleConfirmPrint = () => {
        setIsExportModalOpen(false);
        // Delay slightly to allow the modal to close and state to settle before printing? 
        // Actually, the hidden print content updates immediately with state.
        setTimeout(() => window.print(), 100);
    };

    // Filtered data for printing
    const printMeditations = sortedMeditations.filter(item => {
        if (exportYear === 'all') return true;
        const [year, month] = item.date.split('-');
        if (year !== exportYear) return false;
        if (exportMonth === 'all') return true;
        return month === exportMonth;
    });

    return (
        <div className="space-y-6 pb-20 animate-fade-in relative">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-stone-800">My QT Diary</h2>
                    <p className="text-stone-500">매일의 은혜를 기록합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrintClick}
                        className="p-2 text-stone-400 hover:text-primary transition-colors bg-white border border-stone-200 rounded-xl shadow-sm hover:shadow"
                        title="PDF로 내보내기"
                    >
                        <Printer size={20} />
                    </button>
                    <button
                        onClick={() => navigate('/qt/new')}
                        className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20"
                    >
                        <Plus size={18} />
                        <span>새로 쓰기</span>
                    </button>
                </div>
            </header>

            {/* Main List */}
            <div className="grid gap-4">
                {sortedMeditations.length === 0 ? (
                    <div className="text-center py-20 text-stone-400">
                        작성된 묵상이 없습니다.
                    </div>
                ) : (
                    sortedMeditations.map(item => (
                        <Card
                            key={item.id}
                            onClick={() => navigate(`/qt/${item.id}`)}
                            className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-stone-100 p-2 rounded-full text-stone-500 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                        <BookOpen size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-stone-800">{item.verse}</h3>
                                        <div className="flex items-center gap-1 text-xs text-stone-400">
                                            <Calendar size={12} />
                                            <span>{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-stone-600 text-sm line-clamp-2 mt-2 pl-12 border-l-2 border-stone-100 group-hover:border-primary/30 transition-colors">
                                {item.content}
                            </p>
                        </Card>
                    ))
                )}
            </div>

            {/* Export Options Modal */}
            {isExportModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in no-print">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                <Printer size={20} />
                                PDF 내보내기 설정
                            </h3>
                            <button onClick={() => setIsExportModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-stone-600 mb-2">무엇을 인쇄할까요?</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => { setExportYear('all'); setExportMonth('all'); }}
                                        className={`p-3 rounded-xl border text-sm font-bold transition-all ${exportYear === 'all' ? 'bg-primary text-white border-primary' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                                    >
                                        전체 기록
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (exportYear === 'all') setExportYear(availableYears[0] || new Date().getFullYear().toString());
                                        }}
                                        className={`p-3 rounded-xl border text-sm font-bold transition-all ${exportYear !== 'all' ? 'bg-primary text-white border-primary' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                                    >
                                        기간 선택
                                    </button>
                                </div>
                            </div>

                            {/* Date Selectors */}
                            {exportYear !== 'all' && (
                                <div className="animate-fade-in-down bg-stone-50 p-4 rounded-xl space-y-3">
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-stone-500 mb-1">연도 (Year)</label>
                                            <select
                                                value={exportYear}
                                                onChange={(e) => setExportYear(e.target.value)}
                                                className="w-full p-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-primary"
                                            >
                                                {availableYears.map(y => <option key={y} value={y}>{y}년</option>)}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-stone-500 mb-1">월 (Month)</label>
                                            <select
                                                value={exportMonth}
                                                onChange={(e) => setExportMonth(e.target.value)}
                                                className="w-full p-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-primary"
                                            >
                                                <option value="all">전체 (1~12월)</option>
                                                {months.map(m => <option key={m} value={m}>{parseInt(m)}월</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-stone-50 p-4 rounded-xl text-center">
                                <p className="text-stone-500 text-sm mb-1">출력 대상</p>
                                <p className="text-xl font-bold text-primary">
                                    총 {printMeditations.length}개의 묵상
                                </p>
                            </div>

                            <button
                                onClick={handleConfirmPrint}
                                disabled={printMeditations.length === 0}
                                className="w-full py-4 bg-stone-800 text-white rounded-2xl font-bold shadow-lg shadow-stone-200 hover:bg-stone-700 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                <Check size={20} />
                                <span>인쇄하기 (저장)</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print View (Hidden on Screen) */}
            <div className="hidden print-content">
                <div className="text-center mb-10 pb-10 border-b-2 border-stone-100 page-break">
                    <h1 className="text-4xl font-serif font-bold text-stone-800 mb-4">묵상 일기</h1>
                    <p className="text-stone-500 italic">
                        {exportYear === 'all' ? '전체 기록' : `${exportYear}년 ${exportMonth === 'all' ? '' : `${parseInt(exportMonth)}월`}의 기록`}
                    </p>
                </div>

                {printMeditations.length > 0 ? (
                    printMeditations.map((item, idx) => (
                        <div key={item.id} className="page-break mb-10">
                            <h2 className="print-title">{item.verse}</h2>
                            <div className="print-date">{item.date}</div>
                            <div className="print-body">
                                {item.content || `[관찰]\n${item.observation || ''}\n\n[해석]\n${item.interpretation || ''}\n\n[적용]\n${item.application || ''}`}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 text-stone-400 italic">
                        선택한 기간에 작성된 기록이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
