import "../style/Event.css"

function Event({ unit, lesson, startDate, endDate }) {
    return <div className="event-card">
        <div className="event-header">{unit}</div>
        <div className="event-dates">{startDate + " - " + endDate} </div>
        <div className="event-subheader">{lesson}</div>
    </div>

}

export default Event