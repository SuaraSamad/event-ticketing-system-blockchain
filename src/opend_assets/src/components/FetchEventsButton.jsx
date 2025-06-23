import React from "react";
import { opend } from "../../../declarations/opend";

function FetchEventsButton() {
  async function fetchEvents() {
    try {
      const events = await opend.getAllEvents();
      console.log("All Events:", events);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }

  return (
    <button onClick={fetchEvents}>
      Fetch All Events
    </button>
  );
}

export default FetchEventsButton;