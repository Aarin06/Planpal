const DefaultSocket = (connected, connectedInverse, socket, io) => {
  let draggingEventIds = new Set();
  let editEventTimeouts = new Map(); // To store timeouts for events

  socket.on("eventEditStart", (event) => {
    draggingEventIds.add(event);
    
    // Clear any existing timeout for the event
    if (editEventTimeouts.has(event.id)) {
      clearTimeout(editEventTimeouts.get(event.id));
    }

    // Set a timeout to automatically trigger eventEditStop after 5 seconds
    const timeout = setTimeout(() => {
      draggingEventIds.delete(event);
      connected.forEach((con) => {
        if (con.id !== socket.id) {
          con.emit("eventEditStopListener", event); // Emit to all clients except the sender
        }
      });
      editEventTimeouts.delete(event.id); // Remove the timeout entry
    }, 10000);

    editEventTimeouts.set(event.id, timeout);

    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("eventEditStartListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("eventEditStop", (event) => {
    draggingEventIds.delete(event);

    // Clear the timeout when eventEditStop is called
    if (editEventTimeouts.has(event.id)) {
      clearTimeout(editEventTimeouts.get(event.id));
      editEventTimeouts.delete(event.id);
    }

    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("eventEditStopListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("externalEventDrop", (event) => {
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("externalEventDropListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("deleteEvent", (event) => {
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("deleteEventListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("updateEvent", (event) => {
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("updateEventListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("createEvent", (event) => {
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("createEventListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("editEventStart", (event) => {
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("editEventStartListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("closeFormEvent", (event) => {
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("closeFormEventListener", event); // Emit to all clients except the sender
      }
    });
  });
};

export default DefaultSocket;
