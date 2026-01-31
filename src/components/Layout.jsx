import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PenTool, Heart, Clock } from 'lucide-react';

const navItems = [
    { path: '/', label: '홈', icon: Home },
    { path: '/qt', label: '묵상작성', icon: PenTool },
    { path: '/prayers', label: '중보기도', icon: Heart },
    { path: '/history', label: '히스토리', icon: Clock },
];

export default function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-background text-stone-800">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 p-6 bg-surface border-r border-stone-200">
                <h1 className="text-2xl font-serif font-bold text-primary mb-10">His Will Diary</h1>
                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-stone-500 hover:bg-stone-50'
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
                <div className="max-w-3xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-stone-200 px-6 py-3 flex justify-between items-center z-50">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-stone-400'
                                }`}
                        >
                            <Icon size={24} />
                            <span className="text-[10px]">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
