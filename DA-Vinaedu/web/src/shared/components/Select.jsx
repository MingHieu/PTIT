import { FaSolidAngleDown } from 'solid-icons/fa';

/**
 *
 * @param {HTMLSelectElement} props
 * @returns
 */
export const Select = props => {
  return (
    <div
      class={
        'relative flex items-center border border-gray-300 rounded ' +
        props.class
      }>
      <select
        class="w-full border-none appearance-none outline-none px-2 py-1 pr-8 bg-transparent z-20 cursor-pointer"
        value={props.value}
        onChange={props.onChange}>
        {props.children}
      </select>
      <FaSolidAngleDown class="absolute right-2 z-10" />
    </div>
  );
};
