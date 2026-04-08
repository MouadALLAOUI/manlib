import { Outlet, useLocation, Link } from "react-router-dom";
import { HeaderComponent } from "../components/template/header/header";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

const HeaderPages = ({ role }) => {
    const location = useLocation();

    // Split the pathname and filter out empty strings
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50/50">
            <HeaderComponent />
            <div className="relative flex-1 m-5 mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-8 min-w-[95%]">
                <div className="breadcrumb mb-8 p-3 w-full rounded-lg bg-slate-100/50 border border-slate-200/50">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {/* Static Home Link */}
                            {pathnames.map((value, index) => {
                                const last = index === pathnames.length - 1;
                                const to = `/${pathnames.slice(0, index + 1).join("/")}`;

                                // Capitalize the label for better UI
                                const label = value.charAt(0).toUpperCase() + value.slice(1);

                                return (
                                    <div key={to} className="flex items-center">
                                        <BreadcrumbItem>
                                            {last ? (
                                                <BreadcrumbPage>{label}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link to={to}>{label}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                    </div>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <Outlet />
            </div>
        </div>
    );
};

export default HeaderPages;
