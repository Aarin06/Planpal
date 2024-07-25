const DefaultSocket = (connected, connectedInverse, socket, io) => {
  let draggingEventIds = new Set();

  // socket.emit("me", socket.id);
  // connections.push(socket);

  // socket.on("join", (data) => {
  //     connected[data.name] =  socket.id
  //     connectedInverse[socket.id] = data.name
  //     console.log(connected,"here");
  // });

  // socket.on("dragEvent", (data) => {
  //   connections.map((con) => {
  //     if (con.id !== socket.id) {
  //       con.emit("disableEvent", data);
  //     }
  //   });
  //   // connected[data.name] =  socket.id
  //   // connectedInverse[socket.id] = data.name
  //   // console.log(connected,"here");
  // });

  // Add the new socket to the connections list

  socket.on("eventEditStart", (event) => {
    draggingEventIds.add(event);
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("eventEditStartListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("eventEditStop", (event) => {
    draggingEventIds.delete(event);
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("eventEditStopListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("externalEventDrop", (event) => {
    console.log("externalEventDrop", event);
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("externalEventDropListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("deleteEvent", (event) => {
    console.log("delete", event);
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("deleteEventListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("updateEvent", (event) => {
    console.log("updateEvent", event);
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("updateEventListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("createEvent", (event) => {
    console.log("createEvent", event);
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("createEventListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("editEventStart", (event) => {
    console.log("editEventStart", event);
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("editEventStartListener", event); // Emit to all clients except the sender
      }
    });
  });

  socket.on("closeFormEvent", (event) => {
    console.log("closeFormEvent", event);
    connected.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("closeFormEventListener", event); // Emit to all clients except the sender
      }
    });
  });

  // socket.on("disconnect", () => {
  //     io.emit("left", { type: "left", user: connectedInverse[socket.id] });
  //     delete connected[connectedInverse[socket.id]]
  //     delete connectedInverse[socket.id]
  //     console.log(connected)
  // });

  // socket.on("logout", (data) => {
  //     io.emit("left", { type: "left", user: connectedInverse[socket.id] });
  //     delete connected[connectedInverse[socket.id]]
  //     delete connectedInverse[socket.id]
  //     console.log(connected)
  // })
};

export default DefaultSocket;
