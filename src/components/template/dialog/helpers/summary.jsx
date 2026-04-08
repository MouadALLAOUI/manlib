const UDSummary = ({
    hedears = ["Désignation", "Qté"],
    data = [],
    key
}) => {
    return (

        <div key={`sum-${key}`} className="col-span-full mt-8 animate-in fade-in slide-in-from-top-2">
            <div className="border border-amber-200 rounded-xl overflow-hidden shadow-sm max-w-lg mx-auto">
                <div className="grid grid-cols-4 bg-amber-400 font-bold text-[10px] uppercase p-3">
                    <div className="col-span-3">{hedears[0]}</div>
                    <div className="text-center">{hedears[1]}</div>
                </div>
                {data.map((row, i) => (
                    <div key={i} className="grid grid-cols-4 text-xs p-3 border-t border-amber-100 bg-amber-50/50">
                        <div className="col-span-3 text-slate-700">{row.label}</div>
                        <div className="text-center font-black text-slate-900">{row.qte}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UDSummary;