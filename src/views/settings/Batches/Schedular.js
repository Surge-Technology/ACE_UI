import React, { useState, useEffect, useMemo } from 'react';
import Calendar from "react-big-calendar";
import moment from "moment";
import Swal from 'sweetalert2';
import "react-big-calendar/lib/css/react-big-calendar.css";
moment.locale("en-GB");
Calendar.momentLocalizer(moment);
export const navigateContants = {
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY',
  DATE: 'DATE'
};
const CustomToolbar = (props) => {
  function navigate(action) {
    props.onNavigate(action);
  }
  function viewItem(view) {
    props.onViewChange(view);
  }
  function viewNamesGroup(messages) {
    const viewNames = props.views;
    const view = props.view;
    if (viewNames.length > 1) {
      return viewNames.map((name) => (
        <button
          type="button"
          key={name}
          onClick={viewItem.bind(null, name)}>
          {messages[name]}
        </button>
      ));
    }
  }
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={navigate.bind(null, navigateContants.PREVIOUS)}>
          Prev
        </button>
        <button type="button" onClick={navigate.bind(null, navigateContants.TODAY)}>
          Today
        </button>
        <button type="button" onClick={navigate.bind(null, navigateContants.NEXT)}>
          Next
        </button>
      </span>
      <span className="rbc-toolbar-label">{props.label}</span>
      <span className="rbc-btn-group">{viewNamesGroup(props.messages)}</span>
    </div>
  );
};
const Schedular = (props) => {
  const { views, ...otherProps } = useMemo(() => ({
    views: {
      week: true
    }
  }), [])
  const [time, setTime] = useState([]);
  const [selected, setSelected] = useState();
  const handleSelected = (event) => {
    setSelected(event);
    Swal.fire({
      title: `<strong>${event.title}</strong>`,
      html:
        `<b>Start Date & Time:</b>\n ${moment(event.start.toString()).format('MMMM Do YYYY, h:mm a')} <br/>
      <b>End Date & Time:</b>\n${moment(event.end.toString()).format('MMMM Do YYYY, h:mm a')}`,
      customClass: {
        title: 'title-class',
        content: 'content-class',
      }
    })
  };
  useEffect(() => {
    if (props.events) {
      setTime(props.events)
    }
  }, [props.events, setTime]);
  return (
    <>
      <Calendar
        events={time}
        views={['week', 'day']}
        defaultDate={new Date()}
        defaultView='week'
        components={{
          toolbar: CustomToolbar,
        }}
        selected={selected}
        onSelectEvent={handleSelected}
        showMultiDayTimes={true}
        min={new Date(0, 0, 0, 6, 0, 0)}
        max={new Date(0, 0, 0, 23, 30, 0)}
      />
    </>
  )
}
export default Schedular;