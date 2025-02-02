import api from '@/core/api';
import { formatDate } from '@/shared/utils';
import { A } from '@solidjs/router';
import moment from 'moment';
import { FaRegularClock } from 'solid-icons/fa';
import {
  RiArrowsArrowLeftSLine,
  RiArrowsArrowRightSLine,
} from 'solid-icons/ri';
import { For, Show, createEffect, createSignal } from 'solid-js';

const getTimetable = async timestamp => {
  try {
    const data = await api.get('lesson/timetable', { params: { timestamp } });
    return data;
  } catch (error) {
    return [];
  }
};

function Timetable() {
  const weekdays = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'];
  const [currentMonth, setCurrentMonth] = createSignal(moment());
  const [days, setDays] = createSignal([]);
  const [selectedDate, setSelectedDate] = createSignal(moment());
  const [events, setEvents] = createSignal([]);
  const eventsCache = {};

  const loadEventsForMonth = async timestamp => {
    if (eventsCache[timestamp]) {
      return;
    }
    try {
      const data = await getTimetable(timestamp);
      eventsCache[timestamp] = true;
      setEvents(prev => [...prev, ...data]);
    } catch (error) {}
  };

  createEffect(() => {
    const startOfMonth = currentMonth().startOf('month');
    const endOfMonth = currentMonth().endOf('month');
    const newDays = [];

    let week = [];
    let dayOfWeek = (startOfMonth.day() + 6) % 7;

    for (let i = 0; i < dayOfWeek; i++) {
      week.push('');
    }

    for (let date = 1; date <= endOfMonth.date(); date++) {
      week.push(date.toString());
      if (week.length === 7) {
        newDays.push(week);
        week = [];
      }
    }

    if (week.length) {
      newDays.push(week);
    }

    setDays(newDays);

    loadEventsForMonth(startOfMonth.valueOf());
  });

  const handleDateClick = day => {
    if (day) {
      setSelectedDate(
        moment(
          `${currentMonth().year()}-${currentMonth().month() + 1}-${day}`,
          'YYYY-M-D',
        ),
      );
    }
  };

  const getEventsForDate = date => {
    const startOfDay = moment(date).startOf('day');
    const endOfDay = moment(date).endOf('day');

    return events().filter(e =>
      moment(e.start).isBetween(startOfDay, endOfDay, null, '[]'),
    );
  };

  const displayEvents = () => getEventsForDate(selectedDate());

  const handlePrevMonth = () => {
    setCurrentMonth(prev => moment(prev).subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => moment(prev).add(1, 'month'));
  };

  const DateItem = ({ day }) => {
    const isToday = () =>
      day == moment().date() &&
      currentMonth().month() == moment().month() &&
      currentMonth().year() == moment().year();
    const isSelected = () =>
      selectedDate() &&
      day == selectedDate().date() &&
      currentMonth().month() == selectedDate().month() &&
      currentMonth().year() == selectedDate().year();
    const eventsForDate = () =>
      getEventsForDate(
        moment(
          `${currentMonth().year()}-${currentMonth().month() + 1}-${day}`,
          'YYYY-M-D',
        ),
      );
    return (
      <div class="text-center border-b border-gray-300 py-4">
        <span
          onClick={() => handleDateClick(day)}
          class={`inline-block w-10 h-10 rounded-full leading-10 transition duration-200 cursor-pointer ${
            isToday() && !isSelected() ? 'bg-red-50 text-red-600' : ''
          }  ${isSelected() ? 'bg-blue-50 text-blue-600' : ''}`}>
          {day}
        </span>
        <Show when={eventsForDate().length}>
          <span class="block w-2 h-2 rounded-full bg-green-500 mx-auto mt-1"></span>
        </Show>
      </div>
    );
  };

  const EventItem = ({ event }) => {
    const startTime = moment(event.start).format('HH:mm');
    const endTime = moment(event.end).format('HH:mm');

    return (
      <A
        href={`/classroom/${event.classroom.id}`}
        class="max-w-lg p-4 block bg-white rounded-lg border border-gray-300 hover:border-blue-500 border-l-8 border-l-blue-500">
        <h3 className="font-semibold text-xl text-blue-600 mb-2">
          {event.classroom.name}
        </h3>
        <div class="flex items-center space-x-1 text-gray-500 text-sm">
          <FaRegularClock />
          <p>
            {startTime} - {endTime}
          </p>
        </div>
      </A>
    );
  };

  return (
    <div>
      <div class="flex items-center space-x-4 mb-4">
        <div class="text-2xl font-bold text-gray-900">
          {`Tháng ${currentMonth().month() + 1} năm ${currentMonth().year()}`}
        </div>
        <button
          onClick={handlePrevMonth}
          class="text-blue-500 hover:text-blue-700">
          <RiArrowsArrowLeftSLine class="w-7 h-7" />
        </button>
        <button
          onClick={handleNextMonth}
          class="text-blue-500 hover:text-blue-700">
          <RiArrowsArrowRightSLine class="w-7 h-7" />
        </button>
      </div>

      <div class="grid grid-cols-7 text-gray-700 font-medium">
        <For each={weekdays}>
          {weekDayName => (
            <div class="text-center py-2 border-b border-gray-300">
              {weekDayName}
            </div>
          )}
        </For>
      </div>

      <For each={days()}>
        {week => (
          <div class="grid grid-cols-7">
            <For each={week}>{day => <DateItem day={day} />}</For>
          </div>
        )}
      </For>

      <div class="mt-6 text-gray-700 space-y-4">
        <h3 class="text-lg font-semibold">
          Sự kiện | {formatDate(selectedDate())}
        </h3>
        <Show
          when={displayEvents().length}
          fallback={<p>Không có sự kiện nào.</p>}>
          <div class="space-y-4">
            <For each={displayEvents()}>
              {event => <EventItem event={event} />}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default Timetable;
