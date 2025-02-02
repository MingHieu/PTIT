const gradients = [
  'linear-gradient(to right, #ff7e5f, #feb47b)', // Sunset
  'linear-gradient(to right, #6a11cb, #2575fc)', // Purple to Blue
  'linear-gradient(to right, #ff5f6d, #ffc371)', // Coral
  'linear-gradient(to right, #00c6ff, #0072ff)', // Aqua to Blue
  'linear-gradient(to right, #ff9966, #ff5e62)', // Peach
  'linear-gradient(to right, #00c6ff, #f0e130)', // Aqua to Yellow
  'linear-gradient(to right, #4facfe, #00f2fe)', // Blue to Aqua
  'linear-gradient(to right, #00d2ff, #928dab)', // Light Blue to Gray
  'linear-gradient(to right, #00b09b, #96c93d)', // Greenish
  'linear-gradient(to right, #ff512f, #dd2476)', // Red to Pink
  'linear-gradient(to right, #c3dafe, #e9d8fd)',
];

export const getRandomGradient = () => {
  const randomIndex = Math.floor(Math.random() * gradients.length);
  return gradients[randomIndex];
};
