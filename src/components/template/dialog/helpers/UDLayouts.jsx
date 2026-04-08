import { Button } from "../../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";

const UDLayouts = ({
    open,
    onOpenChange,
    trigger,
    onSubmit,
    mode = "add",
    config = {},
    isView,
    isInvalid,
    children
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[900px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="bg-slate-900 p-8 text-white">
                    <DialogTitle className="text-2xl font-black uppercase">
                        {config.title?.[mode] || "Détails"}
                    </DialogTitle>
                    {config.subtitle?.[mode] && <p className="text-slate-400 text-sm mt-1">{config.subtitle[mode]}</p>}
                </DialogHeader>
                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
                <DialogFooter className="p-8 bg-slate-50 border-t flex gap-3">
                    <DialogClose asChild>
                        <Button variant="outline">{isView ? "Fermer" : "Annuler"}</Button>
                    </DialogClose>
                    {!isView && (
                        <Button onClick={onSubmit} disabled={isInvalid} className="bg-slate-900 text-white">
                            {config.submitLabel || "Valider"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>);
}

export default UDLayouts;