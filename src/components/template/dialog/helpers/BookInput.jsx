import { cn } from "../../../../lib/utils";
import { Input } from "../../../ui/input";

const BookInput = ({ label, value, onChange, isView }) => {
    const isActive = Number(value) > 0;
    return (
        <div className={cn(
            "flex items-center justify-between p-3 rounded-xl border transition-all duration-200 shadow-sm hover:border-slate-300",
            isActive
                ? "bg-slate-700 text-white border-slate-700"
                : "bg-white text-black border-slate-200"
        )}>
            <span className={cn(
                "text-sm font-bold truncate mr-4",
                isActive ? "text-white" : "text-slate-700"
            )}>
                {label}
            </span>
            <div className="flex items-center gap-2">
                <span className={cn(
                    "text-[10px] font-black uppercase tracking-wider",
                    isActive ? "text-slate-300" : "text-slate-400"
                )}>
                    QTE
                </span>
                <Input
                    type="number"
                    min="0"
                    disabled={isView}
                    value={value || ""}
                    className={cn(
                        "w-20 h-9 text-center rounded-lg focus:ring-slate-900",
                        isActive
                            ? "bg-slate-800 border-slate-600 text-white"
                            : "bg-slate-50 border-slate-200"
                    )}
                    placeholder="qte"
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                />
            </div>
        </div>
    );
};

export default BookInput;