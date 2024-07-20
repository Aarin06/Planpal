import { Output, Input, EventEmitter, Component, signal, ChangeDetectorRef, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi as CalendarEventApi} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { Draggable } from '@fullcalendar/interaction';
import { Event } from '../../classes/event';

import { Itinerary } from '../../classes/itinerary';
import { DBEvent } from '../../classes/dbEvent';
import { EventService } from '../../services/event.service';
import { ItineraryService } from '../../services/itinerary.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit, AfterViewInit {
  // @ViewChild('draggable', { static: true }) draggable!: ElementRef;
  @Output() openCustomEventForm = new EventEmitter<boolean>();
  @Output() openEventPreviewForm = new EventEmitter<boolean>();
  @Output() calendarEventArg = new EventEmitter<any>();
  @Output() calendarEventClickArg = new EventEmitter<any>();
  @Input () initialItinerary: Itinerary & {Events: DBEvent[]} | null = null
  @Input () itineraryId: number | null = null
  
  calendarVisible: any
  calendarOptions: any
  
  externalEvents = [
    { title: 'Event 1' },
    { title: 'Event 2' },
    { title: 'Event 3' }
  ];

  constructor(private changeDetector: ChangeDetectorRef, private eventApi: EventService, private itineraryApi: ItineraryService) {}

  ngOnInit(): void {
    this.calendarVisible = signal(true);
    this.calendarOptions = signal<CalendarOptions>({
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      initialView: 'dayGridMonth',
      initialEvents: this.createInitialEvents(),
      initialDate: this.initialItinerary?.startDate,
      fixedWeekCount: false,
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      droppable: true, // Enable external event dropping
      drop: this.handleExternalDrop.bind(this), // Handle external drop
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      eventContent: (eventInfo) => {
        // Custom HTML content for each event
        return { html: `<b>${eventInfo.event.title + eventInfo.event.title}</b><i class="fas fa-coffee"></i>` };
      }
      
      // dayCellContent: (e) => {
      //   console.log(e)
      //   // Check if the cell's date matches the initialDate
      //   if (e['dateStr'] === this.initialDate.toISOString().slice(0, 10)) {
      //     // Apply custom styling for matching date
      //     e.dayNumberText = `<div style="color: red;">${e.dayNumberText}</div>`; // Example: Change the day number color to red
      //     // For more complex styling, consider adding a class and defining the styles in your component's CSS
      //   }
      //   return e
      // }
    });
  }

  createInitialEvents() : Event[] {
    if (this.initialItinerary && this.initialItinerary.Events){
      
      return this.initialItinerary.Events.map((event) => {
        return {
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: event.allDay,
          extendedProps: {
            location: event.location
          }
        }
      })
    }
    return []
  }


  currentEvents = signal<CalendarEventApi[]>([]);

  ngAfterViewInit(): void {
    let draggable = document.getElementById('external-events') || document.createElement("div");
    new Draggable(draggable, {
      itemSelector: '.fc-event',
      eventData: (eventEl) => {
        const dataProps = eventEl.getAttribute('data-props') ;
        const dataPropsObject = JSON.parse(dataProps ? dataProps : "");
        return dataPropsObject;
      }
    });
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool: boolean) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options: any) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.calendarEventArg.emit(selectInfo)
    this.openCustomEventForm.emit(true);
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.calendarEventClickArg.emit(clickInfo)
    this.openEventPreviewForm.emit(true);
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   console.log("deleting event " + clickInfo.event.id)
    //   this.eventApi.deleteEvent(+clickInfo.event.id).subscribe(
    //     {
    //       next() {
    //         clickInfo.event.remove();
    //       },
    //       error(err) {
    //           console.log(err)
    //       },
    //     }
    //   )
      
    // }
  }

  handleEvents(events: CalendarEventApi[]) {
    if (events.length > 0){
      events.forEach((event) => {
        const newEvent: Event = {
          title: event.title,
          start: event.startStr,
          end: event.endStr,
          allDay: event.allDay,
          extendedProps: event.extendedProps
        }
        this.eventApi.getEvent(+event.id).subscribe({
          next: () => {
            this.eventApi.updateEvent(+event.id, newEvent).subscribe({
              error(err) {
                console.log(err)
              },
            })
          },error: (err) => {
            if (err.status === 404 && this.itineraryId){
              this.itineraryApi.createEvent(this.itineraryId, newEvent).subscribe({
                next: (value) => {
                  event.setProp("id", value.id)
                },
                error(err) {
                  console.log(err)
                },
              })
            }
          },
        }
        )
        
      })
      
    }
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
    
  }

  handleExternalDrop(info: any) {
    const title = info.draggedEl.innerText;
    const calendarApi = info.view.calendar;
  
    // Add the event to the calendar
    calendarApi.addEvent({
      id: createEventId(),
      title,
      start: info.startStr,
      end: info.endStr,
      allDay: info.allDay
    });
  
    // Remove the dragged element from the external events list
    info.draggedEl.parentNode.removeChild(info.draggedEl);    
  }
  
}
