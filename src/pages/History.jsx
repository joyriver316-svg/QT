import React from 'react';
import Card from '../components/atoms/Card';
import initialPrayers from '../data/prayers.json';
import { Search } from 'lucide-react';

export default function History() {
    const answeredPrayers = initialPrayers.filter(p => p.status === 'answered');

    return (
        <div className="space-y-6 pb-20 animate-fade-in">
            <header>
                <h2 className="text-2xl font-bold text-stone-800">Ebenezer</h2>
                <p className="text-stone-500">여기까지 인도하신 하나님.</p>
            </header>

            {/* Search Bar (Visual) */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="응답받은 기도를 검색해보세요"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl text-stone-700 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-stone-300"
                />
            </div>

            {/* Timeline */}
            <div className="relative pl-8 border-l-2 border-stone-100 space-y-8 py-2 ml-3">
                {answeredPrayers.map((prayer, idx) => (
                    <div key={prayer.id} className="relative">
                        {/* Time Marker */}
                        <div className="absolute -left-[43px] top-6 w-4 h-4 rounded-full bg-secondary ring-4 ring-secondary/20"></div>

                        <Card className="hover:shadow-md transition-shadow">
                            <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded mb-2 inline-block">
                                {prayer.answeredAt}
                            </span>
                            <h3 className="font-bold text-stone-800 mb-2 text-lg">{prayer.title}</h3>
                            <p className="text-stone-600 text-sm bg-stone-50 p-3 rounded-xl italic border border-stone-100">
                                "{prayer.description}"
                            </p>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
