import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/atoms/Card';
import dailyVerseData from '../data/dailyVerse.json';
import initialPrayers from '../data/prayers.json';
import meditations from '../data/meditations.json';
import { getBibleVerse } from '../services/bibleService';
import { RefreshCw, Edit2, PenTool } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();
    const [dailyVerse, setDailyVerse] = useState(dailyVerseData);
    const [isEditingVerse, setIsEditingVerse] = useState(false);
    const [verseRefInput, setVerseRefInput] = useState(dailyVerse.reference);
    const [isLoadingVerse, setIsLoadingVerse] = useState(false);

    const urgentPrayers = initialPrayers.filter(p => p.status === 'praying');

    const handleFetchVerse = async () => {
        if (!verseRefInput.trim()) return;
        setIsLoadingVerse(true);
        const text = await getBibleVerse(verseRefInput);
        setDailyVerse({
            ...dailyVerse,
            reference: verseRefInput,
            text: text
        });
        setIsLoadingVerse(false);
        setIsEditingVerse(false);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Daily Verse */}
            <section>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-stone-800">New Message</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-stone-400 text-sm">{dailyVerse.date}</span>
                        <button onClick={() => setIsEditingVerse(!isEditingVerse)} className="text-stone-300 hover:text-primary">
                            <Edit2 size={14} />
                        </button>
                    </div>
                </div>

                {isEditingVerse && (
                    <div className="mb-4 flex gap-2 animate-fade-in-down">
                        <input
                            type="text"
                            value={verseRefInput}
                            onChange={(e) => setVerseRefInput(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-primary"
                            placeholder="예: 요한복음 3:16"
                        />
                        <button
                            onClick={handleFetchVerse}
                            disabled={isLoadingVerse}
                            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {isLoadingVerse ? <RefreshCw size={14} className="animate-spin" /> : '변경'}
                        </button>
                    </div>
                )}

                <Card className="bg-gradient-to-br from-primary/5 to-white border-primary/20">
                    <p className="font-serif text-xl leading-relaxed text-stone-800 mb-6 word-keep-all break-keep">
                        "{dailyVerse.text}"
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="text-primary font-medium text-sm">오늘의 말씀</span>
                        <p className="text-stone-500 font-serif italic">- {dailyVerse.reference}</p>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-primary/10 pt-4">
                        <button
                            onClick={() => navigate('/qt/new')}
                            className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors"
                        >
                            <PenTool size={18} />
                            <span>묵상하기</span>
                        </button>
                    </div>
                </Card>
            </section>

            {/* Urgent Prayers */}
            <section>
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold text-stone-800">Prayer List</h3>
                    <span className="text-xs text-stone-400">함께 기도해주세요</span>
                </div>
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x">
                    {urgentPrayers.map(prayer => (
                        <div key={prayer.id} className="min-w-[260px] snap-center">
                            <Card
                                onClick={() => navigate(`/prayers?focusId=${prayer.id}`)}
                                className="h-full bg-white hover:border-primary/30 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                                    <span className="text-xs text-red-400 font-medium">Praying</span>
                                </div>
                                <h4 className="font-bold text-stone-800 mb-1">{prayer.title}</h4>
                                <p className="text-stone-500 text-sm line-clamp-2 break-keep">{prayer.description}</p>
                            </Card>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Meditations */}
            <section>
                <h3 className="text-lg font-bold text-stone-800 mb-4">My Diary</h3>
                <div className="space-y-4">
                    {meditations.slice(0, 2).map(item => (
                        <Card
                            key={item.id}
                            onClick={() => navigate(`/qt/${item.id}`)}
                            className="group hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex flex-col">
                                    <span className="text-xs text-stone-400 mb-1">{item.date}</span>
                                    <span className="text-sm font-serif text-stone-800">{item.verse}</span>
                                </div>
                            </div>
                            <p className="text-stone-600 text-sm line-clamp-2 mb-3">{item.content}</p>
                            <div className="pt-3 border-t border-stone-100">
                                <p className="text-xs text-primary font-medium truncate">Applying: {item.application}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
