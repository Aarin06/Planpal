import { Output, Input, EventEmitter, Component, signal, ChangeDetectorRef, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { Draggable } from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit, AfterViewInit {
  // @ViewChild('draggable', { static: true }) draggable!: ElementRef;
  @Output() openCustomEventForm = new EventEmitter<boolean>();
  @Output() calendarEventArg = new EventEmitter<any>();
  @Input () initialDate: Date = new Date()

  calendarVisible: any
  calendarOptions: any
  
  externalEvents = [
    { title: 'Event 1' },
    { title: 'Event 2' },
    { title: 'Event 3' }
  ];

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
      initialEvents: INITIAL_EVENTS,
      initialDate: this.initialDate,
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


  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    let draggable = document.getElementById('external-events') || document.createElement("div");

    new Draggable(draggable, {
      itemSelector: '.fc-event',
      eventData: (eventEl) => {
        return {
          title: eventEl.innerText
        };
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
    console.log(typeof this.initialDate)
    console.log(this.initialDate)
    console.log(new Date(2024, 11, 10))
    this.calendarEventArg.emit(selectInfo)
    this.openCustomEventForm.emit(true);
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
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
