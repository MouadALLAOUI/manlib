const UDSection = ({ label }) => {
    return (
        <div className="col-span-2 mt-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                {label}
            </h3>
        </div>
    )
}

export default UDSection;