import {Outlet, useParams} from "react-router-dom"
import UserSidebar from "./components/UserSidebar"
import "./style/UserLayout.css"
import { useState, useEffect } from "react"
function UserLayout() {
    const params = useParams()
    const [classes, setClasses] = useState(["You Currently Have No Classes. Please Add One."])
    const [units, setUnits] = useState(["You Currently Have No Units. Please Create One."])
    const [data, setData] = useState({})
    const [render, triggerRender] = useState(0)
    useEffect(() => {
        const getClasses = async () => {
            const response = await fetch("http://184.64.116.12:3333"+ "/get_courses", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username: params.userID}),
            })
            const classes = await response.json()
            console.log(classes)
            console.log("test")
            if (Object.keys(classes).length == 0) {
                setClasses(["You Currently Have No Classes. Please Add One."])
            }
            else {
                setClasses(Object.keys(classes) || [])
                console.log(Object.keys(classes), "in layout")
                const allUnits = Object.values(classes).flatMap(classObj => Object.values(classObj.units))
                const unitList = allUnits.map(unit => unit.unit_components)
                setUnits(unitList)
                setData(classes)
            }
        }
        
        getClasses()

    }, [render])

    return <div className="user-layout">
        <UserSidebar/>
        <Outlet context={[classes, setClasses, render, triggerRender, units, setUnits]}/>

    </div>

}

export default UserLayout