import React, { useState, useRef } from "react";
import { ArrowBigDown, Menu, X } from "lucide-react";

export const HeaderComponent = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const timeoutRef = useRef(null);

    const menuItems = [
        { label: "ACCUEIL", href: "/dash", isTrigger: false },
        {
            label: "LIVRES", isTrigger: true, subItems: [
                { label: "CATEGORIES", href: "/dash/livres/categories" },
                { label: "LIVRES", href: "/dash/livres/livres" },
            ]
        },
        {
            label: "Fournisseurs", isTrigger: true, subItems: [
                { label: "Fournisseurs disponibles", href: "/dash/fournisseurs/Fournisseurs_disponibles" },
                { label: "Saisir un BL", href: "/dash/fournisseurs/Saisir_un_BL" },
                { label: "Remboursement", href: "/dash/fournisseurs/Remboursement" },
                { label: "Synthèse BL", href: "#" },
                { label: "Synthèse Remboursemnet", href: "#" },
            ]
        },
        {
            label: "Représentant", isTrigger: true, subItems: [
                { label: "Représentants disponibles", href: "/dash/representant/Representants_disponibles" },
                { label: "Saisir un BL", href: "/dash/representant/Saisir_un_BL" },
                { label: "Remboursement", href: "/dash/representant/Remboursement" },
                { label: "Demande de facturation", href: "#" },
                { label: "Factures", href: "#" },
                { label: "Remboursement Factures", href: "#" },
                { label: "Déclaratoin Dépôt", href: "#" },
                { label: "Cahier de texte", href: "#", color: "text-blue-600 bg-blue-100 hover:bg-blue-600 hover:text-white" },
                { label: "Cartes de Visite & Chevalet", href: "#", color: "text-amber-600 bg-amber-100 hover:bg-amber-600 hover:text-white" },
                { label: "synthèse BL", href: "#" },
                { label: "synthèse Remboursement", href: "#" },
            ]
        },
        { label: "ROBOTS", href: "#", isTrigger: false },
        {
            label: "Traçabilité", isTrigger: true, subItems: [
                { label: "clients", href: "#" },
                { label: "BL Clients", href: "#" },
                { label: "Remboursement Client", href: "#" },
                { label: "Synthèse", href: "#" },
            ]
        },
        {
            label: "Synthèses Globales", isTrigger: true, subItems: [
                { label: "Livraison Fournisseurs --> MSM-MEDIAS", href: "#" },
                { label: "Livraison MSM-MEDIAS --> REP", href: "#" },
                { label: "Ventes", href: "#" },
                { label: "Dépôt", href: "#" },
                { label: "Remboursement Fournisseurs", href: "#" },
                { label: "Remboursement REP", href: "#" },
                { label: "Balance", href: "#" },
            ]
        },
        {
            label: "Emailing", isTrigger: true, subItems: [
                { label: "Simple Email", href: "#" },
                { label: "Invitation", href: "#" },
            ]
        },
        {
            label: "Réglages", isTrigger: true, subItems: [
                { label: "Season de travail", href: "#" },
                { label: "Pied de facture", href: "#" },
                { label: "Modèles Cahier de texte", href: "#" },
            ]
        },
        { label: "SAISON : 2026 / 2027", href: "#", isTrigger: false },
        { label: "Déconnexion", href: "/logout", isTrigger: false, color: "text-red-600 bg-red-50 hover:bg-red-600 hover:text-white" },
    ];

    const handleMouseEnter = (label) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpenMenu(label);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setOpenMenu(null), 150);
    };

    return (
        <header className="w-[98%] mx-auto mt-2 bg-white rounded-lg shadow-sm border border-gray-100 sticky top-0 z-50">
            <div className="px-4 h-14 flex items-center justify-between">

                {/* Mobile Toggle */}
                <button className="lg:hidden p-2 text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-1 w-full justify-center">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className="relative"
                            onMouseEnter={() => item.isTrigger && handleMouseEnter(item.label)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {!item.isTrigger ? (
                                <a
                                    href={item.href}
                                    className={`px-3 py-2 text-[13px] font-semibold rounded-md transition-colors whitespace-nowrap 
                                    ${item.color ? item.color : "text-gray-600 hover:bg-gray-100"}`}
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <>
                                    <button className={`flex items-center gap-1 px-3 py-2 text-[13px] font-semibold text-gray-600 rounded-md transition-all ${openMenu === item.label ? 'bg-gray-100 text-violet-700' : 'hover:bg-gray-100'}`}>
                                        {item.label}
                                        <ArrowBigDown size={12} className={`transition-transform duration-300 ${openMenu === item.label ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* GRID SUBMENU */}
                                    {openMenu === item.label && (
                                        <div className={`
                                                    absolute mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 min-w-[500px] 
                                                    animate-in fade-in slide-in-from-top-2 duration-200
                                                    /* Check if the item is near the end of the array to flip alignment */
                                                    ${index > menuItems.length - 4 ? 'right-0' : 'left-0'}
                                                `}>
                                            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                                                {item.subItems?.map((sub, sIdx) => (
                                                    <li key={sIdx}>
                                                        <a href={sub.href} className={`
                                                            block px-3 py-2 text-[13px] text-gray-500 hover:bg-violet-50 hover:text-violet-700 rounded-lg transition-colors ${sub.color ? sub.color : ''}
                                                            `}>
                                                            {sub.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Responsive Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl rounded-b-lg max-h-[80vh] overflow-y-auto">
                    <nav className="p-4 flex flex-col gap-2">
                        {menuItems.map((item, index) => (
                            <div key={index} className="flex flex-col">
                                {!item.isTrigger ? (
                                    <a href={item.href} className={`py-2 px-3 rounded-md text-sm font-bold ${item.color ? item.color : "text-gray-700"}`}>
                                        {item.label}
                                    </a>
                                ) : (
                                    <div className="bg-gray-50 rounded-lg p-3 mt-1">
                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                                        <div className="mt-2 grid grid-cols-1 gap-1">
                                            {item.subItems?.map((sub, sIdx) => (
                                                <a key={sIdx} href={sub.href} className={`text-sm text-gray-600 py-1.5 px-2 hover:bg-white rounded-md ${sub.color ? sub.color : ''}`}>
                                                    {sub.label}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};