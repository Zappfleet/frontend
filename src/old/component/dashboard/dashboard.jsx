import { useEffect } from "react";
import { useRole } from "../../hooks/useRole";
import AdmindDashboard from "./adminDashboard";
import DispatcherDashboard from "./dispatcherDashboard";
import { useNavigate } from "react-router";

const Dashboard = () => {
    const role = useRole();
    const navigate = useNavigate()
    useEffect(()=>{
        if (role === "passenger"){
            navigate('/panel/new/request')
        }
    },[])
    // if (role === 'admin')
        return <AdmindDashboard isDispatcher = {role === 'dispatcher'} />
    // else if (role === 'dispatcher' || role === 'superDispatcher'){
        // return <DispatcherDashboard />
        // can't see why we need a whole other component for dispathcer dashboard??!!
        // return <AdmindDashboard />
    // }
    // else return null;
}
export default Dashboard;