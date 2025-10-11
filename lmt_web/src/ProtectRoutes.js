// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { sendGet} from './utils';
export default async function ProtectedRoute({ children}) {
    let isLoggedIn=await sendGet(`${process.env.REACT_APP_API_URL}/login/status`,(res)=>res)
    console.log(isLoggedIn)
  if (!isLoggedIn) {
    // 沒登入 → 跳轉到 login
    return <Navigate to="/login" replace />;
  }
  return <Navigate to="/login" replace />;; // 已登入，渲染子元件
}
