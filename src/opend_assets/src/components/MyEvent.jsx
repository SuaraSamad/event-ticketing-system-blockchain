import React, { useEffect, useState } from "react";
import { opend } from "../../../declarations/opend"; // corrected import
import { Principal } from "@dfinity/principal";

function MyEvent() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const myEvents = await opend.getMyEvents(); // updated to match backend
        setEvents(myEvents);
      } catch (err) {
        console.error("Failed to load events:", err);
      }
    }

    loadEvents();
  }, []);

  async function handleListTickets(eventId) {
    // Placeholder for ticket listing
    console.log(`List tickets for ${eventId}`);
    console.log(events);
    await opend.listEvent(eventId);
  }

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">My Events</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {events.map(event => (
              <div
                key={event.id}
                className="disGrid-root disGrid-item disGrid-grid-xs-3"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  margin: "1rem",
                //   backgroundColor: "#f9f9f9",
                }}
              >
                <h4>{event.name}</h4>
                <p><strong>Description:</strong> {event.description}</p>
                <p><strong>Owner:</strong> {event.owner.toText()}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Tickets Available:</strong> {event.total_ticket.toString()}</p>
                <p><strong>Price:</strong> {event.price.toString()} ICP</p>
                <button onClick={() => handleListTickets(event.id)}>List Tickets</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyEvent;
