import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/atoms/Card';
import meditationsData from '../data/meditations.json';
import { ArrowLeft, Save, Printer } from 'lucide-react';

export default function QTWrite() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [meditations, setMeditations] = useState(meditationsData);

    // Single consolidated content
    const [content, setContent] = useState('');
    const [title, setTitle] = useState(''); // Just for display reference or verse
    const [date, setDate] = useState('');

    useEffect(() => {
        if (id) {
            const entry = meditations.find(m => m.id === parseInt(id));
            if (entry) {
                // Combine existing fields if content is not already set separately
                // Assuming legacy data has separate fields, we combine them for display in the new single field
                const combinedContent = entry.content || (
                    `[관찰]\n${entry.observation || ''} \n\n[해석]\n${entry.interpretation || ''} \n\n[적용]\n${entry.application || ''} `
                ).trim();

                setContent(combinedContent);
                setTitle(entry.verse || `Meditation #${entry.id} `);
                setDate(entry.date || new Date().toISOString().split('T')[0]);
            }
        } else {
            // New Entry
            setDate(new Date().toISOString().split('T')[0]);

            // Check for pre-passed daily verse
            if (location.state?.dailyVerse) {
                const { reference, text } = location.state.dailyVerse;
                const preFilledContent = `[오늘의 말씀] ${reference}\n"${text}"\n\n[관찰]\n\n\n[해석]\n\n\n[적용]\n`;
                setContent(preFilledContent);
                setTitle(reference);
            }
        }
    }, [id, meditations, location.state]);

    const handleSubmit = () => {
        console.log("Saved content:", content);
        alert("묵상이 저장되었습니다.");
        navigate('/qt'); // Go back to list
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6 pb-20 animate-fade-in max-w-2xl mx-auto">
            <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/qt')} className="p-2 -ml-2 text-stone-400 hover:text-stone-800 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-stone-800">
                            {id ? '묵상 수정' : '새 묵상 쓰기'}
                        </h2>
                        <p className="text-stone-500 text-sm">{id ? title : '오늘의 묵상을 기록하세요'}</p>
                    </div>
                </div>
                <button
                    onClick={handlePrint}
                    className="p-2 text-stone-400 hover:text-primary transition-colors"
                    title="PDF로 저장"
                >
                    <Printer size={24} />
                </button>
            </header>

            <Card className="p-0 overflow-hidden border-stone-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all relative min-h-[500px]">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full min-h-[500px] p-6 resize-none focus:outline-none text-stone-700 leading-relaxed bg-transparent"
                    placeholder="[묵상 가이드]&#13;&#10;1. 관찰: 본문에서 무엇을 보았나요?&#13;&#10;2. 해석: 하나님은 어떤 분이신가요?&#13;&#10;3. 적용: 구체적으로 어떻게 실천할까요?"
                />
            </Card>

            <button
                onClick={handleSubmit}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
            >
                <Save size={20} />
                <span>저장하기</span>
            </button>

            {/* Print View (Hidden on Screen) */}
            <div className="hidden print-content">
                <h1 className="print-title">{title || '나의 묵상'}</h1>
                <div className="print-date">{date}</div>
                <div className="print-body">
                    {content}
                </div>
            </div>
        </div>
    );
}
