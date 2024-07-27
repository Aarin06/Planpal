import {
  Output,
  EventEmitter,
  Component,
  ChangeDetectorRef,
  OnInit,
  ViewEncapsulation,
  Inject,
  PLATFORM_ID,
  ViewChild,
  AfterViewInit,
  Input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi as CalendarEventApi,
  DayCellContentArg,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { Draggable } from '@fullcalendar/interaction';
import { Event } from '../../classes/event';
import { io, Socket } from 'socket.io-client';
import { Itinerary } from '../../classes/itinerary';
import { DBEvent } from '../../classes/dbEvent';
import { EventService } from '../../services/event.service';
import { ItineraryService } from '../../services/itinerary.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { identity } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @Output() openCustomEventForm = new EventEmitter<boolean>();
  @Output() openEventPreviewForm = new EventEmitter<boolean>();
  @Output() calendarEventArg = new EventEmitter<any>();
  @Output() calendarEventClickArg = new EventEmitter<any>();
  @Input() initialItinerary: (Itinerary & { Events: DBEvent[] }) | null = null;
  @Input() itineraryId: number | null = null;
  private socket!: Socket;
  currentEvents = signal<CalendarEventApi[]>([]);
  calendarVisible: any;
  calendarOptions: any;
  externalEvents = [
    { title: 'Event 1' },
    { title: 'Event 2' },
    { title: 'Event 3' },
  ];

  editEventIds = new Set<string>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private changeDetector: ChangeDetectorRef,
    private eventApi: EventService,
    private itineraryApi: ItineraryService,
  ) {}

  ngOnInit(): void {
    this.calendarVisible = signal(true);
    this.calendarOptions = signal<CalendarOptions>({
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      initialView: 'dayGridMonth',
      initialEvents: this.createInitialEvents(),
      initialDate: this.initialItinerary?.startDate,
      validRange: {
        start: this.initialItinerary?.startDate,
        end: this.initialItinerary?.endDate,
      },
      fixedWeekCount: false,
      eventBackgroundColor: '#049be5',
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      droppable: true,
      dayCellClassNames: this.dayCellClassNames.bind(this), // Add this line

      drop: this.handleExternalDrop.bind(this),
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      eventContent: (eventInfo: any) => {
        return {
          html: `<b>${eventInfo.event.title + eventInfo.event.title}</b><i class="fas fa-coffee"></i>`,
        };
      },
      eventDragStart: this.handleEventEditStart.bind(this),
      eventDrop: this.handleEventEditStop.bind(this),
      eventResizeStart: this.handleEventEditStart.bind(this),
      eventResize: this.handleEventEditStop.bind(this),
      // eventDrop: this.handleEventDrop.bind(this),
    });

    // Initialize socket only if running in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSocket();
    }
  }

  dayCellClassNames(arg: DayCellContentArg) {
    const validRangeStart = new Date('0001-07-26'); // Replace with your start date
    const validRangeEnd = new Date('9999-12-31'); // Replace with your end date

    const date = arg.date;
    if (date >= validRangeStart && date <= validRangeEnd) {
      return ['valid-range'];
    }
    return [];
  }

  handleEventEditStart(info: any) {
    // this.draggingEventIds.add(info.event.id);
    // this.updateEventDraggable(info.event.id, false);
    console.log('Event started edit:', info.event);
    this.socket.emit('eventEditStart', info.event);
  }

  handleEventEditStop(info: any) {
    // this.draggingEventIds.delete(info.event.id);
    // this.updateEventDraggable(info.event.id, true);
    console.log('Event stopped edit:', info.event);
    this.socket.emit('eventEditStop', info.event);
  }

  initializeSocket(): void {
    this.socket = io('https://apis.planpal.tech');
    this.socket.on('eventEditStartListener', (event: any) => {
      // Handle socket events here
      this.updateEventDraggable(event.id, false);

      // this.updateEventDraggable(event.id, true);

      console.log('Event received from Socket.IO:', event);
    });
    this.socket.on('eventEditStopListener', (event: any) => {
      // Handle socket events here
      console.log('Event received from Socket.IO:', event);
      this.updateEventDraggable(event.id, true);

      this.updateCurrentEvents(event);
    });

    this.socket.on('externalEventDropListener', (event: any) => {
      // Handle socket events here
      console.log('externalEventDropListener Socket.IO:', event);
      this.updateCurrentEvents(event);
    });
    this.socket.on('deleteEventListener', (event: any) => {
      // Handle socket events here
      console.log('delete Socket.IO:', event);

      this.deleteEvent(event);
    });

    this.socket.on('updateEventListener', (event: any) => {
      // Handle socket events here
      console.log('updateEvent Socket.IO:', event);

      this.updateEventDraggable(event.id, true);
      this.updateCurrentEvents(event);
    });

    this.socket.on('closeFormEventListener', (event: any) => {
      this.updateEventDraggable(event.id, true);
    });

    this.socket.on('createEventListener', (event: any) => {
      this.updateCurrentEvents(event);
    });

    this.socket.on('editEventStartListener', (event: any) => {
      // Handle socket events here
      this.updateEventDraggable(event.id, false);
      console.log('editng event should be blocked', event);
    });
  }

  updateEventDraggable(eventId: string, draggable: boolean) {
    let calendarApi = this.calendarComponent.getApi();
    const calendarEvent = calendarApi.getEventById(eventId);

    if (calendarEvent) {
      calendarEvent.setProp('startEditable', draggable);
      // Change the background color and border color of the event when it becomes draggable
      if (draggable) {
        calendarEvent.setProp('backgroundColor', '#049be5 ');
        calendarEvent.setProp('borderColor', '#049be5 ');
        this.editEventIds.delete(eventId);
      } else {
        calendarEvent.setProp('backgroundColor', 'grey');
        calendarEvent.setProp('borderColor', 'grey');
        this.editEventIds.add(eventId);
      }

      this.changeDetector.detectChanges();
    } else {
      console.warn(`Event with ID ${eventId} not found in the calendar.`);
    }
  }

  createInitialEvents(): Event[] {
    if (this.initialItinerary && this.initialItinerary.Events) {
      return this.initialItinerary.Events.map((event) => {
        return {
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: event.allDay,
          extendedProps: {
            location: event.location,
          },
        };
      });
    }
    return [];
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      let draggable =
        document.getElementById('external-events') ||
        document.createElement('div');
      new Draggable(draggable, {
        itemSelector: '.fc-event',
        eventData: (eventEl) => {
          const dataProps = eventEl.getAttribute('data-props');
          const dataPropsObject = JSON.parse(dataProps ? dataProps : '');
          return dataPropsObject;
        },
      });
    }
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    console.log(selectInfo);
    this.calendarEventArg.emit({ selectInfo, socket: this.socket });
    this.openCustomEventForm.emit(true);
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (this.editEventIds.has(clickInfo.event.id)) {
      return;
    }
    this.calendarEventClickArg.emit({ clickInfo, socket: this.socket });
    this.openEventPreviewForm.emit(true);
    this.socket.emit('editEventStart', clickInfo.event);
  }

  handleEvents(events: CalendarEventApi[]) {
    console.log('handling events');
    if (events.length > 0) {
      
      events.forEach((event) => {
        const newEvent: Event = {
          title: event.title,
          start: event.startStr,
          end: event.endStr,
          allDay: event.allDay,
          extendedProps: event.extendedProps,
        };
        this.eventApi.getEvent(+event.id).subscribe({
          next: () => {
            console.log(newEvent);
            this.eventApi.updateEvent(+event.id, newEvent).subscribe({
              next: () => {
                
              },
              error(err) {
                console.log(err);
              },
            });
          },
          error: (err) => {
            if (err.status === 404 && this.itineraryId) {
              this.itineraryApi
                .createEvent(this.itineraryId, newEvent)
                .subscribe({
                  next: (value) => {
                    event.setProp('id', value.id);
                    let eventSend = {
                      id: value.id,
                      title: newEvent.title,
                      start: newEvent.start,
                      end: newEvent.end,
                      allDay: newEvent.allDay,
                      extendedProps: newEvent.extendedProps,
                    };
                    console.log(eventSend);
                    this.socket.emit('externalEventDrop', eventSend);
                  },
                  error(err) {
                    console.log(err);
                  },
                });
            }
          },
        });
      });
    }
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  handleExternalDrop(info: any) {
    const title = info.draggedEl.innerText;
    const calendarApi = info.view.calendar;
    console.log(info);
    const event = {
      id: createEventId(),
      title: title,
      start: info.startStr,
      end: info.endStr,
      allDay: info.allDay,
    };

    calendarApi.addEvent(event);

    info.draggedEl.parentNode.removeChild(info.draggedEl);
  }

  deleteEvent(event: any) {
    let calendarApi = this.calendarComponent.getApi();
    const calendarEvent = calendarApi.getEventById(event.id);
    if (calendarEvent) {
      calendarEvent.remove();
    } else {
      console.warn(`Event with ID ${event.id} not found in the calendar.`);
    }
  }

  updateCurrentEvents(event: any) {
    console.log('Event received from Socket.IO:', event);

    // Assuming event is an updated event object with new details
    const updatedEvent = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      extendedProps: event.extendedProps,
    };

    // If the event is not an all-day event and the end time is undefined, set end time to one hour after the start
    if (!updatedEvent.allDay && !updatedEvent.end) {
      const input = updatedEvent.start;

      updatedEvent.end = input.replace(
        /T(\d{2}):(\d{2}):(\d{2})/,
        (match: any, hour: any, minute: any, second: any) => {
          // Increment the hour
          let incrementedHour = parseInt(hour, 10) + 1;
          // Format hour with leading zero if needed
          let sIncrementedHour = incrementedHour.toString().padStart(2, '0');
          // Return the new time string
          return `T${sIncrementedHour}:${minute}:${second}`;
        },
      );
    }

    console.log(updatedEvent);

    // Find the corresponding event in the calendar and update it
    let calendarApi = this.calendarComponent.getApi();
    const calendarEvent = calendarApi.getEventById(updatedEvent.id);

    if (calendarEvent) {
      calendarEvent.setProp('title', updatedEvent.title);
      calendarEvent.setStart(updatedEvent.start);
      calendarEvent.setEnd(updatedEvent.end);
      calendarEvent.setAllDay(updatedEvent.allDay);
      calendarEvent.setExtendedProp(
        'location',
        updatedEvent.extendedProps.location,
      );
      console.log('Event updated:', updatedEvent);

      // Refresh the calendar to reflect the changes
      this.changeDetector.detectChanges();
    } else {
      console.log('Event updated:', updatedEvent);

      calendarApi.addEvent(updatedEvent);
      console.warn(
        `Event with ID ${updatedEvent.id} not found in the calendar.`,
      );
    }
    console.log("save this",calendarApi.getEvents());
    this.handleEvents(calendarApi.getEvents());
  }
}
