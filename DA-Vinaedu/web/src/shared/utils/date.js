import moment from 'moment';

moment.locale('vi');

/**
 *
 * @param {*} date - Date, Timestamp, v.v
 * @returns
 */
export const formatDate = (date, format = 'DD-MM-YYYY', dateStr = false) => {
  const dateFormat = moment(date).format(format);
  if (dateStr) return dateFormat;
  const today = moment().format(format);
  if (today == dateFormat) return 'Hôm nay';
  return dateFormat;
};

/**
 *
 * @param {*} date - Date, Timestamp, v.v
 * @returns
 */
export const formatTime = date => {
  return moment(date).format('HH:mm');
};

export const dateToTimestamp = date => {
  return moment(date).valueOf();
};

export const formatDuration = duration => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;
  return hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0',
      )}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
