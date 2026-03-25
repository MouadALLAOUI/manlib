import { Outlet, useLocation, Link } from "react-router-dom";
import { HeaderComponent } from "../components/template/header/header";
import { ProtectedRoute } from "../routes/protectedRoute";
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
        <ProtectedRoute indexPath="/dash" role={role}>
            <div className="min-h-screen flex flex-col">
                <HeaderComponent />
                <div className="relative flex-1 m-5 mx-auto bg-white rounded-lg shadow-md p-5 min-w-[90%]">
                    <div className="breadcrumb mb-5 p-2 w-full rounded-md bg-gray-200">
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
        </ProtectedRoute>
    );
};

export default HeaderPages;