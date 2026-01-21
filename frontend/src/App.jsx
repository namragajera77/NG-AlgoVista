import {Routes, Route,Navigate } from "react-router"
import Homepage from "./pages/Homepage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import {checkAuth} from "./authSlice"
import { useDispatch,useSelector} from "react-redux"
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel"
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete"
import AdminUpdate from "./components/AdminUpdate"
import AdminVideo from "./components/AdminVideo"
import AdminUpload from "./components/AdminUpload"
import LandingPage from "./pages/LandingPage"

function App(){

    // code likhna isAuthentciated
  const {isAuthenticated,user,loading} =  useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  // console.log(isAuthenticated)
  // console.log(user)


  useEffect(()=>{
   dispatch(checkAuth());
  },[dispatch]);


  return(
  <>
    <Routes>
      <Route path="/" element={isAuthenticated ? <Homepage /> : <LandingPage />}></Route>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />}></Route>
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />}></Route>
        {/* <Route path="/admin" element={<AdminPanel/>}></Route> */}
        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
        <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
       <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />


    </Routes>
  </>
  )
} 

export default App;